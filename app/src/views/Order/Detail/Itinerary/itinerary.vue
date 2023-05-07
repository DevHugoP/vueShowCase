<template>
  <v-container id="order-detail-itinerary" data-id="order-detail-itinenary">
    <mp-block
      id="order-detail-itinerary-block"
      :title="$vuetify.breakpoint.smAndUp ? $t('page.detailOrder.itinerary.title') : ''"
      titleHasPaddingBottom
      :hasBorder="$vuetify.breakpoint.smAndUp"
      :hasMarginBottom="$vuetify.breakpoint.smAndUp"
    >
      <div v-if="hasData">
        <v-row
          no-gutters
          v-for="(address, index) in addresses"
          :key="`addresses-${index}`"
          :class="!showPersonalData ? 'min-height' : ''"
        >
          <v-col cols="12" class="itinerary-wrapper">
            <div class="icon-container">
              <div
                class="icon-wrapper icon-wrapper-picking"
                v-if="address.type === ITINERARY_TYPE.PICKING"
              >
                <span class="icon-picking" />
              </div>

              <div class="border" v-if="address.type === 'picking'" />

              <div
                class="icon-wrapper icon-wrapper-delivery"
                v-if="address.type === ITINERARY_TYPE.DELIVERY"
              >
                <span class="icon-delivery" />
              </div>
            </div>

            <div class="content-wrapper">
              <mp-date-hour
                :date="address.date"
                :hour="address.hour"
                v-if="address.date && address.hour"
                dataId="order-detail-itinerary-dateHour"
              />
              <div
                data-id="order-detail-itinerary-postalCodeAndCityAndCountry-public"
                class="postalCodeAndCityAndCountry-public regular12"
                v-if="!addresses[index].showText && addresses[index].address.postalCode"
              >
                <v-icon size="1.6rem">mdi-map-marker</v-icon>
                {{
                  `${address.address.postalCode} ${address.address.city} (${address.address.country})`
                }}
              </div>

              <div :class="`text text-${address.type}`" v-if="address.address && showPersonalData">
                <mp-button
                  class="action"
                  :text="$t('page.detailOrder.itinerary.detail_plural')"
                  format="primary"
                  dataId="order-detail-itinerary-showDetail"
                  v-if="!address.showText"
                  @click="handleShowText(index)"
                  :small="$vuetify.breakpoint.xsOnly"
                />

                <div v-else class="regular14">
                  <div
                    class="pb-2"
                    v-if="titlePicking && address.type === ITINERARY_TYPE.PICKING"
                    data-id="order-detail-itinerary-pickingTitle"
                  >
                    {{ titlePicking }}
                  </div>
                  <div
                    class="pb-2"
                    v-if="titleDelivery && address.type === ITINERARY_TYPE.DELIVERY"
                    data-id="order-detail-itinerary-deliveryTitle"
                  >
                    {{ titleDelivery }}
                  </div>
                  <div class="address" v-if="address.address.postalCode">
                    <div
                      v-if="address.address.addressLine1"
                      data-id="order-detail-itinerary-addressLine1"
                    >
                      {{ address.address.addressLine1 }}
                    </div>
                    <div
                      v-if="address.address.addressLine2"
                      data-id="order-detail-itinerary-addressLine2"
                    >
                      {{ address.address.addressLine2 }}
                    </div>
                    <div data-id="order-detail-itinerary-postalCodeAndCityAndCountry">
                      {{
                        `${address.address.postalCode} ${address.address.city} (${address.address.country})`
                      }}
                    </div>
                    <div
                      v-if="!address.address.elevator"
                      data-id="order-detail-itinerary-noElevator"
                    >
                      {{ $t('page.detailOrder.itinerary.withoutElevator') }}
                    </div>
                    <div v-else data-id="order-detail-itinerary-elevator">
                      {{ $t('page.detailOrder.itinerary.withElevator') }}
                    </div>

                    <div
                      v-if="typeof address.address.floor === 'number' && address.address.floor > 0"
                      data-id="order-detail-itinerary-floor"
                    >
                      {{ $t('page.detailOrder.itinerary.floor') }} {{ address.address.floor }}
                    </div>
                    <div v-if="address.address.doorCode" data-id="order-detail-itinerary-doorcode">
                      {{ $t('page.detailOrder.itinerary.doorCode') }} :
                      {{ address.address.doorCode }}
                    </div>
                    <div v-if="address.address.comment" data-id="order-detail-itinerary-comment">
                      {{ address.address.comment }}
                    </div>
                  </div>

                  <div class="contact" data-id="order-detail-itinerary-contact">
                    <div
                      v-if="address.contact.firstName && address.contact.lastName"
                      data-id="order-detail-itinerary-fullName"
                      :class="$vuetify.breakpoint.smAndUp ? 'd-flex' : ''"
                    >
                      <div>
                        <span>
                          {{ `${address.contact.firstName} ${address.contact.lastName}` }}
                        </span>
                      </div>
                      <div class="contact-professional">
                        <mp-badge
                          color="black"
                          :class="$vuetify.breakpoint.smAndUp ? '' : 'ml-0 mt-1 mb-1'"
                          :content="address.contact.isProfessional
                            ? $t('page.contact.professionalTitle')
                            : $t('page.contact.individualTitle')"
                          dataId="order-detail-itinerary-contact-professional"
                        />
                      </div>
                    </div>
                    <div
                      v-if="address.contact.phone"
                      data-id="order-detail-itinerary-contact-phone"
                    >
                      {{ address.contact.phone }}
                    </div>
                    <div
                      v-if="address.contact.email"
                      data-id="order-detail-itinerary-contact-email"
                    >
                      {{ address.contact.email }}
                    </div>
                    <div
                      v-if="address.contact.language"
                      data-id="order-detail-itinerary-contact-language"
                    >
                      {{ $t('common.speak', { language: address.contact.language }) }}
                    </div>
                    <div
                      v-if="address.contact.timezone"
                      data-id="order-detail-itinerary-contact-timezone"
                    >
                      {{ address.contact.timezone }}
                    </div>
                  </div>

                  <div
                    v-if="address.infos"
                    class="info"
                    data-id="order-detail-itinerary-contact-infos"
                  >
                    {{ address.infos }}
                  </div>

                  <mp-button
                    v-if="address.type === ITINERARY_TYPE.DELIVERY && $vuetify.breakpoint.smAndUp && isAuthorized('SHOW_ITINERARY')"
                    class="mt-6"
                    :text="$t('common.itinerary')"
                    dataId="order-detail-status-map"
                    format="secondary"
                    icon="google-maps"
                    @click="goToMaps()"
                  />
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
      <div v-else>
        <no-data dataId="order-detail-itinerary-noData" />
      </div>
    </mp-block>
  </v-container>
</template>

<script lang="ts">
import noData from '@/components/noData/noData.vue'
import mpBlock from '@/components/block/block.vue'

import { SHOW_INFORMATION_LENGTH } from '@/constants'
import { authorizationMixin } from '@/mixins'

import OrderService from '@/services/order/OrderService'
import ExchangePlaceService from '@/services/exchangePlace/ExchangePlaceService'
import { ADDRESS_TYPE } from '@/constants'
import { Address, Contact, DateInterval, OrderEntity } from '@/types'
import mixins from 'vue-typed-mixins'

export const ITINERARY_TYPE = {
  PICKING: 'picking',
  DELIVERY: 'delivery',
}

export interface IItinerary {
  address: Address
  contact: Contact
  interval: DateInterval[]
  infos?: string | null
  date: string
  hour: string
  showText: boolean
  type?: string
}

export default mixins(authorizationMixin).extend({
  name: 'mp-itinerary',
  components: {
    noData,
    mpBlock,
  },
  props: {
    order: {
      type: Object as () => OrderEntity,
      required: true,
    },
    showPersonalData: {
      type: Boolean,
      required: true,
    },
    hasReturn: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    addresses: [] as IItinerary[],
    hasData: true,
    personalData: false,
    titlePicking: '',
    titleDelivery: '',
    ITINERARY_TYPE,
  }),
  mounted() {
    if (this.order && Object.entries(this.order).length) {
      this.addresses = OrderService.formatItinerary(this.order)
    }

    this.hasData = this.addresses.length > 0
  },
  methods: {
    async handleShowText(index: number) {
      if (!this.personalData) {
        const order = await OrderService.get(this.order.id, { personalData: true })

        this.addresses = OrderService.formatItinerary(order)

        for (const itineraryAddress of this.addresses) {
          const { address } = itineraryAddress

          if (address && address.type === ADDRESS_TYPE.EXCHANGE_PLACE) {
            const [{ name }] = await ExchangePlaceService.getFilters({
              forRule: 'READ_ORDERS',
              id: address.exchangePlaceId,
            })

            if (itineraryAddress.type === ITINERARY_TYPE.PICKING) {
              this.titlePicking = name
            } else {
              this.titleDelivery = name
            }
          } else if (address && address.type === ADDRESS_TYPE.PICKUP_POINT) {
            if (itineraryAddress.type === ITINERARY_TYPE.PICKING) {
              this.titlePicking = address.title!
            } else {
              this.titleDelivery = address.title!
            }
          }
        }

        this.personalData = true
      }
      this.addresses[index].showText = true
      setTimeout(() => {
        this.addresses[index].showText = false
      }, SHOW_INFORMATION_LENGTH)
    },
    async goToMaps() {
      OrderService.goToMaps(this.order.id, this.hasReturn)
    },
  },
})
</script>

<style lang="scss">
#order-detail-itinerary {
  padding: 0;

  @media #{map-get($display-breakpoints, 'xs-only')} {
    border-top: solid 0.1rem $main-lighten-74-color;
  }

  .min-height {
    height: 6rem;
  }

  .itinerary-wrapper {
    display: flex;
    align-items: flex-start;

    .postalCodeAndCityAndCountry-public {
      .v-icon {
        color: $main-lighten-52-color;
      }
      color: $main-lighten-52-color;
      margin-top: 0.5em;
      font-size: 1.4rem !important;
    }

    .icon-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;

      .border {
        height: 100%;
        width: 0.2rem;
        background-color: $main-lighten-65-color;
      }
      .icon-wrapper {
        height: 3rem;
        width: 3rem;
        min-height: 3rem;
        background-color: $main-color;
        border-radius: 1.5rem;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        flex-direction: column;

        &.icon-wrapper-picking {
          .icon-picking {
            border: solid 0.2rem $white;
            width: 1.6rem;
            height: 1.6rem;
            border-radius: 100%;
          }
          &:after {
            margin-top: -0.1rem;
            width: 0.2rem;
            height: 0.8rem;
            content: '';
            bottom: 0;
            background: $white;
            left: 50%;
          }
        }

        &.icon-wrapper-delivery {
          justify-content: flex-start;

          .icon-delivery {
            border: solid 0.2rem $white;
            width: 1.6rem;
            height: 1.6rem;
            border-radius: 100%;
          }
          &:before {
            margin-top: -0.1rem;
            width: 0.2rem;
            height: 0.8rem;
            content: '';
            bottom: 0;
            background: $white;
            left: 50%;
          }
        }

        .icon {
          color: $white;
        }
      }
    }
    .content-wrapper {
      margin-left: 1.7rem;
      width: 100%;

      .text {
        margin-top: 1.5rem;
        margin-bottom: 4.5rem;

        &.text-delivery {
          margin-bottom: 0;
        }

        .contact {
          margin-top: 2.5rem;

          .contact-professional {
            margin-left: auto;

            .mp-badge {
              margin: 0;

              .v-badge__badge {
                width: 100%;
              }
            }
          }
        }

        .info {
          margin-top: 2.4rem;
        }

        .action {
          i {
            margin-right: 1rem;
          }
        }
      }
    }
  }
}
</style>
