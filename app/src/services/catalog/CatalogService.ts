import RepositoryFactory from '@/services/RepositoryFactory'
import { CatalogEntity, CatalogFilter } from '@/types'
import { ICatalogRepository } from './CatalogRepository'

const DEFAULT_OPTIONS = {
  headers: {
    'Content-type': 'multipart/form-data',
  },
}
export class CatalogService {
  private catalogRepository: ICatalogRepository

  constructor() {
    this.catalogRepository = RepositoryFactory.get('catalog')
  }

  public async getAll(params: CatalogFilter = {}): Promise<CatalogEntity[]> {
    const { catalogs } = await this.catalogRepository.getAll(params)

    return catalogs
  }

  public async create(catalog: Record<string, any>): Promise<CatalogEntity> {
    const { catalog: createdCatalog } = await this.catalogRepository.create(
      this.createForm(catalog),
      DEFAULT_OPTIONS,
    )

    return createdCatalog
  }

  public async update(id: string, catalog: Record<string, any>): Promise<CatalogEntity> {
    const { catalog: createdCatalog } = await this.catalogRepository.update(
      id,
      this.createForm(catalog),
      DEFAULT_OPTIONS,
    )

    return createdCatalog
  }

  public async delete(id: string): Promise<void> {
    await this.catalogRepository.delete(id)
  }

  public createForm(catalog: Record<string, any>): FormData {
    const { file, outdatedAt, title, updateReminderInterval, retailerId } = catalog
    const form = new FormData()

    form.append('retailerId', `${retailerId}`)
    form.append('updateReminderInterval', `${updateReminderInterval}`)
    form.append('title', title)
    form.append('outdatedAt', outdatedAt)
    if (file) {
      form.append('file', file)
    }

    return form
  }
}

export default new CatalogService()
