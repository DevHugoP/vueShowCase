<template>
  <div id="delivery-constraints-component">
    <mp-block
      id="delivery-constraints-block"
      :title="$vuetify.breakpoint.smAndUp ? $t('page.deliveryConstraints.title') : ''"
      :hasBorder="$vuetify.breakpoint.smAndUp"
      :hasMarginBottom="$vuetify.breakpoint.smAndUp"
      titleHasPaddingBottom
      :hasEditIcon="hasDeliveryConstraint && isAuthorized('MANAGE_CARRIERS_PARAMETERS')"
      @clickOnIcon="editDeliveryconstraints()"
    >
      <div v-if="hasDeliveryConstraint">
        <v-row no-gutters class="schedule">
          <v-col cols="12" class="d-flex">
            <span class="regular14 table-title">
              {{ $t('page.deliveryConstraints.deliveryNoticePeriod') }}
            </span>

            <span
              class="regular14 ml-auto main-color"
              v-if="
                orderEligibility.deliveryNoticePeriod && orderEligibility.deliveryNoticePeriod.value
              "
            >
              {{ orderEligibility.deliveryNoticePeriod.value }}
              {{
                convertUnitToTranslationKey(orderEligibility.deliveryNoticePeriod.unit)
              }}
            </span>
            <span v-else class="regular14 ml-auto">--</span>

            <v-icon
              v-if="
                orderEligibility.deliveryNoticePeriod && orderEligibility.deliveryNoticePeriod.value && $vuetify.breakpoint.smAndUp && isAuthorized('MANAGE_CARRIERS_PARAMETERS')
              "
              size="1.6rem"
              class="main-color ml-4"
              @click="
                selectedContrainType = ContrainType.DELIVERY_NOTICE_PERIOD
                showDeleteContrainDialog = true
              "
            >
              mdi-close-circle
            </v-icon>
          </v-col>
        </v-row>

        <v-row no-gutters class="schedule">
          <v-col cols="12" class="d-flex">
            <span class="regular14 table-title">
              {{ $t('page.deliveryConstraints.minDeliveryTime') }}
            </span>

            <span
              class="regular14 ml-auto main-color"
              v-if="orderEligibility.minDeliveryTime && orderEligibility.minDeliveryTime.value"
            >
              {{ orderEligibility.minDeliveryTime.value }}
              {{
                convertUnitToTranslationKey(orderEligibility.minDeliveryTime.unit)
              }}
            </span>
            <span v-else class="regular14 ml-auto">--</span>

            <v-icon
              v-if="orderEligibility.minDeliveryTime && orderEligibility.minDeliveryTime.value && $vuetify.breakpoint.smAndUp && isAuthorized('MANAGE_CARRIERS_PARAMETERS')"
              size="1.6rem"
              class="main-color ml-4"
              @click="
                selectedContrainType = ContrainType.MIN_DELIVERY_TIME
                showDeleteContrainDialog = true
              "
            >
              mdi-close-circle
            </v-icon>
          </v-col>
        </v-row>

        <v-row no-gutters class="schedule">
          <v-col cols="12" class="d-flex justify-space-between">
            <span class="regular14 table-title">
              {{ $t('page.deliveryConstraints.clientDeliveryPromise') }}
            </span>

            <span
              class="regular14 ml-auto main-color"
              v-if="orderEligibility.deliveryPromise && orderEligibility.deliveryPromise.value"
            >
              {{ orderEligibility.deliveryPromise.value }}
              {{
                convertUnitToTranslationKey(orderEligibility.deliveryPromise.unit)
              }}
            </span>
            <span v-else class="regular14 ml-auto">--</span>

            <v-icon
              v-if="orderEligibility.deliveryPromise && orderEligibility.deliveryPromise.value && $vuetify.breakpoint.smAndUp && isAuthorized('MANAGE_CARRIERS_PARAMETERS')"
              size="1.6rem"
              class="main-color ml-4"
              @click="
                selectedContrainType = ContrainType.DELIVERY_PROMISE
                showDeleteContrainDialog = true
              "
            >
              mdi-close-circle
            </v-icon>
          </v-col>
        </v-row>
      </div>

      <div v-else>
        <no-data
          :content="$t('page.deliveryConstraints.noData')"
          dataId="delivery-constraints-noData"
        />

        <v-row no-gutters class="action-outer-wrapper" v-if="$vuetify.breakpoint.smAndUp && isAuthorized('MANAGE_CARRIERS_PARAMETERS')">
          <v-col cols="12" class="d-flex justify-center">
            <mp-button
              icon="plus"
              iconSize="1.8rem"
              :text="$t('action.add.base')"
              dataId="delivery-constraints-add-btn"
              class="mp-button"
              @click="showAddDialog()"
            />
          </v-col>
        </v-row>
      </div>
    </mp-block>

    <mp-dialog-confirmation
      v-if="showAddModal"
      dataId="add-delivery-constraints-modal"
      @close="cancelForm()"
      @submit="sendDeliveryConstraintsForm()"
      color="primary"
      maxWidth="60rem"
      classWrapper="add-delivery-constraints"
      :header="{
        isColorBackground: true,
        icon: $vuetify.breakpoint.smAndUp ? 'mdi-plus' : null,
        textPolice: $vuetify.breakpoint.smAndUp ? 'h4' : 'regular14',
        iconClose: 'mdi-close',
        text: hasDeliveryConstraint
          ? $t('page.deliveryConstraints.editConstraints')
          : $t('page.deliveryConstraints.addConstraints'),
      }"
      :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
      :btnValidation="{
        text: $t('action.valid.base'),
        format: 'success',
        disabled: $v.form.$invalid,
        loading,
      }"
      :fullscreen="$vuetify.breakpoint.xsOnly"
    >
      <template #content>
        <v-row>
          <v-col cols="12" class="mt-6 mb-6">
            <div class="definition-wrapper">
              <v-col cols="11">
                <h4>{{ $t('page.deliveryConstraints.deliveryNoticePeriod') }}</h4>
                <span class="regular14">{{
                  $t('page.deliveryConstraints.deliveryNoticePeriodDefinition')
                }}</span>
              </v-col>
            </div>
            <div class="input-wrapper mb-6">
              <v-col cols="7">
                <mp-textfield
                  type="number"
                  :label="$t('page.deliveryConstraints.deliveryNoticePeriod')"
                  dataId="carrier-search"
                  v-model="form.deliveryNoticePeriod"
                  :isDirty="$v.form.deliveryNoticePeriod.$dirty"
                  @input="$v.form.deliveryNoticePeriod.$touch()"
                  @blur="$v.form.deliveryNoticePeriod.$touch()"
                  :errors="getModelErrors($v.form.deliveryNoticePeriod)"
                />
              </v-col>
              <v-col cols="4">
                <mp-select
                  :items="units"
                  :label="$t('common.unit.base')"
                  v-model="form.deliveryNoticePeriodUnit"
                  dataId="deliveryNoticePeriodUnit"
                  @input="$v.form.deliveryNoticePeriodUnit.$touch()"
                  @blur="$v.form.deliveryNoticePeriodUnit.$touch()"
                  :errors="getModelErrors($v.form.deliveryNoticePeriodUnit)"
                  :isDirty="$v.form.deliveryNoticePeriodUnit.$dirty"
                />
              </v-col>
            </div>
            <div class="definition-wrapper">
              <v-col cols="11">
                <h4>{{ $t('page.deliveryConstraints.minDeliveryTimeTitle') }}</h4>
                <span class="regular14">{{
                  $t('page.deliveryConstraints.minDeliveryTimeDefinition')
                }}</span>
              </v-col>
            </div>
            <div class="input-wrapper mb-6">
              <v-col cols="7">
                <mp-textfield
                  type="number"
                  :label="$t('page.deliveryConstraints.minDeliveryTime')"
                  dataId="minDeliveryTime"
                  v-model="form.minDeliveryTime"
                  @input="$v.form.minDeliveryTime.$touch()"
                  @blur="$v.form.minDeliveryTime.$touch()"
                  :errors="getModelErrors($v.form.minDeliveryTime)"
                  :isDirty="$v.form.minDeliveryTime.$dirty"
                />
              </v-col>
              <v-col cols="4">
                <mp-select
                  class="mb-5"
                  :items="units"
                  v-model="form.minDeliveryTimeUnit"
                  :label="$t('common.unit.base')"
                  dataId="minDeliveryTimeUnit"
                  @input="$v.form.minDeliveryTimeUnit.$touch()"
                  @blur="$v.form.minDeliveryTimeUnit.$touch()"
                  :errors="getModelErrors($v.form.minDeliveryTimeUnit)"
                  :isDirty="$v.form.minDeliveryTimeUnit.$dirty"
                />
              </v-col>
            </div>
            <div class="definition-wrapper">
              <v-col cols="11">
                <h4>{{ $t('page.deliveryConstraints.clientDeliveryPromise') }}</h4>
                <span class="regular14">{{
                  $t('page.deliveryConstraints.clientDeliveryPromiseDefinition')
                }}</span>
              </v-col>
            </div>
            <div class="input-wrapper mb-6">
              <v-col cols="7">
                <mp-textfield
                  type="number"
                  :label="$t('page.deliveryConstraints.clientDeliveryPromise')"
                  dataId="deliveryPromise"
                  v-model="form.deliveryPromise"
                  @input="$v.form.deliveryPromise.$touch()"
                  @blur="$v.form.deliveryPromise.$touch()"
                  :errors="getModelErrors($v.form.deliveryPromise)"
                  :isDirty="$v.form.deliveryPromise.$dirty"
                />
              </v-col>
              <v-col cols="4">
                <mp-select
                  class="mb-5"
                  :items="units"
                  v-model="form.deliveryPromiseUnit"
                  :label="$t('common.unit.base')"
                  dataId="deliveryPromiseUnit"
                  @input="$v.form.deliveryPromiseUnit.$touch()"
                  @blur="$v.form.deliveryPromiseUnit.$touch()"
                  :errors="getModelErrors($v.form.deliveryPromiseUnit)"
                  :isDirty="$v.form.deliveryPromiseUnit.$dirty"
                />
              </v-col>
            </div>
          </v-col>
        </v-row>
      </template>
    </mp-dialog-confirmation>

    <mp-dialog-confirmation
      v-if="showDeleteContrainDialog"
      dataId="delete-delivery-constraints-dialog"
      @close="
        showDeleteContrainDialog = false
        selectedContrainType = null
      "
      @submit="deleteContrain()"
      color="error"
      :header="{
        iconClose: 'mdi-close',
        icon: 'mdi-trash-can-outline',
        isColorBackground: false,
      }"
      :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
      :btnValidation="{
        text: $t('action.delete.base'),
        format: 'error',
      }"
      :textContent="
        $t(
          `page.deliveryConstraints.delete${`${selectedContrainType[0].toUpperCase()}${selectedContrainType.slice(
            1,
          )}`}`,
        )
      "
    />
  </div>
</template>

<script lang="ts">
import { GetCarrierParams } from '@/services/carrier/CarrierRepository'
import { SnackBarType } from '@/store/types'
import { CarrierEligibilityEntity } from '@/types'
import mixins from 'vue-typed-mixins'

import noData from '@/components/noData/noData.vue'
import mpBlock from '@/components/block/block.vue'
import { TIME_UNIT } from '@/constants'

import { authorizationMixin } from '@/mixins'

import { languageMixin } from '@/mixins'
import OrderEligibilityService from '@/services/orderEligibility/OrderEligibilityService'

import { validationMixin } from '@/mixins'
import { requiredIf, numeric, minValue } from 'vuelidate/lib/validators'

enum ContrainType {
  DELIVERY_NOTICE_PERIOD = 'deliveryNoticePeriod',
  DELIVERY_PROMISE = 'deliveryPromise',
  MIN_DELIVERY_TIME = 'minDeliveryTime',
}

export default mixins(authorizationMixin, validationMixin, languageMixin).extend({
  name: 'mp-delivery-constraints-carrier',
  components: {
    noData,
    mpBlock,
  },
  props: {
    orderEligibility: {
      type: Object as () => CarrierEligibilityEntity,
      required: true,
    },
    carrierParent: {
      type: Object as () => CarrierEligibilityEntity,
      required: false,
    },
    params: {
      type: Object as () => GetCarrierParams,
      required: true,
    },
  },
  data: () => ({
    loading: false,
    hasLoaded: true,
    showAddModal: false,
    units: [] as Array<Record<string, string>>,
    validForm: false,
    form: {
      deliveryNoticePeriod: null as null | number,
      deliveryNoticePeriodUnit: '' as string,
      deliveryPromise: null as null | number,
      deliveryPromiseUnit: '' as string,
      minDeliveryTime: null as number | null,
      minDeliveryTimeUnit: '' as string,
    },
    ContrainType,
    selectedContrainType: null as typeof ContrainType | null,
    showDeleteContrainDialog: false,
  }),
  computed: {
    hasDeliveryConstraint(): boolean {
      return (
        Boolean(this.orderEligibility.minDeliveryTime?.value) ||
        Boolean(this.orderEligibility.deliveryNoticePeriod?.value) ||
        Boolean(this.orderEligibility.deliveryPromise?.value)
      )
    },
  },
  validations: {
    form: {
      deliveryNoticePeriod: {
        required: requiredIf(value => value.deliveryNoticePeriodUnit),
        numeric,
        minValue: minValue(1),
      },
      deliveryNoticePeriodUnit: {
        required: requiredIf(value => value.deliveryNoticePeriod),
      },
      deliveryPromiseUnit: {
        required: requiredIf(value => value.deliveryPromise),
      },
      deliveryPromise: {
        numeric,
        required: requiredIf(value => value.deliveryPromiseUnit),
        minValue: minValue(1),
      },
      minDeliveryTimeUnit: {
        required: requiredIf(value => value.minDeliveryTime),
      },
      minDeliveryTime: {
        numeric,
        required: requiredIf(value => value.minDeliveryTimeUnit),
        minValue: minValue(1),
      },
    },
  },
  mounted() {
    this.units = TIME_UNIT.map(({ value, text }) => ({
      value,
      text: this.convertUnitTranslation(text) as string,
    }))
    this.fetchData()
  },
  methods: {
    async fetchData() {
      try {
        this.form.minDeliveryTime = JSON.parse(
          JSON.stringify(
            this.orderEligibility.minDeliveryTime
              ? this.orderEligibility.minDeliveryTime.value
              : null,
          ),
        )
        this.form.minDeliveryTimeUnit =
          JSON.parse(
            JSON.stringify(
              this.orderEligibility.minDeliveryTime
                ? this.orderEligibility.minDeliveryTime.unit
                : null,
            ),
          ) || null

        this.form.deliveryNoticePeriod = JSON.parse(
          JSON.stringify(
            this.orderEligibility.deliveryNoticePeriod
              ? this.orderEligibility.deliveryNoticePeriod.value
              : null,
          ),
        )
        this.form.deliveryNoticePeriodUnit =
          JSON.parse(
            JSON.stringify(
              this.orderEligibility.deliveryNoticePeriod
                ? this.orderEligibility.deliveryNoticePeriod.unit
                : null,
            ),
          ) || null

        this.form.deliveryPromise = JSON.parse(
          JSON.stringify(
            this.orderEligibility.deliveryPromise
              ? this.orderEligibility.deliveryPromise.value
              : null,
          ),
        )
        this.form.deliveryPromiseUnit =
          JSON.parse(
            JSON.stringify(
              this.orderEligibility.deliveryPromise
                ? this.orderEligibility.deliveryPromise.unit
                : null,
            ),
          ) || null
      } catch (err) {
        this.hasLoaded = false
      }
    },
    showAddDialog() {
      this.showAddModal = !this.showAddModal
    },
    convertUnitToTranslationKey(key: string | null) {
      if (!key) {
        return
      }

      const unit = TIME_UNIT.find(({ value }) => value === key)

      return this.convertUnitTranslation(unit!.text)
    },
    convertUnitTranslation(value?: string) {
      if (!value) {
        return
      }

      return this.$t(`common.timeUnit.${value}`)
    },
    cancelForm() {
      this.showAddModal = false
      this.fetchData()
    },
    editDeliveryconstraints() {
      this.showAddModal = true
    },
    async sendDeliveryConstraintsForm() {
      const params = {
        ...this.params,
        scheduleId: this.$route.params.scheduleId,
      }
      const editPromise = {
        value: this.form.deliveryPromise,
        unit: this.form.deliveryPromiseUnit,
      }
      const editTime = {
        value: this.form.minDeliveryTime,
        unit: this.form.minDeliveryTimeUnit,
      }
      const editNotice = {
        value: this.form.deliveryNoticePeriod,
        unit: this.form.deliveryNoticePeriodUnit,
      }
      this.loading = true
      const orderEligibilityUpdate = {
        deliveryPromise: (editPromise.value && editPromise.unit) ? editPromise : null,
        minDeliveryTime: (editTime.value && editTime.unit) ? editTime : null,
        deliveryNoticePeriod: (editNotice.value && editNotice.unit) ? editNotice : null,
      }

      try {
        await OrderEligibilityService.update(
          { ...params },
            orderEligibilityUpdate,
        )
        this.hasLoaded = true
        this.orderEligibility.deliveryPromise =
          (editPromise.value && editPromise.unit) ? editPromise : null
        this.orderEligibility.minDeliveryTime = (editTime.value && editTime.unit) ? editTime : null
        this.orderEligibility.deliveryNoticePeriod =
          (editNotice.value && editNotice.unit) ? editNotice : null

        this.$store.dispatch('setSnackbar', {
          message: this.$t('messages.carrierUpdated'),
          type: SnackBarType.SUCCESS,
        })

        this.$emit('update:constraints', orderEligibilityUpdate)
      } catch (e) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      } finally {
        this.loading = false
        this.cancelForm()
      }
    },
    async deleteContrain(): Promise<void> {
      try {
        const params = {
          ...this.params,
          scheduleId: this.$route.params.scheduleId,
        }

        const orderEligibility = {
          deliveryPromise: this.orderEligibility.deliveryPromise,
          minDeliveryTime: this.orderEligibility.minDeliveryTime,
          deliveryNoticePeriod: this.orderEligibility.deliveryNoticePeriod,
        }

        orderEligibility[this.selectedContrainType] = null
        await OrderEligibilityService.update(
          { ...params },
          {
            ...orderEligibility,
          },
        )

        this.orderEligibility.deliveryPromise = orderEligibility.deliveryPromise
        this.orderEligibility.minDeliveryTime = orderEligibility.minDeliveryTime
        this.orderEligibility.deliveryNoticePeriod = orderEligibility.deliveryNoticePeriod
        this.fetchData()
      } catch (e) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      } finally {
        this.showDeleteContrainDialog = false
      }
    },
  },
})
</script>

<style lang="scss">
@import '../../../../../styles/mixins/macScrollbar';
#delivery-constraints-component {
  .edit-delivery-constraints-btn {
    background-color: $white;
    border-color: $white;
    border-radius: 50%;
    padding: 1.2rem;
    color: $main-lighten-52-color;
  }
  .edit-delivery-constraints-btn:hover {
    background-color: $main-lighten-80-color;
  }
  .v-icon.v-icon:after {
    all: initial;
  }

  .schedule {
    min-height: 3.8rem;
    display: flex;
    align-items: center;
    padding-bottom: 1.6rem;
    padding-top: 1.6rem;
    border-bottom: 0.1rem solid $main-lighten-74-color;
    &:last-of-type {
      padding-bottom: 0;
    }

    .table-title {
      color: $main-lighten-52-color;
      white-space: nowrap;
    }

    &:first-of-type {
      padding-top: 0;
    }

    &:last-of-type {
      border-bottom: none;
    }

    .slot-wrapper {
      text-align: right;

      .slot {
        min-width: fit-content;

        span {
          min-width: fit-content;
        }
      }
    }

    i {
      cursor: pointer;
    }
  }

  .mp-button {
    margin-top: 2.5rem;
    margin-bottom: 0.1rem;
  }
}

.add-delivery-constraints {
  .main-dialog-content {
    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      max-height: calc(100vh - 33rem);
      height: calc(100vh - 33rem);
      overflow-y: auto;
      overflow-x: hidden;
    }
    @include setMacScrollbar('&');
  }
  .definition-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .input-wrapper {
    display: flex;
    justify-content: center;
    height: 7rem;
  }

  .time-picker-icon-wrapper {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    gap: 1rem;
  }

  .v-card__actions {
    padding: 0;

    .action-wrapper {
      width: 100%;
      height: 6rem;
      background-color: $primary-color;
      color: $main-color;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .action-form-outer-wrapper {
      min-height: 11.6rem;
      width: 100%;

      @media #{map-get($display-breakpoints, 'xs-only')} {
        display: flex;
        justify-content: center;
      }

      .action-from-wrapper {
        display: flex;

        @media #{map-get($display-breakpoints, 'sm-and-up')} {
          justify-content: flex-end;
          align-items: center;
          margin-right: 4.7rem;
        }

        @media #{map-get($display-breakpoints, 'xs-only')} {
          flex-direction: column-reverse;
          width: fit-content;
          align-items: center;
          justify-content: center;
        }

        height: 11.5rem;

        .cancel {
          margin-right: 0.5rem;
        }
      }
    }
  }
  .v-card__actions {
    border-top: 0.1rem solid $main-lighten-74-color;
  }
}
</style>
