<template>
  <v-row
    no-gutters
    class="block"
    data-id="order-create-block-shippingContact"
    id="order-create-block-shipping-contact"
  >
    <v-col cols="12" class="header d-flex justify-space-between align-center">
      <div>
        <h2>{{ $t('page.createOrder.titles.shippingContact') }}</h2>
        <span class="block-info">{{ $t('page.createOrder.infos.shippingContact') }}</span>
      </div>
      <div>
        <span class="regular14 show-more" @click="seeMore = !seeMore">
          {{ `${$t('action.show.base')} ${seeMore ? '-' : '+'}` }}
        </span>
      </div>
    </v-col>

    <v-col cols="12" class="content" v-show="seeMore">
      <mp-textfield
        :label="`${$t('common.lastname')} *`"
        v-model="shippingContact.contact.lastName"
        @input="validations.shippingContact.contact.lastName.$touch()"
        @blur="validations.shippingContact.contact.lastName.$touch()"
        :errors="getModelErrors(validations.shippingContact.contact.lastName)"
        :isDirty="validations.shippingContact.contact.lastName.$dirty"
        dataId="order-create-shippingContact-lastname"
        class="mb-5"
      />

      <mp-textfield
        :label="`${$t('common.firstname')} *`"
        v-model="shippingContact.contact.firstName"
        @input="validations.shippingContact.contact.firstName.$touch()"
        @blur="validations.shippingContact.contact.firstName.$touch()"
        :errors="getModelErrors(validations.shippingContact.contact.firstName)"
        :isDirty="validations.shippingContact.contact.firstName.$dirty"
        dataId="order-create-shippingContact-firstname"
        class="mb-5"
      />

      <mp-textfield
        :label="`${$t('common.email')} *`"
        type="email"
        v-model="shippingContact.contact.email"
        @input="validations.shippingContact.contact.email.$touch()"
        @blur="validations.shippingContact.contact.email.$touch()"
        :errors="getModelErrors(validations.shippingContact.contact.email)"
        :isDirty="validations.shippingContact.contact.email.$dirty"
        dataId="order-create-shippingContact-email"
        class="mb-5"
      />

      <mp-phone-number
        :label="`${$t('common.phone')} *`"
        v-model="shippingContact.contact.phone"
        class="mb-5 phone-number"
        @input="validations.shippingContact.contact.phone.$touch()"
        @blur="validations.shippingContact.contact.phone.$touch()"
        :errors="getModelErrors(validations.shippingContact.contact.phone)"
        :isDirty="validations.shippingContact.contact.phone.$dirty"
        dataId="order-create-shippingContact-phone"
      />

      <div class="d-flex justify-space-between mb-5">
        <p>{{ `${$t('page.store.create.language')} *` }}</p>

        <mp-language-switch
          dataId="order-create-shippingContact-language"
          :selectedLanguage="shippingContact.contact.language"
          @input="shippingContact.contact.language = $event"
          :countries="countries"
          :countriesName="languagesNames"
          @blur="validations.shippingContact.contact.language.$touch()"
          :errors="getModelErrors(validations.shippingContact.contact.language)"
          :isDirty="validations.shippingContact.contact.language.$dirty"
        />
      </div>

      <timezone-autocomplete
        :top="false"
        :timezone="shippingContact.contact.timezone"
        dataId="order-create-shippingContact-timezone"
        @updateTimezone="shippingContact.contact.timezone = $event"
        :isRequired="true"
        @blur="validations.shippingContact.contact.timezone.$touch()"
        :errors="getModelErrors(validations.shippingContact.contact.timezone)"
        @input="validations.shippingContact.contact.timezone.$touch()"
        :isDirty="validations.shippingContact.contact.timezone.$dirty"
      />

      <v-checkbox
        class="regular16 checkbox-color mt-5"
        :label="$t('page.contact.professional')"
        :input-value="shippingContact.contact.isProfessional"
        :dataId="`order-create-shippingContact-isProfessional`"
        @change="shippingContact.contact.isProfessional = $event"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { validationMixin } from '@/mixins'
import { CreateOrderStateShippingContact } from '@/store/modules/createOrder/shippingContact/types'
import mixins from 'vue-typed-mixins'

import mpPhoneNumber from '@/components/form/phoneNumber/phoneNumber.vue'
import TimezoneAutocomplete from '@/components/form/timezoneAutocomplete/timezoneAutocomplete.vue'
import { AVAILABLE_LANGUAGES, TRANSLATED_LANGUAGES } from '@/plugins/i18n'
import { CreateOrderStateMiscellaneous } from '@/store/modules/createOrder/types'
import StoreService from '@/services/store/StoreService'
import { CreateOrderStateSenderIdentity } from '@/store/modules/createOrder/senderIdentity/types'
import { CreateOrderStateArrival } from '@/store/modules/createOrder/arrival/types'
import { CreateOrderStateDeparture } from '@/store/modules/createOrder/departure/types'
import { CurrentUserEntity } from '@/types'

export default mixins(validationMixin).extend({
  name: 'order-create-shippingContact',
  components: {
    mpPhoneNumber,
    TimezoneAutocomplete,
  },
  data: () => ({
    seeMore: true,
  }),
  computed: {
    senderIdentity(): CreateOrderStateSenderIdentity {
      return this.$store.getters['createOrder/senderIdentity/senderIdentity']
    },
    arrival(): CreateOrderStateArrival {
      return this.$store.getters['createOrder/arrival/arrival']
    },
    departure(): CreateOrderStateDeparture {
      return this.$store.getters['createOrder/departure/departure']
    },
    miscellaneous(): CreateOrderStateMiscellaneous {
      return this.$store.getters['createOrder/miscellaneous']
    },
    shippingContact(): CreateOrderStateShippingContact {
      return this.$store.getters['createOrder/shippingContact/shippingContact']
    },
    validations(): any {
      return this.$store.getters['createOrder/shippingContact/$v']
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
    if (this.senderIdentity.storeId && !this.miscellaneous.hasDepartureContactAlreadyBeenSet) {
      this.setDefaultContactToStoreContact(this.senderIdentity.storeId)
    }
    this.setTimezoneAndLanguage()

    if (!this.validations.$invalid) {
      this.seeMore = false
    }
    if (!this.shippingContact.contact.language) {
      this.$store.dispatch('createOrder/shippingContact/setShippingContact', {
        contact: {
          ...this.shippingContact.contact,
          language: this.currentUser.language,
        },
      })
    }
  },
  methods: {
    setTimezoneAndLanguage(reset = false) {
      const contact = this.shippingContact.contact

      if (
        this.arrival.country === 'FR' &&
        !contact.firstName &&
        !contact.lastName &&
        !contact.email &&
        (contact.phone === '+33' || !contact.phone) &&
        (contact.language === 'fr' || !contact.language) &&
        (contact.timezone === 'Europe/Paris' || !contact.timezone)
      ) {
        this.shippingContact.contact.language = !reset ? 'fr' : ''
        this.shippingContact.contact.timezone = !reset ? 'Europe/Paris' : ''

        if (reset) {
          this.shippingContact.contact.phone = ''
        }
      }
    },
    async setDefaultContactToStoreContact(storeId: number): Promise<void> {
      const contact = this.shippingContact.contact

      if (
        !contact.firstName &&
        !contact.lastName &&
        !contact.email &&
        (contact.phone === '+33' || !contact.phone) &&
        (contact.language === 'fr' || !contact.language) &&
        (contact.timezone === 'Europe/Paris' || !contact.timezone) &&
        this.departure.type === 'address' &&
        this.arrival.type === 'address'
      ) {
        const store = await StoreService.get(storeId, {
          retailerId: this.senderIdentity.retailerId,
        })

        const mainContact = store.contacts.find(c => c.main)
        this.shippingContact.contact = mainContact ? mainContact : store.contacts[0]
      }
    },
  },
  watch: {
    'senderIdentity.storeId'(next) {
      this.setDefaultContactToStoreContact(next)
    },
  },
  destroyed() {
    this.setTimezoneAndLanguage(true)

    if (this.shippingContact.contact.phone === '+33') {
      this.shippingContact.contact.phone = ''
    }

    this.miscellaneous.saveAddress.departure.contact = this.shippingContact.contact
  },
})
</script>

<style lang="scss">
#order-create-block-shipping-contact {
  .phone-number {
    label {
      overflow: visible;
    }
  }
  .header {
    .show-more {
      text-decoration: underline;
      cursor: pointer;
    }
  }
}
</style>
