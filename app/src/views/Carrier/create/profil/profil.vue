<template>
  <div id="carrier-create-profil" data-id="carrier-create-profil">
    <!-- state -->
    <v-row no-gutters class="title-outer-wrapper">
      <v-col cols="12">
        <h2 data-id="carrier-create-profil-state-title">{{ $t('common.state') }}</h2>
      </v-col>
    </v-row>

    <!-- form -->
    <v-row no-gutters>
      <v-col cols="12" md="8" lg="6" class="left-column">
        <v-row no-gutters class="mp-row">
          <v-col cols="3">
            <mp-checkbox-new
              class="regular16 checkbox-color"
              :label="$t('common.private')"
              :input-value="carrier.isPrivate"
              dataId="carrier-create-profil-state-private"
              @change="carrier.isPrivate = $event"
            />
          </v-col>
          <v-col cols="3">
            <mp-checkbox-new
              class="regular16 checkbox-color"
              :label="$t('action.new.base')"
              :input-value="carrier.isNew"
              dataId="carrier-create-profil-state-new"
              @change="carrier.isNew = $event"
            />
          </v-col>
          <v-col cols="3" v-if="isAuthorized('CREATE_CARRIERS')">
            <mp-checkbox-new
              class="regular16 checkbox-color"
              :label="$t('common.label')"
              :input-value="carrier.isLabeled"
              dataId="carrier-create-profil-label"
              @change="carrier.isLabeled = $event"
            />
          </v-col>
        </v-row>

        <v-row class="mb-5 mt-8" no-gutters>
          <v-col cols="12">
            <mp-select
              :label="`${$t('common.integrated.level')} *`"
              v-model="carrier.status"
              :items="getIntegrationStatus()"
              @input="$v.carrier.status.$touch()"
              @blur="$v.carrier.status.$touch()"
              :errors="getModelErrors($v.carrier.status)"
              :isDirty="$v.carrier.status.$dirty"
              attach="#carrier-filters-status-select"
              dropdownId="carrier-filters-status-select"
              dataId="carrier-list-carriersFilters-form-status"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- profile -->
    <v-row no-gutters class="title-outer-wrapper">
      <v-col cols="12">
        <h2 data-id="carrier-create-profil-title">{{ $t('common.profile') }}</h2>
      </v-col>
    </v-row>

    <!-- form -->
    <v-row no-gutters>
      <v-col cols="12" md="8" lg="6" class="left-column">
        <v-row no-gutters class="mp-row">
          <v-col cols="12">
            <mp-textfield
              dataId="carrier-create-profil-name"
              :label="`${$t('common.name')} *`"
              v-model="carrier.name"
              name="carrier-create-profil-name"
              @input="$v.carrier.name.$touch()"
              @blur="$v.carrier.name.$touch()"
              :errors="getModelErrors($v.carrier.name)"
              :isDirty="$v.carrier.name.$dirty"
              :maxlength="36"
            />
          </v-col>
        </v-row>

        <v-row no-gutters class="mp-row">
          <v-col cols="12" class="code-wrapper">
            <mp-textfield
              dataId="carrier-create-profil-code"
              :label="`${$t('page.carrier.code')} *`"
              v-model="code"
              name="carrier-create-profil-code"
              disabled
            />
          </v-col>
        </v-row>

        <v-row no-gutters class="mp-row">
          <v-col cols="12">
            <mp-textfield
              dataId="carrier-create-siret"
              label="SIRET"
              v-model="carrier.siret"
              name="carrier-create-profil-siret"
              @input="$v.carrier.siret.$touch()"
              @blur="$v.carrier.siret.$touch()"
              :errors="getModelErrors($v.carrier.siret)"
              :isDirty="$v.carrier.siret.$dirty"
            />
          </v-col>
        </v-row>

        <v-row class="mp-row" no-gutters>
          <v-col cols="12">
            <mp-textfield
              dataId="carrier-create-profil-authProviderId"
              :label="`${$t('page.retailers.authProviderID')}`"
              v-model="carrier.authProviderId"
              name="carrier-create-profil-authProviderId"
              @input="$v.carrier.authProviderId.$touch()"
              @blur="$v.carrier.authProviderId.$touch()"
            />
          </v-col>
        </v-row>

        <v-row no-gutters class="mp-row">
          <v-col cols="12" class="d-flex justify-space-between">
            <p>{{ $t('page.carrier.passwordLess') }}</p>

            <mp-switch
              :disabled="
                !isAuthorized('TOGGLE_PASSWORDLESS_CARRIERS', {
                  ...(carrier.id && { carrierId: carrier.id }),
                })
              "
              v-model="carrier.passwordLess"
              required
              dataId="carrier-create-profil-passwordLess"
            />
          </v-col>
        </v-row>

        <div class="description-wrapper">
          <v-row no-gutters class="chip-outer-wrapper">
            <span class="regular16 mb-3 main-lighten-52">{{ $t('page.retailerDetail.languageDetail') }}</span>
            <v-col cols="12">
              <mp-chips-wrapper
                dataId="carrier-create-profile-description-chipsWrapper"
                :chips="descriptionLanguages"
                :maxChips="$vuetify.breakpoint.xsOnly ? 2 : 3"
                v-model="selectedLanguage"
                @input="languageChange($event)"
              />
            </v-col>
          </v-row>

          <div v-for="{ value } in descriptionLanguages" :key="`carrier-desc-${value}`">
            <v-row no-gutters v-if="value === selectedLanguage.value">
              <v-col cols="12">
                <mp-textfield
                  :dataId="`carrier-create-profil-description-${value}`"
                  :label="`${$t('common.description')}`"
                  v-model="carrier.description[value]"
                  :maxlength="80"
                  :name="`carrier-create-profil-description-${value}`"
                />
              </v-col>
            </v-row>
          </div>
        </div>

        <v-row class="mb-5" no-gutters>
          <v-col cols="12">
            <mp-select
              :label="`${$t('common.ecology.level')} *`"
              v-model="carrier.ecologyType"
              :items="getEcologyItems()"
              attach="#carrier-filters-ecology-select"
              dropdownId="carrier-filters-ecology-select"
              dataId="carrier-list-carriersFilters-form-ecology"
              @input="$v.carrier.ecologyType.$touch()"
              @blur="$v.carrier.ecologyType.$touch()"
              :errors="getModelErrors($v.carrier.ecologyType)"
              :isDirty="$v.carrier.ecologyType.$dirty"
            />
          </v-col>
        </v-row>

        <v-row no-gutters class="mp-row">
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
              v-model="carrier.logo"
              appendIcon="mdi-paperclip"
              dataId="carrier-create-profil-file"
              @input="$v.carrier.logo.$touch()"
              @blur="$v.carrier.logo.$touch()"
              :errors="getModelErrors($v.carrier.logo)"
              :isDirty="$v.carrier.logo.$dirty"
            />
          </v-col>
        </v-row>
        <v-row no-gutters class="mp-row">
          <v-col cols="12">
            <div
              id="logo-preview"
              @click="handleClickLogo()"
              data-id="carrier-create-profil-logo-preview"
            >
              <v-img id="logo" contain v-if="urlLogo" :src="urlLogo" />
              <v-icon v-else>mdi-camera</v-icon>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { ROUTES, MAX_LOGO_SIZE } from '@/constants'
import { authorizationMixin, validationMixin } from '@/mixins'
import { AVAILABLE_LANGUAGES } from '@/plugins/i18n'

import { CarrierEntity, ECOLOGY_TYPE, INTEGRATION_STATUS, SelectItem } from '@/types'

import slugify from 'slugify'
import mixins from 'vue-typed-mixins'
import { maxLength, required, requiredIf } from 'vuelidate/lib/validators'

export default mixins(validationMixin, authorizationMixin).extend({
  name: 'carrier-create-profil',
  props: {
    carrier: {
      type: Object as () => CarrierEntity,
      required: true,
    },
  },
  data: () => ({
    urlLogo: '' as string,
    requiredLogo: false,
    ecology: [] as Array<{ name: string; id: ECOLOGY_TYPE }>,
    status: [] as Array<{ name: string; id: INTEGRATION_STATUS }>,
    selectedLanguage: {} as { text: string; value: string },
    descriptionLanguages: [] as Array<Record<string, any>>,
  }),
  computed: {
    code: {
      get(): string {
        if (this.$route.name === ROUTES.editCarrier) {
          return this.carrier.code || ''
        }
        return slugify(this.carrier.name, {
          lower: true,
          remove: /[*+~.()'"!{}:§@]/g,
        })
      },
      set() {
        // neccesary for TS
      },
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
      carrier: {
        name: { required },
        passwordLess: { required },
        ecologyType: { required },
        status: { required },
        logo: {
          required: requiredIf(() => {
            return requiredLogo
          }),
          maxSizeLogo(file: File) {
            return (this as any).maxSizeLogo(file, MAX_LOGO_SIZE)
          },
        },
        siret: {
          maxLength: maxLength(50),
        },
      },
    }
  },
  beforeMount() {
    this.carrier.description = this.carrier.description ?? {}

    this.ecology = [
      { name: this.$t('common.ecology.full'), id: ECOLOGY_TYPE.FULL },
      { name: this.$t('common.ecology.partial'), id: ECOLOGY_TYPE.PARTIAL },
      { name: this.$t('common.ecology.none'), id: ECOLOGY_TYPE.NONE },
    ]

    this.descriptionLanguages = AVAILABLE_LANGUAGES.map(languageCode => {
      return {
        text: this.$t(`common.languages.${languageCode}`),
        value: languageCode,
        prependIcon: this.carrier.description?.[languageCode]
          ? 'mdi-check-bold'
          : 'mdi-close-thick',
      }
    }).sort(
      (languageA, languageB) =>
        Number(!!this.carrier.description?.[languageB.value]) -
        Number(!!this.carrier.description?.[languageA.value]),
    )

    this.status = [
      { name: this.$t('common.integrated.study'), id: INTEGRATION_STATUS.STUDY },
      { name: this.$t('common.integrated.onGoing'), id: INTEGRATION_STATUS.IN_PROGRESS },
      { name: this.$t('common.integrated.base'), id: INTEGRATION_STATUS.INTEGRATED },
    ]

    if (this.carrier.logo) {
      this.urlLogo = this.carrier.logo as string
      this.carrier.logo = null
      this.requiredLogo = false
    } else {
      this.requiredLogo = true
    }
  },
  methods: {
    languageChange(newLanguage: { text: string; value: string }) {
      this.selectedLanguage = newLanguage
    },
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
    getEcologyItems(): Record<string, any> {
      return this.ecology.length
        ? this.ecology.map(({ id, name }: any) => ({
            value: id,
            text: name,
          }))
        : []
    },
    getIntegrationStatus(): Record<string, any> {
      return this.status.length
        ? this.status.map(({ id, name }: any) => ({
            value: id,
            text: name,
          }))
        : []
    },
  },
  watch: {
    '$v.carrier.$invalid': {
      deep: true,
      handler(next) {
        this.$emit('invalid', next)
      },
  }
  },
})
</script>

<style lang="scss">
#carrier-create-profil {
  padding: 0;

  .switch-wrapper {
    justify-content: space-between;
    min-height: 5rem;
    border-bottom: 0.1rem solid $main-lighten-65-color;
  }

  .title-outer-wrapper {
    margin-bottom: 2.6rem;
  }

  .left-column {
    .description-wrapper {
      background-color: $main-lighten-80-color;
      padding: 2rem 2rem 0 2rem;
      margin-bottom: 2.3rem;

      .chip-outer-wrapper {
        width: fit-content;
        padding-right: 2.3rem;

        .chip-wrapper {
          max-width: fit-content;
          margin: 0 1.2rem 0.5rem 0;

          &:last-child {
            margin-right: 0;
          }

          .chip {
            cursor: pointer;

            &.chip-dsk {
              .v-chip__content {
                @include regular-14;
              }
            }

            &.chip-mobile {
              .v-chip__content {
                @include regular-16;
              }
            }

            &.chip-selected {
              background-color: $white;
              border: solid 0.2rem $main-color;
              border-radius: 5rem;
              cursor: default;
            }

            &.chip-no-selected {
              background-color: $white;
              border: solid 0.1rem $main-lighten-74-color;
            }
          }
        }
      }
    }
  }

  .right-column {
    @media #{map-get($display-breakpoints, 'lg-and-up')} {
      padding-left: 3rem;
    }
    display: flex;
    align-items: flex-end;
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
      margin: auto 0 3.5rem;
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
}
</style>
