<template>
  <v-row
    no-gutters
    class="block"
    data-id="order-create-block-deliveryContact"
    id="order-create-block-delivery-contact"
  >
    <v-col cols="12" class="header">
      <h2>{{ $t('page.createOrder.titles.deliveryContact') }}</h2>
      <span class="block-info">{{ $t('page.createOrder.infos.deliveryContact') }}</span>
    </v-col>

    <v-col cols="12" class="content">
      <mp-textfield
        :label="`${$t('common.lastname')} *`"
        v-model="deliveryContact.contact.lastName"
        @input="validations.deliveryContact.contact.lastName.$touch()"
        @blur="validations.deliveryContact.contact.lastName.$touch()"
        :errors="getModelErrors(validations.deliveryContact.contact.lastName)"
        :isDirty="validations.deliveryContact.contact.lastName.$dirty"
        dataId="order-create-deliveryContact-lastname"
        class="mb-5"
      />

      <mp-textfield
        :label="`${$t('common.firstname')} *`"
        v-model="deliveryContact.contact.firstName"
        @input="validations.deliveryContact.contact.firstName.$touch()"
        @blur="validations.deliveryContact.contact.firstName.$touch()"
        :errors="getModelErrors(validations.deliveryContact.contact.firstName)"
        :isDirty="validations.deliveryContact.contact.firstName.$dirty"
        dataId="order-create-deliveryContact-firstname"
        class="mb-5"
      />

      <mp-textfield
        :label="`${$t('common.email')} *`"
        type="email"
        v-model="deliveryContact.contact.email"
        @input="validations.deliveryContact.contact.email.$touch()"
        @blur="validations.deliveryContact.contact.email.$touch()"
        :errors="getModelErrors(validations.deliveryContact.contact.email)"
        :isDirty="validations.deliveryContact.contact.email.$dirty"
        dataId="order-create-deliveryContact-email"
        class="mb-5"
      />

      <mp-phone-number
        :label="`${$t('common.phone')} *`"
        v-model="deliveryContact.contact.phone"
        class="mb-5 phone-number"
        @input="validations.deliveryContact.contact.phone.$touch()"
        @blur="validations.deliveryContact.contact.phone.$touch()"
        :errors="getModelErrors(validations.deliveryContact.contact.phone)"
        :isDirty="validations.deliveryContact.contact.phone.$dirty"
        dataId="order-create-deliveryContact-phone"
      />

      <div class="d-flex justify-space-between mb-5">
        <p>{{ `${$t('page.store.create.language')} *` }}</p>

        <mp-language-switch
          dataId="order-create-deliveryContact-language"
          :selectedLanguage="deliveryContact.contact.language"
          @input="deliveryContact.contact.language = $event"
          :countries="countries"
          :countriesName="languagesNames"
          @blur="validations.deliveryContact.contact.language.$touch()"
          :errors="getModelErrors(validations.deliveryContact.contact.language)"
          :isDirty="validations.deliveryContact.contact.language.$dirty"
        />
      </div>

      <timezone-autocomplete
        :top="false"
        :timezone="deliveryContact.contact.timezone"
        dataId="order-create-deliveryContact-timezone"
        @updateTimezone="deliveryContact.contact.timezone = $event"
        :isRequired="true"
        @blur="validations.deliveryContact.contact.timezone.$touch()"
        :errors="getModelErrors(validations.deliveryContact.contact.timezone)"
        @input="validations.deliveryContact.contact.timezone.$touch()"
        :isDirty="validations.deliveryContact.contact.timezone.$dirty"
      />

      <v-checkbox
        class="regular16 checkbox-color mt-5"
        :label="$t('page.contact.professional')"
        :input-value="deliveryContact.contact.isProfessional"
        :dataId="`order-create-deliveryContact-isProfessional`"
        @change="deliveryContact.contact.isProfessional = $event"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { validationMixin } from '@/mixins'
import mixins from 'vue-typed-mixins'

import mpPhoneNumber from '@/components/form/phoneNumber/phoneNumber.vue'
import TimezoneAutocomplete from '@/components/form/timezoneAutocomplete/timezoneAutocomplete.vue'
import { AVAILABLE_LANGUAGES, TRANSLATED_LANGUAGES } from '@/plugins/i18n'
import { CreateOrderStateDeliveryContact } from '@/store/modules/createOrder/deliveryContact/types'
import { CreateOrderStateMiscellaneous } from '@/store/modules/createOrder/types'
import { CreateOrderStateArrival } from '@/store/modules/createOrder/arrival/types'
import { CurrentUserEntity } from '@/types'

export default mixins(validationMixin).extend({
  name: 'order-create-deliveryContact',
  components: {
    mpPhoneNumber,
    TimezoneAutocomplete,
  },
  computed: {
    arrival(): CreateOrderStateArrival {
      return this.$store.getters['createOrder/arrival/arrival']
    },
    miscellaneous(): CreateOrderStateMiscellaneous {
      return this.$store.getters['createOrder/miscellaneous']
    },
    deliveryContact(): CreateOrderStateDeliveryContact {
      return this.$store.getters['createOrder/deliveryContact/deliveryContact']
    },
    validations(): any {
      return this.$store.getters['createOrder/deliveryContact/$v']
    },
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
    currentUser(): CurrentUserEntity {
        return this.$store.getters['auth/currentUser']
    },
  },
  mounted() {
    this.setTimezoneAndLanguage()

    if (!this.deliveryContact.contact.language) {
      this.$store.dispatch('createOrder/deliveryContact/setDeliveryContact', {
        contact: {
          ...this.deliveryContact.contact,
          language: this.currentUser.language,
        },
      })
    }
  },
  methods: {
    setTimezoneAndLanguage(reset = false) {
      const contact = this.deliveryContact.contact

      if (
        this.arrival.country === 'FR' &&
        !contact.firstName &&
        !contact.lastName &&
        !contact.email &&
        (contact.phone === '+33' || !contact.phone) &&
        (contact.language === 'fr' || !contact.language) &&
        (contact.timezone === 'Europe/Paris' || !contact.timezone)
      ) {
        this.deliveryContact.contact.language = !reset ? 'fr' : ''
        this.deliveryContact.contact.timezone = !reset ? 'Europe/Paris' : ''

        if (reset) {
          this.deliveryContact.contact.phone = ''
        }
      }
    },
  },
  destroyed() {
    this.setTimezoneAndLanguage(true)

    if (this.deliveryContact.contact.phone === '+33') {
      this.deliveryContact.contact.phone = ''
    }

    this.miscellaneous.saveAddress.arrival.contact = this.deliveryContact.contact
  },
})
</script>

<style lang="scss">
#order-create-block-delivery-contact {
  .phone-number {
    label {
      overflow: visible;
    }
  }
}
</style>
