<template>
  <div id="store-create" v-if="store" data-id="store-create">
    <!-- header -->
    <content-header v-if="$vuetify.breakpoint.smAndUp" dataId="store-create">
      <template #breadcrumb>
        <mp-breadcrumb />
      </template>
      <template #title>
        <h1 data-id="store-create-title">
          {{
            $route.params.storeId
              ? $t('action.modify.value', { value: store.name })
              : $t('breadcrumbs.createStore')
          }}
        </h1>
      </template>
      <template #actions-button>
        <div class="actions-wrapper">
          <mp-button
            :text="$t('action.cancel.base')"
            format="link"
            linkColor="black"
            dataId="store-create-cancel"
            @click.stop="cancel()"
          />
          <mp-button
            :text="$t('action.save')"
            format="success"
            icon="content-save-outline"
            :disabled="invalid()"
            dataId="store-create-submit"
            @click="submit()"
          />
        </div>
      </template>
    </content-header>

    <v-row no-gutters class="mobile-scroll">
      <v-col cols="10" offset="1">
        <v-form ref="form" class="form">
          <store-create-profil
            class="store-create-profil-wrapper"
            :store="store"
            @invalid="invalids.createProfil = $event"
          />

          <contacts
            class="store-create-contacts-wrapper"
            :contacts="store.contacts"
            :title="$t('common.contacts')"
            dataId="store-create-contacts"
            @invalid="invalids.contacts = $event"
            :withLanguage="true"
            :withTimezone="true"
          />

          <v-row no-gutters class="actions-outer-wrapper" v-if="$vuetify.breakpoint.smAndUp">
            <v-col cols="12" class="d-flex flex-row-reverse">
              <mp-button
                :text="$t('action.save')"
                format="success"
                icon="content-save-outline"
                :disabled="invalid()"
                dataId="store-create-submit"
                @click="submit()"
              />
              <mp-button
                :text="$t('action.cancel.base')"
                format="link"
                linkColor="black"
                dataId="store-create-cancel"
                @click.stop="cancel()"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>

    <v-row no-gutters v-if="$vuetify.breakpoint.xsOnly" class="action-outer-wrapper-mobile">
      <v-col cols="6" class="action-cancel-wrapper">
        <mp-button
          :text="$t('action.cancel.base')"
          dataId="store-create-cancel"
          @click.stop="cancel()"
          icon="arrow-left"
          format="sticky"
          stickyColor="yellow"
        />
      </v-col>
      <v-col cols="6">
        <mp-button
          :text="$t('action.save')"
          :disabled="invalid()"
          dataId="store-create-submit"
          @click="submit()"
          format="sticky"
          stickyColor="yellow"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import StoreMapper from '@/services/store/StoreMapper'
import Vue from 'vue'

import contentHeader from '@/components/contentHeader/contentHeader.vue'
import mpBreadcrumb from '@/components/breadcrumb/breadcrumb.vue'

import RetailerService from '@/services/retailer/RetailerService'

import { SET_BREADCRUMBS_LABEL, SET_HEADER_TITLE } from '@/store/mutation-types'

import storeCreateProfil from '@/views/Store/create/profil/profil.vue'
import contacts from '@/components/contacts/contacts.vue'

import { getDefaultStore, StoreEntity } from '@/types'
import { SET_STORE_DATA } from '@/store/modules/store/mutations-type'
import StoreService from '@/services/store/StoreService'
import { SnackBarType } from '@/store/types'

export default Vue.extend({
  name: 'store-create',
  components: {
    contentHeader,
    mpBreadcrumb,
    storeCreateProfil,
    contacts,
  },
  data() {
    return {
      store: null as StoreEntity | null,
      invalids: {
        createProfil: false,
        contacts: false,
      },
    }
  },
  async mounted() {
    // get retailer for breadcrumb
    const retailer = await RetailerService.get(parseInt(this.$route.params.id, 10))

    // initialize store with either vuex or request
    const getStoreVuex: StoreEntity = this.$store.getters['store/storeData']
    let getStoreApi = null
    if (this.$route.params.storeId && !getStoreVuex.id) {
      getStoreApi = await StoreService.get(parseInt(this.$route.params.storeId, 10))
    }

    const localStore = StoreService.buildStore(getStoreApi || getStoreVuex)

    const breadcrumbLabels: { stores?: string; retailers?: string } = {}

    // name doesn't exist if create
    if (localStore.name) {
      breadcrumbLabels.stores = localStore.name
    }

    // save the retailer inside the store object
    if (retailer) {
      breadcrumbLabels.retailers = retailer.name
      localStore.retailerId = retailer.id
      localStore.Retailer = retailer
    }

    // set breadcrumb
    this.$store.commit(SET_BREADCRUMBS_LABEL, JSON.stringify(breadcrumbLabels))

    // set title mobile
    this.$store.commit(
      SET_HEADER_TITLE,
      this.$route.params.storeId
        ? this.$t('action.modify.value', { value: localStore.name })
        : this.$t('breadcrumbs.createStore'),
    )

    this.store = localStore
  },
  // reset vuex to default on exit
  beforeDestroy() {
    this.$store.commit(`store/${SET_STORE_DATA}`, getDefaultStore())
  },
  methods: {
    invalid() {
      return this.invalids.createProfil || this.invalids.contacts
    },
    cancel() {
      this.$router.go(-1)
    },
    async submit() {
      if (!this.store) {
        return
      }
      const storeId = this.$route.params.storeId
      const formattedStore = StoreMapper.toDto(this.store as StoreEntity)

      try {
        if (storeId) {
          await StoreService.update(storeId, formattedStore)
          this.$store.dispatch('setSnackbar', {
            message: this.$t('messages.storeUpdated'),
            type: SnackBarType.SUCCESS,
          })
          this.$router.go(-1)

          return
        }

        const createdStore = await StoreService.create({
          ...formattedStore,
          retailerId: this.store.retailerId,
        })
        this.$store.dispatch('setSnackbar', {
          message: this.$t('messages.storeCreated'),
          type: SnackBarType.SUCCESS,
        })

        this.$router.push({
          path: `/retailers/${createdStore.retailerId}/stores/${createdStore.id}`,
        })
      } catch (e) {
        if (e.response && e.response.status === 409) {
          return this.$store.dispatch('setSnackbar', {
            message: this.$t('messages.storeAlreadyExists'),
            type: SnackBarType.ERROR,
          })
        }
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
#store-create {
  padding: 0;

  .main-header__actions {
    .actions-wrapper {
      flex-direction: column-reverse;
    }
  }

  .store-create-profil-wrapper {
    @media #{map-get($display-breakpoints, 'xs-only')} {
      margin-top: 2rem;
    }
  }

  .store-create-contacts-wrapper {
    margin-top: 9rem;

    @media #{map-get($display-breakpoints, 'xs-only')} {
      margin-top: 6rem;
    }
  }

  .actions-outer-wrapper {
    margin-top: 4.5rem;
    margin-bottom: 7rem;

  }

  .mobile-scroll {
    @media #{map-get($display-breakpoints, 'xs-only')} {
      max-height: calc(100vh - 8.3rem - 3.1rem);
      min-height: calc(100vh - 8.3rem - 3.1rem);
      overflow-y: scroll;

      padding-bottom: 2rem;
    }
  }

  .action-outer-wrapper-mobile {
    .action-cancel-wrapper {
      padding-right: 0.1rem;
    }

    button {
      min-height: 6rem;
      width: 100%;
    }
  }
}
</style>
