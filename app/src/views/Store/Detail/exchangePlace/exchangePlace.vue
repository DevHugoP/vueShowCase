<template>
  <div id="store-detail-exchange-place" data-id="store-detail-exchangePlace">
    <mp-block
      id="store-detail-exchange-place-block"
      :title="$vuetify.breakpoint.smAndUp ? $t('page.store.detail.exchangePlace.title') : ''"
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

      <div v-if="exchangePlaces.length" :class="`${exchangePlaces.length > 5 ? `exchange-places-wrapper` : ''}`" :style="{ maxHeight }">
        <v-row
          no-gutters
          :ref="`exchangePlace-${index}`"
          v-for="(place, index) in exchangePlacesFiltered()"
          :key="`exchange-place-${index}`"
          :class="`exchange-place${index === exchangePlaces.length - 1 ? ' no-border-bottom' : ''}`"
          :data-id="`store-detail-exchangePlace-${index}`"
        >
          <v-col cols="12" class="infos-wrapper d-flex">
            <mp-switch
              v-model="place.active"
              :disabled="!isAuthorized('EDIT_EXCHANGE_PLACES')"
              @click.native.stop="activeExchangePlace(place.id, $event)"
              :dataId="`store-detail-exchangePlace-${index}-switchActive`"
            />
            <router-link :to="getExchangePlaceRoute(index)" class="infos-link_wrapper">
              <v-icon size="1.8rem" class="main-lighten-65 ml-2">{{ getIcon(place.type) }}</v-icon>
              <div class="infos">
                <span
                  :class="`name regular14`"
                  :data-id="`store-detail-exchangePlace-${index}-name`"
                >
                  {{ place.name }}
                </span>
              </div>
              <v-spacer />
              <v-icon size="1.8rem" class="main-color">mdi-chevron-right</v-icon>
            </router-link>
          </v-col>
        </v-row>
      </div>

      <v-row
        no-gutters
        class="action-outer-wrapper"
        v-if="isAuthorized('CREATE_EXCHANGE_PLACES', { storeId })"
      >
        <v-col cols="12" class="action-wrapper d-flex justify-center">
          <mp-button
            :text="$t('action.add.base')"
            icon="plus"
            format="primary"
            :dataId="`store-detail-exchangePlace-goTo`"
            :to="{ name: 'createExchangePlace', params: { id: retailerId, storeId } }"
          />
        </v-col>
      </v-row>
    </mp-block>
  </div>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'

import ExchangePlaceService from '@/services/exchangePlace/ExchangePlaceService'

import mpBlock from '@/components/block/block.vue'

import { EXCHANGE_PLACE_TYPE } from '@/constants'

import { ROUTES } from '@/constants'

import { authorizationMixin } from '@/mixins'
import { ExchangePlaceEntity } from '@/types'

export default mixins(authorizationMixin).extend({
  name: 'mp-store-detail-exchange-place',
  components: {
    mpBlock,
  },
  props: {
    retailerId: {
      type: Number,
      required: true,
    },
    storeId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      exchangePlaces: [] as ExchangePlaceEntity[],
      maxHeight: 'fit-content',
      displayResearchInput: false,
      researchValue: '',
    }
  },
  async mounted() {
    this.exchangePlaces = await ExchangePlaceService.getAll({ storeId: this.storeId })

    this.$nextTick(() => {
      if (this.$refs['exchangePlace-0']) {
        const oneElementHeight = (this.$refs['exchangePlace-0'] as any)[0].offsetHeight

        const numberOfElement = Object.keys(this.$refs).filter(storeName =>
          storeName.includes('exchangePlace'),
        ).length

        if (numberOfElement > 5) {
          this.maxHeight = `${oneElementHeight * 5}px`
          this.displayResearchInput = true
        }
      }
    })
  },
  methods: {
    exchangePlacesFiltered() {
      if (this.displayResearchInput) {
        return this.exchangePlaces.filter(exchangePlace =>
          exchangePlace.name.toLowerCase().includes(this.researchValue.toLowerCase()),
        )
      }

      return this.exchangePlaces
    },
    getExchangePlaceRoute(index: number) {
      if (this.isAuthorized('READ_EXCHANGE_PLACES')) {
        return {
          name: ROUTES.exchangePlace,
          params: {
            id: this.retailerId.toString(),
            storeId: this.storeId.toString(),
            exchangePlaceId: this.exchangePlaces[index].id.toString(),
          },
        }
      }

      return ''
    },
    async activeExchangePlace(exchangePlaceId: number, e: MouseEvent) {
      const target = e.currentTarget as HTMLElement
      const isChecked = (target.querySelector('[type="checkbox"]') as HTMLInputElement).checked
      await ExchangePlaceService.update(exchangePlaceId, { active: isChecked })
    },
    getIcon(placeType: string) {
      switch (placeType) {
        case EXCHANGE_PLACE_TYPE.EXCHANGE_PLACE_STORAGE:
          return 'mdi-warehouse'
        case EXCHANGE_PLACE_TYPE.EXCHANGE_PLACE_DRIVE:
          return 'mdi-car'
        default:
          return 'mdi-storefront-outline'
      }
    },
  },
})
</script>

<style lang="scss">
@import '../../../../styles/mixins/macScrollbar';

#store-detail-exchange-place {
  padding: 0;

  @media #{map-get($display-breakpoints, 'xs-only')} {
    border-top: solid 0.1rem $main-lighten-74-color;
  }

  .exchange-place {
    display: flex;
    align-items: center;
    border-bottom: solid 0.1rem $main-lighten-74-color;
    padding: 1.6rem 0;

    &:first-of-type {
        padding-top: 0;
      }

    &.no-border-bottom {
      border-bottom: none;
      padding-bottom: 0;
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
      padding-left: 1rem;
      cursor: pointer;

      .name {
        color: $main-color;
      }
    }

    .append-icon {
      cursor: pointer;
      display: flex;
      justify-content: center;
    }
  }

  .action-outer-wrapper {
    margin-top: 2.5rem;
    margin-bottom: 0.1rem;

    .action-wrapper {
      @media #{map-get($display-breakpoints, 'xs-only')} {
        display: flex;
        justify-content: center;
      }

      i {
        margin-right: 1rem;
      }
    }
  }

  .exchange-places-wrapper {
    overflow-y: auto;
    overflow-x: hidden;
    @include setMacScrollbar('&');
  }
}
</style>
