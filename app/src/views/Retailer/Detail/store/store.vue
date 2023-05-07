<template>
  <v-container id="retailer-detail-store" data-id="retailer-detail-store">
    <mp-block
      id="retailer-detail-store-block"
      :title="$vuetify.breakpoint.smAndUp ? $t('page.retailerDetail.stores.title') : ''"
      :hasBorder="$vuetify.breakpoint.smAndUp"
      :hasMarginBottom="$vuetify.breakpoint.smAndUp"
      titleHasPaddingBottom
    >
      <div v-if="displayResearchInput">
        <mp-textfield
          :label="$t('action.search.base')"
          v-model="researchValue"
          dataId="store-search"
          :errors="[]"
          :isDirty="false"
        />
      </div>
      <div
        v-if="stores.length"
        :class="`${stores.length > 5 ? 'stores-wrapper' : ''}`"
        :style="{ maxHeight }"
      >
        <v-row
          :ref="`store-${index}`"
          no-gutters
          v-for="(store, index) in storesFiltered"
          :key="`retailer-detail-store-${index}`"
          :class="`store pl-2${index === stores.length - 1 ? ' last' : ''}${index === 0 ? ' first' : ''}`"
        >
          <v-col cols="12" class="d-flex align-center">
            <mp-switch
              @click.native.prevent="activeStore(store.id, $event)"
              v-model="store.active"
              :dataId="`retailer-detail-store-${index}-active`"
              :disabled="!isAuthorized('EDIT_STORES', { retailerId })"
            />
            <router-link :to="getStoreRoute(store.id)" class="infos-link_wrapper">
              <div :data-id="`retailer-detail-store-${index}-goToStore`" class="infos pl-2">
                <div
                  class="name regular14"
                  :data-id="`retailer-detail-store-${index}-goToStore-name`"
                >
                  {{ store.name }}
                </div>
                <div
                  class="id regular14"
                  :data-id="`retailer-detail-store-${index}-goToStore-externalStoreId`"
                >
                  {{ store.externalStoreId }}
                </div>
              </div>
              <v-spacer />
              <v-icon size="1.8rem" class="main-color">mdi-chevron-right</v-icon>
            </router-link>
          </v-col>
        </v-row>
      </div>
      <div v-else>
        <no-data dataId="retailer-detail-store-noData" />
      </div>

      <v-row
        no-gutters
        class="action-outer-wrapper"
        v-if="isAuthorized('CREATE_STORES', { retailerId })"
      >
        <v-col cols="12" class="action-wrapper">
          <mp-button
            dataId="retailer-detail-store-newStore"
            icon="plus"
            :text="$t('action.add.base')"
            :to="{ name: ROUTES.createStore, params: { id: retailerId } }"
          />
        </v-col>
      </v-row>
    </mp-block>
  </v-container>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'

import noData from '@/components/noData/noData.vue'
import mpBlock from '@/components/block/block.vue'

import StoreService from '@/services/store/StoreService'

import { ROUTES } from '@/constants'
import AuthorizationService from '@/services/authorization/AuthorizationService'
import { RulesKey, StoreEntity } from '@/types'

import { authorizationMixin } from '@/mixins'

export default mixins(authorizationMixin).extend({
  name: 'mp-retailer-detail-store',
  components: {
    noData,
    mpBlock,
  },
  props: {
    retailerId: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    ROUTES,
    stores: [] as StoreEntity[],
    maxHeight: 'fit-content',
    displayResearchInput: false,
    researchValue: '',
  }),
  computed: {
    storesFiltered() {
      if (this.displayResearchInput) {
        return this.stores.filter(store =>
          store.name.toLowerCase().includes(this.researchValue.toLowerCase()),
        )
      }

      return this.stores
    },
  },
  async mounted() {
    this.stores = await StoreService.getAll({ retailerId: this.retailerId })

    this.$nextTick(() => {
      if (this.$refs['store-0']) {
        const oneElementHeight = (this.$refs['store-0'] as any)[0].offsetHeight

        const numberOfElement = Object.keys(this.$refs).filter(storeName =>
          storeName.includes('store'),
        ).length

        if (numberOfElement > 5) {
          this.maxHeight = `${oneElementHeight * 5}px`
          this.displayResearchInput = true
        }
      }
    })
  },
  methods: {
    getStoreRoute(storeId: number) {
      const { retailerId } = this
      const { permissions } = this.$store.getters['auth/currentUser']

      if (AuthorizationService.isAllowed('READ_STORES' as RulesKey, permissions, { retailerId })) {
        return {
          name: ROUTES.detailStore,
          params: { id: retailerId.toString(), storeId: storeId.toString() },
        }
      }

      return ''
    },
    async activeStore(storeId: number, e: MouseEvent) {
      const target = e.currentTarget as HTMLElement
      const isChecked = (target.querySelector('[type="checkbox"]') as HTMLInputElement).checked
      await StoreService.update(storeId, { active: isChecked })
    },
  },
})
</script>

<style lang="scss">
@import '../../../../styles/mixins/macScrollbar';

#retailer-detail-store {
  padding: 0;

  @media #{map-get($display-breakpoints, 'xs-only')} {
    border-top: solid 0.1rem $main-lighten-74-color;
  }

  .title-outer-wrapper {
    margin-bottom: 2.3rem;
  }

  .store {
    display: flex;
    align-items: center;
    border-bottom: solid 0.1rem $main-lighten-74-color;
    padding: 1.6rem 0;

    &.last {
      border-bottom: none;
      padding-bottom: 0;
    }

    &.first {
      padding-top: 0;
    }

    .v-input--switch {
      .v-input__slot {
        margin: 0;
      }

      .v-messages {
        display: none;
      }
    }

    .infos-link_wrapper {
      text-decoration: none;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .infos {
      cursor: pointer;

      @media #{map-get($display-breakpoints, 'xs-only')} {
        padding-left: 1.8rem;
      }

      .name {
        margin-bottom: 0.1rem;
        color: $main-color;
      }

      .id {
        color: $main-lighten-52-color;
      }
    }

    .append-icon {
      cursor: pointer;
      display: flex;
      justify-content: flex-end;

      @media #{map-get($display-breakpoints, 'xs-only')} {
        display: flex;
        justify-content: center;
      }
    }
  }

  .action-outer-wrapper {
    margin-top: 2.5rem;
    margin-bottom: 0.1rem;

    .action-wrapper {
      display: flex;
      justify-content: center;
    }
  }

  .stores-wrapper {
    overflow-y: auto;
    overflow-x: hidden;
    @include setMacScrollbar('&');
  }
}
</style>
