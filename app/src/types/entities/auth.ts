export type AuthKeycloakTokenRequest = {
  type: typeof AuthTokenKeycloakType
  username?: string
  password?: string
  code?: string
  specificPartner?: AuthInfos
  provider?: string
}

export type AuthTokenRequest = AuthKeycloakTokenRequest

export type AuthInfos = {
  code: string
  brandColor?: string
  name: string
  authProviderId: string
  logo: string
  passwordLess: boolean
}

export const AuthTokenKeycloakType = 'keycloak'
