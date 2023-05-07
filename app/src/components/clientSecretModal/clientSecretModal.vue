<template>
  <mp-dialog-confirmation
    classWrapper="client-secret-modal"
    :dataId="dataId"
    persistent
    color="primary"
    :header="{
      iconClose: 'mdi-close',
      icon: $vuetify.breakpoint.smAndUp ? 'mdi-information-variant' : '',
      isColorBackground: true,
      text: $t('components.clientSecretModal.title'),
      textPolice: 'regular14',
    }"
    :btnValidation="{ text: $t('action.close.base'), format: 'sticky', stickyColor: 'yellow' }"
    @close="$emit('close')"
    @submit="$emit('close')"
  >
    <template #content>
      <v-row no-gutters justify="center" class="pt-8 mb-8">
        <v-col cols="8" class="text-center">
          <span class="regular16">{{ $t('components.clientSecretModal.content') }}</span>
        </v-col>
      </v-row>
      <v-row no-gutters justify="center">
        <v-col cols="8" class="text-center d-flex align-center justify-center">
          <span id="client-secret" class="medium16">{{ clientSecret }}</span>

          <v-tooltip v-model="showTooltip" bottom>
            <template v-slot:activator="{ attrs }">
              <v-btn icon @click="copyToClipboard()" v-bind="attrs">
                <v-icon size="1.8rem">mdi-clipboard-outline</v-icon>
              </v-btn>
            </template>
            <span>{{ $t('components.clientSecretModal.copied') }}</span>
          </v-tooltip>
        </v-col>
      </v-row>
    </template>
  </mp-dialog-confirmation>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'client-secret-modal',
  props: {
    showDialog: {
      type: Boolean,
      required: true,
    },
    clientSecret: {
      type: String,
      required: true,
    },
    dataId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      showTooltip: false,
    }
  },
  methods: {
    async copyToClipboard() {
      await navigator.clipboard.writeText(this.clientSecret)
      this.showTooltip = true
    },
  },
})
</script>

<style lang="scss">
.client-secret-modal {
  .main-dialog-content {
    min-height: 30.4rem;
    padding: 0;
    color: $main-color;
  }
}
</style>
