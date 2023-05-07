<template>
  <div id="alert-config-add" class="d-flex flex-column" v-if="hasLoaded">
    <content-header
      v-if="$vuetify.breakpoint.smAndUp"
      id="detail-alert-config__header"
      className="d-flex flex-column"
      data-id="alert-config-add"
    >
      <template #breadcrumb>
        <mp-breadcrumb />
      </template>
      <template #title>
        <h1>{{ $t('page.alertConfigAdd.title') }}</h1>
      </template>
      <template #actions-button>
        <mp-button
          :format="$vuetify.breakpoint.smAndUp ? 'link' : 'sticky'"
          :linkColor="$vuetify.breakpoint.smAndUp ? 'black' : null"
          :stickyColor="$vuetify.breakpoint.smAndUp ? null : 'yellow'"
          :text="$t('page.alertConfigAdd.reset')"
          dataId="alert-edit-resetButton"
          @click="goBack()"
        />
        <mp-button
          :disabled="isValid()"
          :format="$vuetify.breakpoint.smAndUp ? 'success' : 'sticky'"
          :stickyColor="$vuetify.breakpoint.smAndUp ? null : 'yellow'"
          :text="
            $route.query.retailerId
              ? $t('page.alertConfigAdd.update')
              : $t('page.alertConfigAdd.add')
          "
          dataId="alert-edit-createButton"
          @click="createParameter()"
        />
      </template>
    </content-header>

    <v-row no-gutters class="content-scroll">
      <v-col cols="12">
        <v-row no-gutters>
          <!-- Title -->
          <v-col cols="10" offset="1">
            <h2 class="subtitle">{{ $t('common.context') }}</h2>
          </v-col>

          <!-- Context -->
          <v-row no-gutters v-if="$vuetify.breakpoint.smAndUp">
            <v-col
              cols="9"
              offset="1"
              v-for="(context, index) in subscriptionToAdd.contexts"
              :key="`config-context${index}`"
              class="context"
            >
              <div class="context-number">
                <span class="medium14">{{ index + 1 }} </span>
              </div>

              <div class="context-select">
                <mp-select
                  v-model="context.retailerId"
                  :disabled="isEditingConfig"
                  :items="context.retailers"
                  itemText="name"
                  itemValue="id"
                  :label="$t('common.retailer')"
                  clearable
                  dataId="alert-edit-Retailer"
                  class="mr-5"
                  @change="getStores(index, $event)"
                />
              </div>

              <div class="context-select">
                <mp-select
                  class="ml-4"
                  v-model="context.storeIds"
                  :disabled="isEditingConfig || !context.retailerId"
                  :items="context.stores"
                  itemText="name"
                  itemValue="id"
                  :label="$t('common.store')"
                  clearable
                  dataId="alert-edit-Store"
                  multiple
                  chips
                  smallChips
                  deletableChips
                  hideSelected
                />
              </div>

              <v-icon
                v-if="!$route.query.retailerId"
                @click="deleteContext(index)"
                class="ml-8 mt-2 main-color"
                size="2.6rem"
              >
                mdi-close-circle
              </v-icon>
            </v-col>
          </v-row>

          <!-- Mobile -->
          <v-row no-gutters v-else class="mt-7">
            <v-col cols="10" offset="1">
              <mp-chips-wrapper
                canAdd
                :chips="contextsChips"
                v-model="chipModel"
                @addChip="addContext()"
                @input="selectedChip = $event.value"
                dataId="contexts-chips-wrapper"
              />

              <div class="context-select mt-8">
                <mp-select
                  v-model="subscriptionToAdd.contexts[selectedChip].retailerId"
                  :disabled="isEditingConfig"
                  :items="subscriptionToAdd.contexts[selectedChip].retailers"
                  itemText="name"
                  itemValue="id"
                  @change="getStores(selectedChip, $event)"
                  :label="$t('common.retailer')"
                  clearable
                  dataId="alert-edit-Retailer"
                />
              </div>

              <div class="context-select">
                <mp-select
                  v-model="subscriptionToAdd.contexts[selectedChip].storeIds"
                  :disabled="
                    isEditingConfig || !subscriptionToAdd.contexts[selectedChip].retailerId
                  "
                  :items="subscriptionToAdd.contexts[selectedChip].stores"
                  itemText="name"
                  itemValue="id"
                  :label="$t('common.store')"
                  clearable
                  dataId="alert-edit-Store"
                  multiple
                  chips
                  smallChips
                  deletableChips
                  hideSelected
                />
              </div>
            </v-col>
          </v-row>
        </v-row>

        <v-row v-if="$vuetify.breakpoint.smAndUp && !isEditingConfig" no-gutters class="mt-4">
          <v-col col="10" offset="1">
            <mp-button
              :text="$t('page.alertConfigAdd.context')"
              dataId="alert-edit-addContext"
              format="secondary"
              icon="plus"
              @click="addContext()"
            />
          </v-col>
        </v-row>

        <!-- Alert types -->
        <v-row no-gutters class="alert-types-wrapper">
          <v-col cols="6" offset="1">
            <h2 :class="$vuetify.breakpoint.smAndUp ? 'subtitle' : ''">{{ $t('common.alert') }}</h2>
          </v-col>

          <v-col
            cols="10"
            sm="6"
            offset="1"
            v-for="type in subscriptionToAdd.types"
            :key="`types-${type.name}`"
            class="alerts-type d-flex align-start"
          >
            <mp-checkbox
              :input-value="type.checked"
              :label="$t(`components.alertModal.typeAlertText.${type.name}`)"
              @change="() => (type.checked = !type.checked)"
              :data-id="`alert-type-checkbox-${type.name}`"
              :disabled="disabledAlerts.has(type.name)"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row no-gutters class="alert-actions-wrapper">
      <v-col
        cols="12"
        offset="0"
        sm="10"
        offset-sm="1"
        :class="
          `d-flex alert-actions${$vuetify.breakpoint.smAndUp ? ' justify-end mt-9 mb-10' : ''}`
        "
      >
        <mp-button
          :format="$vuetify.breakpoint.smAndUp ? 'link' : 'sticky'"
          :linkColor="$vuetify.breakpoint.smAndUp ? 'black' : null"
          :stickyColor="$vuetify.breakpoint.smAndUp ? null : 'yellow'"
          :text="$t('page.alertConfigAdd.reset')"
          dataId="alert-edit-resetButton"
          @click="goBack()"
        />
        <mp-button
          :disabled="isValid()"
          :format="$vuetify.breakpoint.smAndUp ? 'success' : 'sticky'"
          :stickyColor="$vuetify.breakpoint.smAndUp ? null : 'yellow'"
          :text="
            $route.query.retailerId
              ? $t('page.alertConfigAdd.update')
              : $t('page.alertConfigAdd.add')
          "
          dataId="alert-edit-createButton"
          @click="createParameter()"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import mpBreadcrumb from '@/components/breadcrumb/breadcrumb.vue'
import contentHeader from '@/components/contentHeader/contentHeader.vue'
import { ROUTES } from '@/constants'
import AlertSubscriptionService from '@/services/alertSubscription/AlertSubscriptionService'
import RetailerService from '@/services/retailer/RetailerService'
import StoreService from '@/services/store/StoreService'
import {
  AlertContext,
  AlertSubscription,
  AlertType,
  DetailAlertRetailer,
  Filters,
  RulesKey,
  TYPE_ALERT,
} from '@/types'
import Vue from 'vue'
import { SnackBarType } from '@/store/types'

const rule: RulesKey = 'UPDATE_USER_ALERTS'

export default Vue.extend({
  name: 'alert-config-edit',
  components: {
    contentHeader,
    mpBreadcrumb,
  },
  data: () => ({
    ROUTES,
    retailers: [] as DetailAlertRetailer[],
    carriers: [] as any[],
    stores: [] as any[],
    subscriptionToAdd: null as {
      contexts: AlertContext[]
      types: AlertType[]
    } | null,
    alertSubscription: [] as AlertSubscription[],
    chipModel: null as any,
    selectedChip: 0,
    hasLoaded: false,
    disabledAlerts: new Set() as Set<string>,
    existingAlerts: [] as AlertSubscription[],
    checkContext: true,
  }),
  computed: {
    contextsChips(): any[] {
      return this.subscriptionToAdd!.contexts.map((context, index) => {
        return {
          ...context,
          text: `${this.$t('page.alert.config.context')} ${index + 1}`,
          value: index,
        }
      })
    },
    isEditingConfig(): boolean {
      return Boolean(Object.entries(this.$route.query).length)
    },
    getRetailers(): Filters[] {
      return this.retailers.filter(retailer =>
        this.subscriptionToAdd!.contexts.some(context => context.retailerId !== retailer.id),
      )
    },
  },
  beforeMount() {
    const subscriptionToAdd = {
      contexts: [],
      types: Object.values(TYPE_ALERT).map(name => ({
        name,
        checked: false,
        email: false,
      })),
    }

    this.subscriptionToAdd = subscriptionToAdd
  },
  async mounted() {
    this.retailers = await RetailerService.getFilters({ forRule: rule })

    if (this.$vuetify.breakpoint.xsOnly) {
      this.addContext()
    }

    this.existingAlerts = await AlertSubscriptionService.getAll()

    this.$watch('subscriptionToAdd.contexts', this.filterAlertTypes, { deep: true })
    this.filterAlertTypes()

    this.hasLoaded = true
  },
  methods: {
    filterAlertTypes() {
      this.disabledAlerts = this.existingAlerts.reduce((acc, alert) => {
        if (alert.retailerId === null && alert.storeId === null && alert.carrierId === null) {
          acc.add(alert.type)
          return acc
        }

        const existingAlert = this.subscriptionToAdd!.contexts.filter(
          ({ retailerId, storeIds, carrierId }) => {
            if (retailerId && !storeIds?.length) {
              return retailerId && retailerId === alert.retailerId && alert.storeId === null
            }

            if (storeIds?.length) {
              return (
                retailerId &&
                retailerId === alert.retailerId &&
                storeIds?.length &&
                storeIds.includes(alert.storeId as number)
              )
            }

            if (carrierId) {
              return carrierId && carrierId === alert.carrierId
            }

            return false
          },
        )

        if (existingAlert.length) {
          acc.add(alert.type)
        }

        return acc
      }, new Set<string>())

      this.subscriptionToAdd!.types = this.subscriptionToAdd!.types.map(
        ({ name, email, checked }) => {
          return {
            name,
            email: this.disabledAlerts.has(name) ? false : email,
            checked: this.disabledAlerts.has(name) ? false : checked,
          }
        },
      )
    },
    async getStores(index: number, retailerId: number) {
      ;(this.subscriptionToAdd!.contexts[index] as any).stores = await StoreService.getFilters({
        forRule: rule,
        retailerId,
      })
    },
    addContext() {
      const context = {
        retailerId: null,
        carrierId: null,
        storeIds: [],
        retailers: this.retailers.filter(retailer =>
          this.subscriptionToAdd!.contexts.every(
            subContext => subContext.retailerId !== retailer.id,
          ),
        ),
        stores: [],
      }
      this.subscriptionToAdd!.contexts.push(context)
    },
    deleteContext(index: number) {
      this.subscriptionToAdd!.contexts = this.subscriptionToAdd!.contexts.filter(
        (context: object, idx: number) => idx !== index,
      )
    },
    async createParameter() {
      // get checked subscription type
      const subscriptionToAddTypes = this.subscriptionToAdd!.types.filter(
        subscription => subscription.checked,
      )

      const subscriptions = [] as AlertSubscription[]

      if (this.subscriptionToAdd!.contexts?.length) {
        this.subscriptionToAdd!.contexts.forEach(context => {
          const retailerId = context.retailerId
          subscriptionToAddTypes.forEach(type => {
            if (context.storeIds?.length) {
              context.storeIds.forEach(storeId => {
                subscriptions.push({
                  retailerId,
                  storeId,
                  type: type.name,
                  email: type.email,
                } as AlertSubscription)
              })
            } else {
              subscriptions.push({
                retailerId,
                type: type.name,
                email: type.email,
              } as AlertSubscription)
            }
          })
        })
      } else {
        for (const { email, name: type } of subscriptionToAddTypes) {
          subscriptions.push({
            type,
            email,
          } as AlertSubscription)
        }
      }

      try {
        await AlertSubscriptionService.bulkCreate({ alertSubscriptions: subscriptions })

        this.goBack()
      } catch (e) {
        if (e.response && e.response.status === 409) {
          return this.$store.dispatch('setSnackbar', {
            message: this.$t('messages.alertAlreadyExist'),
            type: SnackBarType.ERROR,
          })
        }
        this.$store.dispatch('setSnackbar', {
          message: this.$t('messages.error'),
          type: SnackBarType.ERROR,
        })
      }
    },
    goBack() {
      this.$router.push({
        name: ROUTES.alertConfigDetail,
      })
    },
    isValid() {
      return !this.subscriptionToAdd!.types.find(type => type.checked)
    },
  },
  watch: {
    'subscriptionToAdd.contexts': {
      deep: true,
      handler() {
        if (!this.checkContext) {
          this.checkContext = true
          return
        }

        this.subscriptionToAdd!.contexts = this.subscriptionToAdd!.contexts.map(context => {
          context.retailers = this.retailers.filter(retailer =>
            this.subscriptionToAdd!.contexts.every(subContext => {
              if (context.retailerId === subContext.retailerId) {
                return true
              }

              return subContext.retailerId !== retailer.id
            }),
          )

          return context
        })

        this.checkContext = false
      },
    },
  },
})
</script>

<style lang="scss">
#alert-config-add {
  .subtitle {
    margin-top: 2rem;
    margin-bottom: 0.5rem;
  }

  .context {
    display: flex;
    align-items: flex-start;
    margin-top: 1rem;

    .context-number {
      min-width: 2.6rem;
      max-width: 2.6rem;
      min-height: 2.6rem;
      max-height: 2.6rem;
      background-color: $main-color;
      color: $white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 2.6rem;
      margin-top: 1rem;
    }

    .context-select {
      min-width: 40%;
      max-width: 40%;
    }
  }

  .alert-types-wrapper {
    margin-top: 4rem;

    .alerts-type {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 0.1rem solid $main-lighten-74-color;
      padding-top: 1.8rem;

      @media #{map-get($display-breakpoints, 'xs-only')} {
        flex-direction: column;

        .mp-switch {
          padding-left: 3.5rem;
          margin-bottom: 1.8rem;
        }
      }

      &:last-of-type {
        border-bottom: none;
      }

      .mdi-email {
        &.disabled {
          color: $main-lighten-74-color !important;
        }

        &.icon-green {
          color: $success-color !important;
        }
      }
    }
  }

  .chips-wrapper {
    padding-right: 8%;
  }

  @media #{map-get($display-breakpoints, 'xs-only')} {
    .alert-actions-wrapper {
      .alert-actions {
        display: flex;
        justify-content: space-between;

        button {
          min-height: 6rem;
          min-width: 49.9% !important;
          max-width: 49.9%;
        }
      }
    }
  }

  @media #{map-get($display-breakpoints, 'xs-only')} {
    .content-scroll {
      min-height: calc(100vh - 5.4rem - 6rem);
      max-height: calc(100vh - 5.4rem - 6rem);
      overflow: auto;
    }
  }
}
</style>
