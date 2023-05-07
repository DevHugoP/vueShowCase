<template>
  <mp-block
    :title="$t('page.administrationConfig.jwt.title')"
    :hasBorder="false"
    :hasMarginBottom="$vuetify.breakpoint.smAndUp"
    id="jwt-form"
  >
    <v-row no-gutters class="mt-4">
      <v-col cols="12">
        <mp-textfield
          :label="`${$t('page.administrationConfigEdit.jwt.secretKey')}`"
          name="jwt-secretKey"
          v-model="jwt.secretKey"
          dataId="jwt-form-secretKey"
          @input="$v.jwt.secretKey.$touch()"
          @blur="$v.jwt.secretKey.$touch()"
          @focus="firstFocus()"
          :errors="getModelErrors($v.jwt.secretKey)"
          :isDirty="$v.jwt.secretKey.$dirty"
        />
      </v-col>
    </v-row>

    <v-row>
      <mp-button
        dataId="jwt-form-secretKey-generator"
        :text="$t('page.administrationConfigEdit.jwt.generate')"
        format="secondary"
        @click="keyGenerator()"
      />
    </v-row>
  </mp-block>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'
import { v4 } from 'uuid'

import { required } from 'vuelidate/lib/validators'
import { validationMixin } from '@/mixins'
import mpBlock from '@/components/block/block.vue'

export default mixins(validationMixin).extend({
  name: 'edit-jwt',
  components: {
    mpBlock,
  },
  props: {
    jwt: {
      required: true,
      type: Object as () => {
        secretKey: string
      },
    },
  },
  data: () => ({
    hasFocused: false,
  }),
  validations: {
    jwt: {
      secretKey: { required },
    },
  },
  methods: {
    firstFocus() {
      if (this.hasFocused) {
        return
      }
      this.hasFocused = true
      this.jwt.secretKey = ''
      this.$emit('changeKey', true)
    },
    keyGenerator() {
      this.jwt.secretKey = v4()

      this.$emit('changeKey', true)
    },
  },
  watch: {
    '$v.jwt.$invalid'(next) {
      this.$emit('invalid', next)
    },
  },
})
</script>
