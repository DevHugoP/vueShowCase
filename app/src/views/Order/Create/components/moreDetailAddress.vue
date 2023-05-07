<template>
  <v-row no-gutters id="itinerary-more-detail-wrapper">
    <v-col cols="12">
      <v-row no-gutters class="more-detail-wrapper">
        <v-col cols="12" class="more-detail-header">
          <span>
            {{ $t('page.order.common.moreDetail') }}
          </span>
          <mp-switch
            :dataId="`${dataId}-show-more`"
            :value="showMore"
            @input="$emit('update:showMore', $event)"
          />
        </v-col>

        <v-col cols="12" class="more-detail-content" v-if="showMore">
          <mp-textfield
            class="mb-5"
            :dataId="`${dataId}-addressLine2`"
            :label="$t('common.address.additional')"
            v-model="address.addressLine2"
            @input="validations.addressLine2.$touch()"
            @blur="validations.addressLine2.$touch()"
            :errors="getModelErrors(validations.addressLine2)"
            :isDirty="validations.addressLine2.$dirty"
          />

          <v-row no-gutters class="mb-5">
            <v-col cols="4">
              <mp-textfield
                name="contactDigicode"
                :dataId="`${dataId}-doorCode`"
                :label="$t('common.digicode')"
                v-model="address.doorCode"
                @input="validations.doorCode.$touch()"
                @blur="validations.doorCode.$touch()"
                :errors="getModelErrors(validations.doorCode)"
                :isDirty="validations.doorCode.$dirty"
              />
            </v-col>
            <v-col cols="3" offset="1">
              <mp-textfield
                name="contactFloor"
                type="number"
                :dataId="`${dataId}-floor`"
                :label="`${$t('common.floor')} *`"
                v-model="address.floor"
                @input="validations.floor.$touch()"
                @blur="validations.floor.$touch()"
                :errors="getModelErrors(validations.floor)"
                :isDirty="validations.floor.$dirty"
              />
            </v-col>
          </v-row>

          <mp-checkbox
            class="mb-5"
            :dataId="`${dataId}-elevator`"
            :label="$t('common.elevator')"
            @change="address.elevator = !address.elevator"
            :input-value="address.elevator"
          />

          <mp-textarea
            :label="$t('common.comment')"
            class="textarea"
            :rows="3"
            noResize
            :dataId="`${dataId}-comment`"
            v-model="address.comment"
            @input="validations.comment.$touch()"
            @blur="validations.comment.$touch()"
            :errors="getModelErrors(validations.comment)"
            :isDirty="validations.comment.$dirty"
            autoGrow
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'

import { Address } from '@/types'

import { validationMixin } from '@/mixins'

export default mixins(validationMixin).extend({
  name: 'create-order-itinerary-more-detail',
  props: {
    address: {
      type: Object as () => Address,
    },
    validations: {
      type: Object,
    },
    dataId: {
      type: String,
      required: true,
    },
    showMore: {
      type: Boolean,
      required: true,
    },
  },
  mounted() {
    if (!this.address.floor) {
      this.address.floor = 0
    }
  },
})
</script>

<style lang="scss" scoped>
#itinerary-more-detail-wrapper {
  .more-detail-wrapper {
    background-color: $main-lighten-80-color;
    padding: 2.2rem 1.9rem 2.1rem 2rem;

    .more-detail-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      span {
        @include regular-14();
        color: $main-lighten-52-color;
      }
    }

    .more-detail-content {
      margin-top: 2rem;
    }
  }
}
</style>
