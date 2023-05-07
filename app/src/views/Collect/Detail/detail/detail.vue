<template>
  <mp-block
    id="collect-detail-detail"
    :title="$vuetify.breakpoint.smAndUp ? $t('page.detailCollect.detail.title') : ''"
    titleHasPaddingBottom
    :hasBorder="$vuetify.breakpoint.smAndUp"
    :hasMarginBottom="$vuetify.breakpoint.smAndUp"
  >
    <div class="detail-wrapper">
      <div class="detail type">
        <span class="regular14 main-lighten-52"> {{ $t('page.detailCollect.detail.type') }} </span>
        <span class="regular14 main-color">
          {{ $t(`technical.collectMode.${collect.mode}`) }}
        </span>
      </div>

      <div class="detail store" v-if="retailer">
        <span class="regular14 main-lighten-52">{{ $t('page.detailCollect.detail.retailer') }}
        </span>
        <span class="regular14 main-color"> {{ retailer.name }} </span>
      </div>

      <div class="detail date">
        <span class="regular14 main-lighten-52">
          {{ $t('page.detailCollect.detail.register') }}
        </span>
        <span class="regular14 main-color">
          {{ getFormattedCreatedAt }}
        </span>
      </div>

      <div class="detail numberOfPackage">
        <span class="regular14 main-lighten-52">
          {{ $t('page.detailCollect.detail.numberOfPackage') }}
        </span>
        <span class="regular14 main-color"> {{ numberOfPackage }} </span>
      </div>

      <div class="detail weightOfPackage">
        <span class="regular14 main-lighten-52">
          {{ $t('page.detailCollect.detail.weightOfPackage') }}
        </span>
        <span class="regular14 main-color"> {{ weightOfPackage }} kg </span>
      </div>
    </div>
  </mp-block>
</template>

<script lang="ts">
/* eslint @typescript-eslint/no-non-null-asserted-optional-chain: off */
import Vue from 'vue'

import mpBlock from '@/components/block/block.vue'
import { Collect, RetailerEntity } from '@/types'

import RetailerService from '@/services/retailer/RetailerService'

import convert from 'convert-units'

import { dateHelper, dateHelperGetTimezonedDate } from '@/helpers/dateHelper'

export default Vue.extend({
  name: 'collect-detail',
  components: {
    mpBlock,
  },
  props: {
    collect: {
      type: Object as () => Collect,
      required: true,
    },
  },
  data: () => ({
    retailer: null as RetailerEntity | null,
    dateHelper,
  }),
  computed: {
    numberOfPackage(): number {
      return this.collect.packages?.reduce((acc, localPackage) => {
        return acc + localPackage.quantity
      }, 0)!
    },
    weightOfPackage(): number {
      let weight = 0
      for (const localPackage of this.collect.packages) {
        const quantity = localPackage.quantity || 1

        weight += (convert(localPackage.weight.value || undefined)
          .from(localPackage.weight.unit as any)
          .to('kg') * quantity)
      }

      return parseFloat(weight).toFixed(2)
    },
    getFormattedCreatedAt(): string {
      return dateHelper.formatToTimezone(
        dateHelperGetTimezonedDate(this.collect.createdAt),
        'UTC',
        'P p',
      )
    },
  },
  async mounted() {
    this.retailer = await RetailerService.get(this.collect.retailerId)
  },
})
</script>

<style lang="scss" scoped>
#collect-detail-detail {
  .detail-wrapper {
    .detail {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 1.6rem;
      margin-bottom: 1.6rem;
      border-bottom: solid 0.1rem $main-lighten-74-color;

      &:last-of-type {
      border-bottom: none;
      padding-bottom: 0;
      margin-bottom: 0;
      }
    }
  }
}
</style>
