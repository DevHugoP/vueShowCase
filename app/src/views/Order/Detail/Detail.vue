<template>
  <div
    id="detail-order-wrapper"
    data-id="order-detail"
    v-if="hasData"
    :class="`${displayFullSize ? 'display-bottom-button' : ''} ${cancelled ? ' cancelled' : ''}`"
  >
    <content-header
      id="order-detail__header"
      v-if="$vuetify.breakpoint.smAndUp"
      dataId="order-detail"
    >
      <template #breadcrumb>
        <mp-breadcrumb />
      </template>
      <template #title>
        <h1 data-id="order-detail-title" class="order-detail__title">{{ headerTitle }}</h1>
      </template>
      <template #actions-button>
        <div class="actions-wrapper" v-if="showActionBtn">
          <v-menu bottom offset-y origin="center top" transition="scale-transition">
            <template v-slot:activator="{ on, attrs }">
              <mp-button
                v-bind="attrs"
                v-on="on"
                dataId="order-detail-actions"
                format="secondary"
                :text="$t('action.base')"
                icon="apps"
              />
            </template>
            <v-list>
              <v-list-item
                v-if="!cancelled && displayCancelOrder && isAuthorized('CANCEL_ORDERS')"
                @click="showCancelDialog = true"
                :disabled="!canCancel"
                dataId="order-detail-cancel"
              >
                <v-list-item-icon>
                  <v-icon v-text="'mdi-close-circle'" />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="$t('action.cancel.base')" />
                </v-list-item-content>
              </v-list-item>

              <v-list-item
                v-if="!cancelled && displayCloseDelivery && isAuthorized('CLOSE_DELIVERY')"
                @click="showCloseDeliveryModal = true"
                :disabled="!canCancel"
                dataId="order-detail-close-delivery"
              >
                <v-list-item-icon>
                  <v-icon v-text="'mdi-close-circle'" />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="$t('action.close.delivery')" />
                </v-list-item-content>
              </v-list-item>

              <v-list-item
                v-if="!cancelled && displayUpdateOrder && isAuthorized('EDIT_ORDERS')"
                :disabled="!canEdit"
                dataId="order-detail-modify"
                :to="getEditRoute()"
                @click="resetStore = false"
              >
                <v-list-item-icon>
                  <v-icon v-text="'mdi-pencil'" />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="$t('action.modify.base')" />
                </v-list-item-content>
              </v-list-item>

              <v-list-item
                v-if="cancelled && displayUpdateOrder"
                :disabled="!canEdit"
                dataId="order-detail-continue"
                :to="getEditRoute()"
                @click="resetStore = false"
              >
                <v-list-item-icon>
                  <v-icon v-text="'mdi-play'" />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="$t('action.continue')" />
                </v-list-item-content>
              </v-list-item>

              <v-list-item
                v-if="!closed && order.Delivery && isAuthorized('UPDATE_DELIVERY_STATUS')"
                @click="showUpdateDelivery = true"
                dataId="order-detail-update"
              >
                <v-list-item-icon>
                  <v-icon v-text="'mdi-restore'" />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="$t('action.update.base')" />
                </v-list-item-content>
              </v-list-item>

              <v-list-item
                v-if="showErrorButton"
                @click="showErrorDialog = true"
                dataId="order-detail-correct-detail"
              >
                <v-list-item-icon>
                  <v-icon v-text="'mdi-alert-decagram'" />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="$t('page.detailOrder.errors.btn')" />
                </v-list-item-content>
              </v-list-item>

              <v-list-item
                v-if="
                  order &&
                    !order.Delivery &&
                    isAuthorized('READ_ORDER_PERSONAL_DATA') &&
                    isAuthorized('COPY_ESSENTIAL_ORDER_INFORMATIONS')
                "
                @click="copyOrderInfo()"
                dataId="order-detail-copy-order-info"
              >
                <v-list-item-icon>
                  <v-icon v-text="'mdi-content-copy'" />
                </v-list-item-icon>
                <v-list-item-title v-text="$t('page.detailOrder.copy')" />
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </template>
    </content-header>

    <template v-if="$vuetify.breakpoint.smAndUp">
      <v-row no-gutters>
        <v-col
          cols="12"
          :class="
            `status-container__wrapper${
              order &&
              !isAuthorized('READ_ORDER_STATUS', {
                storeId: order.storeId,
                retailerId: order.retailerId,
              })
                ? ' mb-5'
                : ''
            }`
          "
        >
          <v-row no-gutters class="status-container">
            <v-col cols="6" offset="1" class="status-label">
              <h2
                class="current-status"
                v-if="order.DeliveryStatus && order.DeliveryStatus.length"
                data-id="order-detail-status"
              >
                {{
                  $t([
                    `technical.status.delivery.${order.Delivery.status}.${isReturn ? 'return' : order.Delivery.subStatus}`,
                    `technical.status.delivery.${order.Delivery.status}.default`,
                  ])
                }}
              </h2>

              <h2 class="current-status" v-else data-id="order-detail-status">
                {{ $t(`technical.status.order.${order.status}`) }}
              </h2>
            </v-col>
            <v-col cols="4" class="status-action">
              <mp-button
                v-if="displayValidDelivery"
                :text="$t('action.valid.delivery')"
                dataId="order-detail-validDelivery"
                format="secondary"
                @click="showConfirmValidDelivery = true"
                class="ml-2 mt-1 mb-1"
              />

              <mp-button
                :text="$t('action.retry')"
                dataId="order-detail-retry"
                format="secondary"
                @click="retry()"
                icon="refresh"
                iconSize="1.8rem"
                class="btn-refresh ml-2 mt-1 mb-1"
                :loading="loadRetry"
                :disabled="loadRetry"
                v-if="
                  order &&
                    isAuthorized('RETRY_ORDERS', {
                      storeId: order.storeId,
                      retailerId: order.retailerId,
                    }) &&
                    canRetry
                "
              />

              <mp-button
                v-if="
                  order &&
                    order.Delivery &&
                    !showManualQuote &&
                    isAuthorized('CREATE_DELIVERY_APPOINTMENT', {
                      storeId: order.storeId,
                      retailerId: order.retailerId,
                    })
                "
                :text="$t('page.detailOrder.appointment.title')"
                dataId="order-detail-appointment"
                format="secondary"
                @click="showDialogAppointmentCreation = true"
                icon="calendar"
                iconSize="1.8rem"
                class="btn-refresh ml-2 mt-1 mb-1"
              />

              <mp-button
                v-if="
                  showManualQuote &&
                    order &&
                    isAuthorized('CREATE_MANUAL_QUOTE', {
                      storeId: order.storeId,
                      retailerId: order.retailerId,
                    })
                "
                :text="$t('page.detailOrder.manualQuote.title')"
                dataId="order-detail-manualQuote"
                format="alert"
                @click="showDialogManualQuote = true"
                icon="file-edit-outline"
                class="ml-2 mt-1 mb-1"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-row no-gutters class="order-detail__content__wrapper">
        <v-col cols="10" offset="1">
          <!-- info -->
          <v-row no-gutters v-if="displayConfirmOrder" class="info-outer-wrapper">
            <v-col cols="12" class="info-wrapper">
              <v-icon>mdi-alert-decagram</v-icon>
              <h3 class="text" data-id="order-detail-notValidated">
                {{ $t('page.detailOrder.notValidated') }}
              </h3>

              <mp-button
                dataId="order-detail-confirm"
                class="action"
                format="alert"
                :loading="loadConfirm"
                :disabled="loadConfirm"
                :text="$t('page.detailOrder.confirm')"
                @click="confirm()"
              />
            </v-col>
          </v-row>

          <!-- status -->
          <v-row
            no-gutters
            class="status-outer-wrapper"
            v-if="
              order &&
                isAuthorized('READ_ORDER_STATUS', {
                  storeId: order.storeId,
                  retailerId: order.retailerId,
                })
            "
          >
            <v-col cols="12">
              <mp-status
                :baseDeliveryStatus="order.DeliveryStatus || []"
                :showValidDelievry="displayValidDelivery"
                :storeId="order.storeId"
                :deliveryId="order && order.Delivery ? order.Delivery.id : '-1'"
                :isReturn="isReturn"
                :showReplanningButton="false"
              />
            </v-col>
          </v-row>

          <!-- packages and products -->
          <v-row
            no-gutters
            class="component-wrapper"
            v-if="
              order &&
                isAuthorized('READ_ORDER_PRODUCTS', {
                  storeId: order.storeId,
                  retailerId: order.retailerId,
                })
            "
          >
            <v-col cols="12">
              <mp-packages-and-products
                :orderId="order.id"
                :packages="order.packages"
                :deliveryId="order.Delivery ? order.Delivery.id : '0'"
                :shouldDisplayPackageFollowingBtn="order.parcels && Boolean(order.parcels.length)"
                :showProductReturn="
                  isAuthorized('CREATE_PRODUCTS_RETURN', {
                    storeId: order.storeId,
                    retailerId: order.retailerId,
                  }) && showProductReturnButton
                "
              />
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col cols="12" md="4">
              <!-- carrier contact -->
              <v-row
                no-gutters
                class="component-wrapper"
                v-if="
                  order &&
                    order.Delivery &&
                    isAuthorized('READ_ORDER_CONTACT_CARRIER', {
                      storeId: order.storeId,
                      retailerId: order.retailerId,
                    })
                "
              >
                <v-col cols="12">
                  <mp-contact
                    class="contact-component"
                    id="order-detail-contacts"
                    :title="$t('page.detailOrder.retailer.contact')"
                    :hasShowedInformation="false"
                    :contacts="order.Delivery.carrier ? [order.Delivery.carrier.contact] : []"
                    hasAction
                    :withLanguage="true"
                    :withTimezone="true"
                    :actionIsCentered="true"
                  >
                    <template #action>
                      <mp-button
                        class="action"
                        :text="$t('action.follow.order')"
                        format="primary"
                        dataId="order-detail-contacts-followPage"
                        :disabled="!order"
                        @click="goToTrackingPage()"
                      />
                      <mp-button
                        v-if="
                          order &&
                            order.Delivery &&
                            order.Delivery.carrier &&
                            order.Delivery.carrier.claimUrl &&
                            isAuthorized('CREATE_ORDER_CLAIM', {
                              storeId: order.storeId,
                              retailerId: order.retailerId,
                            })
                        "
                        class="action mt-2"
                        :text="$t('page.detailOrder.carrier.claimUrl')"
                        format="primary"
                        dataId="order-detail-contacts-claim"
                        :href="order.Delivery.carrier.claimUrl"
                      />
                    </template>
                  </mp-contact>
                </v-col>
              </v-row>

              <!-- client contact -->
              <v-row
                no-gutters
                class="component-wrapper"
                v-if="order && order.delivery && isAuthorized('READ_ORDER_PERSONAL_DATA')"
              >
                <v-col cols="12">
                  <mp-contact
                    :contacts="[order.delivery.contact]"
                    :title="$t('page.detailOrder.client.contact')"
                    :hasShowedInformation="false"
                    :durationTime="10000"
                    @showInformation="getContactData()"
                    id="order-detail-light-contact"
                    :withLanguage="true"
                    :showMainContact="true"
                    :isCustomerContact="true"
                    :withTimezone="true"
                  />
                </v-col>
              </v-row>

              <!-- itinerary -->
              <v-row
                no-gutters
                class="component-wrapper"
                v-if="
                  order &&
                    isAuthorized('READ_ORDER_ROUTE', {
                      storeId: order.storeId,
                      retailerId: order.retailerId,
                    })
                "
              >
                <v-col cols="12">
                  <mp-itinerary
                    :order="order"
                    :hasReturn="hasReturn"
                    :showPersonalData="
                      order &&
                        isAuthorized('READ_ORDER_PERSONAL_DATA', {
                          storeId: order.storeId,
                          retailerId: order.retailerId,
                        })
                    "
                  />
                </v-col>
              </v-row>

              <!-- delivery -->
              <v-row
                no-gutters
                class="component-wrapper"
                v-if="
                  order &&
                    isAuthorized('READ_ORDER_DELIVERY', {
                      storeId: order.storeId,
                      retailerId: order.retailerId,
                    }) &&
                    order.Delivery
                "
              >
                <v-col cols="12">
                  <mp-delivery
                    :order="order"
                    :isDownloadAuthorize="
                      order &&
                        isAuthorized('DOWNLOAD_DELIVERY_SLIP', {
                          storeId: order.storeId,
                          retailerId: order.retailerId,
                        }) &&
                        isAuthorized('READ_ORDER_PERSONAL_DATA')
                    "
                  />
                </v-col>
              </v-row>

              <!-- carrier sought -->
              <v-row
                no-gutters
                class="component-wrapper"
                v-if="
                  order &&
                    isAuthorized('READ_ORDER_CARRIERS', {
                      storeId: order.storeId,
                      retailerId: order.retailerId,
                    })
                "
              >
                <v-col cols="12">
                  <mp-carrier-sought
                    :orderId="orderId"
                    :quoteId="order.Delivery ? order.Delivery.quoteId : null"
                  />
                </v-col>
              </v-row>

              <!-- detail -->
              <v-row
                no-gutters
                class="component-wrapper"
                v-if="
                  order &&
                    isAuthorized('READ_ORDER_DETAIL', {
                      storeId: order.storeId,
                      retailerId: order.retailerId,
                    })
                "
              >
                <v-col cols="12">
                  <mp-detail
                    :order="order"
                    :retailer="retailer"
                    :store="store"
                    :initialOrder="initialOrder"
                  />
                </v-col>
              </v-row>

              <!-- billing -->
              <v-row
                no-gutters
                class="component-wrapper"
                v-if="
                  order &&
                    isAuthorized('READ_ORDER_BILLING', {
                      storeId: order.storeId,
                      retailerId: order.retailerId,
                    })
                "
              >
                <v-col cols="12">
                  <mp-billing
                    :delivery="order.Delivery"
                    :isDownloadBillingAuthorize="
                      order &&
                        isAuthorized('DOWNLOAD_ORDER_BILLING', {
                          storeId: order.storeId,
                          retailerId: order.retailerId,
                        })
                    "
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col class="right-column" cols="12" md="8">
              <!-- alerts -->
              <v-row no-gutters class="component-wrapper" v-if="isAuthorized('LIST_ALERTS')">
                <v-col cols="12">
                  <mp-order-alerts :orderId="order.id" />
                </v-col>
              </v-row>
              <!-- product returns -->
              <v-row
                no-gutters
                class="component-wrapper"
                v-if="
                  order &&
                    isAuthorized('READ_PRODUCT_RETURNS', {
                      storeId: order.storeId,
                      retailerId: order.retailerId,
                    }) &&
                    returns &&
                    returns.length &&
                    !isReturn
                "
              >
                <v-col cols="12">
                  <mp-product-returns
                    v-if="hasReturn"
                    :key="`product-returns-${componentsKey}`"
                    :returns="returns"
                  />
                </v-col>
              </v-row>

              <!-- statut order of delivery -->
              <v-row
                no-gutters
                class="component-wrapper"
                v-if="
                  order &&
                    isAuthorized('READ_ORDER_DELIVERY_STATUS', {
                      storeId: order.storeId,
                      retailerId: order.retailerId,
                    })
                "
              >
                <v-col cols="12">
                  <mp-order-status :orderStatus="order.OrderStatus" />
                </v-col>
              </v-row>

              <!-- notification -->
              <v-row
                no-gutters
                class="component-wrapper"
                v-if="
                  order &&
                    isAuthorized('READ_ORDER_NOTIFICATIONS', {
                      storeId: order.storeId,
                      retailerId: order.retailerId,
                    })
                "
              >
                <v-col cols="12">
                  <mp-notification :key="`notification-${componentsKey}`" :orderId="order.id" />
                </v-col>
              </v-row>

              <!-- Historique -->
              <v-row
                no-gutters
                class="component-wrapper"
                v-if="
                  order &&
                    isAuthorized('READ_ORDER_HISTORY', {
                      storeId: order.storeId,
                      retailerId: order.retailerId,
                    })
                "
              >
                <v-col cols="12">
                  <mp-history :orderId="order.id" />
                </v-col>
              </v-row>

              <v-row
                no-gutters
                class="component-wrapper"
                v-if="
                  order &&
                    isAuthorized('READ_ORDERS_DOCUMENT', {
                      storeId: order.storeId,
                      retailerId: order.retailerId,
                    })
                "
              >
                <v-col cols="12">
                  <mp-documents :order="order" />
                </v-col>
              </v-row>

              <!-- Note -->
              <v-row
                no-gutters
                class="component-wrapper"
                v-if="
                  order &&
                    isAuthorized('READ_DELIVERY_SCORE', {
                      storeId: order.storeId,
                      retailerId: order.retailerId,
                    })
                "
              >
                <v-col cols="12">
                  <mp-score :score="score" />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>

        <v-col
          cols="1"
          class="action-memo"
          v-if="
            order &&
              isAuthorized('LIST_ORDER_MEMOS', {
                storeId: order.storeId,
                retailerId: order.retailerId,
              })
          "
        >
          <v-btn class="memo" fixed @click="showMemo = true" data-id="order-detail-memo">
            <v-icon>mdi-comment-text-multiple</v-icon>
            <span class="regular14 mt-3" v-if="comments.length">{{ comments.length }}</span>
            <h4>{{ $t('page.detailOrder.memo.title') }}</h4>
          </v-btn>
        </v-col>
      </v-row>
    </template>

    <v-row no-gutters v-else class="phone">
      <v-col
        cols="12"
        class="status-display"
        v-if="
          !order.Delivery &&
            order &&
            isAuthorized('READ_ORDER_STATUS', {
              storeId: order.storeId,
              retailerId: order.retailerId,
            })
        "
      >
        <v-row no-gutters>
          <v-col cols="10" offset="1">
            <h2 class="current-status" data-id="order-detail-status">
              {{ $t(`technical.status.order.${order.status}`) }}
            </h2>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12">
        <!-- header -->
        <v-row no-gutters class="header-outer-wrapper" v-if="cancelled">
          <v-col cols="12" class="header-wrapper">
            <mp-button
              v-if="cancelled && displayUpdateOrder"
              format="secondary"
              :text="$t('action.continue')"
              icon="play"
              dataId="order-detail-continue"
              :to="getEditRoute()"
              @click="resetStore = false"
              :disabled="!canEdit"
            />
          </v-col>
        </v-row>

        <!-- status -->
        <v-row no-gutters>
          <v-col cols="12">
            <mp-status
              :baseDeliveryStatus="order.DeliveryStatus || []"
              :showValidDelievry="displayValidDelivery"
              :showTimeline="
                order &&
                  isAuthorized('READ_ORDER_STATUS', {
                    storeId: order.storeId,
                    retailerId: order.retailerId,
                  })
              "
              :showRetry="
                order &&
                  isAuthorized('RETRY_ORDERS', {
                    storeId: order.storeId,
                    retailerId: order.retailerId,
                  }) &&
                  canRetry
              "
              :showManualQuote="
                showManualQuote &&
                  order &&
                  isAuthorized('CREATE_MANUAL_QUOTE', {
                    storeId: order.storeId,
                    retailerId: order.retailerId,
                  })
              "
              @valid-delivery="showConfirmValidDelivery = true"
              @retry="retry()"
              @open-manual-quote="showDialogManualQuote = true"
              :storeId="order.storeId"
              :deliveryId="order.Delivery ? order.Delivery.id : '0'"
              :isReturn="isReturn"
              :showReplanningButton="
                Boolean(order) &&
                  Boolean(order.Delivery) &&
                  !Boolean(showManualQuote) &&
                  isAuthorized('CREATE_DELIVERY_APPOINTMENT', {
                    storeId: order.storeId,
                    retailerId: order.retailerId,
                  })
              "
              @showDialogAppointmentCreation="showDialogAppointmentCreation = true"
            />
            <v-row no-gutters v-if="showErrorButton">
              <v-col cols="12" class="d-flex justify-center mt-2 mb-4">
                <mp-button
                  format="secondary"
                  icon="alert-decagram"
                  small
                  :text="$t('page.detailOrder.errors.btn')"
                  dataId="order-detail-correct-detail"
                  @click="showErrorDialog = true"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row no-gutters v-if="displayConfirmOrder" class="mb-2">
          <v-col cols="12" class="d-flex justify-center">
            <mp-button
              dataId="order-detail-confirm"
              format="alert"
              :text="$t('page.detailOrder.confirm')"
              :loading="loadConfirm"
              :disabled="loadConfirm"
              @click="confirm()"
            />
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col cols="12" class="collapse-wrapper">
            <v-expansion-panels flat>
              <!-- alerts -->
              <mp-collapse
                ref="alerts"
                @click="scrollTo('alerts')"
                :title="$t('page.detailOrder.alerts.title')"
                v-if="isAuthorized('LIST_ALERTS')"
                typographyClass="medium16"
                dataId="order-detail-collapse-alerts"
              >
                <mp-order-alerts :orderId="order.id" />
              </mp-collapse>

              <!-- carrier contact -->
              <mp-collapse
                ref="contact"
                @click="scrollTo('contact')"
                :title="$t('page.detailOrder.retailer.contact')"
                v-if="
                  order &&
                    order.Delivery &&
                    order.Delivery.carrier &&
                    isAuthorized('READ_ORDER_CONTACT_CARRIER', {
                      storeId: order.storeId,
                      retailerId: order.retailerId,
                    })
                "
                typographyClass="medium16"
                dataId="order-detail-collapse-contacts"
              >
                <mp-contact
                  id="order-detail-collapse-contacts"
                  :title="$t('page.detailOrder.retailer.contact')"
                  :hasShowedInformation="false"
                  :contacts="order.Delivery.carrier.contact ? [order.Delivery.carrier.contact] : []"
                  hasAction
                  :withLanguage="true"
                  :withTimezone="true"
                >
                  <template #action>
                    <v-row no-gutters justify="center">
                      <mp-button
                        class="mb-2"
                        :text="$t('action.follow.order')"
                        format="secondary"
                        dataId="order-detail-retailer-followUp"
                        :disabled="!order"
                        @click="goToTrackingPage()"
                        :small="$vuetify.breakpoint.xsOnly"
                        v-if="
                          order &&
                            isAuthorized('READ_ORDER_CARRIERS', {
                              storeId: order.storeId,
                              retailerId: order.retailerId,
                            })
                        "
                      />
                      <mp-button
                        v-if="
                          order &&
                            isAuthorized('CREATE_ORDER_CLAIM', {
                              storeId: order.storeId,
                              retailerId: order.retailerId,
                            }) &&
                            order &&
                            order.Delivery &&
                            order.Delivery.carrier &&
                            order.Delivery.carrier.claimUrl
                        "
                        :text="$t('page.detailOrder.carrier.claimUrl')"
                        format="secondary"
                        dataId="order-detail-retailer-followUp"
                        :href="order.Delivery.carrier.claimUrl"
                        :small="$vuetify.breakpoint.xsOnly"
                      />
                    </v-row>
                  </template>
                </mp-contact>
              </mp-collapse>

              <!-- client contact -->
              <mp-collapse
                ref="contact"
                @click="scrollTo('contact')"
                :title="$t('page.detailOrder.client.contact')"
                v-if="order && order.delivery && isAuthorized('READ_ORDER_PERSONAL_DATA')"
                typographyClass="medium16"
                dataId="order-detail-collapse-contacts"
              >
                <mp-light-contact
                  class="contact-component"
                  id="order-detail-collapse-light-contact"
                  :title="$t('page.detailOrder.client.contact')"
                  :orderId="order.id"
                >
                </mp-light-contact>
              </mp-collapse>

              <!-- productReturns -->
              <mp-collapse
                @click="scrollTo('product-returns')"
                typographyClass="medium16"
                :title="$t('page.detailOrder.productReturns.title', { count: returns.length })"
                dataId="order-detail-collapse-product-returns"
                v-if="
                  order &&
                    isAuthorized('READ_PRODUCT_RETURNS', {
                      storeId: order.storeId,
                      retailerId: order.retailerId,
                    }) &&
                    returns &&
                    returns.length &&
                    !isReturn
                "
              >
                <mp-product-returns
                  v-if="hasReturn"
                  :key="`product-returns-${componentsKey}`"
                  :returns="returns"
                />
              </mp-collapse>

              <!-- itinerary -->
              <mp-collapse
                ref="itinerary"
                @click="scrollTo('itinerary')"
                typographyClass="medium16"
                :title="$t('page.detailOrder.itinerary.title')"
                dataId="order-detail-collapse-itinerary"
                v-if="
                  order &&
                    isAuthorized('READ_ORDER_ROUTE', {
                      storeId: order.storeId,
                      retailerId: order.retailerId,
                    })
                "
              >
                <mp-itinerary
                  :order="order"
                  :showPersonalData="
                    order &&
                      isAuthorized('READ_ORDER_PERSONAL_DATA', {
                        storeId: order.storeId,
                        retailerId: order.retailerId,
                      })
                  "
                  :hasReturn="hasReturn"
                />
              </mp-collapse>

              <!-- delivery -->
              <mp-collapse
                ref="delivery"
                @click="scrollTo('delivery')"
                typographyClass="medium16"
                :title="$t('page.detailOrder.delivery.title')"
                dataId="order-detail-collapse-delivery"
                v-if="
                  order.Delivery &&
                    order &&
                    isAuthorized('READ_ORDER_DELIVERY', {
                      storeId: order.storeId,
                      retailerId: order.retailerId,
                    })
                "
              >
                <mp-delivery
                  :order="order"
                  :isDownloadAuthorize="
                    order &&
                      isAuthorized('DOWNLOAD_DELIVERY_SLIP', {
                        storeId: order.storeId,
                        retailerId: order.retailerId,
                      }) &&
                      isAuthorized('READ_ORDER_PERSONAL_DATA')
                  "
                />
              </mp-collapse>

              <!-- carrier sought -->
              <mp-collapse
                ref="carrier-sought"
                @click="scrollTo('carrier-sought')"
                typographyClass="medium16"
                :title="$t('page.detailOrder.carrierSought.title')"
                dataId="order-detail-collapse-carrierSought"
                v-if="
                  order &&
                    isAuthorized('READ_ORDER_CARRIERS', {
                      storeId: order.storeId,
                      retailerId: order.retailerId,
                    })
                "
              >
                <mp-carrier-sought
                  :orderId="orderId"
                  :quoteId="order.Delivery ? order.Delivery.quoteId : null"
                />
              </mp-collapse>

              <!-- Detail -->
              <mp-collapse
                ref="detail"
                @click="scrollTo('detail')"
                typographyClass="medium16"
                :title="$t('page.detailOrder.detail.title')"
                dataId="order-detail-collapse-detail"
                v-if="
                  order &&
                    isAuthorized('READ_ORDER_DETAIL', {
                      storeId: order.storeId,
                      retailerId: order.retailerId,
                    })
                "
              >
                <mp-detail
                  :order="order"
                  :retailer="retailer"
                  :store="store"
                  :initialOrder="initialOrder"
                />
              </mp-collapse>

              <!-- packages and products -->
              <mp-collapse
                ref="packages-and-products"
                @click="scrollTo('packages-and-products')"
                typographyClass="medium16"
                :title="$t('page.detailOrder.packagesAndProducts.title')"
                dataId="order-detail-collapse-packagesAndProducts"
                v-if="
                  order &&
                    isAuthorized('READ_ORDER_PRODUCTS', {
                      storeId: order.storeId,
                      retailerId: order.retailerId,
                    })
                "
              >
                <mp-packages-and-products
                  :orderId="order.id"
                  :packages="order.packages"
                  :deliveryId="order.Delivery ? order.Delivery.id : '0'"
                  :shouldDisplayPackageFollowingBtn="order.parcels && Boolean(order.parcels.length)"
                  :showProductReturn="
                    isAuthorized('CREATE_PRODUCTS_RETURN', {
                      storeId: order.storeId,
                      retailerId: order.retailerId,
                    }) && showProductReturnButton
                  "
                />
              </mp-collapse>

              <!-- statut order of delivery -->
              <mp-collapse
                ref="order-status"
                @click="scrollTo('order-status')"
                typographyClass="medium16"
                :title="$t('page.detailOrder.deliveryStatus.title')"
                dataId="order-detail-collapse-orderStatus"
                v-if="
                  order &&
                    isAuthorized('READ_ORDER_DELIVERY_STATUS', {
                      storeId: order.storeId,
                      retailerId: order.retailerId,
                    })
                "
              >
                <mp-order-status :orderStatus="order.OrderStatus" />
              </mp-collapse>

              <!-- billings -->
              <mp-collapse
                ref="billings"
                @click="scrollTo('billings')"
                typographyClass="medium16"
                :title="$t('page.detailOrder.billing.title')"
                dataId="order-detail-collapse-billings"
                v-if="
                  order &&
                    isAuthorized('READ_ORDER_BILLING', {
                      storeId: order.storeId,
                      retailerId: order.retailerId,
                    })
                "
              >
                <mp-billing
                  :delivery="order.Delivery"
                  :isDownloadBillingAuthorize="
                    order &&
                      isAuthorized('DOWNLOAD_ORDER_BILLING', {
                        storeId: order.storeId,
                        retailerId: order.retailerId,
                      })
                  "
                />
              </mp-collapse>

              <!-- notification -->
              <mp-collapse
                ref="notification"
                @click="scrollTo('notification')"
                typographyClass="medium16"
                :title="$t('page.detailOrder.notification.title')"
                dataId="order-detail-collapse-notifications"
                v-if="
                  order &&
                    isAuthorized('READ_ORDER_NOTIFICATIONS', {
                      storeId: order.storeId,
                      retailerId: order.retailerId,
                    })
                "
              >
                <mp-notification :key="`notification-${componentsKey}`" :orderId="order.id" />
              </mp-collapse>

              <!-- Historique -->
              <mp-collapse
                ref="history"
                @click="scrollTo('history')"
                typographyClass="medium16"
                :title="$t('page.detailOrder.history.title')"
                dataId="order-detail-collapse-history"
                v-if="
                  order &&
                    isAuthorized('READ_ORDER_HISTORY', {
                      storeId: order.storeId,
                      retailerId: order.retailerId,
                    })
                "
              >
                <mp-history :orderId="order.id" />
              </mp-collapse>

              <!-- Documents -->
              <mp-collapse
                ref="documents"
                @click="scrollTo('documents')"
                typographyClass="medium16"
                :title="$t('page.detailOrder.documents.title')"
                dataId="order-detail-collapse-documents"
                v-if="
                  order &&
                    isAuthorized('READ_ORDERS_DOCUMENT', {
                      storeId: order.storeId,
                      retailerId: order.retailerId,
                    })
                "
              >
                <mp-documents :order="order" />
              </mp-collapse>

              <!-- Note -->
              <mp-collapse
                ref="score"
                @click="scrollTo('score')"
                typographyClass="medium16"
                :title="$t('page.detailOrder.score.title')"
                dataId="order-detail-score"
                v-if="
                  order &&
                    isAuthorized('READ_DELIVERY_SCORE', {
                      storeId: order.storeId,
                      retailerId: order.retailerId,
                    })
                "
              >
                <mp-score :score="score" />
              </mp-collapse>
            </v-expansion-panels>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <div v-if="showMemo">
      <mp-memo
        :showDialog="showMemo"
        :orderId="orderId"
        :externalOrderId="order.externalOrderId"
        @hide="showMemo = false"
        :isAddMemoAuthorize="
          order &&
            isAuthorized('CREATE_ORDER_MEMOS', {
              storeId: order.storeId,
              retailerId: order.retailerId,
            })
        "
        :comments="comments"
      />
    </div>

    <div v-if="showDialogManualQuote">
      <order-detail-manual-quote
        :showDialog="showDialogManualQuote"
        @hide="showDialogManualQuote = false"
        @save="createQuote()"
      />
    </div>

    <div v-if="showDialogAppointmentCreation">
      <order-detail-appointment
        :showDialog="showDialogAppointmentCreation"
        @hide="showDialogAppointmentCreation = false"
        dataId="order-detail-appointement"
        @saveAppointment="createAppointment()"
      />
    </div>

    <div v-if="showConfirmValidDelivery">
      <mp-confirm-valid-delivery
        :showDialog="showConfirmValidDelivery"
        @hide="showConfirmValidDelivery = false"
        @submit="validDelivery()"
      />
    </div>

    <div v-if="showUpdateDelivery">
      <mp-update-delivery
        :showDialog="showUpdateDelivery"
        @hide="showUpdateDelivery = false"
        :deliveryStatus="order.DeliveryStatus"
        :deliveryId="order.Delivery.id"
        :parcels="order.parcels"
        @submit="closeUpdateDelivery()"
      />
    </div>

    <mp-dialog-confirmation
      v-if="showCancelDialog"
      dataId="order-detail-delete"
      :textContent="$t('page.detailOrder.delete')"
      @close="showCancelDialog = false"
      @submit="cancelOrder()"
      color="error"
      :header="{
        icon: 'mdi-exclamation-thick',
        isColorBackground: false,
        iconClose: 'mdi-close',
      }"
      :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
      :btnValidation="{
        text: $t('action.confirm.base'),
        format: 'error',
      }"
      :btnToColumn="$vuetify.breakpoint.xsOnly"
    />

    <v-btn
      class="fab-mobile"
      bottom
      right
      fixed
      fab
      @click="showMemo = true"
      v-if="
        $vuetify.breakpoint.xsOnly &&
          order &&
          isAuthorized('LIST_ORDER_MEMOS', { storeId: order.storeId, retailerId: order.retailerId })
      "
      data-id="order-detail-memo"
    >
      <v-icon>mdi-comment-text-multiple</v-icon>
      <span class="regular14 pl-1" v-if="comments.length">{{ comments.length }}</span>
    </v-btn>

    <div v-if="displayFullSize" class="actions-wrapper-mobile">
      <mp-button
        v-if="order.Delivery && isAuthorized('UPDATE_DELIVERY_STATUS')"
        :text="$t('action.update.base')"
        format="sticky"
        stickyColor="yellow"
        dataId="order-detail-update"
        @click="showUpdateDelivery = true"
        tile
        class="action-update"
      />

      <mp-button
        v-if="!cancelled && displayCancelOrder && isAuthorized('CANCEL_ORDERS')"
        :text="$t('action.cancel.base')"
        icon="close-circle"
        format="sticky"
        stickyColor="yellow"
        dataId="order-detail-cancel"
        class="action-cancel"
        @click="showCancelDialog = true"
        :disabled="!canCancel"
        tile
      />

      <mp-button
        v-if="!cancelled && displayUpdateOrder && isAuthorized('EDIT_ORDERS')"
        tile
        format="sticky"
        stickyColor="yellow"
        :text="$t('action.modify.base')"
        icon="pencil"
        dataId="order-detail-modify"
        class="action-modify"
        :to="getEditRoute()"
        @click="resetStore = false"
        :disabled="!canEdit"
      />
    </div>

    <mp-dialog-confirmation
      v-if="showCloseDeliveryModal"
      :dataId="`modal-close-delivery`"
      :textContent="$t('validation.confirmation.closeOrderDelivery')"
      @close="showCloseDeliveryModal = false"
      @submit="closeOrderDelivery()"
      color="error"
      :header="{
        icon: 'mdi-exclamation-thick',
        isColorBackground: false,
        iconClose: 'mdi-close',
      }"
      :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
      :btnValidation="{ text: $t('action.close.delivery'), format: 'error' }"
      :btnToColumn="$vuetify.breakpoint.xsOnly"
    />

    <mp-dialog-confirmation
      v-if="showErrorDialog"
      dataId="modal-close-delivery"
      classWrapper="dialog-errors-order-detail"
      :textContent="$t('validation.confirmation.closeOrderDelivery')"
      @close="resetOrderStore()"
      @submit="goToEditErrors()"
      color="primary"
      :header="{
        icon: $vuetify.breakpoint.smAndUp ? 'mdi-alert-decagram' : undefined,
        isColorBackground: true,
        iconClose: 'mdi-close',
        text: $t('page.detailOrder.errors.title', { number: totalError, count: totalError }),
        textPolice: $vuetify.breakpoint.smAndUp ? 'h4' : 'regular14',
      }"
      :btnCancel="{
        text: $t('action.cancel.base'),
        format: $vuetify.breakpoint.xsOnly ? 'sticky' : 'link',
        linkColor: $vuetify.breakpoint.xsOnly ? undefined : 'black',
        stickyColor: $vuetify.breakpoint.xsOnly ? 'yellow' : undefined,
      }"
      :btnValidation="{
        text: $t('action.correct.base'),
        format: $vuetify.breakpoint.xsOnly ? 'sticky' : 'success',
        stickyColor: $vuetify.breakpoint.xsOnly ? 'yellow' : undefined,
        disabled: !Boolean(totalError),
      }"
      :fullscreen="$vuetify.breakpoint.xsOnly"
    >
      <template #content>
        <v-row no-gutters>
          <v-col cols="12">
            <v-row no-gutters>
              <v-col cols="10" offset="1" class="mt-7" height="100%">
                <mp-select
                  class="mb-4"
                  v-if="availableCheckouts && availableCheckouts.length"
                  :label="`${$t('page.order.common.checkout')} *`"
                  v-model="selectedCheckout"
                  :errors="[]"
                  :isDirty="false"
                  :items="availableCheckouts"
                  itemText="name"
                  itemValue="id"
                  dataId="modal-close-delivery-checkout"
                  :attach="`#modal-close-delivery-checkout`"
                  :dropdownId="`modal-close-delivery-checkout`"
                  returnObject
                  @change="setOrderError($event)"
                />

                <div v-if="totalError">
                  <div
                    v-for="(step, stepIndex) in orderErrors"
                    :key="`dialog-errors-order-detail-steps-${stepIndex}`"
                    :class="`${step.length ? 'dialog-error-outer-wrapper' : ''}`"
                  >
                    <div
                      v-for="(error, errorIndex) in step"
                      :key="`dialog-errors-order-detail-steps-${stepIndex}-errors-${errorIndex}`"
                      :class="errorIndex < step.length - 1 ? 'dialog-error-wrapper' : ''"
                    >
                      <div :class="`d-flex align-center${errorIndex > 0 ? ' mt-7' : ''}`">
                        <v-icon size="1.6rem" class="error-color pr-2">mdi-alert-decagram</v-icon>
                        <span class="h4 main-color">
                          {{ $t(error.error) }}
                        </span>
                      </div>

                      <div class="mt-2 regular14 main-lighten-52 mb-7">
                        <span class="regular14 main-lighten-28"> {{ $t(error.key) }} </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-else class="d-flex text-center justify-center align-center main-color mt-6">
                  <h3>{{ $t(`page.order.common.${selectedCheckout ? 'noError' : 'noFlux'}`) }}</h3>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </template>
    </mp-dialog-confirmation>
  </div>
</template>

<script lang="ts">
import { AVAILABLE_LEVEL_SERVICES, DELIVERY_STATUS, ORDER_STATUS } from '@/constants/shared'
import mixins from 'vue-typed-mixins'

import contentHeader from '@/components/contentHeader/contentHeader.vue'
import mpBreadcrumb from '@/components/breadcrumb/breadcrumb.vue'
import mpStatus from '@/views/Order/Detail/Status/status.vue'
import mpOrderStatus from '@/views/Order/Detail/orderStatus/orderStatus.vue'
import mpItinerary from '@/views/Order/Detail/Itinerary/itinerary.vue'
import mpPackagesAndProducts from '@/components/packagesAndProducts/packagesAndProducts.vue'
import mpDelivery from '@/views/Order/Detail/Delivery/delivery.vue'
import mpCarrierSought from '@/views/Order/Detail/carrierSought/carrierSought.vue'
import mpDetail from '@/views/Order/Detail/detail/detail.vue'
import mpNotification from '@/components/notification/notification.vue'
import mpBilling from '@/views/Order/Detail/billing/billing.vue'
import mpMemo from '@/views/Order/Detail/memo/memo.vue'
import mpLightContact from '@/components/lightContact/lightContact.vue'
import mpContact from '@/components/contact/contact.vue'
import mpHistory from '@/views/Order/Detail/history/history.vue'
import mpConfirmValidDelivery from '@/views/Order/Detail/modals/confirmValidDelivery.vue'
import mpProductReturns from '@/views/Order/Detail/productReturns/productReturns.vue'
import mpDocuments from '@/views/Order/Detail/documents/documents.vue'
import orderDetailManualQuote from '@/views/Order/Detail/modals/manualQuote/manualQuote.vue'
import mpScore from '@/components/score/score.vue'
import mpUpdateDelivery from '@/views/Order/Detail/updateDelivery/updateDelivery.vue'
import orderDetailAppointment from '@/views/Order/Detail/modals/appointment/appointment.vue'
import mpOrderAlerts from '@/views/Order/Detail/alerts/alerts.vue'

import { mapGetters } from 'vuex'

import OrderService from '@/services/order/OrderService'
import DeliveryService from '@/services/delivery/DeliveryService'

import { ROUTES, CONTINUE_DELIVERY_STATUS } from '@/constants'

import { SET_HEADER_DATA, SET_HEADER_TITLE } from '@/store/mutation-types'
import { dateHelper, dateHelperGetTimezonedDate } from '@/helpers/dateHelper'

import CommentService from '@/services/comment/CommentService'

import { SnackBarType } from '@/store/types'
import {
  CommentEntity,
  DeliveryScore,
  OrderDetailCloseDelivery,
  OrderEntity,
  Filters,
  RulesKey,
  Checkout,
  defaultCheckoutFilled,
} from '@/types'

import { authorizationMixin } from '@/mixins'
import RetailerService from '@/services/retailer/RetailerService'
import StoreService from '@/services/store/StoreService'
import CreateOrderService from '@/services/createOrder/createOrderService'
import OrderEligibilityService from '@/services/orderEligibility/OrderEligibilityService'
import { wait } from '@/helpers/helper'
import orderSummary from '@/helpers/orderSummary'
import {
  ELIGILIBILITY_UNFILTERED,
  SET_IS_ERROR_MODE,
  SET_MISCELLANEOUS_CHECKOUT,
} from '@/store/modules/createOrder/mutations-types'
import AuthorizationService from '@/services/authorization/AuthorizationService'
import CheckoutsService from '@/services/checkouts/checkoutsService'

const forRule: RulesKey = 'READ_ORDER_DETAIL'

export default mixins(authorizationMixin).extend({
  name: 'mp-order-detail',
  components: {
    contentHeader,
    mpStatus,
    mpItinerary,
    mpPackagesAndProducts,
    mpDelivery,
    mpCarrierSought,
    mpDetail,
    mpNotification,
    mpBilling,
    mpMemo,
    mpBreadcrumb,
    mpContact,
    mpLightContact,
    mpOrderStatus,
    mpHistory,
    mpDocuments,
    mpConfirmValidDelivery,
    mpProductReturns,
    orderDetailManualQuote,
    orderDetailAppointment,
    mpScore,
    mpUpdateDelivery,
    mpOrderAlerts,
  },
  data: () => ({
    orderId: '',
    hasData: false,
    showMemo: false,
    showConfirmValidDelivery: false,
    cancelled: false,
    closed: false,
    order: null as OrderEntity | null,
    loadConfirm: false,
    loadRetry: false,
    componentsKey: 0,
    trackingPageURL: '',
    isReturn: false,
    returns: null as OrderEntity[] | null,
    initialOrder: null as { orderId: number; externalOrderId: string } | null,
    showDialogManualQuote: false,
    showDialogAppointmentCreation: false,
    hasReturn: false,
    comments: [] as CommentEntity[],
    score: null as DeliveryScore | null,
    showUpdateDelivery: false,
    showCloseDeliveryModal: false,
    showCancelDialog: false,
    showErrorButton: false,
    showErrorDialog: false,
    totalError: 0,
    retailer: null as Filters | null,
    store: null as Filters | null,
    orderErrors: null as {
      stepItinerary: any[]
      stepServices: any[]
      stepDelivery: any[]
      stepContact: any[]
      eligibility?: string[]
    } | null,
    ROUTES,
    resetStore: true,
    checkout: null as Checkout | null,
    availableCheckouts: [] as Checkout[],
    selectedCheckout: null as Checkout | null,
  }),
  computed: {
    ...mapGetters({
      headerTitle: 'getHeaderTitle',
      currentUser: 'auth/currentUser',
    }),
    showProductReturnButton(): boolean {
      return this.order?.status === ORDER_STATUS.DELIVERED && !this.isReturn
    },
    displayValidDelivery(): boolean {
      if (this.order && !this.order.Carrier) {
        return false
      }
      if (this.order && this.order.Delivery) {
        const now = dateHelperGetTimezonedDate().toISOString()
        const endDate = this.order.delivery.interval[0].end
        const { status } = this.order
        const forbiddenStatus = [
          ORDER_STATUS.DELIVERED,
          ORDER_STATUS.DELIVERY_UNCOMPLETED,
          ORDER_STATUS.CANCELLED,
        ]

        if (forbiddenStatus.includes(status) || !dateHelper.isSameOrAfter(now, endDate)) {
          return false
        }
      }
      return true
    },
    displayConfirmOrder(): boolean {
      if (!this.order) {
        return false
      }

      return (
        Boolean(this.order) &&
        this.order.OrderStatus[this.order.OrderStatus.length - 1].status ===
          ORDER_STATUS.QUOTE_TO_BE_CONFIRMED
      )
    },
    canCancel(): boolean {
      if (!this.order) {
        return false
      }

      const forbiddenStatus = [ORDER_STATUS.CANCELLED, ORDER_STATUS.DELIVERED]

      return Boolean(this.order) && !forbiddenStatus.includes(this.order.status)
    },
    canEdit(): boolean {
      if (!this.order) {
        return false
      }

      const forbiddenStatus = [ORDER_STATUS.DELIVERED]

      return Boolean(this.order) && !forbiddenStatus.includes(this.order.status)
    },
    canRetry(): boolean {
      if (!this.order) {
        return false
      }

      const retryStatus = [
        ORDER_STATUS.WITH_NO_CARRIER_ELIGIBLE,
        ORDER_STATUS.WITH_NO_QUOTE,
        ORDER_STATUS.WITH_NO_CARRIER_AVAILABLE,
        ORDER_STATUS.CREATED,
      ]

      if (
        this.order?.status === ORDER_STATUS.CREATED &&
        dateHelper.isAfter(
          dateHelperGetTimezonedDate(this.order?.updatedAt),
          dateHelper.substract(dateHelperGetTimezonedDate(), { minutes: 1 }),
        )
      ) {
        return false
      }

      return Boolean(this.order) && retryStatus.includes(this.order.status)
    },
    showManualQuote(): boolean {
      if (!this.order) {
        return false
      }

      const manualQuoteStatus = [
        ORDER_STATUS.WITH_NO_CARRIER_AVAILABLE,
        ORDER_STATUS.WITH_NO_CARRIER_ELIGIBLE,
        ORDER_STATUS.WITH_NO_QUOTE,
      ]

      return Boolean(this.order) && manualQuoteStatus.includes(this.order.status)
    },
    displayUpdateOrder(): boolean {
      return (
        !this.order?.Delivery ||
        (Boolean(this.order?.Delivery?.quoteId) &&
          (!this.order?.Quote?.eligibilitySpecifications ||
            this.order.Quote.eligibilitySpecifications.updateOrder))
      )
    },
    displayCancelOrder(): boolean {
      return (
        !this.order?.Delivery ||
        (Boolean(this.order?.Delivery?.quoteId) &&
          (!this.order?.Quote?.eligibilitySpecifications ||
            (this.order.Quote.eligibilitySpecifications.cancelOrder &&
              !this.order.Quote.eligibilitySpecifications.closeDelivery)))
      )
    },
    displayCloseDelivery(): boolean {
      return (
        Boolean(this.order?.Delivery?.quoteId) &&
        !this.order?.Quote?.eligibilitySpecifications?.cancelOrder &&
        this.order?.Quote?.eligibilitySpecifications?.closeDelivery
      )
    },
    displayFullSize(): boolean {
      return (
        this.$vuetify.breakpoint.xsOnly &&
        (Boolean(this.displayCancelOrder) || Boolean(this.displayUpdateOrder))
      )
    },
    showActionBtn(): boolean {
      return (
        (!this.cancelled && this.displayCancelOrder && this.isAuthorized('CANCEL_ORDERS')) ||
        (!this.cancelled && this.displayUpdateOrder && this.isAuthorized('EDIT_ORDERS')) ||
        (this.cancelled && this.displayUpdateOrder) ||
        (!this.closed && this.order?.Delivery && this.isAuthorized('UPDATE_DELIVERY_STATUS')) ||
        this.showErrorButton
      )
    },
  },
  async beforeMount() {
    try {
      if (isNaN(parseInt(this.$route.params.id, 10))) {
        this.$router.push({ name: ROUTES.notFound })
        return
      }

      this.orderId = this.$route.params.id
      this.order = await OrderService.get(parseInt(this.$route.params.id, 10))

      const { retailerId, storeId } = this.order

      // Manage error in new tdc
      this.getOrderError(retailerId, storeId)

      const [[retailer], [store]] = await Promise.all([
        RetailerService.getFilters({ id: this.order.retailerId, forRule }),
        StoreService.getFilters({ retailerId, id: storeId, forRule }),
      ])

      this.retailer = retailer
      this.store = store

      this.hasData = true

      if (this.order?.Delivery) {
        const {
          order: {
            Delivery: { status: currentDeliveryStatus },
          },
        } = this
        if (
          this.order.status === ORDER_STATUS.CANCELLED &&
          CONTINUE_DELIVERY_STATUS.includes(currentDeliveryStatus)
        ) {
          this.cancelled = true
        }
        if (currentDeliveryStatus === DELIVERY_STATUS.CLOSED) {
          this.closed = true
        }
        await this.getReturns()
      }
      this.$store.commit(
        SET_HEADER_TITLE,
        this.$t('page.detailOrder.title', { orderId: this.order.referenceNumber }),
      )
    } catch (e) {
      if (e.response?.status === 403) {
        this.$router.push({ name: ROUTES.noAccess })
        return
      }
      if (e.response?.status === 404) {
        this.$router.push({ name: ROUTES.notFound })
        return
      }
    }

    try {
      if (this.order?.Delivery && this.isAuthorized('READ_DELIVERY_SCORE')) {
        this.score = await DeliveryService.getScore(this.order.Delivery.id)
      }
    } catch (e) {
      this.score = null
    }

    this.comments = await CommentService.getAll({ orderId: parseInt(this.orderId, 10) })
  },
  beforeDestroy() {
    this.$store.commit(SET_HEADER_DATA, null)
  },
  destroyed() {
    if (this.resetStore) {
      this.resetOrderStore()
    }
  },
  methods: {
    async confirm() {
      this.loadConfirm = true
      const orderId = parseInt(this.$route.params.id, 10)
      await OrderService.confirm(orderId)
      setTimeout(async () => {
        this.order = await OrderService.get(orderId)
        this.loadConfirm = false
      }, 2500)
    },
    async retry() {
      this.loadRetry = true
      const orderId = parseInt(this.$route.params.id, 10)
      await OrderService.retry(orderId)
      setTimeout(async () => {
        this.order = await OrderService.get(orderId)
        this.loadRetry = false
      }, 2500)
    },
    createQuote() {
      const orderId = parseInt(this.$route.params.id, 10)
      setTimeout(async () => {
        try {
          this.order = await OrderService.get(orderId)
        } catch (e) {
          this.$store.dispatch('setSnackbar', {
            type: SnackBarType.ERROR,
            message: this.$t('messages.error'),
          })
        } finally {
          this.showDialogManualQuote = false
        }
      }, 1500)
    },
    async createAppointment() {
      this.showDialogAppointmentCreation = false

      await this.refreshOrder(3000)
    },
    getEditRoute() {
      return {
        name: ROUTES.editOrder,
        params: { id: this.order!.id.toString() },
        query: { stepNumber: '1' },
      }
    },
    scrollTo(refToScroll: string) {
      setTimeout(() => {
        ;(this.$refs[refToScroll] as any).$el.scrollIntoView()
      }, 300)
    },
    async cancelOrder() {
      try {
        const orderId = parseInt(this.$route.params.id, 10)
        await OrderService.cancel(orderId)
        this.cancelled = true
        this.order = await OrderService.get(orderId)
      } catch (error) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          timeout: 4000,
          clearable: true,
          message: this.$t('messages.orderCancelForbidden'),
        })
      } finally {
        this.showCancelDialog = false
      }
    },
    async closeOrderDelivery() {
      try {
        if (this.order?.Delivery) {
          const orderId = parseInt(this.$route.params.id, 10)
          const deliveryId = this.order.Delivery.id
          const params: OrderDetailCloseDelivery = {
            comment: '',
          }
          await DeliveryService.close(deliveryId, params)
          this.closed = true
          // Wait until update order status
          await wait(2000)
          this.order = await OrderService.get(orderId)
        }
      } catch (error) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          timeout: 4000,
          clearable: true,
          message: this.$t('messages.deliveryCloseForbidden'),
        })
      } finally {
        this.showCloseDeliveryModal = false
      }
    },
    async validDelivery() {
      try {
        const orderId = parseInt(this.$route.params.id, 10)
        await OrderService.validate(orderId)
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.SUCCESS,
          message: this.$t('messages.orderValidateConfirmed'),
        })
        this.order = await OrderService.get(orderId)
      } catch (error) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          timeout: 4000,
          clearable: true,
          message: this.$t('messages.error'),
        })
      } finally {
        this.showConfirmValidDelivery = false
      }
    },
    async goToTrackingPage() {
      const { order, trackingPageURL } = this

      if (!order || !order.Delivery) {
        return null
      }

      if (trackingPageURL) {
        return window.open(trackingPageURL)
      }

      const {
        Delivery: { id, trackingPageUrl: deliveryURL, accessToken, useMultiTracking },
        Quote,
      } = order

      if (useMultiTracking) {
        const multitrackingUrl = await DeliveryService.generateInternalMultiTrackingURL(
          accessToken,
          this.currentUser.language,
        )
        return window.open(multitrackingUrl)
      }

      const internalTrackingPage = await DeliveryService.generateInternalTrackingURL(
        accessToken,
        this.currentUser.language,
      )

      if (Quote?.eligibilitySpecifications && !Quote.eligibilitySpecifications.carrierTracking) {
        this.trackingPageURL = internalTrackingPage
        return window.open(internalTrackingPage)
      }

      if (deliveryURL) {
        this.trackingPageURL = deliveryURL
        return window.open(deliveryURL)
      }

      try {
        const url = await DeliveryService.getTrackingPageUrl(id)

        if (!url) {
          throw new Error()
        }

        this.trackingPageURL = url
        return window.open(this.trackingPageURL)
      } catch (e) {
        this.trackingPageURL = internalTrackingPage
        window.open(internalTrackingPage)
      }
    },
    refreshOrder(time = 1500) {
      setTimeout(async () => {
        this.order = await OrderService.get(parseInt(this.$route.params.id, 10))
      }, time)
    },
    async getReturns() {
      if (!this.order) {
        return false
      }
      const {
        order: { referenceNumber, retailerId, storeId, externalOrderId, services, id: orderId },
      } = this
      this.isReturn = services && services.includes(AVAILABLE_LEVEL_SERVICES.RETURN)
      const ordersList = await OrderService.getOrderList({
        referenceNumber: JSON.stringify([referenceNumber]),
        retailerId,
        storeId,
        light: false,
        includes: JSON.stringify(['carrier']),
      })
      let initialOrder: { orderId: number; externalOrderId: string } | null = null
      const returns = ordersList.reduce((returnsOrders: OrderEntity[], order: OrderEntity) => {
        if (!order.services) {
          return returnsOrders
        }
        if (!order.services.includes(AVAILABLE_LEVEL_SERVICES.RETURN)) {
          initialOrder = {
            orderId: order.id,
            externalOrderId: order.externalOrderId,
          }
          if (
            initialOrder?.externalOrderId === externalOrderId ||
            !services.includes(AVAILABLE_LEVEL_SERVICES.RETURN)
          ) {
            initialOrder = null
          }
          return returnsOrders
        }
        const isOrderExist = returnsOrders.find(({ id }) => id === order.id)
        if (!isOrderExist && order.id !== orderId) {
          returnsOrders.push(order)
        }
        return returnsOrders
      }, [])
      this.initialOrder = initialOrder
      this.returns = returns
      this.hasReturn = returns && returns.length > 0
    },
    closeUpdateDelivery() {
      this.showUpdateDelivery = false
      this.refreshOrder()
    },
    async getContactData() {
      this.order = await OrderService.get(this.order!.id, { personalData: true })
    },
    async getOrderError(retailerId: number, storeId: number) {
      const { permissions } = this.$store.getters['auth/currentUser']
      let retailerCheckouts: Checkout[] = []
      let storeCheckouts: Checkout[] = []

      this.order = await OrderService.get(this.order!.id, { personalData: true })

      if (AuthorizationService.isAllowed('LIST_CUSTOM_CHECKOUT', permissions)) {
        retailerCheckouts = await CheckoutsService.getAll({ retailerId })
        retailerCheckouts = retailerCheckouts.filter(localCheckout => localCheckout.published)

        storeCheckouts = await CheckoutsService.getAll({
          retailerId,
          storeId,
        })

        storeCheckouts = storeCheckouts.filter(localCheckout => localCheckout.published)
      }

      if (!retailerCheckouts.length && !storeCheckouts.length) {
        this.checkout = { ...defaultCheckoutFilled(), name: this.$t('common.default'), id: 0 }

        this.setOrderError(this.checkout)
        return
      }

      const { checkout, availableCheckouts } = OrderService.getCheckouts(
        retailerCheckouts,
        storeCheckouts,
      )

      if (!checkout && availableCheckouts?.length === 1 && !availableCheckouts[0].id) {
        this.checkout = availableCheckouts[0]
      }

      if (
        availableCheckouts?.length > 1 ||
        (availableCheckouts?.length === 1 && availableCheckouts[0].id)
      ) {
        this.availableCheckouts = availableCheckouts
        this.showErrorButton = true
      }

      if (checkout && !this.checkout) {
        this.checkout = checkout

        if (
          availableCheckouts?.length > 1 ||
          (availableCheckouts?.length === 1 && availableCheckouts[0].id)
        ) {
          this.availableCheckouts = [this.checkout, ...this.availableCheckouts]
          this.showErrorButton = true
        }
      }

      if (checkout) {
        this.setOrderError(checkout)
      }
    },
    async setOrderError(checkout: Checkout) {
      // Get Error && Eligibility
      await this.$store.dispatch('createOrder/setOrder', this.order)

      const [{ orderEligibilities }] = await Promise.all([
        OrderEligibilityService.getAll({
          retailerId: this.order!.retailerId,
          storeId: this.order!.storeId,
          exchangePlaceId:
            this.order!.picking.address.exchangePlaceId &&
            this.order!.picking.address.exchangePlaceId > 0
              ? this.order!.picking.address.exchangePlaceId
              : null,
          isActive: true,
        }),
      ])

      this.$store.commit(`createOrder/${ELIGILIBILITY_UNFILTERED}`, orderEligibilities)
      this.$store.commit(`createOrder/${SET_MISCELLANEOUS_CHECKOUT}`, checkout)

      await this.$store.dispatch(`createOrder/filterEligibleCarriers`, {
        calculateAllError: true,
      })

      const errors = CreateOrderService.getVuelidateError(checkout)

      this.orderErrors = errors

      this.totalError =
        errors.step1.length +
        errors.step2.length +
        errors.step3.length +
        errors.step4.length +
        errors.step5.length

      if (!this.availableCheckouts?.length) {
        this.showErrorButton = !!this.totalError
      }
    },
    goToEditErrors() {
      this.showErrorDialog = false
      this.$store.commit(`createOrder/${SET_IS_ERROR_MODE}`, true)
      this.resetStore = false
      this.$router.push({
        name: ROUTES.editOrder,
        params: { id: this.order!.id.toString() },
        query: { stepNumber: '1' },
      })
    },
    async resetOrderStore() {
      await Promise.all([
        this.$store.dispatch('createOrder/setOrder', null),
        this.$store.dispatch('createOrder/setEligibility', null),
        this.$store.dispatch('createOrder/setMiscellaneous', null),
      ])

      await this.$store.dispatch('createOrder/resetValidation')
      this.showErrorDialog = false
    },
    async copyOrderInfo() {
      if (!this?.order || !this.retailer || !this.store) {
        return
      }

      await this.getContactData()

      await navigator.clipboard.writeText(orderSummary(this.order, this.retailer, this.store))
    },
  },
})
</script>

<style lang="scss">
@import '../../../styles/mixins/macScrollbar';

#detail-order-wrapper {
  padding: 0;
  background-color: transparent !important;

  .main-header__actions {
    .actions-wrapper {
      @media #{map-get($display-breakpoints, 'sm-only')} {
        flex-direction: column-reverse;

        button {
          margin-right: 0 !important;
          margin-top: 1rem;
        }
      }

      @media #{map-get($display-breakpoints, 'md-only')} {
        flex-direction: column-reverse;

        button {
          margin-right: 0 !important;
          margin-top: 1rem;
        }
      }
    }
  }

  &.display-bottom-button {
    @media #{map-get($display-breakpoints, 'xs-only')} {
      max-height: calc(100vh - 5.4rem - 6rem);
      overflow-y: scroll;
    }
  }

  &.cancelled {
    @media #{map-get($display-breakpoints, 'xs-only')} {
      max-height: calc(100vh - 5.4rem);
    }
  }

  .order-detail__title {
    word-break: break-all;
  }

  .breadcrumbs-outer-wrapper {
    margin-top: 1.8rem;
  }

  .status-container__wrapper {
    min-height: 7.5rem;
    background-color: $main-lighten-80-color;
    display: flex;
    align-items: center;

    .status-label {
      display: flex;
      align-items: center;
    }

    .status-action {
      display: flex;
      justify-content: flex-end;
      flex-wrap: wrap;
    }
  }

  .status-display {
    min-height: 7.5rem;
    display: flex;
    align-items: center;
  }

  .header-wrapper {
    display: flex;
    align-items: center;

    .detail-title {
      word-break: break-all;
    }

    .btn-cancel {
      margin-left: 2rem;

      i {
        margin-right: 1rem;
      }
    }

    .btn-refresh {
      i {
        margin-right: 1rem;
      }
    }
  }

  .right-column {
    @media #{map-get($display-breakpoints, 'md-and-up')} {
      padding-left: 3.6rem;
    }
  }

  .info-outer-wrapper {
    margin-top: 1.7rem;
    margin-bottom: 3rem;

    .info-wrapper {
      display: flex;
      align-items: center;
      border: solid 0.1rem $alert-color;
      border-radius: 0.4rem;
      color: $alert-color;
      height: 7rem;

      i {
        color: $alert-color;
        margin-left: 2rem;
      }

      .text {
        margin-left: 1.2rem;
      }

      .action {
        margin-left: auto;
        margin-right: 1.4rem;
      }
    }
  }

  .status-outer-wrapper {
    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      margin-bottom: 5rem;
      margin-top: 4rem;
    }
  }

  .component-wrapper {
    .contact-component {
      .action-wrapper {
        display: flex;
        align-items: center !important;
      }

      .action {
        display: flex;
        width: fit-content;
        justify-content: center;
      }
    }
  }

  .action-memo {
    display: flex;
    justify-content: flex-end;
    position: absolute;
    right: 0;

    .memo {
      width: 7rem;
      height: 10.8rem;
      border-top-left-radius: 2rem;
      border-bottom-left-radius: 2rem;
      background-color: $main-color;
      color: $white;
      border: solid 0.2rem $white;
      box-shadow: 0 0.4rem 0.8rem rgba(0, 0, 0, 0.18);

      .v-btn__content {
        display: flex;
        flex-direction: column;
      }
    }
  }

  .phone {
    .header-outer-wrapper {
      min-height: 7.6rem;
      background-color: $white;
      .header-wrapper {
        justify-content: center;

        .action-modify {
          margin-left: 1.7rem;
        }
      }
    }

    .collapse-wrapper {
      background-color: $main-lighten-74-color;
      padding: 2.4rem 2.5rem 6.7rem 2.5rem;

      .template-collapse-wrapper {
        margin-bottom: 0.5rem;
      }

      .v-expansion-panel-content__wrap {
        padding: 0;
      }
    }
  }

  .fab-mobile {
    background-color: $main-color;
    color: $white;
    border: solid 0.3rem $white;
    border-radius: 50%;
    bottom: 7rem;

    &.v-btn--fab.v-size--default {
      height: 6rem;
      width: 6rem;
    }
  }

  .actions-wrapper-mobile {
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 3;
    display: flex;

    flex-direction: row;
    overflow-x: auto;

    .action-modify {
      @media #{map-get($display-breakpoints, 'xs-only')} {
        padding-left: 2rem !important;
        padding-right: 2rem !important;
      }
    }

    .action-cancel,
    .action-modify,
    .action-update {
      height: 6rem !important;
      border-radius: 0;
      flex-grow: 1;
    }
  }
}

.dialog-errors-order-detail {
  .main-dialog-content {
    @include setMacScrollbar('&');
    overflow-y: auto;
    min-height: 30vh;
    max-height: calc(100vh - 12.6rem - 8.8rem - 2.8rem - 6rem);

    @media #{map-get($display-breakpoints, 'xs-only')} {
      max-height: calc(100vh - 5.2rem - 8rem);
      min-height: calc(100vh - 5.2rem - 8rem);
    }

    > div {
      height: 100%;
    }
  }

  .dialog-error-outer-wrapper {
    border-bottom: 0.1rem solid $main-lighten-74-color;
    margin-bottom: 2.8rem;
  }

  .dialog-error-wrapper {
    border-bottom: 0.1rem solid $main-lighten-74-color;
  }
}
</style>
