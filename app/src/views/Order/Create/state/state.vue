<template>
  <v-row no-gutters class="block" data-id="order-create-block-state">
    <v-col cols="12" class="header">
      <h2>{{ $t('page.createOrder.titles.state') }}</h2>
      <span class="block-info">{{ $t('page.createOrder.infos.state') }}</span>
    </v-col>

    <v-col cols="12" class="content">
      <mp-select
        :label="$t('page.createOrder.titles.state')"
        dataId="order-create-state"
        v-model="state.state"
        :items="getItemsToDisplay()"
        item-text="translatedKey"
        item-value="state"
        clearable
        @input="validations.state.$touch()"
        :disabled="isEditing"
        attach="#orderState"
        dropdownId="orderState"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { validationMixin } from '@/mixins'
import { CreateOrderStateState } from '@/store/modules/createOrder/state/types'
import { STATE } from '@/constants/shared'
import mixins from 'vue-typed-mixins'

export default mixins(validationMixin).extend({
  name: 'order-create-state',
  data: () => ({
    STATE,
  }),
  props: {
    isEditing: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    state(): CreateOrderStateState {
      return this.$store.getters['createOrder/state/stateValue']
    },
    validations(): any {
      return this.$store.getters['createOrder/state/$v']
    },
  },
  methods: {
    getItemsToDisplay() {
      return STATE.map(item => {
        return {
          state: item,
          translatedKey: this.$t(`technical.state.${item}`),
        }
      })
    },
  },
})
</script>
