<template>
  <div id="mp-phone-number-wrapper" :data-id="dataId">
    <v-select
      :label="label"
      :items="countries"
      class="country-select"
      item-value="iso2"
      v-model="selectedCountry"
      @change="handleCountryChange($event)"
      return-object
      :menu-props="{ offsetY: true }"
      @blur="handleEventBlur()"
      :data-id="`${dataId}-select`"
    >
      <template #item="{ item }">
        <v-row no-gutters>
          <v-col cols="12" class="d-flex align-center">
            <div :class="['flag-selector', item.iso2.toLowerCase()]" />
            <span class="main-color ml-2"> {{ item.name }} ({{ item.dialCode }}) </span>
          </v-col>
        </v-row>
      </template>

      <template #selection="{ item }">
        <div :class="['flag-selector', item.iso2.toLowerCase()]" />
      </template>
    </v-select>

    <v-text-field
      v-model="localPhoneNumber"
      class="country-field"
      type="tel"
      :error="!Boolean(errors) || !Boolean(errors.length)"
      :error-messages="localPhoneNumber ? errors : []"
      @blur="handleEventBlur()"
      :data-id="`${dataId}-input`"
    >
      <template #prepend-inner v-if="selectedCountry">
        <span class="main-color prepend">+ {{ selectedCountry.dialCode }}</span>
      </template>

      <template #append v-if="localPhoneNumber">
        <v-icon v-if="!errors || !errors.length">mdi-check-bold</v-icon>
        <v-icon v-else>mdi-exclamation-thick</v-icon>
      </template>
    </v-text-field>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import phoneHelper from '@/helpers/phoneHelper'

import countries from './countries'
import { CurrentUserEntity } from '@/types'
import { LANGUAGES_TO_CODE_ISO2 } from '@/constants/shared'

interface Country {
  name: string | number
  iso2: any
  dialCode: string | number
}

export default Vue.extend({
  name: 'mp-phone-input',
  props: {
    value: {
      type: String,
      required: true,
    },
    errors: {
      type: Array as () => string[],
      required: true,
    },
    checkOnMounted: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      required: true,
    },
    dataId: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    countries: [] as Country[],
    selectedCountry: null as Country | null,
    localPhoneNumber: '',
  }),
  computed: {
    currentUser(): CurrentUserEntity {
        return this.$store.getters['auth/currentUser']
    },
  },
  async beforeMount() {
    const allCountries = countries.allCountries()
    const phoneCountries = phoneHelper.getCountries()

    this.countries = allCountries.filter(({ iso2 }) => phoneCountries.includes(iso2))

    let defaultCountry =
      this.countries.find(
        country => country.iso2 === LANGUAGES_TO_CODE_ISO2[this.currentUser.language].toUpperCase(),
      )?.iso2 ?? 'FR'

    if (this.value) {
      defaultCountry = this.countries?.find((c) => this.value.startsWith(`+${c.dialCode}`))?.iso2
    }

    this.selectedCountry = this.countries.find(country => country.iso2 === defaultCountry)!

    if (this.value) {
      this.localPhoneNumber = this.value.replace(`+${this.selectedCountry.dialCode}`, '')

      if (this.localPhoneNumber.includes('+')) {
        this.localPhoneNumber = this.localPhoneNumber.replace('+', '')
      }
    }

    this.handleEventInput(this.localPhoneNumber)
  },
  methods: {
    handleCountryChange(): void {
      this.handleEventInput(this.localPhoneNumber)
    },
    handleEventInput(num: string) {
      this.$emit('input', `+${this.selectedCountry!.dialCode}${num}`)
    },
    handleEventBlur() {
      this.$emit('blur')
    },
  },
  watch: {
    localPhoneNumber(next: string) {
      this.handleEventInput(next)
    },
  },
})
</script>

<style lang="scss">

#mp-phone-number-wrapper {
  display: flex;
  align-items: center;

  .country-select {
    max-width: 6rem;
    margin-right: 1rem !important;

    .mdi-close-circle {
      color: $main-color;
    }

    &:not(.mp-select__multiple) .v-select__slot {
      height: 3.2rem;
    }

    .v-input__append-inner {
      .v-input__icon--clear button:hover {
        color: $main-color;
      }
    }

    &:hover {
      .v-input__append-inner {
        .mdi-chevron-down {
          color: $main-color;
        }
      }
    }

    &.v-input--is-focused {
      color: $success-color !important;

      .v-label--active {
        color: $success-color !important;
      }

      .v-input__append-inner {
        .v-input__icon--clear button {
          color: $success-color !important;
        }
      }
    }

    .v-label {
      color: $main-lighten-52-color;

      &.v-label--active {
        color: $main-lighten-65-color;
      }
    }

    .mdi-menu-down {
      color: $main-color !important;
    }
  }

  .country-field {
    .v-input__prepend-inner {
      padding-top: 0.8rem;
      padding-bottom: 0.8rem;
      margin-top: 0;

      .prepend {
        min-width: max-content;
      }
    }

    &.v-input--is-focused {
      color: $success-color !important;
      caret-color: $success-color !important;

      .v-label--active {
        color: $success-color !important;
      }
    }

    &.v-input--is-disabled {
      color: $main-lighten-65-color !important;

      .v-label--active {
        color: $main-lighten-65-color !important;
      }
    }

    .v-label {
      color: $main-lighten-52-color;

      &.v-label--active {
        color: $main-lighten-65-color !important;
      }
    }
  }
}
</style>
