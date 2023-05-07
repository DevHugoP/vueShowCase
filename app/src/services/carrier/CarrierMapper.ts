import { CarrierEntity, CreateCarrier } from '@/types'

export default class CarrierMapper {
  static async toDto(carrier: CarrierEntity): Promise<CreateCarrier> {
    const {
      name,
      logo,
      siret,
      code,
      authProviderId,
      passwordLess,
      isNew,
      isPrivate,
      ecologyType,
      isLabeled,
      status,
      description,
    } = carrier

    const optionalBody: Record<string, any> = {}

    if (code) {
      optionalBody.code = code
    }

    if (authProviderId) {
      optionalBody.authProviderId = authProviderId
    }

    if (passwordLess !== undefined) {
      optionalBody.passwordLess = passwordLess
    }

    if (logo && logo instanceof File) {
      optionalBody.logo = await CarrierMapper.toBase64(logo)
    }

    return {
      ...optionalBody,
      name,
      isNew,
      isPrivate,
      ecologyType,
      isLabeled,
      status,
      description,
      siret,
    }
  }

  static async toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }
}
