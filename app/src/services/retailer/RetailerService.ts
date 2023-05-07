import ContactService from '@/services/contact/contactService'
import RepositoryFactory from '@/services/RepositoryFactory'
import RetailerRepository, { IRetailerRepository } from '@/services/retailer/RetailerRepository'
import {
  AuthInfos,
  CreateRetailer,
  Filters,
  getDefaultAdministration,
  getDefaultRetailer,
  PackagesDimensions,
  RetailerEntity,
  SubscriptionEntity,
} from '@/types'
import { serialize } from 'object-to-formdata'

const DEFAULT_OPTIONS = {
  headers: {
    'Content-type': 'multipart/form-data',
  },
}

export class RetailerService {
  private retailerRepository: IRetailerRepository & RetailerRepository

  constructor() {
    this.retailerRepository = RepositoryFactory.get('retailer')
  }

  /**
   * @name getAll
   *
   * Get informations to populate retailer list page
   */
  public async getAll(
    params: Record<string, any> = {},
  ): Promise<{ retailers: RetailerEntity[]; count: number }> {
    if (params.countries?.length) {
      params.countries = JSON.stringify(params.countries)
    }
    const { retailers, count } = await this.retailerRepository.getAll(params)

    return { retailers, count }
  }

  public async getAuthInfos(partnerCode: string): Promise<AuthInfos | undefined> {
    if (partnerCode === 'google') {
      return {
        brandColor: '#4285F4',
        authProviderId: 'google',
        name: 'Google',
        logo:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/157px-Google_%22G%22_Logo.svg.png',
        code: 'google',
        passwordLess: false,
      }
    }
    return this.retailerRepository.getAuthInfos(partnerCode)
  }

  public async get(id: number, params?: Record<string, any>): Promise<RetailerEntity> {
    const { retailer } = await this.retailerRepository.get(id, params)

    return retailer
  }

  public async create(
    retailer: CreateRetailer,
    subscription?: Partial<SubscriptionEntity>,
  ): Promise<RetailerEntity> {
    const currentRetailer: Record<string, any> = retailer
    if (subscription && Object.entries(subscription).length) {
      currentRetailer.subscription = subscription
    }
    const form = serialize(currentRetailer, { indices: true })

    const { retailer: createdRetailer } = await this.retailerRepository.create(
      form,
      DEFAULT_OPTIONS,
    )

    return createdRetailer
  }

  public async update(id: string, retailer: Partial<CreateRetailer>): Promise<RetailerEntity> {
    const form = serialize(retailer, { indices: true, allowEmptyArrays: true })

    const { retailer: createdRetailer } = await this.retailerRepository.update(
      id,
      form,
      DEFAULT_OPTIONS,
    )

    return createdRetailer
  }

  public async updateFeatures(
    id: string,
    retailer: Partial<CreateRetailer>,
  ): Promise<RetailerEntity> {
    const { retailer: createdRetailer } = await this.retailerRepository.updateFeatures(id, retailer)

    return createdRetailer
  }

  public async getFilters(params: Record<string, any> = {}): Promise<Filters[]> {
    const { retailers } = await this.retailerRepository.getFilters(params)

    return retailers
  }

  public buildRetailer(retailer?: RetailerEntity): RetailerEntity {
    const localRetailer = { ...getDefaultRetailer(), ...retailer }

    if (retailer && !retailer.administration) {
      localRetailer.administration = getDefaultAdministration()
    }

    if (retailer?.countries?.length) {
      const country = retailer.countries.shift()
      localRetailer.countries = country ? [country] : null
    }

    if (retailer?.contacts?.length) {
      localRetailer.contacts = retailer.contacts
    } else {
      localRetailer.contacts = [ContactService.buildContact()]
    }

    return localRetailer
  }

  public getDefaultPackageDimension(override?: Partial<PackagesDimensions>): PackagesDimensions {
    return {
      label: '',
      dimension: {
        width: {
          value: null,
          unit: 'cm',
        },
        height: {
          value: null,
          unit: 'cm',
        },
        length: {
          value: null,
          unit: 'cm',
        },
      },
      ...override,
    }
  }

  getSecret(id: any): Promise<{ file: any; filename: string; password: string }> {
    return this.retailerRepository.getSecret(id)
  }
}

export default new RetailerService()
