<template>
  <mp-autocomplete
    :label="`${label || $t('common.timezone')}${isRequired ? ' *' : ''}`"
    id="timezone-autocomplete"
    v-model="suggestedInput"
    :items="suggestedTimezones"
    @loadItems="handleChangeTimezoneSearch($event)"
    @change="handleChangeTimezone()"
    :top="top"
    @clickClear="handleTimezoneClear(true)"
    displayName="text"
    :dataId="`${dataId}-form-timezone`"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import { getTimezones } from '@/helpers/dateHelper'
import { SelectItem } from '@/types'

export default Vue.extend({
  name: 'timezone-autocomplete',
  props: {
    label: {
      type: String,
      default: '',
    },
    timezone: {
      type: String,
      required: true,
    },
    dataId: {
      type: String,
      default: 'autocomplete',
    },
    isRequired: {
      type: Boolean,
      default: false,
    },
    top: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      suggestedTimezones: [] as Record<string, any> | [],
      suggestedInput: null as SelectItem | null,
    }
  },
  methods: {
    handleChangeTimezone() {
      if (this.suggestedInput) {
        this.$emit('updateTimezone', this.suggestedInput.text)
      } else {
        this.$emit('updateTimezone', '')
      }
    },
    handleTimezoneClear() {
      this.suggestedInput = null
      this.resetTimezones()
    },
    handleChangeTimezoneSearch(newTimezone: string) {
      if (!newTimezone) {
        this.resetTimezones()
        return
      }
      const localTimezones = getTimezones()
      this.suggestedTimezones = Object.values(localTimezones)
        .filter(({ name }) => name.toLowerCase().includes(newTimezone.toLowerCase()))
        .map(({ name }) => ({
          text: name,
          value: name,
        })).sort(({text: Text1}, {text: Text2}) => Text1.localeCompare(Text2))
    },
    resetTimezones() {
      const localTimezones = getTimezones()
      this.suggestedTimezones = Object.values(localTimezones).map(({ name }) => ({
        text: name,
        value: name,
      })).sort(({text: Text1}, {text: Text2}) => Text1.localeCompare(Text2))
    },
  },
  beforeMount() {
    this.resetTimezones()
    if (this.timezone) {
      this.suggestedInput = { text: this.timezone || '' }
    } else {
      this.suggestedInput = null
    }
  },
  watch: {
    timezone(next) {
      this.resetTimezones()
      if (next) {
        this.suggestedInput = { text: next || '' }
      } else {
        this.suggestedInput = null
      }
    },
  },
})
</script>
