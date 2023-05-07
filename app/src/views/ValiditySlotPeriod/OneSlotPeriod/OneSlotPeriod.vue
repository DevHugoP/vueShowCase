<template>
  <div v-if="bookingSlot" :id="`one-slot-period-${index}`" class="one-slot-period">
    <v-row no-gutters class="mt-5">
      <v-col cols="12" class="mx-5 py-3" md="2">
        <span class="regular16">{{ $t('page.validitySlotPeriod.OneSlotPeriod.slot') }} {{ index + 1 }}</span>
      </v-col>

      <v-col cols="10" md="2" :class="`mx-5${$vuetify.breakpoint.xsOnly ? ' my-5' : '' }`">
        <mp-vue-time-picker
          dataId="validity-slot-start"
          :placeholder="$t('common.start')"
          v-model="bookingSlot.start"
          @input="validations.start.$touch()"
          @blur="validations.start.$touch()"
          :errors="getModelErrors(validations.start)"
          :isDirty="validations.start.$dirty"
        />
      </v-col>
      <v-col cols="10" md="2" class="mx-5">
        <mp-vue-time-picker
          dataId="validity-slot-end"
          :placeholder="$t('common.end')"
          v-model="bookingSlot.end"
          @input="validations.end.$touch()"
          @blur="validations.end.$touch()"
          :errors="getModelErrors(validations.end)"
          :isDirty="validations.end.$dirty"
        />
      </v-col>
      <v-col cols="10" md="2" :class="`mx-5${$vuetify.breakpoint.xsOnly ? ' my-5' : '' }`">
        <mp-textfield
          class="mt-4"
          dataId="validity-slot-duration"
          :label="$t('page.validitySlotPeriod.inputDaylabel')"
          :suffix="$t('common.timeUnit.hour_plural')"
          v-model="bookingSlot.validity.value"
          @input="validations.validity.value.$touch()"
          @blur="validations.validity.value.$touch()"
          :errors="getModelErrors(validations.validity.value)"
          :isDirty="validations.validity.value.$dirty"
        />
      </v-col>
      <v-col cols="1">
        <mp-button
          v-if="length > 1"
          class="mt-3 close-btn"
          format="link"
          linkColor="black"
          icon="close-circle"
          :dataId="`form-delete-${length}`"
          @click="$emit('delete', index)"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { validationMixin } from '@/mixins'
import { BookingValiditySlot } from '@/types'
import mixins from 'vue-typed-mixins'

export default mixins(validationMixin).extend({
  name: 'mp-one-slot-period',
  components: {},
  props: {
    validations: {
      required: true
    },
    bookingSlot: {
      type: Object as () => BookingValiditySlot,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    length: {
      type: Number,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
.one-slot-period {
  background-color: $main-lighten-80-color;
  padding: 1rem;
}

  .close-btn {
    i {

      background-color: transparent;
     color: var(--v-error-base);
    }
  }
</style>
