<template>
  <fragment id="card">
    <div class="card-badges" v-if="badges.length">
      <mp-badge
        v-for="(badge, index) in badges.filter(badge => badge)"
        :key="`badges-${index}`"
        :color="color"
        :icon="badge.icon || null"
        :content="badge.content || null"
        :dataId="`card-${id}-badges-${index}`"
      />
    </div>

    <v-card-title>
      <span class="medium14" :data-id="`card-${id}-title`">
        {{ title }}
      </span>
    </v-card-title>
    <v-card-text>
      <v-row
        class="content-outer-wrapper"
        no-gutters
        v-for="(content, index) in contents"
        :key="`card-contents-${index}`"
      >
        <v-col class="ma-0 content-wrapper" cols="12">
          <v-icon size="16">{{ content.icon }}</v-icon>
          <span
            :class="`regular12${fromOrder ? ' text-limit' : ''}`"
            :data-id="`card-${id}-contents-${index}`"
          >
            {{ content.text }}
          </span>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions class="py-3">
      <span class="medium12" :data-id="`card-${id}-footer`">
        {{ footer }}
      </span>
    </v-card-actions>
  </fragment>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'mp-card',
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    contents: {
      type: Array as () => Array<{ icon: string; text: string }>,
      required: true,
    },
    footer: {
      type: String,
      required: true,
    },
    badges: {
      type: Array as () => Array<{ icon?: string; content?: string }>,
      default: () => [],
    },
    color: {
      type: String,
      default: '',
    },
    fromOrder: {
      type: Boolean,
      default: false,
    },
  },
})
</script>

<style lang="scss">
.v-card.cards {
  &.cards--orange {
    border-color: $alert-color;

    .v-card__actions {
      background-color: $alert-color;
    }
  }
  &.cards--red {
    border-color: $error-color;

    .v-card__actions {
      background-color: $error-color;
    }
  }
  &.cards--green {
    border-color: $success-color;

    .v-card__actions {
      background-color: $success-color;
    }
  }
  &.cards--main {
    border-color: $main-lighten-28-color;

    .v-card__actions {
      background-color: $main-lighten-28-color;
    }
  }
  &.cards--grey {
    border-color: $main-lighten-65-color;

    .v-card__actions {
      background-color: $main-lighten-65-color;
    }
  }

  .v-card__title,
  .v-card__actions {
    justify-content: center;
    text-align: center;
    word-break: break-word;
  }

  .v-card__title {
    color: $main-lighten-8-color;
    border-bottom: 0.1rem solid $main-lighten-74-color;
    padding: 0 1rem;
    max-height: 4.6rem;
    min-height: 4.6rem;

    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      max-height: 5.6rem;
      min-height: 5.6rem;
    }
  }

  .v-card__text {
    padding: 0;

    .row:first-child {
      margin-top: 1.5rem;
    }

    .content-outer-wrapper {
      max-height: 1.6rem;
      min-height: 1.6rem;
      margin-bottom: 3rem;
      margin-left: 1rem;
      margin-right: 1rem;

      .content-wrapper {
        display: flex;
        align-items: flex-start;

        .v-icon {
          color: $main-lighten-65-color;
        }

        span {
          color: $main-lighten-28-color;
          align-self: center;
          margin-left: 0.8rem;
          line-height: 1.6rem;

          &.text-limit {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
          }

        }
      }
    }
  }

  .v-card__actions {
    color: $white;
    max-height: 3.8rem;
    min-height: 3.8rem;
  }

  .card-badges {
    display: flex;
    justify-content: center;
    margin-top: -1rem;
    min-height: 2rem;

    .mp-badge {
      .v-badge__wrapper {
        min-width: 4rem;
      }
    }
  }
}
</style>
