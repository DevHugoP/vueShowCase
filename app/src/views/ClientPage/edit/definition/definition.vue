<template>
  <div id="client-page-edit-definition" class="pa-0" data-id="client-page-edit-definition">
    <v-row no-gutters class="mb-5">
      <v-col cols="12">
        <h2 data-id="client-page-edit-definition-title">{{ $t('common.definition') }}</h2>
      </v-col>
    </v-row>

    <v-row no-gutters class="mb-5">
      <v-col cols="12" md="8" lg="6">
        <mp-textfield
          :label="`${$t('page.editClientPage.pageName')} *`"
          v-model="clientPage.config.title"
          dataId="client-page-edit-definition-form-title"
          @input="validations.config.title.$touch()"
          @blur="validations.config.title.$touch()"
          :errors="getModelErrors(validations.config.title)"
          :isDirty="validations.config.title.$dirty"
        />
      </v-col>
    </v-row>

    <v-row no-gutters class="mb-5">
      <v-col cols="12" md="8" lg="6">
        <mp-radio-group
          row
          required
          dataId="client-page-edit-definition-category"
          name="handlingUnit"
          v-model="clientPage.category"
          :radioValues="categoryItems"
          :disabled="isEditingPage"
          :propsRadio="{
            class: 'shadow-hover',
          }"
        />
      </v-col>
    </v-row>

    <v-row no-gutters class="mb-5">
      <v-col cols="12" md="8" lg="6">
        <mp-select
          :label="`${$t('page.editClientPage.definition.type')} *`"
          v-model="clientPage.type"
          :items="typeItems"
          clearable
          @input="validations.type.$touch()"
          @blur="validations.type.$touch()"
          :errors="getModelErrors(validations.type)"
          :isDirty="validations.type.$dirty"
          dataId="client-page-edit-definition-form-type"
          @change="getLanguages($event)"
          :disabled="isEditingPage || !clientPage.category"
        />
      </v-col>
    </v-row>

    <v-row no-gutters class="mb-5">
      <v-col cols="12" md="8" lg="6">
        <mp-select
          :disabled="!clientPage.type || isEditingPage"
          :label="`${$t('common.language')} *`"
          v-model="clientPage.language"
          :items="languageItems"
          clearable
          @input="validations.language.$touch()"
          @blur="validations.language.$touch()"
          :errors="getModelErrors(validations.language)"
          :isDirty="validations.language.$dirty"
          dataId="client-page-edit-definition-form-language"
        />
      </v-col>
    </v-row>

    <v-row no-gutters class="mb-5">
      <v-col cols="12" md="8" lg="6" class="d-flex align-center">
        <mp-switch
          :disabled="typeIsDisabled(clientPage.type)"
          v-model="clientPage.config.default"
          dataId="client-page-edit-definition-form-switchDefaultWoopData"
        />
        <span class="regular16 main-lighten-28">
          {{ $t('page.editClientPage.useDefaultWoopData') }}
        </span>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'
import { AVAILABLE_LANGUAGES } from '@/plugins/i18n'

import { ClientPage } from '@/types'

import { validationMixin } from '@/mixins'
import {
  ClientPageType,
  ROUTES,
  DISABLED_DEFAULT_CLIENT_PAGE_TYPE,
  ClientPageCategory,
  CollectClientPageType,
} from '@/constants'
import ClientPageService from '@/services/clientPage/clientPageService'

export default mixins(validationMixin).extend({
  name: 'client-page-edit-definition',
  props: {
    clientPage: {
      type: Object as () => ClientPage,
      required: true,
    },
    validations: {
      type: Object as () => Record<string, any>,
      required: true,
    },
  },
  data: () => ({
    alreadyUsedLanguages: [] as string[],
    saveCurrentLanguage: '',
  }),
  computed: {
    languageItems() {
      return Object.values(AVAILABLE_LANGUAGES as string[])
        .filter(language => {
          if (language === this.clientPage.language) {
            return true
          }
          return !this.alreadyUsedLanguages.includes(language)
        })
        .map(value => ({
          value,
          text: this.$t(`common.languages.${value}`),
        }))
    },
    typeItems() {
      if (!this.clientPage.category) {
        return
      }

      return Object.values(ClientPageType[this.clientPage.category as ClientPageCategory]).map(
        value => ({
          value,
          text: this.$t(`technical.clientPage.type.${value}`),
        }),
      )
    },
    categoryItems() {
      return Object.values(ClientPageCategory).map(value => ({
        value,
        label: this.$t(`technical.clientPage.category.${value}`),
      }))
    },
    isEditingPage() {
      return this.$route.name === ROUTES.editClientPage
    },
  },
  beforeMount() {
    this.saveCurrentLanguage =
      this.$route.name === ROUTES.editClientPage ? this.clientPage.language : ''
  },
  mounted() {
    if (this.clientPage.type) {
      this.getLanguages(this.clientPage.type)
    }
  },
  methods: {
    async getLanguages(type: string) {
      const { id: retailerId } = this.$route.params

      try {
        this.alreadyUsedLanguages = await ClientPageService.getLanguages({
          retailerId: Number(retailerId),
          type,
        })
      } catch (e) {
        if (e.message.includes('404')) {
          this.alreadyUsedLanguages = []
        }
      }
    },
    typeIsDisabled(type: CollectClientPageType) {
      return !this.clientPage.type || DISABLED_DEFAULT_CLIENT_PAGE_TYPE.includes(type)
    },
  },
  watch: {
    'clientPage.category'(next) {
      this.$emit('changeCategory', next)
    },
    'clientPage.type'(next) {
      this.$emit('changeType', next)
    },
  },
})
</script>

<style lang="scss" scoped>
#client-page-edit-definition {
  .main-lighten-28 {
    color: $main-lighten-28-color;
  }
}
</style>
