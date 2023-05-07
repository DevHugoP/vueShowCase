import ContactMapper from '@/services/contact/ContactMapper'
import { CreateRetailer, RetailerEntity } from '@/types'

export default class RetailerMapper {
  static toDto(retailer: RetailerEntity): CreateRetailer {
    const {
      contacts,
      brandColor,
      authProviderId,
      externalRetailerId,
      name,
      smsSendingName,
      logo,
      weightingIndexes: { environment, price, quality },
      administration,
      orderIdConfig: { prefix, suffix, generate },
      code,
      packagesDimensions,
      countries,
      passwordLess,
    } = retailer

    const optionalBody: Record<string, any> = {
      countries: [countries?.[0]],
    }

    if (code) {
      optionalBody.code = code
    }

    if ((logo as any) instanceof File) {
      optionalBody.logo = logo
    }

    return {
      ...optionalBody,
      externalRetailerId,
      name,
      smsSendingName,
      authProviderId,
      brandColor,
      administration,
      passwordLess,
      contacts: contacts.map(contact => ContactMapper.toDto(contact)),
      orderIdConfig: { prefix, suffix, generate },
      weightingIndexes: {
        environment: environment || 0,
        price: price || 0,
        quality: quality || {
          value: 0,
          detail: {
            satisfaction: 0,
            nps: 0,
            onTimeDeliveryScore: 0,
          },
        },
      },
      packagesDimensions:
        packagesDimensions && packagesDimensions.length
          ? packagesDimensions.map(packageDimension => {
              // edit unit for every dimension ( only height is edit in form )
              return {
                ...packageDimension,
                dimension: {
                  ...packageDimension.dimension,
                  width: {
                    ...packageDimension.dimension.width,
                    unit: packageDimension.dimension.height.unit,
                  },
                  length: {
                    ...packageDimension.dimension.length,
                    unit: packageDimension.dimension.height.unit,
                  },
                },
              }
            })
          : [],
    }
  }
}
