import { ROUTES } from '@/constants'
import { NavLink } from '@/types'

const headerNavLinks: NavLink[] = [
  {
    route: ROUTES.dashboard,
    title: 'page.dashboard.title',
  },
  {
    route: ROUTES.orders,
    title: 'page.orders.title',
    feature: 'order',
  },
  {
    route: ROUTES.listCollect,
    title: 'breadcrumbs.collects',
    feature: 'collect',
  },
  {
    route: ROUTES.retailers,
    title: 'page.retailers.title',
  },
  {
    route: ROUTES.carriers,
    title: 'page.carriers.title',
  },
]

const mobileHeaderNavLinks: NavLink[] = [
  {
    route: ROUTES.users,
    title: 'page.users.title',
  },
  {
    route: ROUTES.rulesGroups,
    title: 'page.rulesGroups.title',
  },
  {
    route: ROUTES.notificationAdministration,
    title: 'page.notificationAdministration.title',
  },
  {
    route: ROUTES.administrationConfig,
    title: 'page.profile.admin',
  },
]

export { headerNavLinks, mobileHeaderNavLinks }
