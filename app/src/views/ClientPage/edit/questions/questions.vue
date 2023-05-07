<template>
  <v-row no-gutters id="client-page-question" class="mt-15">
    <v-col cols="12" class="questions-header">
      <h2>
        {{ $t('page.editClientPage.questions.title') }}
      </h2>

      <mp-button
        format="secondary"
        icon="plus"
        :text="$t('page.editClientPage.questions.action')"
        dataId="clientPage-edit-question-action"
        class="ml-5"
        @click="handleAddQuestion()"
        :disabled="questions.length > 5 || disabled"
      />
    </v-col>
    <v-col cols="12">
      <div class="d-flex align-center mt-3">
        <v-icon class="pr-2 main-lighten-52">
          mdi-information-outline
        </v-icon>
        <span class="italic14 main-lighten-52">
          {{ $t('page.editClientPage.warning') }}
        </span>
      </div>
    </v-col>

    <v-col
      cols="12"
      md="8"
      lg="6"
      v-for="(question, index) in questions"
      :key="`questions-${index}`"
      :class="
        `question-wrapper${index > 1 ? ' mt-10' : ''}${
          $vuetify.breakpoint.smAndDown && index > 0 ? ' mt-10' : ''
        }`
      "
    >
      <div class="question-header litle d-flex align-center" :key="`question-${index}-header`">
        <h3 class="question-header-title">
          {{ question.title }}
        </h3>
        <mp-button
          dataId="clientPage-edit-question-remove"
          :disabled="questions.length === 1 || disabled"
          icon="trash-can-outline"
          format="secondary"
          @click="handleDeleteClick(index)"
        />
      </div>

      <mp-textfield
        :key="`question-${index}-title`"
        class="mb-5"
        :label="`${$t('page.editClientPage.questions.question.questionTitle')} *`"
        name="clientPage-edit-question-title"
        v-model="question.title"
        dataId="clientPage-edit-question-title"
        @input="validations.$each[index].title.$touch()"
        @blur="validations.$each[index].title.$touch()"
        :errors="getModelErrors(validations.$each[index].title)"
        :isDirty="validations.$each[index].title.$dirty"
        :disabled="disabled"
      />

      <mp-textarea
        class="mb-5"
        :label="`${$t('page.editClientPage.questions.question.entitled')} *`"
        v-model="question.question"
        dataId="clientPage-edit-question-entitled"
        autoGrow
        :rows="1"
        @input="validations.$each[index].question.$touch()"
        @blur="validations.$each[index].question.$touch()"
        :errors="getModelErrors(validations.$each[index].question)"
        :isDirty="validations.$each[index].question.$dirty"
        :disabled="disabled"
      />

      <mp-select
        :key="`question-${index}-type`"
        :label="`${$t('page.editClientPage.questions.question.type')} *`"
        v-model="question.type"
        :items="typeItems"
        clearable
        @input="validations.$each[index].type.$touch()"
        @blur="validations.$each[index].type.$touch()"
        :errors="getModelErrors(validations.$each[index].type)"
        :isDirty="validations.$each[index].type.$dirty"
        dataId="clientPage-edit-question-type"
        @change="handleQuestionTypeChange($event, index)"
        :disabled="disabled"
        :attach="`#clientPage-edit-question-${index}-type`"
        :dropdownId="`clientPage-edit-question-${index}-type`"
      />

      <div class="mb-5 toggle-wrapper" :key="`question-${index}-required`">
        <span class="regular14">{{ $t('page.editClientPage.questions.question.required') }}</span>
        <mp-switch
          v-model="question.required"
          dataId="clientPage-edit-question-required"
          :disabled="disabled || questions.length === 1"
        />
      </div>

      <div
        class="mb-5 toggle-wrapper"
        v-if="question.toggle !== undefined"
        :key="`question-${index}-toggle`"
      >
        <span class="regular14">{{ $t('page.editClientPage.questions.question.toggle') }}</span>
        <mp-switch
          v-model="question.toggle"
          dataId="clientPage-edit-question-toogle"
          :disabled="disabled || questions.length === 1"
        />
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'

import { validationMixin } from '@/mixins'
import { ClientPageCreate, getDefaultQuestion, Question } from '@/types'
import { ClientPageCategory, ClientPageQuestionType } from '@/constants'

export default mixins(validationMixin).extend({
  name: 'client-page-edit-questions',
  props: {
    clientPage: {
      type: Object as () => ClientPageCreate,
      required: true,
    },
    questions: {
      type: Array as () => Question[],
      required: true,
    },
    validations: {
      type: Object as () => Record<string, any>,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    typeItems() {
      return Object.values(ClientPageQuestionType).map(value => ({
        value,
        text: this.$t(`technical.clientPage.question.type.${value}`),
      }))
    },
  },
  methods: {
    handleAddQuestion() {
      this.questions.push({
        ...getDefaultQuestion(),
        title: this.$t('page.editClientPage.questions.question.title', {
          number: this.questions.length + 1,
        }),
      })
    },
    handleQuestionTypeChange(type: string, index: number) {
      this.questions[index].toggle = this.clientPage.category === ClientPageCategory.DELIVERY && (
        type === ClientPageQuestionType.SCORE_SATISFACTION ||
        type === ClientPageQuestionType.SCORE_RECOMMENDATION
      )
          ? true
          : undefined
    },
    handleDeleteClick(index: number) {
      this.$emit('deleteQuestion', index)
      this.validations.$reset()
    },
  },
})
</script>

<style lang="scss" scoped>
#client-page-question {
  .questions-header {
    display: flex;
    align-items: center;

    @media #{map-get($display-breakpoints, 'xs-only')} {
      flex-wrap: wrap;

      button {
        margin-left: 0 !important;
        margin-top: 1rem;
      }
    }
  }

  .question-wrapper {
    padding-right: 3rem; 
    @media #{map-get($display-breakpoints, 'lg-and-up')} {
      &:nth-child(even) {
        padding-right: 2.4rem;
      }

      &:nth-child(odd) {
        padding-left: 2.4rem;
      }
    }

    .question-header {
      display: flex;
      justify-content: space-between;

      &.litle {
        margin-bottom: 2rem;
      }

      .question-header-title {
        white-space: normal;
        word-break: break-all;
      }
    }

    .toggle-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>
