<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      scrollable
      id="previsualisation-dialog"
      dataId="previsualisation-dialog-bloc"
      width="50%"
    >
      <div v-if="type === NotificationsChannel.SMS">
        <div class="center">
          <div class="mobile">
            <div class="screen active">
              <div class="top-screen">
                <v-icon class="icon main-lighten-65-color">
                  mdi-chevron-left
                </v-icon>
                <div class="top-screen-circle"></div>
              </div>
              <div class="message">
                <span class="message-text regular12">{{ contentSMS }}</span>
                <div class="message-tail"></div>
              </div>
            </div>
            <div class="home"></div>
            <div class="inner"></div>
          </div>
        </div>
      </div>
      <v-card v-else><v-card-text v-html="sanitizeMail"></v-card-text></v-card>
    </v-dialog>
  </v-row>
</template>

<script script lang="ts">
import Vue from 'vue'
import mustache from 'mustache'
import sanitizeHtml from 'sanitize-html'
import { Config, NotificationsChannel } from '@/types'
export default Vue.extend({
  name: 'notification-previsualisation',
  props: {
    type: {
      type: String,
      default: '',
    },
    showDialog: {
      type: Boolean,
      default: false,
    },
    content: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    NotificationsChannel,
    dialog: false,
    sanitizedContent: '' as Config['content'],
  }),
  computed: {
    contentSMS(): any {
      if (this.type === NotificationsChannel.SMS) {
        return this.content
          .replace(/<p>(.*?)<\/p>/gm, '$1')
          .replace(/&lt;/gm, '<')
          .replace(/&gt;/gm, '>')
          .replace(/&amp;/gm, '&')
          .replace(/&nbsp;/gm, ' ')
          .replace(/<br>/gm, '')
      }
      return null
    },
    sanitizeMail(): any {
      if (this.type === NotificationsChannel.MAIL) {
        return sanitizeHtml(
          mustache.render(
            this.content
              .replace(/<p>(.*?)<\/p>/gm, '$1')
              .replace(/&lt;/gm, '<')
              .replace(/&gt;/gm, '>')
              .replace(/&amp;/gm, '&')
              .replace(/&nbsp;/gm, ' ')
              .replace(/<br>/gm, ''),
            {},
          ),
          {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
            allowedAttributes: {
              ...sanitizeHtml.defaults.allowedAttributes,
              '*': [
                'style',
                'class',
                'cellspacing',
                'cellpadding',
                'border',
                'width',
                'height',
                'align',
              ],
            },
          },
        )
      }
      return null
    },
  },
  watch: {
    showDialog() {
      this.dialog = this.showDialog
    },
    dialog() {
      this.$emit('dialogStatus', this.dialog)
    },
  },
})
</script>

<style lang="scss" scoped>
body {
  margin: 0;
  padding: 0;
}

.mail-wrapper {
  z-index: 5;
  position: absolute;
  top: 50%;
  left: 50%;
}
.center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.mobile {
  width: 28.5rem;
  height: 55.5rem;
  background: linear-gradient(#f7f7f7, #f3f3f3, #f0f0f0, #f0f0f0, #f5f5f5, #f7f7f7);
  border-radius: 3rem;
  border: 0.1rem solid rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  box-shadow: inset 0 0 0.6rem rgba(0, 0, 0, 0.1);
}

.screen {
  position: relative;
  width: 25.6rem;
  height: 43rem;
  overflow: hidden;
  box-shadow: inset 0 0 0.5rem rgba(0, 0, 0, 0.35);
  position: absolute;
  left: 5%;
  top: 10%;
}

.screen.active {
  background-size: cover;
  background-color: hsl(0, 0%, 100%);
}

.top-screen {
  background-color: $main-lighten-74-color;
  height: 6rem;
  display: flex;
  position: relative;
  margin: 0rem 0.2rem;
  align-items: center;
}

.top-screen-circle {
  background-color: $main-lighten-65-color;
  height: 3.1rem;
  width: 3.1rem;
  border-radius: 4rem;
  margin-left: 33%;
}

.message {
  margin: 2rem 1.2rem;
  position: relative;
  background: $main-lighten-74-color;
  border-radius: 1.4rem;
  padding: 2rem 1.4rem;
  color: #000;
}

.message:before {
  content: '';
  width: 0;
  height: 0;
  position: absolute;
  border-left: 2.4rem solid var(--v-mainLighten74Color-base);
  border-right: 1.5rem solid transparent;
  border-top: 0.2rem solid var(--v-mainLighten74Color-base);
  border-bottom: 1.8rem solid transparent;
  left: 1.7rem;
  bottom: -1.9rem;
}

.message-text {
  overflow-wrap: break-word;
  max-height: 25rem;
  overflow: hidden;
  line-height: 130% !important;
  font-size: 1.3rem !important;
}

.home {
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: #fff;
  border: 0.2rem solid #cecece;
  box-sizing: border-box;
  box-shadow: inset 0 0 0.7rem rgba(0, 0, 0, 0.1);
}

.inner {
  position: absolute;
  top: 3.2rem;
  left: 50%;
  transform: translateX(-50%);
  width: 6rem;
  height: 0.4rem;
  border-radius: 0.2rem;
  background: #7c7070;
  box-sizing: border-box;
}

.inner:before {
  content: '';
  position: absolute;
  top: -0.2rem;
  left: -2.2rem;
  background: #554f4f;
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
}

.inner:after {
  content: '';
  position: absolute;
  top: -0.2rem;
  left: 7.7rem;
  transform: translateX(-50%);
  background: #554f4f;
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
}
</style>
