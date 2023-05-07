<template>
  <mp-dialog-confirmation
    dataId="carrier-detail-administrative-contact-modal"
    classWrapper="carrier-detail-administrative-contact-modal"
    color="primary"
    :header="{
      iconClose: 'mdi-close',
      icon: $vuetify.breakpoint.smAndUp ? 'mdi-pencil' : '',
      isColorBackground: true,
      text: isEdit ? $t('page.carrier.contact.modify') : $t('page.carrier.contact.add'),
      textPolice: 'medium16',
    }"
    :btnValidation="{
      text: $t('action.save'),
      format: 'success',
      icon: 'content-save-outline',
      disabled: invalid,
      loading,
    }"
    :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
    @close="$emit('close')"
    @submit="handleSubmit()"
  >
    <template #content>
      <v-row no-gutters class="mt-10">
        <v-col cols="10" offset="1">
          <mp-carrier-contact-form
            :contact="editContact"
            :urls="editUrls"
            :isModal="true"
            @invalid="invalid = $event"
          />
        </v-col>
      </v-row>
    </template>
  </mp-dialog-confirmation>
</template>

<script lang="ts">
import { GetCarrierParams } from '@/services/carrier/CarrierRepository'
import OrderEligibilityService from '@/services/orderEligibility/OrderEligibilityService'
import Vue from 'vue'

import mpCarrierContactForm from '@/views/Carrier/create/contact/contact.vue'
import { CarrierEligibilityEntity, Contact, getDefaultContact } from '@/types'
import { SnackBarType } from '@/store/types'

export default Vue.extend({
  name: 'mp-carrier-detail-administrative-contact-modal',
  components: {
    mpCarrierContactForm,
  },
  props: {
    orderEligibility: {
      type: Object as () => CarrierEligibilityEntity,
      required: true,
    },
    params: {
      type: Object as () => GetCarrierParams,
      required: true,
    },
  },
  data: () => ({
    loading: false,
    isEdit: false,
    editContact: getDefaultContact() as Contact,
    editUrls: {
      trackingPageUrl: '',
      claimUrl: '',
    },
    invalid: false,
  }),
  beforeMount() {
    const { contact, claimUrl, trackingPageUrl } = this.orderEligibility
    this.isEdit = Boolean(contact && Object.values(contact).length)
    this.editContact = contact && Object.values(contact).length
        ? JSON.parse(JSON.stringify(contact))
        : getDefaultContact()
    this.editUrls.claimUrl = claimUrl || ''
    this.editUrls.trackingPageUrl = trackingPageUrl || ''
  },
  methods: {
    async handleSubmit(): Promise<void> {
      try {
        this.loading = true
        const contact = {
          ...this.editContact,
          email: this.editContact.email.toLowerCase(),
          main: undefined,
        }
        await OrderEligibilityService.update(this.params, {
          contact,
          claimUrl: this.editUrls.claimUrl,
          trackingPageUrl: this.editUrls!.trackingPageUrl,
        })
        this.orderEligibility.contact = JSON.parse(JSON.stringify(contact))
        this.orderEligibility.claimUrl = this.editUrls.claimUrl
        this.orderEligibility.trackingPageUrl = this.editUrls!.trackingPageUrl
        this.$store.dispatch('setSnackbar', {
          message: this.$t('messages.carrierUpdated'),
          type: SnackBarType.SUCCESS,
        })
      } catch (err) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      } finally {
        this.loading = false
        this.$emit('close')
      }
    },
  },
})
</script>

<style lang="scss">
.carrier-detail-administrative-contact-modal {
  .main-dialog-content {
    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      @import '../../../../styles/mixins/macScrollbar';
      @include setMacScrollbar('&');
      max-height: calc(100vh - 33rem);
      overflow-y: scroll;
    }
  }

  .v-card__actions {
    border-top: 0.1rem solid $main-lighten-74-color;
  }
}
</style>
