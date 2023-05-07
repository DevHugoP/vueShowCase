<template>
  <div id="notification-recipient">
    <v-row no-gutters class="notification-recipient-bloc">
      <v-col cols="10" offset="1">
        <h2>{{ $t('technical.notifications.target') }}</h2>
        <v-row no-gutters class="mt-8 contact-container">
          <div
            v-for="(contact, index) in contacts"
            :key="`contact-${index}-${contact.name}-${selectedContact}-${contacts}`"
            :class="`img-txt-box${selectedContact === contact.name ? ' selected' : ''}`"
            @click="selectItem(contact.name)"
          >
            <img
              :src="contact.logo"
              :alt="contact.name"
              class="logo"
              :data-id="`${contact.name}-${index}-logo`"
            />
            <p class="regular14">{{ contact.text }}</p>
          </div>
        </v-row>
        <v-row no-gutters class="mt-8" v-if="selectedContact === NOTIFICATIONS_TARGET.CUSTOM">
          <v-col cols="4">
            <div class="download-container">
              <div class="btn-example-container">
                <mp-input-file
                  v-model="contactFile"
                  @clickClear="clearFile()"
                  accept=".csv"
                  appendIcon="mdi-paperclip"
                  :dataId="`notification-contact-file-upload`"
                  :label="`${$t('technical.notifications.importContactList')} *`"
                />
                <div class="example-container">
                  <a
                    @click="downloadExample()"
                    dataId="notification-downloadExample"
                    class="icon-text-wrapper"
                  >
                    <v-icon size="1.8rem">mdi-file-download</v-icon>
                    <span class="regular14">{{
                      $t('page.retailerDetail.catalogs.modal.example')
                    }}</span>
                  </a>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
        <v-row no-gutters v-if="mappedContacts.length" class="mt-4">
          <v-col cols="7">
            <mp-contact
              id="notifications-custom-contacts"
              :title="$t('technical.notifications.contactsCustomTitle')"
              :contacts="mappedContacts"
              :withLanguage="true"
              :withTimezone="true"
              :hasShowedInformation="true"
            ></mp-contact>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import {
  NOTIFICATIONS_TARGET,
  EventType,
  COLLECT_TIMELINE_EVENTS,
  COLLECT_TIMELINE_FAILED_EVENTS,
  Contact,
} from '@/types'
import { AVAILABLE_LANGUAGES } from '@/plugins/i18n'
import { ROUTES } from '@/constants'
import { SnackBarType } from '@/store/types'
import Vue from 'vue'
import FileDownload from 'js-file-download'
import mpContact from '@/components/contact/contact.vue'
import phoneHelper from '@/helpers/phoneHelper'
import Papa from 'papaparse'
import { getTimezones } from '@/helpers/dateHelper'

const HEADERS = ['email', 'phone', 'language', 'lastName', 'firstName', 'timezone']

export default Vue.extend({
  name: 'notification-recipient',
  components: {
    mpContact,
  },
  data: () => ({
    timezoneList: null as any,
    mappedContacts: [] as Contact[],
    contactFile: null as File | null,
    NOTIFICATIONS_TARGET,
    selectedContact: '',
    smsNotificationCheckbox: false,
    mailNotificationCheckbox: false,
    contacts: [] as Array<{ name: string; logo: string; text: string }>,
    setEventType: '',
    addedContacts: null as Contact[] | null,
  }),
  props: {
    carrierId: {
      type: Array as () => number[] | null,
      required: false,
      default: null,
    },
    carrierSetAside: {
      type: Array as () => number[] | null,
      required: false,
      default: null,
    },
    editRecipients: {
      type: Array as () => Contact[],
      required: false,
      default: null,
    },
    editTarget: {
      type: String,
      required: false,
      default: '',
    },
    typeOfEvent: {
      type: String,
      required: false,
      default: '',
    },
    event: {
      type: String,
      required: false,
      default: '',
    },
  },
  mounted() {
    this.editContact()
    this.setContactList()
    const timezone = getTimezones()

    this.timezoneList = Object.values(timezone).map(({ name }) => name)

    if (this.isEditing) {
      if (this.editRecipients) {
        this.mappedContacts = this.editRecipients.map((contact: Contact, index: number) => ({
          ...contact,
          title: `Contact ${index + 1}`,
        }))
      }
    }

    this.setEventType = this.typeOfEvent || ''
  },

  computed: {
    isEditing(): boolean {
      return this.$route.name === ROUTES.editNotification
    },
  },
  methods: {
    setContactList() {
      let collectContacts = [
        {
          name: NOTIFICATIONS_TARGET.DELIVERY_CONTACT,
          logo: require('@/assets/illustrations/deliveryContact.svg'),
          text: this.$t(`technical.notifications.targets.${NOTIFICATIONS_TARGET.DELIVERY_CONTACT}`),
        },
        {
          name: NOTIFICATIONS_TARGET.CUSTOM,
          logo: require('@/assets/illustrations/customContact.svg'),
          text: this.$t(`technical.notifications.targets.${NOTIFICATIONS_TARGET.CUSTOM}`),
        },
      ]
      let baseContactList = [
        {
          name: NOTIFICATIONS_TARGET.PICKING_CONTACT,
          logo: require('@/assets/illustrations/shippingContact.svg'),
          text: this.$t(`technical.notifications.targets.${NOTIFICATIONS_TARGET.PICKING_CONTACT}`),
        },
        {
          name: NOTIFICATIONS_TARGET.DELIVERY_CONTACT,
          logo: require('@/assets/illustrations/deliveryContact.svg'),
          text: this.$t(`technical.notifications.targets.${NOTIFICATIONS_TARGET.DELIVERY_CONTACT}`),
        },
        {
          name: NOTIFICATIONS_TARGET.RETAILER_MAIN_CONTACT,
          logo: require('@/assets/illustrations/mainRetailerContact.svg'),
          text: this.$t(
            `technical.notifications.targets.${NOTIFICATIONS_TARGET.RETAILER_MAIN_CONTACT}`,
          ),
        },
        {
          name: NOTIFICATIONS_TARGET.STORE_MAIN_CONTACT,
          logo: require('@/assets/illustrations/storeMainContact.svg'),
          text: this.$t(
            `technical.notifications.targets.${NOTIFICATIONS_TARGET.STORE_MAIN_CONTACT}`,
          ),
        },
        {
          name: NOTIFICATIONS_TARGET.CARRIER_CONTACT,
          logo: require('@/assets/illustrations/carrierContact.svg'),
          text: this.$t(`technical.notifications.targets.${NOTIFICATIONS_TARGET.CARRIER_CONTACT}`),
        },
        {
          name: NOTIFICATIONS_TARGET.CUSTOM,
          logo: require('@/assets/illustrations/customContact.svg'),
          text: this.$t(`technical.notifications.targets.${NOTIFICATIONS_TARGET.CUSTOM}`),
        },
      ]
      this.contacts =
        this.setEventType === EventType.DELIVERY
          ? this.carrierId || this.carrierSetAside
            ? baseContactList.filter(
                contact => contact.name !== NOTIFICATIONS_TARGET.CARRIER_CONTACT,
              )
            : baseContactList
          : collectContacts
    },
    emailValidation(email: string) {
      let mailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return mailRegex.test(email)
    },
    downloadExample() {
      const rows = [
        ['email', 'phone', 'language', 'lastName', 'firstName', 'timezone'],
        ['test@gmail.fr', '+33565656565', 'fr', 'John', 'Doe', 'Europe/Amsterdam'],
      ]

      let csvContent = rows.map(e => e.join(',')).join('\n')

      FileDownload(csvContent, 'example.csv')
    },
    clearFile(): void {
      this.contactFile = null
      this.mappedContacts = []
    },
    async parseFile(file: File) {
      this.mappedContacts = []

      await Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        delimitersToGuess: [',', '|', ';'],
        transformHeader: (header, index: number) => {
          return HEADERS[index] || header
        },
        // with file papaparse return undefined
        complete: result => {
          const isError =
            result.data.length > 10 ||
            result.data.some(
              (fileData: any) =>
                !fileData.email ||
                !this.emailValidation(fileData.email) ||
                !fileData.phone ||
                !phoneHelper.getCountryCode(fileData.phone) ||
                !fileData.lastName ||
                !fileData.firstName ||
                !fileData.language ||
                !AVAILABLE_LANGUAGES.includes(fileData.language) ||
                !fileData.timezone ||
                !this.timezoneList.includes(fileData.timezone),
            )
          if (isError) {
            this.$store.dispatch('setSnackbar', {
              type: SnackBarType.ERROR,
              message: this.$t('messages.invalidFile'),
            })
            return
          }
          const newStatusMappings = result.data.map((fileData: any, index: number) => ({
            email: fileData.email,
            phone: fileData.phone,
            title: `Contact ${index + 1}`,
            language: fileData.language,
            lastName: fileData.lastName,
            firstName: fileData.firstName,
            timezone: fileData.timezone,
          }))
          this.mappedContacts.push(...newStatusMappings)
          this.$emit('getMappedContacts', this.mappedContacts)
        },
      })
    },
    editContact(): void {
      if (this.isEditing) {
        this.selectedContact = this.editTarget
        let collectEvents = [
          ...Object.values(COLLECT_TIMELINE_EVENTS),
          ...Object.values(COLLECT_TIMELINE_FAILED_EVENTS),
        ]
        if (collectEvents.includes(this.event as any)) {
          this.setEventType = EventType.COLLECT
        } else this.setEventType = EventType.DELIVERY
      }
    },
    selectItem(e: string): void {
      switch (e) {
        case NOTIFICATIONS_TARGET.PICKING_CONTACT: {
          this.selectedContact = NOTIFICATIONS_TARGET.PICKING_CONTACT
          break
        }
        case NOTIFICATIONS_TARGET.DELIVERY_CONTACT: {
          this.selectedContact = NOTIFICATIONS_TARGET.DELIVERY_CONTACT
          break
        }
        case NOTIFICATIONS_TARGET.RETAILER_MAIN_CONTACT: {
          this.selectedContact = NOTIFICATIONS_TARGET.RETAILER_MAIN_CONTACT
          break
        }
        case NOTIFICATIONS_TARGET.STORE_MAIN_CONTACT: {
          this.selectedContact = NOTIFICATIONS_TARGET.STORE_MAIN_CONTACT
          break
        }
        case NOTIFICATIONS_TARGET.CARRIER_CONTACT: {
          this.selectedContact = NOTIFICATIONS_TARGET.CARRIER_CONTACT
          break
        }
        case NOTIFICATIONS_TARGET.CUSTOM: {
          this.selectedContact = NOTIFICATIONS_TARGET.CUSTOM
          break
        }
        default:
          break
      }
    },
  },
  watch: {
    carrierId(next) {
      if (this.selectedContact === NOTIFICATIONS_TARGET.CARRIER_CONTACT && next !== null) {
        this.selectedContact = ''
      }
      this.setContactList()
    },
    carrierSetAside(next) {
      if (this.selectedContact === NOTIFICATIONS_TARGET.CARRIER_CONTACT && next !== null) {
        this.selectedContact = ''
      }
      this.setContactList()
    },
    contactFile() {
      if (this.contactFile) {
        this.parseFile(this.contactFile)
      }
    },
    selectedContact() {
      if (this.selectedContact !== NOTIFICATIONS_TARGET.CUSTOM) {
        this.mappedContacts = []
        this.contactFile = null
      }
      this.$emit('reasignContact', this.selectedContact)
    },
    typeOfEvent() {
      this.setEventType = this.typeOfEvent
      this.setContactList()
      this.selectedContact = ''
    },
    mappedContacts() {
      this.$emit('getMappedContacts', this.mappedContacts)
    },
  },
})
</script>

<style lang="scss">
#notification-recipient {
  .notification-recipient-bloc {
    padding: 4.7rem 0;
    min-height: 25rem;
  }

  a {
    text-decoration: none;
  }

  .input-file {
    width: 100%;
  }

  .contact-container {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .logo {
    width: 6rem !important;
    min-width: 6rem !important;
    height: 6rem !important;
    max-height: 6rem !important;
  }

  .img-txt-box {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    border: 0.1rem $main-lighten-74-color solid;
    align-items: center;
    border-radius: 0.6rem;
    height: 14rem;
    width: 13.4rem;
  }

  p {
    color: $main-lighten-28-color;
    margin: 0;
    text-align: center;
  }

  .selected {
    border: 0.2rem solid $main-color;
  }

  .download-container {
    display: flex;
    padding: 1rem 0;
    flex-direction: column;
    gap: 1.4rem;
    align-items: flex-start;
  }

  .btn-example-container {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .example-container {
    display: flex;
    align-items: center;
  }

  .icon-text-wrapper {
    display: flex;
    gap: 0.5rem;
  }
}
</style>
