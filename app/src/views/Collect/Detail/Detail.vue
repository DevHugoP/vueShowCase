<template>
  <div id="detail-collect-wrapper" data-id="collect-detail" v-if="hasData">
    <div
      :class="`content-wrapper
        ${ !isAuthorized('READ_COLLECT_STATUS', { retailerId: collect.retailerId }) ? 'max-height-content-mobile' : ''}`
      "
    >
      <content-header
        id="collect-detail__header"
        v-if="$vuetify.breakpoint.smAndUp && isAuthorized('CANCEL_COLLECT')"
        dataId="collect-detail"
      >
        <template #breadcrumb>
          <mp-breadcrumb />
        </template>
        <template #title>
          <h1 data-id="collect-detail-title" class="collect-detail__title">{{ headerTitle }}</h1>
        </template>
        <template #actions-button>
          <div class="actions-wrapper" v-if="showCancel">
            <mp-button
              :text="$t('action.cancel.base')"
              format="secondary"
              icon="close-circle"
              dataId="collect-detail-cancel"
              class="mr-2"
              @click="showDeleteModal = true"
            />
          </div>
        </template>
      </content-header>

      <v-row
        no-gutters
        v-if="
          isAuthorized('READ_COLLECT_STATUS', {
            retailerId: collect.retailerId,
          })
        "
      >
        <v-col
          cols="12"
          :class="`status-container-wrapper mb-5`"
          v-if="$vuetify.breakpoint.smAndUp"
        >
          <v-row no-gutters class="status-container">
            <v-col cols="10" offset="1" class="status-label">
              <h2 class="current-status main-lighten-28" data-id="collect-detail-status">
                {{ $t(`technical.status.collect.${collect.status}`) }}
              </h2>
            </v-col>
          </v-row>
        </v-col>

        <v-row class="mb-5 d-flex justify-center" no-gutters>
          <v-col cols="12" sm="10">
            <stepper :collectStatus="collect.CollectStatus" :currentStatus="collect.status" />
          </v-col>
        </v-row>
      </v-row>

      <template v-if="$vuetify.breakpoint.smAndUp">
        <v-row no-gutters class="collect-detail__content__wrapper">
          <v-col cols="10" offset="1">
            <v-row no-gutters>
              <!-- left column -->
              <v-col no-gutters class="component-wrapper" v-if="collect" cols="5">
                <div
                  v-if="
                    isAuthorized('READ_COLLECT_SLOT', {
                      retailerId: collect.retailerId,
                    })
                  "
                >
                  <mp-picking :collect="collect" :exchangePlace="exchangePlace" />
                </div>

                <div
                  v-if="
                    isAuthorized('READ_COLLECT_PERSONAL_DATA', {
                      retailerId: collect.retailerId,
                    })
                  "
                >
                  <mp-contact
                    :contacts="collectContact"
                    :title="$t('page.detailOrder.client.contact')"
                    :hasShowedInformation="false"
                    :durationTime="60000"
                    @showInformation="getContactData()"
                    id="collect-detail-customer"
                    :withLanguage="true"
                    :showMainContact="true"
                    :isCustomerContact="true"
                    :withTimezone="true"
                  />
                </div>

                <div
                  v-if="
                    isAuthorized('READ_COLLECT', {
                      retailerId: collect.retailerId,
                    })
                  "
                >
                  <collect-detail :collect="collect" />
                </div>
              </v-col>

              <!-- Right column -->
              <v-col no-gutters class="component-wrapper pl-9" v-if="collect" cols="7">
                <div
                  v-if="
                    isAuthorized('READ_COLLECT_CONTACT', {
                      retailerId: collect.retailerId,
                    })
                  "
                >
                  <mp-contact
                    :contacts="mainEpContact"
                    :title="$t('page.retailers.mainContact')"
                    :hasShowedInformation="true"
                    id="collect-detail-contacts"
                    :withLanguage="true"
                    :showMainContact="true"
                    :withTimezone="true"
                    hasAction
                  >
                    <template #action>
                      <div class="d-flex justify-center btn-wrapper">
                        <mp-button
                          dataId="collect-detail-contact-follow"
                          :text="$t('action.follow.order')"
                          @click="goToCollectTracking()"
                        />
                      </div>
                    </template>
                  </mp-contact>
                </div>

                <div
                  v-if="
                    isAuthorized('READ_COLLECT_PRODUCTS', {
                      retailerId: collect.retailerId,
                    })
                  "
                >
                  <mp-packages-and-products
                    :packages="collect.packages"
                    :shouldDisplayPackageFollowing="false"
                  />
                </div>

                <!-- notification -->
                <div
                  v-if="
                    collect &&
                      isAuthorized('READ_COLLECT_NOTIFICATIONS', {
                        retailerId: collect.retailerId,
                      })
                  "
                >
                  <mp-notification :key="`collect-notifications`" :collectId="collect.id" />
                </div>

                <div
                  v-if="
                    collect &&
                      isAuthorized('READ_COLLECT_SCORE', {
                        storeId: collect.storeId,
                        retailerId: collect.retailerId,
                      })
                  "
                >
                  <mp-score :score="score" />
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </template>

      <template v-else>
        <v-row
          no-gutters
          :class="`phone
          ${ !isAuthorized('READ_COLLECT_STATUS', { retailerId: collect.retailerId }) ? 'max-height-collapse-mobile' : ''}`
          "
        >
          <v-col
            cols="12"
            class="collapse-wrapper"
          >
            <v-expansion-panels flat>
              <mp-collapse
                ref="picking"
                @click="scrollTo('picking')"
                :title="$t('page.detailCollect.picking')"
                v-if="
                  isAuthorized('READ_COLLECT_SLOT', {
                    retailerId: collect.retailerId,
                  })
                "
                typographyClass="medium16"
                dataId="collect-detail-collapse-picking"
              >
                <mp-picking :collect="collect" :exchangePlace="exchangePlace" />
              </mp-collapse>

              <mp-collapse
                ref="customer"
                @click="
                  getContactData()
                  scrollTo('customer')
                "
                :title="$t('page.detailOrder.client.contact')"
                v-if="
                  isAuthorized('READ_COLLECT_PERSONAL_DATA', {
                    retailerId: collect.retailerId,
                  })
                "
                typographyClass="medium16"
                dataId="collect-detail-collapse-customer"
              >
                <mp-contact
                  :contacts="collectContact"
                  :title="$t('page.detailOrder.client.contact')"
                  :hasShowedInformation="true"
                  :durationTime="60000"
                  id="collect-detail-customer"
                  :withLanguage="true"
                  :showMainContact="true"
                  :withTimezone="true"
                />
              </mp-collapse>

              <mp-collapse
                ref="detail"
                @click="scrollTo('detail')"
                :title="$t('page.detailCollect.detail.title')"
                v-if="
                  isAuthorized('READ_COLLECT', {
                    retailerId: collect.retailerId,
                  })
                "
                typographyClass="medium16"
                dataId="collect-detail-collapse-detail"
              >
                <collect-detail :collect="collect" />
              </mp-collapse>

              <mp-collapse
                ref="epContact"
                @click="scrollTo('epContact')"
                :title="$t('page.retailers.mainContact')"
                v-if="
                  isAuthorized('READ_COLLECT_CONTACT', {
                    retailerId: collect.retailerId,
                  })
                "
                typographyClass="medium16"
                dataId="collect-detail-collapse-epContact"
              >
                <mp-contact
                  :contacts="mainEpContact"
                  :title="$t('page.retailers.mainContact')"
                  :hasShowedInformation="true"
                  id="collect-detail-contacts"
                  :withLanguage="true"
                  :showMainContact="true"
                  :withTimezone="true"
                  hasAction
                >
                  <template #action>
                    <div class="d-flex justify-center mt-3">
                      <mp-button
                        dataId="collect-detail-contact-follow"
                        :text="$t('action.follow.order')"
                        @click="goToCollectTracking()"
                      />
                    </div>
                  </template>
                </mp-contact>
              </mp-collapse>

              <mp-collapse
                ref="packages"
                @click="scrollTo('packages')"
                :title="$t('page.detailOrder.packagesAndProducts.title')"
                v-if="
                  isAuthorized('READ_COLLECT_PRODUCTS', {
                    retailerId: collect.retailerId,
                  })
                "
                typographyClass="medium16"
                dataId="collect-detail-collapse-packages"
              >
                <mp-packages-and-products
                  :packages="collect.packages"
                  :shouldDisplayPackageFollowing="false"
                />
              </mp-collapse>

              <!-- notification -->
              <mp-collapse
                ref="notification"
                @click="scrollTo('notification')"
                typographyClass="medium16"
                :title="$t('page.detailOrder.notification.title')"
                dataId="order-detail-collapse-notifications"
                v-if="
                  collect &&
                    isAuthorized('READ_COLLECT_NOTIFICATIONS', {
                      retailerId: collect.retailerId,
                    })
                "
              >
                <mp-notification :key="`collect-notifications`" :collectId="collect.id" />
              </mp-collapse>

              <!-- Note -->
              <mp-collapse
                ref="score"
                @click="scrollTo('score')"
                typographyClass="medium16"
                :title="$t('page.detailOrder.score.title')"
                dataId="collect-detail-score"
                v-if="
                  collect &&
                    isAuthorized('READ_COLLECT_SCORE', {
                      storeId: collect.storeId,
                      retailerId: collect.retailerId,
                    })
                "
              >
                <mp-score :score="score" />
              </mp-collapse>
            </v-expansion-panels>
          </v-col>
        </v-row>
      </template>
    </div>

    <v-row
      no-gutters
      class="mobile-actions"
      v-if="$vuetify.breakpoint.xsOnly && isAuthorized('CANCEL_COLLECT')"
    >
      <v-col cols="12">
        <mp-button
          dataId="collect-detail-delete"
          :text="$t('action.cancel.base')"
          format="sticky"
          stickyColor="yellow"
          @click="showDeleteModal = true"
        />
      </v-col>
    </v-row>

    <mp-dialog-confirmation
      v-if="showDeleteModal"
      dataId="collect-detail-dialog-delete"
      :textContent="$t('page.detailCollect.delete')"
      @close="showDeleteModal = false"
      @submit="deleteCollect()"
      color="error"
      :header="{
        icon: 'mdi-trash-can-outline',
        isColorBackground: false,
        iconClose: 'mdi-close',
      }"
      :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
      :btnValidation="{ text: $t('action.confirm.base'), format: 'error' }"
      :btnToColumn="$vuetify.breakpoint.xsOnly"
    />
  </div>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'

import mpScore from '@/components/score/score.vue'
import contentHeader from '@/components/contentHeader/contentHeader.vue'
import mpBreadcrumb from '@/components/breadcrumb/breadcrumb.vue'
import mpPackagesAndProducts from '@/components/packagesAndProducts/packagesAndProducts.vue'
import mpNotification from '@/components/notification/notification.vue'
import mpPicking from './picking/picking.vue'
import stepper from './stepper/stepper.vue'
import mpContact from '@/components/contact/contact.vue'
import collectDetail from '@/views/Collect/Detail/detail/detail.vue'

import CollectService from '@/services/collect/CollectService'
import ExchangePlaceService from '@/services/exchangePlace/ExchangePlaceService'

import { authorizationMixin } from '@/mixins'
import { SET_HEADER_DATA } from '@/store/mutation-types'

import { mapGetters } from 'vuex'
import { SnackBarType } from '@/store/types'
import { Collect, COLLECT_STATUS, Contact, DriveScore, ExchangePlaceEntity } from '@/types'

export default mixins(authorizationMixin).extend({
  name: 'mp-collect-detail',
  components: {
    contentHeader,
    mpBreadcrumb,
    mpPackagesAndProducts,
    mpPicking,
    stepper,
    mpContact,
    collectDetail,
    mpNotification,
    mpScore,
  },
  data: () => ({
    collectId: '',
    hasData: false,
    collect: null as Collect | null,
    score: null as DriveScore | null,
    exchangePlace: null as ExchangePlaceEntity | null,
    showPersonalData: false,
    showDeleteModal: false,
  }),
  computed: {
    ...mapGetters({
      headerTitle: 'getHeaderTitle',
      currentUser: 'auth/currentUser',
    }),
    mainEpContact(): Contact[] {
      if (!this.exchangePlace) {
        return []
      }

      const mainContact = this.exchangePlace.contacts.find(contact => contact.main)

      return [mainContact || this.exchangePlace.contacts[0]]
    },
    collectContact(): Contact[] {
      if (!this.collect) {
        return []
      }
      return [this.collect.customer]
    },
    showCancel(): boolean {
      const notAllowed = [COLLECT_STATUS.PICK_UP_OK, COLLECT_STATUS.CANCELLED]

      if (this.collect && notAllowed.includes(this.collect.status)) {
        return false
      }
      return true
    },
  },
  async beforeMount() {
    this.collectId = this.$route.params.id

    try {
      this.collect = await CollectService.getById(this.$route.params.id)

      this.$store.commit(SET_HEADER_DATA, this.collect.externalCollectId)
    } catch (error) {
      this.collect = null
    }

    try {
      const [exchangePlace] = await ExchangePlaceService.getAll({
        retailerId: this.collect?.retailerId,
        externalPlaceId: this.collect?.externalExchangePlaceId,
      })

      this.exchangePlace = exchangePlace

      this.hasData = true
    } catch (error) {
      this.exchangePlace = null
    }

    try {
      if (this.collect && this.isAuthorized('READ_COLLECT_SCORE')) {
        this.score = await CollectService.getScore(this.collect.id)
      }
    } catch (e) {
      this.score = null
    }
  },
  methods: {
    async getContactData() {
      this.collect = await CollectService.getById(this.$route.params.id, {
        personalData: this.showPersonalData,
      })
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
    async deleteCollect() {
      try {
        await CollectService.delete(this.collectId)

        this.$router.go(0)
      } catch (e) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      } finally {
        this.showDeleteModal = false
      }
    },
    async goToCollectTracking() {
      const trackingUrl = await CollectService.generateInternalCollectTrackingURL(
        this.collectId,
        this.currentUser.language,
      )
      return window.open(trackingUrl)
    },
  },
  beforeDestroy() {
    this.$store.commit(SET_HEADER_DATA, null)
  },
})
</script>

<style lang="scss">
#detail-collect-wrapper {
  padding: 0;
  background-color: transparent !important;

  .content-wrapper {
    @media #{map-get($display-breakpoints, 'xs-only')} {
      max-height: calc(100vh - 5.4rem - 6rem);
      min-height: calc(100vh - 5.4rem - 6rem);

      overflow: scroll;
    }
  }

  .collect-detail__title {
    word-break: break-all;
  }

  .breadcrumbs-outer-wrapper {
    margin-top: 1.8rem;
  }

  .status-container-wrapper {
    min-height: 7.5rem;
    background-color: $main-lighten-80-color;
    display: flex;
    align-items: center;

    .status-label {
      display: flex;
      align-items: center;
    }

    .status-action {
      display: flex;
      justify-content: flex-end;
      flex-wrap: wrap;
    }
  }

  .component-wrapper {
    .contact-component {
      .action-wrapper {
        display: flex;
        align-items: center !important;
      }

      .action {
        display: flex;
        width: fit-content;
        justify-content: center;
      }
    }
    .btn-wrapper {
      margin-top: 2.5rem;
      margin-bottom: 0.1rem
    }
  }
  .phone {
    .collapse-wrapper {
      background-color: $main-lighten-74-color;
      padding: 2.4rem 2.5rem 6.7rem 2.5rem;

      .content-wrapper {
        min-height: unset;
      }

      .v-expansion-panel-content__wrap {
        padding: 0;
      }

      .v-expansion-panel {
        margin-bottom: 0.5rem;

        .v-expansion-panel--active {
          margin-top: 0;
        }
      }
    }
  }

  .mobile-actions {
    width: 100%;

    .col {
      width: 100%;

      button {
        width: 100%;
        height: 6rem;
      }
    }
  }

  .max-height-content-mobile {
    height: 100vh;
  }

  .max-height-collapse-mobile {
    height: 100%;
  }
}
</style>
