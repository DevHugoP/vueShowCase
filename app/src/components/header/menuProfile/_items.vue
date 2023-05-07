<template>
  <v-list class="dropdown-list" dense>
    <v-list-item
      v-if="$vuetify.breakpoint.lgAndUp"
      data-id="header-menuProfile-language"
    >
      <v-list-item-icon>
        <mp-language-switch
          dataId="header-language-switch"
          :selectedLanguage="user.language"
          disabled
          contentClass="header-language-switch"
        />
      </v-list-item-icon>

      <v-list-item-content>
        <v-list-item-title>
          <span class="regular14">{{ $t('common.language') }}</span>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list-item
      link
      :to="{ name: ROUTES.profile, params: { id: user.id } }"
      data-id="header-menuProfile-account"
    >
      <v-list-item-icon>
        <v-icon :size="$vuetify.breakpoint.smAndUp ? '1.6rem' : '2.4rem'">mdi-account</v-icon>
      </v-list-item-icon>

      <v-list-item-content>
        <v-list-item-title>
          <span class="regular14">{{ $t('page.profile.title') }}</span>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item link data-id="header-menuProfil-logout">
      <v-list-item-icon>
        <v-icon :size="$vuetify.breakpoint.smAndUp ? 16 : 24">mdi-logout</v-icon>
      </v-list-item-icon>

      <v-list-item-content>
        <v-list-item-title @click="logout()">
          <span class="regular14">{{ $t('action.logout') }}</span>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import Vue from 'vue'

import { ROUTES } from '@/constants'
import { redirectToLogin } from '@/router'

export default Vue.extend({
  name: 'menu-profile-items',
  data: () => ({
    ROUTES,
  }),
  computed: {
    user() {
      return this.$store.getters['auth/currentUser']
    },
  },
  methods: {
    async logout() {
      await this.$store.dispatch('auth/logout')
      redirectToLogin()
    },
  },
})
</script>

<style lang="scss" scoped>
.dropdown-list {
  @media #{map-get($display-breakpoints, 'md-and-down')} {
    width: 100%;
  }

  .header-language-switch {
    height: 1.6rem;
  }
}
</style>
