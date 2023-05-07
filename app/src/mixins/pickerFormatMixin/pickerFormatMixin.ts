import Vue from 'vue'
import {
  LOCALE_TIME_PICKER_FORMAT_24H,
  PICKER_FORMAT,
  LOCALE_TIME_PICKER_FORMAT_AM_PM,
} from '@/constants'

export default Vue.extend({
  computed: {
    pickerFormat(): string {
      if (LOCALE_TIME_PICKER_FORMAT_24H.includes(this.$i18n.i18next.language)) {
        return PICKER_FORMAT.HOURS24
      } else if (LOCALE_TIME_PICKER_FORMAT_AM_PM.includes(this.$i18n.i18next.language)) {
        return PICKER_FORMAT.AMPM
      } else {
        return PICKER_FORMAT.HOURS24
      }
    },
  },
})
