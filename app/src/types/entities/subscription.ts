export interface Basic {
  username: string
  password: string
}

export interface Oauth2 {
  client_id: string
  client_secret: string
  audience: string
  grant_interface: string
  tokenEndPoint: string
}

export interface Token {
  username: string
  password: string
  endpoint: string
}

export interface Auth {
  basic?: Basic
  oauth2?: Oauth2
  token?: Token
}

export interface Header {
  key: string
  value: string
}

export interface CallbackDetail {
  url: string
  version: string
}

export interface SubscriptionEntity {
  auth?: Auth
  callbacks: Record<string, CallbackDetail | any>
  id: number
  adapter?: string
  additionalHeaders?: Header[]
  apiClientId: string
}

export interface Subscription {
  criteria: string
  url: string
  version: string
  frontId?: string
}
