<template>
  <div>
    <mp-data-table
      id="carrier-list-data-table"
      :items="carriers"
      :headers="headers"
      :totalItems="count"
      @update:options="onOptionsUpdated"
      :pageLabel="$t('common.page')"
      :footer-props="{ itemsPerPageOptions: [10, 25, 100] }"
      :to="
        isAuthorized('READ_CARRIERS')
          ? {
            name: ROUTES.detailCarrier,
            paramKey: 'carrierId',
            objectKey: 'id',
            toExclude: ['actions'],
          }
          : {}
      "
    >
      <template v-slot:isNew="{ isNew }">
        <div class="carrier-list-table-new-wrapper" v-if="isNew">
          <div class="carrier-list-table-new green">
            <span class="medium12">NEW</span>
          </div>
        </div>
        <div v-else />
      </template>
      <template v-slot:name="{ name, item }">
        <v-img
          class="mb-2 mt-5"
          contain
          max-width="17rem"
          max-height="6rem"
          :src="item.logo"
          :alt="item.name"
          :data-id="`carrier-list-${item.id}-logo`"
        />

        <div class="d-flex justify-center">
          <span class="regular12 main-lighten-52-color">{{ name }}</span>
        </div>
      </template>
      <template v-slot:picto="{ item }">
        <div class="d-flex justify-end">
          <img v-if="item.isLabeled" src="@/assets/logos/label.svg" />
          <img
            class="logo-picto-eco-100"
            v-if="item.ecologyType === ECOLOGY_TYPE.FULL"
            src="@/assets/logos/green100.svg"
          />
          <img
            class="logo-picto-eco"
            v-else-if="item.ecologyType === ECOLOGY_TYPE.PARTIAL"
            src="@/assets/logos/green.svg"
          />
        </div>
      </template>

      <template v-slot:description="{ item }">
        <span class="italic14">{{ getDescription(item) }}</span>
      </template>

      <template v-slot:status="{ item }">
        <span class="regular14 main-lighten-28">
          <mp-badge
            :color="getColor(item)"
            :data-id="`carrier-list-${item.id}-status`"
            :content="getStatus(item)"
          >
          </mp-badge>
        </span>
      </template>
    </mp-data-table>
  </div>
</template>

<script lang="ts">
import { ROUTES } from '@/constants'

import { authorizationMixin } from '@/mixins'
import {
  BadgeColor,
  CarrierEntity,
  DataTableHeader,
  INTEGRATION_STATUS,
  MODELS,
  ECOLOGY_TYPE,
} from '@/types'

import mixins from 'vue-typed-mixins'

export default mixins(authorizationMixin).extend({
  name: 'carrierList-dataTable',
  props: {
    carriers: {
      type: Array as () => CarrierEntity[],
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
    pagination: {
      type: Object as () => {
        offset: number
        limit: number | null
      },
      required: true,
    },
    order: {
      type: Object as () => {
        sortBy: string
        sort: string
      },
      required: true,
    },
  },
  data: () => ({
    ROUTES,
    carrierSelected: null as CarrierEntity | null,
    ECOLOGY_TYPE,
  }),
  mounted() {
    if (this.$refs[`tabs-${MODELS.ALL}`] || this.$refs.tab) {
      this.$nextTick(() => {
        // bug: slider is not align after a refresh (position decide without the font loaded) / code propose by vuetify in one of there issue
        const tab = (this.$refs[`tabs-${MODELS.ALL}`] as any)[0] || (this.$refs.tab as any)[0]
        const initial = tab.$el.offsetWidth
        const interval = setInterval(() => {
          if (tab) {
            if (tab.$el.offsetWidth !== initial) {
              clearInterval(interval)
              ;(this.$refs.tabs as any).callSlider()
            }
          }
        }, 500)
      })
    }
  },
  computed: {
    headers(): DataTableHeader[] {
      return [
        {
          text: '',
          value: 'isNew',
          width: '1%',
          sortable: false,
        },
        {
          text: this.$t('common.carrier'),
          align: 'center',
          sortable: true,
          value: 'name',
          width: '10%',
        },
        {
          text: this.$t('common.description'),
          value: 'description',
          align: 'left',
          sortable: false,
        },
        {
          text: '',
          value: 'picto',
          align: 'left',
          sortable: false,
        },
        {
          text: this.$t('common.integrated.level'),
          value: 'status',
          align: 'left',
          sortable: true,
          width: '15%',
        },
      ]
    },
  },
  methods: {
    onOptionsUpdated(options: Record<string, any>): void {
      const {
        page,
        itemsPerPage,
        sortBy: [sortBy],
        sortDesc: [sortDesc],
      } = options

      this.pagination.limit = itemsPerPage > 0 ? itemsPerPage : null
      this.pagination.offset = itemsPerPage * (page - 1)

      this.order.sortBy = sortBy ?? 'name'
      this.order.sort = sortDesc ? 'DESC' : 'ASC'

      this.$emit('getCarrierData')
    },
    getColor(carrier: CarrierEntity): string {
      switch (carrier.status) {
        case INTEGRATION_STATUS.STUDY:
          return BadgeColor.RED
        case INTEGRATION_STATUS.IN_PROGRESS:
          return BadgeColor.ORANGE
        case INTEGRATION_STATUS.INTEGRATED:
          return BadgeColor.GREEN
        default:
          return BadgeColor.RED
      }
    },
    getStatus(carrier: CarrierEntity): string {
      const statuses = [
        { name: this.$t('common.integrated.study'), id: INTEGRATION_STATUS.STUDY },
        { name: this.$t('common.integrated.onGoing'), id: INTEGRATION_STATUS.IN_PROGRESS },
        { name: this.$t('common.integrated.base'), id: INTEGRATION_STATUS.INTEGRATED },
      ]

      const statusFound = statuses.find(({ id }) => carrier?.status === id)

      return statusFound?.name || this.$t('common.integrated.study')
    },
    getDescription(carrier: CarrierEntity): string {
      const { language } = this.$store.getters['auth/currentUser']

      return carrier.description?.[language] || ''
    },
  },
})
</script>

<style lang="scss">
#carrier-list-data-table {
  .v-data-table__wrapper {
    .pointer {
      position: relative;

      a {
        text-decoration: none;
      }
    }

    .column-name {
      width: 17.6rem;
      padding-left: 0;
      min-height: 10.7rem;
      height: 10.7rem;

      > div {
        height: 100%;
      }
    }

    img {
      width: 4rem;
      height: 4rem;
    }

    .logo-picto-eco {
      width: 2.4rem;
      height: 2.4rem;
      margin: 0.8rem;
    }
    .logo-picto-eco-100 {
      width: 3rem;
      height: 3rem;
      margin: 0.5rem;
    }

    .carrier-list-table-new-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      overflow: hidden;
      max-width: 4.5rem;
      min-width: 4.5rem;

      .carrier-list-table-new {
        transform: rotate(-45deg);
        overflow: hidden;
        margin-bottom: 2rem;
        margin-top: 0.8rem;
        margin-left: -1.5rem;
        display: flex;
        justify-content: center;

        &.green {
          background-color: $success-color;
        }
      }

      span {
        color: $white;
      }
    }
  }
}
</style>
