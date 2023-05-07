import RepositoryFactory from '../RepositoryFactory'
import ParcelRepository from './ParcelRepository'

class ParcelService {
  private repository: ParcelRepository

  constructor() {
    this.repository = RepositoryFactory.get('parcels')
  }

  async getAll(filters: Record<string, any>) {
    const { parcels } = await this.repository.getAll(filters)

    return parcels
  }
}

export default new ParcelService()
