<template>
  <div id="retailer-create" v-if="retailer" data-id="retailer-create">
    <content-header v-if="$vuetify.breakpoint.smAndUp" dataId="retailer-create">
      <template #breadcrumb>
        <mp-breadcrumb />
      </template>
      <template #title>
        <h1 data-id="retailer-create-title">
          {{
            $route.params.id
              ? $t('action.modify.value', { value: retailer.name })
              : $t('breadcrumbs.createRetailers')
          }}
        </h1>
      </template>

      <template #actions-button>
        <div class="actions-wrapper">
          <mp-button
            @click="cancel()"
            :text="$t('action.cancel.base')"
            format="link"
            linkColor="black"
            dataId="retailer-create-cancel"
          />
          <mp-button
            :text="$t('action.save')"
            format="success"
            :disabled="invalid"
            icon="content-save-outline"
            dataId="retailer-create-submit"
            @click="submit()"
          />
        </div>
      </template>
    </content-header>

    <v-row no-gutters id="retailer-form-scroll" class="mobile-scroll">
      <v-col cols="10" offset="1">
        <v-form ref="form" class="form">
          <retailer-create-profil
            class="retailer-create-profil"
            :retailer="retailer"
            @invalid="invalids.createProfil = $event"
          />

          <contacts
            class="retailer-create-contacts-wrapper"
            :contacts="retailer.contacts"
            :title="$t('common.contacts')"
            dataId="retailer-create-contacts"
            @invalid="invalids.contacts = $event"
            :withLanguage="true"
            :withTimezone="true"
          />

          <retailer-create-weightings
            class="retailer-create-weightings-wrapper"
            :retailer="retailer"
            @invalid="invalids.createWeightings = $event"
          />

          <retailer-create-generate-order
            class="retailer-create-generateOrder-wrapper"
            :retailer="retailer"
            @invalid="invalids.createGenerateOrder = $event"
          />

          <mp-subscription
            v-if="
              ($route.name === ROUTES.addRetailer &&
                isAuthorized('CREATE_RETAILER_SUBSCRIPTIONS')) ||
                ($route.name === ROUTES.editRetailer && isAuthorized('EDIT_RETAILER_SUBSCRIPTIONS'))
            "
            subscriptionType="retailer"
            @updateSubscription="subscriptions = $event"
            @updateSubscriptionId="subscriptionId = $event"
            class="retailer-create-subscription-wrapper"
            @invalid="invalids.subscription = $event"
          />

          <packages-dimensions :retailer="retailer" @invalid="invalids.dimensions = $event" />
        </v-form>
      </v-col>
    </v-row>

    <v-row no-gutters v-if="$vuetify.breakpoint.xsOnly">
      <v-col cols="6" class="action-mobile-wrapper">
        <mp-button
          :text="$t('action.cancel.base')"
          dataId="retailer-create-cancel"
          @click.stop="cancel()"
          icon="arrow-left"
          format="sticky"
          stickyColor="yellow"
          class="action-mobile"
        />
      </v-col>
      <v-col cols="6" class="action-mobile-wrapper">
        <mp-button
          id="create-retailer-mobile-btn"
          :text="$t('action.save')"
          :disabled="invalid"
          dataId="retailer-create-submit"
          @click="submit()"
          format="sticky"
          stickyColor="yellow"
          class="action-mobile"
        />
      </v-col>
    </v-row>

    <v-row no-gutters v-if="$vuetify.breakpoint.smAndUp" class="actions-outer-wrapper">
      <v-col cols="10" offset="1" class="actions-wrapper">
        <mp-button
          :spanProps="{
            class: 'medium14',
          }"
          @click="cancel()"
          :text="$t('action.cancel.base')"
          format="link"
          linkColor="black"
          dataId="retailer-create-cancel"
        />
        <mp-button
          :text="$t('action.save')"
          format="success"
          :disabled="invalid"
          icon="content-save-outline"
          dataId="retailer-create-submit"
          @click="submit()"
        />
      </v-col>
    </v-row>

    <client-secret-modal
      v-if="createdRetailer && showClientSecret"
      :showDialog="showClientSecret"
      :clientSecret="createdRetailer.apiClientSecret"
      @close="confirmClientSecret()"
      dataId="retailer-create-client-secret-modal"
    />
  </div>
</template>

<script lang="ts">
import mpBreadcrumb from '@/components/breadcrumb/breadcrumb.vue'
import clientSecretModal from '@/components/clientSecretModal/clientSecretModal.vue'
import contacts from '@/components/contacts/contacts.vue'

import contentHeader from '@/components/contentHeader/contentHeader.vue'
import mpSubscription from '@/components/subscription/subscription.vue'
import { ROUTES } from '@/constants'

import { authorizationMixin } from '@/mixins'
import RetailerMapper from '@/services/retailer/RetailerMapper'

import RetailerService from '@/services/retailer/RetailerService'
import SubscriptionMapper from '@/services/subscription/SubscriptionMapper'
import SubscriptionService from '@/services/subscription/SubscriptionService'
import { SET_RETAILER_DATA } from '@/store/modules/retailer/mutations-type'
import { SET_BREADCRUMBS_LABEL, SET_HEADER_TITLE } from '@/store/mutation-types'

import { SnackBarType } from '@/store/types'

import { getDefaultRetailer, RetailerEntity, Subscription } from '@/types'
import retailerCreateGenerateOrder from '@/views/Retailer/create/generateOrder/generateOrder.vue'
import packagesDimensions from '@/views/Retailer/create/packagesDimensions/packagesDimensions.vue'

import retailerCreateProfil from '@/views/Retailer/create/profil/profil.vue'
import retailerCreateWeightings from '@/views/Retailer/create/weightings/weightings.vue'
import mixins from 'vue-typed-mixins'

export default mixins(authorizationMixin).extend({
  name: 'retailer-create',
  components: {
    contentHeader,
    mpBreadcrumb,
    clientSecretModal,
    mpSubscription,
    retailerCreateProfil,
    contacts,
    retailerCreateWeightings,
    retailerCreateGenerateOrder,
    packagesDimensions,
  },
  data: () => ({
    retailer: null as RetailerEntity | null,
    isProcessing: false,
    createdRetailer: null as RetailerEntity | null,
    showClientSecret: false,
    ROUTES,
    subscriptions: [] as Subscription[],
    subscriptionId: null as number | string | null,
    invalids: {
      createProfil: false,
      contacts: false,
      createWeightings: false,
      createGenerateOrder: false,
      subscription: false,
      dimensions: false,
    },
  }),
  updated() {
    const scrollSection = document.getElementById('retailer-form-scroll')
    const header = document.getElementsByTagName('header')
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    const button = document.getElementById('create-retailer-mobile-btn')

    if (scrollSection && header && button) {
      const newHeight = vh - header[0].clientHeight - button.clientHeight
      scrollSection.style.height = `${newHeight}px`
    }
  },
  computed: {
    invalid() {
      return (
        this.invalids.createProfil ||
        this.invalids.contacts ||
        this.invalids.createWeightings ||
        this.invalids.createGenerateOrder ||
        this.invalids.subscription ||
        this.invalids.dimensions ||
        this.isProcessing
      )
    },
  },
  async mounted() {
    // initialize store with either vuex or request
    const getRetailerVuex: RetailerEntity = this.$store.getters['retailer/retailerData']
    let getRetailerApi = null
    if (this.$route.params.id && (!getRetailerVuex || !getRetailerVuex.id)) {
      getRetailerApi = await RetailerService.get(parseInt(this.$route.params.id, 10))
    }

    const localRetailer = RetailerService.buildRetailer(
      getRetailerApi ? getRetailerApi : getRetailerVuex,
    )

    const breadcrumbLabels: { retailers?: string } = {}

    // name doesn't exist if create
    if (localRetailer.name) {
      breadcrumbLabels.retailers = localRetailer.name
    }

    // set breadcrumb
    this.$store.commit(SET_BREADCRUMBS_LABEL, JSON.stringify(breadcrumbLabels))

    // set title mobile
    this.$store.commit(
      SET_HEADER_TITLE,
      this.$route.params.id
        ? this.$t('action.modify.value', { value: localRetailer.name })
        : this.$t('breadcrumbs.createRetailers'),
    )

    // fix custom input with default value
    localRetailer.logo = localRetailer.logo || null
    localRetailer.brandColor = localRetailer.brandColor || '#000000'
    localRetailer.packagesDimensions = localRetailer.packagesDimensions || []

    this.retailer = localRetailer
  },
  // reset vuex to default on exit
  beforeDestroy() {
    this.$store.commit(`retailer/${SET_RETAILER_DATA}`, getDefaultRetailer())
  },
  methods: {
    cancel() {
      this.$router.go(-1)
    },
    async submit() {
      if (!this.retailer) {
        return
      }

      try {
        this.isProcessing = true
        let message = this.$t('messages.retailerCreated')

        const retailer = RetailerMapper.toDto(this.retailer)
        const subscription = SubscriptionMapper.toDto(this.subscriptions)
        const id = this.$route.params.id

        if (id) {
          if (
            this.isAuthorized('CREATE_RETAILER_SUBSCRIPTIONS') ||
            this.isAuthorized('EDIT_RETAILER_SUBSCRIPTIONS')
          ) {
            await Promise.all([
              RetailerService.update(id, retailer),
              this.subscriptionId
                ? SubscriptionService.updateByRetailerId(this.subscriptionId, id, subscription)
                : SubscriptionService.createByRetailerId(id, subscription),
            ])
          } else {
            await RetailerService.update(id, retailer)
          }
          message = this.$t('messages.retailerUpdated')
        } else {
          this.createdRetailer = await RetailerService.create(retailer, subscription)
          this.showClientSecret = true
        }

        this.$store.dispatch('setSnackbar', {
          message,
          type: SnackBarType.SUCCESS,
        })

        this.isProcessing = false

        if (id) {
          this.$router.push({ path: `/retailers/${id}` })
        }
      } catch (e) {
        this.isProcessing = false
        if (e.response && e.response.status === 403) {
          return this.$store.dispatch('setSnackbar', {
            message: this.$t('messages.retailerAlreadyExists'),
            type: SnackBarType.ERROR,
          })
        }
        this.$store.dispatch('setSnackbar', {
          message: this.$t('messages.error'),
          type: SnackBarType.ERROR,
        })
      }
    },
    confirmClientSecret() {
      this.showClientSecret = false
      const { id } = this.createdRetailer as RetailerEntity

      if (this.createdRetailer && id) {
        this.$router.push({
          name: ROUTES.detailRetailer,
          params: { id: id.toString() },
        })
      }
    },
  },
})
</script>

<style lang="scss">
#retailer-create {
  @media #{map-get($display-breakpoints, 'sm-only')} {
    .main-header__actions {
      padding: 0;

      .actions-wrapper {
        flex-direction: column-reverse;
      }
    }
  }

  .retailer-create-profil {
    margin-top: 2rem;
  }

  .retailer-create-contacts-wrapper {
    margin-top: 3.6rem;
  }

  .retailer-create-weightings-wrapper {
    margin-top: 3rem;
  }

  .retailer-create-generateOrder-wrapper {
    margin-top: 5.4rem;
  }

  .retailer-create-subscription-wrapper {
    margin-bottom: 1rem;
  }

  .actions-outer-wrapper {
    margin-bottom: 7.3rem;

    .actions-wrapper {
      display: flex;
      justify-content: flex-end;
    }
  }

  .mobile-scroll {
    @media #{map-get($display-breakpoints, 'xs-only')} {
      min-height: calc(100vh - 5.4rem - 6rem);
      max-height: calc(100vh - 5.4rem - 6rem);
      overflow: scroll !important;
    }
  }

  .action-mobile-wrapper {
    .action-mobile {
      width: 100%;
      height: 6rem;

      .v-btn__content {
        @include h3-18-medium;
      }
    }
  }
}
</style>
