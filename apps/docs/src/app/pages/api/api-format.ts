import { ApiMember, ApiSignature, ApiSymbol } from '../../shared/api.model';

function escape(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Escapes a type string and links every identifier that is a documented symbol. */
export function linkTypes(type: string, byName: Map<string, ApiSymbol>): string {
  return escape(type).replace(/\b[A-Za-z_$][\w$]*\b/g, (word) => {
    const target = byName.get(word);
    return target ? `<a href="/api/${target.package}/${target.slug}">${word}</a>` : word;
  });
}

export function signatureText(name: string, sig: ApiSignature, isConstructor = false): string {
  const tps = sig.typeParameters.length
    ? `<${sig.typeParameters.map((t) => t.name + (t.constraint ? ` extends ${t.constraint}` : '')).join(', ')}>`
    : '';
  const params = sig.parameters
    .map((p) => `${p.rest ? '...' : ''}${p.name}${p.optional ? '?' : ''}: ${p.type}`)
    .join(', ');
  return isConstructor ? `new ${name}(${params})` : `${name}${tps}(${params}): ${sig.returns}`;
}

export function memberSignature(member: ApiMember): string {
  const mods = [member.static ? 'static' : '', member.protected ? 'protected' : '', member.readonly ? 'readonly' : '']
    .filter(Boolean)
    .join(' ');
  const prefix = mods ? mods + ' ' : '';
  if (member.signatures?.length) {
    return member.signatures.map((s) => prefix + signatureText(member.name, s, member.kind === 'constructor')).join('\n');
  }
  return `${prefix}${member.name}${member.optional ? '?' : ''}: ${member.type ?? 'unknown'}`;
}

export function symbolDeclaration(symbol: ApiSymbol): string {
  const tps = symbol.typeParameters?.length
    ? `<${symbol.typeParameters
        .map((t) => t.name + (t.constraint ? ` extends ${t.constraint}` : '') + (t.default ? ` = ${t.default}` : ''))
        .join(', ')}>`
    : '';
  switch (symbol.kind) {
    case 'class':
    case 'interface': {
      const ext = symbol.extends?.length ? ` extends ${symbol.extends.join(', ')}` : '';
      const impl = symbol.implements?.length ? ` implements ${symbol.implements.join(', ')}` : '';
      return `${symbol.kind} ${symbol.name}${tps}${ext}${impl}`;
    }
    case 'type':
      return `type ${symbol.name}${tps} = ${symbol.type}`;
    case 'function':
      return (symbol.signatures ?? []).map((s) => 'function ' + signatureText(symbol.name, s)).join('\n');
    case 'const':
      return `const ${symbol.name}: ${symbol.type}`;
    default:
      return symbol.name;
  }
}

export type SymbolGroup = { title: string; symbols: ApiSymbol[] };

/** Groups a package's symbols into the categories shown on the API index. */
export function groupSymbols(symbols: ApiSymbol[]): SymbolGroup[] {
  const groups: Record<string, ApiSymbol[]> = {
    'Form item components': [],
    'Services': [],
    'Modules and registration': [],
    'Rendering': [],
    'Base classes': [],
    'Configuration interfaces': [],
    'Types': [],
    'Functions and tokens': [],
  };
  for (const s of symbols) {
    if (s.registryKey) groups['Form item components'].push(s);
    else if (s.decorator === 'Injectable') groups['Services'].push(s);
    else if (s.decorator === 'NgModule') groups['Modules and registration'].push(s);
    else if (s.decorator === 'Component' || (s.decorator === 'Directive' && s.selector)) groups['Rendering'].push(s);
    else if (s.kind === 'class') groups['Base classes'].push(s);
    else if (s.kind === 'interface') groups['Configuration interfaces'].push(s);
    else if (s.kind === 'type') groups['Types'].push(s);
    else groups['Functions and tokens'].push(s);
  }
  return Object.entries(groups)
    .filter(([, list]) => list.length)
    .map(([title, list]) => ({ title, symbols: list }));
}
