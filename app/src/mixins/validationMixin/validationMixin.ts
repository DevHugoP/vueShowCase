import { dateHelper, dateHelperFormatToTimezone } from '@/helpers/dateHelper'
import Vue from 'vue'
import { validationMixin, Validation } from 'vuelidate'

export enum ValidationRulesNames {
  REQUIRED = 'required',
  ALPHA_NUM = 'alphaNum',
  MIN_LENGTH = 'minLength',
  MAX_LENGTH = 'maxLength',
  EMAIL = 'email',
  CONTAINS_NUMBER = 'containsNumber',
  CONTAINS_SPECIAL = 'containsSpecial',
  CONTAINS_UPPERCASE = 'containsUppercase',
  SAME_AS_PASSWORD = 'sameAsPassword',
  URL = 'url',
  VALID_PHONE = 'validPhone',
  BETWEEN = 'between',
  MAX_COMBINED = 'maxCombined',
  MAX_VALUE = 'maxValue',
  MIN_VALUE = 'minValue',
  IS_UNIQUE = 'isUnique',
  DECIMAL = 'decimal',
  INTEGER = 'integer',
  CUSTOM_CAPACITY = 'customCapacity',
  CLOCK_RULE = 'clockRule',
  MAX_TIME_SLOT = 'maxTimeSlot',
  MAX_TIME_SLOT_NEXT_DAY = 'maxTimeSlotNextDay',
  MAX_TIME_SLOT_SAME_DAY = 'maxTimeSlotSameDay',
  NO_OVERLAP_RULE = 'noOverlapRule',
  TIME_MIN = 'timeMin',
  MAX_SIZE = 'maxSize',
  MAX_SIZE_LOGO = 'maxSizeLogo',
  POSTAL_CODE = 'postalCode',
  DATE_IS_SAME_OR_BEFORE = 'dateIsSameOrBefore',
  MIN_ARRAY_REFERENCES_LENGTH = 'minArrayReferencesLength',
  IS_VALID_PHONE = 'validPhoneNumber',
  IS_AN_AVAILABLE_SERVICE = 'isAnAvailableService',
  IS_VALID_BOOKING_SLOTS = 'isValidBookingSlots',
  IS_DECIMAL_TOO_LONG = 'isDecimalTooLong',
}

export const translationKeyMapping: Record<ValidationRulesNames, string> = {
  [ValidationRulesNames.REQUIRED]: 'validation.required.base',
  [ValidationRulesNames.ALPHA_NUM]: 'validation.alphanumeric',
  [ValidationRulesNames.MIN_LENGTH]: 'validation.minLength',
  [ValidationRulesNames.MAX_LENGTH]: 'validation.maxLength',
  [ValidationRulesNames.EMAIL]: 'validation.email',
  [ValidationRulesNames.CONTAINS_NUMBER]: 'validation.contains.number',
  [ValidationRulesNames.CONTAINS_SPECIAL]: 'validation.contains.special',
  [ValidationRulesNames.CONTAINS_UPPERCASE]: 'validation.contains.uppercase',
  [ValidationRulesNames.SAME_AS_PASSWORD]: 'validation.sameAsPassword',
  [ValidationRulesNames.URL]: 'validation.url',
  [ValidationRulesNames.VALID_PHONE]: 'validation.badPhone',
  [ValidationRulesNames.BETWEEN]: 'validation.between',
  [ValidationRulesNames.MAX_COMBINED]: 'validation.maxCombined',
  [ValidationRulesNames.MAX_VALUE]: 'validation.maxValue',
  [ValidationRulesNames.MIN_VALUE]: 'validation.minValue',
  [ValidationRulesNames.IS_UNIQUE]: 'validation.isUnique',
  [ValidationRulesNames.DECIMAL]: 'validation.decimal',
  [ValidationRulesNames.INTEGER]: 'validation.integer',
  [ValidationRulesNames.CUSTOM_CAPACITY]: 'validation.integer',
  [ValidationRulesNames.CLOCK_RULE]: 'validation.clock',
  [ValidationRulesNames.MAX_TIME_SLOT]: 'validation.maxTimeSlot',
  [ValidationRulesNames.MAX_TIME_SLOT_NEXT_DAY]: 'validation.maxTimeSlotNextDay',
  [ValidationRulesNames.MAX_TIME_SLOT_SAME_DAY]: 'validation.maxTimeSlotSameDay',
  [ValidationRulesNames.NO_OVERLAP_RULE]: 'validation.noOverlap',
  [ValidationRulesNames.TIME_MIN]: 'common.beforeHour',
  [ValidationRulesNames.MAX_SIZE]: 'page.retailerDetail.catalogs.modal.fileError',
  [ValidationRulesNames.MAX_SIZE_LOGO]: 'validation.logoSize',
  [ValidationRulesNames.POSTAL_CODE]: 'validation.postalCode',
  [ValidationRulesNames.DATE_IS_SAME_OR_BEFORE]: 'validation.date.sameOrBefore',
  [ValidationRulesNames.MIN_ARRAY_REFERENCES_LENGTH]: 'validation.minLengthReferenceArray',
  [ValidationRulesNames.IS_VALID_PHONE]: 'validation.badPhone',
  [ValidationRulesNames.IS_AN_AVAILABLE_SERVICE]: 'page.order.keys.services.services',
  [ValidationRulesNames.IS_VALID_BOOKING_SLOTS]: 'page.validitySlotPeriod.error',
  [ValidationRulesNames.IS_DECIMAL_TOO_LONG]: 'validation.isDecimalTooLong',
}

export default Vue.extend({
  mixins: [validationMixin],
  methods: {
    getModelErrors(model: { [key: string]: any } & Validation, params?: { min?: string }) {
      const errors: string[] = []
      const { $params, $dirty } = model

      if (!$dirty) {
        return errors
      }

      for (const [key, value] of Object.entries($params)) {
        if (!model[key]) {
          switch (key) {
            case ValidationRulesNames.MAX_LENGTH: {
              errors.push(
                this.$t(translationKeyMapping[key as ValidationRulesNames], { count: value.max }),
              )
              break
            }
            case ValidationRulesNames.MIN_LENGTH: {
              errors.push(
                this.$t(translationKeyMapping[key as ValidationRulesNames], { count: value.min }),
              )
              break
            }
            case ValidationRulesNames.MAX_VALUE: {
              errors.push(
                this.$t(translationKeyMapping[key as ValidationRulesNames], { max: value.max }),
              )
              break
            }
            case ValidationRulesNames.MIN_VALUE: {
              errors.push(
                this.$t(translationKeyMapping[key as ValidationRulesNames], { min: value.min }),
              )
              break
            }
            case ValidationRulesNames.BETWEEN: {
              errors.push(
                this.$t(translationKeyMapping[key as ValidationRulesNames], {
                  min: value.min,
                  max: value.max,
                }),
              )
              break
            }
            case ValidationRulesNames.MAX_COMBINED: {
              errors.push(this.$t('common.weightingIndexes.warning'))
              break
            }
            case ValidationRulesNames.TIME_MIN: {
              errors.push(
                this.$t(translationKeyMapping[key as ValidationRulesNames], { min: params!.min }),
              )
              break
            }
            case ValidationRulesNames.DATE_IS_SAME_OR_BEFORE: {
              let timezoneMessage = false
              // Date helper timezone l'heure
              let localValue = value
              if (Object.getOwnPropertyDescriptor(localValue, '$sub')) {
                localValue = JSON.parse(JSON.stringify(value.$sub[value.$sub.length - 1]))
              }

              if (typeof localValue.min !== 'string') {
                timezoneMessage = localValue.min.timezoneMessage
                localValue.min = localValue.min.date
              }

              const hours = `${localValue.min.split('T')[1].split(':')[0]}:${
                localValue.min.split('T')[1].split(':')[1]
              }`

              errors.push(
                this.$t(translationKeyMapping[key as ValidationRulesNames], {
                  date: timezoneMessage
                    ? dateHelperFormatToTimezone(localValue.min, 'P p')
                    : `${dateHelper.format(dateHelper.getDate(localValue.min), 'P')} ${hours}`,
                }),
              )
              break
            }
            case ValidationRulesNames.MIN_ARRAY_REFERENCES_LENGTH: {
              errors.push(this.$t(translationKeyMapping[key as ValidationRulesNames]))
              break
            }
            case ValidationRulesNames.IS_DECIMAL_TOO_LONG: {
              errors.push(
                this.$t(translationKeyMapping[key as ValidationRulesNames], { limit: value.limit }),
              )
              break
            }
            default: {
              errors.push(this.$t(translationKeyMapping[key as ValidationRulesNames]))
              break
            }
          }
        }
      }

      return errors
    },
    clockRule(value: string) {
      return /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/.test(value)
    },
    maxTime(startTime: string, endTime: string) {
      if (!startTime || !endTime || startTime.length !== 5 || endTime.length !== 5) {
        return false
      }

      const [startTimeHour, startTimeMinute] = startTime
        .split(':')
        .map((time: string) => Number(time))
      const [endTimeHour, endTimeMinute] = endTime.split(':').map((time: string) => Number(time))

      if (startTime && endTime) {
        if (
          startTimeHour > endTimeHour ||
          (startTimeHour === endTimeHour && startTimeMinute > endTimeMinute)
        ) {
          return false
        }
      }
      return true
    },
    dateIsSameOrBefore(startDate: Date, endDate: Date) {
      return dateHelper.isSameOrBefore(startDate, endDate)
    },
    maxSizeLogo(value: File, maxSize: number) {
      if (!value?.size) {
        return true
      }

      if (!value || !value.size || value.size >= maxSize) {
        return false
      }
      return true
    },
  },
})
