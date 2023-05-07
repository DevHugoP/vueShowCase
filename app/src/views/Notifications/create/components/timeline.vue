<template>
  <div id="timeline">
    <v-row no-gutters class="timeline-bloc">
      <v-col cols="12">
        <ol class="timeline-list-container">
          <li v-for="(bloc, index) in selectedEvents" :key="`selectedEvent-${index}`">
            <div
              @click="
                selectedEvent = index
                $emit('getSelectedEvent', bloc)
              "
              :class="
                `regular16${isElementEvent(index) ? ' even-dot ' : ' odd-dot '}${
                  selectedEvent === index ? ' selected-dot  ' : ' unselected-dot'
                }`
              "
            >
              <v-icon size="1.5rem" v-if="selectedEvent === index">mdi-check-bold</v-icon>
            </div>
            <p
              @click="
                selectedEvent = index
                $emit('getSelectedEvent', bloc)
              "
              :class="
                `regular14${isElementEvent(index) ? ' odd-list ' : ' even-list '}${
                  selectedEvent === index ? ' selected-text' : ' text-event unselected-text'
                }`
              "
            >
              {{ bloc.name }}
            </p>
          </li>
        </ol>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { MappedItem } from '@/types'
import Vue from 'vue'
export default Vue.extend({
  name: 'event-create-timeline',
  props: {
    selectedEvents: {
      type: (Array as () => MappedItem[]) || null,
      default: null,
    },
  },
  data: () => ({
    selectedEvent: null as number | null,
  }),
  methods: {
    isElementEvent(event: number): boolean {
      return event % 2 == 0
    },
  },
  watch: {
    selectedEvents() {
      this.selectedEvent = null
    },
  },
})
</script>

<style lang="scss">
#timeline {
  .timeline-bloc {
    margin-top: 10rem;
    padding: 4.7rem 0;
    min-height: 18rem;
  }

  .even-list {
    position: absolute;
    margin-top: 0.6rem;
    padding: 1rem;
  }

  .even-dot::after {
    content: '';
    color: $main-lighten-65-color;
    width: 0.2rem;
    height: 32px;
    background: #cdced9;
    position: absolute;
    top: -34px;
    left: 41%;
    &:hover {
      cursor: pointer;
    }
  }

  .even-dot {
    &:hover {
      cursor: pointer;
    }
  }

  .odd-list {
    position: absolute;
    bottom: 0;
    margin-bottom: 7.1rem;
    padding: 1rem;
  }

  .odd-dot {
    &:hover {
      cursor: pointer;
    }
  }
  .odd-dot::after {
    content: '';
    color: $main-lighten-65-color;
    width: 0.2rem;
    height: 3.2rem;
    background: $main-lighten-65-color;
    position: absolute;
    top: 1.6rem;
    left: 43%;
  }

  .text-event {
    background-color: $main-lighten-80-color;
    color: $main-lighten-28-color;
    text-align: center;

    &:hover {
      cursor: pointer;
    }
  }

  .selected-text {
    border: 0.2rem solid $main-color;
    border-radius: 0.4rem;
    background-color: $white;
    cursor: pointer;
    text-align: center;
  }

  .timeline-list-container {
    display: flex;
    border-top: 0.2rem solid $main-lighten-65-color;
    list-style: none;

    li {
      float: left;
      width: 25%;
      padding-top: 3rem;
      position: relative;
    }

    .unselected-dot {
      width: 1.8rem;
      height: 1.8rem;
      margin-left: -2.5rem;
      background: $white;
      border: 2px solid $main-lighten-52-color;
      border-radius: 50%;
      text-align: center;
      position: absolute;
      top: -1rem;
      left: 30%;
    }

    .selected-dot {
      width: 1.8rem;
      height: 1.8rem;
      margin-left: -2.5rem;
      background-color: $success-color;
      border: 2px solid $success-color;
      border-radius: 50%;
      text-align: center;
      position: absolute;
      top: -1rem;
      left: 30%;
    }
    .mdi-check-bold {
      bottom: 0.2rem;
      color: $white;
      left: -0.1rem;
    }
  }
}
</style>
