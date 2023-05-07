export interface MetabaseConfig {
  url: string
  secretKey?: string
}

export interface JwtConfig {
  secretKey?: string
}

export interface AdministrationConfig {
  metabase: MetabaseConfig
  jwt: JwtConfig
}
