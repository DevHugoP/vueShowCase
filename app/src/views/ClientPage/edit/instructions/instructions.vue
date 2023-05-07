<template>
  <v-row no-gutters id="client-page-instruction" class="mt-15">
    <v-col cols="12" class="instructions-header">
      <h2>{{ $t('page.editClientPage.instructions.title') }}</h2>

      <mp-button
        format="secondary"
        icon="plus"
        :text="$t('page.editClientPage.instructions.action')"
        dataId="clientPage-edit-instruction-action"
        class="ml-5"
        @click="handleAddInstruction()"
        :disabled="instructions.length > limit || disabled"
      />
    </v-col>

    <v-col
      cols="12"
      md="8"
      lg="6"
      v-for="(instruction, index) in instructions"
      :key="`instructions-${index}`"
      :class="
        `instruction-wrapper${index > 1 ? ' mt-10' : ''}${
          $vuetify.breakpoint.smAndDown && index > 0 ? ' mt-10' : ''
        }`
      "
    >
      <div
        class="instruction-header litle d-flex align-center"
        :key="`instruction-${index}-header`"
      >
        <h3 class="instruction-header-title">
          {{
            $t('page.editClientPage.instructions.instruction.title', {
              number: index + 1,
            })
          }}
        </h3>
        <mp-button
          dataId="clientPage-edit-instruction-remove"
          :disabled="disabled"
          icon="trash-can-outline"
          format="secondary"
          @click="handleDeleteClick(index)"
        />
      </div>

      <mp-textfield
        :key="`instruction-${index}-title`"
        class="mb-5"
        :label="`${$t('page.editClientPage.instructions.instruction.instructionTitle')} *`"
        name="clientPage-edit-instruction-title"
        v-model="instruction.title"
        dataId="clientPage-edit-instruction-title"
        @input="validations.$each[index].title.$touch()"
        @blur="validations.$each[index].title.$touch()"
        :errors="getModelErrors(validations.$each[index].title)"
        :isDirty="validations.$each[index].title.$dirty"
        :disabled="disabled"
      />

      <mp-textfield
        :key="`instruction-${index}-rank`"
        :label="`${$t('page.editClientPage.instructions.instruction.rank')} *`"
        v-model="instruction.rank"
        clearable
        type="number"
        @input="validations.$each[index].rank.$touch()"
        @blur="validations.$each[index].rank.$touch()"
        :errors="getModelErrors(validations.$each[index].rank)"
        :isDirty="validations.$each[index].rank.$dirty"
        dataId="clientPage-edit-instruction-rank"
        :disabled="disabled"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'

import { validationMixin } from '@/mixins'
import { getDefaultInstruction, Instruction } from '@/types'
import { SnackBarType } from '@/store/types'

export default mixins(validationMixin).extend({
  name: 'client-page-edit-instructions',
  props: {
    instructions: {
      type: Array as () => Instruction[],
      required: true,
    },
    validations: {
      type: Object as () => Record<string, any>,
      required: true,
    },
    limit: {
      type: Number,
      default: 5,
    },
    disabled: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    handleAddInstruction() {
      const { limit } = this

      if (this.instructions.length === 5) {
        return this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.addInstructionError.max', { limit }),
        })
      }

      this.instructions.push({
        ...getDefaultInstruction(),
        rank: this.instructions.length + 1,
      })
    },
    handleDeleteClick(index: number) {
      this.$emit('deleteInstruction', index)
      this.validations.$reset()
    },
  },
})
</script>

<style lang="scss" scoped>
#client-page-instruction {
  .instructions-header {
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

  .instruction-wrapper {
    @media #{map-get($display-breakpoints, 'lg-and-up')} {
      &:nth-child(even) {
        padding-right: 2.4rem;
      }

      &:nth-child(odd) {
        padding-left: 2.4rem;
      }
    }

    .instruction-header {
      display: flex;
      justify-content: space-between;

      &.litle {
        margin-bottom: 2rem;
      }

      .instruction-header-title {
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
