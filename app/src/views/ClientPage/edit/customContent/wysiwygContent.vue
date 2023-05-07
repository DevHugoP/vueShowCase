<template>
  <div>
    <ckeditor
      v-if="displayEditor"
      :editor="editor"
      v-model="content"
      :config="editorConfig"
      :errors="getModelErrors($v.value)"
      @blur="$v.value.$touch()"
      @input="$v.value.$touch()"
      :isDirty="$v.value.$isDirty"
    />
  </div>
</template>

<script lang="ts">
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor'
import CKEditor from '@ckeditor/ckeditor5-vue2'
import { CustomInput } from '@/components/wysiwyg/customInputs/CustomInputs'
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials'
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold'
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic'
import Image from '@ckeditor/ckeditor5-image/src/image'
import AutoImage from '@ckeditor/ckeditor5-image/src/autoimage'
import Table from '@ckeditor/ckeditor5-table/src/table'
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar'
import FontSize from '@ckeditor/ckeditor5-font/src/fontsize'
import ImageInsert from '@ckeditor/ckeditor5-image/src/imageinsert'
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline'
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph'
import Link from '@ckeditor/ckeditor5-link/src/link'
import mixins from 'vue-typed-mixins'
import { validationMixin } from '@/mixins'
import { required } from 'vuelidate/lib/validators'

const TOOLBAR_ITEMS = [
  'undo',
  'redo',
  'prettier',
  '|',
  'bold',
  'italic',
  'underline',
  '|',
  'link',
  'insertTable',
  'fontSize',
]
const PLUGINS = [
  Essentials,
  Paragraph,
  Bold,
  Italic,
  Link,
  Underline,
  CustomInput,
  Image,
  ImageInsert,
  AutoImage,
  Table,
  TableToolbar,
  FontSize,
]

export default mixins(validationMixin).extend({
  name: 'wysiwyg-custom-content',
  components: {
    ckeditor: CKEditor.component,
  },
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  validations() {
    return {
      value: {
        required,
      },
    }
  },
  data: () => ({
    displayEditor: false,
    content: '',
    editor: ClassicEditor,
    editorConfig: {
      mode: 'document',
      fullPage: true,
      plugins: PLUGINS as any[],
      language: '',
      toolbar: { items: TOOLBAR_ITEMS } as { items: string[] },
    },
  }),
  beforeMount() {
    this.editorConfig.language = this.$i18n.i18next.language
  },
  mounted() {
    this.$emit('invalid', this.$v.value.$invalid)
    this.content = this.value
    this.displayEditor = true
  },
  watch: {
    '$v.value.$invalid'(next) {
      this.$emit('invalid', next)
    },
    content(newValue) {
      this.$emit('input', newValue)
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

.ck.ck-character-grid .ck-character-grid__tile {
  width: fit-content;
}

.ck.ck-editor {
  @media #{map-get($display-breakpoints, 'xs-only')} {
    max-width: 28rem;
  }
}

.ck .ck-sticky-panel .ck-sticky-panel__content_sticky {
  position: static !important;
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
