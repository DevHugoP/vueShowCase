import Vue from 'vue'

export default Vue.extend({
  computed: {
    locale() {
      // Force language to FR (waiting translation)
      return 'fr'
      // return this.$i18n.i18next.language
    },
  },
})
