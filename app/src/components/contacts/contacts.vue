<template>
  <div id="contacts" :data-id="dataId">
    <!-- Title -->
    <v-row no-gutters class="title-outer-wrapper">
      <v-col cols="12" class="title-wrapper">
        <h2 :data-id="`${dataId}-title`">{{ title }}</h2>
        <v-chip
          v-if="$vuetify.breakpoint.smAndUp"
          @click="addContact()"
          class="regular16"
          outlined
          :data-id="`${dataId}-addContact`"
        >
          + {{ $t('action.add.base') }}
        </v-chip>
      </v-col>
    </v-row>

    <v-row v-if="$vuetify.breakpoint.xsOnly" no-gutters>
      <v-col cols="12">
        <mp-chips-wrapper
          :dataId="`${dataId}-chipsWrapper`"
          canAdd
          :chips="contactsChips"
          @addChip="addContact()"
          v-model="selectedChips"
          @input="selectedChipsIndex = $event.index"
          :maxChips="contactsChips.length"
        />
      </v-col>
    </v-row>

    <v-row no-gutters v-if="$vuetify.breakpoint.smAndUp">
      <v-col
        cols="12"
        md="8"
        lg="6"
        :class="
          `form-wrapper ${index % 2 === 0 ? 'form-even' : 'form-odd'}${
            $vuetify.breakpoint.mdAndDown ? ' no-padding-right' : ''
          }`
        "
        v-for="(contact, index) in editContacts"
        :key="`contacts-${index}`"
      >
        <!-- form -->
        <contacts-form
          :contact="contact"
          :index="index"
          :contactLength="editContacts.length"
          :dataId="dataId"
          @delete-contact="deleteContactModal($event)"
          @change-main-contact="changeMainContact($event)"
          @invalid="handleInvalid($event, index)"
          :withLanguage="withLanguage"
          :withTimezone="withTimezone"
          @addDataInContact="addDataInContact($event, index)"
        />
      </v-col>
    </v-row>

    <v-row no-gutters v-else>
      <v-col cols="12" class="form-wrapper">
        <contacts-form
          :contact="editContacts[selectedChipsIndex]"
          :index="selectedChipsIndex"
          :contactLength="editContacts.length"
          :dataId="dataId"
          @delete-contact="deleteContactModal($event)"
          @change-main-contact="changeMainContact($event)"
          @invalid="handleInvalid($event, selectedChipsIndex)"
          :withLanguage="withLanguage"
          :withTimezone="withTimezone"
          @addDataInContact="addDataInContact($event, selectedChipsIndex)"
        />
      </v-col>
    </v-row>

    <v-row v-if="showDeleteModal">
      <v-col cols="12">
        <mp-dialog-confirmation
          :dataId="`${dataId}-modal-delete`"
          :textContent="$t('action.contact.delete')"
          @close="showDeleteModal = false"
          @submit="deleteContact()"
          color="error"
          :header="{
            icon: 'mdi-trash-can-outline',
            isColorBackground: false,
            iconClose: 'mdi-close',
          }"
          :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
          :btnValidation="{ text: $t('action.delete.base'), format: 'error' }"
          :btnToColumn="$vuetify.breakpoint.xsOnly"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import contactsForm from '@/components/contacts/form/form.vue'
import { Contact, getDefaultContact } from '@/types'

export default Vue.extend({
  name: 'contacts',
  components: {
    contactsForm,
  },
  props: {
    contacts: {
      type: Array as () => Contact[],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    dataId: {
      type: String,
      required: true,
    },
    withLanguage: {
      type: Boolean,
      default: false,
    },
    withTimezone: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    editContacts: [] as Contact[],
    selectedChipsIndex: 0,
    selectedChips: null,
    showDeleteModal: false,
    indexSave: -1,
    invalids: {},
  }),
  beforeMount() {
    this.editContacts = this.contacts
  },
  computed: {
    contactsChips() {
      return this.editContacts.map((contact: Contact, index: number) => {
        return {
          ...contact,
          value: index,
          text: contact.title || this.$t('page.store.create.contact', { number: index + 1 }),
          index,
        }
      })
    },
  },
  methods: {
    addDataInContact(newContact: any, index: number) {
      this.editContacts.splice(index, 1, { ...newContact })

      this.$emit('contacts', this.editContacts)
    },
    addContact() {
      this.invalids = { ...this.invalids, [`contact-${this.editContacts.length}`]: false }
      this.editContacts.push(getDefaultContact())

      if (this.$vuetify.breakpoint.xsOnly) {
        this.selectedChipsIndex = this.editContacts.length - 1
      }
    },
    deleteContactModal(index: number) {
      this.indexSave = index
      this.showDeleteModal = true
    },
    deleteContact() {
      if (this.indexSave !== -1) {
        this.editContacts.splice(this.indexSave, 1)

        if (this.$vuetify.breakpoint.xsOnly) {
          this.selectedChipsIndex = this.editContacts.length - 1
        }

        this.$emit('contacts', this.editContacts)
        this.showDeleteModal = false
      }
    },
    // only 1 contact can be main
    changeMainContact(index: number) {
      if (this.editContacts[index].main) {
        this.editContacts.forEach((contact: Contact, localIndex: number) => {
          if (index !== localIndex) {
            this.editContacts[localIndex].main = false
          }
        })
      }
    },
    handleInvalid(event: boolean, index: number) {
      this.invalids = { ...this.invalids, [`contact-${index}`]: event }
    },
  },
  watch: {
    invalids(next: Record<string, boolean>) {
      this.$emit(
        'invalid',
        Object.values(next).some((invalid: boolean) => invalid),
      )
    },
  },
})
</script>

<style lang="scss">
#chips-wrapper {
  display: flex;
  overflow: auto;
}
#contacts {
  padding: 0;

  .title-outer-wrapper {
    margin-bottom: 4rem;

    .title-wrapper {
      display: flex;
      align-items: center;

      .v-chip {
        margin-left: 3.7rem;
        border-color: $main-color;
      }
    }
  }

  .form-wrapper {
    padding-top: 2rem;

    &.form-even:not(.no-padding-right) {
      padding-right: 3.5rem;
    }

    .form-title-outer-wrapper {
      margin-bottom: 2.5rem;

      .form-title-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }

    .switch-outer-wrapper {
      margin-bottom: 3rem;
    }
  }
}
</style>
