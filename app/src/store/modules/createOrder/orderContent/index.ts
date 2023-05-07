import { maxInt } from '@/constants'
import { validationMixin } from '@/mixins'
import { PackageEntity, ProductEntity, References } from '@/types'
import Vue from 'vue'
import { CreateOrderStateOrderContent } from './types'
import isDecimalTooLong from '@/helpers/decimalHelper'
import {
  decimal,
  integer,
  maxValue,
  minValue,
  required,
  requiredIf,
} from 'vuelidate/lib/validators'

import getters from './getters'
import mutations from './mutations'
import { SET_ORDER_CONTENT } from './mutations-types'

export const defaultPackage = (): PackageEntity => {
  return {
    quantity: 1,
    references: [],
    weight: {
      value: 1,
      unit: 'kg',
    },
    width: {
      value: null,
      unit: 'cm',
    },
    length: {
      value: null,
      unit: 'cm',
    },
    height: {
      value: null,
      unit: 'cm',
    },
    products: [],
    type: '',
    attributes: {
      footprint: {
        unit: '',
        value: null,
      },
    },
  }
}

export const defaultProduct = (): ProductEntity => {
  return {
    quantity: 1,
    type: '',
    value: Math.random(),
  }
}

export const contentOrderInitialState: CreateOrderStateOrderContent = {
  packages: [{ ...defaultPackage() }],
}

export default function(store: any): any {
  const validator: any = new Vue({
    mixins: [validationMixin],
    computed: {
      orderContent() {
        return store.getters['createOrder/orderContent/orderContent']
      },
    },
    validations: {
      orderContent: {
        packages: {
          required,
          $each: {
            quantity: { required, integer, minValue: minValue(1) },
            references: {
              minArrayReferencesLength(references: References[], localPackage) {
                if (!references?.length) {
                  return true
                }

                return (
                  references.filter(({ reference }) => reference).length === localPackage.quantity
                )
              },
            },
            weight: {
              value: {
                required,
                decimal,
                maxValue: maxValue(maxInt),
                minValue: minValue(0.001),
                isDecimalTooLong: (value): boolean => {
                  return isDecimalTooLong(3)(value)
                },
              },
              unit: { required },
            },
            width: {
              value: {
                required,
                decimal,
                maxValue: maxValue(maxInt),
                minValue: minValue(0.01),
                isDecimalTooLong: (value): boolean => {
                  return isDecimalTooLong(2)(value)
                },
              },
              unit: { required },
            },
            length: {
              value: {
                required,
                decimal,
                maxValue: maxValue(maxInt),
                minValue: minValue(0.01),
                isDecimalTooLong: (value): boolean => {
                  return isDecimalTooLong(2)(value)
                },
              },
              unit: { required },
            },
            height: {
              value: {
                required,
                decimal,
                maxValue: maxValue(maxInt),
                minValue: minValue(0.01),
                isDecimalTooLong: (value): boolean => {
                  return isDecimalTooLong(2)(value)
                },
              },
              unit: { required },
            },
            products: {
              $each: {
                label: {},
                type: { required },
                quantity: { required, integer, minValue: minValue(1) },
                cug: {},
                ean: {},
              },
            },
            type: { required },
            attributes: {
              footprint: {
                unit: {
                  required: requiredIf(value => Boolean(value?.unit) || Boolean(value?.value)),
                },
                value: {
                  required: requiredIf(value => Boolean(value?.unit) || Boolean(value?.value)),
                  decimal,
                  minValue: minValue(0.01),
                },
              },
            },
          },
        },
      },
    },
  })

  return {
    state: contentOrderInitialState,
    getters: {
      ...getters,
      $v() {
        return Object.assign({}, validator.$v)
      },
      isOnePackageInvalid() {
        return (index: number) => {
          return (
            validator.$v.orderContent.packages.$each[index].height.$invalid ||
            validator.$v.orderContent.packages.$each[index].length.$invalid ||
            validator.$v.orderContent.packages.$each[index].quantity.$invalid ||
            validator.$v.orderContent.packages.$each[index].weight.$invalid ||
            validator.$v.orderContent.packages.$each[index].width.$invalid
          )
        }
      },
      isPackagesInvalid() {
        return (
          validator.$v.orderContent.packages.$invalid ||
          !validator.orderContent.packages.every(
            (localPackage: PackageEntity) => localPackage.products && localPackage.products.length,
          )
        )
      },
    },
    actions: {
      $touch() {
        validator.$v.$touch()
      },
      $reset() {
        JSON.parse(JSON.stringify(validator.$v))
        validator.$v.$reset()
      },
      async setOrderContent(state: any, orderContent: CreateOrderStateOrderContent): Promise<void> {
        await state.commit(SET_ORDER_CONTENT, orderContent)
      },
    },
    mutations: {
      ...mutations,
    },
  }
}
