<template>
  <div id="retailer-create-profil" data-id="retailer-create-profil">
    <!-- title -->
    <v-row no-gutters class="title-outer-wrapper">
      <v-col cols="12">
        <h2 data-id="retailer-create-profil-title">{{ $t('common.profile') }}</h2>
      </v-col>
    </v-row>

    <!-- form -->
    <v-row no-gutters>
      <v-col cols="12" md="8" lg="6" class="left-column">
        <v-row class="mp-row" no-gutters>
          <v-col cols="12">
            <mp-textfield
              dataId="retailer-create-profil-name"
              :label="`${$t('common.name')} *`"
              v-model="retailer.name"
              name="retailer-create-profil-name"
              @input="$v.retailer.name.$touch()"
              @blur="$v.retailer.name.$touch()"
              :errors="getModelErrors($v.retailer.name)"
              :isDirty="$v.retailer.name.$dirty"
            />
          </v-col>
        </v-row>

        <v-row class="mp-row" no-gutters>
          <v-col cols="12" class="code-wrapper">
            <mp-textfield
              dataId="retailer-create-profil-code"
              :label="`${$t('page.retailers.code')} *`"
              v-model="code"
              name="retailer-create-profil-code"
              disabled
            />
          </v-col>
        </v-row>

        <v-row class="mp-row" no-gutters>
          <v-col cols="12">
            <mp-textfield
              dataId="retailer-create-profil-smsSendingName"
              :label="`${$t('page.createOrder.smsSendingName')} *`"
              v-model="retailer.smsSendingName"
              name="retailer-create-profil-smsSendingName"
              @input="$v.retailer.smsSendingName.$touch()"
              @blur="$v.retailer.smsSendingName.$touch()"
              :errors="getModelErrors($v.retailer.smsSendingName)"
              :isDirty="$v.retailer.smsSendingName.$dirty"
            />
          </v-col>
        </v-row>

        <v-row class="mp-row" no-gutters>
          <v-col cols="12">
            <mp-textfield
              dataId="retailer-create-profil-externalRetailerId"
              :label="`${$t('page.createOrder.id')} *`"
              v-model="retailer.externalRetailerId"
              name="retailerID"
              @input="$v.retailer.externalRetailerId.$touch()"
              @blur="$v.retailer.externalRetailerId.$touch()"
              :errors="getModelErrors($v.retailer.externalRetailerId)"
              :isDirty="$v.retailer.externalRetailerId.$dirty"
            />
          </v-col>
        </v-row>

        <v-row class="mp-row" no-gutters>
          <v-col cols="12">
            <mp-textfield
              dataId="retailer-create-profil-authProviderId"
              :label="`${$t('page.retailers.authProviderID')}`"
              v-model="retailer.authProviderId"
              name="retailer-create-profil-authProviderId"
              @input="$v.retailer.authProviderId.$touch()"
              @blur="$v.retailer.authProviderId.$touch()"
              :errors="getModelErrors($v.retailer.authProviderId)"
              :isDirty="$v.retailer.authProviderId.$dirty"
            />
          </v-col>
        </v-row>

        <v-row no-gutters class="mp-row">
          <v-col cols="12" class="mb-4 d-flex justify-space-between">
            <p>{{ $t('page.carrier.passwordLess') }} *</p>

            <mp-switch
              :disabled="
                !isAuthorized('TOGGLE_PASSWORDLESS_RETAILERS', { retailerId: retailer.id })
              "
              v-model="retailer.passwordLess"
              required
              dataId="retailer-create-profil-passwordLess"
            />
          </v-col>
        </v-row>

        <v-row class="mp-row" no-gutters>
          <v-col cols="12">
            <mp-select
              ref="retailer-create-profil-countries"
              :label="$t('common.country.base')"
              v-model="retailer.countries[0]"
              :items="getCountryItems()"
              clearable
              dataId="retailer-list-retailersFilters-form-country"
            />
          </v-col>
        </v-row>

        <v-row class="mp-row" no-gutters>
          <v-col cols="12">
            <mp-input-file
              ref="file__logo"
              :label="
                `${$t('page.createOrder.logo')} ${$t('common.maxSizeLogo')}${
                  requiredLogo ? ' *' : ''
                }`
              "
              dense
              @change="handleChangeFile($event)"
              @clickClear="clearFile()"
              v-model="retailer.logo"
              appendIcon="mdi-paperclip"
              dataId="retailer-create-profil-logo"
              @input="$v.retailer.logo.$touch()"
              @blur="$v.retailer.logo.$touch()"
              :errors="getModelErrors($v.retailer.logo)"
              :isDirty="$v.retailer.logo.$dirty"
            />
          </v-col>
        </v-row>

        <v-row class="mp-row" no-gutters>
          <v-col cols="12">
            <div
              id="logo-preview"
              @click="handleClickLogo()"
              data-id="retailer-create-profil-logoPreview"
            >
              <v-img id="logo" contain v-if="urlLogo" :src="urlLogo" />
              <v-icon v-else>mdi-camera</v-icon>
            </div>
          </v-col>
        </v-row>

        <v-row class="mp-row" no-gutters>
          <v-col cols="12">
            <mp-color-picker
              dataId="retailer-create-profil-colorpicker"
              v-model="retailer.brandColor"
              @input="$v.retailer.logo.$touch()"
              @blur="$v.retailer.logo.$touch()"
              :errors="getModelErrors($v.retailer.logo)"
              :isDirty="$v.retailer.logo.$dirty"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { COUNTRY } from '@/constants/shared'
import mixins from 'vue-typed-mixins'
import { RetailerEntity, SelectItem } from '@/types'

import slugify from 'slugify'
import { ROUTES, MAX_LOGO_SIZE } from '@/constants'

import { authorizationMixin, validationMixin } from '@/mixins'
import { required, minLength, maxLength, requiredIf } from 'vuelidate/lib/validators'

export default mixins(validationMixin, authorizationMixin).extend({
  name: 'retailer-create-profil',
  props: {
    retailer: {
      type: Object as () => RetailerEntity,
      required: true,
    },
  },
  data: () => ({
    urlLogo: '',
    requiredLogo: false,
  }),
  computed: {
    code() {
      if (this.$route.name === ROUTES.editRetailer) {
        return this.retailer.code
      }
      return slugify(this.retailer.name, { lower: true, remove: /[*+~.()'"!{}:§@]/g })
    },
    getPasswordLessValues(): SelectItem[] {
      return [
        { text: this.$t(`common.no`), value: false },
        { text: this.$t(`common.yes`), value: true },
      ]
    },
  },
  validations() {
    const { requiredLogo } = this

    return {
      retailer: {
        name: { required },
        smsSendingName: { required, minLength: minLength(3), maxLength: maxLength(11) },
        externalRetailerId: { required },
        authProviderId: {},
        logo: {
          required: requiredIf(() => {
            return requiredLogo
          }),
          maxSizeLogo(file: File) {
            return (this as any).maxSizeLogo(file, MAX_LOGO_SIZE)
          },
        },
        brandColor: { required },
        passwordLess: { required },
      },
    }
  },
  beforeMount() {
    if (this.retailer.logo) {
      this.urlLogo = this.retailer.logo
      this.retailer.logo = null
      this.requiredLogo = false
    } else {
      this.requiredLogo = true
    }

    if (!this.retailer.countries) {
      this.retailer.countries = []
    }
  },
  mounted() {
    this.$emit('invalid', this.$v.retailer.$invalid)
  },
  methods: {
    handleClickLogo() {
      ;(this.$refs.file__logo as any).openInputFile()
    },
    handleChangeFile(value: File) {
      if (value) {
        this.urlLogo = URL.createObjectURL(value)
      }
    },
    clearFile() {
      URL.revokeObjectURL(this.urlLogo)
      this.urlLogo = ''
    },
    getCountryItems() {
      return Object.values(COUNTRY).map(value => ({
        text: this.$t(`common.country.${value}`),
        value,
      }))
    },
  },
  watch: {
    'retailer.logo'(next) {
      if (next === undefined) {
        this.retailer.logo = null
      }
    },
    '$v.retailer.$invalid'(next) {
      this.$emit('invalid', next)
    },
  },
})
</script>

<style lang="scss">
#retailer-create-profil {
  padding: 0;

  .title-outer-wrapper {
    margin-bottom: 2.6rem;
  }

  .left-column {
    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      padding-right: 2rem;
    }
  }

  .right-column {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #logo-preview {
    width: 100%;
    height: 8.4rem;
    border: 0.1rem solid $main-lighten-74-color;
    display: flex;
    align-self: end;
    justify-content: center;
    align-items: center;
    @media #{map-get($display-breakpoints, 'xs-only')} {
      margin: auto 0 2rem;
    }
    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      margin: auto 0 4.2rem;
    }
    .mdi-camera {
      color: $main-lighten-65-color;
    }
  }
  #logo {
    max-width: 100%;
    max-height: 100%;
  }

  .code-wrapper {
    input {
      text-overflow: ellipsis;
    }
  }

  .maxSizeInfo {
    @include medium-12();
    color: $main-lighten-65-color;
    font-style: italic;
  }
}
</style>
