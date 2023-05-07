<template>
  <mp-block
    id="custom-checkout-block"
    :title="$vuetify.breakpoint.smAndUp ? $t('components.customCheckout.title') : ''"
    :hasBorder="$vuetify.breakpoint.smAndUp"
    :hasMarginBottom="$vuetify.breakpoint.smAndUp"
    titleHasPaddingBottom
  >
    <template #title v-if="$vuetify.breakpoint.smAndUp">
      <div class="d-flex justify-space-between">
        <h2>{{ $t('components.customCheckout.title') }}</h2>
      </div>
    </template>

    <template #default>
      <div class="justify-center" v-if="!checkouts.length">
        <no-data dataId="customCheckoutBlock-noData" :content="$t('common.noData.noContent')" />
        <mp-button
          v-if="isAuthorized('MANAGE_CUSTOM_CHECKOUT') && $vuetify.breakpoint.lgAndUp"
          class="d-flex ml-auto mr-auto mp-button"
          dataId="customCheckoutBlock-add"
          :text="$t('action.add.base')"
          format="primary"
          icon="plus"
          @click="goToCustomCheckoutPage()"
        />
      </div>

      <div v-else class="checkout-infos">
        <mp-chips-wrapper
          :chips="chipsCheckouts"
          v-model="selectedCheckout"
          dataId="chips-wrapper-checkouts"
        />

        <div v-if="selectedCheckout">
          <div class="d-flex align-center checkout-infos-line with-border">
            <div class="d-flex align-center">
              <v-icon
                class="error-color mr-3"
                v-if="!selectedCheckout.published"
              >
                mdi-close-thick
              </v-icon>
              <v-icon v-else class="mr-3">mdi-check-bold</v-icon>
              <span class="regular14 main-lighten-52">
                {{
                  $t(
                    `components.customCheckout.${
                      selectedCheckout.published ? 'publish' : 'notPublish'
                    }`,
                  )
                }}
              </span>
            </div>
            <div
              class="ml-auto"
              v-if="$vuetify.breakpoint.lgAndUp && isAuthorized('MANAGE_CUSTOM_CHECKOUT')"
            >
              <v-menu
                bottom
                left
                offset-y
                origin="right top"
                transition="scale-transition"
                v-if="!selectedCheckout.default"
              >
                <template v-slot:activator="{ on }">
                  <v-icon
                    v-on="on"
                    class="main-color"
                    dataId="customCheckoutBlock-actions"
                  >
                    mdi-dots-vertical
                  </v-icon>
                </template>
                <v-list>
                  <v-list-item
                    class="pointer"
                    @click="GoToPreview(selectedCheckout)"
                    v-if="!selectedCheckout.published"
                    dataId="customCheckoutBlock-actions-preview"
                  >
                    <v-list-item-icon class="mr-3">
                      <v-icon class="main-color">mdi-eye</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title v-text="$t('components.customCheckout.actions.preview')" />
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item
                    class="pointer"
                    @click="goToEditCustomCheckoutPage(selectedCheckout)"
                    v-if="!selectedCheckout.published && isAuthorized('MANAGE_CUSTOM_CHECKOUT')"
                    dataId="customCheckoutBlock-actions-edit"
                  >
                    <v-list-item-icon class="mr-3">
                      <v-icon class="main-color">mdi-pencil</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title v-text="$t('action.modify.base')" />
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item
                    class="pointer"
                    @click="
                      !selectedCheckout.published
                        ? (showPublishDialog = true)
                        : (showUnpublishDialog = true)
                    "
                    dataId="customCheckoutBlock-actions-publish"
                  >
                    <v-list-item-icon class="mr-3">
                      <v-icon class="main-color">
                        {{ !selectedCheckout.published ? 'mdi-publish' : 'mdi-publish-off' }}
                      </v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title
                        v-text="
                          $t(
                            `components.customCheckout.actions.${
                              !selectedCheckout.published ? 'publish' : 'unpublish'
                            }`,
                          )
                        "
                      />
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item
                    class="pointer"
                    @click="showDeleteDialog = true"
                    v-if="!selectedCheckout.published"
                    dataId="customCheckoutBlock-actions-delete"
                  >
                    <v-list-item-icon class="mr-3">
                      <v-icon class="main-color">mdi-trash-can-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title v-text="$t('action.delete.base')" />
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </div>

          <div class="checkout-infos-line with-border">
            <span class="regular14 main-lighten-52">
              {{ $t('components.customCheckout.numberOfSteps') }}
            </span>
            <span class="regular14 main-color">{{
              Object.keys(selectedCheckout.steps).length
            }}</span>
          </div>

          <div class="checkout-infos-line">
            <span class="regular14 main-lighten-52">
              {{ $t('components.customCheckout.lastUpdate') }}
            </span>
            <span class="regular14 main-color">{{ getDate(selectedCheckout) }}</span>
          </div>
        </div>

        <div
          v-if="isAuthorized('MANAGE_CUSTOM_CHECKOUT') && $vuetify.breakpoint.lgAndUp"
        >
          <mp-button
            class="d-flex ml-auto mr-auto mp-button"
            dataId="customCheckoutBlock-add"
            :text="$t('action.add.base')"
            format="primary"
            icon="plus"
            @click="goToCustomCheckoutPage()"
          />
        </div>
      </div>

      <mp-dialog-confirmation
        v-if="showPublishDialog"
        dataId="custom-checkout-dialog-publish"
        :textContent="$t('components.customCheckout.dialog.publish')"
        @close="showPublishDialog = false"
        @submit="changePublish(selectedCheckout)"
        color="error"
        :header="{
          icon: 'mdi-exclamation-thick',
          isColorBackground: false,
          iconClose: 'mdi-close',
        }"
        persistent
        :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
        :btnValidation="{
          text: $t('components.customCheckout.actions.publish'),
          format: 'error',
        }"
        :btnToColumn="$vuetify.breakpoint.xsOnly"
      />

      <mp-dialog-confirmation
        v-if="showUnpublishDialog"
        dataId="custom-checkout-dialog-unpublish"
        :textContent="$t('components.customCheckout.dialog.unpublish')"
        @close="showUnpublishDialog = false"
        @submit="changePublish(selectedCheckout)"
        color="error"
        :header="{
          icon: 'mdi-exclamation-thick',
          isColorBackground: false,
          iconClose: 'mdi-close',
        }"
        persistent
        :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
        :btnValidation="{
          text: $t('components.customCheckout.actions.unpublish'),
          format: 'error',
        }"
        :btnToColumn="$vuetify.breakpoint.xsOnly"
      />

      <mp-dialog-confirmation
        v-if="showDeleteDialog"
        dataId="custom-checkout-dialog-delete"
        :textContent="$t('components.customCheckout.dialog.delete')"
        @close="showDeleteDialog = false"
        @submit="deleteCustomCheckout(selectedCheckout)"
        color="error"
        :header="{
          icon: 'mdi-trash-can-outline',
          isColorBackground: false,
          iconClose: 'mdi-close',
        }"
        persistent
        :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
        :btnValidation="{
          text: $t('action.delete.base'),
          format: 'error',
        }"
        :btnToColumn="$vuetify.breakpoint.xsOnly"
      />
    </template>
  </mp-block>
</template>

<script lang="ts">
import noData from '@/components/noData/noData.vue'
import mpBlock from '@/components/block/block.vue'
import { ROUTES } from '@/constants'
import { Checkout } from '@/types'
import { dateHelperFormatToTimezone } from '@/helpers/dateHelper'
import { SnackBarType } from '@/store/types'
import { authorizationMixin } from '@/mixins'
import checkoutsService from '@/services/checkouts/checkoutsService'
import mixins from 'vue-typed-mixins'

export default mixins(authorizationMixin).extend({
  name: 'customCheckBlock',
  components: {
    noData,
    mpBlock,
  },
  props: {
    retailerId: {
      type: Number,
      required: true,
    },
    storeId: {
      type: Number,
    },
  },
  data: () => ({
    checkouts: [] as Checkout[],
    showPublishDialog: false,
    showUnpublishDialog: false,
    showDeleteDialog: false,
    selectedCheckout: null as Checkout | null,
  }),
  computed: {
    chipsCheckouts() {
      return this.checkouts.map(checkout => {
        return {
          text: checkout.name,
          value: checkout.id,
          ...checkout,
        }
      })
    },
  },
  async beforeMount() {
    try {
      this.checkouts = await checkoutsService.getAll({
        retailerId: this.retailerId,
        storeId: this.storeId,
      })
    } catch (e) {
      this.$store.dispatch('setSnackbar', {
        type: SnackBarType.ERROR,
        message: this.$t('messages.error'),
      })
    }
  },
  methods: {
    goToCustomCheckoutPage(): void {
      if (this.$route.name === ROUTES.detailRetailer) {
        this.$router.push({
          name: ROUTES.retailerCustomCheckout,
          params: { id: this.$route.params.id },
        })
        return
      }

      this.$router.push({
        name: ROUTES.storeCustomCheckout,
        params: { id: this.$route.params.id, storeId: this.$route.params.storeId },
      })
    },
    goToEditCustomCheckoutPage(checkout: Checkout): void {
      if (this.$route.name === ROUTES.detailRetailer) {
        this.$router.push({
          name: ROUTES.retailerEditCustomCheckout,
          params: { id: this.$route.params.id, checkoutId: checkout.id!.toString() },
        })
        return
      }

      this.$router.push({
        name: ROUTES.storeEditCustomCheckout,
        params: {
          id: this.$route.params.id,
          storeId: this.$route.params.storeId,
          checkoutId: checkout.id!.toString(),
        },
      })
    },
    GoToPreview(checkout: Checkout): void {
      if (this.$route.name === ROUTES.detailRetailer) {
        this.$router.push({
          name: ROUTES.retailerCustomCheckoutPreview,
          params: { id: this.$route.params.id, checkoutId: checkout.id!.toString() },
          query: {
            stepNumber: '1',
          },
        })

        return
      }

      this.$router.push({
        name: ROUTES.storeCustomCheckoutPreview,
        params: {
          id: this.$route.params.id,
          storeId: this.$route.params.storeId,
          checkoutId: checkout.id!.toString(),
        },
        query: {
          stepNumber: '1',
        },
      })
    },
    async changePublish(checkout: Checkout): Promise<void> {
      try {
        await checkoutsService.update(checkout.id!, {
          ...checkout,
          published: !checkout.published,
        })

        checkout.published = !checkout.published

        this.showPublishDialog = false
        this.showUnpublishDialog = false

        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.SUCCESS,
          message: this.$t(
            `page.customCheckout.snackbar.${checkout.published ? 'publish' : 'unpublish'}`,
          ),
        })
      } catch (e) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      }
    },
    async deleteCustomCheckout(checkout: Checkout): Promise<void> {
      try {
        await checkoutsService.delete(checkout.id!)

        this.checkouts.splice(
          this.checkouts.findIndex(localCheckout => localCheckout.id === checkout.id),
          1,
        )

        this.showDeleteDialog = false
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.SUCCESS,
          message: this.$t('page.customCheckout.snackbar.delete'),
        })
      } catch (e) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      }
    },
    getDate(checkout: Checkout): string {
      return dateHelperFormatToTimezone(checkout.updatedAt, 'P')
    },
  },
})
</script>

<style lang="scss">
@import '../../styles/mixins/macScrollbar';

#custom-checkout-block {
  .mp-button {
    margin-top: 2.5rem;
    margin-bottom: 0.1rem;
  }

  .checkout-infos {
    #chips-wrapper {
      overflow: auto;
      display: flex;
      @include setMacScrollbar('&');
    }

    .checkout-infos-line {
      display: flex;
      justify-content: space-between;
      margin-top: 1.6rem;

      &.with-border {
        padding-bottom: 1.6rem;
        border-bottom: 0.1rem solid $main-lighten-74-color;
      }
    }
  }
}
</style>
