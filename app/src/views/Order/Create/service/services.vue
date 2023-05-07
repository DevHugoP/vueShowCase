<template>
  <v-row no-gutters class="block" id="create-order-service" data-id="order-create-block-services">
    <v-col cols="12" class="header">
      <h2>{{ $t('page.createOrder.titles.service') }}</h2>
      <span class="block-info">{{ $t('page.createOrder.infos.service') }}</span>
    </v-col>

    <v-col cols="12" class="content">
      <v-row no-gutters>
        <v-col cols="12" class="service-outer-wrapper">
          <div
            v-for="(localService, index) in services"
            :key="`services-${index}`"
            :class="
              `service-wrapper${
                selectedMainService && selectedMainService.value === localService.value
                  ? ' selected'
                  : ''
              }`
            "
            @click="selectedMainService = localService"
          >
            <v-icon size="1.8rem" class="main-color">{{ localService.icon }}</v-icon>
            <span class="regular16">{{ localService.label }}</span>
          </div>
        </v-col>

        <v-col
          cols="12"
          class="mt-8"
          v-if="selectedMainService && selectedMainService.optionChoices"
        >
          <v-checkbox
            class="mp-checkbox"
            v-for="(optionChoice, index) in selectedMainService.optionChoices"
            :key="`option-choice-${index}`"
            v-model="optionChoice.isSelected"
            :label="optionChoice.label"
            :disabled="optionChoice.isDisabled || false"
            :dataId="`order-create-services-service-options-${optionChoice.label}`"
            :ripple="false"
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { AVAILABLE_LEVEL_SERVICES, NEW_AVAILABLE_SERVICES } from '@/constants/shared'
import { ShippingChoices } from '@/store/modules/createOrder/types'
import { CreateOrderStateService } from '@/store/modules/createOrder/service/types'
import { CreateOrderStateEligibility } from '@/store/modules/createOrder/types'
import { CarrierEligibilityEntity } from '@/types'
import Vue from 'vue'
import { mapActions } from 'vuex'

export default Vue.extend({
  name: 'order-create-service',
  props: {
    isEditing: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    services: [] as ShippingChoices[],
    selectedMainService: null as ShippingChoices | null,
  }),
  computed: {
    eligibility(): CreateOrderStateEligibility {
      return this.$store.getters['createOrder/eligibility']
    },
    service(): CreateOrderStateService {
      return this.$store.getters['createOrder/service/service']
    },
    isServiceInvalid(): any {
      return this.$store.getters['createOrder/isServiceInvalid']
    },
  },
  mounted() {
    let availableServices = new Set(Object.values(AVAILABLE_LEVEL_SERVICES))
    if (this.eligibility.filteredCarriers.length) {
      availableServices = this.eligibility.filteredCarriers.reduce(
        (acc: Set<string>, oe: CarrierEligibilityEntity) => {
          if (!oe.services?.length) {
            return acc
          }

          for (const service of oe.services) {
            acc.add(service)
          }
          return acc
        },
        new Set(),
      )
    }

    // set choice with data we can't access in .ts file
    this.services = [
      {
        label: this.$t('technical.services.SERVICE_REGULAR_FRONT_HOME'),
        value: AVAILABLE_LEVEL_SERVICES.REGULAR_FRONT_HOME,
        icon: 'mdi-home-map-marker',
      },
      {
        label: this.$t('technical.services.SERVICE_FRONT_HOME'),
        value: AVAILABLE_LEVEL_SERVICES.FRONT_HOME,
        icon: 'mdi-home-variant',
        optionChoices: NEW_AVAILABLE_SERVICES[AVAILABLE_LEVEL_SERVICES.FRONT_HOME].options.reduce(
          (acc: any[], service: string) => {
            if (availableServices.has(service)) {
              // const isDisabled = this.isOptionDisabled(service)

              acc.push({
                label: this.$t(`technical.services.${service}`),
                value: service,
                isSelected: false,
                isDisabled: false,
              })
            }
            return acc
          },
          [],
        ),
      },
      {
        label: this.$t('technical.services.SERVICE_SELECTED_ROOM'),
        value: AVAILABLE_LEVEL_SERVICES.SELECTED_ROOM,
        icon: 'mdi-home-variant-outline',
        optionChoices: NEW_AVAILABLE_SERVICES[
          AVAILABLE_LEVEL_SERVICES.SELECTED_ROOM
        ].options.reduce((acc: any[], service: string) => {
          if (availableServices.has(service)) {
            // const isDisabled = this.isOptionDisabled(service)

            acc.push({
              label: this.$t(`technical.services.${service}`),
              value: service,
              isSelected: false,
              isDisabled: false,
            })
          }
          return acc
        }, []),
      },
      {
        label: this.$t('technical.services.SERVICE_RETURN'),
        value: AVAILABLE_LEVEL_SERVICES.RETURN,
        icon: 'mdi-replay',
      },
      {
        label: this.$t('technical.services.SERVICE_GREEN'),
        value: AVAILABLE_LEVEL_SERVICES.GREEN,
        icon: 'mdi-leaf',
      },
    ].filter(({ value }) => {
      return availableServices.has(value)
    })

    if (this.isEditing || (!this.isEditing && !this.isServiceInvalid)) {
      for (const service of this.service.services) {
        const selectedMainService = this.services.find(
          localService => localService.value === service,
        )

        if (selectedMainService) {
          this.selectedMainService = selectedMainService
          break
        }
      }

      for (const service of this.service.services) {
        if (this.selectedMainService && this.selectedMainService.optionChoices) {
          for (const option of this.selectedMainService.optionChoices) {
            if (option.value === service) {
              option.isSelected = true
            }
          }
        }
      }
    } else {
      // select first service when creating
      this.selectedMainService = this.services[0]
    }
  },
  methods: {
    ...mapActions({
      filterEligibleCarriers: 'createOrder/filterEligibleCarriers',
    }),
    isOptionDisabled(service: string) {
      const exclusions = [AVAILABLE_LEVEL_SERVICES.STANDARD_TAXI, AVAILABLE_LEVEL_SERVICES.XL_TAXI]
      let isDisabled = false

      if (exclusions.includes(service)) {
        isDisabled = exclusions
          .filter(serv => serv !== service)
          .some(serv => this.service.services.includes(serv))
      }

      return isDisabled
    },
  },
  watch: {
    selectedMainService: {
      deep: true,
      handler(next) {
        this.service.services = [next.value]

        if (next.optionChoices && next.optionChoices.length) {
          for (const optionChoice of next.optionChoices) {
            if (optionChoice.isSelected) {
              this.service.services.push(optionChoice.value)
            }
          }
        }

        this.filterEligibleCarriers({
          stepNumber: parseInt(this.$route.query.stepNumber as string, 10),
        })
      },
    },
  },
})
</script>

<style lang="scss" scoped>
#create-order-service {
  .service-outer-wrapper {
    display: flex;
    flex-wrap: wrap;

    .service-wrapper {
      min-height: 7rem;
      max-height: 7rem;
      min-width: 20.8rem;
      max-width: 20.8rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 0.1rem solid $main-lighten-65-color;
      border-radius: 0.4rem;
      margin-top: 2.8rem;
      margin-right: 2rem;
      cursor: pointer;
      padding: 2rem;

      @media #{map-get($display-breakpoints, 'sm-and-down')} {
        min-width: 100%;
        max-width: 100%;
        margin-right: 0;
      }

      &:hover {
        box-shadow: $box-shadow-hover;
      }

      &.selected {
        border: 0.2rem solid $main-color;
      }

      i {
        padding-right: 1.4rem;
      }
    }
  }
}
</style>
