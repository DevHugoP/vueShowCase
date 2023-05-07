import { RulesGroupRulesForm } from '@/store/modules/rulesGroups/types'

export default class RulesGroupMapper {
  public static rulesFormToRulesList(rulesForm: RulesGroupRulesForm): string[] {
    const rules: string[] = []

    for (const rulesSet of Object.values(rulesForm)) {
      for (const [rule, value] of Object.entries(rulesSet)) {
        if (value) {
          rules.push(rule)
        }
      }
    }

    return rules
  }

  public static allRulesToRulesForm(allRules: Record<string, string[]>): RulesGroupRulesForm {
    const rules: any = {}

    for (const entry of Object.entries(allRules)) {
      rules[entry[0]] = Object.fromEntries(entry[1].map(item => [item, false]))
    }

    return rules
  }

  public static rulesListToRulesForm(
    rulesList: string[],
    allRules: Record<string, string[]>,
  ): RulesGroupRulesForm {
    const rules: RulesGroupRulesForm = this.allRulesToRulesForm(allRules)

    for (const rulesCategory of Object.entries(rules)) {
      for (const entry of Object.entries(rulesCategory[1])) {
        if (rulesList.includes(entry[0])) {
          rules[rulesCategory[0]][entry[0]] = true
        }
      }
    }

    return rules
  }
}
