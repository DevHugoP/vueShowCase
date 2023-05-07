<template>
  <v-container id="order-documents-detail" v-if="order" data-id="order-documents-detail">
    <mp-block
      id="order-documents-detail-block"
      :title="$vuetify.breakpoint.smAndUp ? $t('page.detailOrder.documents.title') : ''"
      :hasBorder="$vuetify.breakpoint.smAndUp"
      :hasMarginBottom="$vuetify.breakpoint.smAndUp"
      titleHasPaddingBottom
    >
      <div v-if="orderDocuments.length">
        <v-expansion-panels accordion flat>
          <mp-collapse
            v-for="(document, index) in orderDocuments"
            :key="`document-${document.id}-${index}`"
            color="black"
            :title="document.name"
            hasBorder
            backgroundColor="white"
            :dataId="`order-documents-detail-${index}`"
          >
            <div class="regular14 main-lighten-52 d-flex justify-space-between align-center mt-1">
              <span>
                {{ $t('page.detailOrder.documents.type') }}
              </span>
              <span class="regular14 main-color">
                {{ $t(`technical.order.documents.${document.type}`) }}
              </span>
            </div>

            <v-divider class="mt-4 mb-4" />

            <div class="regular14 main-lighten-52 d-flex justify-space-between align-center">
              <span>
                {{ $t('page.detailOrder.documents.created') }}
              </span>
              <span class="regular14 main-color">
                {{ getDate(document.date) }}
              </span>
            </div>

            <div
              :class="
                `d-flex justify-end mt-9 mb-10${
                  $vuetify.breakpoint.smAndDown ? ' flex-column' : ''
                }`
              "
              v-if="isAuthorized('DOWNLOAD_ORDERS_DOCUMENT')"
            >
              <mp-button
                @click="previewDocument(order.id, document.id)"
                :class="`${$vuetify.breakpoint.smAndDown ? 'mb-2' : 'mr-2'}`"
                :dataId="`order-documents-${index}-preview`"
                :text="$t('action.preview')"
                icon="eye"
                format="secondary"
                iconSize="1.8rem"
              />
              <mp-button
                @click="downloadDocument(order.id, document.id, document.name)"
                :dataId="`order-documents-${index}-download`"
                :text="$t('action.download')"
                format="secondary"
                icon="download"
                iconSize="1.8rem"
              />
            </div>
          </mp-collapse>
        </v-expansion-panels>
      </div>
      <div v-else>
        <no-data dataId="order-detail-documents-noData" />
      </div>
    </mp-block>
  </v-container>
</template>

<script lang="ts">
import mpBlock from '@/components/block/block.vue'

import noData from '@/components/noData/noData.vue'

import { dateHelper, dateHelperGetTimezonedDate } from '@/helpers/dateHelper'
import { authorizationMixin } from '@/mixins'

import OrderService from '@/services/order/OrderService'

import FileDownload from 'js-file-download'
import mixins from 'vue-typed-mixins'
import FileType from 'file-type/browser'
import { OrderDocument, OrderEntity } from '@/types'
import { Buffer } from 'buffer'

export default mixins(authorizationMixin).extend({
  name: 'mp-detail-documents',
  components: {
    noData,
    mpBlock,
  },
  props: {
    order: {
      type: Object as () => OrderEntity,
      required: true,
    },
  },
  data: () => ({
    orderDocuments: [] as OrderDocument[],
  }),
  async mounted() {
    try {
      if (this.order) {
        this.orderDocuments = await OrderService.getDocuments(this.order.id)
      }
    } catch (e) {
      this.orderDocuments = []
    }
  },
  computed: {
    displayDocumentDownload() {
      return true
    },
  },
  methods: {
    async downloadDocument(orderId: number, documentId: string, filename: string) {
      const document = await OrderService.downloadDocument(orderId, documentId)

      FileDownload(document, filename)
    },
    async previewDocument(orderId: number, documentId: string) {
      const document = await OrderService.downloadDocument(orderId, documentId)
      const bufferDoc = Buffer.from(document)
      const docWindow = window.open('')
      const fileType = await FileType.fromBuffer(bufferDoc)
      docWindow!.document.write(
        `<iframe width='100%' height='100%' src='data:${fileType &&
          fileType.mime};base64,${encodeURI(bufferDoc.toString('base64'))}'></iframe>`,
      )
    },
    getDate(date: string) {
      return dateHelper.formatToTimezone(dateHelperGetTimezonedDate(date), 'UTC', 'P p')
    },
  },
})
</script>

<style lang="scss">
#order-documents-detail {
  padding: 0;

  @media #{map-get($display-breakpoints, 'xs-only')} {
    border-top: solid 0.1rem $main-lighten-74-color;
  }

  .v-expansion-panels {
    .v-expansion-panel {
      margin-bottom: 0.5rem;
      border-color: $main-lighten-74-color;

      .v-expansion-panel-header {
        padding-top: 1.8rem;
        padding-bottom: 1.8rem;
        border-bottom-left-radius: inherit;
        border-bottom-right-radius: inherit;

        .header-wrapper {
          justify-content: flex-start;

          .collapse-title {
            @each $prop, $value in $regular16 {
              #{$prop}: #{$value} !important;
            }
          }

          .mdi-close-circle {
            color: $main-color;
          }
        }
      }

      .v-expansion-panel-content {
        @media #{map-get($display-breakpoints, 'xs-only')} {
          padding: 1.8rem 2rem 1.8rem 1.6rem;
        }
      }
    }
  }
}
</style>
