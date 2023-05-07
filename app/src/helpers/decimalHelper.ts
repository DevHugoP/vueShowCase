import { helpers } from 'vuelidate/lib/validators'

export default (limit: any): any =>
  helpers.withParams({ type: 'isDecimalTooLong', limit }, (value: any): boolean => {
    return new RegExp(`^\\s*-?(\\d+(\\.\\d{1,${limit}})?|\\,\\d{1,${limit}})\\s*$`).test(value)
  })
