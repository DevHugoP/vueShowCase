<template>
  <div id="download-connection-archive">
    <mp-button
      v-if="!variant"
      :dataId="`${type}-download-connection-btn`"
      :text="$t('action.downloadConnectionArchive')"
      format="secondary"
      icon="file-download-outline"
      @click="getSecret()"
    />
    <mp-dialog-confirmation
      v-if="showModal || variant"
      :dataId="`${type}-download-connection-modal`"
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
      @close="variant ? $emit('close') : (showModal = !showModal)"
      @submit="variant ? $emit('submit') : (showModal = !showModal)"
    >
      <template #content>
        <v-row no-gutters justify="center" class="pt-8 mb-8">
          <v-col cols="8" class="text-center">
            <span class="regular16">{{ $t('components.downloadArchiveModal.content') }}</span>
          </v-col>
        </v-row>
        <v-row no-gutters justify="center">
          <v-col cols="8" class="text-center d-flex align-center justify-center">
            <span id="client-secret" class="medium16">{{ password }}</span>

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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import RetailerService from '@/services/retailer/RetailerService'
import CarrierService from '@/services/carrier/CarrierService'
import FileDownload from 'js-file-download'

export default Vue.extend({
  name: 'download-archive-btn',
  props: {
    id: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    variant: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showModal: false,
      showTooltip: false,
      password: '',
    }
  },
  beforeMount() {
    if (this.variant) {
      this.getSecret()
    }
  },
  methods: {
    async copyToClipboard() {
      await navigator.clipboard.writeText(this.password)
      this.showTooltip = true
      this.password = ''
    },
    async getSecret() {
      const { file, filename, password } =
        this.type === 'retailer'
          ? await RetailerService.getSecret(this.id)
          : await CarrierService.getSecret(this.id)

      this.password = password

      if (!this.variant) {
        this.showModal = true
      }

      FileDownload(file, filename)
    },
  },
})
</script>

<style lang="scss">
#download-connection-archive {
  .main-dialog-content {
    min-height: 30.4rem;
    padding: 0;
    color: $main-color;
  }
}
</style>
