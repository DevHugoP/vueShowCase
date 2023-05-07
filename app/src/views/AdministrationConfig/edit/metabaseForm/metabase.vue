<template>
  <mp-block
    :title="$t('page.dashboard.title')"
    :hasBorder="false"
    :hasMarginBottom="$vuetify.breakpoint.smAndUp"
    id="metabase-form"
  >
    <v-row no-gutters class="mt-6">
      <v-col cols="12">
        <mp-textfield
          :label="`${$t('page.administrationConfigEdit.metabase.url')} *`"
          name="metabase-url"
          v-model="metabase.url"
          type="url"
          dataId="metabase-form-url"
          @input="$v.metabase.url.$touch()"
          @blur="$v.metabase.url.$touch()"
          :errors="getModelErrors($v.metabase.url)"
          :isDirty="$v.metabase.url.$dirty"
        />
      </v-col>
    </v-row>
    <v-row no-gutters class="mt-4">
      <v-col cols="12">
        <mp-textfield
          :label="`${$t('page.administrationConfigEdit.metabase.secretKey')}`"
          name="metabase-secretKey"
          v-model="metabase.secretKey"
          dataId="metabase-form-secretKey"
          @input="$v.metabase.secretKey.$touch()"
          @blur="$v.metabase.secretKey.$touch()"
          @focus="firstFocus()"
          :errors="getModelErrors($v.metabase.secretKey)"
          :isDirty="$v.metabase.secretKey.$dirty"
        />
      </v-col>
    </v-row>
  </mp-block>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'

import { required, url } from 'vuelidate/lib/validators'
import { validationMixin } from '@/mixins'
import mpBlock from '@/components/block/block.vue'

export default mixins(validationMixin).extend({
  name: 'edit-metabase',
  components: {
    mpBlock,
  },
  props: {
    metabase: {
      required: true,
      type: Object as () => {
        url: string
        secretKey: string
      },
    },
  },
  data: () => ({
    hasFocused: false,
  }),
  validations: {
    metabase: {
      url: { required, url },
      secretKey: { required },
    },
  },
  methods: {
    firstFocus() {
      if (this.hasFocused) {
        return
      }
      this.hasFocused = true
      this.metabase.secretKey = ''
      this.$emit('changeKey', true)
    },
  },
  watch: {
    '$v.metabase.$invalid'(next) {
      this.$emit('invalid', next)
    },
  },
})
</script>
