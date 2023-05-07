import AuthorizationService from '@/services/authorization/AuthorizationService'
import Vue from 'vue'
import { CurrentContext, RulesKey } from '@/types'

export default Vue.extend({
  methods: {
    isAuthorized(rule: RulesKey | RulesKey[], context?: CurrentContext, operator?: 'AND' | 'OR') {
      const { permissions } = this.$store.getters['auth/currentUser']

      if (!permissions.length) {
        return false
      }

      return AuthorizationService.isAllowed(rule, permissions, context, operator)
    },
    isFeatureEnabled(feature: string) {
      const { features } = this.$store.getters['auth/currentUser']

      if (!features) {
        return true
      }

      return features[feature]
    },
  },
})
