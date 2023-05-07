<template>
  <v-row
    no-gutters
    :id="id"
    :class="
      `block-wrapper${hasBorder ? ' has-border' : ''}${hasMarginBottom ? ' margin-bottom' : ''}`
    "
    :style="{ padding }"
  >
    <v-col
      cols="12"
      v-if="title || hasTitleSlot"
      :class="`title-wrapper${titleHasPaddingBottom ? ' title-padding-bottom' : ''}${hasEditIcon ? ' d-flex' : ''}`"
    >
      <h2 v-if="!hasTitleSlot">{{ title }}</h2>
      <v-icon
        :dataId="`block-icon-edit-${id}`"
        @click="$emit('clickOnIcon')"
        v-if="hasEditIcon"
        size="1.8rem"
        class="block-icon"
      >
        mdi-pencil
      </v-icon>
      <slot name="title" />
    </v-col>

    <v-col cols="12">
      <slot name="default" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'mp-block',
  props: {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
    hasBorder: {
      type: Boolean,
      default: true,
    },
    hasMarginBottom: {
      type: Boolean,
      default: true,
    },
    titleHasPaddingBottom: {
      type: Boolean,
      default: false,
    },
    padding: {
      type: String,
      default: '2.6rem 2.6rem 2.6rem 2.6rem',
    },
    hasEditIcon: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    hasTitleSlot(): boolean {
      return !!this.$slots.title
    },
  },
})
</script>

<style lang="scss" scoped>
.block-wrapper {
  word-break: break-word;

  &.has-border {
    border: solid 0.1rem $main-lighten-65-color;
    border-radius: 0.4rem;
  }

  &.margin-bottom {
    margin-bottom: 3.8rem;
  }

  .title-padding-bottom {
    padding-bottom: 2.4rem !important;
  }

  &:hover {
    .block-icon {
      color: $main-color;
    }
  }

  .block-icon {
    color: $main-lighten-52-color;
    margin-left: auto;
    cursor: pointer;
  }
}
</style>
