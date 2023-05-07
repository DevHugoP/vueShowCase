import {
  SET_ACTIVE_FILTERS,
  SET_FILTERS,
  SET_IS_PANEL_DISPLAYED,
} from '@/store/modules/filters/mutations-types'
import { VFormType } from '@/types'
import queryString from 'query-string'
import Vue from 'vue'
import { mapMutations } from 'vuex'

export default Vue.extend({
  mounted() {
    if (this.$refs.form) {
      ;(this.$refs.form as VFormType).resetValidation()
    }

    this.setFilters({})
    this.setActiveFilters(0)
  },
  computed: {
    storeFilters() {
      return this.$store.getters['filters/filters']
    },
  },
  methods: {
    ...mapMutations('filters', {
      setFilters: SET_FILTERS,
      setActiveFilters: SET_ACTIVE_FILTERS,
      setIsFilterPanelDisplayed: SET_IS_PANEL_DISPLAYED,
    }),

    reset(defaultFilters: Record<string, any>) {
      ;(this as any).filters = defaultFilters
      this.setFilters({})
      this.setActiveFilters(0)
      this.setIsFilterPanelDisplayed(undefined)
      ;(this.$refs.form as VFormType).resetValidation()

      this.$emit('reset')
      window.history.replaceState(null, '', `${this.$route.path}${window.location.hash}`)
    },
    submit(filters: Record<string, any>) {
      const formattedFilters = { ...filters }

      // Apply specific mutations to params
      const { pickDate, createdAt, deliveryDate } = filters

      if (pickDate?.start) {
        formattedFilters.pickDate = JSON.stringify(pickDate)
      } else {
        delete formattedFilters.pickDate
      }

      if (deliveryDate?.start) {
        formattedFilters.deliveryDate = JSON.stringify(deliveryDate)
      } else {
        delete formattedFilters.deliveryDate
      }

      if (createdAt?.start) {
        formattedFilters.createdAt = JSON.stringify(createdAt)
      } else {
        delete formattedFilters.createdAt
      }

      this.updateActiveFilters(formattedFilters)
      this.setFilters(formattedFilters)
      this.setIsFilterPanelDisplayed(undefined)
      this.$emit('submit', filters)

      this.fromFiltersToQuery(formattedFilters)
    },
    updateActiveFilters(filters: Record<string, any>) {
      const filledFields = this.filterFilled(filters)

      this.setActiveFilters(Object.keys(filledFields).length)
    },
    fromQueryToFilters(defaultFilters: Record<string, any>) {
      const queryParams = queryString.parse(location.search, {
        parseNumbers: false,
        parseBooleans: true,
      })
      const params = { ...queryParams }

      // Apply specific mutations to params
      const { pickDate, createdAt, deliveryDate } = queryParams
      if (pickDate) {
        params.pickDate = JSON.parse(pickDate as string)
      }

      if (deliveryDate) {
        params.deliveryDate = JSON.parse(deliveryDate as string)
      }

      if (createdAt) {
        params.createdAt = JSON.parse(createdAt as string)
      }

      const entries = Object.entries(params)
      const filters: Record<string, any> = {}

      if (!entries.length) {
        return
      }

      for (const [key, value] of entries) {
        if (Object.keys(defaultFilters).includes(key)) {
          filters[key] = value
        }
      }

      this.updateActiveFilters(filters)
      this.setFilters(filters)

      return this.storeFilters
    },
    fromFiltersToQuery(filters: Record<string, any>) {
      const newURL = queryString.stringifyUrl(
        { url: `${this.$route.path}${window.location.hash}`, query: this.filterFilled(filters) },
        {
          skipEmptyString: true,
          skipNull: true,
        },
      )
      window.history.replaceState(null, '', newURL)
    },
    filterFilled(fields: Record<string, any>) {
      return Object.entries(fields)
        .filter(([_key, value]) => {
          return (
            ((typeof value === 'string' || typeof value === 'number') && value) ||
            typeof value === 'boolean' ||
            (Array.isArray(value) && value.length) ||
            (typeof value === 'object' && value !== null && Object.values(value).length > 0)
          )
        })
        .reduce((obj, [key]) => {
          if (
            Array.isArray(fields[key]) &&
            fields[key].every((value: any) => typeof value === 'object')
          ) {
            obj[key] = JSON.stringify(fields[key])

            return obj
          }

          obj[key] = fields[key]

          return obj
        }, {} as Record<string, any>)
    },
  },
})
