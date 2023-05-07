<template>
  <mp-block
    id="retailer-client-page-custom-content-block"
    :title="$vuetify.breakpoint.smAndUp ? $t('page.clientPage.customContent.title') : ''"
    :hasBorder="$vuetify.breakpoint.smAndUp"
    :hasMarginBottom="$vuetify.breakpoint.smAndUp"
    titleHasPaddingBottom
  >
    <div class="scroll-wrapper-x" v-html="parsedContent" />
  </mp-block>
</template>

<script lang="ts">
import mustache from 'mustache'
import Vue from 'vue'
import mpBlock from '@/components/block/block.vue'

export default Vue.extend({
  name: 'client-page-detail-custom-content',
  components: {
    mpBlock,
  },
  props: {
    body: {
      type: String,
      required: true,
    },
  },
  computed: {
    parsedContent() {
      return mustache.render(
        this.body
          .replace(/<p>(.*?)<\/p>/gm, '$1')
          .replace(/&lt;/gm, '<')
          .replace(/&gt;/gm, '>')
          .replace(/&amp;/gm, '&')
          .replace(/&nbsp;/gm, ' ')
          .replace(/<br>/gm, ''),
        {},
      )
    },
  },
})
</script>

<style lang="scss">
// Added for ckeditor font plugin
.text-huge {
  font-size: 2rem;
}

.text-big {
  font-size: 1.5rem;
}

.text-small {
  font-size: 0.8rem;
}

.text-tiny {
  font-size: 0.6rem;
}

.scroll-wrapper-x {
  overflow-x: scroll;
}
</style>
