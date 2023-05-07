import { helpers, ValidationRule } from 'vuelidate/lib/validators'
import { dateHelper } from './dateHelper'

export default (date: string | { date: string; timezoneMessage: boolean }): ValidationRule =>
  helpers.withParams({ type: 'dateIsSameOrBefore', min: date }, (value: any): boolean => {
    if (typeof date === 'string') {
      date = { date, timezoneMessage: false }
    }
    const localValue = dateHelper
      .set(dateHelper.getDate(value), { seconds: 0, milliseconds: 0 })
      .getTime()
    const localDate = dateHelper
      .set(dateHelper.getDate(date.date), { seconds: 0, milliseconds: 0 })
      .getTime()
    return !helpers.req(value) || localValue >= localDate
  })
