<template>
  <div>
    <div>
      <span class="regular16 main-lighten-28">
        {{ getTitle }}
      </span>
    </div>

    <div v-if="contact">
      <div class="mt-3 mb-2">
        <span class="medium14 main-color">
          {{ `${contact.lastName} ${contact.firstName}` }}
        </span>
      </div>

      <div class="mb-1">
        <span class="regular14 main-lighten-28">
          {{ contact.email }}
        </span>
      </div>

      <div class="mb-1">
        <span class="regular14 main-lighten-28">
          {{ contact.phone }}
        </span>
      </div>

      <div class="mb-1">
        <span class="regular14 main-lighten-28">
          {{ getLanguage }}
        </span>
      </div>

      <div>
        <span class="regular14 main-lighten-28">
          {{ contact.timezone }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { TRANSLATED_LANGUAGES } from '@/plugins/i18n'
import { Contact } from '@/types'

import Vue from 'vue'
import { changeContact } from './changeContactDialog.vue'

export default Vue.extend({
  name: 'change-contact-dialog-content-box',
  props: {
    contact: {
      type: Object as () => Contact | undefined,
      default: undefined,
    },
    type: {
      type: String,
      required: true,
    },
  },
  computed: {
    getTitle(): string {
      if (this.type === changeContact.OLD) {
        return this.$t('page.order.contact.dialog.keep')
      }

      if (this.type === changeContact.NEW) {
        return this.$t('page.order.contact.dialog.replace')
      }

      return this.$t('page.order.contact.dialog.replaceManuel')
    },
    getLanguage(): string {
      return TRANSLATED_LANGUAGES[this.contact!.language]
    },
  },
})
</script>
