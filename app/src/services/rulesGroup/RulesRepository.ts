import HttpRepository from '@/services/HttpRepository'

export interface IRulesRepository {
  getAll: () => Promise<{ rules: Record<string, string[]> }>
}

export default class RulesRepository extends HttpRepository {}
