<template>
  <mp-dialog-confirmation
    classWrapper="url-modal"
    :dataId="dataId"
    persistent
    color="primary"
    :header="{
      iconClose: 'mdi-close',
      icon: $vuetify.breakpoint.smAndUp ? 'mdi-information-variant' : '',
      isColorBackground: true,
      text: $t('components.urlModal.title'),
      textPolice: 'regular14',
    }"
    :btnValidation="{ text: $t('action.close.base'), format: 'sticky', stickyColor: 'yellow' }"
    @close="$emit('close')"
    @submit="$emit('close')"
  >
    <template #content>
      <v-row no-gutters justify="center" class="pt-8 mb-8">
        <v-col cols="8" class="text-center">
          <span class="regular16">{{ $t('components.urlModal.content') }}</span>
        </v-col>
      </v-row>
      <v-row no-gutters justify="center">
        <v-col cols="8" class="text-center d-flex align-center justify-center">
          <span class="url-modal-content medium16">{{ url }}</span>

          <v-tooltip v-model="showTooltip" bottom>
            <template v-slot:activator="{ attrs }">
              <v-btn icon @click="copyToClipboard()" v-bind="attrs">
                <v-icon size="1.8rem">mdi-clipboard-outline</v-icon>
              </v-btn>
            </template>
            <span class="regular16">{{ $t('components.urlModal.copied') }}</span>
          </v-tooltip>
        </v-col>
      </v-row>
    </template>
  </mp-dialog-confirmation>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'url-modal',
  props: {
    showDialog: {
      type: Boolean,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    dataId: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    showTooltip: false,
  }),
  methods: {
    async copyToClipboard() {
      await navigator.clipboard.writeText(this.url)
      this.showTooltip = true
    },
  },
})
</script>

<style lang="scss">
.url-modal {
  .main-dialog-content {
    min-height: 30.4rem;
    padding: 0;
    color: $main-color;
  }
}

.url-modal-content {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
