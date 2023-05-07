<template>
  <div id="retailer-create-generateOrder" data-id="retailer-create-generateOrder">
    <!-- title -->
    <v-row no-gutters>
      <v-col cols="12">
        <h2 data-id="retailer-create-generateOrder-title">{{ $t('common.orderGeneration') }}</h2>
      </v-col>
    </v-row>

    <!-- form -->
    <v-row no-gutters>
      <v-col cols="12">
        <mp-radioGroup
          row
          dataId="retailer-create-generateOrder-generate"
          name="retailer-create-generateOrder-generate"
          :radioValues="radioValues"
          v-model="localGenerate"
          @input="$v.localGenerate.$touch()"
          @blur="$v.localGenerate.$touch()"
          :errors="getModelErrors($v.localGenerate)"
        />
      </v-col>
    </v-row>

    <v-row v-if="!isManualLocalGenerate" no-gutters>
      <v-col cols="12" md="8" lg="6">
        <mp-select
          :label="$t('page.createOrder.generateOrder.prefix')"
          v-model="retailer.orderIdConfig.prefix"
          :items="getSelectItems('prefix', retailer.orderIdConfig.suffix)"
          dataId="retailer-create-generateOrder-prefix"
          clearable
        />
      </v-col>
    </v-row>
    <v-row v-if="!isManualLocalGenerate" no-gutters>
      <v-col cols="5" md="4" lg="2" class="timestamp-wrapper">
        <span class="italic16 main-lighten-52">+ {{ $t('page.detailOrder.billing.timestamp') }}</span>
      </v-col>
    </v-row>
    <v-row v-if="!isManualLocalGenerate" no-gutters>
      <v-col cols="12" md="8" lg="6">
        <mp-select
          :label="$t('page.createOrder.generateOrder.suffix')"
          v-model="retailer.orderIdConfig.suffix"
          :items="getSelectItems('suffix', retailer.orderIdConfig.prefix)"
          dataId="retailer-create-generateOrder-suffix"
          clearable
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'

import {
  RetailerEntity,
  ORDER_GENERATION,
  RadioValues,
  ORDER_GENERATION_PREFIX_SUFFIX,
} from '@/types'

import { validationMixin } from '@/mixins'
import { required } from 'vuelidate/lib/validators'

export default mixins(validationMixin).extend({
  name: 'retailer-create-generateOrder',
  props: {
    retailer: {
      type: Object as () => RetailerEntity,
      required: true,
    },
  },
  data: () => ({
    localGenerate: ORDER_GENERATION.MANUAL,
    radioValues: [] as RadioValues[],
  }),
  validations() {
    return {
      localGenerate: { required },
    }
  },
  beforeMount() {
    this.localGenerate = this.retailer.orderIdConfig.generate
      ? ORDER_GENERATION.AUTOMATIC
      : ORDER_GENERATION.MANUAL

    this.radioValues = [
      {
        label: this.$t('page.createOrder.generateOrder.manual'),
        value: ORDER_GENERATION.MANUAL,
      },
      {
        label: this.$t('page.createOrder.generateOrder.generated'),
        value: ORDER_GENERATION.AUTOMATIC,
      },
    ]
  },
  computed: {
    isManualLocalGenerate(): boolean {
      return this.localGenerate === ORDER_GENERATION.MANUAL
    },
  },
  mounted() {
    this.$emit('invalid', this.$v.$invalid)
  },
  methods: {
    getSelectItems(type: string, selectValue: any): any {
      if ((type === 'prefix' || type === 'suffix') && selectValue) {
        return ORDER_GENERATION_PREFIX_SUFFIX
          ? Object.values(ORDER_GENERATION_PREFIX_SUFFIX)
              .filter(item => {
                if (
                  selectValue === ORDER_GENERATION_PREFIX_SUFFIX.STORE_ID ||
                  selectValue === ORDER_GENERATION_PREFIX_SUFFIX.STORE_NAME
                ) {
                  return item === ORDER_GENERATION_PREFIX_SUFFIX.DAY_DATE
                }
                if (selectValue === ORDER_GENERATION_PREFIX_SUFFIX.DAY_DATE) {
                  return item !== ORDER_GENERATION_PREFIX_SUFFIX.DAY_DATE
                }
              })
              .map(item => ({
                value: item,
                text: this.$t(`page.createOrder.generateOrder.${item}`),
              }))
          : []
      }
      return ORDER_GENERATION_PREFIX_SUFFIX
        ? Object.values(ORDER_GENERATION_PREFIX_SUFFIX as object).map(item => ({
            value: item,
            text: this.$t(`page.createOrder.generateOrder.${item}`),
          }))
        : []
    },
  },
  watch: {
    localGenerate(next) {
      if (next === ORDER_GENERATION.MANUAL) {
        this.retailer.orderIdConfig.prefix = ''
        this.retailer.orderIdConfig.suffix = ''
      }
      this.retailer.orderIdConfig.generate = next === ORDER_GENERATION.AUTOMATIC
    },
    '$v.$invalid'(next) {
      this.$emit('invalid', next)
    },
  },
})
</script>

<style lang="scss">
#retailer-create-generateOrder {
  padding: 0;
  margin-bottom: 8rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;

  .timestamp-wrapper {
    height: 6rem;
    background-color: $main-lighten-80-color;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0.2rem;
  }

  @media #{map-get($display-breakpoints, 'xs-only')} {
    .mp-radio {
      padding-top: 1rem;
    }
  }
}
</style>
