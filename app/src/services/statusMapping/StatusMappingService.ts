import RepositoryFactory from '@/services/RepositoryFactory'
import { StatusMappingEntity } from '@/types'
import StatusMappingRepository from './StatusMappingRepository'

export class StatusMappingService {
  private repository: StatusMappingRepository

  constructor() {
    this.repository = RepositoryFactory.get('statusMapping')
  }

  async createMany(statusMappings: StatusMappingEntity[]): Promise<StatusMappingEntity[]> {
    const { statusMappings: newStatusMappings } = await this.repository.create({
      statusMappings: statusMappings.map(
        ({ externalStatus, subStatus, status, carrierId, description, active }) => ({
          externalStatus,
          status,
          carrierId,
          ...(description && { description }),
          ...(subStatus && { subStatus }),
          active,
        }),
      ),
    })

    return newStatusMappings
  }

  async getAll(filters: Partial<StatusMappingEntity>): Promise<StatusMappingEntity[]> {
    const { statusMappings } = await this.repository.getAll(filters)

    return statusMappings
  }

  async delete(filters: Partial<StatusMappingEntity>): Promise<void> {
    await this.repository.deleteMany(filters)
  }
}

export default new StatusMappingService()
