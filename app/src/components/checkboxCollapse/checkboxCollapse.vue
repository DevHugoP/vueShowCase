<template>
  <v-row no-gutters>
    <v-col cols="12">
      <div :id="`collapse-wrapper-${id}`" class="collapse-wrapper">
        <div :id="`${id}-button`" class="collapsible" v-if="!hasTitleSlot">
          <div class="d-flex align-center">
            <mp-checkbox
              :input-value="checked"
              :dataId="`cb-collapse-${id}`"
              :label="`${title}`"
              :disabled="disableCheckbox"
              @change="() => changeCheckboxValue()"
            />
            <v-icon class="chevron" @click="openCollapse()" v-if="disableCollapse">
              {{ `mdi-chevron-${show ? 'up' : 'down'}` }}
            </v-icon>
          </div>
        </div>
        <div :id="`${id}-content`" class="content">
          <div class="content-slot-wrapper">
            <slot name="content" />
          </div>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'checkbox-collapse',
  props: {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    open: {
      type: Boolean,
      default: false,
    },
    disableCheckbox: {
      type: Boolean,
      default: false,
    },
    disableCollapse: {
      type: Boolean,
      default: false,
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: null as boolean | null,
      checked: false
    }
  },
  computed: {
    hasTitleSlot() {
      return this.$slots.title
    },
  },
  mounted() {
    this.checked = this.selected
    this.show = this.open
    this.handleShowChange(this.open)
  },
  methods: {
    changeCheckboxValue(): void {
      this.checked = !this.checked
      this.$emit('change', this.id, this.checked)
    },
    openCollapse(): void {
      this.show = !this.show
    },
    handleShowChange(next: boolean): void {
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
  },
  watch: {
    show(next: boolean) {
      this.handleShowChange(next)
    },
    open(next: boolean) {
      this.show = next
    },
    selected(next) {
      this.checked = next
    }
  },
})
</script>

<style lang="scss" scoped>
.collapse-wrapper {
  margin-bottom: 1rem;

  .collapsible {
    color: $main-color;
    cursor: pointer;
    padding: 1.8rem;
    padding-bottom: 0;
    width: 100%;
    border: 0.1rem solid $main-lighten-65-color;
    text-align: left;
    display: flex;
    align-items: center;
    border-radius: 0.4rem;

    &.showed {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      border-bottom: none;
    }

    i {
      color: $main-color;
    }

    &>div {
      width: 100%;
    }
    .chevron {
      margin-left: auto;
      display: flex;
      align-self: flex-start;
    }
  }

  .content {
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
      border-top: none;
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
