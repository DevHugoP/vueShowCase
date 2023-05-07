<template>
  <mp-dialog-confirmation
    v-if="carrier && stores"
    classWrapper="enable-carrier-modal"
    dataId="enable-carrier-modal"
    color="primary"
    :header="{
      iconClose: 'mdi-close',
      icon: $vuetify.breakpoint.smAndUp ? 'mdi-exclamation-thick' : '',
      isColorBackground: true,
      text: $t('page.eligibilities.carrier.activationHeaderText'),
    }"
    :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
    :btnValidation="{
      text: $t(`action.enable.base`),
      format: 'success',
      loading,
    }"
    :btnToColumn="$vuetify.breakpoint.xsOnly"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    @close="closeModal"
    @submit="enableCarrier"
  >
    <template #content v-if="level === 'retailer'">
      <v-row class="activation-container">
        <v-col cols="12" class="d-flex medium14 label">
          {{ $t('page.eligibilities.carrier.enableCarrierFor', { carrierName: carrier.name }) }} :
        </v-col>
        <v-col cols="12" class="d-flex activation-choices">
          <v-col cols="6" class="d-flex align-center">
            <mp-switch
              v-model="form.allStores"
              :disabled="form.allStoresAndEp"
              @change="handleSwitch"
            />
            <span class="regular16">
              {{ $t('page.eligibilities.carrier.form.everyStore') }}
            </span>
          </v-col>
          <v-col cols="6" class="d-flex align-center">
            <mp-switch
              v-model="form.allStoresAndEp"
              :disabled="form.allStores"
              @change="handleSwitch"
            />
            <span class="regular16">
              {{ $t('page.eligibilities.carrier.form.everyStoreAndEP') }}
            </span>
          </v-col>
        </v-col>

        <v-col cols="12">
          <collapse
            v-for="store in stores"
            :key="`collapse-store-${store.id}`"
            @change="clickStoreCheckbox"
            :title="store.name"
            :id="`${store.id}`"
            :selected="Boolean(form.stores.find(({ id }) => id === store.id))"
            :disableCheckbox="form.allStores || form.allStoresAndEp"
            :disableCollapse="Boolean(store.exchangePlaces.length)"
          >
            <template #content>
              <v-col
                cols="12"
                v-for="exchangePlace in store.exchangePlaces"
                :key="`ep=${exchangePlace.id}`"
                class="ep-cb-container"
              >
                <mp-checkbox
                  :dataId="`ep-${exchangePlace.id}`"
                  :input-value="
                    form.stores.find(({ id }) => id === store.id) &&
                      form.stores
                        .find(({ id }) => id === store.id)
                        .exchangePlaceIds.includes(exchangePlace.id)
                  "
                  :label="exchangePlace.name"
                  @change="() => clickEpCheckbox(store.id, exchangePlace.id)"
                  :disabled="
                    form.allStores ||
                      form.allStoresAndEp ||
                      !form.stores.find(({ id }) => id === store.id)
                  "
                />
              </v-col>
            </template>
          </collapse>
        </v-col>
      </v-row>
    </template>
    <template #content v-else>
      <v-row class="activation-container" no-gutters>
        <div v-if="stores[0].exchangePlaces.length">
          <v-col cols="12" class="d-flex medium14 label mb-3">
            {{ $t('page.eligibilities.carrier.enableCarrierFor', { carrierName: carrier.name }) }} :
          </v-col>

          <v-col
            cols="12"
            v-for="exchangePlace in stores[0].exchangePlaces"
            :key="`ep=${exchangePlace.id}`"
            class="ep-cb-container"
          >
            <mp-checkbox
              :dataId="`ep-${exchangePlace.id}`"
              :input-value="
                form.stores.find(({ id }) => id === exchangePlace.storeId) &&
                  form.stores
                    .find(({ id }) => id === exchangePlace.storeId)
                    .exchangePlaceIds.includes(exchangePlace.id)
              "
              :label="exchangePlace.name"
              @change="() => clickEpCheckbox(exchangePlace.storeId, exchangePlace.id)"
              :disabled="
                form.allStores ||
                  form.allStoresAndEp ||
                  !form.stores.find(({ id }) => id === exchangePlace.storeId)
              "
            />
          </v-col>
        </div>
        <div v-else>
          <v-col cols="12" class="d-flex medium14 label mb-3">
            {{
              $t('page.eligibilities.carrier.enableCarrierForStore', {
                carrierName: carrier.name,
                storeName: stores[0].name,
              })
            }}
          </v-col>
        </div>
      </v-row>
    </template>
  </mp-dialog-confirmation>
</template>

<script lang="ts">
import { authorizationMixin } from '@/mixins'
import mixins from 'vue-typed-mixins'

import noData from '@/components/noData/noData.vue'
import mpBlock from '@/components/block/block.vue'
import collapse from '@/components/checkboxCollapse/checkboxCollapse.vue'

import { StoreEntity, ExchangePlaceEntity, CarrierEntity } from '@/types'

export default mixins(authorizationMixin).extend({
  name: 'carrier-activation-modal',
  components: {
    noData,
    mpBlock,
    collapse,
  },
  props: {
    carrier: {
      type: Object as () => CarrierEntity,
      required: true,
    },
    stores: {
      type: Array as () => Array<StoreEntity & { exchangePlaces: ExchangePlaceEntity[] }>,
      required: true,
    },
    level: {
      type: String as () => 'retailer' | 'store',
      required: true,
    },
  },
  data: () => ({
    form: {
      allStores: false,
      allStoresAndEp: false,
      stores: [] as Array<{ id: number; exchangePlaceIds: number[] }>,
    },
    openedStore: null as number | null,
    loading: false,
  }),
  computed: {},
  async mounted() {
    if (this.level === 'store') {
      this.form.stores = [
        {
          id: this.stores[0].id as number,
          exchangePlaceIds: [] as number[],
        },
      ]
    }
  },
  methods: {
    clickStoreCheckbox(idParam: string, checked: boolean): void {
      const id = parseInt(idParam, 10)
      if (checked && !this.form.stores.find(({ id: storeId }) => storeId === id)) {
        this.form.stores = [...this.form.stores, { id, exchangePlaceIds: [] }]
      }
      if (!checked) {
        this.form.stores = this.form.stores.filter(({ id: storeId }) => storeId !== id)
      }
    },
    clickEpCheckbox(storeId: number, exchangePlaceId: number): void {
      const store = this.form.stores.find(({ id }) => id === storeId)

      if (store) {
        if (store.exchangePlaceIds.includes(exchangePlaceId)) {
          store.exchangePlaceIds = store.exchangePlaceIds.filter(epId => epId !== exchangePlaceId)
        } else {
          store.exchangePlaceIds = [...store.exchangePlaceIds, exchangePlaceId]
        }
        this.form.stores = [...this.form.stores.filter(({ id }) => storeId !== id), store]
      }
    },
    handleSwitch(): void {
      if (this.form.allStoresAndEp || this.form.allStores) {
        this.form.stores = []
      }
    },
    closeModal(): void {
      this.loading = false
      this.$emit('close')
    },
    enableCarrier(): void {
      this.loading = true

      let storePayload: Array<StoreEntity & { exchangePlaces: ExchangePlaceEntity[] }> = this.form.stores

      if (this.form.allStores || this.form.allStoresAndEp) {
        storePayload = this.stores.map(({ id, exchangePlaces }) => {
          return {
            id,
            exchangePlaceIds: this.form.allStoresAndEp
              ? exchangePlaces.map(({ id: epId }) => epId)
              : [],
          }
        })
      }
      this.$emit('submit', this.carrier.id, storePayload)
    },
  },
})
</script>

<style lang="scss">
@import '../../styles/mixins/macScrollbar';
.enable-carrier-modal {
  .main-dialog-content {
    max-height: calc(60vh - 8rem);
    overflow-y: scroll;
    overflow-x: hidden;
    @include setMacScrollbar('&');
  }

  .activation-container {
    padding: 3rem;

    & > .label {
      color: #000;
    }

    .activation-choices {
      background-color: $main-lighten-80-color;
    }

    .v-expansion-panel-content__wrap {
      padding-bottom: 0 !important;
    }

    .ep-cb-container {
      padding: 0 !important;
      padding-left: 2rem !important;
    }
  }
}
</style>
