<template>
  <div id="detail-user" v-if="loaded">
    <div id="overlay" v-if="showActionsMobile" />
    <content-header
      id="detail-user__header"
      v-if="$vuetify.breakpoint.smAndUp"
      hasBoxShadow
      data-id="user-detail"
    >
      <template #breadcrumb>
        <mp-breadcrumb />
      </template>
      <template #title>
        <h1>{{ headerTitle }}</h1>
      </template>
      <template #actions-button v-if="actions.length">
        <v-menu
          bottom
          offset-y
          origin="center top"
          transition="scale-transition"
        >
          <template v-slot:activator="{ on, attrs }">
            <mp-button
              v-bind="attrs"
              v-on="on"
              dataId="userDetail-actions"
              format="secondary"
              :text="$t('action.base')"
              icon="apps"
            />
          </template>
          <v-list>
            <v-list-item
              v-for="(action, index) in actions"
              :key="index"
              @click="handleActionsClick(action.type)"
            >
              <v-list-item-content>
                <v-list-item-title v-text="action.text" />
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </content-header>

    <v-row no-gutters :class="`detail-user__profile${$vuetify.breakpoint.xsOnly ? ' px-6' : ''}`">
      <v-col cols="11" md="8" offset-sm="1">
        <profile-card
          :canEditUsers="currentUser.id !== user.id ? isAuthorized('EDIT_USERS') : true"
          :user="user"
        />
      </v-col>
    </v-row>

    <v-row
      no-gutters
      :class="`detail-user__permissions${$vuetify.breakpoint.xsOnly ? ' px-6' : ''}`"
      v-if="permissions.length && isAuthorized('LIST_PERMISSIONS')"
    >
      <v-col
        cols="11"
        md="8"
        offset-sm="1"
        class="mb-6"
        v-for="(permission, index) of permissions"
        :key="`permission${permission.id}`"
      >
        <permission-card
          dataId="userDetail-permission"
          :userId="user.id"
          :permission="permission"
          :retailers="retailers"
          :carriers="carriers"
          :index="index + 1"
        />
      </v-col>
    </v-row>
    <v-row v-else>
      <div class="detail-user-no-permissions">
        <div class="detail-user-no-permissions-line">
          {{ $t('page.detailUser.permission.none') }}
        </div>
        <div class="detail-user-no-permissions-line">
          {{ $t('page.detailUser.permission.wait_admin') }}
        </div>
      </div>
    </v-row>

    <mp-dialog-confirmation
      v-if="showDeleteModal"
      dataId="user-modal-delete"
      @close="showDeleteModal = false"
      @submit="deleteUser"
      color="error"
      :header="{
        icon: 'mdi-trash-can-outline',
        isColorBackground: false,
        iconClose: 'mdi-close',
      }"
      :textContent="$t('action.user.delete')"
      :btnValidation="{ text: $t('action.delete.base'), format: 'error' }"
      :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
      :btnToColumn="$vuetify.breakpoint.xsOnly"
    />

    <div class="mobile-action-buttons-wrapper" v-if="$vuetify.breakpoint.xsOnly && actions.length">
      <v-btn
        bottom
        right
        fixed
        fab
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

    <url-modal
      v-if="showResetLink && resetUrl && isAuthorized('SHOW_USER_RESET_TOKEN')"
      :showDialog="showResetLink"
      :url="resetUrl"
      @close="confirmUserResetUrl()"
      dataId="user-detail-reset-password-link"
    />
  </div>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'
import urlModal from '@/components/urlModal/urlModal.vue'
import Config from '@/config/Config'

import contentHeader from '@/components/contentHeader/contentHeader.vue'
import mpBreadcrumb from '@/components/breadcrumb/breadcrumb.vue'
import profileCard from './profileCard/profileCard.vue'
import permissionCard from '@/components/permissionCard/permissionCard.vue'

import { ROUTES, USER_DETAIL_ACTIONS_TYPE } from '@/constants'

import UserService from '@/services/user/UserService'
import UserMapper from '@/services/user/UserMapper'

import { SET_HEADER_TITLE, SET_BREADCRUMBS_LABEL } from '@/store/mutation-types'
import RetailerService from '@/services/retailer/RetailerService'
import { SnackBarType } from '@/store/types'
import CarrierService from '@/services/carrier/CarrierService'
import { CurrentUserEntity, Filters, PermissionEntity, RulesKey, UserEntity } from '@/types'

import { authorizationMixin } from '@/mixins'

const permissionsRule: RulesKey = 'LIST_PERMISSIONS'

export default mixins(authorizationMixin).extend({
  name: 'detail-user',
  components: {
    contentHeader,
    mpBreadcrumb,
    profileCard,
    permissionCard,
    urlModal,
  },
  data: () => ({
    ROUTES,
    user: null as UserEntity | null,
    permissions: [] as PermissionEntity[],
    retailers: [] as Filters[],
    carriers: [] as Filters[],
    loaded: false,
    showDeleteModal: false,
    showActionsMobile: false,
    actions: [] as Array<{ text: string; type: string }>,
    showResetLink: false,
    resetUrl: '',
  }),
  beforeMount() {
    this.loaded = false
  },
  computed: {
    headerTitle(): string {
      return this.$store.getters[`getHeaderTitle`]
    },
    currentUser(): CurrentUserEntity {
      return this.$store.getters['auth/currentUser']
    },
    profile() {
      return this.$route.name === ROUTES.profile
    },
    detail() {
      return this.$route.name === ROUTES.detailUser
    },
  },
  async mounted(this: any) {
    const {
      params: { id },
    } = this.$route

    if (this.detail && id) {
      try {
        const user = await UserService.get(id)

        this.user = UserMapper.formatUser(user)
      } catch (e) {
        if (e.response?.status === 403) {
          return this.$router.push({ name: ROUTES.noAccess })
        }
        if (e.response?.status === 404) {
          return this.$router.push({ name: ROUTES.notFound })
        }
      }

      const fullname = `${UserService.getFullname(this.user)}`
      this.loaded = true
      this.$store.commit(SET_HEADER_TITLE, fullname)
      this.$store.commit(SET_BREADCRUMBS_LABEL, JSON.stringify({ user: fullname }))

      try {
        this.permissions = await UserService.getPermissions(id)
      } catch (e) {
        return
      }
    } else {
      this.user = UserMapper.formatUser(this.currentUser)
      this.permissions = await UserService.getCurrentUserPermissions()
      this.loaded = true
    }

    if (
      !this.user.lastConnection &&
      this.isAuthorized('INVITE_USERS') &&
      this.currentUser.id !== this.user?.id &&
      !this.user.external
    ) {
      this.actions.push({
        text: this.$t('action.user.sendInvite'),
        type: USER_DETAIL_ACTIONS_TYPE.SEND_INVITE,
      })
    }

    if (
      (this.isAuthorized('EDIT_USERS') || this.currentUser.id === this.user?.id) &&
      (!this.user.external || this.hasGoogleProvider())
    ) {
      this.actions.push({
        text: this.$t('action.modify.base'),
        type: USER_DETAIL_ACTIONS_TYPE.EDIT_USERS,
      })
    }

    if (this.currentUser.id !== this.user?.id && this.isAuthorized('DELETE_USERS')) {
      this.actions.push({
        text: this.$t('action.delete.user'),
        type: USER_DETAIL_ACTIONS_TYPE.DELETE_USER,
      })
    }

    if (
      this.isAuthorized(['EDIT_USERS', 'CREATE_PERMISSIONS'], {}, 'AND') &&
      this.currentUser.id !== this.user?.id
    ) {
      this.actions.push({
        text: this.$t('action.add.permission'),
        type: USER_DETAIL_ACTIONS_TYPE.ADD_PERMISSION,
      })
    }

    if (this.permissions.length) {
      try {
        const [carriers, retailers] = await Promise.all([
          CarrierService.getFilters({ forRule: permissionsRule }),
          RetailerService.getFilters({ forRule: permissionsRule }),
        ])
        this.carriers = carriers
        this.retailers = retailers
      } catch (e) {
        return
      }
    }
  },
  methods: {
    confirmUserResetUrl() {
      this.showResetLink = false
    },
    async deleteUser() {
      const {
        params: { id },
      } = this.$route

      try {
        await UserService.delete(id)

        this.$store.dispatch('setSnackbar', {
          message: this.$t('messages.userDeleted'),
          type: SnackBarType.SUCCESS,
        })
        this.$router.push({ name: ROUTES.users })
        return
      } catch (e) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      } finally {
        this.showDeleteModal = false
      }
    },
    onClickOutside() {
      this.showActionsMobile = false
    },
    hasGoogleProvider(): boolean {
      return !!this.user?.providers?.find(({ provider }) => provider === 'google')
    },
    handleActionsClick(type: string) {
      switch (type) {
        case USER_DETAIL_ACTIONS_TYPE.EDIT_USERS:
          if (this.profile) {
            return this.$router.push({ name: ROUTES.editProfile })
          }
          this.$router.push({ name: ROUTES.editUser, params: { id: this.user!.id } })
          break
        case USER_DETAIL_ACTIONS_TYPE.DELETE_USER:
          this.showDeleteModal = true
          break
        case USER_DETAIL_ACTIONS_TYPE.ADD_PERMISSION:
          this.$router.push({ name: ROUTES.addPermission })
          break
        case USER_DETAIL_ACTIONS_TYPE.SEND_INVITE:
          this.inviteUser()
          break
      }
      this.showActionsMobile = false
    },
    async inviteUser() {
      const {
        params: { id },
      } = this.$route

      try {
        const token = await UserService.inviteUser(id)

        if (this.isAuthorized('SHOW_USER_RESET_TOKEN')) {
          this.resetUrl = `${Config.get('VUE_APP_FRONT_BASE_URL')}/login?token=${token}${this.user
            ?.language && `&language=${this.user.language}`}`
          this.$nextTick(() => {
            this.showResetLink = true
          })
        }

        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.SUCCESS,
          message: this.$t('messages.userInviteSend'),
        })
      } catch (e) {
        this.showDeleteModal = false
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      }
    },
  },
})
</script>

<style lang="scss">
#detail-user {
  padding: 0;
  background-color: transparent !important;
  #detail-user__header {
    .actions-wrapper {
      @media #{map-get($display-breakpoints, 'sm-only')} {
        flex-direction: column-reverse;

        button {
          margin-right: 0 !important;
          margin-top: 1rem;
        }
      }

      @media #{map-get($display-breakpoints, 'md-only')} {
        flex-direction: column-reverse;

        button {
          margin-right: 0 !important;
          margin-top: 1rem;
        }
      }
    }
  }

  .detail-user__profile {
    margin: 4rem 0;
  }

  .detail-user-no-permissions {
    font-size: 1.7em;
    text-align: center;
    width: 80%;
    margin: 10%;
  }

  .detail-user-no-permissions-line {
    padding: 20px 0;
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
    width: 100%;
    padding-left: 2rem;

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

#overlay {
  position: fixed; /* Sit on top of the page content */
  width: 100%; /* Full width (cover the whole page) */
  height: 100%; /* Full height (cover the whole page) */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Black background with opacity */
  z-index: 2; /* Specify a stack order in case you're using a different order for other elements */
  cursor: pointer; /* Add a pointer on hover */
}
</style>
