import HttpRepository from '@/services/HttpRepository'
import Repository from '@/services/Repository'
import { DriveScore } from '@/types'

export interface ICollectRepository {
  getScore: (id: string) => Promise<{ score: DriveScore }>
}

export default class CollectRepository extends HttpRepository {
  async getScore(id: string): Promise<any> {
    const { data } = await Repository.get(`${this.endpoint}/${id}/scores`)
    return data
  }
}
