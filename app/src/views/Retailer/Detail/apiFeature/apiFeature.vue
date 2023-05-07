<template>
  <mp-block
    id="retailer-detail-api-feature"
    :title="$vuetify.breakpoint.smAndUp ? $t('page.retailerDetail.apiFeature.title') : ''"
    :hasBorder="$vuetify.breakpoint.smAndUp"
    :hasMarginBottom="$vuetify.breakpoint.smAndUp"
    titleHasPaddingBottom
  >
    <v-row
      no-gutters
      :ref="`api-feature-${index}`"
      v-for="(feature, index) in Object.keys(features)"
      :key="`api-feature-${index}`"
      :class="
        `api-feature ${index === Object.keys(features).length - 1 ? ' no-border-bottom' : ''}`
      "
      :data-id="`api-feature-${index}`"
    >
      <v-col cols="12" class="d-flex align-center">
        <mp-switch
          @click.native.prevent="toggleFeature"
          v-model="features[feature]"
          :dataId="`api-feature-${index}-switchActive`"
          :disabled="isDisabled()"
        />
        <span class="regular14 pl-2 main-color">
          {{ $t(`page.retailerDetail.apiFeature.${feature}`) }}
        </span>
      </v-col>
    </v-row>
  </mp-block>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'

import mpBlock from '@/components/block/block.vue'

import RetailerService from '@/services/retailer/RetailerService'
import { authorizationMixin } from '@/mixins'

export const apis = ['ret-api', 'collect']

export default mixins(authorizationMixin).extend({
  components: { mpBlock },
  name: 'mp-retailer-detail-api-feature',
  props: {
    apiFeatures: {
      type: Array as () => string[],
    },
  },
  data: () => ({
    features: {} as Record<string, any>,
    updateInProgress: false,
  }),
  async mounted() {
    this.features = apis.reduce((acc, api) => {
      return {
        ...acc,
        [api]: (this.apiFeatures || []).includes(api),
      }
    }, {})
  },
  methods: {
    isDisabled() {
      return (
        !this.isAuthorized('EDIT_RETAILERS') ||
        !this.isAuthorized('EDIT_RETAILER_API_FEATURES') ||
        this.updateInProgress
      )
    },
    async toggleFeature() {
      if (this.isDisabled()) {
        return
      }

      this.updateInProgress = true

      const retailerId = this.$route.params.id
      const apiFeatures = Object.entries(this.features).reduce((acc: string[], [key, feature]) => {
        if (feature) {
          acc.push(key)
        }
        return acc
      }, [])

      await RetailerService.updateFeatures(retailerId, { apiFeatures })

      this.updateInProgress = false
    },
  },
})
</script>

<style lang="scss">
#retailer-detail-api-feature {
  @media #{map-get($display-breakpoints, 'sm-and-up')} {
    border: solid 0.1rem $main-lighten-65-color;
    border-radius: 0.4rem;
    padding: 1.7rem 2.4rem 2rem 2.9rem;
  }

  @media #{map-get($display-breakpoints, 'xs-only')} {
    border-top: solid 0.1rem $main-lighten-74-color;
    padding-top: 1rem;
    padding-left: 2.5rem;
    padding-right: 2rem;
  }

  .title-outer-wrapper {
    margin-bottom: 2.3rem;
  }

  .api-feature {
    margin-bottom: 1.6rem;
    padding-bottom: 1.6rem;
    display: flex;
    align-items: center;
    border-bottom: solid 0.1rem $main-lighten-65-color;

    &.no-border-bottom {
      border-bottom: none;
      margin-bottom: 0;
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
  }
}
</style>
