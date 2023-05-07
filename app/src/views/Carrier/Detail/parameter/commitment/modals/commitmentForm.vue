<template>
  <mp-dialog-confirmation
    dataId="modal-add-commitment"
    classWrapper="modal-add-commitment"
    @close="$emit('reset')"
    @submit="$emit('save')"
    color="primary"
    :header="{
      isColorBackground: true,
      icon: $vuetify.breakpoint.smAndUp ? 'mdi-pencil' : null,
      textPolice: $vuetify.breakpoint.smAndUp ? 'h4' : 'regular14',
      iconClose: 'mdi-close',
      text: isEdit ? $t('action.update.base') : $t('page.carrier.commitment.add'),
    }"
    :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
    :btnValidation="{
      text: $t('action.save'),
      format: 'success',
      icon: 'content-save',
      disabled: $v.$invalid,
    }"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    maxWidth="58.6rem"
    :btnToColumn="$vuetify.breakpoint.xsOnly"
  >
    <template #content>
      <v-form ref="form">
        <v-row no-gutters>
          <v-col cols="12" class="mb-5">
            <mp-textfield
              ref="formTitle"
              :dataId="`form-title`"
              :label="`${$t('common.title')} *`"
              name="name"
              v-model="commitment.name"
              @input="$v.commitment.name.$touch()"
              @blur="$v.commitment.name.$touch()"
              :isDirty="$v.commitment.name.$dirty"
            />
          </v-col>

          <v-col cols="12" class="mb-5">
            <mp-textfield
              :label="`${$t('page.carrier.commitment.title')} *`"
              name="commitment-amount"
              v-model="commitment.amount"
              type="number"
              :dataId="`form-commitment-amount`"
              :isDirty="$v.commitment.amount.$dirty"
              @input="$v.commitment.amount.$touch()"
              @blur="$v.commitment.amount.$touch()"
              :errors="getModelErrors($v.commitment.amount)"
              :suffix="`${$t('page.carrier.commitment.unit')}`"
            />
          </v-col>

          <v-col cols="12" class="mb-5">
            <mp-select
              :label="`${$t('page.carrier.commitment.period.title')} *`"
              dataId="carrier-create-address-country"
              v-model="commitment.period"
              :items="getPeriods"
              required
              :isDirty="$v.commitment.period.$dirty"
              @input="$v.commitment.period.$touch()"
              @blur="$v.commitment.period.$touch()"
            />
          </v-col>
          <v-col cols="12" class="mb-5">
            <mp-textfield
              :label="`${$t('page.carrier.commitment.scoreToAdd')} *`"
              name="commitment-scoreToAdd"
              v-model="commitment.scoreToAdd"
              type="number"
              :dataId="`form-commitment-scoreToAdd`"
              :isDirty="$v.commitment.scoreToAdd.$dirty"
              @input="$v.commitment.scoreToAdd.$touch()"
              @blur="$v.commitment.scoreToAdd.$touch()"
              :errors="getModelErrors($v.commitment.scoreToAdd)"
            />
          </v-col>
          <v-col cols="12">
            <h4 data-id="carrier-detail-commitment-attribute">
              {{ $t('page.carrier.commitment.attribute.title') }}
            </h4>
          </v-col>
          <v-row>
            <v-col cols="12" sm="4" class="main-commitment-attribute-wrapper">
              <mp-select
                clearable
                dataId="carrier-create-commitment-attribute"
                v-model="attribute"
                :items="getAttributesList"
                @change="setAttribute($event)"
              />
            </v-col>
            <v-col cols="12" sm="4" class="main-commitment-attribute-wrapper">
              <mp-textfield
                :label="''"
                name="commitment-attribute-key"
                v-model="attributeKey"
                dataId="form-commitment-attribute-key"
                :disabled="!attribute"
                @change="setAttributeKey($event)"
              />
            </v-col>
            <v-col cols="12" sm="4" class="main-commitment-attribute-wrapper">
              <mp-textfield
                :label="''"
                name="commitment-attribute-key"
                v-model="attributeValue"
                dataId="form-commitment-attribute-value"
                :disabled="!attributeKey && !attributeValue"
                @change="setAttributeValue($event)"
              />
            </v-col>
          </v-row>
        </v-row>
      </v-form>
    </template>
  </mp-dialog-confirmation>
</template>

<script lang="ts">
import Vue from 'vue'
import { required, numeric, decimal, between, minValue, requiredIf } from 'vuelidate/lib/validators'

import { languageMixin } from '@/mixins'

import { validationMixin } from '@/mixins'

const PERIODS: string[] = ['year', 'month', 'week', 'day']
const ATTRIBUTES: { [key: string]: string[] } = {
  tags: ['origin'] as string[],
}

export default Vue.extend({
  name: 'mp-dialog-commitment',
  mixins: [languageMixin, validationMixin],
  validations: {
    commitment: {
      name: {
        required,
      },
      amount: {
        required,
        minValue: minValue(0),
        numeric,
      },
      period: {
        required,
      },
      scoreToAdd: {
        required,
        decimal,
        between(scoreToAdd: number) {
          return between(1, 10)(scoreToAdd)
        },
      },
    },
    attributeKey: {
      required: requiredIf(form => {
        return form.attribute
      }),
    },
    attributeValue: {
      required: requiredIf(form => {
        return form.attributeKey
      }),
    },
  },
  props: {
    commitment: {
      type: Object,
      default: null,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      attribute: '',
      attributeKey: '',
      attributeValue: '',
    }
  },
  beforeMount() {
    const { attributes } = this.commitment
    // only work with 1 attributes ( for the moment we have only 1 attribute per commitment )
    const [attribute] = Object.entries(attributes)

    if (!attribute) {
      return
    }

    const [key, value] = attribute

    this.attribute = key

    if (value) {
      const [[attributeKey, attributeValue]] = Object.entries(value as Record<string, any>)
      this.attributeKey = attributeKey
      this.attributeValue = attributeValue
    }
  },
  methods: {
    setAttribute(attribute: string) {
      this.attribute = attribute
      this.setCommitment()
    },
    setAttributeKey(key: string) {
      this.attributeKey = key
      this.setCommitment()
    },
    setAttributeValue(value: string) {
      this.attributeValue = value
      this.setCommitment()
    },
    setCommitment() {
      if (!this.attribute) {
        this.commitment.attributes = {}
        this.attributeKey = ''
        this.attributeValue = ''
        return
      }
      this.commitment.attributes[this.attribute] = { [this.attributeKey]: this.attributeValue }
    },
  },
  computed: {
    getPeriods() {
      return PERIODS.map((value: string) => ({
        text: this.$t(`page.carrier.commitment.period.${value}`),
        value,
      }))
    },
    getAttributesList() {
      return Object.keys(ATTRIBUTES).map((key: string) => ({
        text: key,
        value: key,
      }))
    },
  },
})
</script>

<style lang="scss">
@import '../../../../../../styles/mixins/macScrollbar';

.modal-add-commitment {
  .main-dialog-content {
    padding: 3rem 4rem !important;
    @include setMacScrollbar('&');

    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      max-height: calc(100vh - 27rem);
      overflow-y: scroll;
    }

    .action-outer-wrapper {
      margin-top: 10rem;

      @media #{map-get($display-breakpoints, 'xs-only')} {
        justify-content: center;
      }

      .action-wrapper {
        display: flex;
        justify-content: flex-end;

        @media #{map-get($display-breakpoints, 'xs-only')} {
          align-items: center;

          .v-btn {
            width: fit-content;
          }
        }

        i {
          &.mdi-content-save {
            margin-right: 1rem;
          }
        }

        @media #{map-get($display-breakpoints, 'xs-only')} {
          flex-direction: column-reverse;
        }
      }
    }
  }

  .v-card__actions {
    border-top: 0.1rem solid $main-lighten-74-color;
  }
}
</style>
