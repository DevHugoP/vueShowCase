<template>
  <div id="notification-messages-language">
    <v-row no-gutters class="notification-messages-language-bloc">
      <v-col cols="10" offset="1">
        <h2>{{ $t('technical.notifications.messageByLanguage') }}</h2>
        <v-row no-gutters>
          <v-col cols="1O">
            <mp-chips-wrapper
              v-if="smsNotif || mailNotif"
              class="mt-6 chips-wrapper"
              :chips="chipsLanguages"
              v-model="selectedChip"
              :canAdd="!isEditing && canAddLanguage"
              dataId="chips-wrapper-contact"
              @addChip="isEditing ? false : addLanguage()"
              @deleteChip="isEditing ? false : deleteLanguage($event)"
            />
            <p class="no-type-selected mt-6" v-else>
              {{ $t('technical.notifications.noTypeSelected') }}
            </p>
          </v-col>
        </v-row>
        <v-row no-gutters v-if="smsNotif || mailNotif" class="language-wrapper">
          <v-col cols="3" class="mt-6">
            <mp-select
              v-if="chipsLanguages.length && selectedChip.value && !isEditing"
              :label="$t('common.language')"
              v-model="selectedChip.language"
              @change="updateSelectedChip($event)"
              :items="getSelectItems(NotificationsItems.LANGUAGE)"
              dataId="message-notifications-lang-select"
              :disabled="isEditing"
            />
          </v-col>
          <div v-if="!isEditing && showDeleteBtn" class="delete-btn-wrapper">
            <a
              @click="deleteLanguage(selectedChip)"
              dataId="notification-delete-language"
              class="icon-text-wrapper"
            >
              <v-icon class="main-color" size="1.8rem">mdi-trash-can-outline</v-icon>
              <span class="medium16">{{ $t('technical.notifications.deleteLanguage') }}</span>
            </a>
          </div>
        </v-row>
        <v-row no-gutters v-if="selectedChip.language && (smsNotif || mailNotif)" class="mt-6">
          <v-col
            :cols="$vuetify.breakpoint.smAndUp ? 1 : 2"
            :class="`toogle-type${toogleType === 'SMS' ? ' selected-type' : ''}`"
            @click="toogleSwitch('SMS')"
            v-if="smsNotif"
          >
            <v-icon
              size="1.6rem"
              v-if="
                config['SMS'][selectedChip.language].content ||
                  config['SMS'][selectedChip.language].useDefault
              "
              class="language-state-icon check"
            >
              mdi-check-circle
            </v-icon>
            <v-icon size="1.6rem" v-else class="language-state-icon close">
              mdi-close-circle
            </v-icon>
            <h3>{{ 'SMS' }}</h3>
          </v-col>
          <v-col
            :cols="$vuetify.breakpoint.mdAndUp ? 1 : 2"
            :class="`toogle-type${toogleType === 'MAIL' ? ' selected-type' : ''}`"
            @click="toogleSwitch('MAIL')"
            v-if="mailNotif"
          >
            <v-icon
              size="1.6rem"
              v-if="
                (config['MAIL'][selectedChip.language].content ||
                  config['MAIL'][selectedChip.language].useDefault) &&
                  config['MAIL'][selectedChip.language].subject
              "
              class="language-state-icon check"
            >
              mdi-check-circle
            </v-icon>
            <v-icon size="1.6rem" v-else class="language-state-icon close">
              mdi-close-circle
            </v-icon>
            <h3>{{ 'MAIL' }}</h3>
          </v-col>
        </v-row>
        <v-row no-gutters v-if="selectedChip.language && (smsNotif || mailNotif)">
          <v-col cols="11" lg="7" class="notifications-content-bloc">
            <v-row no-gutters class="d-flex justify-center">
              <v-col cols="11" class="mb-6 d-flex justify-space-between">
                <mp-switch
                  dataId="notification-state-active"
                  v-model="config[toogleType][selectedChip.language].isActive"
                  :label="$t('common.active')"
                />
                <div
                  v-if="
                    (content =
                      config[toogleType][selectedLanguage].useDefault === false &&
                      config[toogleType][selectedLanguage].content)
                  "
                >
                  <v-icon @click="showDialog = true">mdi-eye</v-icon>
                  <notification-previsualisation
                    :type="toogleType"
                    :showDialog="showDialog"
                    @dialogStatus="showDialog = $event"
                    :content="config[toogleType][selectedLanguage].content"
                  />
                </div>
              </v-col>
              <v-col cols="11" v-if="toogleType === 'SMS'">
                <mp-radio-group
                  row
                  required
                  dataId="use-default-sms-selector"
                  name="handlingUnit"
                  :radioValues="getUseDefaultOptions"
                  v-model="config[toogleType][selectedLanguage].useDefault"
                />
              </v-col>
              <v-col cols="11" v-if="toogleType === 'MAIL'">
                <mp-textfield
                  dataId="create-notification-mail-sender-name"
                  :label="$t('technical.notifications.senderName')"
                  v-model="config['MAIL'][selectedLanguage].senderName"
                  name="create-notification-mail-sender-name"
                />
              </v-col>
              <v-col cols="11" v-if="toogleType === 'MAIL'">
                <mp-textfield
                  dataId="create-notification-mail-subject"
                  :label="`${$t('technical.notifications.subjectLabel')} *`"
                  v-model="config['MAIL'][selectedLanguage].subject"
                  name="create-notification-mail-subject"
                />
              </v-col>
              <v-col cols="11" v-if="toogleType === 'MAIL' && showLabelReturn">
                <mp-select
                  :label="`${$t('technical.notifications.joinedElement')}`"
                  v-model="config['MAIL'][selectedLanguage].attachment"
                  :items="getSelectItems(NotificationsItems.ATTACHMENT)"
                  clearable
                  :dataId="
                    `notifications-mail-joined-${config['MAIL'][selectedLanguage].attachment}`
                  "
                />
              </v-col>
            </v-row>
            <v-row no-gutters class="d-flex justify-center my-6">
              <v-col cols="11">
                <wysiwyg
                  :key="`${selectedChip.language}${wysiwygEvent}${event}`"
                  :config="config"
                  :active="Boolean(config[toogleType][selectedChip.language].isActive)"
                  :selectedLanguage="selectedChip.language"
                  :languages="languagesToComponent"
                  :channel="toogleType"
                  :wysiwygEvent="wysiwygEvent"
                  :event="event"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { AVAILABLE_LANGUAGES_OBJECT, AVAILABLE_LANGUAGES } from '@/plugins/i18n'
import { NotificationsItems, ConfigByChannel } from '@/types'
import { ChannelType } from '@/types/entities/notificationActivations'
import Wysiwyg from '@/components/wysiwyg/wysiwyg.vue'
import { ROUTES } from '@/constants'
import { Config, ConfigNew, Attachment } from '@/types'
import notificationPrevisualisation from '@/views/Notifications/previsualisation/previsualisation.vue'
import Vue from 'vue'

interface SelectLanguage {
  text: string
  value: string | number
  language: string | null
  prependIcon: string | null
}

interface defaultLanguage {
  id: string
  name: string
}

export default Vue.extend({
  name: 'notification-messages',
  components: { Wysiwyg, notificationPrevisualisation },
  props: {
    event: {
      type: String,
      default: '',
    },
    smsNotif: {
      type: Boolean,
    },
    showLabelReturn: {
      type: Boolean,
    },
    isReturnEdit: {
      type: Boolean,
    },
    isActiveReturn: {
      type: Boolean,
    },
    mailNotif: {
      type: Boolean,
    },
    editConfig: {
      type: Object as () => Config,
      default: null,
    },
    editLanguage: {
      type: String,
      default: '',
    },
    isReturnCheckbox: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    defaultLanguage: null as defaultLanguage | null,
    showDialog: false,
    wysiwygEvent: '',
    toogleType: 'SMS' as ChannelType,
    NotificationsItems,
    selectedChip: { value: '', text: '', language: '', prependIcon: null } as SelectLanguage | null,
    selectedLanguage: null as string | null | undefined,
    chipsLanguages: [] as Array<{
      value: any
      text: string
      language: string | null
      prependIcon: string | null
    }>,
    languages: [] as Array<{ id: string; name: string }>,
    languagesToComponent: [] as Array<string>,
    config: null as ConfigNew | null,
    isValid: false,
    filteredLanguages: [] as Array<{ id: string; name: string }>,
  }),
  beforeMount() {
    this.languages = AVAILABLE_LANGUAGES_OBJECT
    this.filteredLanguages = this.languages
    this.languagesToComponent = AVAILABLE_LANGUAGES

    this.languages = Object.values(AVAILABLE_LANGUAGES_OBJECT).map(item => ({
      id: item.id,
      name: this.$t([`common.languages.${item.id}`]),
    }))
    this.defaultLanguage = this.languages.find(
      language => language.id === this.$store.getters['auth/currentUser'].language,
    )
    if (!this.isEditing) {
      this.chipsLanguages = [
        {
          value: 1,
          text: this.defaultLanguage!.name,
          language: this.defaultLanguage!.id,
          prependIcon: 'mdi-close-circle',
        },
      ]
      this.selectedChip = this.chipsLanguages[0]
    }
    if (!this.isEditing && Boolean(this.smsNotif || this.mailNotif)) {
      this.config = { SMS: { fr: { isActive: false, useDefault: false } } }
    }
  },
  mounted() {
    if (this.event === 'COLLECT') {
      this.wysiwygEvent = 'CLICK_AND_COLLECT'
    } else {
      this.wysiwygEvent = 'DELIVERY'
    }
    if (this.smsNotif || this.mailNotif) {
      this.createConfig()
    }
    if (this.isEditing) {
      this.selectedLanguage = this.editLanguage
      this.chipsLanguages = [
        {
          value: '1',
          text: this.languages.find(e => e.id === this.editLanguage)!.name,
          language: this.editLanguage,
          prependIcon: 'mdi-check-circle',
        },
      ]
      this.selectedChip = {
        value: '1',
        text: this.languages.find(e => e.id === this.editLanguage)!.name,
        language: this.editLanguage,
        prependIcon: 'mdi-check-circle',
      }
    }
  },
  computed: {
    testSMS() {
      return (
        this.config!['SMS'][this.selectedChip!.language]?.useDefault ||
        this.config!['SMS'][this.selectedChip!.language]?.content
      )
    },
    testMail() {
      return (
        (this.config!['MAIL'][this.selectedChip!.language]?.useDefault ||
          this.config!['MAIL'][this.selectedChip!.language]?.content) &&
        this.config!['MAIL'][this.selectedChip!.language]?.subject
      )
    },
    showDeleteBtn() {
      return this.chipsLanguages.length !== 1
    },
    canAddLanguage() {
      if (this.chipsLanguages?.length == this.languages.length) {
        return false
      } else {
        return true
      }
    },
    isEditing(): boolean {
      return this.$route.name === ROUTES.editNotification
    },
    getUseDefaultOptions(): Array<{ label: string; value: boolean }> {
      return [
        {
          label: this.$t('technical.notifications.notDefault'),
          value: false,
        },
        {
          label: this.$t('technical.notifications.default'),
          value: true,
        },
      ]
    },
  },
  methods: {
    createConfig(): void {
      if (!this.isEditing) {
        const defaultConfig: ConfigByChannel | null = {
          content: '',
          useDefault: false,
          isActive: false,
        }
        if (this.smsNotif && !this.mailNotif) {
          this.config = {
            SMS: {
              ...AVAILABLE_LANGUAGES.reduce(
                (acc, language) => ({
                  ...acc,
                  [`${language}`]: Vue.observable({ ...defaultConfig }),
                }),
                {},
              ),
            },
          }
        } else if (this.mailNotif && !this.smsNotif) {
          this.config = {
            MAIL: {
              ...AVAILABLE_LANGUAGES.reduce(
                (acc, language) => ({
                  ...acc,
                  [`${language}`]: Vue.observable({
                    ...defaultConfig,
                    attachment: null,
                    senderName: '',
                    subject: '',
                  }),
                }),
                {},
              ),
            },
          }
        } else {
          this.config = {
            SMS: {
              ...AVAILABLE_LANGUAGES.reduce(
                (acc, language) => ({
                  ...acc,
                  [`${language}`]: Vue.observable({ ...defaultConfig }),
                }),
                {},
              ),
            },
            MAIL: {
              ...AVAILABLE_LANGUAGES.reduce(
                (acc, language) => ({
                  ...acc,
                  [`${language}`]: Vue.observable({
                    ...defaultConfig,
                    subject: '',
                    senderName: '',
                    attachment: null,
                  }),
                }),
                {},
              ),
            },
          }
        }
      } else if (this.isEditing && this.smsNotif) {
        this.config = {
          SMS: {
            [`${this.selectedLanguage}`]: {
              content: this.editConfig.content,
              useDefault: this.editConfig.useDefault,
              isActive: this.isActiveReturn,
            },
          },
        }
      } else if (this.isEditing && this.mailNotif) {
        this.config = {
          MAIL: {
            [`${this.selectedLanguage}`]: {
              content: this.editConfig.content,
              useDefault: this.editConfig.useDefault,
              isActive: this.isActiveReturn,
              subject: this.editConfig.subject,
              senderName: this.editConfig.senderName,
              attachment: this.editConfig.attachment || null,
            },
          },
        }
      }
    },
    toogleSwitch(event: string): void {
      this.toogleType = event
    },
    getSelectItems(type: string): Array<{ value: string | boolean | null; text: string }> {
      switch (type) {
        case NotificationsItems.LANGUAGE:
          return this.filteredLanguages?.length
            ? this.filteredLanguages.map(({ id, name }: { id: string; name: string }) => ({
                value: id,
                text: name,
              }))
            : []
        case NotificationsItems.ATTACHMENT:
          return [
            {
              value: null,
              text: this.$t('technical.notifications.noAttchementSelected'),
            },
            { value: Attachment.LABEL, text: this.$t('technical.notifications.returnLabel') },
          ]
        default:
          return []
      }
    },
    addLanguage(): void {
      if (this.chipsLanguages.length) {
        this.chipsLanguages.push({
          value: this.chipsLanguages[this.chipsLanguages.length - 1].value + 1,
          text: `${this.$t('common.language')} ${this.chipsLanguages[this.chipsLanguages.length - 1]
            .value + 1}`,
          language: null,
          prependIcon: 'mdi-close-circle',
        })
        this.selectedChip = this.chipsLanguages.slice(-1).pop()
      } else {
        this.chipsLanguages.push({
          value: this.chipsLanguages!.length + 1,
          text: `${this.$t('common.language')} ${this.chipsLanguages!.length + 1}`,
          language: null,
          prependIcon: 'mdi-close-circle',
        })
      }
    },
    deleteLanguage(event: { value: any; text: string; language: string }): void {
      var index = this.chipsLanguages.indexOf(event)
      if (index !== -1) {
        this.chipsLanguages.splice(index, 1)
      }
      this.selectedChip = { value: '', text: '', language: '', prependIcon: null }
      this.config![this.toogleType][event.language] = {
        content: '',
        useDefault: false,
        isActive: false,
        subject: '',
        senderName: '',
      }
      if (this.chipsLanguages.length) {
        this.selectedChip = this.chipsLanguages.slice(0).shift()
      }
    },
    filterAvailableLanguage() {
      let filterFromChips = Object.values(
        Object.entries(this.chipsLanguages).reduce((acc, [key, value]: any) => {
          if (!value.language) {
            return acc
          }
          return { ...acc, [key]: value.language }
        }, {}),
      )
      const test = filterFromChips.filter(
        language => !language.includes(this.selectedChip?.language),
      )
      this.filteredLanguages = this.languages.filter(language => !test.includes(language.id))
    },
    updateSelectedChip(language: string): Config | ConfigNew | void {
      if (language) {
        this.selectedLanguage = language
        if (!this.isEditing) {
          this.config![this.toogleType][this.selectedChip!.language] = {
            content: '',
            useDefault: false,
            isActive: false,
            subject: '',
            senderName: '',
          }
        } else {
          this.config = {
            [this.toogleType]: {
              [`${this.selectedLanguage}`]: {
                content: '',
                useDefault: false,
                isActive: false,
                subject: '',
                senderName: '',
              },
            },
          }
        }
        this.selectedChip!.text = this.languages.find(e => e.id === language)!.name
      } else {
        this.selectedChip!.text = `${this.$t('common.language')} ${this.selectedChip!.value}`
      }
    },
    setToogleType(): void {
      if (this.mailNotif && !this.smsNotif) {
        this.toogleType = 'MAIL'
      } else if (!this.mailNotif && !this.smsNotif) {
        this.toogleType = ''
      } else {
        this.toogleType = 'SMS'
      }
    },
  },
  watch: {
    event(next) {
      if (next === 'COLLECT') {
        this.wysiwygEvent = 'CLICK_AND_COLLECT'
      } else {
        this.wysiwygEvent = 'DELIVERY'
      }
    },
    chipsLanguages(next) {
      this.$emit('chipsLanguages', next)
      this.filterAvailableLanguage()
    },
    selectedChip(next) {
      this.filterAvailableLanguage()
      if (next) {
        this.selectedLanguage = this.selectedChip?.language
      }
    },
    smsNotif() {
      this.setToogleType()
      if (this.smsNotif || this.mailNotif) {
        this.createConfig()
      } else {
        this.config = null
      }
    },
    mailNotif() {
      this.setToogleType()
      if (this.smsNotif || this.mailNotif) {
        this.createConfig()
      } else {
        this.config = null
      }
    },
    config: {
      deep: true,
      handler() {
        if (this.config) {
          if (this.smsNotif && !this.mailNotif) {
            this.selectedChip!.prependIcon = this.testSMS ? 'mdi-check-circle' : 'mdi-close-circle'
          } else if (!this.smsNotif && this.mailNotif) {
            this.selectedChip!.prependIcon = this.testMail ? 'mdi-check-circle' : 'mdi-close-circle'
          } else if (this.smsNotif && this.mailNotif) {
            this.selectedChip!.prependIcon =
              this.testMail && this.testSMS ? 'mdi-check-circle' : 'mdi-close-circle'
          }
          if (this.config[this.toogleType][this.selectedChip!.language]) {
            if (this.config[this.toogleType][this.selectedChip!.language].useDefault) {
              this.config[this.toogleType][this.selectedChip!.language].content = ''
            }
          }
        }
        this.$emit('getConfig', this.config)
      },
    },
  },
})
</script>

<style lang="scss">
@import '../../../../styles/mixins/_macScrollbar.scss';
#notification-messages-language {
  .v-chip__content {
    .mdi-close-circle {
      font-size: 1.6rem;
      background-color: transparent;
      color: $error-color;
    }
    .mdi-check-circle {
      font-size: 1.6rem;
      background-color: transparent;
      color: $success-color;
    }
  }
  .notification-messages-language-bloc {
    min-height: 25rem;

    .no-type-selected {
      color: $error-color;
    }

    .chips-wrapper {
      overflow: auto;
      @include setMacScrollbar('&');
    }

    .language-wrapper {
      display: flex;
      gap: 2rem;

      .delete-btn-wrapper {
        display: flex;
        align-items: center;

        a {
          display: flex;
          gap: 1rem;
        }
      }
    }

    .selected-type {
      background-color: $main-lighten-80-color;
    }

    .toogle-type {
      height: 4rem;
      width: 5rem;
      cursor: pointer;
      justify-content: center;
      align-items: center;
      display: flex;
    }

    .notifications-content-bloc {
      background-color: $main-lighten-80-color;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-top: 3.2rem !important;
      padding-bottom: 3.2rem !important;
    }

    .language-state-icon {
      margin-right: 0.7rem;

      &.check {
        background-color: transparent;
        color: $success-color;
      }

      &.alert {
        background-color: transparent;
        color: $alert-color;
      }

      &.close {
        background-color: transparent;
        color: $error-color;
      }
    }
  }
}
</style>
