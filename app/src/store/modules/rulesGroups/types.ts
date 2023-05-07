import { RulesGroupEntity } from '@/types'

export type RulesGroupRulesForm = Record<string, Record<string, boolean>>

export interface RulesGroupsState {
  allRules: Record<string, string[]>
  rulesGroups: RulesGroupEntity[]
  rulesGroup: {
    name: string
    rules: RulesGroupRulesForm
  }
}
