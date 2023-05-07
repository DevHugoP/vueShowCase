<template>
  <div :id="`collapse-wrapper-${id}`" class="collapse-wrapper">
    <div :id="`${id}-button`" class="collapsible" @click="openCollapse()" v-if="!hasTitleSlot">
      <div class="d-flex align-center">
        <v-icon>
          {{ icon }}
        </v-icon>
        <span class="medium16 pl-2">
          {{ title }}
        </span>
      </div>
      <v-icon
        v-for="(appendIcon, index) in appendIcons"
        :key="`collapse-appendIcons-${index}`"
        @click.stop="$emit(`appendIcon${index}`)"
        :class="`append-icon${index === 0 ? ' first' : ''}`"
        :ripple="false"
      >
        {{ appendIcon }}
      </v-icon>
      <v-icon :class="!appendIcons.length ? 'chevron' : ''">
        {{ `mdi-chevron-${show ? 'up' : 'down'}` }}
      </v-icon>
    </div>
    <div v-else :id="`${id}-button`" class="collapsible">
      <slot name="title" />
      <v-icon
        v-for="(appendIcon, index) in appendIcons"
        :key="`collapse-appendIcons-${index}`"
        @click.stop="$emit(`appendIcon${index}`)"
        :class="`append-icon${index === 0 ? ' first' : ''}`"
        :ripple="false"
      >
        {{ appendIcon }}
      </v-icon>
      <v-icon :class="!appendIcons.length ? 'chevron' : ''" @click="openCollapse()">
        {{ `mdi-chevron-${show ? 'up' : 'down'}` }}
      </v-icon>
    </div>
    <div :id="`${id}-content`" class="light-collapse-content">
      <div class="content-slot-wrapper">
        <slot name="content" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'light-collapse',
  props: {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: '',
    },
    open: {
      type: Boolean,
      default: false,
    },
    appendIcons: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      show: null as boolean | null,
    }
  },
  computed: {
    hasTitleSlot() {
      return this.$slots.title
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.show = this.open
    })

    const element = document.getElementById(`collapse-wrapper-${this.id}`)
    const nextSibling = element?.nextElementSibling
    const previousSibling = element?.previousElementSibling

    if (nextSibling && nextSibling.id.includes('collapse-wrapper')) {
      document.getElementById(`${this.id}-content`)?.classList.add('hasSiblingNext')
      document.getElementById(`${this.id}-button`)?.classList.add('hasSiblingNext')
    } else if (previousSibling && previousSibling.id.includes('collapse-wrapper')) {
      document.getElementById(`${this.id}-content`)?.classList.add('hasSiblingPrevious')
      document.getElementById(`${this.id}-button`)?.classList.add('hasSiblingPrevious')
    }
  },
  updated() {
    const element = document.getElementById(`collapse-wrapper-${this.id}`)
    const nextSibling = element?.nextElementSibling
    const previousSibling = element?.previousElementSibling

    if (nextSibling && nextSibling.id.includes('collapse-wrapper')) {
      document.getElementById(`${this.id}-content`)?.classList.add('hasSiblingNext')
      document.getElementById(`${this.id}-button`)?.classList.add('hasSiblingNext')
    } else if (previousSibling && previousSibling.id.includes('collapse-wrapper')) {
      document.getElementById(`${this.id}-content`)?.classList.add('hasSiblingPrevious')
      document.getElementById(`${this.id}-button`)?.classList.add('hasSiblingPrevious')
    }
  },
  methods: {
    openCollapse(): void {
      // listener for update parent props, show for update style
      if (this.$listeners['update:open']) {
        this.$emit('update:open', !this.show)
      }
      this.show = !this.show
    },
  },
  watch: {
    show(next: boolean) {
      const elemContent = document.getElementById(`${this.id}-content`)
      const elemButton = document.getElementById(`${this.id}-button`)

      if (!elemContent || !elemButton) {
        return
      }

      if (elemContent.style.maxHeight) {
        ;(elemContent.style.maxHeight as any) = null
      } else {
        elemContent.style.maxHeight = `${elemContent.scrollHeight}px`
      }

      if (next) {
        elemContent.classList.add('showed')
        elemContent.classList.add('overflow-visible')
        elemButton.classList.add('showed')
      } else {
        elemContent.classList.remove('overflow-visible')
        setTimeout(() => {
          // if open is manage by parent, there is a possibility of show be true at that moment
          if (!this.show) {
            elemContent.classList.remove('showed')
            elemButton.classList.remove('showed')
          }
        }, 200)
      }
    },
    open(next: boolean) {
      this.show = next
    },
  },
})
</script>

<style lang="scss" scoped>
.collapse-wrapper {
  .collapsible {
    color: $main-color;
    cursor: pointer;
    padding: 1.8rem;
    width: 100%;
    border: 0.1rem solid $main-lighten-65-color;
    text-align: left;
    display: flex;
    align-items: center;
    border-radius: 0.4rem;

    &.hasSiblingNext {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      border-bottom: none;
    }

    &.hasSiblingPrevious {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }

    &.showed {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      border-bottom: none;
    }

    i {
      color: $main-color;
    }

    .chevron {
      margin-left: auto;
    }

    .append-icon {
      padding-right: 0.5rem;
      color: $main-lighten-65-color;

      @media #{map-get($display-breakpoints, 'xs-only')} {
        padding-right: 1.5rem;
      }

      &.first {
        margin-left: auto;
      }
    }
  }

  .light-collapse-content {
    padding: 0 1.8rem;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.2s ease-out;
    border: none;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;

    &.showed {
      border: 0.1rem solid $main-lighten-65-color;
      border-bottom-left-radius: 0.4rem;
      border-bottom-right-radius: 0.4rem;

      &.hasSiblingNext {
        border: 0.1rem solid $main-lighten-65-color;
        border-bottom: none;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
      }
    }

    &.overflow-visible {
      overflow: visible;
    }

    .content-slot-wrapper {
      padding-top: 2rem;
      padding-bottom: 2rem;
    }
  }
}
</style>
