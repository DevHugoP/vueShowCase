<template>
  <div id="client-page-edit-body" class="pa-0 mt-14" data-id="client-page-edit-body">
    <v-row no-gutters class="mb-5">
      <v-col cols="12">
        <h2 data-id="client-page-edit-body-title">
          {{ $t('page.editClientPage.body.title') }}
        </h2>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="12" md="8" lg="6" class="pa-0">
        <mp-textfield
          class="mb-5"
          :label="`${$t('page.retailerDetail.clientPage.body.title')} *`"
          name="client-page-edit-body-title"
          v-if="bodyEntries && bodyEntries.includes('title')"
          v-model="body.title"
          dataId="client-page-edit-body-title"
          @input="$v.body.title.$touch()"
          @blur="$v.body.title.$touch()"
          :errors="getModelErrors($v.body.title)"
          :isDirty="$v.body.title.$dirty"
          :disabled="disabled"
        />

        <mp-textarea
          class="mb-5"
          :rows="5"
          :label="`${$t('page.retailerDetail.clientPage.body.informations')} *`"
          name="client-page-edit-body-informations"
          v-if="bodyEntries && bodyEntries.includes('informations')"
          v-model="body.informations"
          dataId="client-page-edit-body-informations"
          @input="$v.body.informations.$touch()"
          @blur="$v.body.informations.$touch()"
          :errors="getModelErrors($v.body.informations)"
          :isDirty="$v.body.informations.$dirty"
          :disabled="disabled"
        />

        <v-row no-gutters class="body-field-wrapper">
          <v-col
            v-if="bodyEntries && bodyEntries.includes('showInterval')"
            cols="12"
            class="body-field d-flex align-center"
          >
            <span class="regular14">
              {{ $t('page.retailerDetail.clientPage.body.showInterval') }}
            </span>
            <v-spacer />
            <mp-switch
              v-model="body.showInterval"
              :dataId="`clientPage-edit-body-show-interval-active`"
              :disabled="disabled"
            />
          </v-col>

          <v-col
            v-if="bodyEntries && bodyEntries.includes('showDriveName')"
            cols="12"
            class="body-field d-flex align-center"
          >
            <span class="regular14">
              {{ $t('page.retailerDetail.clientPage.body.showDriveName') }}
            </span>
            <v-spacer />
            <mp-switch
              v-model="body.showDriveName"
              :dataId="`clientPage-edit-body-show-name-active`"
              :disabled="disabled"
            />
          </v-col>

          <v-col cols="12" v-if="bodyEntries && bodyEntries.includes('instructions')">
            <instructions
              class="mt-6"
              :instructions="body.instructions"
              :validations="$v.body.instructions"
              @deleteInstruction="handleDeleteInstruction($event)"
              :disabled="disabled"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'

import { validationMixin } from '@/mixins'

import { ClientPageConfigBody } from '@/types'
import { maxLength, required, maxValue, minValue, requiredIf } from 'vuelidate/lib/validators'

import instructions from '../instructions/instructions.vue'

export default mixins(validationMixin).extend({
  name: 'client-page-edit-body',
  components: {
    instructions,
  },
  props: {
    body: {
      type: Object as () => ClientPageConfigBody,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    bodyEntries(): string[] {
      return Object.keys(this.body)
    },
  },
  validations() {
    const {
      body: { instructions: bodyInstructions },
    } = this
    return {
      body: {
        title: {
          required: requiredIf((): boolean => this.bodyEntries?.includes('title')),
          maxLength: maxLength(60),
        },
        informations: {
          required: requiredIf((): boolean => this.bodyEntries?.includes('informations')),
        },
        instructions:
          (bodyInstructions && {
            maxLength: maxLength(5),
            $each: {
              title: { required, maxLength: maxLength(60) },
              rank: {
                required,
                maxValue: maxValue(bodyInstructions.length),
                minValue: minValue(1),
                isUnique: newRank => {
                  return (
                    bodyInstructions.filter(({ rank }) => Number(rank) === Number(newRank))
                      .length === 1
                  )
                },
              },
            },
          }) ||
          {},
      },
    }
  },
  methods: {
    handleDeleteInstruction(index: number): void {
      this.body.instructions!.splice(index, 1)
    },
  },
  watch: {
    '$v.body.$invalid'(next) {
      this.$emit('isInvalid', next)
    },
  },
})
</script>

<style lang="scss">
#client-page-edit-body {
  .body-field-wrapper {
    min-height: 6rem;
    display: flex;
    align-items: center;

    .body-field {
      padding: 2rem 0;
      text-decoration: none;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: solid 0.1rem $main-lighten-65-color;

      &:last-of-type {
        border-bottom: 0;
      }
    }
  }
}
</style>
