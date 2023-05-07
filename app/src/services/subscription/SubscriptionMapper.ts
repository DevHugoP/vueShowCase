import { SubscriptionEntity } from '@/types'

export default class SubscriptionMapper {
  static toDto(subscriptions: Array<Record<string, any>>): Partial<SubscriptionEntity> {
    const callbacks = subscriptions.reduce((acc, subscription) => {
      const { criteria, url, version, auth, headers } = subscription
      return {
        ...acc,
        [criteria]: {
          url,
          version,
          ...(auth && { auth }),
          ...(headers && { headers }),
        },
      }
    }, {})

    return { callbacks }
  }
}
