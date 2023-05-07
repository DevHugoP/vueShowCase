<template>
  <div
    :id="id"
    :class="`main-header__container ${className} ${hasBoxShadow ? 'box-shadow' : ''}`"
    :data-id="dataId"
  >
    <v-row no-gutters :class="`mt-6 ${rowClassName}`">
      <v-col cols="10" offset="1">
        <v-row no-gutters>
          <v-col cols="12">
            <slot name="breadcrumb"></slot>
          </v-col>
          <v-col class="main-header__text">
            <slot name="title"></slot>
            <slot name="content"></slot>
          </v-col>
          <v-col class="main-header__actions d-flex align-end justify-end" cols="4" md="auto">
            <slot name="actions-button"></slot>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'content-header',
  props: {
    id: {
      type: String,
      default: '',
    },
    className: {
      type: String,
      default: '',
    },
    rowClassName: {
      type: String,
      default: '',
    },
    hasBoxShadow: {
      type: Boolean,
      default: false,
    },
    dataId: {
      type: String,
      required: true,
    },
  },
  computed: {
    isOrdersMergeMode(): boolean {
      return this.$store.getters['orders/isMergeMode']
    },
  },
})
</script>

<style lang="scss">
.main-header__container {
  width: 100%;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: row;
  padding-bottom: 3.4rem;

  &.box-shadow {
    box-shadow: $box-shadow-active;
  }

  .main-header__text {
    flex-wrap: wrap;
    box-shadow: none;
    height: auto;
    word-break: break-word;
  }

  h1 {
    width: 100%;
    margin-top: 0.9rem;
  }

  .main-header__actions {
    padding: 1rem 0 2.2rem 0;
  }
}
</style>
