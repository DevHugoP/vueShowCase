<template>
  <div id="carrier-create-contact" data-id="carrier-create-contact">
    <v-row no-gutters class="mp-row">
      <v-col cols="12">
        <mp-select
          :label="`${$t('page.store.create.contactTitle')} *`"
          v-model="contact.title"
          :items="contactTitles"
          dataId="carrier-create-contact-title"
          @input="$v.contact.title.$touch()"
          @blur="$v.contact.title.$touch()"
          :errors="getModelErrors($v.contact.title)"
          :isDirty="$v.contact.title.$dirty"
        />
      </v-col>
    </v-row>

    <v-row no-gutters class="mp-row">
      <v-col cols="12">
        <mp-textfield
          dataId="carrier-create-contact-lastname"
          :label="`${$t('common.name')} *`"
          v-model="contact.lastName"
          name="carrier-create-contact-lastname"
          @input="$v.contact.lastName.$touch()"
          @blur="$v.contact.lastName.$touch()"
          :errors="getModelErrors($v.contact.lastName)"
          :isDirty="$v.contact.lastName.$dirty"
        />
      </v-col>
    </v-row>

    <v-row no-gutters class="mp-row">
      <v-col cols="12">
        <mp-textfield
          dataId="carrier-create-contact-fistname"
          :label="`${$t('common.firstname')} *`"
          v-model="contact.firstName"
          name="carrier-create-contact-fistname"
          @input="$v.contact.firstName.$touch()"
          @blur="$v.contact.firstName.$touch()"
          :errors="getModelErrors($v.contact.firstName)"
          :isDirty="$v.contact.firstName.$dirty"
        />
      </v-col>
    </v-row>

    <v-row no-gutters class="mp-row">
      <v-col cols="12">
        <mp-textfield
          type="email"
          dataId="carrier-create-contact-email"
          :label="`${$t('common.email')} *`"
          v-model="contact.email"
          name="carrier-create-contact-email"
          @input="$v.contact.email.$touch()"
          @blur="$v.contact.email.$touch()"
          :errors="getModelErrors($v.contact.email)"
          :isDirty="$v.contact.email.$dirty"
        />
      </v-col>
    </v-row>

    <v-row no-gutters class="mp-row">
      <v-col cols="12">
        <light-phone-number
          :data="contact"
          dataId="carrier-create-contact-phone"
          @invalid="invalids.lightPhoneNumber = $event"
        />
      </v-col>
    </v-row>

    <v-row no-gutters class="mp-row">
      <v-col cols="12" class="d-flex justify-space-between">
        <p>{{ `${$t('page.store.create.language')} *` }}</p>

        <mp-language-switch
          dataId="carrier-create-contact-language-switch"
          :selectedLanguage="contact.language"
          @input="changeLanguage($event)"
          :countries="countries"
          :countriesName="languagesNames"
        />
      </v-col>
    </v-row>

    <v-row no-gutters class="mp-row">
      <v-col cols="12">
        <timezone-autocomplete
          :timezone="contact.timezone"
          dataId="carrier-create-contact-timezone"
          @updateTimezone="handleChangeTimezone($event)"
          :label="$t('common.timezone')"
          @input="$v.contact.timezone.$touch()"
          @blur="$v.contact.timezone.$touch()"
          :errors="getModelErrors($v.contact.timezone)"
          :isDirty="$v.contact.timezone.$dirty"
          :isRequired="true"
        />
      </v-col>
    </v-row>

    <v-row no-gutters class="mp-row">
      <v-col cols="12">
        <mp-textfield
          dataId="carrier-create-contact-claimUrl"
          :label="$t('page.carrier.contact.claim')"
          v-model="urls.claimUrl"
          name="carrier-create-contact-claimUrl"
          @input="$v.urls.claimUrl.$touch()"
          @blur="$v.urls.claimUrl.$touch()"
          :errors="getModelErrors($v.urls.claimUrl)"
          :isDirty="$v.urls.claimUrl.$dirty"
        />
      </v-col>
    </v-row>

    <v-row no-gutters class="mp-row">
      <v-col cols="12">
        <mp-textfield
          dataId="carrier-create-contact-trackingPageUrl"
          :label="$t('page.carrier.trackingPageUrl')"
          v-model="urls.trackingPageUrl"
          name="carrier-create-contact-trackingPageUrl"
          @input="$v.urls.trackingPageUrl.$touch()"
          @blur="$v.urls.trackingPageUrl.$touch()"
          :errors="getModelErrors($v.urls.trackingPageUrl)"
          :isDirty="$v.urls.trackingPageUrl.$dirty"
        />
      </v-col>
    </v-row>

    <v-row no-gutters class="mp-row">
      <v-col cols="12">
        <v-checkbox
          class="regular16 checkbox-color"
          :label="$t('page.contact.professional')"
          :input-value="contact.isProfessional"
          :dataId="`carrier-create-contact-isProfessional`"
          @change="handleChangeIsProfessional"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { CONTACT_TITLES } from '@/constants'
import mixins from 'vue-typed-mixins'

import { Contact, SelectItem } from '@/types'

import lightPhoneNumber from '@/components/form/lightPhoneNumber/lightPhoneNumber.vue'
import { validationMixin } from '@/mixins'
import { required, email, url } from 'vuelidate/lib/validators'
import TimezoneAutocomplete from '@/components/form/timezoneAutocomplete/timezoneAutocomplete.vue'
import { AVAILABLE_LANGUAGES } from '@/plugins/i18n'

export default mixins(validationMixin).extend({
  name: 'carrier-create-contact',
  components: {
    lightPhoneNumber,
    TimezoneAutocomplete,
  },
  props: {
    contact: {
      type: Object as () => Contact,
      required: true,
    },
    urls: {
      type: Object as () => Record<string, any>,
      required: true,
    },
  },
  data: () => ({
    contactTitles: [] as SelectItem[],
    invalids: {
      lightPhoneNumber: false,
    },
  }),
  computed: {
    languagesNames() {
      return AVAILABLE_LANGUAGES.reduce(
          (languagesNames, language) => ({
            ...languagesNames,
            [language]: `${this.$t(`common.languages.${language}`)}`,
          }),
          {},
      )
    },
    countries() {
      return AVAILABLE_LANGUAGES
    },
  },
  validations: {
    contact: {
      title: { required },
      lastName: { required },
      firstName: { required },
      email: { required, email },
      language: { required },
      timezone: { required },
    },
    urls: {
      claimUrl: { url },
      trackingPageUrl: { url },
    }
  },
  beforeMount() {
    const allowedTitles = Object.values(CONTACT_TITLES)
    if (
        this.contact.title &&
        !allowedTitles.includes(this.contact.title)
    ) {
      this.contact.title = ''
    }

    for (const title in CONTACT_TITLES) {
      if (this.contactTitles) {
        this.contactTitles.push({
          value: title,
          text: this.$t(`technical.contactTitles.${title}`),
        })
      }
    }
  },
  mounted() {
    const invalid = this.invalids.lightPhoneNumber || this.$v.contact.$invalid

    this.$emit('invalid', invalid)
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
    },
  },
  watch: {
    '$v.contact.$invalid'(next) {
      const invalid = this.invalids.lightPhoneNumber || next
      this.$emit('invalid', invalid)
    },
    '$v.urls.$invalid'(next) {
      this.$emit('invalid', next)
    },
    'invalids.lightPhoneNumber'(next) {
      const invalid = next || this.$v.contact.$invalid
      this.$emit('invalid', invalid)
    },
  },
})
</script>

<style lang="scss">
#carrier-create-contact {
  padding: 0;
}
</style>
