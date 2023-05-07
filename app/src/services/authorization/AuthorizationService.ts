import { CurrentContext, PermissionContext, PermissionRules, RulesKey } from '@/types'

export type contextFlatten = {
  carrierIds: number[]
  retailerIds: number[]
  storeIds: number[]
  exchangePlaceIds: number[]
}

export class AuthorizationService {
  public isAllowed(
    rules: RulesKey | RulesKey[],
    permissions: PermissionRules[] = [],
    context?: CurrentContext,
    operator?: string,
  ): boolean {
    if (Array.isArray(rules) && rules.length && operator) {
      const result = new Set()

      for (const rule of rules) {
        for (const permission of permissions) {
          if (
            permission.rules.includes(rule) &&
            (!context || this.matchContexts(permission.contexts ?? [], context))
          ) {
            result.add(rule)
          }
        }
      }

      if (operator === 'AND') {
        return Array.from(result).length === rules.length
      } else if (operator === 'OR') {
        return Array.from(result).length > 0
      } else {
        throw new Error(`Error: operator must be equal to 'AND' or 'OR'`)
      }
    }

    return permissions.some(permission => {
      return (
        permission.rules.includes(rules as RulesKey) &&
        (!context || this.matchContexts(permission.contexts ?? [], context))
      )
    })
  }

  public matchContexts(contexts: PermissionContext[], currentContext: CurrentContext): boolean {
    return (
      !contexts.length || // if no contexts in permission (admin)
      contexts.some(({ carrierId, retailerId, storeIds, exchangePlaceIds }) => {
        let match = true

        if (currentContext.carrierId && carrierId !== currentContext.carrierId) {
          match = false
        }

        if (retailerId && currentContext.retailerId && retailerId !== currentContext.retailerId) {
          match = false
        }
        if (storeIds && currentContext.storeId) {
          if (
            Array.isArray(storeIds) &&
            storeIds.length &&
            !storeIds.includes(currentContext.storeId)
          ) {
            match = false
          } else if (!Array.isArray(storeIds) && storeIds && storeIds !== currentContext.storeId) {
            match = false
          }
        }
        if (
          exchangePlaceIds &&
          exchangePlaceIds.length &&
          currentContext.exchangePlaceId &&
          !exchangePlaceIds.includes(currentContext.exchangePlaceId)
        ) {
          match = false
        }

        return match
      })
    )
  }

  public getContext(permissions: PermissionRules[] = [], rule?: RulesKey): contextFlatten {
    const { carrierIds, retailerIds, storeIds, exchangePlaceIds } = permissions.reduce(
      (acc: contextFlatten, permission: PermissionRules) => {
        if (rule && !permission.rules.includes(rule)) {
          return acc
        }

        for (const context of permission.contexts) {
          if (context.carrierId) {
            acc.carrierIds.push(context.carrierId)
          }
          if (context.retailerId) {
            acc.retailerIds.push(context.retailerId)
          }
          if (Array.isArray(context.storeIds) && context.storeIds.length) {
            acc.storeIds = acc.storeIds.concat(context.storeIds)
          } else if (!Array.isArray(context.storeIds) && context.storeIds) {
            acc.storeIds.push(context.storeIds)
          }
          if (context.exchangePlaceIds) {
            acc.exchangePlaceIds = acc.exchangePlaceIds.concat(context.exchangePlaceIds)
          }
        }

        return acc
      },
      { carrierIds: [], retailerIds: [], storeIds: [], exchangePlaceIds: [] },
    )

    return {
      carrierIds: Array.from(new Set(carrierIds)),
      retailerIds: Array.from(new Set(retailerIds)),
      storeIds: Array.from(new Set(storeIds)),
      exchangePlaceIds: Array.from(new Set(exchangePlaceIds)),
    }
  }
}

export default new AuthorizationService()
