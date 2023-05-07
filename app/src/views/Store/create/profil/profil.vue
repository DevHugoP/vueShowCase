<template>
  <div id="store-create-profil" data-id="store-create-profil">
    <v-row no-gutters class="title-outer-wrapper">
      <v-col cols="12">
        <h2 data-id="store-create-profil-title">{{ $t('common.profile') }}</h2>
      </v-col>
    </v-row>

    <v-row no-gutters class="switch-outer-wrapper">
      <v-col cols="12" md="8" lg="6" class="switch-wrapper">
        <mp-switch v-model="store.active" dataId="store-create-profil-form-switchActive" />
        <span class="regular16">{{ $t('common.active') }}</span>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="12" md="8" lg="6">
        <mp-textfield
          :label="`${$t('common.name')} *`"
          name="create-store__name"
          v-model="store.name"
          dataId="store-create-profil-form-name"
          @input="$v.store.name.$touch()"
          @blur="$v.store.name.$touch()"
          :errors="getModelErrors($v.store.name)"
          :isDirty="$v.store.name.$dirty"
        />
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="12" md="8" lg="6" class="d-flex justify-space-between">
        <p>{{ $t('page.store.detail.language') }} *</p>

        <mp-language-switch
          dataId="store-create-profil-form-language-switch"
          :selectedLanguage="store.language"
          @input="changeLanguage($event)"
          :countries="countries"
          :countriesName="languagesNames"
        />
      </v-col>
    </v-row>

    <v-row no-gutters class="mt-2">
      <v-col cols="12" md="8" lg="6">
        <timezone-autocomplete
          :timezone="store.timezone"
          dataId="store-create-profil-form-timezone"
          @updateTimezone="handleChangeTimezone($event)"
          :label="`${$t('common.timezone')} *`"
          @input="$v.store.timezone.$touch()"
          @blur="$v.store.timezone.$touch()"
          :errors="getModelErrors($v.store.timezone)"
          :isDirty="$v.store.timezone.$dirty"
        />
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="12" md="8" lg="6">
        <mp-textfield
          :label="`${$t('page.store.create.externalStoreId')} *`"
          name="create-store__external-store-id"
          v-model="store.externalStoreId"
          dataId="store-create-profil-form-externalStoreId"
          @input="$v.store.externalStoreId.$touch()"
          @blur="$v.store.externalStoreId.$touch()"
          :errors="getModelErrors($v.store.externalStoreId)"
          :isDirty="$v.store.externalStoreId.$dirty"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'

import { StoreEntity } from '@/types'

import { validationMixin } from '@/mixins'
import { required } from 'vuelidate/lib/validators'
import { AVAILABLE_LANGUAGES, TRANSLATED_LANGUAGES } from '@/plugins/i18n'
import TimezoneAutocomplete from '@/components/form/timezoneAutocomplete/timezoneAutocomplete.vue'

export default mixins(validationMixin).extend({
  name: 'store-create-profil',
  components: {
    TimezoneAutocomplete,
  },
  props: {
    store: {
      type: Object as () => StoreEntity,
      required: true,
    },
  },
  validations: {
    store: {
      name: { required },
      externalStoreId: { required },
      timezone: { required },
      language: { required },
    },
  },
  computed: {
    languagesNames() {
      return AVAILABLE_LANGUAGES.reduce(
        (languagesNames, language) => ({
          ...languagesNames,
          [language]: TRANSLATED_LANGUAGES[`${language}`],
        }),
        {},
      )
    },
    countries() {
      return AVAILABLE_LANGUAGES
    },
  },
  mounted() {
    this.$emit('invalid', this.$v.store.$invalid)
  },
  methods: {
    handleChangeTimezone(newTimezone: string) {
      this.store.timezone = newTimezone
    },
    changeLanguage(language: string) {
      this.store.language = language
    },
  },
  watch: {
    '$v.store.$invalid'(next) {
      this.$emit('invalid', next)
    },
  },
})
</script>

<style lang="scss">
#store-create-profil {
  padding: 0;

  .title-outer-wrapper {
    margin-bottom: 2rem;
  }

  .switch-outer-wrapper {
    margin-bottom: 4rem;
  }
}
</style>
