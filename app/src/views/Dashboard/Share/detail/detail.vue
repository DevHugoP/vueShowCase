<template>
  <div>
    <content-header
      id="share-detail-dashboard__header"
      v-if="$vuetify.breakpoint.smAndUp"
      className="d-flex flex-column mb-12"
      hasBoxShadow
      data-id="dashboard-share-detail"
    >
      <template #breadcrumb>
        <mp-breadcrumb />
      </template>
      <template #title>
        <h1>{{ headerTitle }}</h1>
      </template>
    </content-header>
    <v-row
      no-gutters
      id="dashboard-share-detail"
      :class="$vuetify.breakpoint.xsOnly ? 'reversed' : ''"
    >
      <v-col sm="5" offset="1" cols="10">
        <v-row
          no-gutters
          v-if="isAuthorized(['LIST_PERMISSIONS', 'READ_PERMISSIONS', 'CREATE_PERMISSIONS'], {}, 'AND')"
          class="permissions__wrapper d-flex flex-column"
        >
          <mp-block
            v-if="!permissions.length && !sharedWith.length"
            id="dashboard-no-data"
            class="my-6"
            :hasBorder="$vuetify.breakpoint.smAndUp"
          >
            <no-data dataId="dashboard-permissions-noData" />
          </mp-block>
          <v-col
            cols="12"
            v-for="(permission, index) in permissions"
            :key="`permission_${index}`"
            class="my-6"
          >
            <permission-card
              :route="ROUTES.editDashboardPermissions"
              :permission="permission"
              :retailers="getAllRetailers()"
              :carriers="getAllCarriers()"
              :index="index + 1"
              @clickEdit="handleClickEdit(index)"
              dataId="dashboard-permissions"
            />
          </v-col>
          <v-row
            no-gutter
            v-if="isAuthorized(['LIST_PERMISSIONS', 'READ_PERMISSIONS', 'CREATE_PERMISSIONS', 'SHARE_DASHBOARD'], {}, 'AND')"
          >
            <v-col cols="10" offset="1" class="d-flex justify-center">
              <mp-button
                v-if="isAuthorized('SHARE_DASHBOARD')"
                format="secondary"
                class="add-dashboard__button"
                :text="$t('action.add.permission')"
                icon="plus"
                @click="
                  $router.push({
                    name: ROUTES.addDashboardPermissions,
                    params: { id: dashboardId },
                  })
                "
                data-id="dashboard-share-detail-addDashboardPermission"
              />
            </v-col>
          </v-row>
        </v-row>
      </v-col>
      <v-col
        offset="1"
        cols="10"
        sm="4"
        class="mt-6 ${$vuetify.breakpoint.xsOnly ? 'mb-3' : 'mb-6'} flex-end"
      >
        <div
          class="d-flex"
          v-if="isAuthorized(['SHARE_DASHBOARD', 'LIST_USERS'], undefined, 'AND')"
        >
          <mp-autocomplete
            :label="$t('page.dashboard.shareWith')"
            id="user-autocomplete"
            v-model="suggestedUser"
            :items="filteredUsers"
            @loadItems="handleChangeUserSearch($event)"
            @clickClear="resetUsers()"
            displayName="text"
            dataId="user-autocomplete"
            class="pr-4"
          />

          <mp-button
            format="secondary"
            class="add-dashboard__button"
            :text="$t('common.ok')"
            @click="addUser()"
            :disabled="!suggestedUser"
            data-id="dashboard-share-detail-addDashboardUser"
          />
        </div>

        <div>
          <div
            :class="`email-wrapper${index === 0 ? ' first' : ''}`"
            v-for="(user, index) in sharedWith"
            :key="`shared-user-permission_${index}`"
          >
            <div class="email">
              <h4 class="user-email">{{ user.email }}</h4>
              <mp-button
                v-if="isAuthorized('SHARE_DASHBOARD')"
                format="link"
                linkColor="black"
                class="delete-dashboard__button user-remove"
                icon="close-circle"
                @click="
                  () => {
                    showDeleteModal = true
                    selectedUser = user
                  }
                "
                data-id="dashboard-share-detail-deleteDashboardUser"
              />
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

    <mp-dialog-confirmation
      v-if="showDeleteModal"
      dataId="permission-form-modal-deleteDashboard"
      :textContent="
        $t('validation.confirmation.deleteUserDashboard', {
          dashboardName,
          username: selectedUser.email,
        })
      "
      @close="showDeleteModal = false"
      @submit="deleteUser(selectedUser.userId)"
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
import { mapGetters, mapMutations } from 'vuex'
import contentHeader from '@/components/contentHeader/contentHeader.vue'
import noData from '@/components/noData/noData.vue'

import UserMapper from '@/services/user/UserMapper'
import {
  PUSH_PERMISSION,
  RESET,
  SET_PERMISSION_BEING_EDITED_INDEX,
  SET_PERMISSION_CONTEXTS,
  SET_PERMISSION_GROUPS,
  SET_PERMISSION_GROUPS_ITEMS,
  SET_PERMISSIONS,
} from '@/store/modules/user/mutation-types'

import mpBlock from '@/components/block/block.vue'
import permissionForm from '@/components/form/permissionForm/permissionForm.vue'
import mpBreadcrumb from '@/components/breadcrumb/breadcrumb.vue'
import permissionCard from '@/components/permissionCard/permissionCard.vue'

import { ROUTES } from '@/constants'
import DashboardService from '@/services/dashboard/DashboardService'
import UserService from '@/services/user/UserService'

import { SET_HEADER_TITLE, SET_SHOW_LOADER } from '@/store/mutation-types'
import { authorizationMixin } from '@/mixins'
import { UserEntity } from '@/types'
import { PermissionFormData } from '@/store/modules/user/types'

export default mixins(authorizationMixin).extend({
  name: 'dashboard-share-share-details',
  components: {
    mpBlock,
    noData,
    permissionForm,
    permissionCard,
    contentHeader,
    mpBreadcrumb,
  },
  data: () => ({
    sharedWith: [] as Array<{ userId: string; id: string; email: string }>,
    suggestedUser: null as Record<string, string> | null,
    dashboardId: '',
    ROUTES,
    openForm: false,
    permissions: [] as Array<Record<string, any>>,
    suggestedUsers: [] as Array<{ text: string; value: string; id: string }>,
    dashboardName: '',
    selectedUser: null as UserEntity | null,
    showDeleteModal: false,
  }),
  computed: {
    ...mapGetters({
      headerTitle: 'getHeaderTitle',
      rulesGroups: 'rulesGroups/rulesGroups',
    }),
    filteredUsers(): Array<{ text: string; value: string; id: string }> {
      const { suggestedUsers, sharedWith } = this
      return suggestedUsers.filter(({ id }) => !sharedWith.some(({ userId }) => userId === id))
    },
  },
  beforeMount() {
    this.setPermissionGroups({ items: [], ids: [] })
    this.setPermissionContexts([])

    this.$store.dispatch('retailer/fetchAllRetailers')
    this.$store.dispatch('carrier/fetchAllCarriers')
    this.$store.dispatch('rulesGroups/fetchAllRulesGroups')
  },
  async mounted() {
    this.setShowLoader(true)
    const {
      $router: {
        currentRoute: {
          params: { id: dashboardId },
        },
      },
    } = this

    try {
      const { name: dashboardName } = await DashboardService.get(dashboardId)
      this.$store.commit(
        SET_HEADER_TITLE,
        this.$t('breadcrumbs.dashboardShare', { name: dashboardName }),
      )
      this.dashboardName = dashboardName
    } catch (error) {
      this.setShowLoader(false)
      this.$router.push({ name: ROUTES.noAccess })
    }
    if (this.isAuthorized('LIST_PERMISSIONS')) {
      this.permissions = await DashboardService.getPermissions(dashboardId)
    }

    this.sharedWith = await DashboardService.getAllShared(dashboardId)

    this.dashboardId = dashboardId
    if (this.isAuthorized('LIST_USERS')) {
      this.resetUsers()
    }
    this.setShowLoader(false)
  },
  methods: {
    ...mapMutations('user', {
      setPermissionBeingEditedIndex: SET_PERMISSION_BEING_EDITED_INDEX,
      setPermissionGroups: SET_PERMISSION_GROUPS,
      setPermissionGroupsItems: SET_PERMISSION_GROUPS_ITEMS,
      setPermissionContexts: SET_PERMISSION_CONTEXTS,
      setPermissions: SET_PERMISSIONS,
      pushPermission: PUSH_PERMISSION,
      reset: RESET,
    }),
    ...mapMutations({
      setShowLoader: SET_SHOW_LOADER,
    }),
    async resetUsers() {
      this.suggestedUser = null
      const { users } = await UserService.getAll()
      this.suggestedUsers = users.map(({ email, id }) => ({
        text: email,
        value: email,
        id,
      }))
    },
    async handleChangeUserSearch(searchedUser: string) {
      if (!searchedUser) {
        this.resetUsers()
        return
      }
      const { users } = await UserService.getAll()
      this.suggestedUsers = users
        .filter(({ email }) => email.toLowerCase().includes(searchedUser.toLowerCase()))
        .map(({ email, id }) => ({
          text: email,
          value: email,
          id,
        }))
    },
    async deleteUser(userId: string) {
      const {
        $router: {
          currentRoute: {
            params: { id: dashboardId },
          },
        },
      } = this as Record<string, any>
      this.sharedWith = await DashboardService.deleteShared(dashboardId, userId)
      this.showDeleteModal = false
    },
    async addUser() {
      const {
        $router: {
          currentRoute: {
            params: { id: dashboardId },
          },
        },
        suggestedUser: { id },
      } = this as Record<string, any>
      if (id) {
        this.sharedWith = await DashboardService.shareWith(dashboardId, id)
        this.resetUsers()
      }
    },
    fromPermissionFormToPermissionEntity(value: PermissionFormData) {
      return UserMapper.fromPermissionFormToPermissionEntity(value)
    },
    handleClickEdit(index: number) {
      const { rulesGroups, contexts } = this.permissions[index]

      this.setPermissionBeingEditedIndex(index)
      this.setPermissionGroups(rulesGroups)
      this.setPermissionGroupsItems(this.permissions[index])
      this.setPermissionContexts(contexts)
      this.openForm = true
    },
    getAllRetailers() {
      return this.$store.getters['retailer/retailers']
    },
    getAllCarriers() {
      return this.$store.getters['carrier/carriers']
    },
    async submitPermissionForm() {
      const {
        $router: {
          currentRoute: {
            params: { id },
          },
        },
      } = this

      for (const { contexts, groups } of this.permissions) {
        if (!contexts.length || !groups) {
          continue
        }

        const payload = UserMapper.fromPermissionFormToPermissionPayload({ contexts, groups })
        await DashboardService.addPermission(id, payload)
      }

      this.pushPermission()

      this.setPermissionGroups({ items: [], ids: [] })
      this.setPermissionContexts([])

      this.openForm = false
    },
    editPermissionForm() {
      this.setPermissionGroups({ items: [], ids: [] })
      this.setPermissionContexts([])
      this.openForm = false
    },
    cancelPermissionForm() {
      this.setPermissionGroups({ items: [], ids: [] })
      this.setPermissionContexts([])
      this.openForm = false
    },
  },
})
</script>

<style lang="scss">
.reversed {
  flex-direction: column-reverse;
}

#dashboard-share-detail {
  .user-cards {
    margin-top: 1.6rem;

    @media #{map-get($display-breakpoints, 'xs-only')} {
      margin-top: 0;

      &.first {
        margin-top: 1.6rem;
      }

      .v-card__text {
        padding: 0;
        height: fit-content;
      }
    }

    .user-email {
      justify-content: space-between;
      align-items: baseline;
      @include regular-16;
      font-weight: bold;
      color: $main-color;
    }
  }

  #share-detail-dashboard__header {
    padding: 0 !important;
  }

  .mobile-scroll {
    @media #{map-get($display-breakpoints, 'xs-only')} {
      max-height: calc(100vh - 8.3rem - 3.9rem);
      min-height: calc(100vh - 8.3rem - 3.9rem);
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

  .email-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 0.1rem solid $main-lighten-74-color;
    border-radius: 0.4rem;
    width: 100%;

    &.first {
      margin-top: 2rem;
    }

    .email {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 2.4rem 0 2.1rem 2rem;
      width: 100%;

      @media #{map-get($display-breakpoints, 'xs-only')} {
        padding: 0.5rem 0 0.5rem 2rem;
      }

      .user-email {
        word-break: break-all;
      }
    }

    margin-bottom: 2rem;

    @media #{map-get($display-breakpoints, 'xs-only')} {
      margin-bottom: 1rem;
    }

    &.last {
      margin-bottom: 0;
    }
  }
}
</style>
