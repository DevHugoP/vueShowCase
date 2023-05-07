<template>
  <mp-dialog-confirmation
    :dataId="dataId"
    classWrapper="modal-add-retailer-catalogs"
    @close="hide()"
    @submit="createCatalog()"
    color="primary"
    :header="{
      isColorBackground: true,
      icon: $vuetify.breakpoint.smAndUp ? 'mdi-book' : null,
      text: !isModified ? $t('page.retailerDetail.catalogs.addCatalog') : $t('action.update.base'),
      textPolice: $vuetify.breakpoint.smAndUp ? 'h4' : 'regular14',
      iconClose: 'mdi-close',
    }"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
    :btnValidation="{
      text: $t('action.save'),
      format: 'success',
      icon: 'content-save',
      disabled: $v.form.$invalid || isCatalogLoading,
      loading: isCatalogLoading,
    }"
    :btnToColumn="$vuetify.breakpoint.xsOnly"
  >
    <template #content>
      <v-form ref="form" :data-id="`${dataId}-form`">
        <v-row no-gutters class="mb-5">
          <v-col cols="12">
            <mp-textfield
              ref="formTitle"
              :dataId="`${dataId}-form-title`"
              :label="`${$t('page.retailerDetail.catalogs.modal.title')} *`"
              :name="`${$t('page.retailerDetail.catalogs.modal.title')} *`"
              v-model="form.title"
              @input="$v.form.title.$touch()"
              @blur="$v.form.title.$touch()"
              :errors="getModelErrors($v.form.title)"
              :isDirty="$v.form.title.$dirty"
            />
          </v-col>
        </v-row>

        <v-row no-gutters class="mb-5">
          <v-col cols="12">
            <mp-date-picker
              :refs="{ menu: 'datepickerMenuRef', textfield: 'formOutdatedAt', picker: 'picker' }"
              :dataId="`${dataId}-form-date`"
              :label="`${$t('page.retailerDetail.catalogs.modal.experationDate')} *`"
              v-model="form.outdatedAt"
              :dateHelper="dateHelper"
              @input="$v.form.outdatedAt.$touch()"
              @blur="$v.form.outdatedAt.$touch()"
              :errors="getModelErrors($v.form.outdatedAt)"
              :isDirty="$v.form.outdatedAt.$dirty"
            />
          </v-col>
        </v-row>

        <v-row no-gutters class="mb-5">
          <v-col cols="12">
            <mp-textfield
              ref="formReminder"
              :dataId="`${dataId}-form-dayBeforeExpiration`"
              :label="`${$t('page.retailerDetail.catalogs.modal.dayBeforeExpiration')} *`"
              :name="`${$t('page.retailerDetail.catalogs.modal.dayBeforeExpiration')} *`"
              v-model="form.updateReminderInterval"
              type="number"
              @input="$v.form.updateReminderInterval.$touch()"
              @blur="$v.form.updateReminderInterval.$touch()"
              :errors="getModelErrors($v.form.updateReminderInterval)"
              :isDirty="$v.form.updateReminderInterval.$dirty"
            />
          </v-col>
        </v-row>

        <v-row no-gutters class="mb-2">
          <v-col cols="12">
            <mp-input-file
              showSize
              counter
              v-model="form.file"
              accept=".csv"
              appendIcon="mdi-paperclip"
              :dataId="`${dataId}-form-file`"
              :label="`${$t('page.retailerDetail.catalogs.modal.file')} *`"
              @input="$v.form.file.$touch()"
              @blur="$v.form.file.$touch()"
              :errors="getModelErrors($v.form.file)"
              :isDirty="$v.form.file.$dirty"
            />
          </v-col>
        </v-row>

        <v-row
          no-gutters
          :class="`${$vuetify.breakpoint.smAndUp ? 'mb-5' : 'mt-8'}`"
        >
          <v-col class="centerDownloadBtn" cols="12" :class="`${$vuetify.breakpoint.smAndUp ? 'd-flex justify-end' : ''}`">
            <a
              v-if="$vuetify.breakpoint.smAndUp"
              :data-id="`${dataId}-download-example`"
              @click="downloadExample()"
              class="download-example regular14"
            >
              <v-icon size="1.6rem" class="mr-1 download-icon">mdi-file-download</v-icon>

              <span>{{ $t('page.retailerDetail.catalogs.modal.example') }}</span>
            </a>
            <mp-button
              v-else
              class="regular14 download-example"
              icon="file-download"
              :dataId="`${dataId}-download-example`"
              :text="$t('page.retailerDetail.catalogs.modal.example')"
              format="secondary"
              @click="downloadExample()"
            />
          </v-col>
        </v-row>
      </v-form>
    </template>
  </mp-dialog-confirmation>
</template>

<script lang="ts">
import { SnackBarType } from '@/store/types'
import mixins from 'vue-typed-mixins'
import FileDownload from 'js-file-download'
import { dateHelper, dateHelperGetTimezonedDate } from '@/helpers/dateHelper'

import { FILE_CATALOG_SIZE } from '@/constants'

import { languageMixin } from '@/mixins'

import CatalogService from '@/services/catalog/CatalogService'
import { CatalogEntity } from '@/types'

import { validationMixin } from '@/mixins'
import { required, requiredIf, minValue } from 'vuelidate/lib/validators'
import { UpdateCatalog } from '../catalog.vue'

export interface AddCatalogForm {
  id?: string
  title: string
  outdatedAt: string
  updateReminderInterval: string
  file: File | null
}

const DEFAULT_HEADERS = ['cug', 'label', 'ean', 'length(cm)', 'width(cm)', 'height(cm)', 'weight(kg)']

const DEFAULT_DATE = dateHelper.formatToTimezone(dateHelperGetTimezonedDate(), 'UTC', 'yyyy-MM-dd')

export default mixins(languageMixin, validationMixin).extend({
  name: 'mp-retailer-detail-catalog-add',
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object as () => AddCatalogForm,
      default: null,
    },
    isModified: {
      type: Boolean,
      default: false,
    },
    dataId: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    form: {
      title: '',
      outdatedAt: DEFAULT_DATE,
      updateReminderInterval: '',
      file: null,
    } as AddCatalogForm,
    dateHelper,
    isCatalogLoading: false,
  }),
  computed: {
    dateMin(): string {
      return DEFAULT_DATE
    },
  },
  validations() {
    const { data } = this

    return {
      form: {
        title: { required },
        outdatedAt: { required },
        updateReminderInterval: { required, minValue: minValue(1) },
        file: {
          required: requiredIf(() => !data?.id),
          maxSize(value: any) {
            if (data?.id && !value?.size) {
              return true
            }

            if (!value || !value.size || value.size >= FILE_CATALOG_SIZE) {
              return false
            }
            return true
          },
        },
      },
    }
  },
  mounted() {
    if (this.data) {
      this.form.title = this.data && this.data.title ? this.data.title : ''
      this.form.outdatedAt =
        dateHelper.formatToTimezone(
          dateHelperGetTimezonedDate(this.data.outdatedAt),
          'UTC',
          'yyyy-MM-dd',
        ) || DEFAULT_DATE
      this.form.updateReminderInterval =
        this.data && this.data.updateReminderInterval
          ? this.data.updateReminderInterval.toString()
          : ''
    }

    this.$nextTick(() => {
      const refUntestable = ['form', 'datepickerMenuRef']
      for (const ref in this.$refs) {
        if (!refUntestable.includes(ref)) {
          if ((this.$refs[ref] as any).value) {
            ;(this.$refs[ref] as any).handleBlur()
          }
        }
      }
    })
  },
  methods: {
    downloadExample() {
       const rows = [
       DEFAULT_HEADERS,
        ["1167","Hotte NOVY 936 INOX","5414425009367","66","60","24","16"],
        ["31319","Soupape SEB noir 790076 authentique / co","3045387900762","13","4","18","0.059"]
      ]

      const csvContent = rows.map(e => e.join(';')).join('\n')

      FileDownload(csvContent, 'example.csv')
    },
    async createCatalog() {
      const retailerId = this.$route.params.id

      if (!retailerId) {
        return
      }

      const { form, data } = this
      const catalog = { ...form, retailerId }

      let currentCatalog: CatalogEntity | UpdateCatalog

      this.isCatalogLoading = true

      try {
        if (data && data.id) {
          currentCatalog = await CatalogService.update(data.id, catalog)
          currentCatalog = { id: data.id, catalog: currentCatalog }
        } else {
          currentCatalog = await CatalogService.create(catalog)
          currentCatalog = { id: '', catalog: currentCatalog }
        }

        this.$emit('updateCatalog', currentCatalog)
        this.isCatalogLoading = false

        this.hide(currentCatalog)
      } catch (e) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      }
    },
    hide(catalog: CatalogEntity | UpdateCatalog) {
      this.$emit('hide', catalog)
    },
  },
})
</script>

<style lang="scss">
@import '../../../../../styles/mixins/macScrollbar';

.modal-add-retailer-catalogs {
  .main-dialog-content {
    padding: 3rem 4rem !important;
    @include setMacScrollbar('&');

    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      max-height: calc(100vh - 27rem);
      overflow-y: scroll;
    }

    .action-outer-wrapper {
      margin-top: 10rem;

      @media #{map-get($display-breakpoints, 'xs-only')} {
        justify-content: center;
      }

      .action-wrapper {
        display: flex;
        justify-content: flex-end;

        @media #{map-get($display-breakpoints, 'xs-only')} {
          align-items: center;

          .v-btn {
            width: fit-content;
          }
        }

        i {
          &.mdi-content-save {
            margin-right: 1rem;
          }
        }

        @media #{map-get($display-breakpoints, 'xs-only')} {
          flex-direction: column-reverse;
        }
      }
    }

    .download-icon {
      color: $main-color;
    }

    .download-example {
      span {
        vertical-align: middle;
      }
      &:hover {
        span {
          text-decoration: underline;
        }
      }
    }
  }
  .centerDownloadBtn {
    display: flex;
    justify-content: center;
  }
}
</style>
