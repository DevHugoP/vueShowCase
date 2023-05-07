import { RulesGroupEntity } from '@/types'
import { RulesGroupRulesForm } from '@/store/modules/rulesGroups/types'

import RepositoryFactory from '@/services/RepositoryFactory'
import RulesGroupMapper from './RulesGroupMapper'

import { IRulesGroupRepository } from './RulesGroupRepository'
import { IRulesRepository } from './RulesRepository'

export class RulesGroupService {
  private rulesRepository: IRulesRepository
  private rulesGroupRepository: IRulesGroupRepository

  constructor() {
    this.rulesRepository = RepositoryFactory.get('rules')
    this.rulesGroupRepository = RepositoryFactory.get('rulesGroup')
  }

  public async get(id: string): Promise<RulesGroupEntity> {
    const { group } = await this.rulesGroupRepository.get(id)

    return group
  }

  public async getAll(): Promise<RulesGroupEntity[]> {
    const { groups } = await this.rulesGroupRepository.getAll()

    return groups
  }

  public async getAllRules(): Promise<Record<string, string[]>> {
    const { rules } = await this.rulesRepository.getAll()

    return rules
  }

  public async createRulesGroup(rulesGroup: {
    name: string
    rules: RulesGroupRulesForm
  }): Promise<{ group: RulesGroupEntity }> {
    const { name, rules: rulesCategories } = rulesGroup

    const rules = RulesGroupMapper.rulesFormToRulesList(rulesCategories)

    return this.rulesGroupRepository.create({ name, rules })
  }

  public async editRulesGroup(
    id: string,
    rulesGroup: {
      name: string
      rules: RulesGroupRulesForm
    },
  ): Promise<{ group: RulesGroupEntity }> {
    const { name, rules: rulesCategories } = rulesGroup

    const rules = RulesGroupMapper.rulesFormToRulesList(rulesCategories)

    return this.rulesGroupRepository.update(id, { name, rules })
  }

  public async deleteRulesGroup(id: string): Promise<void> {
    return this.rulesGroupRepository.delete(id)
  }
}

export default new RulesGroupService()
