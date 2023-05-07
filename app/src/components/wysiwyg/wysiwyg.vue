<template>
  <ckeditor
    v-if="config && renderComponent"
    :editor="editor"
    v-model="content"
    :config="editorConfig"
    :disabled="readonly"
  />
</template>

<script lang="ts">
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor'

import CKEditor from '@ckeditor/ckeditor5-vue2'

import EssentialsPlugin from '@ckeditor/ckeditor5-essentials/src/essentials'
import BoldPlugin from '@ckeditor/ckeditor5-basic-styles/src/bold'
import ItalicPlugin from '@ckeditor/ckeditor5-basic-styles/src/italic'
import ParagraphPlugin from '@ckeditor/ckeditor5-paragraph/src/paragraph'

import { validationMixin } from '@/mixins'
import { requiredIf } from 'vuelidate/lib/validators'
import { CustomInput } from './customInputs/CustomInputs'
import { i18n } from '@/plugins/i18n'
import mixins from 'vue-typed-mixins'

const TOOLBAR_ITEMS: {
  [key: string]: string[]
} = {
  SMS: [],
  MAIL: ['bold', 'italic'],
  DEFAULT: ['undo', 'redo', 'prettier', '|', 'specialCharacters'],
}

const PLUGINS: {
  [key: string]: any[]
} = {
  SMS: [],
  MAIL: [BoldPlugin, ItalicPlugin],
  DEFAULT: [EssentialsPlugin, ParagraphPlugin, CustomInput],
}

export default mixins(validationMixin).extend({
  name: 'wysiwyg',
  components: {
    ckeditor: CKEditor.component,
  },
  props: {
    channel: {
      type: String,
      default: 'SMS',
    },
    wysiwygEvent: {
      type: String,
    },
    event: {
      type: String,
    },
    config: {
      type: Object,
      required: true,
    },
    isRequired: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    selectedLanguage: {
      type: String,
      required: false,
    },
    languages: {
      type: Array as () => string[],
      required: true,
    },
  },
  validations() {
    const { config, isRequired, languages } = this

    return {
      config: {
        channel: {
          ...languages.reduce((acc, key) => {
            return {
              ...acc,
              [key]: {
                content: {
                  required: requiredIf(() => config[key] && config[key].active && isRequired),
                },
              },
            }
          }, {}),
        },
      },
    }
  },
  data: () => ({
    renderComponent: true,
    editor: ClassicEditor,
    editorConfig: {
      mode: 'document',
      fullPage: true,
      plugins: [] as any[],
      language: '',
      toolbar: null as { items: string[] } | null,
      type: '',
      eventType: '',
    },
  }),
  computed: {
    content: {
      get(): string {
        const { selectedLanguage, event, channel } = this

        return this.config[channel][selectedLanguage].useDefault
          ? i18n.t(`technical.notifications.defaults.SMS.${event}`, {
              lng: selectedLanguage,
              interpolation: { prefix: '((', suffix: '))' },
            })
          : this.config[channel][selectedLanguage].content
      },
      set(newContent: string): void {
        const { selectedLanguage, config, channel } = this

        if (!config[channel][selectedLanguage].useDefault) {
          this.config[channel][selectedLanguage].content = newContent
        }
      },
    } as any,
  },
  beforeMount() {
    this.editorConfig.language = this.$i18n.i18next.language
    this.editorConfig.toolbar = {
      items: [...TOOLBAR_ITEMS[this.channel], ...TOOLBAR_ITEMS.DEFAULT],
    }
    this.editorConfig.plugins = [...PLUGINS[this.channel], ...PLUGINS.DEFAULT]
    this.editorConfig.eventType = this.wysiwygEvent
    this.editorConfig.type = this.event
  },
  watch: {
    wysiwygEvent(next: string) {
      this.renderComponent = false
      this.editorConfig.eventType = next
      this.$nextTick(() => {
        // Add the component back in
        this.renderComponent = true
      })
    },
  },
})
</script>

<style lang="scss">
.ck.ck-character-grid .ck-character-grid__tiles {
  display: flex;
  flex-wrap: wrap;
  width: fit-content;
}

.wysiwyg-empty-error {
  color: $error-color;
}

.ck.ck-character-grid .ck-character-grid__tile {
  width: fit-content;
}

.ck.ck-editor {
  max-width: 63rem;
  @media #{map-get($display-breakpoints, 'xs-only')} {
    max-width: 28rem;
  }
}

.ck.ck-dropdown .ck-dropdown__panel .ck-dropdown__panel_nw,
.ck.ck-dropdown .ck-dropdown__panel.ck-dropdown__panel_sw,
.ck.ck-dropdown .ck-dropdown__panel.ck-dropdown__panel_ne,
.ck.ck-dropdown .ck-dropdown__panel.ck-dropdown__panel_se {
  right: 0;
  left: unset;
  max-width: 32.5rem;
}

.ck.ck-special-characters-navigation > .ck-dropdown .ck-dropdown__panel {
  left: 0 !important;
  right: unset !important;
}

.ck.ck-form__header .ck-form__header__label {
  display: none;
}
</style>
