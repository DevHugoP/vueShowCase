<template>
  <div id="dashboard-detail" class="d-flex flex-column">
    <div id="overlay" v-if="showActionsMobile" />
    <content-header
      id="detail-dashboard__header"
      className="d-flex flex-column mb-5"
      v-if="$vuetify.breakpoint.smAndUp"
      data-id="dashboard-detail"
    >
      <template #breadcrumb>
        <mp-breadcrumb />
      </template>
      <template #title>
        <h1>{{ headerTitle }}</h1>
      </template>
      <template #actions-button>
        <div :class="`actions-wrapper ${!canAccessFilter() && 'mb-10'}`">
          <mp-button
            v-if="isAuthorized('CREATE_DASHBOARD')"
            format="primary"
            class="add-dashboard__button mr-2 mb-2"
            :text="$t('action.add.base')"
            icon="plus"
            @click="$router.push({ name: ROUTES.createDashboard })"
            data-id="dashboard-detail-addDashboard"
          />
          <mp-button
            v-if="isAuthorized('EDIT_DASHBOARD')"
            format="secondary"
            class="edit-dashboard__button mb-2"
            :text="$t('action.modify.base')"
            icon="pencil"
            :disabled="!dashboards[selectedDashboard] || !dashboards[selectedDashboard].id"
            @click="
              $router.push({
                name: ROUTES.editDashboard,
                params: { id: dashboards[selectedDashboard].id },
              })
            "
            data-id="dashboard-detail-addDashboard"
          />
        </div>
      </template>
    </content-header>

    <dashboards-filters @submit="filterDashboard($event)" @reset="filterDashboard($event)" />

    <div v-if="$vuetify.breakpoint.xsOnly" class="dashboard-selector-mobile">
      <mp-button
        v-if="isAuthorized('CREATE_DASHBOARD')"
        format="primary"
        class="add-dashboard__button px-5"
        icon="plus"
        @click="$router.push({ name: ROUTES.editDashboard })"
        data-id="dashboard-detail-addDashboard"
        small
      />

      <div class="dashboard-selector-wrapper">
        <div
          v-for="(dashboard, index) in dashboards"
          :key="`dashboard-${index}`"
          :class="
            `dashboard-selected${index === dashboards.length - 1 ? ' last' : ''}${
              selectedDashboard === index ? ' selected' : ''
            }`
          "
          @click="selectDashboard(index)"
        >
          <span
            :class="`regular16 ${selectedDashboard === index ? 'main-color' : 'main-lighten-52'}`"
          >
            {{ dashboard.name }}
          </span>
        </div>
      </div>
    </div>

    <v-row v-else-if="dashboards.length" class="mt-4">
      <v-col cols="10" offset="1">
        <div class="chips-dashboard-list">
          <mp-chips-wrapper
            :chips="dashboardsToChips"
            :maxChips="4"
            @input="selectDashboard($event.value)"
            v-model="currentDashboard"
            dataId="dashbord-name-list"
          />
        </div>
      </v-col>
    </v-row>

    <no-data v-if="!dashboards.length" id="no-data" dataId="dashboard-permissions-noData" />

    <div
      v-if="dashboards.length && $vuetify.breakpoint.smAndUp && isAuthorized('SHARE_DASHBOARD')"
      class="action-share"
    >
      <v-btn
        class="share"
        fixed
        @click="
          $router.push({
            name: ROUTES.shareDashboard,
            params: { id: dashboards[selectedDashboard].id },
          })
        "
        data-id="dashboard-detail-share"
      >
        <v-icon>mdi-account-plus</v-icon>
        <h4>{{ $t('page.dashboard.share.title') }}</h4>
      </v-btn>
    </div>

    <div
      v-for="(dashboard, index) in dashboards"
      class="iframe-container d-flex flex-column"
      :key="`iframe-metabase-${index}`"
    >
      <iframe
        v-if="dashboardURL[index]"
        v-show="index === selectedDashboard"
        :src="dashboardURL[index]"
        frameborder="0"
        :height="windowSize.height"
        allowtransparency
      />
    </div>

    <v-overlay v-if="loading">
      <v-progress-circular indeterminate size="64" />
    </v-overlay>

    <div
      class="mobile-action-buttons-wrapper"
      v-if="$vuetify.breakpoint.xsOnly && dashboards.length"
    >
      <v-btn
        fab
        bottom
        right
        fixed
        class="fab-button"
        v-if="!showActionsMobile"
        @click="showActionsMobile = true"
      >
        <v-icon>mdi-apps</v-icon>
      </v-btn>
      <v-row no-gutters v-else v-click-outside="onClickOutside">
        <v-col
          cols="12"
          v-for="(action, index) in actions"
          :key="`action-${action.text}-${index}`"
          :class="
            `fab-actions${index === 0 ? ' first' : ''}${
              index === actions.length - 1 ? ' last' : ''
            }`
          "
        >
          <v-row no-gutters class="fab-actions-content" @click="handleActionsClick(action.type)">
            <v-col cols="12" class="fab-actions-text">
              <v-icon>{{ action.icon }}</v-icon>
              <span class="regular16">{{ action.text }}</span>
            </v-col>
            <v-col cols="12" v-if="index !== actions.length - 1">
              <div class="divider" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import mpBlock from '@/components/block/block.vue'
import mpBreadcrumb from '@/components/breadcrumb/breadcrumb.vue'

import contentHeader from '@/components/contentHeader/contentHeader.vue'
import filtersPanel from '@/components/filtersPanel/filtersPanel.vue'
import noData from '@/components/noData/noData.vue'

import { DASHBOARD_ACTIONS_TYPE, ROUTES } from '@/constants'
import { authorizationMixin } from '@/mixins'
import AuthorizationService from '@/services/authorization/AuthorizationService'

import DashboardService from '@/services/dashboard/DashboardService'
import mixins from 'vue-typed-mixins'
import { mapGetters } from 'vuex'
import dashboardsFilters from './dashboardsFilters/dashboardsFilters.vue'

export default mixins(authorizationMixin).extend({
  name: 'dashboard-detail',
  components: {
    contentHeader,
    mpBreadcrumb,
    dashboardsFilters,
    filtersPanel,
    mpBlock,
    noData,
  },
  data: () => ({
    showCreateModal: false,
    dashboardURL: [] as string[],
    ROUTES,
    dashboards: [] as Array<{
      id: string
      url: string
      name: string
    }>,
    selectedDashboard: 0,
    showDeleteModal: false,
    isEdit: false,
    loading: true,
    windowSize: {
      width: 0,
      height: 0,
    } as Record<string, number>,
    showActionsMobile: false,
    actions: [] as Array<{ text: string; icon: string; type: string }>,
    currentDashboard: null as {
      id: string
      url: string
      name: string
    } | null,
  }),
  async beforeMount() {
    if (!this.isAuthorized('READ_DASHBOARD')) {
      this.$router.push('/orders')
    }
  },
  async mounted() {
    // get retailer for breadcrumb
    // this.dashboards = response
    this.windowSize.width = window.innerWidth
    this.windowSize.height = window.innerHeight * 2

    if (this.isAuthorized('SHARE_DASHBOARD')) {
      this.actions.push({
        text: this.$t('page.dashboard.share.title'),
        icon: 'mdi-account-plus',
        type: DASHBOARD_ACTIONS_TYPE.SHARE,
      })
    }

    if (this.isAuthorized('EDIT_DASHBOARD')) {
      this.actions.push({
        text: this.$t('action.modify.base'),
        icon: 'mdi-pencil',
        type: DASHBOARD_ACTIONS_TYPE.MODIFY,
      })
    }
  },
  computed: {
    ...mapGetters({
      filters: 'filters/filters',
      headerTitle: 'getHeaderTitle',
      currentUser: 'auth/currentUser',
    }),
    dashboardsToChips() {
      return this.dashboards.map((dashboard, index) => {
        return {
          value: index,
          text: dashboard.name,
        }
      })
    },
  },
  methods: {
    async closeModal() {
      this.loading = true
      this.showCreateModal = false
      this.dashboards = await DashboardService.getAll({})
      this.loading = false
    },
    async filterDashboard(filters: Record<string, any>) {
      this.loading = true
      this.dashboards = await DashboardService.getAll({ ...filters })
      const selectedDashboard = location.hash.replace('#', '')
      this.selectedDashboard = Number(selectedDashboard)

      this.dashboardURL[this.selectedDashboard] = this.dashboards[this.selectedDashboard]?.url
      this.loading = false
    },
    onClickOutside() {
      this.showActionsMobile = false
    },
    selectDashboard(selectedDashboard: number) {
      this.selectedDashboard = selectedDashboard
      this.dashboardURL[selectedDashboard] = this.dashboards[selectedDashboard]?.url
      window.location.hash = selectedDashboard.toString()
    },
    handleActionsClick(type: string) {
      const { selectedDashboard } = this
      switch (type) {
        case DASHBOARD_ACTIONS_TYPE.MODIFY:
          this.$router.push({
            name: ROUTES.editDashboard,
            params: { id: this.dashboards[selectedDashboard].id },
          })
          break
        case DASHBOARD_ACTIONS_TYPE.SHARE:
          this.$router.push({
            name: ROUTES.shareDashboard,
            params: { id: this.dashboards[selectedDashboard].id },
          })
          break
      }
      this.showActionsMobile = false
    },
    canAccessFilter() {
      const { permissions } = this.currentUser as any
      const { retailerIds, storeIds, carrierIds } = AuthorizationService.getContext(
        permissions,
        'READ_DASHBOARD',
      )

      if (retailerIds.length === 1 && storeIds.length === 1 && carrierIds.length === 1) {
        this.loading = false
        return false
      }

      return true
    },
  },
})
</script>

<style lang="scss">
@import '../../../styles/mixins/macScrollbar';
#dashboard-detail {
  padding: 0;

  @include setMacScrollbar('&');

  .delete-button {
    align-self: center;
    height: fit-content;
  }

  .iframe-container {
    text-align: center;
    width: 100%;
    justify-content: center;
    align-items: center;
    @media #{map-get($display-breakpoints, 'xs-only')} {
      max-height: calc(95vh - 16.2rem - 2.4rem);
    }

    iframe {
      display: block; /* iframes are inline by default /
      background: #000;
      border: none;         / Reset default border */
      width: 82.5%;
      @media #{map-get($display-breakpoints, 'xs-only')} {
        width: 100%;
      }
    }
  }

  .action-share {
    display: flex;
    justify-content: flex-end;
    position: absolute;
    right: 0;

    .share {
      width: 7rem;
      height: 10.8rem;
      border-top-left-radius: 2rem;
      border-bottom-left-radius: 2rem;
      background-color: $main-color;
      color: $white;
      border: solid 0.2rem $white;
      margin-top: 20rem;
      box-shadow: 0 0.4rem 0.8rem rgba(0, 0, 0, 0.18);

      .v-btn__content {
        display: flex;
        flex-direction: column;

        h4 {
          margin-top: 1rem;
        }
      }
    }
  }

  #detail-dashboard__header {
    padding: 0 !important;
  }

  .v-tabs-slider-wrapper {
    height: 0.5rem !important;
    .v-tabs-slider {
      width: 4rem;
    }
  }

  .tab-dsk {
    @include regular-14;

    margin-right: 3rem !important;

    &.last {
      margin-right: 0;
    }
  }

  .tab-mobile {
    @include regular-16;
  }

  .tab-selected,
  .v-tab--active {
    color: $main-color !important;
  }

  .v-tab {
    padding: 0 !important;
    margin: 0 0.5rem;
    justify-content: flex-start;
  }

  .mobile-scroll {
    @media #{map-get($display-breakpoints, 'xs-only')} {
      max-height: calc(100vh - 16.2rem - 3rem);
      min-height: calc(100vh - 16.2rem - 3rem);
      overflow-y: scroll;

      padding-bottom: 2rem;
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

  .dashboard-selector-mobile {
    display: flex;
    align-items: center;
    overflow-x: auto;
    padding: 1.8rem 1.5rem;

    .add-dashboard__button {
      margin-right: 1rem;
    }

    .mp-button {
      .v-icon {
        margin-right: 0 !important;
      }
    }

    .dashboard-selector-wrapper {
      display: flex;

      .dashboard-selected {
        border: 0.1rem solid $main-lighten-74-color;
        cursor: pointer;
        margin-right: 1rem;
        padding: 1rem 2.2rem;
        border-radius: 5rem;
        min-width: fit-content;

        &.selected {
          border: 0.2rem solid $main-color;
        }

        &.last {
          margin-right: 0;
        }
      }
    }
  }

  .fab-mobile {
    background-color: $main-color;
    color: $white;
    border: solid 0.3rem $white;
    border-radius: 50%;
    bottom: 7rem;

    &.v-btn--fab.v-size--default {
      height: 6rem;
      width: 6rem;
    }
  }

  .mobile-action-buttons {
    margin-bottom: 1rem;

    &-wrapper {
      position: fixed;
      bottom: 1rem;
      right: 2rem;
    }
  }

  .mobile-action-buttons-wrapper {
    z-index: 3;
    width: 95%;

    .fab-button {
      background-color: $main-color;
      border: 0.2rem solid $white;

      i {
        color: $white;
      }
    }

    .fab-actions {
      min-height: 6rem;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      background-color: $white;
      margin-left: 1rem;
      color: $main-color;

      .fab-actions-content {
        align-self: flex-end;

        .fab-actions-text {
          padding-bottom: 1.5rem;
          padding-left: 1rem;
        }
      }

      &.first {
        border-top-left-radius: 0.4rem;
        border-top-right-radius: 0.4rem;
      }

      &.last {
        border-bottom-left-radius: 0.4rem;
        border-bottom-right-radius: 0.4rem;
      }

      .divider {
        height: 0.1rem;
        background-color: $main-lighten-65-color;
        width: 100%;
      }

      span {
        margin-left: 1rem;
      }

      i {
        color: $main-color !important;
      }
    }
  }
}
</style>
