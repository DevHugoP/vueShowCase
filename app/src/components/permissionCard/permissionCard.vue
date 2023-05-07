<template>
  <v-card outlined class="permission-card">
    <v-row no-gutters class="my-3 permission-card__heading-wrapper">
      <v-col cols="12" class="px-5 d-flex justify-space-between align-center">
        <h4 class="permission-card__title">
          {{ `${$t('common.permission')} ${index}` }}
        </h4>
        <v-btn
          v-if="(!userId || userId !== currentUser.id) &&
            isAuthorized(
              ['EDIT_PERMISSIONS', 'EDIT_USERS'],
              {},
              'OR'
            )"
          :data-id="`${dataId}-edit`"
          icon
          size="1.4rem"
          class="permission-card__edit-button"
          @click="handleClickEdit()"
        >
          <v-icon size="2rem">mdi-pencil</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-row
      no-gutters
      justify="start"
      class="mb-4 px-5 py-4 permission-card__context-wrapper"
      v-for="context in permission.contexts"
      :key="context.id"
    >
      <v-col v-if="context.carrierId" cols="12" class="d-flex align-center">
        <v-icon class="mr-3">mdi-truck</v-icon>
        <span class="regular14">{{ getEntityName(context.carrierId, 'carriers') }}</span>
      </v-col>
      <v-col v-if="context.retailerId" cols="12" class="d-flex align-center">
        <v-icon class="mr-3">mdi-home-variant</v-icon>
        <span class="regular14">{{ getEntityName(context.retailerId, 'retailers') }}</span>
      </v-col>
      <v-col
        cols="12"
        class="mt-4"
        v-if="
          typeof context.storeIds === 'number' ||
            (Array.isArray(context.storeIds) && context.storeIds.length)
        "
      >
        <template v-if="!Array.isArray(context.storeIds)">
          <v-icon class="mr-3">mdi-storefront-outline</v-icon>
          <span class="regular14">{{ getEntityName(context.storeIds, 'stores') }}</span>
        </template>

        <v-expansion-panels v-else flat tile>
          <v-expansion-panel>
            <v-expansion-panel-header class="pa-0">
              <div class="d-flex align-center">
                <v-icon class="mr-3">mdi-storefront-outline</v-icon>
                <span class="regular14">
                  {{
                    `${context.storeIds.length} ${$t('page.detailUser.permission.store', {
                      count: context.storeIds.length,
                    })}`
                  }}
                </span>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-col cols="2" class="pb-0 px-0 divider-wrapper">
                <v-divider vertical />
              </v-col>
              <v-col cols="10" class="pb-0 px-0 stores-wrapper">
                <v-list color="transparent" class="pb-0">
                  <v-list-item
                    v-for="(storeId, storeIndex) in context.storeIds"
                    :key="storeId"
                    :class="`regular14${storeIndex + 1 === context.storeIds.length ? '' : ' mb-2'}`"
                  >
                    {{ getEntityName(storeId, 'stores') }}
                  </v-list-item>
                </v-list>
              </v-col>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>

      <v-col
        cols="12"
        class="mt-4"
        v-if="context.exchangePlaceIds && context.exchangePlaceIds.length"
      >
        <template v-if="context.exchangePlaceIds.length === 1">
          <v-icon class="mr-3">mdi-store-marker-outline</v-icon>
          <span class="regular14">{{
            getEntityName(context.exchangePlaceIds[0], 'exchangePlaces')
          }}</span>
        </template>

        <v-expansion-panels v-else-if="context.exchangePlaceIds.length" flat tile>
          <v-expansion-panel>
            <v-expansion-panel-header class="pa-0">
              <div class="d-flex align-center">
                <v-icon class="mr-3">mdi-store-marker-outline</v-icon>
                <span class="regular14">
                  {{
                    `${context.exchangePlaceIds.length} ${$t(
                      'page.detailUser.permission.exchangePlace',
                      {
                        count: context.exchangePlaceIds.length,
                      },
                    )}`
                  }}
                </span>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-col cols="2" class="pb-0 px-0 divider-wrapper">
                <v-divider vertical />
              </v-col>
              <v-col cols="10" class="pb-0 px-0 stores-wrapper">
                <v-list color="transparent" class="pb-0">
                  <v-list-item
                    v-for="(exchangePlaceId, epIndex) in context.exchangePlaceIds"
                    :key="exchangePlaceId"
                    :class="
                      `regular14${epIndex + 1 === context.exchangePlaceIds.length ? '' : ' mb-2'}`
                    "
                  >
                    {{ getEntityName(exchangePlaceId, 'exchangePlaces') }}
                  </v-list-item>
                </v-list>
              </v-col>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>

    <v-row no-gutters class="permission-card__groups-wrapper">
      <v-col
        cols="12"
        class="mb-3 px-5 d-flex align-center"
        v-for="group in permission.rulesGroups"
        :key="group.id"
      >
        <span class="regular14 d-flex align-center">
          <v-icon class="mr-3">mdi-check-bold</v-icon>
          {{ group.name }}
        </span>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">

import { authorizationMixin } from '@/mixins'
import { CurrentUserEntity, Filters, PermissionEntity } from '@/types'

import { ROUTES } from '@/constants'
import mixins from 'vue-typed-mixins'
import { mapGetters } from 'vuex'
import StoreService from '@/services/store/StoreService'
import ExchangePlaceService from '@/services/exchangePlace/ExchangePlaceService'

export default mixins(authorizationMixin).extend({
  name: 'permission-card',
  props: {
    index: {
      type: Number,
      required: true,
    },
    permission: {
      type: Object as () => PermissionEntity,
      required: true,
    },
    retailers: {
      type: Array,
      required: true,
    },
    route: {
      type: String,
      default: ROUTES.editPermission,
    },
    carriers: {
      type: Array,
      required: true,
    },
    userId: {
      type: String || null,
      default: null,
    },
    dataId: {
      type: String,
      required: true,
    },
  },
  async beforeMount() {
    const stores = await Promise.all(
      this.permission.contexts.map(context => {
        if (context.retailerId) {
          return StoreService.getFilters({
            forRule: 'LIST_PERMISSIONS',
            retailerId: context.retailerId,
          })
        }
      }),
    )

    this.stores = stores.flat() as Filters[]

    if (stores.length) {
      const exchangePlaces = await Promise.all(
        this.permission.contexts.map(context => {
          if (!Array.isArray(context.storeIds) && context.storeIds) {
            return ExchangePlaceService.getFilters({
              forRule: 'LIST_PERMISSIONS',
              storeId: context.storeIds,
              retailerId: context.retailerId,
            })
          }
        }),
      )

      this.exchangePlaces = exchangePlaces.flat() as Filters[]
    }
  },
  data() {
    return {
      ROUTES,
      stores: [] as Filters[],
      exchangePlaces: [] as Filters[],
    }
  },
  computed: {
    ...mapGetters({
      rulesGroups: 'rulesGroups/rulesGroups',
    }),
    currentUser(): CurrentUserEntity {
      return this.$store.getters['auth/currentUser']
    },
  },
  methods: {
    getEntityName(id: number | string, type: string): string | null {
      let entities: any[] = []

      switch (type) {
        case 'carriers':
          entities = this.carriers
          break
        case 'retailers':
          entities = this.retailers
          break
        case 'stores':
          entities = this.stores
          break
        case 'exchangePlaces':
          entities = this.exchangePlaces
          break
        case 'rulesGroups':
          entities = this.rulesGroups

          break
        default:
          return null
      }

      const entity = entities ? entities.find(item => item && item.id === id) : null
      return entity ? entity.name : null
    },
    handleClickEdit(): void {
      const { id } = this.$route.params
      const { id: permissionId } = this.permission

      if (id && permissionId) {
        this.$router.push({
          name: this.route,
          params: { id, permissionId },
        })
      } else {
        this.$emit('clickEdit')
      }
    },
  },
})
</script>

<style lang="scss">
.permission-card {
  border-radius: 0.4rem;

  &__title {
    color: $main-lighten-52-color;
  }

  &__edit-button {
    .v-btn__content {
      color: $main-color;
    }
  }

  &__context-wrapper {
    background-color: $main-lighten-80-color;

    .col {
      i {
        color: $main-color;
      }
    }

    .v-expansion-panel {
      background-color: transparent !important;

      .v-expansion-panel-header {
        display: flex;
        justify-content: space-between;
        min-height: fit-content;
      }

      .v-expansion-panel-content__wrap {
        display: flex;
        justify-content: flex-start;
        padding-left: 3.6rem;

        .divider-wrapper {
          padding-left: 0.3rem !important;
          max-width: fit-content;
        }

        .stores-wrapper {
          .v-list-item {
            min-height: fit-content;
          }
        }
      }
    }
  }
}
</style>
