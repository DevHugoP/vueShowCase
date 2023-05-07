<template>
  <v-row
    no-gutters
    class="mt-8"
    id="change-contact-dialog-content"
    :data-id="`change-contact-dialog-${type}-content`"
  >
    <v-col cols="12">
      <span class="regular16 main-color">
        {{ $t(`page.order.contact.dialog.${type}.infos.0`) }}
      </span>
    </v-col>

    <v-col cols="12">
      <span class="medium16 main-color">
        {{ $t(`page.order.contact.dialog.${type}.infos.1`) }}
      </span>
    </v-col>

    <v-col
      cols="12"
      :class="`mt-6 choice-wrapper${choice === changeContact.OLD ? ' selected' : ''}`"
      @click="$emit('update:choice', changeContact.OLD)"
      v-if="isContactFilled(oldContact)"
      :data-id="`change-contact-dialog-${type}-content-old`"
    >
      <change-contact-dialog-content-box :contact="oldContact" :type="changeContact.OLD" />
    </v-col>

    <v-col
      v-if="shouldDisplayNewContact && isContactFilled(newContact)"
      cols="12"
      :class="`mt-5 choice-wrapper${choice === changeContact.NEW ? ' selected' : ''}`"
      @click="$emit('update:choice', changeContact.NEW)"
      :data-id="`change-contact-dialog-${type}-content-new`"
    >
      <change-contact-dialog-content-box :contact="newContact" :type="changeContact.NEW" />
    </v-col>

    <v-col
      cols="12"
      :class="`mt-5 mb-5 choice-wrapper${choice === changeContact.EMPTY ? ' selected' : ''}`"
      @click="$emit('update:choice', changeContact.EMPTY)"
      :data-id="`change-contact-dialog-${type}-content-empty`"
    >
      <change-contact-dialog-content-box :type="changeContact.EMPTY" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import changeContactDialogContentBox from './changeContactDialogContentBox.vue'

import Vue from 'vue'
import { changeContact } from './changeContactDialog.vue'
import { Contact } from '@/types'
import { CreateOrderStateMiscellaneous } from '@/store/modules/createOrder/types'

export default Vue.extend({
  name: 'change-contact-dialog-content',
  components: {
    changeContactDialogContentBox,
  },
  props: {
    choice: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    changeContact,
    shouldDisplayNewContact: false,
  }),
  computed: {
    miscellaneous(): CreateOrderStateMiscellaneous {
      return this.$store.getters['createOrder/miscellaneous']
    },
    oldContact(): Contact {
      return this.miscellaneous.saveAddress[this.type === 'picking' ? 'departure' : 'arrival']
        .contact!
    },
    newContact(): Contact | undefined {
      return this.miscellaneous.saveAddress[this.type === 'picking' ? 'departure' : 'arrival']
        .newContact
    },
  },
  methods: {
    isContactFilled(contact: Contact) {
      if (!contact) {
        return false
      }

      return (
        contact.firstName ||
        contact.lastName ||
        contact.email ||
        contact.phone ||
        contact.timezone ||
        contact.language
      )
    },
  },
  watch: {
    type: {
      immediate: true,
      async handler(next) {
        this.shouldDisplayNewContact = !(await this.$store.dispatch(
          'createOrder/isChangingContactSame',
          next,
        ))
      },
    },
  },
})
</script>

<style lang="scss" scoped>
#change-contact-dialog-content {
  .choice-wrapper {
    border: 0.1rem solid $main-lighten-65-color;
    border-radius: 0.4rem;
    padding: 2rem !important;
    cursor: pointer;

    &.selected {
      border: 0.2rem solid $main-color;
    }
  }
}
</style>
