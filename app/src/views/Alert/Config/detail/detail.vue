<template>
  <div id="alert-config-detail" v-if="hasLoaded">
    <content-header
      v-if="$vuetify.breakpoint.smAndUp"
      className="d-flex flex-column"
      data-id="alert-config-detail"
    >
      <template #breadcrumb>
        <mp-breadcrumb />
      </template>
      <template #title>
        <h1>{{ $t('page.alertConfigEdit.detailTitle') }}</h1>
      </template>
      <template #actions-button>
        <div class="actions-wrapper">
          <mp-button
            :text="$t('action.add.parameter')"
            class="add-alert-config__button"
            data-id="add-alert-config"
            format="secondary"
            icon="plus"
            @click="
              $router.push({
                name: ROUTES.alertConfigEdit,
              })
            "
          />
        </div>
      </template>
    </content-header>

    <div class="content-scroll">
      <v-row no-gutters v-if="subscriptions && subscriptions.length">
        <v-col cols="10" offset="1">
          <mp-data-table
            id="alert-list-data-table"
            :items="subscriptions"
            pageLabel=""
            :headers="headers"
            dense
            :to="{
              name: ROUTES.alertConfigAdd,
              paramKey: 'id',
              objectKey: 'id',
              toExclude: ['showMenu'],
            }"
            :footer-props="{ itemsPerPageOptions: [10, 25, 100] }"
            :isCustomMobile="$vuetify.breakpoint.xsOnly"
          >
            <template v-slot:retailerId="{ retailerId }">
              <span class="regular14 main-color alert-type-text">
                {{ getRetailerName(retailerId) }}
              </span>
            </template>

            <template v-slot:storeId="{ storeId, item }">
              <span class="regular14 main-color alert-type-text">
                {{ getStoreName(item.retailerId, storeId) }}
              </span>
            </template>

            <template v-slot:type="{ type }">
              <span class="regular14 main-color alert-type-text">
                {{ $t(`components.alertModal.typeAlertText.${type}`) }}
              </span>
            </template>

            <!-- <template v-slot:email="{ item }">
              <mp-switch
                :key="`alert-email-${item.id}`"
                :dataId="`alert-email-${item.id}`"
                v-model="item.email"
                @click.native.prevent="editSubscription(item.id, item.email)"
              />
            </template> -->

            <template v-slot:delete="{ item }">
              <div
                class="action"
                @click="
                  showDialog = true
                  selectedAlertSubscription = item
                "
                v-if="isAuthorized('DELETE_ALERTS_SUBSCRIPTIONS')"
              >
                <v-icon class="regular16">mdi-trash-can-outline</v-icon>
              </div>
            </template>

            <template v-slot:mobile="{ item }">
              <div class="mobile-wrapper">
                <div>
                  <span class="medium16">
                    {{
                      `${getRetailerName(item.retailerId)} - ${getStoreName(
                        item.retailerId,
                        item.storeId,
                      )}`
                    }}
                  </span>
                  <br />
                  <span class="regular14 main-lighten-52">
                    {{ $t(`components.alertModal.typeAlertText.${item.type}`) }}
                  </span>
                </div>
                <div>
                  <v-menu
                    :closeOnContentClick="true"
                    bottom
                    content-class="filter-list-menu nav-dropdown nav-dropdown__profile"
                    left
                    offset-y
                    transition="slide-y-transition"
                  >
                    <template v-slot:activator="{ on }">
                      <span v-on="on">
                        <v-icon class="main-color">mdi-dots-vertical</v-icon>
                      </span>
                    </template>

                    <div class="alert-type-detail-actions-menu-wrapper">
                      <div
                        class="action"
                        @click="
                          showDialog = true
                          selectedAlertSubscription = item
                        "
                        v-if="isAuthorized('DELETE_ALERTS_SUBSCRIPTIONS')"
                      >
                        <span class="regular16">Supprimer</span>
                      </div>
                    </div>
                  </v-menu>
                </div>
              </div>
            </template>
          </mp-data-table>
        </v-col>
      </v-row>

      <v-row no-gutters v-else>
        <v-col cols="10" offset="1">
          <no-data dataId="alert-settings-list-no-alert" />
        </v-col>
      </v-row>
    </div>

    <v-row no-gutters v-if="$vuetify.breakpoint.xsOnly">
      <v-col cols="12" class="action-mobile-wrapper">
        <mp-button
          class="action-mobile"
          dataId="alert-config-add"
          :text="$t('action.add.parameter')"
          format="sticky"
          stickyColor="yellow"
          @click="
            $router.push({
              name: ROUTES.alertConfigEdit,
            })
          "
        />
      </v-col>
    </v-row>

    <!-- Modal delete confirmation -->
    <mp-dialog-confirmation
      v-if="showDialog"
      :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
      :btnToColumn="$vuetify.breakpoint.xsOnly"
      :btnValidation="{ text: $t('action.delete.base'), format: 'error' }"
      :header="{
        icon: 'mdi-trash-can-outline',
        isColorBackground: false,
        iconClose: 'mdi-close',
      }"
      :textContent="$t('action.alert.delete')"
      classWrapper="alert-delete-parametrage-preview-modal"
      color="error"
      dataId="alert-delete-parametrage-preview-modal"
      @close="
        showDialog = false
        selectedAlertSubscription = null
      "
      @submit="deleteSubscription(selectedAlertSubscription)"
    />
  </div>
</template>

<script lang="ts">
import mpBlock from '@/components/block/block.vue'
import mpBreadcrumb from '@/components/breadcrumb/breadcrumb.vue'
import contentHeader from '@/components/contentHeader/contentHeader.vue'
import { ROUTES } from '@/constants'
import AlertSubscriptionService from '@/services/alertSubscription/AlertSubscriptionService'
import RetailerService from '@/services/retailer/RetailerService'
import StoreService from '@/services/store/StoreService'
import { AlertSubscription, DataTableHeader, DetailAlertRetailer, RulesKey } from '@/types'
import mixins from 'vue-typed-mixins'
import { authorizationMixin } from '@/mixins'

import noData from '@/components/noData/noData.vue'
import alertConfigDetailContext from '@/views/Alert/components/contexts/contexts.vue'
import { SnackBarType } from '@/store/types'

const rule: RulesKey = 'LIST_USER_ALERTS'

export default mixins(authorizationMixin).extend({
  name: 'alert-config-detail',
  components: {
    contentHeader,
    mpBreadcrumb,
    mpBlock,
    alertConfigDetailContext,
    noData,
  },
  data: () => ({
    retailers: [] as DetailAlertRetailer[],
    ROUTES,
    showDialog: false,
    selectedAlertSubscription: null as AlertSubscription | null,
    subscriptions: [] as AlertSubscription[],
    headers: [] as DataTableHeader[],
    hasLoaded: false,
  }),
  beforeMount() {
    this.headers = [
      { text: this.$t('common.retailer'), value: 'retailerId', sortable: true },
      { text: this.$t('common.store'), value: 'storeId', sortable: true },
      { text: this.$t('common.type'), value: 'type', sortable: true },
      // { text: this.$t('common.email'), value: 'email', sortable: true },
      { text: '', value: 'delete', sortable: false },
    ]
  },
  async mounted() {
    this.retailers = await RetailerService.getFilters({ forRule: rule })
    this.getAlertSubscriptions()
  },
  computed: {
    isMobile() {
      return !this.$vuetify.breakpoint.smAndUp
    },
  },
  methods: {
    async getAlertSubscriptions() {
      this.subscriptions = (await AlertSubscriptionService.getAll()).map(alertSub => {
        return {
          ...alertSub,
          showMenu: false,
        }
      })

      // No subscription so exist
      if (!this.subscriptions) {
        return
      }

      // get filter (id + name) for store of existing retailer
      for (const subscription of this.subscriptions) {
        if (subscription.retailerId) {
          const retailers = this.retailers.find(retailer => retailer.id === subscription.retailerId)

          if (retailers && !retailers.stores?.length) {
            retailers.stores = await StoreService.getFilters({
              forRule: rule,
              retailerId: subscription.retailerId,
            })
          }
        }
      }

      this.hasLoaded = true
    },
    getRetailerName(retailerId: number) {
      const name = this.retailers.find(retailer => retailer.id === retailerId)?.name
      return name || this.$t('page.alert.config.allRetailer')
    },
    getStoreName(retailerId: number, storeId: number) {
      return (
        this.retailers
          .find(retailer => retailer.id === retailerId)
          ?.stores?.find(store => store.id === storeId)?.name ||
        this.$t('page.alert.config.allStore')
      )
    },
    async deleteSubscription(subscription: AlertSubscription) {
      this.showDialog = false
      try {
        await AlertSubscriptionService.delete({
          id: subscription.id!,
        })
        this.getAlertSubscriptions()
      } catch (e) {
        this.$store.dispatch('setSnackbar', {
          message: this.$t('messages.error'),
          type: SnackBarType.ERROR,
        })
      }
    },
    async editSubscription(id: string, email: boolean) {
      try {
        await AlertSubscriptionService.bulkUpdate({
          id,
          email,
        })

        const localSubscription = this.subscriptions.find(subscription => subscription.id === id)

        if (localSubscription) {
          localSubscription.email = email
        }
      } catch (e) {
        this.$store.dispatch('setSnackbar', {
          message: this.$t('messages.error'),
          type: SnackBarType.ERROR,
        })
      }
    },
  },
})
</script>

<style lang="scss">
.alert-type-detail-actions-menu-wrapper {
  .action {
    min-height: 4rem;
    border-bottom: 0.1rem solid $main-lighten-52-color;

    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
}

#alert-config-detail {
  .pointer {
    a {
      text-decoration: none !important;
    }
  }

  .subscription-wrapper {
    border-bottom: 0.1rem solid $main-lighten-74-color;
    display: flex;
    padding-bottom: 2.9rem;
    margin-top: 3rem;

    @media #{map-get($display-breakpoints, 'xs-only')} {
      border-bottom: none;
      margin-top: 0;

      &:first-of-type {
        margin-top: 2rem !important;
      }
    }

    &:last-of-type {
      border-bottom: none;
    }

    &:first-of-type {
      margin-top: 0;
    }

    .contexts {
      padding: 2rem;
      background-color: $main-lighten-80-color;
      display: flex;
      border-radius: 0.4rem;
      align-items: flex-start;

      .store {
        margin-top: 1rem;

        &.first {
          margin-top: 0;
        }
      }
    }

    .types-wrapper {
      display: flex;
      margin-top: 2rem;

      @media #{map-get($display-breakpoints, 'xs-only')} {
        margin-top: 0;
      }

      .types {
        border: 0.1rem solid $main-lighten-74-color;
        border-radius: 0.4rem;
        padding: 3rem;
        width: 100%;
        margin-right: 3.8rem;
        height: fit-content;

        @media #{map-get($display-breakpoints, 'xs-only')} {
          margin-right: 0;
          padding: 0;
        }

        .title-mobile {
          margin-top: 2.1rem;
          margin-bottom: 1.6rem;
          padding-left: 1.8rem;
          padding-right: 1.8rem;
          display: flex;
          justify-content: space-between;
        }

        .type-line {
          display: flex;
          align-items: center;
          border-bottom: 0.1rem solid $main-lighten-74-color;
          padding-bottom: 1.6rem;
          padding-top: 1.6rem;

          @media #{map-get($display-breakpoints, 'xs-only')} {
            padding-bottom: 1.2rem;
            padding-top: 1.2rem;
          }

          .email-icon {
            margin-left: auto;
            color: $main-lighten-65-color !important;
          }

          span {
            margin-left: 1.1rem;
            word-break: break-word;
          }

          &:first-child {
            padding-top: 0;
          }

          &:last-child {
            border-bottom: none;
            padding-bottom: 0;

            @media #{map-get($display-breakpoints, 'xs-only')} {
              padding-bottom: 2.8rem;
            }
          }
        }
      }
    }
  }

  .content-scroll {
    @media #{map-get($display-breakpoints, 'xs-only')} {
      min-height: calc(100vh - 5.4rem - 6rem);
      max-height: calc(100vh - 5.4rem - 6rem);
      overflow: auto;
    }
  }

  .mobile-wrapper {
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
    padding-top: 1rem;
    padding-bottom: 1rem;
  }

  .action-mobile-wrapper {
    .action-mobile {
      width: 100%;
      min-height: 6rem;
    }
  }

  #alert-list-data-table {
    .v-data-table__wrapper {
      overflow-x: hidden;
    }
  }
}
</style>
