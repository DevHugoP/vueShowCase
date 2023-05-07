import RepositoryFactory from '@/services/RepositoryFactory'
import { CarrierScore, CarrierScoreFilter } from '@/types'
import CarrierScoreRepository from './CarrierScoreRepository'

export class CarrierScoreService {
  private repository: CarrierScoreRepository

  constructor() {
    this.repository = RepositoryFactory.get('carrierScores')
  }

  public async getAll(params: CarrierScoreFilter): Promise<CarrierScore[]> {
    const { carrierScores } = await this.repository.getAll(params)

    return carrierScores
  }
}

export default new CarrierScoreService()
