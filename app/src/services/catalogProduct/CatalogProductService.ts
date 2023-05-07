import RepositoryFactory from '@/services/RepositoryFactory'
import { CatalogProduct, CatalogProductFilter } from '@/types'
import { ICatalogProductRepository } from './CatalogProductRepository'

export class CatalogProductService {
  private catalogProductRepository: ICatalogProductRepository

  constructor() {
    this.catalogProductRepository = RepositoryFactory.get('catalogProduct')
  }

  public async getAll(params: CatalogProductFilter): Promise<CatalogProduct[]> {
    const { products } = await this.catalogProductRepository.getAll(params)

    return products
  }
}

export default new CatalogProductService()
