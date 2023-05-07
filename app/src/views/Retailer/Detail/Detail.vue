<template>
  <div id="retailer-detail" v-if="retailer" data-id="retailer-detail">
    <v-row no-gutters>
      <v-col cols="12">
        <content-header
          id="retailer__header"
          v-if="$vuetify.breakpoint.smAndUp"
          dataId="retailer-detail"
        >
          <template #breadcrumb>
            <mp-breadcrumb />
          </template>
          <template #title>
            <h1 data-id="retailer-detail-title">{{ retailer.name }}</h1>
          </template>
          <template #actions-button>
            <v-menu bottom offset-y origin="center top" transition="scale-transition">
              <template v-slot:activator="{ on, attrs }">
                <mp-button
                  v-bind="attrs"
                  v-on="on"
                  dataId="carrier-detail-actions"
                  format="link"
                  linkColor="black"
                  :text="$t('action.base')"
                  icon="apps"
                />
              </template>
              <v-list>
                <v-list-item
                  v-if="isAuthorized('DOWNLOAD_RETAILER_CONNECTION_ARCHIVE')"
                  @click="showArchiveModel = true"
                  data-id="download-archive-btn"
                >
                  <v-list-item-icon>
                    <v-icon v-text="'mdi-file-download-outline'" />
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-text="$t('action.downloadConnectionArchive')" />
                  </v-list-item-content>
                </v-list-item>

                <v-list-item data-id="retailer-detail-update" :to="getEditRoute()" v-if="isAuthorized('EDIT_RETAILERS', { retailerId: retailer.id })">
                  <v-list-item-icon>
                    <v-icon v-text="'mdi-pencil'" />
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-text="$t('action.modify.base')" />
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </content-header>
      </v-col>

      <download-archive-btn
        v-if="showArchiveModel"
        type="retailer"
        :id="$route.params.id.toString()"
        @close="showArchiveModel = false"
        @submit="showArchiveModel = false"
        :variant="true"
      />
    </v-row>

    <v-row
      no-gutters
      :class="
        `content-container${
          !isAuthorized('EDIT_RETAILERS', { retailerId: (retailer && retailer.id) || null })
            ? ' no-sticky-button'
            : ''
        }`
      "
    >
      <v-col cols="12">
        <v-row no-gutters class="technical-data" ref="technical-data">
          <v-col cols="12" sm="10" offset-sm="1">
            <v-row no-gutters>
              <v-col cols="12" sm="5" class="logo-container-wrapper">
                <v-row no-gutters class="logo-container-inner-wrapper">
                  <v-col cols="12" class="logo-container">
                    <v-row no-gutters class="logo-outer-wrapper">
                      <v-col cols="12" class="logo-wrapper">
                        <v-img
                          class="logo"
                          v-if="retailer.logo"
                          :src="retailer.logo"
                          contain
                          data-id="retailer-detail-logo"
                        />
                      </v-col>
                    </v-row>

                    <v-divider class="divider" v-if="$vuetify.breakpoint.smAndUp" />

                    <v-row no-gutters class="color-wrapper" v-if="$vuetify.breakpoint.smAndUp">
                      <v-col cols="6">
                        <span class="regular12">{{ $t('page.retailerDetail.color') }}</span>
                      </v-col>
                      <v-col cols="6" class="displayed-color-wrapper">
                        <div
                          class="displayed-color"
                          :style="{ 'background-color': retailer.brandColor }"
                          data-id="retailer-detail-brandColor"
                        />
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="12" sm="7" class="technical-container">
                <v-row no-gutters class="data-container">
                  <v-col cols="6" class="label">
                    <span class="regular12">{{ $t('page.retailers.code') }}</span>
                  </v-col>
                  <v-col cols="6" class="value">
                    <span class="regular14" data-id="retailer-detail-smsSendingName">
                      {{ retailer.code }}
                    </span>
                  </v-col>
                </v-row>

                <v-divider class="divider" />

                <v-row no-gutters class="data-container">
                  <v-col cols="6" class="label">
                    <span class="regular12">{{ $t('page.retailerDetail.smsName') }}</span>
                  </v-col>
                  <v-col cols="6" class="value">
                    <span class="regular14" data-id="retailer-detail-smsSendingName">{{
                      retailer.smsSendingName
                    }}</span>
                  </v-col>
                </v-row>

                <v-divider class="divider" />

                <v-row no-gutters class="data-container">
                  <v-col cols="6" class="label">
                    <span class="regular12">{{ $t('common.country.base') }}</span>
                  </v-col>
                  <v-col cols="6" class="value">
                    <span class="regular14" data-id="retailer-detail-country">
                      {{ getCountryItem() }}
                    </span>
                  </v-col>
                </v-row>

                <v-divider class="divider" />

                <v-row no-gutters class="data-container">
                  <v-col cols="6" class="label">
                    <span class="regular12">{{ $t('page.retailerDetail.id') }}</span>
                  </v-col>
                  <v-col cols="6" class="value">
                    <span class="regular14" data-id="retailer-detail-externalRetailerId">
                      {{ retailer.externalRetailerId }}
                    </span>
                  </v-col>
                </v-row>

                <v-divider class="divider" />

                <v-row no-gutters class="data-container">
                  <v-col cols="6" class="label">
                    <span class="regular12">{{ $t('page.retailerDetail.apiClientId') }}</span>
                  </v-col>
                  <v-col cols="6" class="value">
                    <span class="regular14" data-id="retailer-detail-apiClientId">
                      {{ retailer.apiClientId }}
                    </span>
                  </v-col>
                </v-row>

                <v-divider class="divider" />

                <v-row no-gutters class="data-container">
                  <v-col cols="6" class="label">
                    <span class="regular12">{{ $t('page.retailerDetail.idFournisseur') }}</span>
                  </v-col>
                  <v-col cols="6" class="value">
                    <span class="regular14" data-id="retailer-detail-authProviderId">
                      {{ retailer.authProviderId || '-' }}
                    </span>
                  </v-col>
                </v-row>

                <v-divider class="divider" />

                <v-row no-gutters class="data-container">
                  <v-col cols="6" class="label">
                    <span class="regular12">{{ $t('page.retailerDetail.passwordLess') }}</span>
                  </v-col>
                  <v-col cols="6" class="value">
                    <span class="regular14" data-id="retailer-detail-authProviderId">
                      {{ retailer.passwordLess ? $t('common.yes') : $t('common.no') }}
                    </span>
                  </v-col>
                </v-row>

                <v-divider class="divider" v-if="$vuetify.breakpoint.xsOnly" />

                <v-row no-gutters class="data-container" v-if="$vuetify.breakpoint.xsOnly">
                  <v-col cols="6" class="label">
                    <span class="regular12">{{ $t('page.retailerDetail.color') }}</span>
                  </v-col>
                  <v-col cols="6" class="displayed-color-wrapper value">
                    <div
                      class="displayed-color"
                      :style="{ 'background-color': retailer.brandColor }"
                      data-id="retailer-detail-brandColor"
                    />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row no-gutters class="content-dsk" v-if="$vuetify.breakpoint.smAndUp">
          <v-col cols="10" offset="1">
            <v-row no-gutters class="contact-container">
              <v-col cols="12" md="5" class="left-column">
                <v-row no-gutters>
                  <v-col cols="12">
                    <mp-contact
                      id="retailer-detail-contact"
                      :title="$t('page.retailerDetail.contact.title')"
                      :hasShowedInformation="true"
                      :contacts="sortedContacts"
                      :showMainContact="true"
                      :withLanguage="true"
                      :withTimezone="true"
                    />
                  </v-col>
                </v-row>

                <v-row
                  no-gutters
                  v-if="
                    isAuthorized('LIST_STORES', { retailerId: (retailer && retailer.id) || null })
                  "
                >
                  <v-col cols="12">
                    <mp-store :retailerId="retailer.id" />
                  </v-col>
                </v-row>

                <v-row
                  no-gutters
                  v-if="
                    isAuthorized('LIST_CLIENT_PAGES', {
                      retailerId: (retailer && retailer.id) || null,
                    })
                  "
                >
                  <v-col cols="12">
                    <mp-client-page :retailerId="retailer.id" />
                  </v-col>
                </v-row>

                <v-row no-gutters>
                  <v-col cols="12">
                    <mp-generate :generateInfos="retailer.orderIdConfig" />
                  </v-col>
                </v-row>

                <v-row no-gutters v-if="isAuthorized('READ_RETAILER_API_FEATURES')">
                  <v-col cols="12">
                    <mp-api-feature :apiFeatures="retailer.apiFeatures" />
                  </v-col>
                </v-row>

                <v-row
                  no-gutters
                  v-if="isAuthorized('LIST_RETAILER_FTP') && $route.name === 'detailRetailer'"
                >
                  <v-col cols="12">
                    <ftp-account-block />
                  </v-col>
                </v-row>

                <v-row no-gutters v-if="isAuthorized('LIST_CUSTOM_CHECKOUT')">
                  <v-col cols="12">
                    <custom-checkout :retailerId="retailer.id" />
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="12" md="7" id="retailer-right-config">
                <v-row
                  no-gutters
                  v-if="
                    isAuthorized('LIST_CATALOGS', { retailerId: (retailer && retailer.id) || null })
                  "
                >
                  <v-col cols="12">
                    <mp-catalog :retailerId="retailer.id" />
                  </v-col>
                </v-row>

                <v-row
                  no-gutters
                  v-if="
                    isAuthorized('LIST_ORDER_ELIGIBILITIES', {
                      retailerId: (retailer && retailer.id) || null,
                    })
                  "
                >
                  <v-col cols="12">
                    <carrier-eligibilities
                      context="retailer"
                      :retailerId="retailer.id"
                      dataId="retailer-detail-carrier"
                    />
                  </v-col>
                </v-row>

                <v-row no-gutters>
                  <v-col cols="12">
                    <mp-weighting :weightings="retailer.weightingIndexes" />
                  </v-col>
                </v-row>

                <v-row
                  no-gutters
                  v-if="
                    isAuthorized('READ_RETAILER_SUBSCRIPTIONS', {
                      retailerId: (retailer && retailer.id) || null,
                    })
                  "
                >
                  <v-col cols="12">
                    <mp-subscription />
                  </v-col>
                </v-row>

                <v-row no-gutters>
                  <v-col cols="12">
                    <package-dimension :packagesDimensions="retailer.packagesDimensions" />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row no-gutters v-else class="phone-content-detail">
          <v-col cols="12">
            <v-expansion-panels flat>
              <mp-collapse
                v-if="
                  isAuthorized('LIST_CATALOGS', { retailerId: (retailer && retailer.id) || null })
                "
                ref="catalog"
                @click="scrollTo('catalog')"
                :title="$t('page.retailerDetail.catalogs.title')"
                noPadding
                typographyClass="medium16"
                dataId="retailer-detail-collapse-catalog"
              >
                <mp-catalog :retailerId="retailer.id" />
              </mp-collapse>

              <mp-collapse
                ref="contact"
                @click="scrollTo('contact')"
                :title="$t('page.retailerDetail.contact.title')"
                noPadding
                typographyClass="medium16"
                dataId="retailer-detail-collapse-contact"
              >
                <mp-contact
                  id="retailer-detail-contact"
                  :title="$t('page.retailerDetail.contact.title')"
                  :hasShowedInformation="true"
                  :contacts="retailer.contacts"
                  :withLanguage="true"
                  :withTimezone="true"
                />
              </mp-collapse>

              <mp-collapse
                ref="carrier"
                @click="scrollTo('carrier')"
                :title="$t('page.retailerDetail.carriers.title')"
                noPadding
                typographyClass="medium16"
                dataId="retailer-detail-collapse-carrier"
                v-if="
                  isAuthorized('LIST_ORDER_ELIGIBILITIES', {
                    retailerId: (retailer && retailer.id) || null,
                  })
                "
              >
                <carrier-eligibilities
                  context="retailer"
                  :retailerId="retailer.id"
                  dataId="retailer-detail-carrier"
                />
              </mp-collapse>

              <mp-collapse
                v-if="
                  isAuthorized('LIST_STORES', { retailerId: (retailer && retailer.id) || null })
                "
                ref="store"
                @click="scrollTo('store')"
                :title="$t('page.retailerDetail.stores.title')"
                noPadding
                typographyClass="medium16"
                dataId="retailer-detail-collapse-store"
              >
                <mp-store :retailerId="retailer.id" />
              </mp-collapse>

              <mp-collapse
                v-if="
                  isAuthorized('LIST_CLIENT_PAGES', {
                    retailerId: (retailer && retailer.id) || null,
                  })
                "
                ref="client-page"
                @click="scrollTo('client-page')"
                :title="$t('page.retailerDetail.clientPage.title')"
                noPadding
                typographyClass="medium16"
                dataId="retailer-detail-collapse-clientPage"
              >
                <mp-client-page :retailerId="retailer.id" />
              </mp-collapse>

              <mp-collapse
                ref="weighting"
                @click="scrollTo('weighting')"
                :title="$t('common.weighting.title')"
                noPadding
                typographyClass="medium16"
                dataId="retailer-detail-collapse-weighting"
              >
                <mp-weighting :weightings="retailer.weightingIndexes" />
              </mp-collapse>

              <mp-collapse
                ref="generate"
                @click="scrollTo('generate')"
                :title="$t('page.retailerDetail.generate.title')"
                noPadding
                typographyClass="medium16"
                dataId="retailer-detail-collapse-generate"
              >
                <mp-generate :generateInfos="retailer.orderIdConfig" />
              </mp-collapse>

              <mp-collapse
                ref="apiFeature"
                @click="scrollTo('apiFeature')"
                :title="$t('page.retailerDetail.apiFeature.title')"
                noPadding
                typographyClass="medium16"
                dataId="retailer-detail-collapse-apiFeature"
                v-if="isAuthorized('READ_RETAILER_API_FEATURES')"
              >
                <mp-api-feature :apiFeatures="retailer.apiFeatures" />
              </mp-collapse>

              <mp-collapse
                ref="subscription"
                @click="scrollTo('subscription')"
                :title="$t('page.subscriptions.title')"
                noPadding
                typographyClass="medium16"
                dataId="retailer-detail-collapse-subscription"
                v-if="
                  isAuthorized('READ_RETAILER_SUBSCRIPTIONS', {
                    retailerId: (retailer && retailer.id) || null,
                  })
                "
              >
                <mp-subscription />
              </mp-collapse>

              <mp-collapse
                ref="package-dimension"
                @click="scrollTo('package-dimension')"
                :title="$t('page.retailerDetail.packageDimension.title')"
                noPadding
                typographyClass="medium16"
                dataId="retailer-detail-collapse-package-dimension"
              >
                <package-dimension :packagesDimensions="retailer.packagesDimensions" />
              </mp-collapse>

              <mp-collapse
                v-if="isAuthorized('LIST_CUSTOM_CHECKOUT')"
                ref="custom-checkout"
                @click="scrollTo('custom-checkout')"
                :title="$t('components.customCheckout.title')"
                noPadding
                typographyClass="medium16"
                dataId="retailer-detail-collapse-checkout"
              >
                <custom-checkout :retailerId="retailer.id" />
              </mp-collapse>
            </v-expansion-panels>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row v-if="$vuetify.breakpoint.xsOnly && isAuthorized('EDIT_RETAILERS', { retailerId: retailer.id })" no-gutters class="mobile-action-modify-outer-wrapper">
      <v-col cols="12" class="action-mobile-wrapper">
        <mp-button
          class="action-mobile"
          dataId="retailer-detail-update"
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
import mpBreadcrumb from '@/components/breadcrumb/breadcrumb.vue'
import carrierEligibilities from '@/components/carrierEligibilities/carrierEligibilities.vue'
import mpContact from '@/components/contact/contact.vue'
import contentHeader from '@/components/contentHeader/contentHeader.vue'
import { ROUTES } from '@/constants'

import { authorizationMixin } from '@/mixins'

import RetailerService from '@/services/retailer/RetailerService'

import { SET_BREADCRUMBS_LABEL, SET_HEADER_TITLE } from '@/store/mutation-types'
import { RetailerEntity } from '@/types'
import mpApiFeature from '@/views/Retailer/Detail/apiFeature/apiFeature.vue'
import mpCatalog from '@/views/Retailer/Detail/catalog/catalog.vue'
import mpClientPage from '@/views/Retailer/Detail/clientPage/clientPage.vue'
import mpGenerate from '@/views/Retailer/Detail/generate/generate.vue'
import packageDimension from '@/views/Retailer/Detail/packageDimension/packageDimension.vue'
import mpStore from '@/views/Retailer/Detail/store/store.vue'
import mpTypology from '@/views/Retailer/Detail/typology/typology.vue'
import mpWeighting from '@/components/weighting/detail/detail.vue'
import mpSubscription from '@/views/Subscription/Detail/detail.vue'
import mixins from 'vue-typed-mixins'
import downloadArchiveBtn from '@/components/downloadArchiveBtn/downloadArchiveBtn.vue'
import ftpAccountBlock from '@/views/Retailer/Detail/ftpAccount/ftpAccount.vue'
import customCheckout from '@/components/customCheckout/customCheckout.vue'

export default mixins(authorizationMixin).extend({
  name: 'mp-retailer-detail',
  components: {
    ftpAccountBlock,
    contentHeader,
    mpBreadcrumb,
    mpContact,
    mpCatalog,
    mpStore,
    carrierEligibilities,
    mpTypology,
    mpWeighting,
    mpClientPage,
    mpGenerate,
    mpSubscription,
    packageDimension,
    mpApiFeature,
    downloadArchiveBtn,
    customCheckout,
  },
  data: () => ({
    ROUTES,
    retailer: null as RetailerEntity | null,
    canEditRetailer: false,
    showArchiveModel: false,
  }),
  async mounted() {
    const retailerId = this.$route.params.id
    if (!retailerId) {
      return
    }

    try {
      this.retailer = await RetailerService.get(parseInt(retailerId, 10))

      if (this.retailer) {
        const breadcrumbLabel = {
          retailers: this.retailer.name,
        }

        this.$store.commit(SET_BREADCRUMBS_LABEL, JSON.stringify(breadcrumbLabel))

        this.$store.commit(SET_HEADER_TITLE, this.retailer.name)
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
      if (!this.retailer) {
        return []
      }
      return this.retailer.contacts.sort(({ main }) => (main ? -1 : 1))
    },
  },
  methods: {
    getEditRoute() {
      return { path: `/retailers/${this.retailer!.id}/edit` }
    },
    scrollTo(refToScroll: string) {
      setTimeout(() => {
        ;(this.$refs[refToScroll] as any).$el.scrollIntoView(true, {
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest',
        })
      }, 300)
    },
    getCountryItem() {
      if (!this.retailer || !this.retailer.countries?.length) {
        return '-'
      }
      return this.$t(`common.country.${this.retailer.countries[0]}`)
    },
  },
})
</script>

<style lang="scss">
#retailer-detail {
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

  .content-container {
    @media #{map-get($display-breakpoints, 'xs-only')} {
      max-height: calc(100vh - 5.4rem - 6rem);
      overflow-y: scroll;

      &.no-sticky-button {
        max-height: calc(100vh - 5.4rem);
      }
    }

    .technical-data {
      min-height: 25rem;

      @media #{map-get($display-breakpoints, 'xs-only')} {
        padding-left: 2.5rem;
        padding-right: 2.5rem;
      }

      @media #{map-get($display-breakpoints, 'sm-and-up')} {
        padding: 4.2rem 0 4.2rem;
        background-color: $main-lighten-80-color;
        margin-bottom: 3.8rem;
      }

      .mobile-action-wrapper {
        display: flex;
        justify-content: center;
        margin-bottom: 2.4rem;

        i {
          margin-right: 1rem;
        }
      }

      .logo-container-wrapper {
        .logo-container-inner-wrapper {
          height: 100%;
        }

        @media #{map-get($display-breakpoints, 'sm-and-up')} {
          padding-right: 3.6rem;
        }

        .logo-container {
          background-color: $white;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          flex-direction: column;

          @media #{map-get($display-breakpoints, 'sm-and-up')} {
            min-height: 16.6rem;
          }

          .logo-outer-wrapper {
            max-height: 9.1rem;
            margin-bottom: 1.5rem;
            margin-top: 1.7rem;

            @media #{map-get($display-breakpoints, 'xs-only')} {
              margin-top: 1.2rem;
            }

            .logo-wrapper {
              display: flex;
              justify-content: center;

              .logo {
                width: 20.2rem;
                height: 9.1rem;
              }
            }
          }

          .divider {
            width: 85%;
            margin-bottom: 1rem;
          }

          .color-wrapper {
            width: 85%;

            .regular12 {
              color: $main-lighten-52-color;
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
          }
        }
      }

      .technical-container {
        @media #{map-get($display-breakpoints, 'xs-only')} {
          margin-bottom: 1rem;
        }

        .divider {
          margin-bottom: 1.3rem;
          background-color: $main-lighten-74-color;

          &.first {
            border: hidden;
            min-height: 1.3rem;
            background: transparent;

            @media #{map-get($display-breakpoints, 'xs-only')} {
              display: none;
            }
          }
        }

        .data-container {
          margin-bottom: 1rem;

          .label {
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
        }
      }
    }

    .content-dsk {
      .contact-container {
        margin-bottom: 3.8rem;

        .left-column {
          @media #{map-get($display-breakpoints, 'md-and-up')} {
            padding-right: 3.6rem;
          }
        }
      }
    }

    .phone-content-detail {
      padding: 2.5rem 2.5rem 6.4rem 2.5rem;
      background-color: $main-lighten-74-color;

      .v-expansion-panel {
        margin-bottom: 0.5rem;
        margin-top: 0;
      }
    }
  }
}

#mp-dialog-confirmation {
  .main-dialog-content {
    .text-wrapper {
      margin: 2rem;
    }
  }
}
</style>
