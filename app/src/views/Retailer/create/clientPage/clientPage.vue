<template>
  <div id="retailer-create-clientPage" data-id="retailer-create-clientPage">
    <!-- title -->
    <v-row no-gutters class="title-outer-wrapper">
      <v-col cols="12">
        <h2 data-id="retailer-create-clientPage-title">{{ $t('common.clientPage') }}</h2>
      </v-col>
    </v-row>

    <!-- form -->
    <v-row class="mp-row" no-gutters>
      <v-col cols="12" md="8" lg="6">
        <mp-textfield
          dataId="retailer-create-clientPage-url"
          :label="$t('page.retailers.URLClientSpace')"
          v-model="retailer.administration.url"
          name="retailer-create-clientPage-url"
          @input="$v.retailer.administration.url.$touch()"
          @blur="$v.retailer.administration.url.$touch()"
          :errors="getModelErrors($v.retailer.administration.url)"
          :isDirty="$v.retailer.administration.url.$dirty"
        />
      </v-col>
    </v-row>

    <v-row class="mp-row" no-gutters>
      <v-col cols="12" md="8" lg="6">
        <mp-textarea
          dataId="retailer-create-clientPage-mentions"
          class="textarea"
          :rows="10"
          noResize
          :label="$t('page.termsConditions.title')"
          v-model="retailer.administration.mentions"
          name="retailer-create-clientPage-mentions"
          @input="$v.retailer.administration.mentions.$touch()"
          @blur="$v.retailer.administration.mentions.$touch()"
          :errors="getModelErrors($v.retailer.administration.mentions)"
          :isDirty="$v.retailer.administration.mentions.$dirty"
        />
      </v-col>
    </v-row>

    <v-row class="mp-row" no-gutters>
      <v-col cols="12" md="8" lg="6">
        <mp-textfield
          dataId="retailer-create-clientPage-minScore"
          :label="$t('page.createOrder.minScore')"
          v-model="retailer.minScore"
          name="retailer-create-clientPage-minScore"
          type="number"
          suffix="/10"
          @input="$v.retailer.minScore.$touch()"
          @blur="$v.retailer.minScore.$touch()"
          :errors="getModelErrors($v.retailer.minScore)"
          :isDirty="$v.retailer.minScore.$dirty"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'

import { RetailerEntity } from '@/types'

import { validationMixin } from '@/mixins'
import { between, url } from 'vuelidate/lib/validators'

export default mixins(validationMixin).extend({
  name: 'retailer-create-clientPage',
  props: {
    retailer: {
      type: Object as () => RetailerEntity,
      required: true,
    },
  },
  validations: {
    retailer: {
      minScore: {
        between: between(0, 10),
      },
      administration: {
        url: { url },
        mentions: {},
      },
    },
  },
  mounted() {
    this.$emit('invalid', this.$v.retailer.$invalid)
  },
  watch: {
    '$v.retailer.$invalid'(next) {
      this.$emit('invalid', next)
    },
  },
})
</script>

<style lang="scss" scoped>
#retailer-create-clientPage {
  padding: 0;

  .title-outer-wrapper {
    margin-bottom: 2.6rem;
  }
}
</style>
