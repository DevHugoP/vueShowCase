import { DataMutation } from '@/store/types'
import { defaultPackage } from '.'
import { SET_ORDER_CONTENT } from './mutations-types'
import { CreateOrderStateOrderContent } from './types'

const setOrderContent: DataMutation<CreateOrderStateOrderContent, CreateOrderStateOrderContent> = (
  state,
  value,
) => {
  const localPackages = []
  for (const localPackage of value.packages) {
    localPackages.push({
      ...defaultPackage(),
      ...localPackage,
      attributes: localPackage.attributes || defaultPackage().attributes,
    })
  }
  state.packages = localPackages
}

export default {
  [SET_ORDER_CONTENT]: setOrderContent,
}
