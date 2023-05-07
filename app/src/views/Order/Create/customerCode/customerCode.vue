<template>
  <v-row
    no-gutters
    class="block"
    data-id="order-create-block-customerCode"
    id="order-create-block-customerCode"
  >
    <v-col cols="12" class="header">
      <h2>{{ $t('page.createOrder.titles.customerCode') }}</h2>
      <span v-if="!retailer.orderIdConfig.generate" class="block-info">{{
        $t('page.createOrder.infos.customerCode')
      }}</span>
    </v-col>

    <v-col cols="12" class="content">
      <v-row :class="retailer.orderIdConfig.generate ? 'center-bloc' : ''">
        <v-col cols="12">
          <mp-textfield
            v-if="!retailer.orderIdConfig.generate"
            :label="`${$t('page.createOrder.steps.step1.labels.customerCode')} *`"
            v-model="customerCode.externalOrderId"
            @input="validations.customerCode.externalOrderId.$touch()"
            @blur="validations.customerCode.externalOrderId.$touch()"
            :errors="getModelErrors(validations.customerCode.externalOrderId)"
            :isDirty="validations.customerCode.externalOrderId.$dirty"
            dataId="order-create-customerCode-externalOrderId"
            :disabled="isEditing"
          />
          <v-row
            v-if="retailer.orderIdConfig.generate"
            :class="`d-flex${wrapper.prefix || wrapper.suffix ? ' partial' : ' complete'}`"
          >
            <div class="prefix-wrapper" v-if="wrapper.prefix.length">
              <mp-textfield
                :label="`${$t(`page.createOrder.generateOrder.${retailer.orderIdConfig.prefix}`)}`"
                v-model="wrapper.prefix"
                dataId="order-create-customerCode-wrapper-prefix"
                :disabled="true"
              />
            </div>

            <div :class="`${onlyTimeStamp ? 'timestamp-wrapper' : 'plus-text-wrapper'}`">
              <span v-if="wrapper.prefix.length" class="separator regular16">{{ '+' }}</span>

              <div :class="`${onlyTimeStamp ? 'onlyTimeStamp' : 'appendix-wrapper'}`">
                <mp-textfield
                  :label="`${$t('page.detailOrder.billing.timestamp')}${onlyTimeStamp ? ' *' : ''}`"
                  v-model="timeStamp"
                  dataId="order-create-customerCode-timestamp"
                  :disabled="isEditing"
                  @input="$v.timeStamp.$touch()"
                  @blur="$v.timeStamp.$touch()"
                  :errors="getModelErrors($v.timeStamp)"
                  :isDirty="$v.timeStamp.$dirty"
                  :maxlength="numberOfCharAvailable"
                />
              </div>
            </div>

            <div class="plus-text-wrapper" v-if="wrapper.suffix.length">
              <span class="separator regular16">{{ '+' }}</span>

              <div class="appendix-wrapper">
                <mp-textfield
                  :label="
                    `${$t(`page.createOrder.generateOrder.${retailer.orderIdConfig.suffix}`)}`
                  "
                  v-model="wrapper.suffix"
                  dataId="order-create-customerCode-wrapper-suffix"
                  :disabled="true"
                />
              </div>
            </div>
          </v-row>
        </v-col>
        <v-col cols="12" id="reference-number-more-detail-wrapper" v-if="!checkoutHasScan">
          <v-row no-gutters more-detail-wrapper class="more-detail-wrapper">
            <v-col cols="12" class="more-detail-header reference-number">
              <span>
                {{ $t('page.createOrder.infos.fillReferenceNumber') }}
              </span>
              <mp-switch dataId="referenceNumber-show-more" v-model="showMore" />
            </v-col>
            <v-col cols="12" class="more-detail-content" v-if="showMore">
              <mp-textfield
                :label="$t('page.createOrder.steps.step1.labels.referenceNumber')"
                v-model="customerCode.referenceNumber"
                @input="validations.customerCode.referenceNumber.$touch()"
                @blur="validations.customerCode.referenceNumber.$touch()"
                :errors="getModelErrors(validations.customerCode.referenceNumber)"
                :isDirty="validations.customerCode.referenceNumber.$dirty"
                dataId="order-create-customerCode-referenceNumber"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { validationMixin } from '@/mixins'
import { CreateOrderStateCustomerCode } from '@/store/modules/createOrder/customerCode/types'
import { CreateOrderStateMiscellaneous } from '@/store/modules/createOrder/types'
import { CreateOrderStateSenderIdentity } from '@/store/modules/createOrder/senderIdentity/types'
import { dateHelper } from '@/helpers/dateHelper'
import slugify from 'slugify'
import {
  CHECKOUT_BLOCKS,
  ORDER_GENERATION_PREFIX_SUFFIX,
  RetailerEntity,
  StoreEntity,
} from '@/types'
import { requiredIf } from 'vuelidate/lib/validators'
import mixins from 'vue-typed-mixins'
import StoreService from '@/services/store/StoreService'

export default mixins(validationMixin).extend({
  name: 'order-create-customerCode',
  props: {
    isEditing: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      numberOfCharAvailable: 0,
      dateHelper,
      showMore: false,
      retailer: {
        orderIdConfig: {
          generate: false,
          prefix: '',
          suffix: '',
        },
      } as RetailerEntity | null,
      store: null as StoreEntity | null,
      timeStamp: Date.now()
        .toString()
        .substring(0, 13),

      wrapper: {
        prefix: '',
        suffix: '',
      },
    }
  },
  validations() {
    return {
      timeStamp: { required: requiredIf((): boolean => this.numberOfCharAvailable === 36) },
    }
  },
  async beforeMount() {
    if (!this.isEditing) {
      this.retailer = this.miscellaneous.retailer

      if (this.retailer!.orderIdConfig.generate) {
        await this.getCustomerCodeData()
        this.customerCode.externalOrderId = this.wrapper.prefix
          .concat(this.timeStamp)
          .concat(this.wrapper.suffix)
      }
    }
    this.getAvalaibleSize()
  },
  computed: {
    onlyTimeStamp(): boolean {
      return !this.wrapper.prefix.length && !this.wrapper.suffix.length
    },
    senderIdentity(): CreateOrderStateSenderIdentity {
      return this.$store.getters['createOrder/senderIdentity/senderIdentity']
    },
    miscellaneous(): CreateOrderStateMiscellaneous {
      return this.$store.getters['createOrder/miscellaneous']
    },
    checkoutHasScan(): boolean {
      if (!this.miscellaneous.checkout) {
        return false
      }

      const blocks = Object.values(this.miscellaneous.checkout.steps).reduce((acc, step) => {
        return [...acc, ...step]
      }, [])

      return blocks.includes(CHECKOUT_BLOCKS.SCAN)
    },
    customerCode(): CreateOrderStateCustomerCode {
      return this.$store.getters['createOrder/customerCode/customerCode']
    },
    validations(): any {
      return this.$store.getters['createOrder/customerCode/$v']
    },
  },
  methods: {
    getAvalaibleSize() {
      const prefixLength = this.wrapper.prefix.length
      const suffixLength = this.wrapper.suffix.length
      if ((prefixLength || suffixLength) && !(prefixLength && suffixLength)) {
        this.numberOfCharAvailable = 22
      } else if (!(prefixLength && suffixLength)) {
        this.numberOfCharAvailable = 36
      } else if (prefixLength && suffixLength) {
        this.numberOfCharAvailable = 13
      }
    },
    async getCustomerCodeData(): Promise<void> {
      this.store = await StoreService.get(this.senderIdentity.storeId!)
      this.useConvertCustomerCode()
    },
    useConvertCustomerCode() {
      if (this.retailer?.orderIdConfig.prefix) {
        this.convertCustomerCode('prefix', this.retailer.orderIdConfig.prefix)
        if (this.wrapper.prefix) {
          this.wrapper.prefix = slugify(this.wrapper.prefix, {
            lower: true,
            remove: /[*+~.()'"!{}:§@]/g,
          })
            .substring(0, 13)
            .concat('_')
        }
      }
      if (this.retailer?.orderIdConfig.suffix) {
        this.convertCustomerCode('suffix', this.retailer.orderIdConfig.suffix)
        if (this.wrapper.suffix) {
          this.wrapper.suffix = '_'.concat(
            slugify(this.wrapper.suffix, {
              lower: true,
              remove: /[*+~.()'"!{}:§@]/g,
            }).substring(0, 13),
          )
        }
      }
    },
    convertCustomerCode(appendix: 'prefix' | 'suffix', appendixContent: string) {
      if (appendixContent === ORDER_GENERATION_PREFIX_SUFFIX.STORE_ID) {
        this.wrapper[appendix] = this.store.externalStoreId
      } else if (appendixContent === ORDER_GENERATION_PREFIX_SUFFIX.STORE_NAME) {
        this.wrapper[appendix] = this.store.name
      } else if (appendixContent === ORDER_GENERATION_PREFIX_SUFFIX.DAY_DATE) {
        this.wrapper[appendix] = dateHelper.format(new Date(), 'P').replace(/\//g, '')
      }
    },
  },
  watch: {
    timeStamp(next) {
      this.customerCode.externalOrderId = this.wrapper.prefix
        .concat(next)
        .concat(this.wrapper.suffix)
    },
  },
})
</script>

<style lang="scss" scoped>
#order-create-block-customerCode {
  .appendix-wrapper {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
  }

  @media #{map-get($display-breakpoints, 'xs-only')} {
    .appendix-wrapper {
      display: flex;
      flex-direction: column;
      width: 100%;
    }
  }

  .prefix-wrapper {
    width: 29%;
  }

  @media #{map-get($display-breakpoints, 'xs-only')} {
    .prefix-wrapper {
      width: 100%;
    }
  }

  .plus-text-wrapper {
    width: 30%;
    display: flex;
    gap: 1.2rem;
  }
  @media #{map-get($display-breakpoints, 'xs-only')} {
    .plus-text-wrapper {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 2rem;
    }
  }

  .timestamp-wrapper {
    display: flex;
    width: 100%;
  }

  .onlyTimeStamp {
    width: 100%;
  }

  .center-bloc {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .auto-fields {
    margin-top: 1rem;
    padding: 0 1.2rem;
  }

  .partial {
    gap: 1.2rem;
    padding: 0 1.2rem;
    margin-top: 1rem;
  }

  @media #{map-get($display-breakpoints, 'xs-only')} {
    .partial {
      padding: 0 1.2rem;
      margin-top: 1rem;
      flex-direction: column;
      justify-content: center;
    }
  }

  .complete {
    margin-top: 1rem;
    justify-content: space-between;
    padding: 0 1.2rem;
  }

  @media #{map-get($display-breakpoints, 'xs-only')} {
    .complete {
      margin-top: 1rem;
      justify-content: space-between;
      padding: 0 1.2rem;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }

  .separator {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 1.2rem;
  }
  #reference-number-more-detail-wrapper {
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

    .reference-number {
      padding-right: 1rem;
    }
  }
}
</style>
