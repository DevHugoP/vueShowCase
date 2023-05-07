<template>
  <mp-dialog-confirmation
    v-if="hasLoaded"
    classWrapper="notification-activation-range-modal"
    dataId="range-modal"
    persistent
    color="primary"
    :header="{
      iconClose: 'mdi-close',
      icon: $vuetify.breakpoint.smAndUp ? 'mdi-information-variant' : '',
      isColorBackground: true,
      text: modalTitle,
      textPolice: 'regular14',
    }"
    :btnCancel="{
      text: $t('action.cancel.base'),
      format: $vuetify.breakpoint.xsOnly ? 'sticky' : 'link',
      linkColor: $vuetify.breakpoint.xsOnly ? undefined : 'black',
      stickyColor: $vuetify.breakpoint.xsOnly ? 'yellow' : undefined,
    }"
    :btnValidation="{
      text: $t('action.save'),
      format: $vuetify.breakpoint.xsOnly ? 'sticky' : 'success',
      icon: $vuetify.breakpoint.xsOnly ? undefined : 'content-save',
      stickyColor: $vuetify.breakpoint.xsOnly ? 'yellow' : undefined,
      disabled: $v.$invalid,
    }"
    @close="$emit('close')"
    @submit="saveRange"
    :fullscreen="$vuetify.breakpoint.xsOnly"
  >
    <template #content v-if="hasLoaded">
      <v-row no-gutters>
        <v-col cols="10" offset="1">
          <div
            :class="
              `notification-wrapper ${
                rangeStatus() ? 'active-notification' : 'inactive-notification'
              }`
            "
          >
            <v-icon size="1.6rem" :class="rangeStatus() ? 'success-color' : 'alert-color'">
              {{
                `${
                  notificationActivation.channel === 'MAIL' ? 'mdi-email' : 'mdi-message-bulleted'
                }${rangeStatus() ? '' : '-off'}`
              }}
            </v-icon>
            <span class="regular14">
              {{ label }}
            </span>
          </div>

          <v-row no-gutters class="date-wrapper">
            <v-col cols="8">
              <mp-date-picker
                v-if="form.notificationActivationRange.startDate"
                :refs="{ menu: 'datepickerMenuRef', textfield: 'pickupDate', picker: 'picker' }"
                dataId="notification-activation-range-start-date"
                :label="`${$t('common.from')} *`"
                v-model="form.notificationActivationRange.startDate"
                @input="$v.form.notificationActivationRange.startDate.$touch()"
                @blur="$v.form.notificationActivationRange.startDate.$touch()"
                :errors="getModelErrors($v.form.notificationActivationRange.startDate)"
                :isDirty="$v.form.notificationActivationRange.startDate.$dirty"
                :dateHelper="dateHelper"
              />
            </v-col>

            <v-col cols="4">
              <mp-vue-time-picker
                placeholder=""
                dataId="notification-activation-range-start-time"
                v-model="form.notificationActivationRange.startTime"
                @input="$v.form.notificationActivationRange.startTime.$touch()"
                @blur="$v.form.notificationActivationRange.startTime.$touch()"
                :errors="getModelErrors($v.form.notificationActivationRange.startTime)"
                :isDirty="$v.form.notificationActivationRange.startTime.$dirty"
              />
            </v-col>
          </v-row>

          <v-row no-gutters class="date-wrapper">
            <v-col cols="8">
              <mp-date-picker
                v-if="form.notificationActivationRange.endDate"
                :refs="{ menu: 'datepickerMenuRef', textfield: 'pickupDate', picker: 'picker' }"
                dataId="notification-activation-range-end-date"
                :label="`${$t('common.to')} *`"
                v-model="form.notificationActivationRange.endDate"
                @input="$v.form.notificationActivationRange.endDate.$touch()"
                @blur="$v.form.notificationActivationRange.endDate.$touch()"
                :errors="getModelErrors($v.form.notificationActivationRange.endDate)"
                :isDirty="$v.form.notificationActivationRange.endDate.$dirty"
                :dateHelper="dateHelper"
              />
            </v-col>

            <v-col cols="4">
              <mp-vue-time-picker
                placeholder=""
                dataId="notification-activation-range-end-time"
                v-model="form.notificationActivationRange.endTime"
                @input="$v.form.notificationActivationRange.endTime.$touch()"
                @blur="$v.form.notificationActivationRange.endTime.$touch()"
                :errors="getModelErrors($v.form.notificationActivationRange.endTime)"
                :isDirty="$v.form.notificationActivationRange.endTime.$dirty"
              />
            </v-col>
          </v-row>

          <div>
            <timezone-autocomplete
              :timezone="form.notificationActivationRange.timezone"
              dataId="order-create-pickupStep-contact-timezone"
              @updateTimezone="handleChangeTimezone($event)"
              :label="`${$t('common.timezone')} *`"
              @input="$v.form.notificationActivationRange.timezone.$touch()"
              @blur="$v.form.notificationActivationRange.timezone.$touch()"
              :errors="getModelErrors($v.form.notificationActivationRange.timezone)"
              :isDirty="$v.form.notificationActivationRange.timezone.$dirty"
            />
          </div>
        </v-col>
      </v-row>
    </template>
  </mp-dialog-confirmation>
</template>

<script lang="ts">
import { NotificationActivationEntity } from '@/types/entities/notificationActivations'
import mixins from 'vue-typed-mixins'
import { dateHelper, dateHelperGetUtcDate } from '@/helpers/dateHelper'
import { pickerFormatMixin, validationMixin } from '@/mixins'
import { required } from 'vuelidate/lib/validators'
import TimezoneAutocomplete from '@/components/form/timezoneAutocomplete/timezoneAutocomplete.vue'
import NotificationActivationsService from '@/services/notificationActivations/NotificationActivationsService'

export default mixins(pickerFormatMixin, validationMixin).extend({
  name: 'set-range-modal',
  components: {
    TimezoneAutocomplete,
  },
  props: {
    notificationActivation: {
      type: Object as () => NotificationActivationEntity,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    retailerIds: {
      type: Array as () => number[],
      required: false,
    }
  },
  data: () => ({
    hasLoaded: false,
    dateHelper,
    modalTitle: '',
    form: {
      notificationActivationRange: null as {
        startDate: string
        startTime: string
        endDate: string
        endTime: string
        timezone: string
      } | null,
    },
  }),
  methods: {
    handleChangeTimezone(newTimezone: string): void {
      this.form.notificationActivationRange!.timezone = newTimezone
    },
    isFormRangeValid(): boolean {
      if (!this.form.notificationActivationRange?.startTime || !this.form.notificationActivationRange?.endTime) {
        return false
      }
      return dateHelper.isSameOrBefore(
        dateHelper.getDate(
          `${this.form.notificationActivationRange?.startDate}T${this.form.notificationActivationRange?.startTime}Z`,
        ),
        dateHelper.getDate(
          `${this.form.notificationActivationRange?.endDate}T${this.form.notificationActivationRange?.endTime}Z`,
        ),
      )
    },
    isFormStartDateValid(): boolean {

      if (!this.form.notificationActivationRange?.startTime || !this.form.notificationActivationRange?.timezone) {
        return false
      }

      if (this.notificationActivation.range) {
        return true
      }

      const now = new Date()
      now.setSeconds(0, 0)

      return dateHelper.isSameOrAfter(
        dateHelperGetUtcDate(
          `${this.form.notificationActivationRange?.startDate}T${this.form.notificationActivationRange?.startTime}:00.000Z`,
          this.form.notificationActivationRange?.timezone
        ),
        dateHelperGetUtcDate(dateHelper.getDate(now).toISOString())
      )
    },
    async saveRange(): Promise<void> {
      const payload = {
        active: this.notificationActivation.active || false,
        range: {
          timezone: this.form.notificationActivationRange!.timezone,
          start: dateHelper
            .getUtcDate(
              dateHelper.parse(
                `${this.form.notificationActivationRange?.startDate} ${this.form.notificationActivationRange?.startTime}`,
                'yyyy-MM-dd HH:mm',
              ),
              this.form.notificationActivationRange?.timezone,
            )
            .toISOString(),
          end: dateHelper
            .getUtcDate(
              dateHelper.parse(
                `${this.form.notificationActivationRange?.endDate} ${this.form.notificationActivationRange?.endTime}`,
                'yyyy-MM-dd HH:mm',
              ),
              this.form.notificationActivationRange?.timezone,
            )
            .toISOString(),
          activation: !this.notificationActivation.active,
        },
      }

      if (['SET_RANGE_ALL_MAIL', 'SET_RANGE_ALL_SMS'].includes(this.action)) {
        await NotificationActivationsService.updateAllByChannelAndRetailer(
          this.retailerIds,
          this.notificationActivation.channel,
          payload,
        )
      } else {
        await NotificationActivationsService.update(this.notificationActivation.id, payload)
      }

      this.$emit('reloadData')
    },
    rangeStatus(): boolean {
      return this.notificationActivation.range
        ? this.notificationActivation.range.activation
        : !this.notificationActivation.active
    },
  },
  computed: {
    label(): string {
      return this.$t(
        `page.notificationAdministration.${this.notificationActivation.channel}_${
          this.rangeStatus() ? 'enabled' : 'disabled'
        }`,
      )
    },
  },
  validations() {
    return {
      form: {
        notificationActivationRange: {
          startDate: {
            required,
            isRangeValid(): boolean {
              return (this as any).isFormRangeValid()
            },
            isStartDateValid(): boolean {
               return (this as any).isFormStartDateValid()
            },
          },
          endDate: {
            required,
            isRangeValid(): boolean {
              return (this as any).isFormRangeValid()
            },
          },
          startTime: {
            required,
            isRangeValid(): boolean {
              return (this as any).isFormRangeValid()
            },
            isStartDateValid(): boolean {
               return (this as any).isFormStartDateValid()
            },
          },
          endTime: {
            required,
            isRangeValid(): boolean {
              return (this as any).isFormRangeValid()
            },
          },
          timezone: { required },
        },
      },
    }
  },
  async mounted() {
    this.modalTitle = this.$t(
      `page.notificationAdministration.rangeModal.title.${
        [
          'SET_RANGE_SMS',
          'SET_RANGE_MAIL',
          'SET_RANGE_ALL_MAIL',
          'SET_RANGE_ALL_SMS'
        ].includes(this.action) ? 'setRange' : 'modifyRange'
      }`,
    )

    const timezone = this.notificationActivation.range?.timezone || 'Europe/Paris'

    const [startDate, startTime] = dateHelper
      .formatToTimezone(
        this.notificationActivation.range?.start || new Date(),
        timezone,
        'yyyy-MM-dd HH:mm',
      )
      .split(' ')

    const [endDate, endTime] = dateHelper
      .formatToTimezone(
        this.notificationActivation.range?.end || new Date(),
        timezone,
        'yyyy-MM-dd HH:mm',
      )
      .split(' ')

    this.form.notificationActivationRange = {
      startDate,
      startTime,
      endDate,
      endTime,
      timezone,
    }

    this.hasLoaded = true
  },
})
</script>

<style lang="scss">
.notification-activation-range-modal {
  .main-dialog-content {
    min-height: 30.4rem;
    padding: 0;

    @media #{map-get($display-breakpoints, 'xs-only')} {
      min-height: calc(100vh - 5.2rem - 8rem);
      max-height: calc(100vh - 5.2rem - 8rem);
    }

    .notification-wrapper {
      margin-top: 2rem;
      margin-bottom: 3rem;
      display: flex;
      align-items: center;

      .v-icon {
        margin-right: 1rem;
      }

      &.inactive-notification {
        color: $alert-color !important;
      }

      &.active-notification {
        color: $success-color !important;
      }
    }

    .date-wrapper {
      display: flex;
      margin-bottom: 3rem;

      > div:first-child {
        min-width: 65%;
        padding-right: 2rem !important;
      }

      .placeholder {
        display: none;
      }

      .mp-time-picker {
        margin-top: -0.2rem;
      }
    }
  }
}
</style>
