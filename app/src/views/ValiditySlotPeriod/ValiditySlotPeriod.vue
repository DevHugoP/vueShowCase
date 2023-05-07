<template>
  <div v-if="exchangePlace" id="validity-slot-period-wrapper">
    <content-header v-if="$vuetify.breakpoint.smAndUp" dataId="validity-slot-period">
      <template #breadcrumb>
        <mp-breadcrumb />
      </template>
      <template #title>
        <h1 data-id="validity-slot-period-title">
          {{
            $t('page.validitySlotPeriod.title')
          }}
        </h1>
      </template>
    </content-header>
    <v-row no-gutters>
      <v-col cols="10" offset="1">
        <h2 v-if="$vuetify.breakpoint.xsOnly" class="my-3" data-id="validity-slot-period-subtitle">
          {{ $t('page.validitySlotPeriod.title') }}
        </h2>
        <mp-radio-group
          v-model="exchangePlace.bookingValidityPeriod.type"
          :radioValues="validitySlotType"
          class="radio-group-custom"
          dataId="order-create-product-package-size"
          row
          @change="changeBookingValidityType()"
        />
      </v-col>
    </v-row>
    <v-row v-if="exchangePlace.bookingValidityPeriod.type === 'slot'" no-gutters>
      <v-col cols="10" class="mb-15" offset="1">
        <div
          v-for="(slot, index) in exchangePlace.bookingValidityPeriod.slots"
          :key="`validity-slot-${slot.id}-${exchangePlace.bookingValidityPeriod.slots.length}`"
          class="mt-5"
        >
          <mp-one-slot-period
            :bookingSlot="slot"
            :index="index"
            :length="exchangePlace.bookingValidityPeriod.slots.length"
            :validations="$v.exchangePlace.bookingValidityPeriod.slots.$each[index]"
            @delete="deleteSlot(index)"
          />
        </div>
        <mp-button
          v-if="exchangePlace.bookingValidityPeriod.slots.length < 5"
          :text="$vuetify.breakpoint.smAndUp ? $t('page.exchangePlace.creation.slot.add') : null"
          :class="`${$vuetify.breakpoint.xsOnly ? ' add-btn-validity my-10' : 'my-10' }`"
          dataId="validity-add-slot"
          format="link"
          icon="plus"
          linkColor="black"
          @click="addSlot()"
        />
      </v-col>
    </v-row>
    <v-row v-else no-gutters class="offset-1">
      <v-col cols="9" md="3" :class="`mx-5${$vuetify.breakpoint.xsOnly ? ' my-5' : '' }`">
        <mp-textfield
          v-model="exchangePlace.bookingValidityPeriod.validity.value"
          :errors="getModelErrors($v.exchangePlace.bookingValidityPeriod.validity.value)"
          :isDirty="$v.exchangePlace.bookingValidityPeriod.validity.value.$dirty"
          :label="`${$t('page.validitySlotPeriod.inputDaylabel')} *`"
          :suffix="
            Number.parseInt(exchangePlace.bookingValidityPeriod.validity.value) > 1
              ? $t('common.timeUnit.hour_plural')
              : $t('common.timeUnit.hour')
          "
          class="col-4"
          dataId="validity-day-period"
          @blur="$v.exchangePlace.bookingValidityPeriod.validity.value.$touch()"
          @input="$v.exchangePlace.bookingValidityPeriod.validity.value.$touch()"
        />
      </v-col>
    </v-row>
    <v-row
      :class="$vuetify.breakpoint.xsOnly ? 'action-outer-wrapper-mobile' : 'action-outer-wrapper'"
      no-gutters
    >
      <v-col
        :cols="$vuetify.breakpoint.xsOnly ? '6' : '10'"
        :offset="$vuetify.breakpoint.xsOnly ? '0' : '1'"
        class="action-wrapper"
      >
        <mp-button
          :format="$vuetify.breakpoint.xsOnly ? 'sticky' : 'link'"
          :icon="$vuetify.breakpoint.xsOnly ? 'arrow-left' : null"
          :linkColor="$vuetify.breakpoint.xsOnly ? null : 'black'"
          :stickyColor="$vuetify.breakpoint.xsOnly ? 'yellow' : null"
          :text="$vuetify.breakpoint.xsOnly ? null : $t('action.cancel.base')"
          dataId="validity-slot-cancel"
          @click.stop="cancel()"
        />

        <mp-button
          :disabled="
            exchangePlace.bookingValidityPeriod.type === 'slot'
              ? $v.exchangePlace.bookingValidityPeriod.slots.$invalid
              : $v.exchangePlace.bookingValidityPeriod.validity.$invalid
          "
          :format="$vuetify.breakpoint.xsOnly ? 'sticky' : 'success'"
          :icon="$vuetify.breakpoint.xsOnly ? null : 'content-save-outline'"
          :stickyColor="$vuetify.breakpoint.xsOnly ? 'yellow' : null"
          :text="$t('action.save')"
          class="submit-btn"
          dataId="validity-slot-submit"
          @click="submit()"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import mpBreadcrumb from '@/components/breadcrumb/breadcrumb.vue'
import contentHeader from '@/components/contentHeader/contentHeader.vue'
import { ROUTES } from '@/constants'
import { validationMixin } from '@/mixins'
import ExchangePlaceService from '@/services/exchangePlace/ExchangePlaceService'
import { BookingValiditySlot, ExchangePlaceEntity } from '@/types'
import MpOneSlotPeriod from '@/views/ValiditySlotPeriod/OneSlotPeriod/OneSlotPeriod.vue'
import mixins from 'vue-typed-mixins'
import { integer, minValue, required } from 'vuelidate/lib/validators'

export default mixins(validationMixin).extend({
  name: 'validity-slot-period',
  components: {
    MpOneSlotPeriod,
    contentHeader,
    mpBreadcrumb,
  },
  data: () => ({
    ROUTES,
    exchangePlace: undefined as unknown as ExchangePlaceEntity,
    isEdit: true,
  }),
  computed: {
    validitySlotType(): Array<{ label: string; value: string }> {
      return [
        {
          label: this.$t('page.validitySlotPeriod.type.slot'),
          value: 'slot',
        },
        {
          label: this.$t('page.validitySlotPeriod.type.day'),
          value: 'day',
        },
      ]
    },
  },
  validations() {
    const slots = this.exchangePlace.bookingValidityPeriod?.slots
    const isValidBookingSlots = (start: string, slot: BookingValiditySlot) => {
      let valid = (this as any).isBefore(slot.start, slot.end)
      slots?.forEach(tmpSlot => {
        if (slot.id !== tmpSlot.id) {
          valid =
            valid &&
            ((this as any).isBefore(slot.start, tmpSlot.start) ||
              !(this as any).isBefore(slot.start, tmpSlot.end)) &&
            (!(this as any).isBefore(tmpSlot.start, slot.end) ||
              !(this as any).isBefore(slot.end, tmpSlot.end))
        }
      })
      return valid
    }
    return {
      exchangePlace: {
        bookingValidityPeriod: {
          slots: {
            $each: {
              start: {
                required,
                isValidBookingSlots,
              },
              end: {
                required,
                isValidBookingSlots,
              },
              validity: {
                value: {
                  integer,
                  minValue: minValue(1),
                },
              },
            },
          },
          validity: {
            value: {
              integer,
              minValue: minValue(1),
            },
          },
        },
      },
    }
  },
  async mounted() {
    try {
      const exchangePlace = await ExchangePlaceService.get(
        parseInt(this.$route.params.exchangePlaceId as string, 10),
      )
      if (!exchangePlace.bookingValidityPeriod) {
        exchangePlace.bookingValidityPeriod = {
          type: 'day',
          slots: [],
          validity: {
            value: 1,
            unit: 'hours',
          },
        }
      }
      if (!exchangePlace.bookingValidityPeriod.slots) {
        exchangePlace.bookingValidityPeriod.slots = []
      } else {
        for(const slot of exchangePlace.bookingValidityPeriod.slots) {
          slot.id = (Math.random() * 10).toString()
        }
      }
      this.exchangePlace = exchangePlace
      this.isEdit = !!exchangePlace.bookingValidityPeriod
    } catch (e) {
      if (e.response?.status === 403) {
        return this.$router.push({ name: ROUTES.noAccess })
      }
    }
  },
  methods: {
    changeBookingValidityType(): void {
      if (!this.exchangePlace.bookingValidityPeriod?.slots?.length) {
        this.addSlot()
      }
      if (!this.exchangePlace.bookingValidityPeriod?.validity?.value) {
        this.exchangePlace.bookingValidityPeriod!.validity = {
          value: 1,
          unit: 'hours',
        }
      }
    },
    isBefore(time1: string, time2: string): boolean {
      const [h1, m1] = time1.split(':')
      const [h2, m2] = time2.split(':')
      if (h1 !== h2) {
        return h1 < h2
      }
      return m1 < m2
    },
    addSlot(): void {
      if (!this.exchangePlace.bookingValidityPeriod?.slots) {
        this.exchangePlace.bookingValidityPeriod!.slots = []
      }
      this.exchangePlace.bookingValidityPeriod!.slots.push({
        id: (Math.random() * 10).toString(),
        start: '00:00',
        end: '00:00',
        validity: {
          value: 1,
          unit: 'hours',
        },
      } as BookingValiditySlot)
    },
    deleteSlot(indexSlot: number): void {
      if (this.exchangePlace.bookingValidityPeriod?.slots &&
          this.exchangePlace.bookingValidityPeriod.slots.length > 1) {
        this.exchangePlace.bookingValidityPeriod.slots =
          this.exchangePlace.bookingValidityPeriod.slots.filter(
            (slot, index) => indexSlot !== index,
          )
      } else {
        this.exchangePlace.bookingValidityPeriod!.slots = [
          {
            id: (Math.random() * 10).toString(),
            start: '00:00',
            end: '00:00',
            validity: {
              value: 1,
              unit: 'hours',
            },
          },
        ]
      }
    },
    cancel(): void {
      this.$router.push({
        name: ROUTES.exchangePlace,
        params: {
          exchangePlaceId: this.exchangePlace.id.toString(),
          storeId: this.exchangePlace.storeId.toString(),
          id: this.exchangePlace.retailerId.toString(),
        },
      })
    },
    async submit(): Promise<void> {
      if (this.exchangePlace?.bookingValidityPeriod?.type === 'slot') {
        delete this.exchangePlace.bookingValidityPeriod.validity
        for(const slot of this.exchangePlace.bookingValidityPeriod!.slots!) {
          slot.validity.value = typeof slot.validity.value === 'string' ?
          Number.parseInt(slot.validity.value, 10) :
          slot.validity.value
        }
      } else {
        delete this.exchangePlace.bookingValidityPeriod?.slots
        this.exchangePlace.bookingValidityPeriod!.validity!.value =
            typeof this.exchangePlace.bookingValidityPeriod?.validity?.value === 'string' ?
            Number.parseInt(this.exchangePlace.bookingValidityPeriod!.validity!.value, 10) :
            this.exchangePlace.bookingValidityPeriod!.validity!.value
      }
      await ExchangePlaceService.updateValidityPeriod(this.exchangePlace.id, this.exchangePlace)
      this.$router.push({
        name: ROUTES.exchangePlace,
        params: {
          exchangePlaceId: this.exchangePlace.id.toString(),
          storeId: this.exchangePlace.storeId.toString(),
          id: this.exchangePlace.retailerId.toString(),
        },
      })
    },
  },
})
</script>

<style lang="scss" scoped>
#validity-slot-period-wrapper {
  .action-outer-wrapper {
    margin-bottom: 10rem;

    .action-wrapper {
      display: flex;
      justify-content: flex-end;
    }
  }

  .action-outer-wrapper-mobile {

    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 3;
    display: flex;
    margin: 0;
    flex-direction: row;
    overflow-x: auto;

    .action-wrapper {
      padding-right: 0.1rem;
      display: flex;

      .submit-btn {
        margin-left: 0.1rem;
      }
    }

    button {
      min-height: 6rem;
      width: 100%;
    }
  }

  .add-btn-validity {
    background-color: var(--v-primary-base)!important;
    height: 36px;
    width: 36px;
    padding: 1rem !important;
  }

}
</style>
