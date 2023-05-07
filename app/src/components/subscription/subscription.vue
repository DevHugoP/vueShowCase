<template>
  <v-row
    no-gutters
    id="carrier-create-subscription"
    data-id="carrier-create-subscription"
    v-if="hasDataLoaded"
  >
    <v-col cols="12">
      <v-row no-gutters class="title-outer-wrapper">
        <v-col cols="12">
          <h2>{{ $t('common.subscription') }}</h2>
        </v-col>
      </v-row>

      <div v-if="$vuetify.breakpoint.smAndUp" class="mb-5">
        <v-row
          v-for="(subscription, index) in localSubscription"
          :key="`${index}-${subscription.frontId}`"
          no-gutters
          :class="`callback-outer-wrapper${index === 0 ? ' pt-5 pb-3' : ' pt-5'}`"
        >
          <v-col cols="12" class="d-flex">
            <mp-select
              class="pl-2 pr-2"
              :label="$t('common.criteria')"
              v-model="subscription.criteria"
              :items="getItemsToDisplay(subscription.criteria)"
              item-text="translatedKey"
              item-value="criteria"
              dataId="carrier-create-criteria"
              :attach="`#subscriptionCriteria${index}`"
              :dropdownId="`subscriptionCriteria${index}`"
              top
              @input="$v.localSubscription.$each[index].criteria.$touch()"
              @blur="$v.localSubscription.$each[index].criteria.$touch()"
              :errors="getModelErrors($v.localSubscription.$each[index].criteria)"
              :isDirty="$v.localSubscription.$each[index].criteria.$dirty"
            />

            <mp-textarea
              class="pr-2"
              :label="$t('common.URL')"
              v-model="subscription.url"
              dataId="carrier-create-url"
              autoGrow
              :rows="1"
              @input="$v.localSubscription.$each[index].url.$touch()"
              @blur="$v.localSubscription.$each[index].url.$touch()"
              :errors="getModelErrors($v.localSubscription.$each[index].url)"
              :isDirty="$v.localSubscription.$each[index].url.$dirty"
            />

            <mp-textfield
              class="pr-2"
              :label="$t('common.version')"
              v-model="subscription.version"
              dataId="carrier-create-version"
              @input="$v.localSubscription.$each[index].version.$touch()"
              @blur="$v.localSubscription.$each[index].version.$touch()"
              :errors="getModelErrors($v.localSubscription.$each[index].version)"
              :isDirty="$v.localSubscription.$each[index].version.$dirty"
            />

            <v-icon
              size="2rem"
              class="version-icon"
              @click="deleteSubscription(index)"
              :key="`trash-${index}`"
            >
              mdi-trash-can-outline
            </v-icon>
          </v-col>
        </v-row>

        <v-row no-gutters v-if="getAvailableSubscription.length > 0">
          <v-col cols="12">
            <mp-button
              format="link"
              linkColor="black"
              :text="`+ ${$t('action.addCriteria')}`"
              dataId="carrier-create-addCriteria"
              @click="addSubscription()"
            />
          </v-col>
        </v-row>
      </div>

      <div v-else class="mobile">
        <v-row no-gutters class="chip-outer-wrapper">
          <v-col cols="12" class="chip-wrapper">
            <v-chip
              class="chip regular16 first-selection-chip"
              @click="addSubscription()"
              data-id="carrier-create-addCriteria"
              v-if="getAvailableSubscription.length > 0"
            >
              +
            </v-chip>
            <v-chip
              v-for="(subscription, index) in localSubscription"
              :key="subscription.frontId"
              outlined
              @click="selectedChips = index"
              :data-id="`carrier-create-chipsCriteria${index}`"
              :class="`regular16 chip${index === selectedChips ? ' chip-active' : ''}`"
            >
              {{ $t(`page.subscriptions.callbacks.${subscription.criteria}`) || $t('common.criteriaNumber', { number: index + 1 }) }}
            </v-chip>
          </v-col>
        </v-row>

        <div v-if="localSubscription.length > 0" class="form-wrapper">
          <v-row
            no-gutters
            class="mobile-criteria"
            :key="`criteria-${localSubscription[selectedChips].frontId}`"
          >
            <v-col cols="12">
              <mp-select
                :label="$t('common.criteria')"
                v-model="localSubscription[selectedChips].criteria"
                :items="getItemsToDisplay(localSubscription[selectedChips].criteria)"
                item-text="translatedKey"
                item-value="criteria"
                dataId="carrier-create-criteria"
                attach="#subscriptionCriteria"
                dropdownId="subscriptionCriteria"
                top
                @input="$v.localSubscription.$each[selectedChips].criteria.$touch()"
                @blur="$v.localSubscription.$each[selectedChips].criteria.$touch()"
                :errors="getModelErrors($v.localSubscription.$each[selectedChips].criteria)"
                :isDirty="$v.localSubscription.$each[selectedChips].criteria.$dirty"
              />
            </v-col>
          </v-row>

          <v-row
            no-gutters
            class="mobile-url"
            :key="`url-${localSubscription[selectedChips].frontId}`"
          >
            <v-col cols="12">
              <mp-textarea
                :label="$t('common.URL')"
                v-model="localSubscription[selectedChips].url"
                dataId="carrier-create-url"
                autoGrow
                :rows="1"
                @input="$v.localSubscription.$each[selectedChips].url.$touch()"
                @blur="$v.localSubscription.$each[selectedChips].url.$touch()"
                :errors="getModelErrors($v.localSubscription.$each[selectedChips].url)"
                :isDirty="$v.localSubscription.$each[selectedChips].url.$dirty"
              />
            </v-col>
          </v-row>

          <v-row
            no-gutters
            class="mobile-version"
            :key="`version-${localSubscription[selectedChips].frontId}`"
          >
            <v-col cols="12">
              <mp-textfield
                :label="$t('common.version')"
                v-model="localSubscription[selectedChips].version"
                dataId="carrier-create-version"
                @input="$v.localSubscription.$each[selectedChips].version.$touch()"
                @blur="$v.localSubscription.$each[selectedChips].version.$touch()"
                :errors="getModelErrors($v.localSubscription.$each[selectedChips].version)"
                :isDirty="$v.localSubscription.$each[selectedChips].version.$dirty"
              />
            </v-col>
          </v-row>

          <v-row no-gutters class="delete-criteria-outer-wrapper">
            <v-col cols="12" class="delete-criteria-wrapper">
              <mp-button
                format="secondary"
                :text="$t('action.deleteCriteria')"
                icon="trash-can-outline"
                :dataId="`carrier-create-deleteCriteria${selectedChips}`"
                @click.stop="deleteSubscription(selectedChips)"
              />
            </v-col>
          </v-row>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import SubscriptionService from '@/services/subscription/SubscriptionService'

import { CARRIER_SUBSCRIPTION, RETAILER_SUBSCRIPTION, ROUTES } from '@/constants'

import { validationMixin } from '@/mixins'
import { required, url } from 'vuelidate/lib/validators'
import mixins from 'vue-typed-mixins'

import { Subscription, SubscriptionEntity } from '@/types'

const mustBeSemverVersion = (value: string) =>
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(-[a-zA-Z\d][-a-zA-Z.\d]*)?(\+[a-zA-Z\d][-a-zA-Z.\d]*)?$/.test(
    value,
  )

export default mixins(validationMixin).extend({
  name: 'carrier-create-subscription',
  props: {
    subscriptionType: {
      type: String,
      required: true,
      validator: value => ['carrier', 'retailer'].includes(value),
    },
  },
  data() {
    return {
      subscription: null as SubscriptionEntity | null,
      localSubscription: [] as Subscription[],
      hasDataLoaded: false,
      selectedChips: 0,
    }
  },
  computed: {
    getAvailableSubscription(): string[] | undefined {
      if (this.subscriptionType === 'carrier') {
        return CARRIER_SUBSCRIPTION.filter(subscription => {
          return !this.localSubscription.find(
            localSubscription => localSubscription.criteria === subscription,
          )
        })
      } else if (this.subscriptionType === 'retailer') {
        return RETAILER_SUBSCRIPTION.filter(subscription => {
          return !this.localSubscription.find(
            localSubscription => localSubscription.criteria === subscription,
          )
        })
      }
    },
  },
  validations: {
    localSubscription: {
      $each: {
        criteria: { required },
        url: { required, url },
        version: { required, mustBeSemverVersion },
      },
    },
  },
  async mounted() {
    if (this.$route.name === ROUTES.editCarrier) {
      try {
        this.subscription = await SubscriptionService.getByCarrierId(this.$route.params.carrierId)
      } catch (e) {
        this.localSubscription = []
        this.hasDataLoaded = true
        return
      }
    } else if (this.$route.name === ROUTES.editRetailer) {
      try {
        this.subscription = await SubscriptionService.getByRetailerId(this.$route.params.id)
      } catch (e) {
        this.localSubscription = []
        this.hasDataLoaded = true
        return
      }
    } else {
      this.localSubscription = []
    }

    for (const callback in this.subscription?.callbacks || []) {
      if (this.subscription && this.subscription.callbacks[callback]) {
        this.localSubscription.push({
          criteria: callback,
          ...this.subscription.callbacks[callback],
          frontId: (Math.random() * 10).toString(),
        })
      }
    }

    this.hasDataLoaded = true

    this.$emit('updateSubscriptionId', this.subscription ? this.subscription.id : null)
    this.$emit('invalid', this.$v.localSubscription.$invalid)
  },
  methods: {
    getItemsToDisplay(criteria: string) {
      if (this.getAvailableSubscription) {
        const ItemsToDisplay =
          !this.getAvailableSubscription.includes(criteria) && criteria
            ? [...this.getAvailableSubscription, criteria]
            : this.getAvailableSubscription
        return ItemsToDisplay.map(item => {
          return {
            criteria: item,
            translatedKey: this.$t(`page.subscriptions.callbacks.${item}`),
          }
        })
      } else {
        return []
      }
    },
    deleteSubscription(index: number) {
      this.localSubscription.splice(index, 1)

      if (this.$vuetify.breakpoint.xsOnly) {
        this.selectedChips = this.selectedChips - 1
        if (this.selectedChips < 0 && this.localSubscription.length > 0) {
          this.selectedChips = 0
        }
      }
    },
    addSubscription() {
      this.localSubscription.push({
        criteria: '',
        url: '',
        version: '',
        frontId: (Math.random() * 10).toString(),
      })

      if (this.$vuetify.breakpoint.xsOnly) {
        this.selectedChips = this.localSubscription.length - 1
      }
    },
  },
  watch: {
    localSubscription(next) {
      this.$emit('updateSubscription', next)
    },
    '$v.localSubscription.$invalid'(next) {
      this.$emit('invalid', next)
    },
  },
})
</script>

<style lang="scss" scoped>
#carrier-create-subscription {
  margin-top: 7.5rem;

  .title-outer-wrapper {
    margin-bottom: 3rem;
  }

  .callback-outer-wrapper {
    &:nth-child(odd) {
      background-color: $main-lighten-80-color;
    }

    .callback-wrapper {
      min-height: 6.9rem;
      display: flex;
      align-items: center;
      padding: 2rem;

      &.criteria {
        padding-right: 4rem;
      }

      &.version {
        padding-left: 4rem;

        .version-icon {
          padding-left: 4rem;
          color: $main-color !important;
          cursor: pointer;
        }
      }
    }
  }

  .mobile {
    .form-wrapper {
      margin-top: 6rem;
    }

    .chip-outer-wrapper {
      margin-bottom: 3rem;

      .chip-wrapper {
        display: flex;
        overflow: scroll;

        .first-selection-chip {
          background-color: $primary-color;
          border: none !important;
        }

        .chip {
          text-transform: capitalize;
          margin-right: 1rem;
          margin-bottom: 1rem;
          border: solid 0.1rem $main-lighten-74-color;
          min-width: fit-content;

          &.chip-active {
            border: solid 0.2rem $main-color;
          }
        }
      }
    }

    .mobile-criteria {
      margin-bottom: 3rem;
    }

    .mobile-url {
      margin-bottom: 3rem;
    }

    .mobile-version {
      margin-bottom: 4rem;
    }

    .delete-criteria-outer-wrapper {
      margin-bottom: 4rem;

      .delete-criteria-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>
