<template>
  <div :id="id" class="contact-component-contact" :data-id="id">
    <mp-block
      :id="`block-${id}`"
      :title="title"
      v-if="$vuetify.breakpoint.smAndUp && hasData"
      class="contact-desktop"
      :hasEditIcon="hasEditIcon"
      @clickOnIcon="$emit('clickOnEdit')"
      titleHasPaddingBottom
    >
      <!-- Button show information -->
      <v-row no-gutters v-if="!showInformation" class="d-flex mt-1">
        <v-col cols="12" class="d-flex align-center justify-center">
          <mp-button
            :dataId="`${id}-showInformation`"
            :text="$t('page.detailOrder.retailer.display')"
            format="primary"
            @click="handleClickShow()"
            :loading="showLoader"
          />
        </v-col>
      </v-row>

      <mp-chips-wrapper
        v-if="showInformation && selectedContact.title"
        class="inner-scroll-long-title"
        :chips="chipsContacts"
        v-model="selectedContact"
        :dataId="`chips-wrapper-contact-${id}`"
      />

      <!-- Contact information -->
      <div class="contact-contact-information" v-if="showInformation">
        <div class="d-flex contact-contact-information">
          <!-- Name -->
          <div class="d-flex align-center mt-4" :data-id="`${id}-name`">
            <v-icon size="1.6rem">mdi-account</v-icon>
            <span class="regular14 pl-3">
              {{ selectedContact.firstName }} {{ selectedContact.lastName }}
            </span>
            <mp-badge
              color="black"
              class="d-flex ml-auto"
              :content="
                selectedContact.isProfessional
                  ? $t('page.contact.professionalTitle')
                  : $t('page.contact.individualTitle')
              "
              :dataId="`${id}-contact-professional`"
            />
          </div>

          <!-- Phone -->
          <div 
            v-if="!isCustomerContact || isAuthorized('CALL_CLIENT')"
            class="d-flex align-center mt-4" 
            :data-id="`${id}-phone`"
          >
            <v-icon size="1.6rem">mdi-phone</v-icon>
            <span class="regular14 pl-3">
              {{ selectedContact.phone }}
            </span>
          </div>

          <!-- Email -->
          <div class="d-flex align-center mt-4" :data-id="`${id}-email`">
            <v-icon size="1.6rem">mdi-email</v-icon>
            <span class="regular14 pl-3">
              {{ selectedContact.email }}
            </span>
          </div>

          <!-- Language -->
          <div class="d-flex align-center mt-4" :data-id="`${id}-language`" v-if="withLanguage">
            <v-icon size="1.6rem">mdi-account-voice</v-icon>
            <span class="regular14 pl-3">
              {{
                selectedContact.language ? $t(`common.languages.${selectedContact.language}`) : '--'
              }}
            </span>
          </div>

          <!-- Timezone -->
          <div class="d-flex align-center mt-4" :data-id="`${id}-timezone`" v-if="withTimezone">
            <v-icon size="1.6rem">mdi-clock-outline</v-icon>
            <span class="regular14 pl-3">
              {{ selectedContact.timezone || '--' }}
            </span>
          </div>
        </div>
        <div
          v-if="hasAction"
          :class="`mt-3${actionIsCentered ? ' d-flex flex-column align-center' : ''}`"
        >
          <slot name="action" />
        </div>
      </div>
    </mp-block>

    <v-row no-gutters v-else-if="$vuetify.breakpoint.xsOnly && hasData">
      <mp-chips-wrapper
        v-if="selectedContact.title"
        class="ml-3"
        :chips="chipsContacts"
        v-model="selectedContact"
        :dataId="`chips-wrapper-contact-${id}`"
      />
      <v-col cols="12">
        <div class="d-flex contact-contact-information mt-3 ml-3">
          <div class="d-flex align-center" :data-id="`${id}-name`">
            <v-icon size="2rem">mdi-account</v-icon>
            <span class="regular14 pl-3">
              {{ selectedContact.lastName }} {{ selectedContact.firstName }}
            </span>
          </div>
          <div class="d-flex mt-4 ml-6" :data-id="`${id}-professional`">
            <mp-badge
              color="black"
              class="d-flex"
              :content="
                selectedContact.isProfessional
                  ? $t('page.contact.professionalTitle')
                  : $t('page.contact.individualTitle')
              "
              :dataId="`${id}-contact-professional`"
            />
          </div>
          <div
            class="d-flex align-center mt-4"
            :data-id="`${id}-language`"
            v-if="selectedContact.language"
          >
            <v-icon size="2rem">mdi-account-voice</v-icon>
            <span class="regular14 pl-3">
              {{
                selectedContact.language ? $t(`common.languages.${selectedContact.language}`) : '--'
              }}
            </span>
          </div>

          <!-- Timezone -->
          <div
            class="d-flex align-center mt-4"
            :data-id="`${id}-timezone`"
            v-if="selectedContact.timezone"
          >
            <v-icon size="2rem">mdi-clock-outline</v-icon>
            <span class="regular14 pl-3">
              {{ selectedContact.timezone || '--' }}
            </span>
          </div>
        </div>
        <div
          class="ml-3"
          v-if="hasAction"
          :class="`mt-3${actionIsCentered ? ' d-flex flex-column align-center' : ''}`"
        >
          <slot name="action" />
        </div>
        <v-row class="contact-mobile" no-gutters>
          <v-col cols="12" class="icon-outer-wrapper">
            <a 
              v-if="!isCustomerContact || isAuthorized('CALL_CLIENT')"
              :href="`tel:${selectedContact.phone}`" 
              class="icon-wrapper"
              :data-id="`${id}-phone`"
            >
              <v-icon size="2rem">mdi-phone</v-icon>
            </a>
            <a
              :href="`mailto:${selectedContact.email}`"
              class="icon-wrapper"
              :data-id="`${id}-email`"
            >
              <v-icon size="2rem">mdi-email</v-icon>
            </a>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'

import { authorizationMixin } from '@/mixins'

import { CONTACT_TITLES, SHOW_INFORMATION_LENGTH } from '@/constants'

import { Contact } from '@/types'

import mpBlock from '@/components/block/block.vue'

export default mixins(authorizationMixin).extend({
  name: 'mp-contact',
  components: {
    mpBlock,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    durationTime: {
      type: Number,
      default: SHOW_INFORMATION_LENGTH,
    },
    hasShowedInformation: {
      type: Boolean,
      default: false,
    },
    contacts: {
      type: Array as () => Contact[],
      required: true,
    },
    hasAction: {
      type: Boolean,
      default: false,
    },
    showMainContact: {
      type: Boolean,
      default: false,
    },
    withLanguage: {
      type: Boolean,
      default: false,
    },
    withTimezone: {
      type: Boolean,
      default: false,
    },
    actionIsCentered: {
      type: Boolean,
      default: false,
    },
    hasEditIcon: {
      type: Boolean,
      default: false,
    },
    isCustomerContact: {
      type: Boolean,
      default: false
    },
  },
  data: () => ({
    hasData: true,
    showInformation: false,
    selectedContact: null as Contact | null,
    showLoader: false,
  }),
  computed: {
    chipsContacts() {
      return this.contacts.map(contact => {
        return {
          text: `${contact.title} ${
            contact.main ? `(${this.$t('page.retailers.mainContact')})` : ''
          }`,
          value: contact.email,
          ...contact,
        }
      })
    },
  },
  beforeMount() {
    this.selectedContact = this.contacts[0]
    this.showInformation = this.hasShowedInformation
  },
  mounted() {
    this.hasData = !!this.contacts.length
  },
  methods: {
    handleClickShow() {
      this.$emit('showInformation')
      this.showLoader = true
      setTimeout(() => {
        this.showLoader = false
        this.showInformation = true
      }, 1000)

      setTimeout(() => {
        this.showInformation = false
      }, this.durationTime)
    },
    customTitle(title: string): string {
      return Object.values(CONTACT_TITLES).includes(title)
        ? this.$t(`technical.contactTitles.${title}`)
        : title
    },
  },
  watch: {
    contacts: {
      deep: true,
      handler() {
        this.selectedContact = this.chipsContacts[0]
      },
    },
  },
})
</script>

<style lang="scss">
@import '../../styles/mixins/macScrollbar';

.contact-component-contact {
  @media #{map-get($display-breakpoints, 'sm-and-up')} {
    padding: 0 !important;
  }

  @media #{map-get($display-breakpoints, 'xs-only')} {
    border-top: solid 0.1rem $main-lighten-74-color;
    padding: 2.4rem 0 2.2rem 0;
  }

  .contact-desktop {
    .contact-selector-wrapper {
      overflow-x: auto;
      display: flex;
      flex-wrap: wrap;
      @include setMacScrollbar('&');

      .contact-selector {
        min-width: fit-content;
        height: fit-content;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 0.1rem solid $main-lighten-65-color;
        border-radius: 2rem;
        padding: 0.6rem 1.6rem;
        margin-right: 1rem;
        cursor: pointer;

        &.selected {
          border: 0.2rem solid $main-color;
        }

        &.last {
          margin-right: 0;
        }
      }
    }

    .inner-scroll-long-title {
      overflow: auto;
    }
  }

  .contact-mobile {
    .icon-outer-wrapper {
      display: flex;
      margin-top: 2.2rem;
      justify-content: center;

      .icon-wrapper {
        width: 5rem;
        height: 5rem;
        background-color: $primary-color;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;

        i {
          color: $main-color;
          display: block;
        }
      }

      .icon-wrapper:last-of-type {
        margin-left: 2.7rem;
      }
    }
  }

  .mp-badge {
    margin-left: 0;

    .v-badge__wrapper {
      margin: 0;

      .v-badge__badge {
        width: fit-content;

        @media #{map-get($display-breakpoints, 'xs-only')} {
          margin: -0.5rem;
        }
      }
    }
  }

  .contact-contact-information {
    i {
      color: $main-lighten-65-color !important;
    }
    flex-direction: column;
  }
}
</style>
