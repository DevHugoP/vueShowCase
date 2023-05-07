<template>
  <div id="store-detail" v-if="store" data-id="store-detail">
    <v-row no-gutters>
      <v-col cols="12">
        <content-header v-if="$vuetify.breakpoint.smAndUp" dataId="store-detail">
          <template #breadcrumb>
            <mp-breadcrumb />
          </template>
          <template #title>
            <h1 data-id="store-detail-title">{{ store.name }}</h1>
          </template>
          <template #actions-button>
            <div class="actions-wrapper">
              <mp-button
                v-if="isAuthorized('EDIT_STORES', { storeId: store.id })"
                :text="$t('action.modify.base')"
                format="primary"
                icon="pencil"
                dataId="store-detail-update"
                :to="getEditRoute()"
              />
            </div>
          </template>
        </content-header>
      </v-col>
    </v-row>

    <v-row
      no-gutters
      :class="
        `content-container${
          !isAuthorized('EDIT_STORES', { storeId: store.id }) ? ' no-sticky-button' : ''
        }`
      "
    >
      <v-col cols="12">
        <v-row no-gutters class="technical-data">
          <v-col cols="12" sm="10" offset-sm="1">
            <v-row no-gutters>
              <v-col cols="12" sm="5" class="logo-container">
                <v-row no-gutters class="logo-outer-wrapper">
                  <v-col cols="12" class="logo-wrapper">
                    <v-img
                      class="logo"
                      src="@/assets/illustrations/default_img_store.svg"
                      contain
                      data-id="store-detail-logo"
                    />
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="12" sm="7" class="technical-container">
                <v-row no-gutters>
                  <v-col cols="12" class="medium14 state">
                    <span v-if="store.active" class="valid">
                      <v-icon size="1.8rem">mdi-check-bold</v-icon>
                      <span class="medium14" data-id="store-detail-active">{{
                        $t('common.active')
                      }}</span>
                    </span>
                    <span v-else class="no-valid">
                      <v-icon size="1.8rem">mdi-cancel</v-icon>
                      <span class="medium14" data-id="store-detail-inactive">{{
                        $t('common.inactive')
                      }}</span>
                    </span>
                  </v-col>
                </v-row>

                <v-divider class="divider" />

                <v-row no-gutters class="data-container">
                  <v-col cols="6" class="label">
                    <span :class="$vuetify.breakpoint.smAndUp ? 'regular14' : 'regular16'">{{
                      $t('page.store.externalStoreId')
                    }}</span>
                  </v-col>
                  <v-col cols="6" class="value">
                    <span class="regular14" data-id="store-detail-externalRetailerId">
                      {{ store.externalStoreId }}
                    </span>
                  </v-col>
                </v-row>

                <v-divider class="divider" />

                <v-row no-gutters class="data-container">
                  <v-col cols="12" class="d-flex justify-space-between">
                    <span
                      :class="`label ${$vuetify.breakpoint.smAndUp ? 'regular14' : 'regular16'}`"
                    >
                      {{ $t('page.store.detail.language') }}
                    </span>
                    <span
                      :class="
                        `note-value-wrapper value ${
                          $vuetify.breakpoint.smAndUp ? 'medium14' : 'medium16'
                        }`
                      "
                      data-id="store-detail-language"
                    >
                      {{ $t(`common.languages.${store.language}`) }}
                    </span>
                  </v-col>
                </v-row>

                <v-divider class="divider" />

                <v-row no-gutters class="data-container">
                  <v-col cols="12" class="d-flex justify-space-between">
                    <span
                      :class="`label ${$vuetify.breakpoint.smAndUp ? 'regular14' : 'regular16'}`"
                    >
                      {{ $t('page.store.detail.timezone') }}
                    </span>
                    <span
                      :class="
                        `note-value-wrapper value ${
                          $vuetify.breakpoint.smAndUp ? 'medium14' : 'medium16'
                        }`
                      "
                      data-id="store-detail-timezone"
                    >
                      {{ store.timezone }}
                    </span>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row no-gutters class="content-dsk" v-if="$vuetify.breakpoint.smAndUp">
          <v-col cols="10" offset="1">
            <v-row no-gutters>
              <v-col cols="12" md="5" class="left-column">
                <v-row no-gutters>
                  <v-col cols="12">
                    <mp-contact
                      id="store-detail-contact"
                      :title="$t('page.store.detail.contact.title')"
                      :hasShowedInformation="true"
                      :showMainContact="true"
                      :contacts="sortedContacts"
                      :withLanguage="true"
                      :withTimezone="true"
                    />
                  </v-col>
                </v-row>

                <v-row
                  no-gutters
                  v-if="isAuthorized('LIST_EXCHANGE_PLACES', { storeId: store.id })"
                >
                  <v-col cols="12">
                    <mp-exchange-place :retailerId="store.retailerId" :storeId="store.id" />
                  </v-col>
                </v-row>

                <v-row no-gutters>
                  <v-col cols="12">
                    <mp-weighting :weightings="store.weightingIndexes" />
                  </v-col>
                </v-row>

                <v-row no-gutters>
                  <v-col cols="12">
                    <custom-checkout
                      :retailerId="store.retailerId"
                      :storeId="store.id"
                      v-if="isAuthorized('LIST_CUSTOM_CHECKOUT')"
                    />
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="12" md="7" class="right-column">
                <v-row no-gutters>
                  <v-col
                    cols="12"
                    v-if="isAuthorized('LIST_ORDER_ELIGIBILITIES', { storeId: store.id })"
                  >
                    <v-row no-gutters>
                      <v-col cols="12">
                        <carrier-eligibilities
                          context="store"
                          :retailerId="store.retailerId"
                          :storeId="store.id"
                          dataId="store-detail-carrier"
                        />
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row v-else class="phone-content-detail" no-gutters>
          <v-col cols="12">
            <v-expansion-panels flat>
              <mp-collapse
                ref="contact"
                @click="scrollTo('contact')"
                :title="$t('page.store.detail.contact.title')"
                noPadding
                typographyClass="medium16"
                dataId="store-detail-collapse-contact"
              >
                <mp-contact
                  id="store-detail-contact"
                  :title="$t('page.store.detail.contact.title')"
                  :hasShowedInformation="true"
                  :contacts="store.contacts"
                  :withLanguage="true"
                  :withTimezone="true"
                />
              </mp-collapse>

              <mp-collapse
                ref="carrier"
                @click="scrollTo('carrier')"
                :title="$t('page.store.detail.carrier.title')"
                noPadding
                typographyClass="medium16"
                dataId="store-detail-collapse-carrier"
                v-if="isAuthorized('LIST_ORDER_ELIGIBILITIES', { storeId: store.id })"
              >
                <carrier-eligibilities
                  context="store"
                  :retailerId="store.retailerId"
                  :storeId="store.id"
                  dataId="store-detail-carrier"
                />
              </mp-collapse>

              <mp-collapse
                ref="exchange-place"
                @click="scrollTo('exchange-place')"
                :title="$t('page.store.detail.exchangePlace.title')"
                noPadding
                typographyClass="medium16"
                dataId="store-detail-collapse-exchangePlace"
                v-if="isAuthorized('LIST_EXCHANGE_PLACES', { storeId: store.id })"
              >
                <mp-exchange-place :retailerId="store.retailerId" :storeId="store.id" />
              </mp-collapse>

              <mp-collapse
                ref="weighting"
                @click="scrollTo('weighting')"
                :title="$t('common.weighting.title')"
                noPadding
                typographyClass="medium16"
                dataId="store-detail-collapse-weighting"
              >
                <mp-weighting :weightings="store.weightingIndexes" />
              </mp-collapse>

              <mp-collapse
                v-if="isAuthorized('LIST_CUSTOM_CHECKOUT')"
                ref="custom-checkout"
                @click="scrollTo('custom-checkout')"
                :title="$t('components.customCheckout.title')"
                noPadding
                typographyClass="medium16"
                dataId="store-detail-collapse-checkout"
              >
                <custom-checkout :retailerId="store.retailerId" :storeId="store.id" />
              </mp-collapse>
            </v-expansion-panels>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row
      v-if="$vuetify.breakpoint.xsOnly && isAuthorized('EDIT_STORES', { storeId: store.id })"
      no-gutters
    >
      <v-col cols="12" class="action-mobile-wrapper">
        <mp-button
          class="action-mobile"
          dataId="store-detail-update"
          :text="$t('action.modify.base')"
          format="sticky"
          stickyColor="yellow"
          :to="getEditRoute()"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'

import contentHeader from '@/components/contentHeader/contentHeader.vue'
import mpBreadcrumb from '@/components/breadcrumb/breadcrumb.vue'
import mpContact from '@/components/contact/contact.vue'
import carrierEligibilities from '@/components/carrierEligibilities/carrierEligibilities.vue'
import mpExchangePlace from '@/views/Store/Detail/exchangePlace/exchangePlace.vue'
import mpWeighting from '@/components/weighting/detail/detail.vue'
import customCheckout from '@/components/customCheckout/customCheckout.vue'

import StoreService from '@/services/store/StoreService'

import { SET_HEADER_TITLE, SET_BREADCRUMBS_LABEL } from '@/store/mutation-types'

import { ROUTES } from '@/constants'

import { authorizationMixin } from '@/mixins'
import { StoreEntity } from '@/types'

export default mixins(authorizationMixin).extend({
  name: 'store-detail',
  components: {
    mpBreadcrumb,
    contentHeader,
    mpContact,
    carrierEligibilities,
    mpExchangePlace,
    mpWeighting,
    customCheckout,
  },
  data: () => ({
    store: null as StoreEntity | null,
    canEdit: false,
    ROUTES,
  }),
  async mounted() {
    try {
      this.store = await StoreService.get(parseInt(this.$route.params.storeId, 10), {
        retailerId: parseInt(this.$route.params.id, 10),
      })

      if (this.store) {
        const breadcrumbLabels: { retailers?: string; stores: string } = {
          stores: this.store.name,
        }

        if (this.store.Retailer) {
          breadcrumbLabels.retailers = this.store.Retailer.name
        }
        this.$store.commit(SET_BREADCRUMBS_LABEL, JSON.stringify(breadcrumbLabels))

        this.$store.commit(SET_HEADER_TITLE, this.store.name)
      }
    } catch (e) {
      if (e.response?.status === 403) {
        return this.$router.push({ name: ROUTES.noAccess })
      }
      if (e.response?.status === 404) {
        return this.$router.push({ name: ROUTES.notFound })
      }
    }
  },
  computed: {
    sortedContacts() {
      if (!this.store) {
        return []
      }
      return this.store.contacts.sort(({ main }) => (main ? -1 : 1))
    },
  },
  methods: {
    getEditRoute() {
      return { name: ROUTES.updateStore }
    },
    scrollTo(refToScroll: string) {
      setTimeout(() => {
        ;(this.$refs as Record<string, any>)[refToScroll].$el.scrollIntoView()
      }, 300)
    },
  },
})
</script>

<style lang="scss">
#store-detail {
  padding: 0;

  .action-mobile-wrapper {
    .action-mobile {
      width: 100%;
      min-height: 6rem;

      .v-btn__content {
        @include h3-18-medium;
      }
    }
  }

  @media #{map-get($display-breakpoints, 'sm-and-up')} {
    padding-bottom: 2rem;
  }

  .actions-wrapper {
    display: flex;
    justify-content: flex-end;

    i {
      margin-right: 1rem;
    }
  }

  .content-container {
    @media #{map-get($display-breakpoints, 'xs-only')} {
      max-height: calc(100vh - 5.4rem - 6rem);
      min-height: calc(100vh - 5.4rem - 6rem);
      overflow-y: scroll;

      &.no-sticky-button {
        max-height: calc(100vh - 6.2rem);
      }
    }

    .technical-data {
      min-height: 25rem;
      padding-top: 4.7rem;

      .logo-container {
        @media #{map-get($display-breakpoints, 'sm-and-up')} {
          padding-right: 3.6rem;
        }
      }

      @media #{map-get($display-breakpoints, 'sm-and-up')} {
        background-color: $main-lighten-80-color;
        padding-bottom: 4.2rem;
        margin-bottom: 3.8rem;
      }

      @media #{map-get($display-breakpoints, 'xs-only')} {
        padding-left: 2.5rem;
        padding-right: 2.5rem;
      }

      .technical-container {
        @media #{map-get($display-breakpoints, 'xs-only')} {
          margin-top: 2rem;
          margin-bottom: 2.2rem;
        }

        .state {
          text-align: right;
          margin-bottom: 2.4rem;

          i {
            margin-right: 0.8rem;
          }

          @media #{map-get($display-breakpoints, 'xs-only')} {
            margin-bottom: 1.5rem;
          }

          .valid {
            color: $success-color;
            display: flex;
            align-items: center;
            justify-content: flex-end;
          }

          .no-valid {
            color: $error-color;
            display: flex;
            align-items: center;
            justify-content: flex-end;

            i {
              color: $error-color;
            }
          }
        }

        .data-container {
          margin-bottom: 1rem;

          .label {
            display: flex;
            align-items: center;

            .regular12 {
              color: $main-lighten-52-color;
            }
          }

          .value {
            display: flex;
            justify-content: flex-end;

            .regular14 {
              word-break: break-all;
              text-align: right;
            }
          }

          .displayed-color-wrapper {
            display: flex;
            justify-content: flex-end;

            .displayed-color {
              height: 2rem;
              width: 2rem;
              border-radius: 50%;
            }
          }

          .note-value-outer-wrapper {
            display: flex;
            flex-direction: row;
            justify-content: flex-end;

            .note-value-wrapper {
              height: 2.6rem;
              width: 2.6rem;
              border-radius: 50%;
              margin-right: 0.5rem;
              background-color: $main-color;
              display: flex;
              justify-content: center;
              align-items: center;
              color: $white !important;
            }

            span {
              display: flex;
              align-items: center;
            }
          }
        }

        .divider {
          margin-bottom: 1.3rem;
          background-color: $main-lighten-74-color;

          &.first {
            @media #{map-get($display-breakpoints, 'xs-only')} {
              display: none;
            }
          }
        }
      }
    }

    .content-dsk {
      margin-bottom: 3rem;

      .left-column {
        @media #{map-get($display-breakpoints, 'md-and-up')} {
          padding-right: 3.6rem;
        }
      }
    }

    .phone-content-detail {
      padding: 2.5rem 2.5rem 2.5rem 2.5rem;
      background-color: $main-lighten-74-color;

      .v-expansion-panel {
        margin-bottom: 0.5rem;
        margin-top: 0;
      }
    }
  }
}
</style>
