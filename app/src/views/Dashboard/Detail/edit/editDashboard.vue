<template>
  <div id="dashboard-detail" class="d-flex flex-column">
    <content-header
      id="detail-dashboard__header"
      className="d-flex flex-column"
      hasBoxShadow
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
        <v-row no-gutters class="create-dashboard-actions mt-10 pb-10">
          <v-col cols="10" offset-sm="1" class="d-flex justify-end">
            <mp-button
              :text="$t('action.cancel.base')"
              format="link"
              linkColor="black"
              @click="cancel()"
              dataId="dashboard-create-form-cancel"
            />
            <mp-button
              :text="$t('action.save')"
              format="success"
              icon="content-save-outline"
              :disabled="$v.dashboard.$invalid"
              @click="save()"
              dataId="dashboard-create-form-save"
            />
          </v-col>
        </v-row>
      </template>
    </content-header>
    <v-form ref="form" class="create-dashboards-form" data-id="create-dashboards-form">
      <v-row no-gutter>
        <v-col sm="5" cols="10" offset="1">
          <v-row class="mp-row mt-6" no-gutters>
            <v-col cols="12" class="mt-4">
              <mp-textfield
                :label="`${$t('page.dashboard.create.name')} *`"
                name="dashboard-name"
                v-model="dashboard.name"
                dataId="form-dashboard-name"
                @input="$v.dashboard.name.$touch()"
                @blur="$v.dashboard.name.$touch()"
                :errors="getModelErrors($v.dashboard.name)"
                :isDirty="$v.dashboard.name.$dirty"
              />
            </v-col>
            <v-col cols="12" class="mt-4">
              <mp-textfield
                :label="`${$t('page.dashboard.create.metabaseId')} *`"
                name="dashboard-metabase-id"
                type="number"
                v-model="dashboard.metabaseId"
                dataId="form-dashboard-metabase-id"
                @input="$v.dashboard.metabaseId.$touch()"
                @blur="$v.dashboard.metabaseId.$touch()"
                :errors="getModelErrors($v.dashboard.metabaseId)"
                :isDirty="$v.dashboard.metabaseId.$dirty"
              />
            </v-col>
          </v-row>
        </v-col>
        <v-col sm="5" cols="10" offset="1" class="d-flex align-center justify-center">
          <mp-switch
            dataId="create-dashboard-active"
            v-model="dashboard.active"
            @input="$v.dashboard.active.$touch()"
            @blur="$v.dashboard.active.$touch()"
            :errors="getModelErrors($v.dashboard.active)"
            :isDirty="$v.dashboard.active.$dirty"
            :labels="[$t('common.active'), $t('common.inactive')]"
          />
        </v-col>
        <v-col cols="10" offset="1" class="d-flex justify-center mt-4" v-if="isAuthorized('DELETE_DASHBOARD') && dashboardId">
          <mp-button
            :dataId="`showInformation`"
            :text="$t('page.dashboard.delete')"
            format="secondary"
            @click="showDeleteModal = true"
          />
        </v-col>
      </v-row>
    </v-form>

    <v-row
      v-if="$vuetify.breakpoint.xsOnly"
      no-gutters
      class="create-dashboard-actions mt-10 pb-10"
    >
      <v-col cols="12" class="d-flex justify-center align-center">
        <mp-button
          :text="$t('action.cancel.base')"
          format="link"
          linkColor="black"
          @click="cancel()"
          dataId="dashboard-create-form-cancel"
        />
        <mp-button
          :text="$t('action.save')"
          format="success"
          icon="content-save-outline"
          :disabled="$v.dashboard.$invalid"
          @click="save()"
          dataId="dashboard-create-form-save"
        />
      </v-col>
    </v-row>

    <mp-dialog-confirmation
      v-if="showDeleteModal && dashboardId"
      dataId="permission-form-modal-deleteDashboard"
      :textContent="
        $t('validation.confirmation.deleteDashboard', { dashboardName: dashboard.name })
      "
      @close="showDeleteModal = false"
      @submit="deleteDashboard(dashboardId)"
      color="error"
      :header="{ icon: 'mdi-trash-can-outline', isColorBackground: false, iconClose: 'mdi-close' }"
      :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
      :btnValidation="{ text: $t('action.delete.base'), format: 'error' }"
      :btnToColumn="$vuetify.breakpoint.xsOnly"
    />
  </div>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'

import DashboardService from '@/services/dashboard/DashboardService'

import { required, minValue } from 'vuelidate/lib/validators'
import { authorizationMixin, validationMixin } from '@/mixins'
import contentHeader from '@/components/contentHeader/contentHeader.vue'
import mpBreadcrumb from '@/components/breadcrumb/breadcrumb.vue'
import { mapGetters } from 'vuex'
import { SET_HEADER_TITLE } from '@/store/mutation-types'
import { ROUTES } from '@/constants'
import { SnackBarType } from '@/store/types'

export default mixins(validationMixin, authorizationMixin).extend({
  name: 'create-dashboard',
  components: {
    contentHeader,
    mpBreadcrumb,
  },
  validations: {
    dashboard: {
      name: { required },
      metabaseId: { required, minValue: minValue(0) },
      active: { required },
    },
  },
  data: () => ({
    dashboard: {
      metabaseId: 0,
      name: '',
      active: false,
    },
    dashboardId: '',
    showDeleteModal: false,
  }),
  computed: {
    ...mapGetters({
      headerTitle: 'getHeaderTitle',
    }),
  },
  beforeMount() {
    if (!this.isAuthorized(['CREATE_DASHBOARD', 'EDIT_DASHBOARD'], undefined, 'OR')) {
      this.$router.push({ name: ROUTES.noAccess })
    }
  },
  async mounted() {
    const {
      $router: {
        currentRoute: {
          params: { id: dashboardId },
        },
      },
    } = this as Record<string, any>

    if (dashboardId) {
      try {
        const dashboard = await DashboardService.get(dashboardId)
        this.dashboard = dashboard
        this.dashboardId = dashboardId
      } catch (error) {
        this.$router.push({ name: ROUTES.noAccess })
      }
    }
    this.$store.commit(
      SET_HEADER_TITLE,
      dashboardId ? this.$t('page.dashboard.edit.title') : this.$t('page.dashboard.create.title'),
    )
  },
  methods: {
    async deleteDashboard(dashboardId: string) {
      try {
        await DashboardService.delete(dashboardId)

        this.$router.push({ name: ROUTES.dashboard })
      } catch (e) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      } finally {
        this.showDeleteModal = false
      }
    },
    async save() {
      const { dashboard, dashboardId } = this
      if (dashboardId) {
        await DashboardService.update(dashboardId, dashboard)
      } else {
        await DashboardService.create(dashboard)
      }
      this.$router.push({ name: ROUTES.dashboard })
    },
    cancel() {
      this.$router.push({ name: ROUTES.dashboard })
    },
  },
  watch: {
    '$v.dashboard.$invalid'(next) {
      this.$emit('invalid', next)
    },
  },
})
</script>

<style lang="scss">
@import '../../../../styles/mixins/macScrollbar';

.create-dashboard-modal {
  max-width: 58.6rem !important;
  display: flex;
  flex-direction: column;

  .create-dashboards-form {
    & > .row {
      display: flex;
      justify-content: space-around;
    }
  }

  .search-outer-wrapper {
    @media #{map-get($display-breakpoints, 'xs-only')} {
      padding-top: 2rem;
    }

    min-height: 8.4rem;
    background-color: $main-lighten-80-color;
    display: flex;
    align-items: center;
  }

  .main-dialog-content {
    @include setMacScrollbar('&');
    min-height: 28.7rem !important;
    overflow-y: scroll;
    overflow-x: hide !important;
    max-height: calc(100vh - 50rem);
    @media #{map-get($display-breakpoints, 'xs-only')} {
      max-height: calc(133vh - 50rem);
    }
    padding: 2rem !important;
  }

  h4 {
    text-align: center;
    margin-bottom: 1rem;
    line-height: 2.5rem;
  }

  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 5rem;
    height: 5rem;
    border: 0.1rem solid $main-color;
    border-radius: 50%;
    margin: 2rem auto;
    i {
      color: $main-color;
    }
  }

  .modal-header-wrapper {
    position: relative;
    background: $primary-color;
  }

  .cross-icon {
    position: absolute;
    top: 2.4rem;
    right: 2.1rem;
    z-index: 2;
    color: $main-color;
  }

  .notification-type-selector {
    border: 1px solid #cdced9;
    box-sizing: border-box;
    border-radius: 4px;
    color: #272833;
    text-align: center;

    label {
      justify-content: center;
    }
    width: 15rem;
    height: 7.5rem;

    .v-input--selection-controls__input {
      display: none;
    }
  }

  .radio-button-wrapper {
    p {
      margin: 0;
    }
  }

  .v-item--active {
    border: 2px solid #272833;
    box-sizing: border-box;
    border-radius: 4px;
  }

  .v-input--radio-group.v-input--radio-group--row .v-radio {
    margin-right: 0;
  }

  .v-input--radio-group--row .v-input--radio-group__input {
    justify-content: space-around;
  }

  .main-dialog-content {
    justify-content: center;

    @media #{map-get($display-breakpoints, 'xs-only')} {
      padding-left: 2rem;
      padding-right: 2rem;
    }

    .action-outer-wrapper {
      margin-top: 10rem;

      @media #{map-get($display-breakpoints, 'xs-only')} {
        justify-content: center;
      }

      .action-wrapper {
        display: flex;
        justify-content: flex-end;

        @media #{map-get($display-breakpoints, 'xs-only')} {
          align-items: center;

          .v-btn {
            width: fit-content;
          }
        }

        i {
          &.mdi-content-save {
            margin-right: 1rem;
          }
        }

        @media #{map-get($display-breakpoints, 'xs-only')} {
          flex-direction: column-reverse;
        }
      }
    }
  }
}
</style>
