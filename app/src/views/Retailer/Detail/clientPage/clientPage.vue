<template>
  <v-container
    id="retailer-detail-client-pages"
    data-id="retailer-detail-clientPages"
    v-if="hasLoaded"
  >
    <mp-block
      id="retailer-detail-client-pages-block"
      :title="$vuetify.breakpoint.smAndUp ? $t('page.retailerDetail.clientPage.title') : ''"
      :hasBorder="$vuetify.breakpoint.smAndUp"
      :hasMarginBottom="$vuetify.breakpoint.smAndUp"
      titleHasPaddingBottom
    >
      <template v-if="clientPages.length">
        <v-row no-gutters class="chip-outer-wrapper">
          <v-col cols="12">
            <mp-chips-wrapper
              dataId="clientPages-chipsWrapper"
              :chips="availablePageCategories"
              textProps="label"
              @input="changeChannel($event.value)"
              v-model="currentChips"
            />
          </v-col>
        </v-row>

        <v-expansion-panels accordion flat v-if="clientPagesAvailable">
          <div
            v-for="(clientPagesType, index) in clientPagesEntriesByType"
            :key="`clientPagesType-${index}`"
            class="client-pages-wrapper"
          >
            <mp-collapse
              v-if="clientPagesType[1].length"
              :ref="`clientPagesType-${index}`"
              color="black"
              hasBorder
              :title="$t(`technical.clientPage.type.${clientPagesType[0]}`)"
              backgroundColor="white"
              :dataId="`retailer-detail-clientPages-collapse-${index}`"
              leftIcon="mdi-book"
              :class="`${clientPagesType[1].length - 1 === 0 ? ' mb-0' : ''}`"
            >
              <v-row
                no-gutters
                v-for="(clientPage, pageIndex) in clientPagesType[1]"
                :key="`retailer-detail-clientPages-${pageIndex}`"
                :class="`client-page${pageIndex === clientPagesType[1].length - 1 ? ' last' : ''}`"
              >
                <v-col cols="12" class="d-flex align-center">
                  <mp-switch
                    v-model="clientPage.isActive"
                    @change="handleActive($event, clientPage.id)"
                    :dataId="`retailer-detail-clientPages-${pageIndex}-active`"
                    :disabled="!isAuthorized('EDIT_CLIENT_PAGES', { retailerId })"
                  />

                  <div v-if="isAuthorized('READ_CLIENT_PAGES')" class="client-page-type_wrapper">
                    <router-link :to="getClientPageRoute(clientPage.id)" class="infos-link_wrapper">
                      <div class="infos">
                        <span class="regular14 main-lighten-52">
                          {{ clientPage.config.title }}
                        </span>
                      </div>
                      <v-spacer />
                      <span class="language regular14 pl-2">
                        {{ clientPage.language.toUpperCase() }}
                      </span>
                      <v-icon class="regular14 main-color">mdi-chevron-right</v-icon>
                    </router-link>
                  </div>
                  <div v-else class="client-page-type_wrapper">
                    <div class="infos-link_wrapper">
                      <div class="infos">
                        <span class="regular14">
                          {{ clientPage.config.title }}
                        </span>
                        <span class="language regular14 pl-2">
                          {{ clientPage.language.toUpperCase() }}
                        </span>
                      </div>
                      <v-spacer />
                      <v-icon class="regular14 main-color">mdi-chevron-right</v-icon>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </mp-collapse>
          </div>
        </v-expansion-panels>
      </template>
      <no-data v-else dataId="retailer-detail-clientPage-noData" />

      <v-row no-gutters class="action-outer-wrapper" v-if="isAuthorized('CREATE_CLIENT_PAGES', { retailerId })">
        <v-col cols="12" class="d-flex justify-center">
          <mp-button
            dataId="retailer-detail-clientPage-newClientPage"
            icon="plus"
            :text="$t('action.add.base')"
            @click="$router.push({ name: ROUTES.addClientPage, params: { retailerId } })"
          />
        </v-col>
      </v-row>
    </mp-block>
  </v-container>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'

import noData from '@/components/noData/noData.vue'
import mpBlock from '@/components/block/block.vue'

import {
  AllClientPageTypes,
  ClientPageCategory,
  ROUTES,
  CollectClientPageType,
  DeliveryClientPageType,
} from '@/constants'

import { authorizationMixin } from '@/mixins'

import ClientPageService from '@/services/clientPage/clientPageService'
import { SnackBarType } from '@/store/types'

import { ClientPage } from '@/types'

export default mixins(authorizationMixin).extend({
  name: 'mp-retailer-detail-client-pages',
  components: {
    mpBlock,
    noData,
  },
  props: {
    retailerId: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    ROUTES,
    clientPages: [] as ClientPage[],
    hasLoaded: false,
    currentChips: null,
    currentCategory: ClientPageCategory.DELIVERY,
  }),
  computed: {
    availablePageCategories() {
      const clientPageCategories = Object.values(ClientPageCategory)

      return clientPageCategories.map(category => ({
        label: this.$t(`technical.clientPage.category.${category}`),
        value: category,
      }))
    },
    clientPagesAvailable() {
      return !!this.clientPages.filter(({ category }) => category === this.currentCategory).length
    },
    clientPagesEntriesByType() {
      const types = Object.values(AllClientPageTypes)
      const result: Record<string, ClientPage[]> = {} as Record<string, ClientPage[]>

      if (!types.length || !this.clientPages.length) {
        return []
      }

      for (const type of types) {
        result[type] = this.filterClientPages(type)
      }

      return Object.entries(result)
    },
  },
  async mounted() {
    const { retailerId } = this
    try {
      const pages = await ClientPageService.getAll({ retailerId })

      if (pages?.length) {
        this.clientPages = pages
      }
    } catch (e) {
      this.clientPages = []
    }

    this.hasLoaded = true
  },
  methods: {
    getClientPageRoute(clientPageId: number) {
      return {
        name: ROUTES.detailClientPage,
        params: {
          retailerId: this.retailerId.toString(),
          clientPageId: clientPageId.toString(),
        },
      }
    },
    changeChannel(currentChannel: ClientPageCategory) {
      this.currentCategory = currentChannel
    },
    filterClientPages(type: CollectClientPageType | DeliveryClientPageType) {
      return this.clientPages.filter(
        ({ category, type: pageType }) => category === this.currentCategory && pageType === type,
      )
    },
    async handleActive(isActive: boolean, id: string) {
      try {
        await ClientPageService.activate(id, { isActive })
      } catch (e) {
        this.clientPages.find(clientPage => clientPage.id === id)!.isActive = !isActive

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
#retailer-detail-client-pages {
  padding: 0;

  @media #{map-get($display-breakpoints, 'xs-only')} {
    border-top: solid 0.1rem $main-lighten-74-color;
  }

  .chip-outer-wrapper {
    width: fit-content;
    padding-bottom: 1rem;

    .chip-wrapper {
      max-width: fit-content;
      margin: 0 1.2rem 0.5rem 0;

      &:last-child {
        margin-right: 0;
      }

      .chip {
        cursor: pointer;

        &.chip-dsk {
          .v-chip__content {
            @include regular-14;
          }
        }

        &.chip-mobile {
          .v-chip__content {
            @include regular-16;
          }
        }

        &.chip-selected {
          background-color: $white;
          border: solid 0.2rem $main-color;
          border-radius: 5rem;
          cursor: default;
        }

        &.chip-no-selected {
          background-color: $white;
          border: solid 0.1rem $main-lighten-74-color;
        }
      }
    }
  }

  .action-outer-wrapper {
    margin-top: 2.5rem;
    margin-bottom: 0.1rem;
  }

  .v-expansion-panels {
    .v-expansion-panel {
      margin-bottom: 0.5rem;
      border-color: $main-lighten-74-color;
      width: 100%;

      .v-expansion-panel-content__wrap {
        .client-page {
          display: flex;
          align-items: center;
          border-bottom: solid 0.1rem $main-lighten-74-color;
          padding: 1.6rem 0;

          &.last {
            border-bottom: none;
          }

          .client-page-type_wrapper {
            text-decoration: none;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .infos-link_wrapper {
              text-decoration: none;
              width: 100%;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }

            .infos {
              padding-left: 1rem;
              cursor: pointer;
              display: flex;
              align-items: center;

              @media #{map-get($display-breakpoints, 'xs-only')} {
                display: block;
              }
            }

            .language {
              color: $main-color;
              white-space: nowrap;
            }
          }
        }
      }
    }
  }

  .client-pages-wrapper {
    width: 100%;

    .left-icon {
      color: $main-color;
    }
  }

  #template-collapse::before {
    box-shadow: none;
  }
}
</style>
