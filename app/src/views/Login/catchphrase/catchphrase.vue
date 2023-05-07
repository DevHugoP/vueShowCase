<template>
  <div class="catchphrase" data-id="login-catchphrase">
    <template v-if="$vuetify.breakpoint.xsOnly">
      <h2 class="catchphrase-title">{{ $t(`catchphrase.${index}.title`) }}</h2>
      <h4 class="catchphrase-content">{{ $t(`catchphrase.${index}.content`) }}</h4>
    </template>
    <template v-else>
      <h1 class="catchphrase-title">{{ $t(`catchphrase.${index}.title`) }}</h1>
      <h3 class="catchphrase-content">{{ $t(`catchphrase.${index}.content`) }}</h3>
    </template>
    <span class="italic14 catchphrase-legend">{{ $t(`catchphrase.${index}.legend`, '') }}</span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'catchphrase',
  props: {
    index: {
      type: Number,
      default: 0,
    },
  },
})
</script>

<style lang="scss">
.catchphrase {
  &-title {
    margin-bottom: 3rem;
  }

  &-content {
    @media #{map-get($display-breakpoints, 'xs-only')} {
      margin-bottom: 7rem;
    }

    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      margin-bottom: 1rem;
    }
  }

  &-legend {
    color: $main-lighten-52-color;
  }
}
</style>
