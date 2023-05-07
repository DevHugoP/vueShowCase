<template>
  <div v-if="hasData" no-gutters>
    <content-header
      id="status-mapping__header"
      className="d-flex flex-column"
      v-if="$vuetify.breakpoint.smAndUp"
      data-id="status-mapping"
    >
      <template #breadcrumb>
        <mp-breadcrumb />
      </template>
      <template #title>
        <h1>{{ headerTitle }}</h1>
      </template>
      <template #actions-button v-if="isAuthorized('WRITE_STATUS_MAPPINGS')">
        <v-row no-gutters class="mt-4 pb-6">
          <v-col cols="12" class="d-flex justify-end" v-if="isEdit">
            <mp-button
              :text="$t('action.cancel.base')"
              format="link"
              linkColor="black"
              dataId="status-mapping-cancel"
              @click="cancel()"
            />
            <mp-button
              :text="$t('action.save')"
              format="success"
              icon="content-save-outline"
              @click="save()"
              dataId="status-mapping-save"
              :disabled="!statusMappings.length || $v.statusMappings.$invalid"
            />
          </v-col>
          <v-col cols="12" class="d-flex justify-end" v-else>
            <mp-button
              :text="$t('action.modify.base')"
              format="secondary"
              linkColor="black"
              dataId="status-mapping-edit"
              @click="isEdit = !isEdit"
            />
          </v-col>
        </v-row>
      </template>
    </content-header>
    <v-col cols="10" offset="1">
      <mp-button
        format="secondary"
        :text="$t('page.statusMappings.downloadCsv')"
        icon="file-download-outline"
        :dataId="`download-csv-mapping`"
        class="mb-3"
        @click="showDownloadModal = true"
        v-if="isEdit && isAuthorized('WRITE_STATUS_MAPPINGS')"
      />

      <mp-data-table
        id="status-mapping-list"
        :items="statusMappings"
        :headers="getHeaders"
        :itemsPerPage="isEdit ? 20 : -1"
        :footerProps="{ itemsPerPageOptions: [20, 50, 100] }"
        :pageLabel="$t('common.page')"
      >
        <template v-slot:externalStatus="{ item, index }" v-if="isEdit">
          <mp-textfield
            name="externalStatus"
            v-model="item.externalStatus"
            :dataId="`status-mapping-externalStatus-${index}`"
            label=""
            @input="$v.statusMappings[index].externalStatus.$touch()"
            @blur="$v.statusMappings[index].externalStatus.$touch()"
            :errors="getModelErrors($v.statusMappings[index].externalStatus)"
            :isDirty="$v.statusMappings[index].externalStatus.$dirty"
          />
        </template>

        <template v-slot:description="{ item, index }" v-if="isEdit">
          <mp-textfield
            name="description"
            v-model="item.description"
            :dataId="`status-mapping-description-${index}`"
            label=""
          />
        </template>

        <template v-slot:status="{ item, index }" v-if="isEdit">
          <mp-select
            ref="status"
            v-model="item.status"
            :dataId="`status-mapping-status-${index}`"
            label=""
            cacheItems
            :items="status"
            @change="setStatus($event, item)"
            @input="$v.statusMappings[index].status.$touch()"
            @blur="$v.statusMappings[index].status.$touch()"
            :errors="getModelErrors($v.statusMappings[index].status)"
            :isDirty="$v.statusMappings[index].status.$dirty"
          />
        </template>

        <template v-slot:subStatus="{ item, index }" v-if="isEdit">
          <mp-select
            ref="subStatus"
            v-model="item.subStatus"
            :dataId="`status-mapping-status-${index}`"
            label=""
            cacheItems
            :items="getSubStatus(item.status)"
            @input="$v.statusMappings[index].subStatus.$touch()"
            @blur="$v.statusMappings[index].subStatus.$touch()"
            :errors="getModelErrors($v.statusMappings[index].status)"
            :isDirty="$v.statusMappings[index].subStatus.$dirty"
            :disabled="!getSubStatus(item.status).length"
          />
        </template>

        <template v-slot:active="{ item }">
          <mp-switch
            v-model="item.active"
            :dataId="`${item.id}-active-switch`"
            :disabled="!isEdit"
          />
        </template>

        <template v-slot:actions="{ index }" v-if="isEdit">
          <v-icon @click="setDeleteModal(index)">mdi-close-circle</v-icon>
        </template>
      </mp-data-table>

      <v-row justify="center" v-if="isEdit">
        <mp-button
          format="primary"
          :text="$t('action.add.line')"
          icon="plus"
          :dataId="`add-status-mapping`"
          class="mb-3"
          @click="addMapping"
        />
      </v-row>
    </v-col>

    <mp-dialog-confirmation
      v-if="showDeleteModal"
      dataId="modal-delete-mapping"
      :textContent="$t('common.deleteLine')"
      @close="showDeleteModal = false"
      @submit="deleteMapping()"
      color="error"
      :header="{ icon: 'mdi-trash-can-outline', isColorBackground: false, iconClose: 'mdi-close' }"
      :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
      :btnValidation="{ text: $t('action.delete.base'), format: 'error' }"
      :btnToColumn="$vuetify.breakpoint.xsOnly"
      :fullscreen="$vuetify.breakpoint.xsOnly"
    />

    <mp-dialog-confirmation
      v-if="showDownloadModal"
      dataId="modal-download-mapping"
      @close="resetFile()"
      @submit="parseFile()"
      :header="{
        icon: 'mdi-file-download-outline',
        isColorBackground: false,
        iconClose: 'mdi-close',
      }"
      :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
      :btnValidation="{ text: $t('action.save'), format: 'success' }"
      :btnToColumn="$vuetify.breakpoint.xsOnly"
      :fullscreen="$vuetify.breakpoint.xsOnly"
    >
      <template #content>
        <v-col cols="10" offset="1" no-gutters>
          <mp-input-file
            showSize
            counter
            v-model="file"
            accept=".csv"
            appendIcon="mdi-paperclip"
            :dataId="`status-mapping-form-file`"
            :label="`${$t('page.statusMappings.file')} *`"
          />
        </v-col>
      </template>
    </mp-dialog-confirmation>
  </div>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'
import { mapGetters } from 'vuex'
import Papa from 'papaparse'
import { required, requiredIf } from 'vuelidate/lib/validators'

import mpBreadcrumb from '@/components/breadcrumb/breadcrumb.vue'
import contentHeader from '@/components/contentHeader/contentHeader.vue'

import StatusMappingService from '@/services/statusMapping/StatusMappingService'
import CarrierService from '@/services/carrier/CarrierService'
import { SET_BREADCRUMBS_LABEL } from '@/store/mutation-types'
import { SnackBarType } from '@/store/types'
import { authorizationMixin, validationMixin } from '@/mixins'
import { DELIVERY_STATUS, SUB_STATUS, LEGACY_DELIVERY_STATUS } from '@/constants'
import { StatusMappingEntity } from '@/types'

const defaultStatusMapping = {
  externalStatus: '',
  description: '',
  status: '',
  subStatus: '',
  active: true
}

const HEADERS = ['externalStatus', 'description', 'active', 'status', 'subStatus']

const AVAILABLE_SUB_STATUS: Record<string, any> = {
  DELIVERY_PICK_UP_KO: ['FAILED_WITH_RETRY', 'FAILED'],
  DELIVERY_OK: ['WITH_CLAIM'],
  DELIVERY_KO: ['FAILED_WITH_RETRY', 'FAILED_WITH_RETURN', 'REFUSED', 'NOT_COLLECTED'],
}

const AUTHORIZE_DELIVERY_STATUS = Object.values(DELIVERY_STATUS).filter(status => status !== DELIVERY_STATUS.CLOSED)
const DELIVERY_STATUS_WITH_SUB_STATUS = ['DELIVERY_PICK_UP_KO', 'DELIVERY_KO']

export default mixins(validationMixin, authorizationMixin).extend({
  name: 'status-mapping',
  components: {
    mpBreadcrumb,
    contentHeader,
  },
  validations() {
    const { statusMappings } = this

    const validations = statusMappings.reduce((acc, status, index) => {
      return {
        ...acc,
        [index]: {
          externalStatus: {
            required,
            IsDuplicate(externalStatus: string) {
              return !statusMappings.some(
                (statusMapping, i) =>
                  statusMapping.externalStatus === externalStatus && index !== i,
              )
            },
          },
          status: {
            required,
          },
          subStatus: {
            required: requiredIf(statusMapping => {
              return DELIVERY_STATUS_WITH_SUB_STATUS.includes(statusMapping.status) || false
            }),
            isIn(subStatus: string, statusMapping: Record<string, any>) {
              return (
                !DELIVERY_STATUS_WITH_SUB_STATUS.includes(statusMapping.status) ||
                AVAILABLE_SUB_STATUS[statusMapping.status]?.includes(subStatus)
              )
            },
          },
        },
      }
    }, {})

    return {
      statusMappings: {
        ...validations,
      },
    }
  },
  data: () => ({
    statusMappings: [] as StatusMappingEntity[],
    hasData: false,
    showDeleteModal: false,
    selectedMapping: null as number | null,
    showDownloadModal: false,
    file: null as File | null,
    isEdit: false,
    status: (Object.values(AUTHORIZE_DELIVERY_STATUS) as string[]).concat(
      LEGACY_DELIVERY_STATUS.PICK_UP_PARTIALLY,
      LEGACY_DELIVERY_STATUS.DELIVERED_PARTIALLY,
    ),
  }),
  async mounted() {
    const carrierId = Number(this.$route.params.carrierId)

    const [carrier] = await CarrierService.getFilters({
      ids: carrierId,
      forRule: 'READ_CARRIERS_TECHNICAL',
    })
    this.$store.commit(
      SET_BREADCRUMBS_LABEL,
      JSON.stringify({
        carriers: carrier.name,
      }),
    )

    try {
      this.statusMappings = await StatusMappingService.getAll({ carrierId })
    } catch (error) {
      this.statusMappings = []
    }

    this.hasData = true
  },
  computed: {
    ...mapGetters({
      headerTitle: 'getHeaderTitle',
    }),
    getHeaders() {
      const headers = [
        {
          text: this.$t('page.statusMappings.externalStatus'),
          value: 'externalStatus',
          sortable: !this.isEdit,
        },
        {
          text: this.$t('common.description'),
          value: 'description',
          sortable: false,
        },
        { text: this.$t('page.statusMappings.status'), value: 'status', sortable: !this.isEdit },
        {
          text: this.$t('page.statusMappings.subStatus'),
          value: 'subStatus',
          sortable: !this.isEdit,
        },
        {
          text: this.$t('common.active'),
          value: 'active',
          sortable: false
        }
      ]

      if (this.isEdit) {
        headers.push({ text: '', value: 'actions', sortable: false })
      }

      return headers
    },
  },
  methods: {
    addMapping() {
      this.statusMappings.push({
        ...defaultStatusMapping,
        carrierId: Number(this.$route.params.carrierId),
      })
    },
    setDeleteModal(index: number) {
      this.selectedMapping = index
      this.showDeleteModal = true
    },
    deleteMapping() {
      if (typeof this.selectedMapping !== 'number') {
        this.showDeleteModal = false
        return
      }

      this.statusMappings.splice(this.selectedMapping, 1)
      this.showDeleteModal = false
      this.selectedMapping = null
    },
    async save() {
      try {
        await StatusMappingService.createMany(this.statusMappings)

        this.isEdit = !this.isEdit
      } catch (error) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      }
    },
    async cancel() {
      try {
        this.statusMappings = await StatusMappingService.getAll({
          carrierId: Number(this.$route.params.carrierId),
        })
      } catch (error) {
        this.statusMappings = []
      }

      this.isEdit = false
    },
    async parseFile() {
      if (!this.file) {
        this.showDownloadModal = false
        return
      }

      const carrierId = Number(this.$route.params.carrierId)
      await Papa.parse(this.file, {
        header: true,
        skipEmptyLines: true,
        delimitersToGuess: [',', ';', '|'],
        transformHeader: (header, index: number) => {
          return HEADERS[index] || header
        },
        // with file papaparse return undefined
        complete: result => {
          const isError =
            result.data.length > 450 ||
            result.data.some(
              (fileData: any) =>
                !fileData.externalStatus ||
                !Object.values(AUTHORIZE_DELIVERY_STATUS).includes(fileData.status as DELIVERY_STATUS) ||
                (DELIVERY_STATUS_WITH_SUB_STATUS.includes(fileData.status) &&
                  !AVAILABLE_SUB_STATUS[fileData.status].includes(fileData.subStatus)) ||
                (fileData.subStatus && !Object.values(SUB_STATUS).includes(fileData.subStatus)) ||
                this.statusMappings.some(
                  ({ externalStatus }) => externalStatus === fileData.externalStatus,
                ),
            )

          if (isError) {
            this.$store.dispatch('setSnackbar', {
              type: SnackBarType.ERROR,
              message: this.$t('messages.invalidFile'),
            })
            this.showDownloadModal = false
            this.file = null
            return
          }

          const newStatusMappings = result.data.map((fileData: any) => ({
            externalStatus: fileData.externalStatus,
            description: fileData.description,
            status: fileData.status,
            subStatus: fileData.subStatus,
            carrierId,
            active: fileData.active === 'true'
          }))

          this.statusMappings.push(...newStatusMappings)

          this.showDownloadModal = false
          this.file = null
        },
      })
    },
    getSubStatus(status: string) {
      return AVAILABLE_SUB_STATUS[status] || []
    },
    resetFile() {
      this.file = null
      this.showDownloadModal = false
    },
    setStatus(status: string, statusMapping: StatusMappingEntity) {
      statusMapping.status = status
      statusMapping.subStatus = ''
    },
  },
})
</script>

<style lang="scss">
#status-mapping-list {
  margin: 3rem 0;
  padding: 0;

  .disable-display-input {
    input {
      display: none;
    }
  }
}
</style>
