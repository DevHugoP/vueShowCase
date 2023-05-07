import ContactService from '@/services/contact/contactService'
import RepositoryFactory from '@/services/RepositoryFactory'
import { IStoreRepository } from '@/services/store/StoreRepository'
import { Filters, getDefaultStore, StoreEntity } from '@/types'

export class StoreService {
  private storeRepository: IStoreRepository

  constructor() {
    this.storeRepository = RepositoryFactory.get('store')
  }

  /**
   * @name getAll
   *
   * Get all stores
   */
  public async getAll(filters: Record<string, any> = {}): Promise<StoreEntity[]> {
    const { stores } = await this.storeRepository.getAll(filters)

    return stores
  }

  public async get(id: number, params?: Record<string, any>): Promise<StoreEntity> {
    const { store } = await this.storeRepository.get(id, params)

    return store
  }

  public async update(id: number | string, payload: Partial<StoreEntity>): Promise<StoreEntity> {
    const { store } = await this.storeRepository.update(id, payload)

    return store
  }

  public async updateWeightingIndexes(
    id: number | string,
    payload: Partial<StoreEntity>,
  ): Promise<StoreEntity> {
    const { store } = await this.storeRepository.updateWeightingIndexes(id, payload)

    return store
  }

  public async create(payload: Partial<StoreEntity>): Promise<StoreEntity> {
    const { store } = await this.storeRepository.create(payload)

    return store
  }

  public async getFilters(filters: Record<string, any> = {}): Promise<Filters[]> {
    const { stores } = await this.storeRepository.getFilters(filters)

    return stores
  }

  public buildStore(store?: StoreEntity): StoreEntity {
    const localStore = { ...getDefaultStore(), ...store }

    if (store && store.contacts && store.contacts.length > 0) {
      localStore.contacts = store.contacts
    } else {
      localStore.contacts = [ContactService.buildContact()]
    }

    return localStore
  }
}

export default new StoreService()
