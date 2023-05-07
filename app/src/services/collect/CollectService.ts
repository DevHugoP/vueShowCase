import Config from '@/config/Config'
import { Collect, DriveScore, STATUS_WORKFLOW, STATUS_WORKFLOW_KEY } from '@/types'
import RepositoryFactory from '../RepositoryFactory'
import CollectRepository from './CollectRepository'

class CollectService {
  private repository: CollectRepository

  constructor() {
    this.repository = RepositoryFactory.get('collect')
  }

  async getAll(params: Record<string, any>): Promise<Collect[]> {
    const { collects } = await this.repository.getAll(params)

    return collects
  }

  async getById(id: string, params?: Record<string, any>): Promise<Collect> {
    const { collect } = await this.repository.get(id, params)

    return collect
  }

  async delete(id: string): Promise<void> {
    return await this.repository.delete(id)
  }

  getAvailableStatus(
    status: Array<Record<string, any>>,
    currentStatus: string,
  ): Array<Record<string, any>> {
    const [nextStatus] = STATUS_WORKFLOW[currentStatus as STATUS_WORKFLOW_KEY] || []
    if (nextStatus) {
      return this.getAvailableStatus([...status, { status: nextStatus }], nextStatus)
    }

    return status
  }

  async generateInternalCollectTrackingURL(id: string, language: string): Promise<string> {
    return `${Config.get('VUE_APP_FRONT_OFFICE_BASE_URL')}/dt/${id}?language=${language}`
  }

  async generateInternalCollectSlot(id: string, language: string): Promise<string> {
    return `${Config.get('VUE_APP_FRONT_OFFICE_BASE_URL')}/p/${id}?language=${language}`
  }

  async getScore(id: string): Promise<DriveScore | null> {
    const { score } = await this.repository.getScore(id)

    return score
  }
}

export default new CollectService()
