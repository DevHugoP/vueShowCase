<template>
  <mp-block
    id="order-detail-score"
    :title="$vuetify.breakpoint.smAndUp ? $t('page.detailOrder.score.title') : ''"
    :hasBorder="$vuetify.breakpoint.smAndUp"
    :hasMarginBottom="$vuetify.breakpoint.smAndUp"
    titleHasPaddingBottom
  >
    <div v-if="score">
      <mp-date-hour
        :date="getDate(score.date, 'P')"
        :hour="getDate(score.date, 'p')"
        dataId="order-detail-score-date"
      />

      <div class="questions-outer-wrapper" :style="{ height: maxHeight }">
        <div
          v-for="(question, index) in questions"
          :ref="`question-${index}`"
          :key="`question-${index}`"
          class="questions-wrapper pt-5"
        >
          <h3>{{ $t('common.question', { number: index + 1 }) }}</h3>

          <div class="regular14 pt-2">{{ question.question }}</div>

          <div class="note-wrapper mt-2" v-if="question.note !== undefined">
            <v-icon size="1.8rem" class="pl-4 main-lighten-28">mdi-lightbulb-on</v-icon>
            <div class="regular14 pl-2 main-lighten-28">{{ question.note }}/10</div>
          </div>

          <div class="answer-wrapper mt-2" v-else-if="question.answer">
            <span class="regular14 ml-2 main-lighten-28" v-if="question.answer">
              {{ question.answer }}
            </span>
          </div>

          <div v-else class="pt-2 d-flex align-center">
            <v-icon class="alert-color" size="1.8rem">mdi-alert-decagram</v-icon>
            <span class="alert-color pl-2 medium14">
              {{ $t('page.detailOrder.score.noAnswer') }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <no-data dataId="order-detail-score-noData" />
    </div>
  </mp-block>
</template>

<script lang="ts">
import Vue from 'vue'

import mpBlock from '@/components/block/block.vue'

import { dateHelper, dateHelperGetTimezonedDate } from '@/helpers/dateHelper'

import noData from '@/components/noData/noData.vue'
import { DeliveryScore } from '@/types'

export interface Question {
  question: string
  note?: number
  answer?: string
}

export default Vue.extend({
  name: 'mp-score',
  components: {
    mpBlock,
    noData,
  },
  props: {
    score: {
      type: Object as () => DeliveryScore | null,
      default: null,
    },
  },
  data() {
    return {
      maxHeight: '100%',
    }
  },
  computed: {
    questions() {
      const questions: Question[] = []

      if ((this.score as DeliveryScore).score?.length) {
        for (const score of (this.score as DeliveryScore).score) {
          questions.push({ question: score.question, note: score.note })
        }
      }

      if ((this.score as DeliveryScore).comment?.length) {
        for (const comment of (this.score as DeliveryScore).comment) {
          questions.push({ question: comment.question, answer: comment.answer })
        }
      }

      return questions
    },
  },
  methods: {
    getDate(date: string, format: string): string {
      return dateHelper.formatToTimezone(dateHelperGetTimezonedDate(date), 'UTC', format)
    },
  },
  watch: {
    score() {
      this.$nextTick(() => {
        if (this.$refs['question-3']) {
          const height =
            (this.$refs['question-0'] as any)[0].offsetHeight +
            (this.$refs['question-1'] as any)[0].offsetHeight +
            (this.$refs['question-2'] as any)[0].offsetHeight

          this.maxHeight = `${height}px`
        }
      })
    },
  },
})
</script>

<style lang="scss">
@import '../../styles/mixins/macScrollbar';

#order-detail-score {
  .questions-outer-wrapper {
    @include setMacScrollbar('&');
    overflow: auto;

    .questions-wrapper {
      .note-wrapper {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        background-color: $main-lighten-80-color;
        width: 100%;
        height: 4.4rem;
      }

      .answer-wrapper {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        background-color: $main-lighten-80-color;
        width: 100%;
      }
    }
  }
}
</style>
