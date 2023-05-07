<template>
  <mp-block
    id="cut-off"
    :hasBorder="$vuetify.breakpoint.smAndUp"
    :hasMarginBottom="$vuetify.breakpoint.smAndUp"
    titleHasPaddingBottom
  >
    <template #title v-if="$vuetify.breakpoint.smAndUp">
      <div class="d-flex justify-space-between">
        <h2>{{ $t('components.cutoff.title') }}</h2>
        <v-menu
          v-if="hasCutOff && $vuetify.breakpoint.smAndUp"
          bottom
          left
          offset-y
          origin="center top"
          transition="scale-transition"
        >
          <template v-slot:activator="{ on }">
            <v-icon color="black" v-on="on">
              mdi-dots-vertical
            </v-icon>
          </template>
          <v-list>
            <v-list-item @click="showDialog = true">
              <v-list-item-icon class="mr-3">
                <v-icon class="main-color" size="1.6rem" v-text="'mdi-pencil'"></v-icon>
              </v-list-item-icon>
              <v-list-item-title class="regular14">
                {{ $t('action.modify.base') }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="showDialogDelete = true">
              <v-list-item-icon class="mr-3">
                <v-icon class="main-color" size="1.6rem" v-text="'mdi-trash-can-outline'"></v-icon>
              </v-list-item-icon>
              <v-list-item-title class="regular14">
                {{ $t('action.delete.base') }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </template>

    <template #default>
      <v-row no-gutters>
        <v-col cols="12" v-if="!hasCutOff">
          <no-data dataId="cutoff-noData" :content="$t('components.cutoff.noData')" />

          <div class="d-flex justify-center mt-6" v-if="$vuetify.breakpoint.smAndUp">
            <mp-button
              dataId="cutoff-newCutoff"
              icon="plus"
              :text="$t('action.add.base')"
              @click="showDialog = true"
            />
          </div>
        </v-col>
        <v-col cols="12" v-else class="display-cut-off">
          <div
            v-if="deliveryCutOffs?.timezone"
            :class="
              `d-flex justify-space-between${
                (deliveryCutOffs?.sameDay?.hours && deliveryCutOffs?.sameDay?.minutes) ||
                (deliveryCutOffs?.nextDay?.hours && deliveryCutOffs?.nextDay?.minutes)
                  ? ' has-border'
                  : ''
              }`
            "
          >
            <span class="regular14 main-lighten-52">{{ $t('common.timezone') }}</span>
            <span class="regular14 main-color">{{ deliveryCutOffs.timezone }}</span>
          </div>

          <div
            v-if="deliveryCutOffs?.sameDay?.hours && deliveryCutOffs?.sameDay?.minutes"
            :class="
              `d-flex justify-space-between${
                deliveryCutOffs?.nextDay?.hours && deliveryCutOffs?.nextDay?.minutes
                  ? ' has-border'
                  : ''
              }`
            "
          >
            <span class="regular14 main-lighten-52">{{ $t('components.cutoff.sameDay') }}</span>
            <span class="regular14 main-color">{{ formatCutOff(deliveryCutOffs.sameDay) }}</span>
          </div>

          <div
            v-if="deliveryCutOffs?.nextDay?.hours && deliveryCutOffs?.nextDay?.minutes"
            class="d-flex justify-space-between"
          >
            <span class="regular14 main-lighten-52">{{ $t('components.cutoff.nextDay') }}</span>
            <span class="regular14 main-color">{{ formatCutOff(deliveryCutOffs.nextDay) }}</span>
          </div>
        </v-col>
      </v-row>

      <mp-dialog-confirmation
        v-if="showDialog"
        classWrapper="cutoff-dialog"
        dataId="cutoff-dialog"
        color="primary"
        :header="{
          iconClose: 'mdi-close',
          icon: $vuetify.breakpoint.smAndUp ? 'mdi-plus' : '',
          isColorBackground: true,
          text: $t('components.cutoff.dialog.title'),
        }"
        :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
        :btnValidation="{
          text: $t(`action.save`),
          format: 'success',
          disabled: $v.$invalid,
        }"
        :btnToColumn="$vuetify.breakpoint.xsOnly"
        :fullscreen="$vuetify.breakpoint.xsOnly"
        @close="showDialog = false"
        @submit="submit()"
      >
        <template #content>
          <v-row no-gutters class="pt-8">
            <v-col cols="10" offset="1">
              <timezone-autocomplete
                :timezone="timezone"
                dataId="cutoff-timezone"
                @updateTimezone="timezone = $event"
              />
            </v-col>
          </v-row>
          <v-row no-gutters class="mt-8">
            <v-col cols="10" offset="1">
              <div class="same-day">
                <h4 class="main-color">{{ $t('components.cutoff.dialog.sameDay.title') }}</h4>
                <span class="regular14 main-lighten-28">
                  {{ $t('components.cutoff.dialog.sameDay.def') }}
                </span>

                <div class="time-picker-wrapper">
                  <mp-time-picker-new
                    v-model="sameDay"
                    :label="$t('components.cutoff.dialog.sameDay.title')"
                    dataId="cutoff-sameDay"
                    class="time-picker"
                    @input="$v.sameDay.$touch()"
                    @blur="$v.sameDay.$touch()"
                    :errors="getModelErrors($v.sameDay)"
                    :isDirty="$v.sameDay.$dirty"
                  />
                  <v-icon size="1.8rem" class="time-picker-erase" @click="sameDay = ''">
                    mdi-trash-can-outline
                  </v-icon>
                </div>
              </div>
            </v-col>
          </v-row>

          <v-row no-gutters class="mt-15 mb-8">
            <v-col cols="10" offset="1">
              <div class="next-day">
                <h4 class="main-color">{{ $t('components.cutoff.dialog.nextDay.title') }}</h4>
                <span class="regular14 main-lighten-28">
                  {{ $t('components.cutoff.dialog.nextDay.def') }}
                </span>

                <div class="time-picker-wrapper">
                  <mp-time-picker-new
                    v-model="nextDay"
                    :label="$t('components.cutoff.dialog.nextDay.title')"
                    dataId="cutoff-nextDay"
                    class="time-picker"
                    @input="$v.nextDay.$touch()"
                    @blur="$v.nextDay.$touch()"
                    :errors="getModelErrors($v.nextDay)"
                    :isDirty="$v.nextDay.$dirty"
                  />
                  <v-icon size="1.8rem" class="time-picker-erase" @click="nextDay = ''">
                    mdi-trash-can-outline
                  </v-icon>
                </div>
              </div>
            </v-col>
          </v-row>
        </template>
      </mp-dialog-confirmation>

      <mp-dialog-confirmation
        v-if="showDialogDelete"
        classWrapper="cutoff-delete-dialog"
        dataId="cutoff-delete-dialog"
        color="error"
        :header="{
          iconClose: 'mdi-close',
          icon: 'mdi-trash-can-outline',
          isColorBackground: false,
        }"
        :textContent="$t('components.cutoff.dialog.delete')"
        :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'red' }"
        :btnValidation="{
          text: $t('action.delete.base'),
          format: 'error',
        }"
        btnToColumn
        @close="showDialogDelete = false"
        @submit="handleDelete()"
      />
    </template>
  </mp-block>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'
import { validationMixin } from '@/mixins'

import mpBlock from '@/components/block/block.vue'
import noData from '@/components/noData/noData.vue'
import TimezoneAutocomplete from '@/components/form/timezoneAutocomplete/timezoneAutocomplete.vue'
import { CutOff, DeliveryCutOffs, DeliveryCutOffsPayload } from '@/types'
import { SnackBarType } from '@/store/types'
import OrderEligibilityService from '@/services/orderEligibility/OrderEligibilityService'
import { GetCarrierParams } from '@/services/carrier/CarrierRepository'

export default mixins(validationMixin).extend({
  name: 'cutoff',
  components: {
    mpBlock,
    noData,
    TimezoneAutocomplete,
  },
  props: {
    deliveryCutOffs: {
      type: Object as () => DeliveryCutOffs,
    },
    params: {
      type: Object as () => GetCarrierParams,
      required: true,
    },
  },
  data: () => ({
    showDialog: false,
    showDialogDelete: false,
    sameDay: '',
    nextDay: '',
    timezone: '',
  }),
  computed: {
    hasCutOff(): boolean {
      return (
        (Boolean(this.deliveryCutOffs?.sameDay?.hours) &&
          Boolean(this.deliveryCutOffs?.sameDay?.minutes)) ||
        (Boolean(this.deliveryCutOffs?.nextDay?.hours) &&
          Boolean(this.deliveryCutOffs?.nextDay?.minutes))
      )
    },
  },
  validations() {
    return {
      sameDay: {
        clockRule(value): boolean {
          if (value === '') {
            return true
          }
          return (this as any).clockRule(value)
        },
        maxTimeSlotSameDay(value, parentValue): boolean {
          if (parentValue.nextDay === '' || value === '') {
            return true
          }

          return (this as any).maxTime(value, parentValue.nextDay)
        },
      },
      nextDay: {
        clockRule(value): boolean {
          if (value === '') {
            return true
          }
          return (this as any).clockRule(value)
        },
        maxTimeSlotNextDay(value, parentValue): boolean {
          if (parentValue.sameDay === '' || value === '') {
            return true
          }

          return (this as any).maxTime(parentValue.sameDay, value)
        },
      },
    }
  },
  methods: {
    formatCutOff(cutOff: CutOff): string {
      return `${cutOff.hours}:${cutOff.minutes}`
    },
    async submit() {
      try {
        let payload = { deliveryCutOffs: null } as DeliveryCutOffsPayload
        const tmpPayload = { sameDay: null, nextDay: null } as {
          sameDay: CutOff | null
          nextDay: CutOff | null
        }

        if (this.sameDay !== '') {
          const [hours, minutes] = this.sameDay.split(':')
          tmpPayload.sameDay = { hours, minutes }
        }
        if (this.nextDay !== '') {
          const [hours, minutes] = this.nextDay.split(':')
          tmpPayload.nextDay = { hours, minutes }
        }

        if (tmpPayload.sameDay || tmpPayload.nextDay) {
          payload = { deliveryCutOffs: { timezone: this.timezone, ...tmpPayload } }
        }

        await OrderEligibilityService.update(this.params, payload)

        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.SUCCESS,
          message: this.$t(
            `components.cutoff.dialog.snackbar.${
              this.hasCutOff ? 'modifySuccess' : 'createSuccess'
            }`,
          ),
        })

        this.$emit('update:deliveryCutOffs', payload.deliveryCutOffs)
      } catch (e) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('components.cutoff.dialog.snackbar.createError'),
        })
      } finally {
        this.showDialog = false
      }
    },
    async handleDelete() {
      try {
        await OrderEligibilityService.update(this.params, { deliveryCutOffs: null })

        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.SUCCESS,
          message: this.$t('components.cutoff.dialog.snackbar.deleteSuccess'),
        })

        this.$emit('update:deliveryCutOffs', null)
      } catch (e) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('components.cutoff.dialog.snackbar.deleteError'),
        })
      } finally {
        this.showDialogDelete = false
      }
    },
  },
  watch: {
    showDialog(next): void {
      if (next) {
        if (this.deliveryCutOffs?.sameDay?.hours && this.deliveryCutOffs?.sameDay?.minutes) {
          this.sameDay = this.formatCutOff(this.deliveryCutOffs.sameDay)
        }

        if (this.deliveryCutOffs?.nextDay?.hours && this.deliveryCutOffs?.nextDay?.minutes) {
          this.nextDay = this.formatCutOff(this.deliveryCutOffs.nextDay)
        }

        this.timezone =
          this.deliveryCutOffs?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone

        return
      }

      this.sameDay = ''
      this.nextDay = ''
      this.timezone = ''
    },
  },
})
</script>

<style lang="scss">
#cut-off {
  .display-cut-off {
    .has-border {
      border-bottom: 0.1rem solid $main-lighten-74-color;
      padding-bottom: 1.6rem;
      margin-bottom: 1.6rem;
    }
  }
}
.cutoff-dialog {
  .main-dialog-content {
    max-height: calc(100vh - 12.7rem - 15.9rem);
    overflow-y: auto;
  }

  .time-picker-wrapper {
    display: flex;
    align-items: baseline;

    .time-picker {
      margin-top: 4rem;
      width: 100%;
    }

    .time-picker-erase {
      margin-left: 2.1rem;
      color: $main-color;
      cursor: pointer;
    }
  }

  .v-card__actions {
    border-top: 0.1rem solid $main-lighten-74-color;
  }
}

.cutoff-delete-dialog {
  .actions-wrapper {
    align-items: center;

    .mp-button--error {
      width: fit-content;
    }
  }
}
</style>
