/** Shape of src/generated/api.json, written by scripts/generate-api.mjs. */
export interface ApiDocComment {
  summary?: string;
  remarks?: string;
  examples?: string[];
  defaultValue?: string;
  deprecated?: string | boolean;
  experimental?: boolean;
  notImplemented?: boolean;
  see?: string[];
}

export interface ApiTypeParameter {
  name: string;
  constraint?: string;
  default?: string;
}

export interface ApiParameter extends ApiDocComment {
  name: string;
  type: string;
  optional?: boolean;
  rest?: boolean;
  defaultValue?: string;
}

export interface ApiSignature extends ApiDocComment {
  typeParameters: ApiTypeParameter[];
  parameters: ApiParameter[];
  returns: string;
}

export interface ApiMember extends ApiDocComment {
  name: string;
  kind: 'property' | 'method' | 'accessor' | 'constructor' | string;
  static?: boolean;
  optional?: boolean;
  readonly?: boolean;
  protected?: boolean;
  abstract?: boolean;
  inheritedFrom?: string;
  type?: string;
  initializer?: string;
  signatures?: ApiSignature[];
}

export interface ApiSymbol extends ApiDocComment {
  name: string;
  slug: string;
  kind: 'class' | 'interface' | 'type' | 'function' | 'const' | string;
  package: string;
  source?: { file: string; line: number; url: string };
  typeParameters?: ApiTypeParameter[];
  extends?: string[];
  implements?: string[];
  extendedBy?: string[];
  members?: ApiMember[];
  signatures?: ApiSignature[];
  type?: string;
  initializer?: string;
  decorator?: string;
  selector?: string;
  providedIn?: string;
  registryKey?: string;
}

export interface ApiPackage {
  name: string;
  slug: string;
  description: string;
  symbols: ApiSymbol[];
}

export interface ApiData {
  generatedAt: string;
  packages: ApiPackage[];
}
