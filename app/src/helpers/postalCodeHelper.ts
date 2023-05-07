import zipcodes from 'zipcodes-regex'

export default {
  isValid(countryCode: string): RegExp {
    return new RegExp((zipcodes as any)[countryCode])
  },
}
