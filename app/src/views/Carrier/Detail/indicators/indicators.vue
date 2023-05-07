<template>
  <div>
    <v-row no-gutters id="carrier-detail-indicators" v-if="$vuetify.breakpoint.smAndUp">
      <v-col cols="12" md="5" class="left-column">
        <mp-score v-if="isAuthorized(params.retailerId ? 'READ_CARRIERS_INDICATORS_CHILD' : 'READ_CARRIERS_INDICATORS')" :models="carrier.models" />
      </v-col>
    </v-row>
    <v-row no-gutters id="carrier-detail-indicators-mobile" v-else>
      <v-expansion-panels flat>
        <mp-collapse
          ref="score"
          @click="scrollTo('score')"
          :title="$t('common.quality')"
          noPadding
          typographyClass="medium16"
          data-id="carrier-detail-indicators-collapse-score"
        >
          <mp-score :models="carrier.models" />
        </mp-collapse>
      </v-expansion-panels>
    </v-row>
  </div>
</template>

<script lang="ts">
import { authorizationMixin } from '@/mixins'
import { GetCarrierParams } from '@/services/carrier/CarrierRepository'
import mixins from 'vue-typed-mixins'
import mpScore from './score/score.vue'
import { CarrierEntity } from '@/types'

export default mixins(authorizationMixin).extend({
  name: 'mp-carrier-detail-indicators',
  components: {
    mpScore,
  },
  props: {
    carrier: {
      type: Object as () => CarrierEntity,
      required: true,
    },
    params: {
      type: Object as () => GetCarrierParams,
      required: true,
    },
  },
  methods: {
    scrollTo(refToScroll: string): void {
      setTimeout(() => {
        ;(this.$refs[refToScroll] as any).$el.scrollIntoView(true, {
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest',
        })
      }, 300)
    },
  },
})
</script>

<style lang="scss" scoped>
#carrier-detail-indicators {
  .left-column {
    padding-right: calc(100vw / (38 * 2));
  }

  .right-column {
    padding-left: calc(100vw / (38 * 2));
  }
}
</style>
