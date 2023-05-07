<template>
  <v-row
    no-gutters
    v-if="clientPage && hasLoaded"
    id="retailer-client-page"
    :class="
      `${
        !isAuthorized('EDIT_CLIENT_PAGES', { retailerId: clientPage.retailerId })
          ? 'mobile-no-action'
          : ''
      }`
    "
  >
    <v-col cols="12">
      <content-header v-if="$vuetify.breakpoint.smAndUp" dataId="clientPage-detail">
        <template #breadcrumb>
          <mp-breadcrumb />
        </template>
        <template #title>
          <h1 data-id="clientPage-title">{{ clientPage.config.title }}</h1>
        </template>
        <template #actions-button>
          <v-menu bottom offset-y origin="center top" transition="scale-transition">
            <template v-slot:activator="{ on, attrs }">
              <mp-button
                v-bind="attrs"
                v-on="on"
                :text="$t('action.base')"
                format="secondary"
                icon="apps"
                dataId="clientPage-detail-actions"
              />
            </template>
            <v-list>
              <v-list-item
                v-if="isAuthorized('EDIT_CLIENT_PAGES', { retailerId: clientPage.retailerId })"
                @click="
                  $router.push({
                    name: ROUTES.editClientPage,
                    params: { id: clientPage.retailerId, clientPageId: clientPage.id },
                  })
                "
                dataId="clientPage-detail-update"
              >
                <v-list-item-icon>
                  <v-icon v-text="'mdi-pencil'" />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="$t('action.modify.base')" />
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                v-if="isAuthorized('DELETE_CLIENT_PAGES', { retailerId: clientPage.retailerId })"
                dataId="clientPage-detail-delete"
                @click="handleDelete()"
              >
                <v-list-item-icon>
                  <v-icon v-text="'mdi-trash-can-outline'" />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="$t('action.delete.base')" />
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </content-header>
    </v-col>

    <v-col cols="12" id="client-page-detail-state-section" class="active-outer-wrapper">
      <v-row no-gutters>
        <v-img contain src="@/assets/illustrations/illus_detail_clientPage.svg" v-if="!$vuetify.breakpoint.smAndUp" />
        <v-col cols="12" class="active-wrapper">
          <v-row no-gutters class="active information-wrapper">
            <v-col cols="5" offset="1" v-if="$vuetify.breakpoint.smAndUp" class="image-information-wrapper">
              <v-img contain src="@/assets/illustrations/illus_detail_clientPage.svg" />
            </v-col>
            <v-col sm="6" cols="12" class="active-wrapper-right pr-10">
              <div class="d-flex align-center active-right mt-4">
                <v-icon>{{ clientPage.isActive ? 'mdi-check-bold' : 'mdi-close-thick' }}</v-icon>
                <span
                  :class="`medium14 pl-2 ${clientPage.isActive ? 'success-color' : 'error-color'}`"
                >
                  {{ $t(`common.${clientPage.isActive ? 'active' : 'inactive'}`) }}
                </span>
              </div>
              <v-divider class="mt-2 mb-2" />
              <div class="language">
                <span class="regular12 language-text">{{
                  $t('page.editClientPage.definition.category')
                }}</span>
                <span class="regular14">{{
                  $t(`technical.clientPage.category.${clientPage.category}`)
                }}</span>
              </div>
              <v-divider class="mt-2 mb-2" />
              <div class="language">
                <span class="regular12 language-text">{{ $t('common.language') }}</span>
                <span class="regular14">{{ clientPage.language.toUpperCase() }}</span>
              </div>
              <v-divider class="mt-2 mb-2" />
              <div class="language">
                <span class="regular12 language-text">{{ $t('common.type') }}</span>
                <span class="regular14">{{ $t(`technical.clientPage.type.${clientPage.type}`) }}</span>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>

    <div v-if="$vuetify.breakpoint.smAndUp" class="content-wrapper">
      <div v-if="!clientPageIsSurvey" :class="$vuetify.breakpoint.lgAndUp ? 'd-flex' : ''">
        <v-col
          cols="10"
          lg="5"
          offset="1"
          :class="`left-column mt-10 ${$vuetify.breakpoint.mdAndUp ? 'pa-0 pr-10' : 'pa-0'}`"
        >
          <client-page-detail-header :header="clientPage.config.header" />
        </v-col>
        <v-col
          cols="10"
          offset="1"
          offset-lg="0"
          lg="6"
          class="right-column mt-10 pa-0 pr-10"
        >
          <client-page-detail-body
            v-if="hasBody"
            :body="clientPage.config.body"
            :type="clientPage.type"
          />

          <client-page-detail-footer :footer="clientPage.config.footer" />

          <client-page-detail-custom-content
            v-if="clientPage.config.customContent && clientPage.config.customContent.toggle"
            :body="clientPage.config.customContent.body"
          />

          <client-page-detail-carrier-infos
            v-if="clientPageIsTracking"
            :carrierInfos="clientPage.config.carrierInfos"
          />
        </v-col>
      </div>
      <div v-else :class="$vuetify.breakpoint.lgAndUp ? 'd-flex' : ''">
        <v-col
          cols="10"
          lg="5"
          offset="1"
          :class="`left-column mt-10 ${$vuetify.breakpoint.mdAndUp ? 'pa-0 pr-10' : 'pa-0'}`"
        >
          <client-page-detail-header :header="clientPage.config.header" />

          <client-page-detail-body
            v-if="hasBody"
            :body="clientPage.config.body"
            :type="clientPage.type"
          />

          <client-page-detail-custom-content
            v-if="clientPage.config.customContent && clientPage.config.customContent.toggle"
            :body="clientPage.config.customContent.body"
          />

          <client-page-detail-footer :footer="clientPage.config.footer" />

          <client-page-detail-carrier-infos
            v-if="clientPageIsTracking"
            :carrierInfos="clientPage.config.carrierInfos"
          />
        </v-col>

        <v-col
          cols="10"
          offset="1"
          offset-lg="0"
          lg="6"
          class="right-column mt-10 pa-0 pr-10"
        >
          <client-page-detail-form :questions="clientPage.config.content" />
        </v-col>
      </div>
    </div>

    <div v-else>
      <v-row no-gutters class="phone-content-detail" id="client-page-detail-collapse-mobile">
        <v-col cols="12">
          <v-expansion-panels flat>
            <mp-collapse
              ref="header"
              @click="scrollTo('header')"
              :title="$t('page.clientPage.header.title')"
              noPadding
              typographyClass="medium16"
              dataId="clientPage-detail-header"
            >
              <client-page-detail-header :header="clientPage.config.header" class="border-mobile" />
            </mp-collapse>

            <mp-collapse
              ref="body"
              v-if="hasBody"
              @click="scrollTo('body')"
              :title="$t('page.clientPage.body.title')"
              noPadding
              typographyClass="medium16"
              dataId="clientPage-detail-body"
            >
              <client-page-detail-body
                :body="clientPage.config.body"
                :type="clientPage.type"
                class="border-mobile"
              />
            </mp-collapse>

            <mp-collapse
              ref="footer"
              @click="scrollTo('footer')"
              :title="$t('page.clientPage.footer.title')"
              noPadding
              typographyClass="medium16"
              dataId="clientPage-detail-footer"
            >
              <client-page-detail-footer :footer="clientPage.config.footer" class="border-mobile" />
            </mp-collapse>

            <mp-collapse
              v-if="clientPageIsTracking"
              ref="carrierInfos"
              @click="scrollTo('carrierInfos')"
              :title="$t('page.clientPage.carrierInfos.title')"
              noPadding
              typographyClass="medium16"
              dataId="clientPage-detail-carrier-infos"
            >
              <client-page-detail-carrier-infos
                v-if="clientPageIsTracking"
                :carrierInfos="clientPage.config.carrierInfos"
              />
            </mp-collapse>

            <mp-collapse
              v-if="clientPageIsSurvey"
              ref="form"
              @click="scrollTo('form')"
              :title="$t('page.clientPage.form.title')"
              noPadding
              typographyClass="medium16"
              dataId="clientPage-detail-form"
            >
              <client-page-detail-form
                :questions="clientPage.config.content"
                class="border-mobile"
              />
            </mp-collapse>

            <mp-collapse
              v-if="(clientPageIsSurvey || clientPageIsConfirmation) && hasCustomContent"
              ref="custom-content"
              @click="scrollTo('form')"
              :title="$t('page.clientPage.customContent.title')"
              noPadding
              typographyClass="medium16"
              dataId="clientPage-detail-custom-content"
            >
              <client-page-detail-custom-content
                v-if="clientPage.config.customContent.toggle"
                :body="clientPage.config.customContent.body"
                class="border-mobile"
              />
            </mp-collapse>
          </v-expansion-panels>
        </v-col>
      </v-row>

      <v-row
        id="client-page-detail-update-btn"
        no-gutters
        v-if="isAuthorized(['EDIT_CLIENT_PAGES', 'DELETE_CLIENT_PAGES'], { retailerId: clientPage.retailerId }, 'OR')"
      >
        <v-col cols="12" class="action-mobile-wrapper">
          <mp-button
            :style="{
              width:
                isAuthorized('EDIT_CLIENT_PAGES', { retailerId: clientPage.retailerId }) &&
                isAuthorized('DELETE_CLIENT_PAGES', { retailerId: clientPage.retailerId })
                  ? '50%'
                  : '100%',
              minHeight: '6rem',
            }"
            id="client-page-detail-update-btn"
            class="action-mobile"
            dataId="clientPage-detail-update"
            :text="$t('action.modify.base')"
            format="sticky"
            stickyColor="yellow"
            v-if="isAuthorized('EDIT_CLIENT_PAGES', { retailerId: clientPage.retailerId })"
            @click="
              $router.push({
                name: ROUTES.editClientPage,
                params: { id: clientPage.retailerId, clientPageId: clientPage.id },
              })
            "
          />
          <mp-button
            :style="{
              width:
                isAuthorized('EDIT_CLIENT_PAGES', { retailerId: clientPage.retailerId }) &&
                isAuthorized('DELETE_CLIENT_PAGES', { retailerId: clientPage.retailerId })
                  ? '50%'
                  : '100%',
              minHeight: '6rem',
            }"
            class="delete-action"
            :text="$t('action.delete.base')"
            format="sticky"
            stickyColor="yellow"
            icon="trash-can-outline"
            dataId="clientPage-detail-delete"
            v-if="isAuthorized('DELETE_CLIENT_PAGES', { retailerId: clientPage.retailerId })"
            @click="handleDelete()"
          />
        </v-col>
      </v-row>
    </div>

    <mp-dialog-confirmation
      v-if="showDeleteModal"
      dataId="clientPage-detail-delete"
      :textContent="$t('page.clientPage.delete.content')"
      @close="showDeleteModal = false"
      @submit="deleteClientPage()"
      color="error"
      :header="{
        icon: 'mdi-trash-can-outline',
        isColorBackground: false,
        iconClose: 'mdi-close',
      }"
      :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
      :btnValidation="{ text: $t('action.delete.base'), format: 'error' }"
      :btnToColumn="$vuetify.breakpoint.xsOnly"
    />
  </v-row>
</template>

<script lang="ts">
import mpBreadcrumb from '@/components/breadcrumb/breadcrumb.vue'

import contentHeader from '@/components/contentHeader/contentHeader.vue'

import { ClientPageType, DeliveryClientPageType, ROUTES } from '@/constants'

import { authorizationMixin } from '@/mixins'

import ClientPageService from '@/services/clientPage/clientPageService'
import RetailerService from '@/services/retailer/RetailerService'

import { SET_BREADCRUMBS_LABEL, SET_HEADER_TITLE } from '@/store/mutation-types'
import { SnackBarType } from '@/store/types'
import { ClientPage, defaultCarrierInfos } from '@/types'
import clientPageDetailBody from '@/views/ClientPage/detail/body/body.vue'
import clientPageDetailCarrierInfos from '@/views/ClientPage/detail/carrierInfos/carrierInfos.vue'
import clientPageDetailFooter from '@/views/ClientPage/detail/footer/footer.vue'
import clientPageDetailForm from '@/views/ClientPage/detail/form/form.vue'
import clientPageDetailCustomContent from '@/views/ClientPage/detail/customContent/customContent.vue'

import clientPageDetailHeader from '@/views/ClientPage/detail/header/header.vue'
import mixins from 'vue-typed-mixins'

export default mixins(authorizationMixin).extend({
  name: 'client-page-detail',
  components: {
    contentHeader,
    mpBreadcrumb,
    clientPageDetailHeader,
    clientPageDetailBody,
    clientPageDetailCustomContent,
    clientPageDetailFooter,
    clientPageDetailForm,
    clientPageDetailCarrierInfos,
  },
  data: () => ({
    ROUTES,
    clientPage: null as ClientPage | null,
    showDeleteModal: false,
    hasLoaded: false,
  }),
  computed: {
    hasBody(): boolean {
      return !!this.clientPage?.config.body && !!Object.keys(this.clientPage.config.body).length
    },
    hasCustomContent(): boolean {
      return !!this.clientPage?.config.customContent?.toggle
    },
    clientPageIsSurvey(): boolean {
      return (
        this.clientPage?.type === ClientPageType.COLLECT.DRIVE_SURVEY ||
        this.clientPage?.type === ClientPageType.DELIVERY.SURVEY
      )
    },
    clientPageIsConfirmation(): boolean {
      return (
          this.clientPage?.type === ClientPageType.COLLECT.DRIVE_CONFIRMATION ||
          this.clientPage?.type === ClientPageType.DELIVERY.CONFIRMATION
      )
    },
    clientPageIsTracking(): boolean {
      return (
        this.clientPage?.type === ClientPageType.DELIVERY.TRACKING ||
        this.clientPage?.type === ClientPageType.DELIVERY.MULTI_TRACKING
      )
    },
  },
  async mounted() {
    try {
      const { id, clientPageId } = this.$route.params
      const breadcrumbLabel: Record<string, string> = {}

      if (!id || !clientPageId) {
        return
      }

      this.clientPage = await ClientPageService.get(clientPageId, {
        retailerId: parseInt(id, 10),
      })

      if (
        !this.clientPage.config.carrierInfos &&
        (this.clientPage.type === DeliveryClientPageType.TRACKING ||
          this.clientPage.type === DeliveryClientPageType.MULTI_TRACKING)
      ) {
        this.clientPage.config.carrierInfos = defaultCarrierInfos()
      }

      const retailer = await RetailerService.get(parseInt(id, 10))
      if (retailer) {
        breadcrumbLabel.retailers = retailer.name
      }

      if (this.clientPage) {
        const {
          config: { title },
        } = this.clientPage
        breadcrumbLabel.clientPage = title
        this.$store.commit(SET_HEADER_TITLE, title)
      }

      this.$store.commit(SET_BREADCRUMBS_LABEL, JSON.stringify(breadcrumbLabel))
    } catch (e) {
      if (e.response?.status === 403) {
        return this.$router.push({ name: ROUTES.noAccess })
      }
      if (e.response?.status === 404) {
        return this.$router.push({ name: ROUTES.notFound })
      }
    } finally {
      this.hasLoaded = true
    }
  },
  methods: {
    scrollTo(refToScroll: string) {
      setTimeout(() => {
        ;(this.$refs[refToScroll] as any).$el.scrollIntoView(true, {
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest',
        })
      }, 300)
    },
    handleDelete() {
      this.showDeleteModal = true
    },
    async deleteClientPage() {
      try {
        await ClientPageService.delete(this.clientPage!.id)

        this.$router.push({
          name: ROUTES.detailRetailer,
          params: { retailerId: this.$route.params.id },
        })
      } catch (e) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      } finally {
        this.showDeleteModal = false
      }
    },
  },
})
</script>

<style lang="scss">
#retailer-client-page {
  .main-header__container > .row:first-child {
    padding: 0;
    box-shadow: none;
    background-color: $white;

    .main-header__actions {
      .mp-button--secondary {
        border: none;

        &:focus::before {
          background-color: transparent;
        }
      }
    }
  }

  .content-wrapper {
    width: 100%;
  }

  .border-mobile {
    border-top: solid 0.1rem $main-lighten-74-color;
  }

  @media #{map-get($display-breakpoints, 'xs-only')} {
    max-height: calc(100vh - 5.4rem);
    overflow-y: scroll;
    overflow-x: hidden;

    &.mobile-no-action {
      max-height: calc(100vh - 5.4rem);
    }
  }

  .phone-content-detail {
    @media #{map-get($display-breakpoints, 'xs-only')} {
      min-height: calc(100vh - 39.3rem - 5.4rem - 6rem);
      max-height: calc(100vh - 39.3rem - 5.4rem);
      overflow: hidden !important;
    }

    padding: 2.5rem 2.5rem 6.4rem 2.5rem;
    background-color: $main-lighten-74-color;

    .v-expansion-panel {
      margin-bottom: 0.5rem;

      .v-expansion-panel--active {
        margin-top: 0;
      }
    }
  }

  .action-mobile-wrapper {
    .action-mobile {
      width: 100%;
      min-height: 6rem;
    }
  }

  .image-information-wrapper{
    padding-right: 4rem !important;
  }

  .active-outer-wrapper {
    background-color: $main-lighten-80-color;
    padding-top: 4rem;
    padding-bottom: 3.2rem;
    display: flex;
    align-items: center;

    .active-wrapper {
      display: flex;
      justify-content: space-between;

      .active {
        display: flex;

        .col {
          display: flex;
          align-items: center;

          &:last-of-type {
            justify-content: flex-end;
          }
        }
      }

      .active-wrapper-right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        padding: 0.5rem;

        .language {
          display: flex;
          align-items: center;
          justify-content: space-between;
          align-self: stretch;

          .language-text {
            color: $main-lighten-52-color;
          }
        }

        .active-right {
          display: flex;
          align-items: center;
          align-self: flex-end;

          .success-color {
            color: $success-color;
          }

          .error-color {
            color: $error-color;
          }
        }

        .v-divider {
          width: 100%;
        }
      }
    }
  }

  .mdi-close-thick {
    color: $error-color;
  }

  .action-button {
    width: 100%;
  }
}
</style>
