<template>
  <v-hover
    :disabled="$vuetify.breakpoint.xsOnly"
    v-model="isCardHovered"
    :data-id="`carrier-list-card-${carrier.id}`"
  >
    <template #default>
      <v-card
        :class="`carrier-list-cards-card-wrapper cards cards--${getColor()}`"
        :ripple="false"
        :to="`/carriers/${carrier.id}`"
      >
        <v-row no-gutters>
          <v-col cols="12">
            <v-card-title class="carrier-card-header">
              <div :class="`card-new card-new--${getColor()}`" v-if="carrier.isNew">
                <span class="medium12">NEW</span>
              </div>
              <span class="medium14" :data-id="`card-${carrier.id}-title`">
                <v-row class="carrier_logo_container">
                  <v-img
                    :src="carrier.logo"
                    contain
                    :class="`carrier_logo${carrier.isNew ? ' new' : ''}`"
                  />
                </v-row>
              </span>
            </v-card-title>
            <v-card-text class="carrier-card-name">
              <v-row class="content-outer-wrapper" justify="center" align="center" no-gutters>
                <v-col class="content-wrapper" cols="12">
                  <span class="medium12 main-lighten-52" :data-id="`card-${carrier.id}-content`">
                    {{ carrier.name.toUpperCase() }}
                  </span>
                </v-col>

                <v-col cols="12" class="mt-3">
                  <span class="italic12 main-color" :data-id="`card-${carrier.id}-content`">
                    {{
                      carrier.description &&
                        carrier.description[$store.getters['auth/currentUser'].language]
                        ? carrier.description[$store.getters['auth/currentUser'].language]
                        : ''
                    }}
                  </span>
                </v-col>
                <v-col cols="12" class="logo-picto">
                  <img v-if="carrier && carrier.isLabeled" src="@/assets/logos/label.svg" />
                  <img
                    class="logo-picto-eco-100"
                    v-if="
                      carrier && carrier.ecologyType && carrier.ecologyType === ECOLOGY_TYPE.FULL
                    "
                    src="@/assets/logos/green100.svg"
                  />
                  <img
                    class="logo-picto-eco"
                    v-else-if="
                      carrier && carrier.ecologyType && carrier.ecologyType === ECOLOGY_TYPE.PARTIAL
                    "
                    src="@/assets/logos/green.svg"
                  />
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions class="py-3 carrier-card-footer">
              <span class="medium12" :data-id="`card-${carrier.id}-footer`">
                {{ getText() }}
              </span>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-card>
    </template>
  </v-hover>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'
import { CarrierEntity, INTEGRATION_STATUS, ECOLOGY_TYPE } from '@/types'
import { authorizationMixin } from '@/mixins'
import mpCard from '@/components/card/card.vue'

export enum CardColor {
  GREEN = 'green',
  RED = 'red',
  ORANGE = 'orange',
}

export default mixins(authorizationMixin).extend({
  name: 'carrier-card',
  components: {
    mpCard,
  },
  props: {
    carrier: {
      type: Object as () => CarrierEntity,
      required: true,
    },
  },
  data: () => ({
    color: '',
    isCardHovered: false,
    ECOLOGY_TYPE,
  }),
  methods: {
    getColor(): string {
      switch (this.carrier.status) {
        case INTEGRATION_STATUS.STUDY:
        default:
          return CardColor.RED
        case INTEGRATION_STATUS.IN_PROGRESS:
          return CardColor.ORANGE
        case INTEGRATION_STATUS.INTEGRATED:
          return CardColor.GREEN
      }
    },
    getText() {
      const statuses = [
        { name: this.$t('common.integrated.study'), id: INTEGRATION_STATUS.STUDY },
        { name: this.$t('common.integrated.onGoing'), id: INTEGRATION_STATUS.IN_PROGRESS },
        { name: this.$t('common.integrated.base'), id: INTEGRATION_STATUS.INTEGRATED },
      ]

      const statusFound = statuses.find(({ id }) => this.carrier.status === id)

      return statusFound?.name || this.$t('common.integrated.study')
    },
  },
})
</script>

<style lang="scss">
.carrier-list-cards-card-wrapper {
  .carrier-card-header {
    .card-new {
      position: absolute;
      margin-bottom: 5.5rem;
      width: fit-content;
      padding: 0 0.5rem 0 0.7rem;
      border-radius: 6rem;

      &.card-new--orange {
        background-color: $alert-color;
      }

      &.card-new--red {
        background-color: $error-color;
      }

      &.card-new--green {
        background-color: $success-color;
      }

      span {
        color: $white;
      }
    }
  }

  .carrier_logo_container {
    align-items: center;
    max-height: 5.6rem;
    min-height: 5.6rem;

    .carrier_logo {
      max-height: 4rem !important;
      min-height: 4rem !important;
      max-width: 6.5rem;
      min-width: 6.5rem;
      margin: 0 auto;
      margin-bottom: 0.2rem;

      &.new {
        align-self: end;
        margin-bottom: 0.4rem;
      }
    }
  }
  .v-card.cards {
    min-height: 25rem;

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
    .v-card__actions {
      position: absolute;
      bottom: 0;
      width: 100%;
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

  .content-outer-wrapper {
    margin-bottom: 3rem;
    margin-left: 1rem;
    margin-right: 1rem;
    text-align: center;

    .logo-picto {
      bottom: 4.2rem;
      position: absolute;
      display: flex;
      justify-content: center;
      background-color: $white;
      padding-bottom: 1rem;

      .logo-picto-eco {
        width: 2.4rem;
        height: 2.4rem;
        margin: 0.8rem;
      }
      .logo-picto-eco-100 {
        width: 3rem;
        height: 3rem;
        margin:  0.5rem;
      }

      img {
        width: 4rem;
        height: 4rem;

        &:nth-child(2) {
          margin-left: 1rem;
        }
      }
    }

    .content-wrapper {
      display: flex;
      overflow: hidden;
      text-align: center;

      .v-icon {
        color: $main-lighten-65-color;
      }

      span {
        color: $main-lighten-28-color;
        align-self: center;
        margin-left: 0.8rem;
        line-height: 1.6rem;
        width: 100% !important;
      }
    }
  }

  .carrier-card-name {
    display: flex;
    justify-content: center;
    word-break: break-word;
    text-align: center;
    max-height: 15.7rem;
    min-height: 15.7rem;
  }

  .carrier-card-desc {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }
}
</style>
