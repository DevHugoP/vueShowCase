export interface Unit {
  unit: string
  value: number | null
}

export enum FootprintType {
  METER_SQUARE = 'm2',
  CENTIMENTER_SQUARE = 'cm2',
  PALLET = 'pallet',
}

export enum PackageType {
  PACKAGE = 'PACKAGE',
  TRAY = 'TRAY',
  PALLET = 'PALLET',
}

export interface ProductEntity {
  label?: string
  ean?: string
  cug?: string
  type: string
  quantity: number
  value?: number
}

export interface ProductReturnEntity extends ProductEntity {
  toReturn: boolean
  selectedQuantity: number | null
}

export enum BarcodeFormat {
  EAN128 = '128',
}

export enum BarcodeType {
  BARCODE = 'barcode',
}

export type Barcode = {
  value: string
  type: BarcodeType
  format: BarcodeFormat
}

export type References = {
  reference: string
  barcode?: Barcode
}

export interface PackageEntityAttributes {
  footprint?: Unit
}

export interface PackageEntity {
  id?: number
  length: Unit
  width: Unit
  height: Unit
  weight: Unit
  quantity: number
  references?: References[]
  orderId?: number
  createdAt?: string
  updatedAt?: string
  type?: string
  products?: ProductEntity[]
  attributes?: PackageEntityAttributes
}
