import { RulesGroupEntity } from '@/types'

import HttpRepository from '@/services/HttpRepository'

export interface IRulesGroupRepository {
  getAll: () => Promise<{ groups: RulesGroupEntity[] }>
  get: (id: string) => Promise<{ group: RulesGroupEntity }>
  create: (rulesGroup: { name: string; rules: string[] }) => Promise<{ group: RulesGroupEntity }>
  update: (
    id: string,
    rulesGroup: { name: string; rules: string[] },
  ) => Promise<{ group: RulesGroupEntity }>
  delete: (id: string) => Promise<void>
}

export default class RulesGroupRepository extends HttpRepository {}
