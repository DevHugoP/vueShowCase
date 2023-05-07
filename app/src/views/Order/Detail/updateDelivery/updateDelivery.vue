<template>
  <mp-dialog-confirmation
    v-if="hasData"
    dataId="order-detail-update-delivery-modal"
    color="primary"
    :header="{
      isColorBackground: true,
      text: $t('action.update.order'),
      textPolice: $vuetify.breakpoint.smAndUp ? 'h4' : 'regular14',
      icon: !$vuetify.breakpoint.xsOnly ? 'mdi-exclamation' : null,
      iconClose: 'mdi-close',
    }"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    classWrapper="order-detail-updateDelivery"
    @close="$emit('hide')"
    @submit="sendUpdate()"
    maxWidth="58.6rem"
    :btnValidation="{
      text: $t('action.save'),
      format: 'sticky',
      stickyColor: 'yellow',
      disabled: $v.$invalid,
    }"
  >
    <template #content>
      <v-row no-gutters>
        <v-col cols="10" offset="1" class="handling-unit-outer-wrapper">
          <div class="handling-unit-wrapper">
            <div
              v-for="(handlingUnit, index) of handlingUnits"
              :key="`handling-unit-${index}`"
              :class="`handling-unit${selectedHandlingUnitIndex === index ? ' selected' : ''}`"
              @click="() => handleHandlingUnitTypeSelection(index)"
            >
              <v-img
                :src="getIconSource(handlingUnit)"
                class="logo"
                contain
                :data-id="`handlingUnit-type-${handlingUnit.key}`"
              />

              <span class="regular16">
                {{ $t(handlingUnit.label) }}
              </span>
            </div>
          </div>
        </v-col>

        <v-col
          cols="10"
          offset="1"
          :class="
            `mb-5 ${
              parcels && parcels.length && getSelectedHandlingUnitType === 'parcel'
                ? 'visible'
                : 'hidden'
            }`
          "
        >
          <mp-select
            :label="$t('common.package')"
            v-model="parcelId"
            :items="getParcels"
            chips
            smallChips
            clearable
            deletableChips
            hideSelected
            dataId="order-detail-update-delivery-modal-parcels"
            @input="$v.parcelId.$touch()"
            @blur="$v.parcelId.$touch()"
            :errors="getModelErrors($v.parcelId)"
            :isDirty="$v.parcelId.$dirty"
            attach="#order-detail-update-delivery-modal-parcels-dropdown"
            dropdownId="order-detail-update-delivery-modal-parcels-dropdown"
          />
        </v-col>

        <v-col cols="10" offset="1" class="mb-5">
          <mp-select
            data-id="order-detail-update-delivery-modal-status"
            :label="$t('common.status')"
            v-model="selectedStatusIndex"
            :items="
              availableStatus.map((status, index) => ({
                value: index,
                text: $t([
                  `technical.status.delivery.${status.status}.${status.subStatus}`,
                  `technical.status.delivery.${status.status}.default`,
                ]),
              }))
            "
            attach="#order-detail-update-delkvery-modal-status-dropdown"
            dropdownId="order-detail-update-delkvery-modal-status-dropdown"
          />
        </v-col>

        <!-- date and hour -->
        <v-col
          cols="10"
          sm="5"
          offset="1"
          :class="`mb-5 date-hour-outer-wrapper${$vuetify.breakpoint.smAndUp ? ' pr-2' : ''}`"
        >
          <mp-date-picker
            :refs="{ menu: 'datepickerMenuRef', textfield: 'pickupDate', picker: 'picker' }"
            dataId="order-detail-update-delivery-modal-date"
            :label="`${$t('common.date')} *`"
            v-model="pickingDate"
            :dateHelper="dateHelper"
            :min="getMinDate"
            @input="$v.pickingDate.$touch()"
            @blur="$v.pickingDate.$touch()"
            :errors="getModelErrors($v.pickingDate, { min: getMinDate })"
            :isDirty="$v.pickingDate.$dirty"
          />
        </v-col>

        <v-col
          cols="10"
          sm="5"
          offset="1"
          offset-sm="0"
          :class="`mb-5 time-wrapper${$vuetify.breakpoint.smAndUp ? ' pl-2' : ''}`"
        >
          <mp-vue-time-picker
            v-model="pickingTime"
            :placeholder="`${$t('common.hour')} *`"
            dataId="order-detail-update-delivery-modal-time"
            @input="$v.pickingTime.$touch()"
            @blur="$v.pickingTime.$touch()"
            :errors="getModelErrors($v.pickingTime, { min: getMinTime(false, true) })"
            :isDirty="$v.pickingTime.$dirty"
            :hourRange="getMinTime(true)"
            :minuteRange="getMinTime(false)"
          />
        </v-col>

        <v-col cols="10" offset="1">
          <timezone-autocomplete
            :timezone="timezone"
            dataId="order-detail-update-delivery-timezone"
            @updateTimezone="handleChangeTimezone($event)"
            :label="`${$t('common.timezone')} *`"
            @input="$v.timezone.$touch()"
            @blur="$v.timezone.$touch()"
            :errors="getModelErrors($v.timezone)"
            :isDirty="$v.timezone.$dirty"
          />
        </v-col>

        <!-- Pictures -->
        <v-col cols="10" offset="1" class="picture-outer-wrapper d-flex">
          <div v-if="displayedSelectedFiles.length" class="d-flex">
            <div
              v-for="(image, index) of displayedSelectedFiles"
              :key="`preview-${index}`"
              class="d-flex justify-center align-center"
            >
              <v-img
                :src="image"
                max-height="14.8rem"
                max-width="14.8rem"
                contain
                class="mr-4"
              >
                <div class="close-icon" @click="removePicture(index)">
                  <v-icon>mdi-close-circle</v-icon>
                </div>
              </v-img>
            </div>
          </div>

          <div
            class="picture-wrapper"
            @click="openUploader()"
            v-if="displayedSelectedFiles.length < 2"
          >
            <v-icon>mdi-camera</v-icon>
            <span class="regular16 main-color">{{ $t('action.add.picture') }}</span>
          </div>

          <input
            ref="uploader"
            class="d-none"
            type="file"
            accept="image/*"
            @change="onFileChanged"
          />
        </v-col>

        <!-- Comment -->
        <v-col cols="10" offset="1" class="comment-outer-wrapper">
          <mp-textarea
            :label="$t('common.comment')"
            v-model="comment"
            dataId="order-detail-update-delivery-modal-comment"
            autoGrow
            :rows="1"
            :isDirty="false"
          />
        </v-col>

        <v-overlay :value="showLoader" absolute>
          <div class="d-flex flex-column justify-center align-center">
            <v-progress-circular indeterminate size="64" class="primary-color" />
            <h3 class="mt-3">{{ $t('page.detailOrder.deliveryStatus.info') }}</h3>
          </div>
        </v-overlay>
      </v-row>
    </template>
  </mp-dialog-confirmation>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'

import {
  dateHelper,
  dateHelperGetTimezonedDate,
  dateHelperGetUtcDate,
  dateHelperSetUtcTime,
  OperationUnit,
} from '@/helpers/dateHelper'
import { validationMixin } from '@/mixins'

import TimezoneAutocomplete from '@/components/form/timezoneAutocomplete/timezoneAutocomplete.vue'

import DeliveryService from '@/services/delivery/DeliveryService'
import { DELIVERY_STATUS_DETAIL, DELIVERY_STATUS } from '@/constants'
import { required, requiredIf } from 'vuelidate/lib/validators'
import { DeliveryStatusEntity, DialogOrderDetailUpdateStatus, Parcel } from '@/types'

export default mixins(validationMixin).extend({
  name: 'mp-update-delivery',
  components: {
    TimezoneAutocomplete,
  },
  props: {
    deliveryStatus: {
      type: Array as () => DeliveryStatusEntity[],
      required: true,
    },
    deliveryId: {
      type: Number,
      required: true,
    },
    parcels: {
      type: Array as () => Parcel[],
      required: false,
    },
  },
  data: () => ({
    availableStatus: DELIVERY_STATUS_DETAIL.filter(
      ({ status }) => ![DELIVERY_STATUS.CANCELLED, DELIVERY_STATUS.REPLANNED, DELIVERY_STATUS.CLOSED].includes(status),
    ),
    selectedStatusIndex: 0,
    showMore: false,
    pickingDate: '',
    pickingTime: '',
    dateHelper,
    showMenuDate: false,
    showMenuTime: false,
    selectedFiles: [] as File[],
    displayedSelectedFiles: [] as string[],
    comment: '',
    timezone: '',
    parcelId: '',
    handlingUnits: [
      {
        label: 'page.detailOrder.delivery.update.delivery',
        key: 'delivery',
        icon: 'icon_delivery.svg',
      },
      {
        label: 'page.detailOrder.delivery.update.parcel',
        key: 'parcel',
        icon: 'icon_parcel.svg',
      },
    ] as Array<Record<string, any>>,
    selectedHandlingUnitIndex: 0,
    hasData: false,
    showLoader: false,
  }),
  computed: {
    getParcels(): Array<{ text: string; value: string }> {
      return this.parcels.map(({ externalParcelId }) => ({
        value: externalParcelId,
        text: externalParcelId,
      }))
    },
    getSelectedHandlingUnitType(): string {
      return this.handlingUnits[this.selectedHandlingUnitIndex].key
    },
    lastStatusDate(): Date {
      const lastStatus = this.deliveryStatus[this.deliveryStatus.length - 1]
      return dateHelper.parseISO(lastStatus.date)
    },
    getMinDate(): string {
      return dateHelper.format(this.lastStatusDate, 'yyyy-MM-dd')
    },
  },
  validations() {
    const { lastStatusDate, getSelectedHandlingUnitType, timezone, pickingDate } = this

    return {
      timezone: { required },
      pickingDate: {
        required,
        dateMin(value: string): boolean {
          return dateHelper.isSameOrAfter(
            new Date(value).toISOString(),
            lastStatusDate,
            OperationUnit.DAYS,
          )
        },
      },
      pickingTime: {
        required,
        clockRule(value) {
          return (this as any).clockRule(value)
        },
        timeMin(value: string): boolean {
          const [hours, minutes] = value.toString().split(':')

          return dateHelper.isSameOrAfter(
            dateHelperGetUtcDate(
              dateHelperSetUtcTime(new Date(pickingDate), {
                hours: Number(hours),
                minutes: Number(minutes),
                seconds: 0,
                milliseconds: 0,
              }).toISOString(),
              timezone,
            ),
            lastStatusDate,
            OperationUnit.MINUTES,
          )
        },
      },
      parcelId: {
        required: requiredIf((): boolean => {
          return getSelectedHandlingUnitType === 'parcel'
        }),
      },
    }
  },
  beforeMount() {
    const now = dateHelperGetTimezonedDate()

    this.pickingDate = dateHelper.formatToTimezone(now, 'UTC', 'yyyy-MM-dd')
    this.pickingTime = dateHelper.formatToTimezone(now, 'UTC', 'HH:mm')
    this.timezone = 'Europe/Paris'
  },
  mounted() {
    const now = dateHelperGetTimezonedDate()

    this.pickingDate = dateHelper.formatToTimezone(this.lastStatusDate, 'UTC', 'yyyy-MM-dd')
    this.pickingTime = dateHelper.formatToTimezone(now, 'UTC', 'HH:mm')
    this.timezone = 'Europe/Paris'

    this.hasData = true
  },
  methods: {
    openDateMenu() {
      this.showMenuDate = true
    },
    openUploader() {
      ;(this.$refs.uploader as HTMLFormElement).click()
    },
    onFileChanged(e: { target: HTMLInputElement }) {
      this.selectedFiles.push(e.target.files![0])

      this.displayedSelectedFiles.push(URL.createObjectURL(e.target.files![0]))
    },
    removePicture(index: number) {
      this.displayedSelectedFiles.splice(index, 1)
      this.selectedFiles.splice(index, 1)
    },
    handleChangeTimezone(newTimezone: string) {
      this.timezone = newTimezone
    },
    handleHandlingUnitTypeSelection(index: number) {
      this.selectedHandlingUnitIndex = index
      this.parcelId = ''
    },
    async sendUpdate() {
      this.showLoader = true
      const form: DialogOrderDetailUpdateStatus = {
        status: this.availableStatus[this.selectedStatusIndex].status,
        subStatus: this.availableStatus[this.selectedStatusIndex].subStatus,
        date: this.pickingDate,
        time: this.pickingTime,
        timezone: this.timezone,
        files: this.selectedFiles,
        comment: this.comment,
        ...(this.parcelId && { parcelId: this.parcelId }),
      }

      await DeliveryService.updateStatus(this.deliveryId, form)

      this.showLoader = false

      this.$emit('submit')
    },
    getIconSource(handlingUnit: Record<string, any>) {
      return require(`@/assets/icons/${handlingUnit.icon}`)
    },
    getMinTime(hour = true, returnTime = false) {
      let min = 0
      const max = hour ? 24 : 60

      const time = dateHelper.isAfter(this.pickingDate, this.lastStatusDate)
        ? '00:00'
        : dateHelper.format(this.lastStatusDate, 'HH:mm')

      if (returnTime) {
        return time
      }

      if(dateHelper.isAfter(this.pickingDate, this.lastStatusDate)) {
       return Array.from({ length: max }, (_, i) => i)
      }
      min = parseInt(time.split(':')[hour ? 0 : 1], 10)

      return Array.from({ length: max - min }, (_, i) => i + min)
    },
  },
  watch: {
    showMenuDate(next: boolean) {
      if (!next) {
        this.showMenuTime = true
      }
    },
  },
})
</script>

<style lang="scss">
@import '../../../../styles/mixins/macScrollbar';

.order-detail-updateDelivery {
  .main-dialog-content {
    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      max-height: calc(100vh - 30rem);
    }

    @media #{map-get($display-breakpoints, 'xs-only')} {
      max-height: calc(100vh - 5.2rem - 6rem) !important;
      height: calc(100vh - 5.2rem - 8rem) !important;
    }

    padding: 0;
    overflow-y: auto;
    @include setMacScrollbar('&');

    .handling-unit-outer-wrapper {
      margin-top: 2.5rem;
      margin-bottom: 2.5rem;
      overflow-x: auto;
      @include setMacScrollbar('&');

      .handling-unit-wrapper {
        display: flex;

        & > div {
          display: flex;
          flex-direction: column;
        }

        .handling-unit {
          border: solid 0.1rem $main-lighten-65-color;
          border-radius: 0.4rem;
          margin-right: 1.5rem;
          min-width: 21.5rem;
          padding: 1.5rem 2.4rem 1.7rem 2.4rem;
          text-align: center;
          color: $main-color;
          align-items: center;
          display: flex;
          justify-content: center;
          cursor: pointer;

          &.selected {
            border: solid 0.2rem $main-color;
          }

          &.see-more {
            min-width: fit-content;
            cursor: pointer;
            padding: 1.5rem 1.8rem;
          }
        }
      }
    }

    .hidden {
      visibility: hidden;
    }

    .visible {
      visibility: visible;
    }

    .picture-outer-wrapper {
      margin-top: 4rem;
      overflow-x: auto;
      @include setMacScrollbar('&');

      .close-icon {
        display: flex;
        justify-content: flex-end;
        padding-top: 0.3rem;
        padding-right: 0.3rem;
        cursor: pointer;

        i {
          color: $main-color;
          background-color: $white;
          border-radius: 50%;
        }
      }

      .picture-wrapper {
        min-width: 14.8rem;
        min-height: 14.8rem;
        border: 0.1rem dashed $main-lighten-52-color;
        border-radius: 0.4rem;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        padding-left: 1rem;
        padding-right: 1rem;
        text-align: center;
        cursor: pointer;

        i {
          color: $main-color;
        }
      }
    }

    .comment-outer-wrapper {
      margin-top: 4rem;
    }

    .time-wrapper {
      max-height: 5.4rem;
      display: flex;
      align-items: flex-end;
    }
  }
}
</style>
