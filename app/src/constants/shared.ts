export const COUNTRY = {
  FRANCE: 'FR',
  BELGIUM: 'BE',
  LUXEMBOURG: 'LU',
  GERMANY: 'DE',
  SPAIN: 'ES',
  ITALY: 'IT',
  ANDORRA: 'AD',
  MONACO: 'MC',
  NETHERLANDS: 'NL',
  SWITZERLAND: 'CH',
  GREAT_BRITAIN: 'GB',
  REUNION: 'RE',
  PORTUGAL: 'PT',
  HUNGARY: 'HU',
  CROATIA: 'HR',
  SLOVENIA: 'SI',
  POLAND: 'PL',
  SLOVAKIA: 'SK',
  CZECH_REPUBLIC: 'CZ',
}

export const LANGUAGES_TO_CODE_ISO2: { [key: string]: string } = {
  fr: 'fr',
  en: 'gb',
  'nl-be': 'nl',
  es: 'es',
  it: 'it',
  ca: 'es',
  de: 'de',
  pt: 'pt',
  sk: 'sk',
  cz: 'cz',
  hu: 'hu',
}

export const DEPARTMENTS: Record<string, any> = {
  FR: {
    '01': 'Ain',
    '02': 'Aisne',
    '03': 'Allier',
    '04': 'Alpes-de-Haute-Provence',
    '05': 'Hautes-Alpes',
    '06': 'Alpes-Maritimes',
    '07': 'Ardèche',
    '08': 'Ardennes',
    '09': 'Ariège',
    '10': 'Aube',
    '11': 'Aude',
    '12': 'Aveyron',
    '13': 'Bouches-du-Rhône',
    '14': 'Calvados',
    '15': 'Cantal',
    '16': 'Charente',
    '17': 'Charente-Maritime',
    '18': 'Cher',
    '19': 'Corrèze',
    '2A': 'Corse-du-sud',
    '2B': 'Haute-Corse',
    '21': "Côte-d'Or",
    '22': "Côtes-d'Armor",
    '23': 'Creuse',
    '24': 'Dordogne',
    '25': 'Doubs',
    '26': 'Drôme',
    '27': 'Eure',
    '28': 'Eure-et-Loir',
    '29': 'Finistère',
    '30': 'Gard',
    '31': 'Haute-Garonne',
    '32': 'Gers',
    '33': 'Gironde',
    '34': 'Hérault',
    '35': 'Ille-et-Vilaine',
    '36': 'Indre',
    '37': 'Indre-et-Loire',
    '38': 'Isère',
    '39': 'Jura',
    '40': 'Landes',
    '41': 'Loir-et-Cher',
    '42': 'Loire',
    '43': 'Haute-Loire',
    '44': 'Loire-Atlantique',
    '45': 'Loiret',
    '46': 'Lot',
    '47': 'Lot-et-Garonne',
    '48': 'Lozère',
    '49': 'Maine-et-Loire',
    '50': 'Manche',
    '51': 'Marne',
    '52': 'Haute-Marne',
    '53': 'Mayenne',
    '54': 'Meurthe-et-Moselle',
    '55': 'Meuse',
    '56': 'Morbihan',
    '57': 'Moselle',
    '58': 'Nièvre',
    '59': 'Nord',
    '60': 'Oise',
    '61': 'Orne',
    '62': 'Pas-de-Calais',
    '63': 'Puy-de-Dôme',
    '64': 'Pyrénées-Atlantiques',
    '65': 'Hautes-Pyrénées',
    '66': 'Pyrénées-Orientales',
    '67': 'Bas-Rhin',
    '68': 'Haut-Rhin',
    '69': 'Rhône',
    '70': 'Haute-Saône',
    '71': 'Saône-et-Loire',
    '72': 'Sarthe',
    '73': 'Savoie',
    '74': 'Haute-Savoie',
    '75': 'Paris',
    '76': 'Seine-Maritime',
    '77': 'Seine-et-Marne',
    '78': 'Yvelines',
    '79': 'Deux-Sèvres',
    '80': 'Somme',
    '81': 'Tarn',
    '82': 'Tarn-et-Garonne',
    '83': 'Var',
    '84': 'Vaucluse',
    '85': 'Vendée',
    '86': 'Vienne',
    '87': 'Haute-Vienne',
    '88': 'Vosges',
    '89': 'Yonne',
    '90': 'Territoire de Belfort',
    '91': 'Essonne',
    '92': 'Hauts-de-Seine',
    '93': 'Seine-St-Denis',
    '94': 'Val-de-Marne',
    '95': "Val-d'Oise",
    '971': 'Guadeloupe',
    '972': 'Martinique',
    '973': 'Guyane',
    '974': 'La Réunion',
    '976': 'Mayotte',
    '98': 'Monaco',
  },
  ES: {
    '01': 'Alava',
    '02': 'Albacete',
    '03': 'Alicante',
    '04': 'Almería',
    '05': 'Ávila',
    '06': 'Badajoz',
    '07': 'Îles Baléares',
    '08': 'Barcelone',
    '09': 'Burgos',
    '10': 'Cáceres',
    '11': 'Cadix',
    '12': 'Castellón',
    '13': 'Ciudad Real',
    '14': 'Cordoue',
    '15': 'La Corogne',
    '16': 'Cuenca',
    '17': 'Gérone',
    '18': 'Grenade',
    '19': 'Guadalajara',
    '20': 'Guipuscoa',
    '21': 'Huelva',
    '22': 'Huesca',
    '23': 'Jaén',
    '24': 'León',
    '25': 'Lleida',
    '26': 'La Rioja',
    '27': 'Lugo',
    '28': 'Madrid',
    '29': 'Malaga',
    '30': 'Murcie',
    '31': 'Navarra',
    '32': 'Orense',
    '33': 'Asturies',
    '34': 'Palencia',
    '35': 'Las Palmas',
    '36': 'Pontevedra',
    '37': 'Salamanque',
    '38': 'Santa Cruz de Tenerife',
    '39': 'Cantabrie',
    '40': 'Ségovie',
    '41': 'Séville',
    '42': 'Soria',
    '43': 'Tarragone',
    '44': 'Teruel',
    '45': 'Tolède',
    '46': 'Valence',
    '47': 'Valladolid',
    '48': 'Biscaye',
    '49': 'Zamora',
    '50': 'Saragosse',
    '51': 'Ceuta',
    '52': 'Melilla',
  },
  BE: {
    '10-12': 'Bruxelles',
    '13-14': 'Wavre, Limal, Nivelles',
    '15-16': 'Halle',
    '17-19': 'Dilbeek, Vilvorde',
    '20-24': 'Anvers',
    '25-29': 'Lierre, Malines',
    '30-34': 'Louvain',
    '35-39': 'Hasselt',
    '40-44': 'Liège',
    '45-49': 'Huy',
    '50-56': 'Namur',
    '60-65': 'Charleroi',
    '66-69': 'Bastogne',
    '70-73': 'Mons',
    '75-79': 'Tournai, Mouscron',
    '80-84': 'Bruges',
    '85-89': 'Courtrai',
    '90-94': 'Gand',
    '95-99': 'Grammont'
  },
}

export const CURRENCY = [
  'EUR',
  'USD',
  'GBP',
  'JPY',
  'AUD',
  'AED',
  'AFN',
  'ALL',
  'AMD',
  'ANG',
  'AOA',
  'ARS',
  'AWG',
  'AZN',
  'BAM',
  'BBD',
  'BDT',
  'BGN',
  'BHD',
  'BIF',
  'BMD',
  'BND',
  'BOB',
  'BOV',
  'BRL',
  'BSD',
  'BTN',
  'BWP',
  'BYR',
  'BZD',
  'CAD',
  'CDF',
  'CHE',
  'CHF',
  'CHW',
  'CLF',
  'CLP',
  'CNY',
  'COP',
  'COU',
  'CRC',
  'CUC',
  'CUP',
  'CVE',
  'CZK',
  'DJF',
  'DKK',
  'DOP',
  'DZD',
  'EGP',
  'ERN',
  'ETB',
  'FJD',
  'FKP',
  'GEL',
  'GHS',
  'GIP',
  'GMD',
  'GNF',
  'GTQ',
  'GYD',
  'HKD',
  'HNL',
  'HRK',
  'HTG',
  'HUF',
  'IDR',
  'ILS',
  'INR',
  'IQD',
  'IRR',
  'ISK',
  'JMD',
  'JOD',
  'KES',
  'KGS',
  'KHR',
  'KMF',
  'KPW',
  'KRW',
  'KWD',
  'KYD',
  'KZT',
  'LAK',
  'LBP',
  'LKR',
  'LSL',
  'LYD',
  'MAD',
  'MDL',
  'MGA',
  'MKD',
  'MMK',
  'MNT',
  'MOP',
  'MRO',
  'MUR',
  'MVR',
  'MWK',
  'MXN',
  'MXV',
  'MYR',
  'MZN',
  'NAD',
  'NGN',
  'NIO',
  'NOK',
  'NPR',
  'NZD',
  'OMR',
  'PAB',
  'PEN',
  'PGK',
  'PHP',
  'PKR',
  'PLN',
  'PYG',
  'QAR',
  'RON',
  'RSD',
  'RUB',
  'RWF',
  'SAR',
  'SBD',
  'SCR',
  'SDG',
  'SEK',
  'SHP',
  'SLL',
  'SOS',
  'SRD',
  'SSP',
  'STD',
  'SVC',
  'SYP',
  'SZL',
  'THB',
  'TJS',
  'TMT',
  'TND',
  'TOP',
  'TRY',
  'TTD',
  'TWD',
  'TZS',
  'UAH',
  'UGX',
  'USN',
  'UYI',
  'UYU',
  'UZS',
  'VEF',
  'VND',
  'VUV',
  'WST',
  'XAF',
  'XCD',
  'XDR',
  'XOF',
  'XPF',
  'XSU',
  'XUA',
  'YER',
  'ZAR',
  'ZMW',
  'ZWL',
]

export const ALL_NOTIFICATIONS = {
  SMS: {
    DELIVERY: {
      SMS_INIT: 'SMS_INIT',
      SMS_PICK_UP_OK: 'SMS_PICK_UP_OK',
      SMS_DELIVERED_OK: 'SMS_DELIVERED_OK',
      SMS_PICK_UP_SOON: 'SMS_PICK_UP_SOON',
      SMS_REPLANNED: 'SMS_REPLANNED',
      SMS_DELIVERY_PICK_UP_KO: 'SMS_DELIVERY_PICK_UP_KO',
    },
    ORDER: {
      SMS_ORDER_BEING_DELIVERED: 'SMS_ORDER_BEING_DELIVERED',
      SMS_ORDER_CANCELLED: 'SMS_ORDER_CANCELLED',
      SMS_ORDER_CREATED: 'SMS_ORDER_CREATED',
      SMS_ORDER_DELIVERED: 'SMS_ORDER_DELIVERED',
      SMS_ORDER_DELIVERY_UNCOMPLETED: 'SMS_ORDER_DELIVERY_UNCOMPLETED',
      SMS_ORDER_QUOTE_TO_BE_CONFIRMED: 'SMS_ORDER_QUOTE_TO_BE_CONFIRMED',
      SMS_ORDER_QUOTED: 'SMS_ORDER_QUOTED',
      SMS_ORDER_REFUSED_DELIVERY: 'SMS_ORDER_REFUSED_DELIVERY',
      SMS_ORDER_TO_BE_QUOTED: 'SMS_ORDER_TO_BE_QUOTED',
      SMS_ORDER_TO_BE_SENT_TO_CARRIER: 'SMS_ORDER_TO_BE_SENT_TO_CARRIER',
      SMS_ORDER_TO_DELIVER: 'SMS_ORDER_TO_DELIVER',
      SMS_ORDER_WITH_NO_CARRIER_AVAILABLE: 'SMS_ORDER_WITH_NO_CARRIER_AVAILABLE',
      SMS_ORDER_WITH_NO_CARRIER_ELIGIBLE: 'SMS_ORDER_WITH_NO_CARRIER_ELIGIBLE',
      SMS_ORDER_WITH_NO_QUOTE: 'SMS_ORDER_WITH_NO_QUOTE',
      SMS_ORDER_TO_BE_COMPLETED: 'SMS_ORDER_TO_BE_COMPLETED',
    },
    CLICK_AND_COLLECT: {
      SMS_COLLECT_INIT: 'SMS_COLLECT_INIT',
      SMS_COLLECT_STOCK_OK: 'SMS_COLLECT_STOCK_OK',
      SMS_COLLECT_STARTED: 'SMS_COLLECT_STARTED',
      SMS_COLLECT_READY: 'SMS_COLLECT_READY',
      SMS_COLLECT_AWAITING: 'SMS_COLLECT_AWAITING',
      SMS_COLLECT_IN_PROGRESS: 'SMS_COLLECT_IN_PROGRESS',
      SMS_COLLECT_PICK_UP_OK: 'SMS_COLLECT_PICK_UP_OK',
      SMS_COLLECT_PICK_UP_FAILED: 'SMS_COLLECT_PICK_UP_FAILED',
      SMS_COLLECT_PICK_UP_PARTIALLY: 'SMS_COLLECT_PICK_UP_PARTIALLY',
      SMS_COLLECT_CANCELLED: 'SMS_COLLECT_CANCELLED',
      SMS_COLLECT_BLOCKED: 'SMS_COLLECT_BLOCKED',
      SMS_COLLECT_DELAYED: 'SMS_COLLECT_DELAYED',
      SMS_COLLECT_REPLANNED: 'SMS_COLLECT_REPLANNED',
    },
  },
  MAIL: {
    DELIVERY: {
      MAIL_INIT: 'MAIL_INIT',
      MAIL_PICK_UP_OK: 'MAIL_PICK_UP_OK',
      MAIL_DELIVERED_OK: 'MAIL_DELIVERED_OK',
      MAIL_PICK_UP_SOON: 'MAIL_PICK_UP_SOON',
      MAIL_PRODUCT_RETURN: 'MAIL_PRODUCT_RETURN',
      MAIL_DELIVERY_IN_PROGRESS: 'MAIL_DELIVERY_IN_PROGRESS',
      MAIL_DELIVERY_AT_DROP_OF_LOCATION: 'MAIL_DELIVERY_AT_DROP_OF_LOCATION',
      MAIL_DELIVERY_DELIVERED_WITH_CLAIM: 'MAIL_DELIVERY_DELIVERED_WITH_CLAIM',
      MAIL_DELIVERY_RETURNED_TO_PICK_UP: 'MAIL_DELIVERY_RETURNED_TO_PICK_UP',
      MAIL_DELIVERY_CANCELLED: 'MAIL_DELIVERY_CANCELLED',
      MAIL_DELIVERY_REPLANNED: 'MAIL_DELIVERY_REPLANNED',
      MAIL_DELIVERY_AVAILABLE: 'MAIL_DELIVERY_AVAILABLE',
      MAIL_DELIVERY_PICK_UP_KO: 'MAIL_DELIVERY_PICK_UP_KO',
    },
    ORDER: {
      MAIL_ORDER_BEING_DELIVERED: 'MAIL_ORDER_BEING_DELIVERED',
      MAIL_ORDER_CANCELLED: 'MAIL_ORDER_CANCELLED',
      MAIL_ORDER_CREATED: 'MAIL_ORDER_CREATED',
      MAIL_ORDER_DELIVERED: 'MAIL_ORDER_DELIVERED',
      MAIL_ORDER_DELIVERY_UNCOMPLETED: 'MAIL_ORDER_DELIVERY_UNCOMPLETED',
      MAIL_ORDER_QUOTE_TO_BE_CONFIRMED: 'MAIL_ORDER_QUOTE_TO_BE_CONFIRMED',
      MAIL_ORDER_QUOTED: 'MAIL_ORDER_QUOTED',
      MAIL_ORDER_REFUSED_DELIVERY: 'MAIL_ORDER_REFUSED_DELIVERY',
      MAIL_ORDER_TO_BE_QUOTED: 'MAIL_ORDER_TO_BE_QUOTED',
      MAIL_ORDER_TO_BE_SENT_TO_CARRIER: 'MAIL_ORDER_TO_BE_SENT_TO_CARRIER',
      MAIL_ORDER_TO_DELIVER: 'MAIL_ORDER_TO_DELIVER',
      MAIL_ORDER_WITH_NO_CARRIER_AVAILABLE: 'MAIL_ORDER_WITH_NO_CARRIER_AVAILABLE',
      MAIL_ORDER_WITH_NO_CARRIER_ELIGIBLE: 'MAIL_ORDER_WITH_NO_CARRIER_ELIGIBLE',
      MAIL_ORDER_WITH_NO_QUOTE: 'MAIL_ORDER_WITH_NO_QUOTE',
      MAIL_ORDER_TO_BE_COMPLETED: 'MAIL_ORDER_TO_BE_COMPLETED',
    },
    CLICK_AND_COLLECT: {
      MAIL_COLLECT_INIT: 'MAIL_COLLECT_INIT',
      MAIL_COLLECT_STOCK_OK: 'MAIL_COLLECT_STOCK_OK',
      MAIL_COLLECT_STARTED: 'MAIL_COLLECT_STARTED',
      MAIL_COLLECT_READY: 'MAIL_COLLECT_READY',
      MAIL_COLLECT_AWAITING: 'MAIL_COLLECT_AWAITING',
      MAIL_COLLECT_IN_PROGRESS: 'MAIL_COLLECT_IN_PROGRESS',
      MAIL_COLLECT_PICK_UP_OK: 'MAIL_COLLECT_PICK_UP_OK',
      MAIL_COLLECT_PICK_UP_FAILED: 'MAIL_COLLECT_PICK_UP_FAILED',
      MAIL_COLLECT_PICK_UP_PARTIALLY: 'MAIL_COLLECT_PICK_UP_PARTIALLY',
      MAIL_COLLECT_CANCELLED: 'MAIL_COLLECT_CANCELLED',
      MAIL_COLLECT_BLOCKED: 'MAIL_COLLECT_BLOCKED',
      MAIL_COLLECT_DELAYED: 'MAIL_COLLECT_DELAYED',
      MAIL_COLLECT_REPLANNED: 'MAIL_COLLECT_REPLANNED',
    },
  },
  SLACK: {},
  CALL: {},
}

export const DELIVERY_STATUS = {
  INIT: 'DELIVERY_INIT',
  STARTED: 'DELIVERY_STARTED',
  PICK_UP_REACHED: 'DELIVERY_PICK_UP_REACHED',
  PICK_UP_OK: 'DELIVERY_PICK_UP_OK',
  PICK_UP_FAILED: 'DELIVERY_PICK_UP_FAILED',
  IN_PROGRESS: 'DELIVERY_IN_PROGRESS',
  AT_DROP_OF_LOCATION: 'DELIVERY_AT_DROP_OF_LOCATION',
  DELIVERED_OK: 'DELIVERY_DELIVERED_OK',
  DELIVERED_WITH_CLAIM: 'DELIVERY_DELIVERED_WITH_CLAIM',
  FAILED_WITH_RETURN: 'DELIVERY_FAILED_WITH_RETURN',
  RETURNED_TO_PICK_UP: 'DELIVERY_RETURNED_TO_PICK_UP',
  CANCELLED: 'DELIVERY_CANCELLED',
  CANCELLED_WITH_RETURN: 'DELIVERY_CANCELLED_WITH_RETURN',
  BLOCKED: 'DELIVERY_BLOCKED',
  DELAYED: 'DELIVERY_DELAYED',
  AVAILABLE: 'DELIVERY_AVAILABLE',
  REPLANNED: 'DELIVERY_REPLANNED',
  DELIVERY_PICKUP_SOON: 'DELIVERY_PICKUP_SOON',
  PRODUCT_RETURN: 'PRODUCT_RETURN',
  CLOSED: 'DELIVERY_CLOSED',
}

export const ALLOWED_VEHICLE_TYPES = {
  PEDESTRIAN: 'VEHICLE_TYPE_PEDESTRIAN',
  BIKE: 'VEHICLE_TYPE_BIKE',
  E_BIKE: 'VEHICLE_TYPE_E_BIKE',
  BIKE_CARGO: 'VEHICLE_TYPE_BIKE_CARGO',
  E_BIKE_CARGO: 'VEHICLE_TYPE_E_BIKE_CARGO',
  TRAILER_BIKE: 'VEHICLE_TYPE_TRAILER_BIKE',
  E_TRAILER_BIKE: 'VEHICLE_TYPE_E_TRAILER_BIKE',
  E_SCOOTER: 'VEHICLE_TYPE_E_SCOOTER',
  SCOOTER: 'VEHICLE_TYPE_SCOOTER',
  E_CAR: 'VEHICLE_TYPE_E_CAR',
  HYBRID_CAR: 'VEHICLE_TYPE_HYBRID_CAR',
  CAR: 'VEHICLE_TYPE_CAR',
  VAN_SMALL: 'VEHICLE_TYPE_VAN_SMALL',
  E_VAN_SMALL: 'VEHICLE_TYPE_E_VAN_SMALL',
  GAZ_VAN_SMALL: 'VEHICLE_TYPE_GAZ_VAN_SMALL',
  VAN_MEDIUM: 'VEHICLE_TYPE_VAN_MEDIUM',
  E_VAN_MEDIUM: 'VEHICLE_TYPE_E_VAN_MEDIUM',
  GAZ_VAN_MEDIUM: 'VEHICLE_TYPE_GAZ_VAN_MEDIUM',
  VAN_BIG: 'VEHICLE_TYPE_VAN_BIG',
  E_VAN_BIG: 'VEHICLE_TYPE_E_VAN_BIG',
  GAZ_VAN_BIG: 'VEHICLE_TYPE_GAZ_VAN_BIG',
  TRUCK: 'VEHICLE_TYPE_TRUCK',
  E_TRUCK: 'VEHICLE_TYPE_E_TRUCK',
  GAZ_TRUCK: 'VEHICLE_TYPE_GAZ_TRUCK',
  MAXI_TRUCK: 'VEHICLE_TYPE_MAXI_TRUCK',
  MAXI_E_TRUCK: 'VEHICLE_TYPE_MAXI_E_TRUCK',
  MAXI_GAZ_TRUCK: 'VEHICLE_TYPE_MAXI_GAZ_TRUCK',
  UNKNOWN: 'VEHICLE_TYPE_UNKNOWN',
}

export const AVAILABLE_PRODUCT_TYPOLOGIES = {
  GENERIC: 'TYPOLOGY_GENERIC',
  PALLET_GENERIC: 'TYPOLOGY_PALLET_GENERIC',
  GROCERY: 'TYPOLOGY_GROCERY',
  FRESH: 'TYPOLOGY_FRESH',
  FROZEN: 'TYPOLOGY_FROZEN',
  DANGEROUS: 'TYPOLOGY_DANGEROUS',
  HOUSEHOLD: 'TYPOLOGY_HOUSEHOLD',
  LARGE_HOUSEHOLD: 'TYPOLOGY_LARGE_HOUSEHOLD',
  VOLUMINOUS: 'TYPOLOGY_VOLUMINOUS',
  FRAGILE: 'TYPOLOGY_FRAGILE',
  VOLUMINOUS_FRAGILE: 'TYPOLOGY_VOLUMINOUS_FRAGILE',
  NON_STANDARD: 'TYPOLOGY_NON_STANDARD',
  SMALL_HOUSEHOLD: 'TYPOLOGY_SMALL_HOUSEHOLD',
  DANGEROUS_LIMITED_QUANTITY: 'TYPOLOGY_DANGEROUS_LIMITED_QUANTITY',
  HIGHT_VALUE: 'TYPOLOGY_HIGHT_VALUE',
  FURNITURE: 'TYPOLOGY_FURNITURE',
  LIVING_ANIMALS: 'TYPOLOGY_LIVING_ANIMALS',
  MEDICAL_PRODUCTS: 'TYPOLOGY_MEDICAL_PRODUCTS',
}

export const AVAILABLE_LEVEL_SERVICES = {
  SELECTED_ROOM: 'SERVICE_SELECTED_ROOM',
  FRONT_HOME: 'SERVICE_FRONT_HOME',
  UNPACKING: 'SERVICE_UNPACKING',
  INSTALL: 'SERVICE_INSTALL',
  SIMPLE_INSTALL: 'SERVICE_SIMPLE_INSTALL',
  COMPLEX_INSTALL: 'SERVICE_COMPLEX_INSTALL',
  RECOVERY: 'SERVICE_RECOVERY',
  PICKUP_POINT: 'SERVICE_PICKUP_POINT',
  REGULAR_FRONT_HOME: 'SERVICE_REGULAR_FRONT_HOME',
  ASSEMBLY: 'SERVICE_ASSEMBLY',
  RETURN: 'SERVICE_RETURN',
  STANDARD_TAXI: 'SERVICE_STANDARD_TAXI',
  XL_TAXI: 'SERVICE_XL_TAXI',
  WITH_SIGNATURE: 'SERVICE_WITH_SIGNATURE',
  PAY_ON_DELIVERY: 'SERVICE_PAY_ON_DELIVERY',
  GREEN: 'SERVICE_GREEN',
  SHUTTLE: 'SERVICE_SHUTTLE',
  TWO_DRIVERS: 'SERVICE_TWO_DRIVERS',
  EXHIBITION_MODEL: 'SERVICE_EXHIBITION_MODEL',
  WHITE_GLOVE: 'SERVICE_WHITE_GLOVE',
  EXCHANGE: 'SERVICE_EXCHANGE',
  DELIVERY_TO_LOCKER: 'SERVICE_DELIVERY_TO_LOCKER',
  DELIVERY_TO_PICKUP_POINT: 'SERVICE_DELIVERY_TO_PICKUP_POINT',
  DELIVERY_TO_MAILBOX: 'SERVICE_DELIVERY_TO_MAILBOX',
}

export const NEW_AVAILABLE_SERVICES = {
  SERVICE_FRONT_HOME: {
    options: [
      'SERVICE_UNPACKING',
      'SERVICE_INSTALL',
      'SERVICE_RECOVERY',
      'SERVICE_WITH_SIGNATURE',
      'SERVICE_STANDARD_TAXI',
      'SERVICE_XL_TAXI',
      'SERVICE_PAY_ON_DELIVERY',
    ],
  },
  SERVICE_SELECTED_ROOM: {
    options: [
      'SERVICE_UNPACKING',
      'SERVICE_INSTALL',
      'SERVICE_SIMPLE_INSTALL',
      'SERVICE_COMPLEX_INSTALL',
      'SERVICE_RECOVERY',
      'SERVICE_ASSEMBLY',
      'SERVICE_WITH_SIGNATURE',
      'SERVICE_STANDARD_TAXI',
      'SERVICE_XL_TAXI',
      'SERVICE_PAY_ON_DELIVERY',
    ],
  },
  SERVICE_REGULAR_FRONT_HOME: {
    options: ['SERVICE_PAY_ON_DELIVERY'],
  },
  SERVICE_PICKUP_POINT: {},
  SERVICE_RETURN: {},
  SERVICE_GREEN: {},
  SERVICE_SHUTTLE: {},
  SERVICE_TWO_DRIVERS: {},
  SERVICE_EXHIBITION_MODEL: {},
  SERVICE_WHITE_GLOVE: {},
  SERVICE_EXCHANGE: {},
  SERVICE_DELIVERY_TO_LOCKER: {},
  SERVICE_DELIVERY_TO_PICKUP_POINT: {},
  SERVICE_DELIVERY_TO_MAILBOX: {},
}

export const ORDER_STATUS = {
  CREATED: 'ORDER_CREATED',
  UPDATED: 'ORDER_UPDATED',
  WITH_NO_CARRIER_ELIGIBLE: 'ORDER_WITH_NO_CARRIER_ELIGIBLE',
  TO_BE_QUOTED: 'ORDER_TO_BE_QUOTED',
  QUOTED: 'ORDER_QUOTED',
  WITH_NO_QUOTE: 'ORDER_WITH_NO_QUOTE',
  QUOTE_TO_BE_CONFIRMED: 'ORDER_QUOTE_TO_BE_CONFIRMED',
  TO_BE_SENT_TO_CARRIER: 'ORDER_TO_BE_SENT_TO_CARRIER',
  WITH_NO_CARRIER_AVAILABLE: 'ORDER_WITH_NO_CARRIER_AVAILABLE',
  REFUSED_DELIVERY: 'ORDER_REFUSED_DELIVERY',
  TO_DELIVER: 'ORDER_TO_DELIVER',
  BEING_DELIVERED: 'ORDER_BEING_DELIVERED',
  DELIVERY_UNCOMPLETED: 'ORDER_DELIVERY_UNCOMPLETED',
  DELIVERED: 'ORDER_DELIVERED',
  CANCELLED: 'ORDER_CANCELLED',
  TO_BE_COMPLETED: 'ORDER_TO_BE_COMPLETED',
}

const PICKUP_POINT_TYPES = {
  AGENCY: 'PICKUP_POINT_AGENCY',
  POST_OFFICE: 'PICKUP_POINT_POST_OFFICE',
  RELAY_WITH_LOCKER: 'PICKUP_POINT_RELAY_WITH_LOCKER',
  RELAY_WITHOUT_LOCKER: 'PICKUP_POINT_RELAY_WITHOUT_LOCKER',
  ALL: 'PICKUP_POINT_ALL',
}

export const PICKUP_POINTS_CONFIG = {
  bpost: {
    types: [
      PICKUP_POINT_TYPES.AGENCY,
      PICKUP_POINT_TYPES.POST_OFFICE,
      PICKUP_POINT_TYPES.RELAY_WITHOUT_LOCKER,
      PICKUP_POINT_TYPES.RELAY_WITH_LOCKER,
    ],
    packageMaxWeight: {
      value: 20,
      unit: 'kg',
    },
  },
  agediss: {
    maxWeightParcel: {
      value: 100,
      unit: 'kg',
    },
    packageMaxWeight: {
      value: 300,
      unit: 'kg',
    },
    packageMaxDimension: {
      value: 300,
      unit: 'cm',
    },
    maxVolume: {
      value: 5,
      unit: 'm3',
    },
    maxUnit: {
      value: 10,
    },
    legacyCategory: 'PICKUP_POINT_STANDARD',
  },
  chronopost: {
    types: [
      PICKUP_POINT_TYPES.AGENCY,
      PICKUP_POINT_TYPES.POST_OFFICE,
      PICKUP_POINT_TYPES.RELAY_WITHOUT_LOCKER,
      PICKUP_POINT_TYPES.RELAY_WITH_LOCKER,
    ],
    packageMaxWeight: {
      value: 20,
      unit: 'kg',
    },
  },
  'c-chez-vous': {
    categories: {
      Standard: {
        packageMaxWeight: {
          value: 450,
          unit: 'kg',
        },
        packageMaxDimension: {
          value: 222,
          unit: 'cm',
        },
        legacyCategory: 'PICKUP_POINT_STANDARD',
      },
    },
  },
  'colis-prive': {
    packageMaxWeight: {
      value: 20,
      unit: 'kg',
    },
  },
  dpd: {
    packageMaxWeight: {
      value: 20,
      unit: 'kg',
    },
  },
  'mondial-relay': {
    categories: {
      '24R': {
        packageMaxWeight: {
          value: 30,
          unit: 'kg',
        },
        packageMaxCombinedLength: {
          value: 150,
          unit: 'cm',
        },
        legacyCategory: 'PICKUP_POINT_STANDARD',
      },
      '24L': {
        packageMaxWeight: {
          value: 50,
          unit: 'kg',
        },
        packageMaxCombinedLength: {
          value: 200,
          unit: 'cm',
        },
        legacyCategory: 'PICKUP_POINT_XL',
      },
      Drive: {
        packageMaxWeight: {
          value: 120,
          unit: 'kg',
        },
        packageMaxCombinedLength: {
          value: 450,
          unit: 'cm',
        },
        legacyCategory: 'PICKUP_POINT_DRIVE',
      },
    },
  },
  'relais-colis': {
    categories: {
      RCStandard: {
        packageMaxWeight: {
          value: 20,
          unit: 'kg',
        },
        packageMaxCombinedLength: {
          value: 170,
          unit: 'cm',
        },
        legacyCategory: 'PICKUP_POINT_STANDARD',
      },
      RCMax: {
        packageMaxWeight: {
          value: 40,
          unit: 'kg',
        },
        packageMaxCombinedLength: {
          value: 250,
          unit: 'cm',
        },
        legacyCategory: 'PICKUP_POINT_XL',
      },
    },
  },
  tnt: {
    categories: {
      Standard: {
        packageMaxDimension: {
          value: 130,
          unit: 'cm',
        },
        packageMaxCombinedLength: {
          value: 170,
          unit: 'cm',
        },
        legacyCategory: 'PICKUP_POINT_STANDARD',
      },
    },
  },
  agrikolis: {
    categories: {
      A1: {
        packageMaxWeight: {
          value: 150,
          unit: 'kg',
        },
        packageMaxDimension: {
          value: 240,
          unit: 'cm',
        },
        packageMaxGirth: {
          value: 1000,
          unit: 'cm',
        },
        legacyCategory: 'PICKUP_POINT_STANDARD',
      },
      A2: {
        packageMaxWeight: {
          value: 500,
          unit: 'kg',
        },
        packageMaxDimension: {
          value: 300,
          unit: 'cm',
        },
        packageMaxGirth: {
          value: 1060,
          unit: 'cm',
        },
        legacyCategory: 'PICKUP_POINT_XL',
      },
      A3: {
        packageMaxWeight: {
          value: 800,
          unit: 'kg',
        },
        packageMaxDimension: {
          value: 300,
          unit: 'cm',
        },
        packageMaxGirth: {
          value: 1060,
          unit: 'cm',
        },
        legacyCategory: 'PICKUP_POINT_XXL',
      },
      A4: {
        packageMaxWeight: {
          value: 1500,
          unit: 'kg',
        },
        packageMaxDimension: {
          value: 400,
          unit: 'cm',
        },
        packageMaxGirth: {
          value: 1160,
          unit: 'cm',
        },
        legacyCategory: 'PICKUP_POINT_XXL',
      },
    },
  },
  colissimo: {
    types: [
      PICKUP_POINT_TYPES.AGENCY,
      PICKUP_POINT_TYPES.POST_OFFICE,
      PICKUP_POINT_TYPES.RELAY_WITHOUT_LOCKER,
    ],
    categories: {
      A2P: {
        packageMaxWeight: {
          value: 20,
          unit: 'kg',
        },
        packageMaxCombinedLength: {
          value: 200,
          unit: 'cm',
        },
        legacyCategory: 'PICKUP_POINT_STANDARD',
      },
      BPR: {
        packageMaxWeight: {
          value: 20,
          unit: 'kg',
        },
        packageMaxCombinedLength: {
          value: 200,
          unit: 'cm',
        },
        legacyCategory: 'PICKUP_POINT_STANDARD',
      },
      CDI: {
        packageMaxWeight: {
          value: 30,
          unit: 'kg',
        },
        packageMaxCombinedLength: {
          value: 200,
          unit: 'cm',
        },
        legacyCategory: 'PICKUP_POINT_XL',
      },
      ACP: {
        packageMaxWeight: {
          value: 30,
          unit: 'kg',
        },
        packageMaxCombinedLength: {
          value: 200,
          unit: 'cm',
        },
        legacyCategory: 'PICKUP_POINT_XL',
      },
      CMT: {
        packageMaxWeight: {
          value: 30,
          unit: 'kg',
        },
        packageMaxGirth: {
          value: 200,
          unit: 'cm',
        },
        packageMaxDimension: {
          value: 150,
          unit: 'cm',
        },
        legacyCategory: 'PICKUP_POINT_XL',
      },
      BDP: {
        packageMaxWeight: {
          value: 30,
          unit: 'kg',
        },
        packageMaxGirth: {
          value: 200,
          unit: 'cm',
        },
        packageMaxDimension: {
          value: 150,
          unit: 'cm',
        },
        legacyCategory: 'PICKUP_POINT_XL',
      },
    },
  },
  seur: {
    categories: {
      PUDO: {
        packageMaxWeight: {
          value: 20,
          unit: 'kg',
        },
        packageMaxCombinedLength: {
          value: 150,
          unit: 'cm',
        },
        legacyCategory: 'PICKUP_POINT_STANDARD',
      },
      LOCKER: {
        packageMaxWeight: {
          value: 5,
          unit: 'kg',
        },
        packageMaxCombinedLength: {
          value: 100,
          unit: 'cm',
        },
        legacyCategory: 'PICKUP_POINT_STANDARD',
      },
    },
  },
}

export const PACKAGE_LENGTH = ['mm', 'cm', 'm', 'in', 'ft-us', 'ft']

export const HISTORY_TYPE = {
  CREATE: 'HISTORY_TYPE_CREATE',
  UPDATE: 'HISTORY_TYPE_UPDATE',
  MERGE: 'HISTORY_TYPE_MERGE',
  CANCEL: 'HISTORY_TYPE_CANCEL',
  RECOVERY: 'HISTORY_TYPE_RECOVERY',
  FORCED_STATUS: 'HISTORY_TYPE_FORCED_STATUS',
  REPLANNED: 'HISTORY_TYPE_REPLANNED',
  RETRY: 'HISTORY_TYPE_RETRY',
}

export const STATE = ['TO_BE_COMPLETED']