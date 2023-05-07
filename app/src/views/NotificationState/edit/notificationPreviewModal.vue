<template>
  <mp-dialog-confirmation
    classWrapper="carrier-create-notification-preview-modal"
    v-if="showDialog"
    dataId="carrier-create-notification-preview-modal"
    color="primary"
    @close="$emit('close')"
    :header="{ isColorBackground: true, iconClose: 'mdi-close' }"
    fullscreen
  >
    <template #content>
      <div class="content" v-html="parsedContent" />
    </template>
  </mp-dialog-confirmation>
</template>

<script lang="ts">
import Vue from 'vue'

import mustache from 'mustache'
import { PREVIEW_ORDER } from '@/services/notificationStates/NotificationStatePreviewOrder'

export default Vue.extend({
  name: 'carrier-create-notification-preview-modal',
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    content: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      default: 'fr',
    },
  },
  computed: {
    parsedContent() {
      return mustache.render(
        this.content
          .replace(/<p>(.*?)<\/p>/gm, '$1')
          .replace(/&lt;/gm, '<')
          .replace(/&gt;/gm, '>')
          .replace(/&amp;/gm, '&')
          .replace(/&nbsp;/gm, ' ')
          .replace(/<br>/gm, ''),
        {
          ...PREVIEW_ORDER(this.language),
        },
      )
    },
  },
})
</script>

<style lang="scss">
@import '../../../styles/mixins/macScrollbar';

.carrier-create-notification-preview-modal {
  display: flex;
  flex-direction: column;

  .v-card__title {
    border-bottom: 0.2rem $main-color solid;
  }

  .main-dialog-content {
    @include setMacScrollbar('&');
    max-height: calc(100vh - 5.6rem);
    overflow: scroll;
  }

  .modal-header-wrapper {
    justify-content: flex-end;

    .cross-icon-wrapper {
      padding: 1rem 0 1rem 0;
      justify-content: center;
    }
  }

  .content {
    > table {
      margin: auto;
      @media #{map-get($display-breakpoints, 'xs-only')} {
        td {
          max-width: 100vw;
        }
      }
    }
  }
}
</style>
