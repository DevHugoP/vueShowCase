import { dateHelper, dateHelperGetTimezonedDate } from '@/helpers/dateHelper'
import { i18n } from '@/plugins/i18n'
import { Contact, Filters, OrderEntity } from '@/types'
import convert from 'convert-units'

export default (order: OrderEntity, retailer: Filters, store: Filters): string => {
  const {
    packages,
    services,
    referenceNumber,
    delivery: {
      address: deliveryLocation,
      contact: deliveryContact,
      interval: [deliveryInterval],
    },
    picking: {
      address: pickingLocation,
      contact: pickingContact,
      interval: [pickingInterval],
    },
    tags,
  } = order

  const floor =
    (deliveryLocation.floor || '') &&
    ` ${i18n.t('common.floor')} : ${deliveryLocation.floor}<br />${i18n.t('common.elevator')}: ${
      deliveryLocation.elevator
    }`
  const deliveryAddress = `${deliveryLocation.addressLine1} <br/>${deliveryLocation.postalCode} ${deliveryLocation.city}${floor}`
  const pickingAddress = `${pickingLocation.addressLine1} <br/>${pickingLocation.postalCode} ${pickingLocation.city}`
  const pickingStart = dateHelper.formatToTimezone(
    dateHelperGetTimezonedDate(pickingInterval.start),
    'UTC',
    'P p',
  )
  const pickingEnd = dateHelper.formatToTimezone(
    dateHelperGetTimezonedDate(pickingInterval.end),
    'UTC',
    'P p',
  )
  const deliveryStart = dateHelper.formatToTimezone(
    dateHelperGetTimezonedDate(deliveryInterval.start),
    'UTC',
    'P p',
  )
  const deliveryEnd = dateHelper.formatToTimezone(
    dateHelperGetTimezonedDate(deliveryInterval.end),
    'UTC',
    'P p',
  )
  const contactDetail = (contact: Contact) =>
    `${contact.firstName} ${contact.lastName}<br />${contact.phone}<br />${
      contact.email
    }<br />${i18n.t('common.language')}: ${i18n.t(`common.languages.${contact.language}`)}`
  const packageDetail = packages.map((pack, index) => {
    const { quantity, length, width, height, weight } = pack
    const productsDetail = pack.products!.map(
      product =>
        `| ${product.quantity} | ${product.label || ''}| ${product.ean || ''} | ${product.cug ||
          ''} | ${i18n.t(`technical.typologies.${product.type}`)}`,
    )

    return `
  ### ${i18n.t('common.package')} ${index + 1}
  
  | ${i18n.t('common.quantity')} | ${i18n.t('common.length')} | ${i18n.t(
      'common.width',
    )} | ${i18n.t('common.height')} | ${i18n.t('common.weight')}
  |---|---|---|---|---|
  | ${quantity} | ${length.value} ${length.unit} | ${width.value} ${width.unit} | ${height.value} ${
      height.unit
    } | ${weight.value} ${weight.unit}
  
  <br/>
  
  | ${i18n.t('common.quantity')} | ${i18n.t('common.product')} | ${i18n.t(
      'page.detailOrder.packagesAndProducts.ean',
    )} | ${i18n.t('page.detailOrder.packagesAndProducts.cug')} | ${i18n.t(
      'page.detailOrder.packagesAndProducts.typology',
    )}
  |---|---|---|---|---|
  ${productsDetail.join('\n')}
  `
  })

  const { total, maxLength, totalWeight, maxWidth, maxWeight, maxHeight } = packages.reduce(
    (acc, pack) => {
      const length = convert(pack.length.value!)
        .from(pack.length.unit as any)
        .to('cm')
      const width = convert(pack.width.value!)
        .from(pack.width.unit as any)
        .to('cm')
      const height = convert(pack.height.value!)
        .from(pack.height.unit as any)
        .to('cm')
      const weight = convert(pack.weight.value!)
        .from(pack.weight.unit as any)
        .to('kg')

      if (acc.maxLength < length) {
        acc.maxLength = length
      }

      if (acc.maxWidth < width) {
        acc.maxWidth = width
      }

      if (acc.maxHeight < height) {
        acc.maxHeight = height
      }

      if (acc.maxWeight < weight) {
        acc.maxWeight = weight
      }

      return {
        ...acc,
        total: acc.total + pack.quantity,
        totalWeight: acc.totalWeight + weight * pack.quantity,
      }
    },
    { total: 0, maxLength: 0, totalWeight: 0, maxWidth: 0, maxWeight: 0, maxHeight: 0 },
  )

  return `
  # ${i18n.t('common.information_plural')}
  
  ## ${i18n.t('common.retailer')}
  
  ${i18n.t('common.retailer')}: ${retailer.name}<br/>
  ${i18n.t('common.store')}: ${store.name}
  
  ## ${i18n.t('common.order')}
  
  | ${i18n.t('page.orders.table.reference')} | ${i18n.t('page.orders.table.service')} | Tag 
  |---|---|---|
  | ${referenceNumber} | ${services.map(service => i18n.t(`technical.services.${service}`))} | ${(
    tags || []
  ).map(tag => `${tag.key}: ${tag.value}`)}
  
  
  ## ${i18n.t('common.picking')}:
  
  | ${i18n.t('common.address.base')} |  ${i18n.t('common.date')} (${
    pickingContact.timezone
  }}) | ${i18n.t('common.contact')} 
  |---|---|---|
  | ${pickingAddress} | ${pickingStart}<br />${pickingEnd}| ${contactDetail(pickingContact)}
  
  ## ${i18n.t('common.delivery')}:
  
  
  | ${i18n.t('common.address.base')} |  ${i18n.t('common.date')} (${
    deliveryContact.timezone
  }) | ${i18n.t('common.contact')} 
  |---|---|---|
  | ${deliveryAddress} | ${deliveryStart}<br />${deliveryEnd} | ${contactDetail(deliveryContact)}
  
  # ${i18n.t('common.package')}:
  
  ## ${i18n.t('common.summary')}
  
  | ${i18n.t('common.number')} | ${i18n.t('page.order.summary.packageWeight_plural')} | ${i18n.t(
    'page.order.summary.maxLength',
  )} |  ${i18n.t('page.detailOrder.packagesAndProducts.packagesMaxWidth')} | ${i18n.t(
    'page.detailOrder.packagesAndProducts.packagesMaxHeight',
  )} | ${i18n.t('page.carrier.capacity.maxWeight_light')}
  |---|---|---|---|---|---|
  | ${total} | ${totalWeight} kg | ${maxLength} cm | ${maxWidth} cm | ${maxHeight} cm | ${maxWeight} kg
  
  ## ${i18n.t('common.detail')}
  
  ${packageDetail.join('\n')}
        `
}
