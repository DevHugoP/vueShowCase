export enum FtpProtocol {
  FTP = 'FTP',
  SFTP = 'SFTP',
}

export enum AuthenticationMethod {
  PASSWORD = 'PASSWORD',
  SSH = 'SSH',
}

export type FtpAccountEntity = {
  id: number
  host: string
  port: number
  username: string
  password?: string
  privateKey?: string
  dirPath: string
  protocol: FtpProtocol
  authenticationMethod: AuthenticationMethod
  code: string
  createdAt: string
  updatedAt: string
  name: string
}

export type FtpAccountCreate = {
  thirdPartyId: number
  host: string
  port: number
  username: string
  password?: string
  dirPath: string
  protocol: FtpProtocol
  authenticationMethod: AuthenticationMethod
  privateKey?: string
}

export type FtpAccountUpdate = Omit<FtpAccountCreate, 'thirdPartyId'>
