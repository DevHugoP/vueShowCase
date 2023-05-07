<template>
  <mp-autocomplete
    :label="`${label || $t('page.detailOrder.manualQuote.currency')}${isRequired ? ' *' : ''}`"
    id="currency-autocomplete"
    v-model="suggestedInput"
    :items="suggestedCurrencies"
    @loadItems="handleChangeCurrencySearch($event)"
    @change="handleChangeCurrency()"
    :top="top"
    @clickClear="handleCurrencyClear(true)"
    displayName="text"
    :dataId="`${dataId}-form-currency`"
    attach="#currencyAutocompleteDropdown"
    dropdownId="currencyAutocompleteDropdown"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import { SelectItem } from '@/types'
import { CURRENCY } from '@/constants/shared'

export default Vue.extend({
  name: 'currency-autocomplete',
  props: {
    label: {
      type: String,
      default: '',
    },
    currency: {
      type: String,
      required: true,
    },
    dataId: {
      type: String,
      default: 'autocomplete',
    },
    isRequired: {
      type: Boolean,
      default: false,
    },
    top: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      suggestedCurrencies: [] as Record<string, any> | [],
      suggestedInput: null as SelectItem | null,
    }
  },
  methods: {
    handleChangeCurrency() {
      if (this.suggestedInput) {
        this.$emit('updateCurrency', this.suggestedInput.text)
      } else {
        this.$emit('updateCurrency', '')
      }
    },
    handleCurrencyClear() {
      this.suggestedInput = null
      this.resetCurrencies()
    },
    handleChangeCurrencySearch(newCurrency: string) {
      if (!newCurrency) {
        this.resetCurrencies()
        return
      }
      this.suggestedCurrencies = CURRENCY
          .filter((currency: string) => currency.toLowerCase().includes(newCurrency.toLowerCase()))
          .map((currency: string) => ({
            text: currency,
            value: currency,
          }))
    },
    resetCurrencies() {
      this.suggestedCurrencies = CURRENCY.map((currency: string) => ({
        text: currency,
        value: currency,
      }))
    },
  },
  beforeMount() {
    this.resetCurrencies()
    if (this.currency) {
      this.suggestedInput = { text: this.currency || '' }
    } else {
      this.suggestedInput = null
    }
  },
  watch: {
    currency(next) {
      this.resetCurrencies()
      if (next) {
        this.suggestedInput = { text: next || '' }
      } else {
        this.suggestedInput = null
      }
    },
  },
})
</script>
