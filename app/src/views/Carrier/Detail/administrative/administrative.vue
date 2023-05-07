<template>
  <div>
    <v-row no-gutters id="carrier-detail-administrative" v-if="$vuetify.breakpoint.smAndUp">
      <v-col cols="12" md="5" class="left-column">
        <mp-contact
          id="carrier-detail-contacts"
          :title="$t('page.carrier.contact.title')"
          :hasShowedInformation="true"
          v-if="orderEligibility?.contact && Object.keys(orderEligibility.contact).length"
          :contacts="[
            {
              ...orderEligibility.contact,
              title: $t(`technical.contactTitles.${orderEligibility.contact.title}`)
            },
          ]"
          :withLanguage="true"
          :withTimezone="true"
          :hasAction="Boolean(orderEligibility.claimUrl) || Boolean(orderEligibility.trackingPageUrl)"
          class="contact"
          :hasEditIcon="canEditEligibilities"
          @clickOnEdit="showDialogEditContact = true"
        >
          <template #action>
            <v-row no-gutters class="label-wrapper">
              <v-col cols="12">
                <span class="regular14 main-lighten-52">{{ $t('page.carrier.contact.claim') }}</span>
              </v-col>
            </v-row>

            <v-row no-gutters class="value-wrapper mb-4">
              <v-col cols="12">
                <span class="regular14" data-id="carrier-detail-contacts-claimUrl">
                  {{ orderEligibility.claimUrl || '--' }}
                </span>
              </v-col>
            </v-row>

            <v-row no-gutters class="label-wrapper mt-3">
              <v-col cols="12">
                <span class="regular14 main-lighten-52">{{ $t('page.carrier.contact.tracking') }}</span>
              </v-col>
            </v-row>

            <v-row no-gutters class="value-wrapper">
              <v-col cols="12">
                <span class="regular14" data-id="carrier-detail-contacts-trackingPageUrl">
                  {{ orderEligibility.trackingPageUrl || '--' }}
                </span>
              </v-col>
            </v-row>
          </template>
        </mp-contact>
        <mp-block
          v-else
          id="carrier-administrative-contact-no-data-block"
          :title="$vuetify.breakpoint.smAndUp ? $t('page.carrier.contact.title') : ''"
          :hasEditIcon="hasContact"
          :hasBorder="$vuetify.breakpoint.smAndUp"
          :hasMarginBottom="$vuetify.breakpoint.smAndUp"
          titleHasPaddingBottom
          @clickOnIcon="showDialogEditContact = true"
        >
          <v-row no-gutters>
            <v-col cols="12" class="no-data-wrapper">
              <no-data dataId="carrier-administrative-contact-block-noData" :content="$t('common.noData.noContent')" />

              <mp-button
                format="primary"
                :text="$t('action.add.base')"
                icon="plus"
                class="mp-button"
                @click="showDialogEditContact = true"
                dataId="carrier-administrative-contact-block-add"
              />
            </v-col>
          </v-row>
        </mp-block>
      </v-col>

      <v-col cols="12" md="7" class="right-column">
        <mp-address
          :orderEligibility="orderEligibility"
          :params="params"
          v-if="hasAddress"
          :hasEditIcon="canEditEligibilities"
        />

        <mp-block
          v-else
          id="carrier-administrative-address-no-data-block"
          :title="$vuetify.breakpoint.smAndUp ? $t('page.carrier.address.title') : ''"
          :hasEditIcon="hasAddress"
          :hasBorder="$vuetify.breakpoint.smAndUp"
          :hasMarginBottom="$vuetify.breakpoint.smAndUp"
          titleHasPaddingBottom
          @clickOnIcon="showDialogEditAddress = true"
        >
          <v-row no-gutters>
            <v-col cols="12" class="no-data-wrapper">
              <no-data dataId="carrier-administrative-address-block-noData" :content="$t('common.noData.noContent')" />

              <mp-button
                format="primary"
                :text="$t('action.add.base')"
                icon="plus"
                class="mp-button"
                @click="showDialogEditAddress = true"
                dataId="carrier-administrative-address-block-add"
              />
            </v-col>
          </v-row>
        </mp-block>
      </v-col>
    </v-row>

    <v-row no-gutters id="carrier-detail-administrative-mobile" v-else>
      <v-expansion-panels flat>
        <mp-collapse
          ref="contact"
          @click="scrollTo('contact')"
          :title="$t('page.carrier.contact.title')"
          noPadding
          typographyClass="medium16"
          data-id="carrier-detail-collapse-contacts"
        >
          <mp-contact
            :id="`carrier-detail-contacts`"
            :title="$t('page.carrier.contact.title')"
            :hasShowedInformation="true"
            v-if="hasContact"
            :contacts="[
              {
                ...orderEligibility.contact,
                title: $t(`technical.contactTitles.${orderEligibility.contact.title}`)
              },
            ]"
            :withLanguage="true"
            :withTimezone="true"
            :hasAction="Boolean(orderEligibility.claimUrl) || Boolean(orderEligibility.trackingPageUrl)"
            class="contact"
            :hasEditIcon="canEditEligibilities"
            @clickOnEdit="showDialogEditContact = true"
          >
            <template #action>
              <v-row no-gutters class="label-wrapper">
                <v-col cols="12">
                  <span class="regular14 main-lighten-52">{{ $t('page.carrier.contact.claim') }}</span>
                </v-col>
              </v-row>

              <v-row no-gutters class="value-wrapper">
                <v-col cols="12">
                  <span class="regular14" data-id="carrier-detail-contacts-claimUrl">
                    {{ orderEligibility.claimUrl || '--' }}</span>
                </v-col>
              </v-row>

              <v-row no-gutters class="label-wrapper mt-3">
                <v-col cols="12">
                  <span class="regular14 main-lighten-52">{{ $t('page.carrier.contact.tracking') }}</span>
                </v-col>
              </v-row>

              <v-row no-gutters class="value-wrapper">
                <v-col cols="12">
                  <span class="regular14" data-id="carrier-detail-contacts-trackingPageUrl">
                    {{ orderEligibility.trackingPageUrl || '--' }}</span>
                </v-col>
              </v-row>
            </template>
          </mp-contact>
        </mp-collapse>

        <mp-collapse
          ref="address"
          @click="scrollTo('address')"
          :title="$t('page.carrier.address.title')"
          data-id="carrier-detail-collapse-address"
          noPadding
          typographyClass="medium16"
          v-if="hasAddress"
        >
          <mp-address
            :hasEditIcon="canEditEligibilities"
            :orderEligibility="orderEligibility"
            :params="params"
          />
        </mp-collapse>
      </v-expansion-panels>
    </v-row>

    <mp-contact-modal
      v-if="showDialogEditContact && orderEligibility && canEditEligibilities"
      @close="showDialogEditContact = false"
      :orderEligibility="orderEligibility"
      :params="params"
    />

    <mp-address-modal
      v-if="showDialogEditAddress && orderEligibility && canEditEligibilities"
      @close="showDialogEditAddress = false"
      :orderEligibility="orderEligibility"
      :params="params"
    />
  </div>
</template>

<script lang="ts">
import { GetCarrierParams } from '@/services/carrier/CarrierRepository'
import { CarrierEligibilityEntity } from '@/types'

import mpBlock from '@/components/block/block.vue'
import noData from '@/components/noData/noData.vue'
import mpAddress from '@/views/Carrier/Detail/administrative/address.vue'
import mpContact from '@/components/contact/contact.vue'
import mpContactModal from '@/views/Carrier/Detail/administrative/contactModal.vue'
import mpAddressModal from '@/views/Carrier/Detail/administrative/addressModal.vue'
import Vue from 'vue'

export default Vue.extend({
  name: 'mp-carrier-detail-administrative',
  components: {
    mpContact,
    mpContactModal,
    mpAddressModal,
    mpAddress,
    noData,
    mpBlock,
  },
  props: {
    orderEligibility: {
      type: Object as () => CarrierEligibilityEntity | null,
      required: true,
    },
    params: {
      type: Object as () => GetCarrierParams,
      required: true,
    },
    canEditEligibilities: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    showDialogEditContact: false,
    showDialogEditAddress: false,
  }),
  computed: {
    hasContact(): boolean {
      return Boolean(this.orderEligibility?.contact && Object.keys(this.orderEligibility.contact).length)
    },
    hasAddress(): boolean {
      return Boolean(this.orderEligibility?.address && Object.keys(this.orderEligibility.address).length)
    },
  },
  methods: {
    scrollTo(refToScroll: string): void {
      setTimeout(() => {
        ;(this.$refs[refToScroll] as any).$el.scrollIntoView(true, {
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest',
        })
      }, 300)
    },
  },
})
</script>

<style lang="scss" scoped>
#carrier-detail-administrative {
  .left-column {
    padding-right: calc(100vw / (38 * 2));

    #carrier-administrative-contact-no-data-block {
      .no-data-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;

        .mp-button {
          margin-top: 2.5rem;
          margin-bottom: 0.1rem
        }
      }
    }
  }

  .right-column {
    padding-left: calc(100vw / (38 * 2));

    #carrier-administrative-address-no-data-block {
      .no-data-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;

        .mp-button {
          margin-top: 2.5rem;
          margin-bottom: 0.1rem;
        }
      }
    }
  }
}
</style>
