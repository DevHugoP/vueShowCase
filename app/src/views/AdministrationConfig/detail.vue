<template>
  <div id="administration-detail" class="d-flex flex-column">
    <content-header
      id="detail-administration__header"
      className="d-flex flex-column"
      hasBoxShadow
      v-if="$vuetify.breakpoint.smAndUp"
      data-id="administration-detail"
    >
      <template #breadcrumb>
        <mp-breadcrumb />
      </template>
      <template #title>
        <h1>{{ headerTitle }}</h1>
      </template>
      <template #actions-button v-if="isAuthorized('EDIT_ADMINISTRATION')">
        <div class="actions-wrapper">
          <mp-button
            format="secondary"
            class="edit-administration__button"
            :text="$t('action.modify.base')"
            icon="pencil"
            @click="$router.push({ name: ROUTES.administrationConfigEdit })"
            data-id="administration-detail-addadministration"
          />
        </div>
      </template>
    </content-header>

    <div id="admin-config-detail-content">
      <v-row class="mt-6" no-gutters>
        <v-col v-if="administrationConfig.metabase.url" cols="12" offset-sm="1" sm="5">
          <mp-block
            :title="$vuetify.breakpoint.smAndUp ? $t('page.dashboard.title') : ''"
            :hasBorder="$vuetify.breakpoint.smAndUp"
            :hasMarginBottom="$vuetify.breakpoint.smAndUp"
            id="metabase"
          >
            <v-row no-gutters class="mt-4">
              <v-col cols="12">
                <div class="text-wrapper">
                  <span class="label regular14">{{
                    $t('page.administrationConfigEdit.metabase.url')
                  }}</span>
                  <span class="regular14" data-id="metabase-configuration-url">
                    {{ administrationConfig.metabase.url }}
                  </span>
                </div>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="12">
                <div class="text-wrapper">
                  <span class="label regular14">{{
                    $t('page.administrationConfigEdit.metabase.secretKey')
                  }}</span>
                  <span class="regular14" data-id="metabase-configuration-secret">
                    {{ administrationConfig.metabase.secretKey }}
                  </span>
                </div>
              </v-col>
            </v-row>
          </mp-block>
        </v-col>
      </v-row>
      <v-row class="mt-6" no-gutters>
        <v-col v-if="administrationConfig.jwt" cols="12" offset-sm="1" sm="5">
          <mp-block
            :title="$vuetify.breakpoint.smAndUp ? $t('page.administrationConfig.jwt.title') : ''"
            :hasBorder="$vuetify.breakpoint.smAndUp"
            :hasMarginBottom="$vuetify.breakpoint.smAndUp"
            id="jwt"
          >
            <v-row no-gutters>
              <v-col cols="12">
                <div class="text-wrapper">
                  <span class="label regular14">{{
                    $t('page.administrationConfigEdit.jwt.secretKey')
                  }}</span>
                  <span class="regular14" data-id="jwt-configuration-secret">
                    {{ administrationConfig.jwt.secretKey }}
                  </span>
                </div>
              </v-col>
            </v-row>
          </mp-block>
        </v-col>
      </v-row>
    </div>


    <v-row v-if="$vuetify.breakpoint.xsOnly && isAuthorized('EDIT_ADMINISTRATION')" no-gutters class="administration-detail-edit-button__outer-wrapper">
      <v-col cols="12" class="action-mobile-wrapper">
        <mp-button
          format="sticky"
          stickyColor="yellow"
          class="action-mobile"
          :text="$t('action.modify.base')"
          icon="pencil"
          @click="$router.push({ name: ROUTES.administrationConfigEdit })"
          data-id="administration-detail-addadministration-mobile"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { authorizationMixin } from '@/mixins'
import mixins from 'vue-typed-mixins'
import { mapGetters } from 'vuex'

import { ROUTES } from '@/constants'

import contentHeader from '@/components/contentHeader/contentHeader.vue'
import mpBreadcrumb from '@/components/breadcrumb/breadcrumb.vue'
import mpBlock from '@/components/block/block.vue'
import AdministrationService from '@/services/administration/AdministrationService'
import { AdministrationConfig } from '@/types'

export default mixins(authorizationMixin).extend({
  name: 'administration-detail',
  components: {
    contentHeader,
    mpBreadcrumb,
    mpBlock,
  },
  data: () => ({
    ROUTES,
    administrationConfig: {
      metabase: {
        url: '',
      },
      jwt: {
        secretKey: '',
      },
    } as AdministrationConfig,
  }),
  async mounted() {
    this.administrationConfig = await AdministrationService.getAll()
  },
  computed: {
    ...mapGetters({
      headerTitle: 'getHeaderTitle',
      currentUser: 'auth/currentUser',
    }),
  },
})
</script>

<style lang="scss">
@import '../../styles/mixins/macScrollbar';
#administration-detail {
  @include setMacScrollbar('&');
  padding: 0;

  .content-header-outer-wrapper {
    .actions-wrapper {
      display: flex;
      justify-content: flex-end;

      i {
        margin-right: 1rem;
      }
    }
  }

  #admin-config-detail-content {
    .text-wrapper {
      border-bottom: solid 0.1rem $main-lighten-74-color;
      padding-bottom: 1rem;
      padding-top: 1.3rem;
      @media #{map-get($display-breakpoints, 'sm-and-up')} {
        margin-right: 2.5rem;
      }

      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;

      .label {
        color: $main-lighten-52-color;
        margin-right: 1rem;
      }

      .regular14 {
        word-break: break-word;
      }
    }

    @media #{map-get($display-breakpoints, 'xs-only')} {
      min-height: calc(100vh - 5.4rem - 6rem);
      max-height: calc(100vh - 5.4rem);
      overflow: scroll !important;
    }
  }

  .action-outer-wrapper-mobile {
    .action-cancel-wrapper {
      padding-right: 0.1rem;
    }

    button {
      min-height: 6rem;
      width: 100%;
    }
  }

  .action-mobile-wrapper {
    .action-mobile {
      width: 100%;
      min-height: 6rem;
    }
  }
}
</style>
