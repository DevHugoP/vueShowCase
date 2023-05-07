<template>
  <div id="not-found" data-id="notFound">
    <template v-if="$vuetify.breakpoint.xsOnly">
      <div class="content">
        <v-row class="not-found__illustration" no-gutters justify="center" align="center">
          <v-col cols="12">
            <v-img src="@/assets/illustrations/404.svg" data-id="notFound-logo" />
          </v-col>
        </v-row>
        <v-row class="not-found__content" no-gutters>
          <v-col offset="1" cols="10">
            <h2 data-id="notFound-title">
              {{ $t('common.oh') }} <br />
              {{ $t('page.notFound.main.notFound') }}
            </h2>
          </v-col>
        </v-row>
      </div>

      <v-row no-gutters>
        <v-col cols="12" class="action-mobile-wrapper">
          <mp-button
            format="sticky"
            stickyColor="yellow"
            class="action-mobile"
            :text="$t('action.backToHome')"
            dataId="notFound-toHome"
            to="/"
          />
        </v-col>
      </v-row>
    </template>

    <template v-else>
      <v-row class="split-screen__wrapper" no-gutters>
        <v-col class="split-screen__wrapper--right" offset="6" cols="6">
          <v-row class="not-found__content" no-gutters>
            <v-col offset="1" cols="8">
              <h1 data-id="notFound-title">
                {{ $t('common.oh') }} <br />
                {{ $t('page.notFound.main.notFound') }}
              </h1>
              <span class="thin100 error-code">404</span>
            </v-col>
          </v-row>

          <v-row class="not-found__back-button" no-gutters>
            <v-col offset="1" cols="8">
              <mp-button
                format="primary"
                class="back-button"
                :text="$t('action.backToHome')"
                dataId="notFound-toHome"
                to="/"
              />
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
  name: 'not-found',
})
</script>

<style lang="scss">
#not-found {
  @media #{map-get($display-breakpoints, 'sm-and-up')} {
    background: url('~@/assets/illustrations/404.svg') no-repeat 0 100%,
      linear-gradient(
        90deg,
        rgba(255, 224, 0, 1) 0%,
        rgba(255, 224, 0, 1) 50%,
        rgba(255, 255, 255, 1) 50%,
        rgba(255, 255, 255, 1) 51%,
        rgba(255, 255, 255, 1) 100%
      );
    background-size: contain;

    .not-found__content {
      margin-bottom: 5rem;

      h1 {
        margin-top: 8.6rem;
      }

      .error-code {
        color: $main-lighten-74-color;
      }
    }

    .not-found__back-button {
      .back-button {
        height: 8rem;
        width: 28rem;
        border-radius: 10rem;

        .v-btn__content {
          span {
            @include h3-18-medium;
            text-transform: uppercase;
          }
        }
      }
    }
  }

  @media #{map-get($display-breakpoints, 'xs-only')} {
    .content {
      min-height: calc(100vh - 5.4rem - 6rem) !important;
      max-height: calc(100vh - 5.4rem - 6rem) !important;
      overflow: auto;

      .not-found__illustration {
        background-color: $primary-color;
        height: 32rem;
      }

      .not-found__content {
        h2 {
          margin-top: 2.6rem;
        }
      }
    }

    .action-mobile-wrapper {
      .action-mobile {
        width: 100%;
        min-height: 6rem;
      }
    }
  }
}
</style>
