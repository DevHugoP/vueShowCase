<template>
  <div id="client-page-edit-carrier-infos" data-id="client-page-edit-carrier-infos">
    <v-row no-gutters class="mb-5">
      <v-col cols="12">
        <h2 data-id="client-page-edit-carrier-info-title">
          {{ $t('page.clientPage.carrierInfos.title') }}
        </h2>
      </v-col>
    </v-row>

    <v-col cols="12" md="8" lg="6" class="pa-0">
      <v-row no-gutters class="mb-5">
        <v-col cols="12" class="header-field-wrapper">
          <span class="regular14">
            {{ $t(`page.clientPage.carrierInfos.showCarrierLogo`) }}
          </span>
          <v-spacer />
          <mp-switch
            v-model="carrierInfos.showCarrierLogo"
            dataId="clientPage-edit-header-showCarrierLogo"
          />
        </v-col>
        <v-col cols="12" class="header-field-wrapper">
          <span class="regular14">
            {{ $t(`page.clientPage.carrierInfos.followDelivery`) }}
          </span>
          <v-spacer />
          <mp-switch
            v-model="carrierInfos.followDelivery"
            dataId="clientPage-edit-header-followDelivery"
          />
        </v-col>
        <v-col cols="12" class="header-field-wrapper last">
          <span class="regular14">
            {{ $t(`page.clientPage.carrierInfos.showClaimUrl`) }}
          </span>
          <v-spacer />
          <mp-switch
            v-model="carrierInfos.showClaimUrl"
            dataId="clientPage-edit-header-showClaimUrl"
          />
        </v-col>
      </v-row>

      <mp-select
        :label="`${$t('common.phoneNumber')} *`"
        v-model="carrierInfos.phone.type"
        :items="getItems('phone')"
        clearable
        @input="validations.phone.type.$touch()"
        @blur="validations.phone.type.$touch()"
        :errors="getModelErrors(validations.phone.type)"
        :isDirty="validations.phone.type.$dirty"
        dataId="client-page-edit-carrier-info-phoneType"
        class="mb-5"
        @change="handlePhoneTypeChange($event)"
      />

      <light-phone-number
        v-if="isPhoneTypeCustom"
        :data="{ phone: carrierInfos.phone.number }"
        @change="carrierInfos.phone.number = $event"
        @changeCountry="carrierInfos.phoneLanguage = $event"
        dataId="client-page-edit-carrier-info-phone"
        class="mb-5"
      />

      <mp-select
        :label="`${$t('common.email')} *`"
        v-model="carrierInfos.email.type"
        :items="getItems('email')"
        clearable
        @input="validations.email.type.$touch()"
        @blur="validations.email.type.$touch()"
        :errors="getModelErrors(validations.email.type)"
        :isDirty="validations.email.type.$dirty"
        dataId="client-page-edit-carrier-info-emailType"
        class="mb-5"
        @change="handleEmailTypeChange($event)"
      />

      <mp-textfield
        v-if="isEmailTypeCustom"
        :label="`${$t('common.email')} *`"
        name="email"
        dataId="client-page-edit-carrier-info-email"
        v-model="carrierInfos.email.value"
        @input="validations.email.value.$touch()"
        @blur="validations.email.value.$touch()"
        :errors="getModelErrors(validations.email.value)"
        :isDirty="validations.email.value.$dirty"
        @keydown.enter="$v.$invalid ? null : $emit('submit', email)"
      />
    </v-col>
  </div>
</template>

<script lang="ts">
import { ClientPageConfigCarrierInfos, SelectItem } from '@/types'
import { CarrierContactType } from '@/constants'
import { validationMixin } from '@/mixins'
import mixins from 'vue-typed-mixins'
import lightPhoneNumber from '@/components/form/lightPhoneNumber/lightPhoneNumber.vue'

export default mixins(validationMixin).extend({
  name: 'client-page-edit-carrier-infos',
  components: {
    lightPhoneNumber,
  },
  props: {
    carrierInfos: {
      type: Object as () => ClientPageConfigCarrierInfos,
      required: true,
    },
    validations: {
      type: Object as () => Record<string, any>,
      required: true,
    },
  },
  computed: {
    isPhoneTypeCustom(): boolean {
      return this.carrierInfos.phone.type === CarrierContactType.CUSTOM
    },
    isEmailTypeCustom(): boolean {
      return this.carrierInfos.email.type === CarrierContactType.CUSTOM
    },
  },
  methods: {
    handlePhoneTypeChange(type: string) {
      if (type !== CarrierContactType.CUSTOM) {
        this.carrierInfos.phone.number = ''
      }
    },
    handleEmailTypeChange(type: string) {
      if (type !== CarrierContactType.CUSTOM) {
        this.carrierInfos.email.value = ''
      }
    },
    getItems(context: string): SelectItem[] {
      return Object.values(CarrierContactType).map(value => ({
        value,
        text: this.$t(`technical.clientPage.carrierInfos.type.${value}`, { context }),
      }))
    },
  },
})
</script>

<style lang="scss">
#client-page-edit-carrier-infos {
  padding: 0 !important;
  margin-top: 5.6rem !important;

  .header-field-wrapper {
    min-height: 6rem;
    display: flex;
    align-items: center;
    border-bottom: solid 0.1rem $main-lighten-65-color;

    &.last {
      border-bottom: none;
    }

    .header-field {
      text-decoration: none;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>
