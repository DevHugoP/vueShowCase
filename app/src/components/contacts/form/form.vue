<template>
  <v-container id="contacts-form" :data-id="`${dataId}-form`" v-if="hasLoaded">
    <v-row no-gutters class="form-title-outer-wrapper" v-if="$vuetify.breakpoint.smAndUp">
      <v-col cols="12" class="form-title-wrapper">
        <h3>
          {{ contact.title || $t('page.store.create.contact', { number: index + 1 }) }}
        </h3>
        <mp-button
          v-if="contactLength > 1"
          format="secondary"
          icon="trash-can-outline"
          :dataId="`${dataId}-form-delete`"
          @click="$emit('delete-contact', index)"
        />
      </v-col>
    </v-row>

    <v-row no-gutters class="switch-outer-wrapper">
      <v-col cols="12" class="switch-wrapper">
        <mp-switch
          v-model="contact.main"
          :dataId="`${dataId}-form-mainContact`"
          @change="$emit('change-main-contact', index)"
        />
        <span class="regular16">{{ $t('page.store.create.mainContact') }}</span>
      </v-col>
    </v-row>

    <v-row no-gutters class="mb-5">
      <v-col cols="12">
        <mp-textfield
          :label="`${$t('page.store.create.contactTitle')} *`"
          name="contact-title"
          v-model="contact.title"
          :dataId="`${dataId}-form-title`"
          @input="$v.contact.title.$touch()"
          @blur="$v.contact.title.$touch()"
          :errors="getModelErrors($v.contact.title)"
          :isDirty="$v.contact.title.$dirty"
        />
      </v-col>
    </v-row>

    <v-row no-gutters class="mb-5">
      <v-col cols="12">
        <mp-textfield
          :label="`${$t('common.name')} *`"
          name="contact-lastname"
          v-model="contact.lastName"
          :dataId="`${dataId}-form-lastName`"
          @input="$v.contact.lastName.$touch()"
          @blur="$v.contact.lastName.$touch()"
          :errors="getModelErrors($v.contact.lastName)"
          :isDirty="$v.contact.lastName.$dirty"
        />
      </v-col>
    </v-row>

    <v-row no-gutters class="mb-5">
      <v-col cols="12">
        <mp-textfield
          :label="`${$t('common.firstname')} *`"
          name="contact-firstname"
          v-model="contact.firstName"
          :dataId="`${dataId}-form-firstName`"
          @input="$v.contact.firstName.$touch()"
          @blur="$v.contact.firstName.$touch()"
          :errors="getModelErrors($v.contact.firstName)"
          :isDirty="$v.contact.firstName.$dirty"
        />
      </v-col>
    </v-row>

    <v-row no-gutters class="mb-5">
      <v-col cols="12">
        <mp-textfield
          :label="`${$t('common.email')} *`"
          name="contact-email"
          v-model="contact.email"
          :dataId="`${dataId}-form-email`"
          @input="$v.contact.email.$touch()"
          @blur="$v.contact.email.$touch()"
          :errors="getModelErrors($v.contact.email)"
          :isDirty="$v.contact.email.$dirty"
        />
      </v-col>
    </v-row>

    <v-row no-gutters class="mb-5">
      <v-col cols="12">
        <light-phone-number
          :data="contact"
          :dataId="`${dataId}-form-phone`"
          @invalid="invalids.lightPhoneNumber = $event"
        />
      </v-col>
    </v-row>

    <v-row no-gutters class="mb-5" v-if="withLanguage">
      <v-col cols="12" class="d-flex justify-space-between">
        <p>{{ `${$t('page.store.create.language')} *` }}</p>
        <mp-language-switch
          :dataId="`${dataId}-language-switch`"
          :selectedLanguage="contact.language"
          @input="changeLanguage"
          :countries="countries"
          @blur="$v.contact.language.$touch()"
          :errors="getModelErrors($v.contact.language)"
          :isDirty="$v.contact.language.$dirty"
          :countriesName="languagesNames"
        />
      </v-col>
    </v-row>

    <v-row no-gutters class="mb-5" v-if="withTimezone">
      <v-col cols="12">
        <timezone-autocomplete
          :timezone="contact.timezone"
          :dataId="`${dataId}-timezone`"
          @updateTimezone="handleChangeTimezone($event)"
          :isRequired="true"
        />
      </v-col>
    </v-row>

    <v-row no-gutters class="mb-5">
      <v-col cols="12">
        <v-checkbox
          class="regular16 checkbox-color"
          :label="$t('page.contact.professional')"
          :input-value="contact.isProfessional"
          :dataId="`${dataId}-isProfessional`"
          @change="handleChangeIsProfessional"
        />
      </v-col>
    </v-row>

    <v-row
      no-gutters
      v-if="$vuetify.breakpoint.xsOnly && contactLength > 1"
      class="mobile-action-delete-outer-wrapper"
    >
      <v-col cols="12">
        <mp-button
          :text="$t('page.store.create.deleteContact')"
          icon="trash-can-outline"
          format="secondary"
          :dataId="`${dataId}-form-delete`"
          @click="$emit('delete-contact', index)"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import lightPhoneNumber from '@/components/form/lightPhoneNumber/lightPhoneNumber.vue'

import TimezoneAutocomplete from '@/components/form/timezoneAutocomplete/timezoneAutocomplete.vue'

import { Contact } from '@/types'

import { validationMixin } from '@/mixins'
import mixins from 'vue-typed-mixins'
import { required, email } from 'vuelidate/lib/validators'

import { AVAILABLE_LANGUAGES, TRANSLATED_LANGUAGES } from '@/plugins/i18n'

export default mixins(validationMixin).extend({
  name: 'contacts-form',
  components: {
    lightPhoneNumber,
    TimezoneAutocomplete,
  },
  props: {
    contact: {
      type: Object as () => Contact,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    contactLength: {
      type: Number,
      required: true,
    },
    dataId: {
      type: String,
      required: true,
    },
    withLanguage: {
      type: Boolean,
      default: false,
    },
    withTimezone: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    invalids: {
      lightPhoneNumber: false,
    },
    hasLoaded: false,
  }),
  validations: {
    contact: {
      title: { required },
      lastName: { required },
      firstName: { required },
      email: { required, email },
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
  methods: {
    handleChangeTimezone(newTimezone: string) {
      this.contact.timezone = newTimezone
    },
    changeLanguage(language: string) {
      this.contact.language = language
    },
    handleChangeIsProfessional(isProfessional: boolean) {
      this.contact.isProfessional = isProfessional
    }
  },
  beforeMount() {
    if (this.contact.main === null) {
      this.contact.main = false
    }

    let addToContact = {}

    if (this.withLanguage && !this.contact.language) {
      addToContact = { ...addToContact, language: '' }
    }

    if (this.withTimezone && !this.contact.timezone) {
      addToContact = { ...addToContact, timezone: '' }
    }

    if (Object.keys(addToContact).length) {
      this.$emit('addDataInContact', { ...this.contact, ...addToContact })
    }
  },
  mounted() {
    const invalid = this.invalids.lightPhoneNumber || this.$v.contact.$invalid
    this.$emit('invalid', invalid)
    this.hasLoaded = true
  },
  destroyed() {
    this.$emit('invalid', false)
  },
  watch: {
    '$v.contact.$invalid'(next) {
      const invalid = next || this.invalids.lightPhoneNumber

      this.$emit('invalid', invalid)
    },
    'invalids.lightPhoneNumber'(next) {
      const invalid = next || this.$v.contact.$invalid

      this.$emit('invalid', invalid)
    },
  },
})
</script>

<style lang="scss" scoped>
#contacts-form {
  padding: 0;

  .mobile-action-delete-outer-wrapper {
    margin-top: 3rem;
  }
}
</style>
