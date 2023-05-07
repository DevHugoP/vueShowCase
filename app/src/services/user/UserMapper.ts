import { INTERNAL_USER_PROVIDER } from '@/constants'
import {
  RulesGroupEntity,
  PermissionEntity,
  PermissionContext,
  RulesGroupLight,
  SelectItem,
  PermissionEntityNotCreated,
  UserEntity,
} from '@/types'
import {
  PermissionFormData,
  ContextForm,
  GroupsForm,
  ContextFormSubject,
  UserFormData,
} from '@/store/modules/user/types'

import StoreService from '@/services/store/StoreService'
import ExchangePlaceService from '@/services/exchangePlace/ExchangePlaceService'

export default class UserMapper {
  public static fromRulesGroupToRulesGroupForm(
    rulesGroups: RulesGroupEntity[],
    ids: string[] = [],
  ): Array<RulesGroupLight & { value: boolean }> {
    const rulesGroupsForm = []

    for (const rulesGroup of rulesGroups) {
      const { id, name } = rulesGroup
      rulesGroupsForm.push({
        id,
        name,
        value: ids.includes(id),
      })
    }

    return rulesGroupsForm
  }

  public static fromPermissionFormToPermissionPayload(
    permissionForm: PermissionFormData,
  ): {
    contexts: PermissionContext[]
    rulesGroupIds: string[]
  } {
    const {
      groups: { ids: rulesGroupIds },
      contexts: formContexts,
    } = permissionForm

    const contexts = formContexts
      .filter(({ value: { retailerId, carrierId } }) => retailerId || carrierId)
      .map(({ value: { carrierId, retailerId, storeIds, exchangePlaceIds } }) => ({
        carrierId: carrierId as number,
        retailerId: retailerId as number,
        storeIds,
        exchangePlaceIds,
      }))

    return {
      rulesGroupIds,
      contexts,
    }
  }

  public static async fromPermissionEntityToContextsForm(
    permission: PermissionEntity,
    retailerItems: SelectItem[],
    carrierItems: SelectItem[],
  ): Promise<ContextForm[]> {
    const contextsForm: ContextForm[] = []

    for (const context of permission.contexts) {
      const { carrierId, retailerId, storeIds, exchangePlaceIds } = context
      let storeItems: SelectItem[] = []
      let exchangePlaceItems: SelectItem[] = []
      let subject = ''
      if (exchangePlaceIds && exchangePlaceIds.length) {
        subject = ContextFormSubject.EXCHANGE_PLACE
      } else if (
        (Array.isArray(storeIds) && storeIds.length) ||
        (!Array.isArray(storeIds) && storeIds)
      ) {
        subject = ContextFormSubject.STORE
      } else if (retailerId) {
        subject = ContextFormSubject.RETAILER
      } else if (carrierId) {
        subject = ContextFormSubject.CARRIER
      }

      if (subject === ContextFormSubject.STORE) {
        const stores = await StoreService.getAll({ retailerId })

        storeItems = stores.map(({ id, name }: any) => ({
          value: id,
          text: name,
        }))
      }

      if (subject === ContextFormSubject.EXCHANGE_PLACE) {
        const [stores, exchangePlaces] = await Promise.all([
          StoreService.getAll({ id: storeIds }),
          ExchangePlaceService.getAll({ storeId: storeIds }),
        ])

        storeItems = stores.map(({ id, name }: any) => ({
          value: id,
          text: name,
        }))

        exchangePlaceItems = exchangePlaces.map(({ id, name }: any) => ({
          value: id,
          text: name,
        }))
      }

      contextsForm.push({
        subject,
        value: context,
        retailerItems,
        carrierItems,
        storeItems,
        exchangePlaceItems,
      })
    }
    return contextsForm
  }

  public static fromPermissionEntityToGroupsForm(permission: PermissionEntity): GroupsForm {
    return {
      ids: permission.rulesGroups.map(({ id }) => id),
      items: [],
    }
  }

  public static fromPermissionFormToPermissionEntity(
    permissionForm: PermissionFormData,
  ): PermissionEntityNotCreated {
    const {
      contexts: permissionFormContexts,
      groups: { ids, items },
    } = permissionForm

    const rulesGroups: RulesGroupLight[] = items
      .filter(item => ids.includes(item.id))
      .map(({ id, name }) => ({ id, name }))

    const contexts = permissionFormContexts.map(
      ({ value: { carrierId, retailerId, storeIds, exchangePlaceIds } }) => ({
        carrierId: carrierId as number,
        retailerId: retailerId as number,
        storeIds,
        exchangePlaceIds,
      }),
    )

    return {
      contexts,
      rulesGroups,
    }
  }

  public static cleanUserUpdate(user: UserFormData): UserFormData {
    const { password, passwordConfirmation, ...userIdentity } = user

    return {
      ...(password && { password }),
      ...(passwordConfirmation && { passwordConfirmation }),
      ...userIdentity,
    }
  }

  public static formatUser(user: UserEntity): UserEntity {
    const { providers } = user

    const lastConnection = providers?.length ? providers[0].lastConnection : null
    const localProvider = providers?.find(({ local: localAccount }) => localAccount)
    const externalProvider = providers?.filter(
      ({ provider }) => !INTERNAL_USER_PROVIDER.includes(provider),
    )

    return {
      ...user,
      lastConnection,
      local: localProvider?.local || false,
      external: !!externalProvider?.length,
      providers,
    }
  }
}
