<template>
  <div id="no-access" data-id="noAccess">
    <template v-if="$vuetify.breakpoint.xsOnly">
      <v-row class="no-access__illustration" no-gutters justify="center" align="center">
        <v-col cols="12">
          <v-img src="@/assets/illustrations/noAccess.svg" data-id="noAccess-img" />
        </v-col>
      </v-row>
      <v-row class="no-access__content" no-gutters>
        <v-col offset="1" cols="10">
          <h2 data-id="noAccess-title">
            {{ $t('common.oh') }}
            <br />
            {{ $t('page.noAccess.main.noAccess') }}
          </h2>
          <h4 data-id="noAccess-comeBackLater">{{ $t('page.noAccess.comeBackLater') }}</h4>
        </v-col>
      </v-row>
    </template>

    <template v-else>
      <v-row class="split-screen__wrapper" no-gutters>
        <v-col class="split-screen__wrapper--right" offset="6" cols="6">
          <v-row class="no-access__content" no-gutters>
            <v-col offset="1" cols="8">
              <h1 data-id="noAccess-title">
                {{ $t('common.oh') }}
                <br />
                {{ $t('page.noAccess.main.noAccess') }}
              </h1>
              <h3 data-id="noAccess-comeBackLater">{{ $t('page.noAccess.comeBackLater') }}</h3>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'no-access',
})
</script>

<style lang="scss">
#no-access {
  @media #{map-get($display-breakpoints, 'sm-and-up')} {
    background: url('~@/assets/illustrations/noAccess.svg') no-repeat 0 100%,
      linear-gradient(
        90deg,
        rgba(255, 224, 0, 1) 0%,
        rgba(255, 224, 0, 1) 50%,
        rgba(255, 255, 255, 1) 50%,
        rgba(255, 255, 255, 1) 51%,
        rgba(255, 255, 255, 1) 100%
      );
    background-size: contain;

    .no-access__content {
      h1 {
        margin: 8.6rem 0 1.6rem 0;
      }
    }
  }

  @media #{map-get($display-breakpoints, 'xs-only')} {
    .no-access__illustration {
      background-color: $primary-color;
      height: 32rem;
    }

    .no-access__content {
      h2 {
        margin: 2.6rem 0 1.6rem 0;
      }
    }
  }
}
</style>
