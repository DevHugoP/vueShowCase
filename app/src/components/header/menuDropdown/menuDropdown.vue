<template>
  <v-menu
    content-class="nav-dropdown"
    v-model="openned"
    left
    offset-y
    transition="slide-y-transition"
    v-if="links.length > 0"
  >
    <template v-slot:activator="{ on }">
      <v-tab @click="openned = !openned" class="px-0 mx-4" v-on="on">
        <v-icon v-if="leftIcon" left v-text="`mdi-${leftIcon}`" />
        <span class="regular14">{{ label }}</span>
        <v-icon :class="openned ? `rotate180` : null" right>mdi-chevron-down</v-icon>
      </v-tab>
    </template>

    <v-list class="dropdown-list" dense>
      <v-list-item
        link
        v-for="link in links"
        :key="link.route"
        :to="{ name: link.route }"
        :data-id="`header-dropdownMenu-${link.route}`"
      >
        <v-list-item-icon>
          <v-icon size="16" v-text="`mdi-${link.icon}`" />
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="regular14" v-text="$t(`page.${link.route}.title`)" />
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'menu-dropdown',
  props: {
    label: {
      type: String,
      required: true,
    },
    links: {
      type: Array,
      required: true,
    },
    leftIcon: {
      type: String,
      default: '',
    },
  },
  data() {
    return { openned: false }
  },
})
</script>

<style lang="scss">
.v-menu__content {
  &.nav-dropdown {
    min-width: 18.3rem !important;
    margin-top: -0.2rem;
  }

  .v-list.dropdown-list {
    .v-list-item {
      padding-left: 2.4rem;

      .v-list-item__content {
        padding: 1.2rem 0;
      }

      .v-list-item__icon {
        margin: 1.2rem 1rem 1.2rem 0;
        min-width: 0;
        height: auto;

        .v-icon {
          color: $main-color !important;
        }
      }
    }
  }
}
</style>
