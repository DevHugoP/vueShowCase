<template>
  <div id="client-page-edit-footer" class="pa-0 mt-14" data-id="client-page-edit-footer">
    <v-row no-gutters class="mb-5">
      <v-col cols="12">
        <h2 data-id="client-page-edit-footer-title">
          {{ $t('page.editClientPage.footer.title') }}
        </h2>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="12" md="8" lg="6" class="pa-0">
        <mp-select
          :label="`${$t('common.phoneNumber')} *`"
          v-if="fields.includes('phone')"
          v-model="footer.phone.type"
          :items="typeItems"
          clearable
          @input="validations.phone.type.$touch()"
          @blur="validations.phone.type.$touch()"
          :errors="getModelErrors(validations.phone.type)"
          :isDirty="validations.phone.type.$dirty"
          dataId="client-page-edit-footer-phoneType"
          class="mb-5"
          @change="handlePhoneTypeChange($event)"
          :disabled="disabled"
        />

        <light-phone-number
          v-if="isPhoneTypeCustom"
          :data="{ phone: footer.phone.number }"
          isRequired
          @change="footer.phone.number = $event"
          @changeCountry="footer.phoneLanguage = $event"
          dataId="client-page-edit-footer-phone"
          class="mb-5"
          :disabled="disabled"
        />

        <mp-textfield
          class="mb-5"
          :label="$t('page.retailerDetail.clientPage.url')"
          name="client-page-edit-footer-url"
          v-if="fields.includes('customerServiceUrl')"
          v-model="footer.customerServiceUrl"
          dataId="client-page-edit-footer-url"
          @input="validations.customerServiceUrl.$touch()"
          @blur="validations.customerServiceUrl.$touch()"
          :errors="getModelErrors(validations.customerServiceUrl)"
          :isDirty="validations.customerServiceUrl.$dirty"
          :disabled="disabled"
        />

        <mp-textarea
          class="mb-5"
          :rows="5"
          :label="$t('page.retailerDetail.clientPage.mention')"
          v-if="fields.includes('legalNotice')"
          v-model="footer.legalNotice"
          @input="validations.legalNotice.$touch()"
          @blur="validations.legalNotice.$touch()"
          :errors="getModelErrors(validations.legalNotice)"
          :isDirty="validations.legalNotice.$dirty"
          dataId="client-page-edit-footer-legalNotice"
          :disabled="disabled"
        />

        <mp-textfield
          :label="$t('page.retailerDetail.clientPage.note')"
          name="client-page-edit-footer-note"
          v-if="fields.includes('criticalScore')"
          v-model="footer.criticalScore"
          type="number"
          dataId="client-page-edit-footer-note"
          @input="validations.criticalScore.$touch()"
          @blur="validations.criticalScore.$touch()"
          :errors="getModelErrors(validations.criticalScore)"
          :isDirty="validations.criticalScore.$dirty"
          suffix="/10"
          :disabled="disabled"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'

import { validationMixin } from '@/mixins'

import lightPhoneNumber from '@/components/form/lightPhoneNumber/lightPhoneNumber.vue'
import { ClientPageConfigFooter, SelectItem } from '@/types'
import { ClientPagePhoneType, CollectClientPageType, DeliveryClientPageType } from '@/constants'

const SURVEY_PAGES: string[] = [DeliveryClientPageType.SURVEY, CollectClientPageType.DRIVE_SURVEY]

export default mixins(validationMixin).extend({
  name: 'client-page-edit-footer',
  components: {
    lightPhoneNumber,
  },
  props: {
    footer: {
      type: Object as () => ClientPageConfigFooter,
      required: true,
    },
    validations: {
      type: Object as () => Record<string, any>,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: true,
    },
    clientPageType: {
      type: String,
      required: true,
    },
  },
  computed: {
    isPhoneTypeCustom(): boolean {
      return this.footer.phone.type === ClientPagePhoneType.CUSTOM
    },
    typeItems(): SelectItem[] {
      return Object.values(ClientPagePhoneType).map(value => ({
        value,
        text: this.$t(`technical.clientPage.footer.type.${value}`),
      }))
    },
    fields(): string[] {
      if (SURVEY_PAGES.includes(this.clientPageType) && !this.footer.criticalScore) {
        this.footer.criticalScore = undefined
      }

      return Object.keys(this.footer)
    },
  },
  methods: {
    handlePhoneTypeChange(type: string) {
      if (type !== ClientPagePhoneType.CUSTOM) {
        this.footer.phone.number = ''
      }
    },
  },
})
</script>
