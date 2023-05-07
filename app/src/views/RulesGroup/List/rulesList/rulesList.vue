<template>
  <div class="rules__wrapper">
    <v-row no-gutters class="pa-0" v-for="(rule, index) in rulesToDisplay()" :key="index">
      <v-col cols="12">
        <h3 class="mb-4">
          {{ $t(`technical.rulesCategory.${rule[0]}`) }}
        </h3>

        <v-row no-gutters>
          <v-col
            cols="12"
            class="mb-3 rule-detail-wrapper"
            v-for="item in rule[1].rules"
            :key="`rule_${item.name}`"
          >
            <span class="regular14 d-flex align-center rule-detail">
              <v-icon class="mr-3" v-if="item.isActive">mdi-check-bold</v-icon>
              <v-icon class="mr-3 error-color" v-else>mdi-close-thick</v-icon>
              {{ $t(`technical.rules.${item.name}`) }}
            </span>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { RulesGroupEntity, RulesKey } from '@/types'

export default Vue.extend({
  name: 'rules-list',
  props: {
    rulesGroup: {
      type: Object as () => RulesGroupEntity,
      required: true,
    },
  },
  async beforeMount() {
    await this.$store.dispatch('rulesGroups/fetchAllRules')
  },
  methods: {
    allRules() {
      return this.$store.getters['rulesGroups/allRules']
    },
    rulesToDisplay() {
      const { rules } = this.rulesGroup
      const rulesToDisplay = Object.entries(this.allRules()).reduce((acc, rule) => {
        const [key, value] = rule
        return {
          ...acc,
          [key]: {
            rules: (value as string[]).map(ruleName => {
              return {
                isActive: rules.includes(ruleName as RulesKey),
                name: ruleName,
              }
            }),
          },
        }
      }, {})
      return Object.entries(rulesToDisplay)
    },
  },
})
</script>

<style lang="scss" scoped>
.rules__wrapper {
  color: $main-color;
  .rule-detail-wrapper {
    white-space: break-spaces;

    .rule-detail {
      white-space: pre-line;
    }
  }
}
</style>
