<template>
  <div id="menu-profile" data-id="header-menuProfile" class="d-flex">
    <template v-if="$vuetify.breakpoint.mdAndDown">
      <menu-profile-items />
    </template>
    <div v-else class="d-flex">
      <v-menu
        v-model="alertOpenned"
        :closeOnContentClick="false"
        bottom
        v-if="
          isAuthorized(
            [
              'LIST_USERS',
              'LIST_RULES_GROUP',
              'READ_ADMINISTRATION',
              'LIST_NOTIFICATION_ACTIVATION',
              'EDIT_NOTIFICATION_ACTIVATION',
            ],
            {},
            'OR',
          )
        "
        content-class="nav-dropdown nav-dropdown__profile"
        left
        offset-y
        transition="slide-y-transition"
      >
        <template v-slot:activator="{ on }">
          <div v-on="on" class="alerts-bell-icon-wrapper">
            <v-icon :ripple="false" class="px-0">
              mdi-bell
            </v-icon>
            <mp-badge
              v-if="unreadAlertsCount"
              :content="
                unreadAlertsCount > paginationLimit ? `${paginationLimit}+` : unreadAlertsCount
              "
              color="red"
              dataId="menu-profile-alertModal-badge"
            />
          </div>
        </template>
        <alert v-if="alertOpenned" @closeModal="alertOpenned = false" />
      </v-menu>

      <v-menu
        v-if="isAuthorized(['LIST_USERS', 'LIST_RULES_GROUP', 'READ_ADMINISTRATION'], {}, 'OR')"
        v-model="gearOpenned"
        bottom
        content-class="nav-dropdown nav-dropdown__profile"
        left
        offset-y
        transition="slide-y-transition"
      >
        <template v-slot:activator="{ on }">
          <v-icon
            @click="gearOpenned = !gearOpenned"
            class="px-0 ml-3"
            v-on="on"
            :ripple="false"
            data-id="menu-profile-cog"
          >
            mdi-cog
          </v-icon>
        </template>

        <v-list class="dropdown-list" dense>
          <v-list-item
            v-if="isAuthorized('LIST_USERS')"
            :to="{ name: ROUTES.users }"
            data-id="header-gear-users"
            link
          >
            <v-list-item-icon>
              <v-icon :size="$vuetify.breakpoint.smAndUp ? '1.6rem' : '2.4rem'">
                mdi-account-box
              </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>
                <span class="regular14">{{ $t('page.users.title') }}</span>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            v-if="isAuthorized('LIST_RULES_GROUP')"
            :to="{ name: ROUTES.rulesGroups }"
            data-id="header-gear-users"
            link
          >
            <v-list-item-icon>
              <v-icon :size="$vuetify.breakpoint.smAndUp ? '1.6rem' : '2.4rem'">
                mdi-account-multiple
              </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>
                <span class="regular14">{{ $t('page.rulesGroups.title') }}</span>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            v-if="isAuthorized(['LIST_NOTIFICATION_ACTIVATION', 'LIST_RETAILERS'], {}, 'AND')"
            link
            :to="{ name: ROUTES.notificationAdministration }"
            data-id="header-bell-notification-administration"
          >
            <v-list-item-icon>
              <v-icon :size="$vuetify.breakpoint.smAndUp ? '1.6rem' : '2.4rem'">
                mdi-bell
              </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>
                <span class="regular14">{{ $t('page.notificationAdministration.title') }}</span>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            v-if="isAuthorized('LIST_NOTIFICATION_STATE') && $vuetify.breakpoint.lgAndUp"
            link
            :to="{ name: ROUTES.notificationsReporting }"
            data-id="header-gear-notification-list"
          >
            <v-list-item-icon>
              <v-icon size="1.6rem">
                mdi-comment-alert
              </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>
                <span class="regular14">{{ $t('page.detailOrder.notification.title') }}</span>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            v-if="$vuetify.breakpoint.lgAndUp && isAuthorized('READ_ADMINISTRATION')"
            :to="{ name: ROUTES.administrationConfig }"
            data-id="header-menuProfile-account"
            link
          >
            <v-list-item-icon>
              <v-icon :size="$vuetify.breakpoint.smAndUp ? '1.6rem' : '2.4rem'">mdi-wrench</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>
                <span class="regular14">{{ $t('page.profile.admin') }}</span>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-menu
        v-model="openned"
        bottom
        content-class="nav-dropdown nav-dropdown__profile"
        left
        offset-y
        transition="slide-y-transition"
      >
        <template v-slot:activator="{ on }">
          <div v-on="on" :style="{ cursor: 'pointer' }" class="px-0" @click="openned = !openned">
            <v-avatar
              :class="
                `avatar-round${$vuetify.breakpoint.lgAndUp ? ' ml-3' : ''}${
                  !user.avatar ? ' initials' : ''
                }`
              "
            >
              <v-img v-if="user.avatar" :src="user.avatar" class="avatar" />
              <span v-else class="medium14">{{ initials }}</span>
            </v-avatar>
          </div>
        </template>

        <menu-profile-items />
      </v-menu>
    </div>
  </div>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'

import { authorizationMixin } from '@/mixins'

import menuProfileItems from './_items.vue'
import alert from '@/views/Alert/detail.vue'

import UserService from '@/services/user/UserService'
import { mapGetters } from 'vuex'
import { ROUTES } from '@/constants'

export default mixins(authorizationMixin).extend({
  name: 'menu-profile',
  components: {
    menuProfileItems,
    alert,
  },
  data: () => ({
    openned: false,
    alertOpenned: false,
    gearOpenned: false,
    ROUTES,
  }),
  computed: {
    ...mapGetters({
      user: 'auth/currentUser',
      paginationLimit: 'alert/paginationLimit',
      unreadAlertsCount: 'alert/unreadAlertsCount',
    }),
    initials() {
      return UserService.getInitials(this.user)
    },
    fullname() {
      return UserService.getFullname(this.user)
    },
  },
})
</script>

<style lang="scss">
.v-menu__content.nav-dropdown__profile {
  margin-top: 0.5rem;
}

#menu-profile {
  .row {
    padding-top: 2.6rem;
  }

  .v-list {
    padding: 1.6rem 0;
  }

  .v-avatar {
    width: 4rem !important;
    min-width: 4rem !important;
    height: 4rem !important;
    border: 0.2rem solid $main-color;
  }

  .alerts-bell-icon-wrapper {
    display: flex;
    align-items: flex-start;
    align-self: center;
    cursor: pointer;
    margin-right: 0.5rem;

    .v-badge {
      margin-left: -1.3rem !important;

      .v-badge__wrapper {
        margin: 0;
      }
    }
  }

  .mdi-cog,
  .mdi-bell {
    color: $main-color !important;

    &::after {
      opacity: 0;
    }
  }

  .v-badge {
    margin-left: -10px !important;
  }
}
</style>
