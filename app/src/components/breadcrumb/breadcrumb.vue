<template>
  <div id="breadcrumb" class="d-flex align-center">
    <div
      v-for="(breadcrumb, index) in $route.meta.breadcrumbs"
      :key="`breadcrumb-${index}`"
      class="d-flex align-center"
    >
      <router-link
        :to="breadcrumb.link"
        :class="
          `regular12 breadcrumb-item${
            index === $route.meta.breadcrumbs.length - 1 ? ' breadcrumb-item--last' : ''
          }`
        "
        :data-id="`breadcrumb-${breadcrumbName(breadcrumb)}`"
      >
        {{ $t(breadcrumbName(breadcrumb)) }}
      </router-link>
      <v-icon v-if="$route.meta.breadcrumbs[index + 1]" class="icon" size="1.8rem">
        mdi-chevron-right
      </v-icon>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { BreadCrumb } from '@/types'

export default Vue.extend({
  name: 'mp-breadcrumb',
  methods: {
    breadcrumbName(breadcrumb: BreadCrumb): string {
      const { name } = breadcrumb
      const getBreadcrumbsLabel = this.$store.getters.getBreadcrumbsLabel
      let labels: { [key: string]: string } = {}

      if (getBreadcrumbsLabel) {
        labels = JSON.parse(getBreadcrumbsLabel)
      }

      return labels[name] || name || ''
    },
  },
})
</script>

<style lang="scss" scoped>
@import '../../styles/mixins/macScrollbar';

#breadcrumb {
  overflow-x: auto;
  max-width: 80vw;
  max-height: 4rem;
  min-height: 4rem;
  white-space: nowrap;

  @include setMacScrollbar('&');

  .breadcrumb-item {
    color: $main-color;
    text-decoration: none;

    .icon {
      margin-right: 0.4rem;
      margin-left: 0.4rem;
    }

    &.breadcrumb-item--last {
      pointer-events: none;
      color: $main-lighten-52-color;
    }
  }
}
</style>
