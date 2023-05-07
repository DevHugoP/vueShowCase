import { dateHelper } from '@/helpers/dateHelper'
import { i18n } from '../../plugins/i18n'

export const PREVIEW_ORDER = (locale: string): Record<string, any> => {
  return {
    orderId: 'externalOrderId',
    retailerName: "Nom d'enseigne",
    referenceNumber: 'Id de référence',
    carrier: {
      id: '4',
      name: 'Transporteur',
      address: {
        addressLine1: '1 rue de BPost',
        city: 'Lille',
        country: 'FR',
        postalCode: '59000',
        apiClientId: 'ZZBer5pnj7Hfys8C1KaV2Dx4quIP',
      },
      contacts: {
        email: 'bernard@bepost.be',
        firstName: 'Bernard',
        language: 'fr',
        lastName: 'Pierre',
        phone: '+33750441122',
        timezone: 'Europe/Paris',
        title: 'LEGAL_REPRESENTATIVE',
      },
    },
    store: {
      id: '4',
      name: 'storeName',
    },
    Delivery: {
      accessToken: '8b456fd82df19ab97162461206e57668',
      carrierId: 4,
      createdAt: '2021-06-25T07:12:00.298411+00:00',
      currentStatus: 'DELIVERY_DELIVERED_OK',
      externalDeliveryId: 'cdff9524-3d4b-4be1-b762-8e566cf13a1a',
      externalReference: 'cdff9524-3d4b-4be1-b762-8e566cf13a1a',
      id: 1,
      orderId: 1,
      quoteId: 3,
      retailerId: 3,
      updatedAt: '2021-06-25T07:14:51.087289+00:00',
    },
    picking: {
      address: {
        addressLine1: 'rue De Versailles Zac De Valmy',
        addressLine2: 'Boulevard de Valmy',
        postalCode: '59650',
        city: "Villeneuve-d'Ascq",
        country: 'FR',
      },
      interval: [
        {
          start: dateHelper.format(
            dateHelper.add(dateHelper.getDate(), { days: 2 }),
            'PPPPpppp',
            locale,
          ),
          end: dateHelper.format(
            dateHelper.add(dateHelper.getDate(), { days: 2, hours: 4 }),
            'PPPPpppp',
            locale,
          ),
        },
      ],
      contact: {
        main: true,
        title: 'Responsable',
        firstName: 'Pierre',
        lastName: 'Auriol',
        phone: '+33600000000',
        email: 'email@sample.fr',
      },
    },
    delivery: {
      address: {
        addressLine1: '127 rue du lion',
        postalCode: '59000',
        city: 'Lille',
        country: 'FR',
      },
      interval: [
        {
          start: dateHelper.format(
            dateHelper.add(dateHelper.getDate(), { days: 3 }),
            'PPPPpppp',
            locale,
          ),
          end: dateHelper.format(
            dateHelper.add(dateHelper.getDate(), { days: 3, hours: 4 }),
            'PPPPpppp',
            locale,
          ),
        },
      ],
      contact: {
        firstName: 'Jean',
        lastName: 'Valjean',
        phone: '+33600000000',
        email: 'email@sample.fr',
      },
      createdAt: '2021-06-24T16:06:35.193045+00:00',
    },
    services: ['SERVICE_SELECTED_ROOM'].map(service =>
      i18n.t(`technical.services.${service}`, {}, locale),
    ),
    packages: [
      {
        quantity: 2,
        products: [
          {
            ean: 'ean test 12',
            type: i18n.t(`technical.typologies.TYPOLOGY_GENERIC`, {}, locale),
          },
        ],
        length: {
          value: 10,
          unit: 'cm',
        },
        width: {
          value: 10,
          unit: 'cm',
        },
        height: {
          value: 10,
          unit: 'cm',
        },
        weight: {
          value: 12,
          unit: 'kg',
        },
      },
      {
        quantity: 1,
        products: [
          {
            ean: 'ean test 14',
            type: i18n.t(`technical.typologies.TYPOLOGY_GENERIC`, {}, locale),
          },
          {
            label: 'label 12',
            type: i18n.t(`technical.typologies.TYPOLOGY_GENERIC`, {}, locale),
          },
        ],
        length: {
          value: 10,
          unit: 'cm',
        },
        width: {
          value: 10,
          unit: 'cm',
        },
        height: {
          value: 10,
          unit: 'cm',
        },
        weight: {
          value: 12,
          unit: 'kg',
        },
      },
    ],
    storeId: '2000',
  }
}
