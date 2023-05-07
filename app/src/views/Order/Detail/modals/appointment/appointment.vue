<template>
  <mp-dialog-confirmation
    v-if="hasData"
    classWrapper="order-detail-appointment"
    @close="$emit('hide')"
    @submit="save()"
    dataId="order-detail-appointment"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    color="primary"
    :header="{
      icon: 'mdi-file-edit-outline',
      isColorBackground: true,
      text: $t('page.detailOrder.appointment.title'),
      textPolice: 'h4',
      iconClose: 'mdi-close',
    }"
    :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
    :btnValidation="{
      text: $t('action.confirm.base'),
      format: 'success',
      disabled: $v.$invalid,
    }"
    :btnToColumn="$vuetify.breakpoint.xsOnly"
    maxWidth="58.6rem"
  >
    <template #content>
      <v-form
        id="order-detail-appointment-form"
        v-model="validForm"
        data-id="order-detail-appointmen-form"
        class="mt-8"
      >
        <v-col cols="12" class="commitment">
          <v-row no-gutters>
            <mp-date-picker
              :refs="{ menu: 'datepickerMenuRef', textfield: 'formDate', picker: 'picker' }"
              :dataId="`${dataId}-appointment-date`"
              :label="`${$t('common.date')} *`"
              v-model="form.appointmentDate"
              :dateHelper="dateHelper"
              @input="$v.form.appointmentDate.$touch()"
              @blur="$v.form.appointmentDate.$touch()"
              :errors="getModelErrors($v.form.appointmentDate)"
              :isDirty="$v.form.appointmentDate.$dirty"
              :min="order.picking.interval[0].start"
            />
          </v-row>
        </v-col>

        <v-col cols="12" class="commitment">
          <v-row no-gutters>
            <v-col cols="10" sm="6" :class="`${$vuetify.breakpoint.smAndUp ? ' pr-2' : ''}`">
              <mp-vue-time-picker
                v-model="form.startTime"
                :placeholder="`${$t('common.beginningHour')} *`"
                :dataId="`${dataId}-appointment-start-time`"
                @input="$v.form.startTime.$touch()"
                @blur="$v.form.startTime.$touch()"
                :errors="getModelErrors($v.form.startTime)"
                :isDirty="$v.form.startTime.$dirty"
                :hourRange="getMaxStartTime(true)"
                :minuteRange="getMaxStartTime(false)"
              />
            </v-col>

            <v-col cols="10" sm="6" :class="`${$vuetify.breakpoint.smAndUp ? ' pl-2' : ''}`">
              <mp-vue-time-picker
                v-model="form.endTime"
                :placeholder="`${$t('common.endHour')} *`"
                :dataId="`${dataId}-appointment-end-time`"
                @input="$v.form.endTime.$touch()"
                @blur="$v.form.endTime.$touch()"
                :errors="getModelErrors($v.form.endTime)"
                :isDirty="$v.form.endTime.$dirty"
                :hourRange="getMinEndTime(true)"
                :minuteRange="getMinEndTime(false)"
              />
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" class="commitment">
          <v-row no-gutters>
            <timezone-autocomplete
              :timezone="form.timezone"
              dataId="order-create-pickupStep-contact-timezone"
              @updateTimezone="handleChangeTimezone($event)"
              :label="`${$t('common.timezone')} *`"
              @input="$v.form.timezone.$touch()"
              @blur="$v.form.timezone.$touch()"
              :errors="getModelErrors($v.form.timezone)"
              :isDirty="$v.form.timezone.$dirty"
            />
          </v-row>
        </v-col>
      </v-form>
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
} from '@/helpers/dateHelper'

import { pickerFormatMixin, validationMixin } from '@/mixins'
import { required } from 'vuelidate/lib/validators'
import TimezoneAutocomplete from '@/components/form/timezoneAutocomplete/timezoneAutocomplete.vue'

import OrderService from '@/services/order/OrderService'
import DeliveryService from '@/services/delivery/DeliveryService'
import { OrderEntity } from '@/types'

export default mixins(validationMixin, pickerFormatMixin).extend({
  name: 'order-detail-appointment',
  components: {
    TimezoneAutocomplete,
  },
  props: {
    showDialog: {
      type: Boolean,
      required: true,
    },
    dataId: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    dateHelper,
    form: {
      appointmentDate: '' as string | null,
      startTime: '' as string | null,
      endTime: '' as string | null,
      timezone: 'Europe/Paris' as string,
    },
    order: null as OrderEntity | null,
    validForm: false,
    appointment: {} as {
      start: string
      end: string
    },
    hasData: false,
    deliveryId: '' as string | null,
  }),
  validations: {
    form: {
      appointmentDate: {
        required,
        afterPicking() {
          try {
            return dateHelper.isAfter(
              dateHelperGetTimezonedDate(
                dateHelperSetUtcTime(new Date(this.form.appointmentDate!), {
                  hours: parseInt(this.form.startTime!.split(':')[0], 10),
                  minutes: parseInt(this.form.startTime!.split(':')[1], 10),
                  seconds: 0,
                  milliseconds: 0,
                }),
                this.form.timezone,
              ).toISOString(),
              dateHelperGetTimezonedDate(this.order!.picking.interval[0].start, this.form.timezone),
            )
          } catch (e) {
            return false
          }
        },
      },
      startTime: {
        required,
        beforeEnd() {
          return this.maxTime(this.form.startTime as string, this.form.endTime as string)
        },
      },
      endTime: {
        required,
        afterBeginning() {
          return this.maxTime(this.form.startTime as string, this.form.endTime as string)
        },
      },
      timezone: { required },
    },
  },
  async mounted() {
    const order = await OrderService.get(parseInt(this.$route.params.id, 10), {
      personalData: true,
    })
    const {
      delivery: {
        interval: [{ start, end }],
        contact: { timezone },
      },
      Delivery: { id: deliveryId },
    } = order

    const startDate = dateHelperGetTimezonedDate(start)
    const endDate = dateHelperGetTimezonedDate(end)

    this.order = order
    this.deliveryId = deliveryId
    this.form = {
      appointmentDate: dateHelper.formatToTimezone(startDate, 'UTC', 'yyyy-MM-dd'),
      startTime: dateHelper.formatToTimezone(startDate, 'UTC', 'HH:mm'),
      endTime: dateHelper.formatToTimezone(endDate, 'UTC', 'HH:mm'),
      timezone,
    }

    this.hasData = true
  },
  methods: {
    async save() {
      const start = dateHelperGetUtcDate(
        dateHelperSetUtcTime(new Date(this.form.appointmentDate!), {
          hours: parseInt(this.form.startTime!.split(':')[0], 10),
          minutes: parseInt(this.form.startTime!.split(':')[1], 10),
          seconds: 0,
          milliseconds: 0,
        }).toISOString(),
        this.form.timezone,
      ).toISOString()

      const end = dateHelperGetUtcDate(
        dateHelperSetUtcTime(new Date(this.form.appointmentDate!), {
          hours: parseInt(this.form.endTime!.split(':')[0], 10),
          minutes: parseInt(this.form.endTime!.split(':')[1], 10),
          seconds: 0,
          milliseconds: 0,
        }).toISOString(),
        this.form.timezone,
      ).toISOString()

      this.appointment = {
        start,
        end,
      }

      if (!this.deliveryId) {
        return
      }

      await DeliveryService.createAppointment(this.deliveryId, this.appointment)
      this.$emit('saveAppointment')
    },
    handleChangeTimezone(newTimezone: string) {
      this.form.timezone = newTimezone
    },
    getMaxStartTime(hour = false) {
      const min = 0
      let max = hour ? 24 : 60

      max = parseInt(this.form.endTime!.split(':')[hour ? 0 : 1], 10) + 1

      return Array.from({ length: max - min }, (_, i) => i + min)
    },
    getMinEndTime(hour = false) {
      let min = 0
      const max = hour ? 24 : 60

      min = parseInt(this.form.startTime!.split(':')[hour ? 0 : 1], 10)
      return Array.from({ length: max - min }, (_, i) => i + min)
    },
  },
})
</script>

<style lang="scss">
.order-detail-appointment {
  @import '../../../../../styles/mixins/macScrollbar';

  .main-dialog-content {
    padding: 0 1rem 0 2rem !important;
    overflow-y: scroll;
    @include setMacScrollbar('&');
    max-height: calc(100vh - 18rem - 12.6rem);

    @media #{map-get($display-breakpoints, 'xs-only')} {
      max-height: calc(100vh - 25.7rem);
    }
  }

  @media #{map-get($display-breakpoints, 'xs-only')} {
    .v-card__actions {
      padding: 0;

      .actions-outer-wrapper {
        min-height: 6rem;

        .mp-button--sticky {
          min-height: 6rem;
          min-width: 100% !important;
        }
      }
    }
  }
}
</style>
