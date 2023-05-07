<template>
  <mp-block
    id="retailer-client-page-form-block"
    :title="$vuetify.breakpoint.smAndUp ? $t('page.clientPage.form.title') : ''"
    :hasBorder="$vuetify.breakpoint.smAndUp"
    :hasMarginBottom="$vuetify.breakpoint.smAndUp"
    titleHasPaddingBottom
  >
    <v-row
      no-gutters
      v-for="(question, index) in questions"
      :key="`client-page-detail-questions-${index}`"
      :class="`${index !== 0 ? 'mt-4' : ''}`"
    >
      <v-col cols="12">
        <v-divider class="mb-4" v-if="index !== 0" />
        <h3>{{ question.title }}</h3>
      </v-col>

      <v-col cols="12" class="mt-2">
        <span class="regular14 main-lighten-52">
          {{ $t('page.editClientPage.questions.question.entitled') }}
        </span>
      </v-col>

      <v-col cols="12" class="mt-3">
        <span class="regular14">
          {{ question.question }}
        </span>
      </v-col>

      <v-col cols="12" class="mt-3" v-if="question.toggle !== undefined">
        <div class="d-flex align-center">
          <v-icon>{{ question.toggle ? 'mdi-check-bold' : 'mdi-close-thick' }}</v-icon>
          <span class="regular14 ml-2">{{ $t('page.clientPage.form.included') }}</span>
        </div>
      </v-col>

      <v-col cols="12" class="mt-3">
        <div class="d-flex align-center">
          <v-icon>{{ question.required ? 'mdi-check-bold' : 'mdi-close-thick' }}</v-icon>
          <span class="regular14 ml-2">{{ $t('page.clientPage.form.required') }}</span>
        </div>
      </v-col>
    </v-row>
  </mp-block>
</template>

<script lang="ts">
import Vue from 'vue'

import mpBlock from '@/components/block/block.vue'
import { Question } from '@/types'

export default Vue.extend({
  name: 'client-page-detail-form',
  components: {
    mpBlock,
  },
  props: {
    questions: {
      type: Array as () => Question[],
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
#retailer-client-page-form-block {
  .main-lighten-52 {
    color: $main-lighten-52-color;
  }
}
</style>
