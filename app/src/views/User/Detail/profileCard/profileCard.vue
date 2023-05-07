<template>
  <v-card flat id="profile-card" v-if="user">
    <v-row
      v-if="$vuetify.breakpoint.xsOnly"
      no-gutters
      justify="center"
      class="profile-card__contact-wrapper mb-8"
    >
      <v-col cols="12" class="text-center mb-5">
        <v-avatar :class="!user.avatar ? 'initials' : ''">
          <v-img v-if="user.avatar" :src="user.avatar" />
          <h2 v-else>{{ initials }}</h2>
        </v-avatar>
      </v-col>

      <v-col cols="12" class="text-center mb-8">
        <h3>{{ fullname }}</h3>
      </v-col>

      <v-col cols="2">
        <v-btn
          fab
          depressed
          class="profile-card__contact-button"
          :href="`mailto:${user.email}`"
        >
          <v-icon>mdi-email</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-row
      v-if="$vuetify.breakpoint.xsOnly"
      no-gutters
      justify="center"
      class="profile-card__informations-wrapper"
    >
      <v-list-item class="profile-card__information">
        <v-list-item-content>
          <v-row justify="space-around" align="center">
            <v-col cols="4">
              <span class="regular12 label">{{ $t('common.status') }}</span>
            </v-col>
            <v-spacer />
            <v-col cols="5" class="d-flex align-center justify-end">
              <mp-switch
                :disabled="currentUser.id === user.id || !canEditUsers"
                :value="user.active"
                @change="toggleUser($event)"
                :labels="[$t('common.active'), $t('common.inactive')]"
              />
            </v-col>
          </v-row>
        </v-list-item-content>
      </v-list-item>

      <v-list-item class="profile-card__information">
        <v-list-item-content>
          <v-row justify="space-around" align="center">
            <v-col cols="4">
              <span class="regular12 label">{{ $t('page.user.local') }}</span>
            </v-col>
            <v-spacer />
            <v-col cols="5" class="d-flex align-center justify-end">
              <mp-switch
                disabled
                :value="user.local"
                :labels="[$t('common.active'), $t('common.inactive')]"
              />
            </v-col>
          </v-row>
        </v-list-item-content>
      </v-list-item>

      <v-list-item class="profile-card__information">
        <v-list-item-content>
          <v-row justify="space-around" align="center">
            <v-col cols="4">
              <span class="regular12 label">{{ $t('page.user.language') }}</span>
            </v-col>
            <v-spacer />
            <v-col cols="5" align="right">
              <span class="regular16">{{ user.language || '-' }}</span>
            </v-col>
          </v-row>
        </v-list-item-content>
      </v-list-item>

      <v-list-item class="profile-card__information">
        <v-list-item-content>
          <v-row justify="space-around" align="center">
            <v-col cols="3">
              <span class="regular12 label">{{ $t('common.email') }}</span>
            </v-col>
            <v-spacer />
            <v-col cols="8" class="d-flex align-center justify-end">
              <span class="regular16 information-email">{{ user.email }}</span>
            </v-col>
          </v-row>
        </v-list-item-content>
      </v-list-item>
    </v-row>

    <v-list-item v-if="$vuetify.breakpoint.smAndUp">
      <v-list-item-avatar :class="!user.avatar ? 'initials' : ''">
        <v-img v-if="user.avatar" :src="user.avatar" />
        <h2 v-else>{{ initials }}</h2>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="profile-card__name h3">{{ fullname }}</v-list-item-title>
        <v-row
          no-gutters
          justify="space-between"
          align="center"
          class="profile-card__informations-wrapper"
        >
          <v-col cols="4" class="email__wrapper">
            <span class="email regular14">{{ user.email }}</span>
          </v-col>
          <v-col cols="3">
            <mp-switch
              :disabled="currentUser.id === user.id || !canEditUsers"
              :value="user.active"
              @change="toggleUser($event)"
              :labels="[$t('common.active'), $t('common.inactive')]"
            />
          </v-col>
        </v-row>
        <v-spacer />
        <v-row
          no-gutters
          justify="space-between"
          align="center"
          class="profile-card__informations-wrapper"
        >
          <v-col cols="4" class="email__wrapper">
            <span class="email regular14">{{ `${$t('page.user.language')}: ${user.language || '-'}` }}</span>
          </v-col>
          <v-col cols="3">
            <mp-switch
              disabled
              :value="user.local"
              :labels="[$t('page.user.local'), $t('page.user.local')]"
            />
          </v-col>
        </v-row>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'

import { CurrentUserEntity, UserEntity } from '@/types'

import UserService from '@/services/user/UserService'

export default Vue.extend({
  name: 'profile-card',
  props: {
    user: {
      type: Object as () => UserEntity,
      required: true,
    },
    canEditUsers: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    currentUser(): CurrentUserEntity {
      return this.$store.getters['auth/currentUser']
    },
    fullname() {
      return UserService.getFullname(this.user)
    },
    initials() {
      return UserService.getInitials(this.user)
    },
  },
  methods: {
    toggleUser(event: boolean) {
      UserService.patch(this.user.id, { active: event })
    },
  },
})
</script>

<style lang="scss">
#profile-card {
  @media #{map-get($display-breakpoints, 'xs-only')} {
    .profile-card__contact-wrapper {
      background-color: $main-lighten-80-color;
      padding: 1.5rem 0 2rem 0;
    }

    .profile-card__informations-wrapper {
      .profile-card__information {
        padding: 0;
        border-bottom: 0.1rem solid $main-lighten-74-color;

        .information-email {
          word-break: break-all;
          text-align: right;
        }

        .v-list-item__content {
          padding: 0;

          .label {
            color: $main-lighten-52-color;
          }
        }
      }
    }

    .v-avatar {
      width: 9.6rem !important;
      height: 9.6rem !important;
    }

    .profile-card__contact-button {
      width: 5rem !important;
      height: 5rem !important;
      background-color: $primary-color;
    }
  }

  @media #{map-get($display-breakpoints, 'sm-and-up')} {
    .v-list-item {
      padding: 0;
    }

    .v-list-item__avatar {
      width: 10rem !important;
      height: 10rem !important;
      margin: 0 3.4rem 0 0;

      .v-image {
        border: 0.1rem solid $main-lighten-65-color;
      }
    }

    .profile-card__name {
      margin-bottom: 2.8rem;
    }
  }

  .profile-card__informations-wrapper {
    .email__wrapper {
      min-width: fit-content;
    }

    .mp-switch {
      .v-input__slot {
        margin-bottom: 0;
      }

      .v-label {
        color: $main-color;
        display: flex;
        justify-content: center;
      }

      .v-messages {
        display: none;
      }
    }
  }
}
</style>
