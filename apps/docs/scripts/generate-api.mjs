#!/usr/bin/env node
/**
 * Generates the API reference data consumed by the docs site.
 *
 * TypeDoc reads the public entry point of each package (with the TSDoc
 * comments in the library source) and this script flattens the result into a
 * small JSON file that the Angular docs app renders at /api.
 *
 * Usage (from the workspace root):
 *   node apps/docs/scripts/generate-api.mjs
 */
import { Application, OptionDefaults, ReflectionKind, TSConfigReader } from 'typedoc';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../../..');
const outFile = resolve(root, 'apps/docs/src/generated/api.json');
const repoUrl = 'https://github.com/BryanGWalsh/NgSimplicityForms/blob/main';

const packages = [
  {
    name: '@ng-simplicity/forms-core',
    slug: 'forms-core',
    entry: 'libs/forms-core/src/public_api.ts',
    description:
      'The form engine: the service API, component registry, configuration models, base classes and the structural components (group, section, row, column, array).',
  },
  {
    name: '@ng-simplicity/forms-bootstrap',
    slug: 'forms-bootstrap',
    entry: 'libs/forms-bootstrap/src/public_api.ts',
    description: 'Bootstrap 5 styled input components and the registration helper for them.',
  },
  {
    name: '@ng-simplicity/forms-material',
    slug: 'forms-material',
    entry: 'libs/forms-material/src/public_api.ts',
    description: 'Angular Material styled input components and the registration helper for them.',
  },
  {
    name: '@ng-simplicity/forms-tailwind',
    slug: 'forms-tailwind',
    entry: 'libs/forms-tailwind/src/public_api.ts',
    description: 'Tailwind CSS styled input components, the class configuration token and the registration helper.',
  },
];

const app = await Application.bootstrap(
  {
    entryPoints: packages.map((p) => resolve(root, p.entry)),
    tsconfig: resolve(root, 'apps/docs/tsconfig.typedoc.json'),
    excludePrivate: true,
    excludeExternals: true,
    excludeInternal: true,
    skipErrorChecking: true,
    modifierTags: [...OptionDefaults.modifierTags, '@notImplemented'],
    logLevel: 'Warn',
  },
  [new TSConfigReader()]
);

const project = await app.convert();
if (!project) {
  console.error('TypeDoc failed to convert the project.');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const kindName = (kind) => {
  switch (kind) {
    case ReflectionKind.Class:
      return 'class';
    case ReflectionKind.Interface:
      return 'interface';
    case ReflectionKind.TypeAlias:
      return 'type';
    case ReflectionKind.Function:
      return 'function';
    case ReflectionKind.Variable:
      return 'const';
    case ReflectionKind.Enum:
      return 'enum';
    case ReflectionKind.Property:
      return 'property';
    case ReflectionKind.Method:
      return 'method';
    case ReflectionKind.Accessor:
      return 'accessor';
    case ReflectionKind.Constructor:
      return 'constructor';
    default:
      return ReflectionKind[kind]?.toLowerCase() ?? 'unknown';
  }
};

const commentText = (parts) =>
  (parts ?? [])
    .map((p) => {
      if (p.kind === 'inline-tag') {
        // {@link Foo} -> `Foo`
        return '`' + (p.text || '').trim() + '`';
      }
      return p.text;
    })
    .join('')
    .trim();

function readComment(comment) {
  if (!comment) return {};
  const result = {};
  const summary = commentText(comment.summary);
  if (summary) result.summary = summary;
  for (const tag of comment.blockTags ?? []) {
    const text = commentText(tag.content);
    switch (tag.tag) {
      case '@remarks':
        result.remarks = text;
        break;
      case '@example':
        (result.examples ??= []).push(text);
        break;
      case '@defaultValue':
      case '@default':
        result.defaultValue = text.replace(/^```\w*\n?|\n?```$/g, '').trim();
        break;
      case '@deprecated':
        result.deprecated = text || true;
        break;
      case '@see':
        (result.see ??= []).push(text);
        break;
      default:
        break;
    }
  }
  if (comment.modifierTags?.has('@experimental')) result.experimental = true;
  if (comment.modifierTags?.has('@notImplemented')) result.notImplemented = true;
  return result;
}

function source(refl) {
  const src = refl.sources?.[0];
  if (!src) return undefined;
  const file = src.fullFileName ? src.fullFileName.replace(root + '/', '') : src.fileName;
  return { file, line: src.line, url: `${repoUrl}/${file}#L${src.line}` };
}

/** Render a TypeDoc type into a TypeScript-like string. */
function typeToString(type, depth = 0) {
  if (!type) return 'unknown';
  const t = (x) => typeToString(x, depth + 1);
  switch (type.type) {
    case 'intrinsic':
      return type.name;
    case 'literal':
      if (type.value === null) return 'null';
      if (typeof type.value === 'string') return `'${type.value}'`;
      if (typeof type.value === 'object') return `${type.value.negative ? '-' : ''}${type.value.value}n`;
      return String(type.value);
    case 'reference': {
      const args = type.typeArguments?.length ? `<${type.typeArguments.map(t).join(', ')}>` : '';
      return `${type.name}${args}`;
    }
    case 'array': {
      const inner = t(type.elementType);
      return /[|&\s]/.test(inner) ? `Array<${inner}>` : `${inner}[]`;
    }
    case 'union':
      return type.types.map(t).join(' | ');
    case 'intersection':
      return type.types.map(t).join(' & ');
    case 'tuple':
      return `[${(type.elements ?? []).map(t).join(', ')}]`;
    case 'namedTupleMember':
      return `${type.name}${type.isOptional ? '?' : ''}: ${t(type.element)}`;
    case 'optional':
      return `${t(type.elementType)}?`;
    case 'rest':
      return `...${t(type.elementType)}`;
    case 'query':
      return `typeof ${t(type.queryType)}`;
    case 'typeOperator':
      return `${type.operator} ${t(type.target)}`;
    case 'indexedAccess':
      return `${t(type.objectType)}[${t(type.indexType)}]`;
    case 'conditional':
      return `${t(type.checkType)} extends ${t(type.extendsType)} ? ${t(type.trueType)} : ${t(type.falseType)}`;
    case 'predicate':
      return type.targetType ? `${type.name} is ${t(type.targetType)}` : `asserts ${type.name}`;
    case 'templateLiteral':
      return '`' + type.head + type.tail.map(([ty, s]) => '${' + t(ty) + '}' + s).join('') + '`';
    case 'mapped':
      return `{ [${type.parameter} in ${t(type.parameterType)}]: ${t(type.templateType)} }`;
    case 'reflection': {
      const decl = type.declaration;
      if (decl.signatures?.length) {
        const sig = decl.signatures[0];
        const params = (sig.parameters ?? [])
          .map((p) => `${p.flags.isRest ? '...' : ''}${p.name}${p.flags.isOptional ? '?' : ''}: ${t(p.type)}`)
          .join(', ');
        return `(${params}) => ${t(sig.type)}`;
      }
      if (decl.indexSignatures?.length) {
        const s = decl.indexSignatures[0];
        const p = s.parameters?.[0];
        return `{ [${p?.name ?? 'key'}: ${t(p?.type)}]: ${t(s.type)} }`;
      }
      if (decl.children?.length) {
        if (depth > 2) return '{ … }';
        return `{ ${decl.children
          .map((c) => `${c.name}${c.flags.isOptional ? '?' : ''}: ${t(c.type ?? c.signatures?.[0]?.type)}`)
          .join('; ')} }`;
      }
      return '{}';
    }
    case 'unknown':
      return type.name;
    default:
      return type.toString?.() ?? 'unknown';
  }
}

function signature(sig) {
  return {
    ...readComment(sig.comment),
    typeParameters: (sig.typeParameters ?? []).map((tp) => typeParam(tp)),
    parameters: (sig.parameters ?? []).map((p) => ({
      name: p.name,
      type: typeToString(p.type),
      optional: p.flags.isOptional || p.defaultValue !== undefined || undefined,
      rest: p.flags.isRest || undefined,
      defaultValue: p.defaultValue,
      ...readComment(p.comment),
    })),
    returns: typeToString(sig.type),
  };
}

function typeParam(tp) {
  return {
    name: tp.name,
    constraint: tp.type ? typeToString(tp.type) : undefined,
    default: tp.default ? typeToString(tp.default) : undefined,
  };
}

function member(m) {
  const kind = kindName(m.kind);
  const comment = m.comment ?? m.signatures?.[0]?.comment ?? m.getSignature?.comment;
  const out = {
    name: m.name,
    kind,
    static: m.flags.isStatic || undefined,
    optional: m.flags.isOptional || undefined,
    readonly: m.flags.isReadonly || (m.kind === ReflectionKind.Accessor && !m.setSignature) || undefined,
    protected: m.flags.isProtected || undefined,
    abstract: m.flags.isAbstract || undefined,
    inheritedFrom: m.inheritedFrom ? m.inheritedFrom.name.split('.')[0] : undefined,
    ...readComment(comment),
  };
  if (m.kind === ReflectionKind.Property || m.kind === ReflectionKind.Variable) {
    out.type = typeToString(m.type);
    if (m.defaultValue && m.defaultValue !== '...') out.initializer = m.defaultValue;
  } else if (m.kind === ReflectionKind.Accessor) {
    out.type = typeToString(m.getSignature?.type ?? m.setSignature?.parameters?.[0]?.type);
  } else if (m.signatures) {
    out.signatures = m.signatures.map(signature);
  }
  return out;
}

const memberOrder = {
  constructor: 0,
  property: 1,
  accessor: 2,
  method: 3,
};

function symbol(refl, pkg, angularMeta) {
  const kind = kindName(refl.kind);
  const comment = refl.comment ?? refl.signatures?.[0]?.comment;
  const out = {
    name: refl.name,
    slug: refl.name,
    kind,
    package: pkg.slug,
    source: source(refl),
    ...readComment(comment),
  };
  if (refl.typeParameters?.length) out.typeParameters = refl.typeParameters.map(typeParam);
  if (refl.extendedTypes?.length) out.extends = refl.extendedTypes.map((t) => typeToString(t));
  if (refl.implementedTypes?.length) out.implements = refl.implementedTypes.map((t) => typeToString(t));
  if (refl.extendedBy?.length) out.extendedBy = refl.extendedBy.map((t) => t.name);

  if (kind === 'class' || kind === 'interface') {
    out.members = (refl.children ?? [])
      .filter((c) => !c.flags.isPrivate && !c.name.startsWith('#'))
      .map((c) => member(c))
      .sort((a, b) => {
        if (!!a.static !== !!b.static) return a.static ? -1 : 1;
        return (memberOrder[a.kind] ?? 9) - (memberOrder[b.kind] ?? 9);
      });
    const meta = angularMeta(refl);
    if (meta) Object.assign(out, meta);
  } else if (kind === 'type') {
    out.type = typeToString(refl.type);
  } else if (kind === 'function') {
    out.signatures = (refl.signatures ?? []).map(signature);
  } else if (kind === 'const') {
    out.type = typeToString(refl.type);
    if (refl.defaultValue && refl.defaultValue !== '...') out.initializer = refl.defaultValue;
  }
  return out;
}

/** Read Angular decorator metadata (selector, providers) straight from the source file. */
const fileCache = new Map();
function angularMeta(refl) {
  const src = refl.sources?.[0];
  if (!src?.fullFileName) return undefined;
  let text = fileCache.get(src.fullFileName);
  if (!text) {
    text = readFileSync(src.fullFileName, 'utf8');
    fileCache.set(src.fullFileName, text);
  }
  const classIdx = text.indexOf(`class ${refl.name}`);
  if (classIdx < 0) return undefined;
  const before = text.slice(0, classIdx);
  const decoMatch = [...before.matchAll(/@(Component|Directive|Injectable|NgModule)\(/g)].pop();
  if (!decoMatch) return undefined;
  const decoText = before.slice(decoMatch.index);
  const meta = { decorator: decoMatch[1] };
  const selector = decoText.match(/selector:\s*['"`]([^'"`]+)['"`]/);
  if (selector && meta.decorator !== 'Injectable') meta.selector = selector[1];
  const providedIn = decoText.match(/providedIn:\s*['"`]([^'"`]+)['"`]/);
  if (providedIn) meta.providedIn = providedIn[1];
  const key = refl.children?.find((c) => c.name === 'key' && c.flags.isStatic);
  if (key?.defaultValue) meta.registryKey = key.defaultValue.replace(/^['"`]|['"`]$/g, '');
  return meta;
}

// ---------------------------------------------------------------------------
// Build output
// ---------------------------------------------------------------------------

const modules = project.children ?? [];
const output = { generatedAt: new Date().toISOString(), packages: [] };

for (const pkg of packages) {
  const mod =
    modules.find((m) => m.sources?.[0]?.fullFileName?.includes(pkg.entry)) ??
    modules.find((m) => m.name.includes(pkg.slug));
  if (!mod) {
    console.error(`Could not find TypeDoc module for ${pkg.name}`);
    process.exit(1);
  }
  const symbols = (mod.children ?? [])
    .filter((c) => c.kind !== ReflectionKind.Reference)
    .map((c) => symbol(c, pkg, angularMeta))
    .sort((a, b) => a.name.localeCompare(b.name));
  output.packages.push({ name: pkg.name, slug: pkg.slug, description: pkg.description, symbols });
}

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, JSON.stringify(output, null, 1));
const count = output.packages.reduce((n, p) => n + p.symbols.length, 0);
console.log(`API reference: wrote ${count} symbols to ${outFile.replace(root + '/', '')}`);
