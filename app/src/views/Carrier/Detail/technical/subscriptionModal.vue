<template>
  <mp-dialog-confirmation
    dataId="carrier-detail-technical-subscription-modal"
    classWrapper="carrier-detail-technical-subscription-modal"
    color="primary"
    :header="{
      iconClose: 'mdi-close',
      icon: $vuetify.breakpoint.smAndUp ? 'mdi-pencil' : '',
      isColorBackground: true,
      text: $t('action.modify.subscription'),
      textPolice: 'medium16',
    }"
    :btnValidation="{
      text: $t('action.save'),
      format: 'success',
      icon: 'content-save-outline',
      disabled: $v.$invalid,
    }"
    :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
    @close="$emit('close')"
    @submit="handleSubmit()"
  >
    <template #content>
      <v-row no-gutters>
        <v-col cols="10" offset="1" class="mt-9">
          <mp-chips-wrapper
            v-if="showChipsWrapper"
            dataId="subscrition-modal-chips-wrapper"
            :canAdd="subscriptionChips.length < CARRIER_SUBSCRIPTION.length"
            :isRemovable="subscriptionChips.length > 1"
            :chips="subscriptionChips"
            :maxChips="2"
            @addChip="addSubscription()"
            @deleteChip="deleteSubscription($event)"
            v-model="selectedChips"
          />
        </v-col>

        <v-col cols="10" offset="1" v-if="selectedChips" class="mt-8 mb-5">
          <mp-select
            :key="`criteria-${selectedChips.index}`"
            :label="$t('common.criteria')"
            v-model="localCallbacks[selectedChips.index].criteria"
            :items="getSubscriptionItems"
            dataId="subscription-modal-criteria"
            :attach="`#subscriptionCriteria${selectedChips.index}`"
            :dropdownId="`subscriptionCriteria${selectedChips.index}`"
            @input="$v.localCallbacks.$each[selectedChips.index].criteria.$touch()"
            @blur="$v.localCallbacks.$each[selectedChips.index].criteria.$touch()"
            :errors="getModelErrors($v.localCallbacks.$each[selectedChips.index].criteria)"
            :isDirty="$v.localCallbacks.$each[selectedChips.index].criteria.$dirty"
          />
        </v-col>

        <v-col cols="10" offset="1" v-if="selectedChips" class="mb-5">
          <mp-textarea
            :key="`url-${selectedChips.index}`"
            :label="$t('common.URL')"
            v-model="localCallbacks[selectedChips.index].url"
            dataId="subscription-modal-url"
            autoGrow
            :rows="1"
            @input="$v.localCallbacks.$each[selectedChips.index].url.$touch()"
            @blur="$v.localCallbacks.$each[selectedChips.index].url.$touch()"
            :errors="getModelErrors($v.localCallbacks.$each[selectedChips.index].url)"
            :isDirty="$v.localCallbacks.$each[selectedChips.index].url.$dirty"
          />
        </v-col>

        <v-col cols="10" offset="1" v-if="selectedChips">
          <mp-textfield
            :key="`version-${selectedChips.index}`"
            :label="$t('common.version')"
            v-model="localCallbacks[selectedChips.index].version"
            dataId="subscription-modal-version"
            @input="$v.localCallbacks.$each[selectedChips.index].version.$touch()"
            @blur="$v.localCallbacks.$each[selectedChips.index].version.$touch()"
            :errors="getModelErrors($v.localCallbacks.$each[selectedChips.index].version)"
            :isDirty="$v.localCallbacks.$each[selectedChips.index].version.$dirty"
          />
        </v-col>
      </v-row>
    </template>
  </mp-dialog-confirmation>
</template>

<script lang="ts">
import { CARRIER_SUBSCRIPTION } from '@/constants'
import { Subscription, SubscriptionEntity } from '@/types'
import { required, url } from 'vuelidate/lib/validators'
import { validationMixin } from '@/mixins'

import mixins from 'vue-typed-mixins'
import SubscriptionService from '@/services/subscription/SubscriptionService'
import SubscriptionMapper from '@/services/subscription/SubscriptionMapper'
import { SnackBarType } from '@/store/types'

const mustBeSemverVersion = (value: string) =>
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(-[a-zA-Z\d][-a-zA-Z.\d]*)?(\+[a-zA-Z\d][-a-zA-Z.\d]*)?$/.test(
        value,
    )

export default mixins(validationMixin).extend({
  name: 'carrier-detail-technical-subscription-modal',
  data: () => ({
    CARRIER_SUBSCRIPTION,
    selectedChips: null as any,
    subscription: null as SubscriptionEntity | null,
    localCallbacks: [] as Array<{ criteria: string; url: string; version: string }>,
    showChipsWrapper: true,
  }),
  computed: {
    subscriptionChips(): Array<{
      subscription: Subscription
      value: number
      text: string
      index: number
    }> {
      return this.localCallbacks.map((callback, index: number) => {
        return {
          subscription: callback,
          value: index,
          text: callback.criteria || this.$t('page.carrier.subscription.chips', { number: index + 1 }),
          index,
        }
      })
    },
    getAvailableSubscription(): string[] | undefined {
      return CARRIER_SUBSCRIPTION.filter(subscription => {
        return !this.subscriptionChips.find(chip => chip.subscription.criteria === subscription)
      })
    },
    getSubscriptionItems(): any {
      return this.localCallbacks[this.selectedChips.index].criteria
        ? [...(this.getAvailableSubscription || []), this.localCallbacks[this.selectedChips.index].criteria]
        : this.getAvailableSubscription
    },
  },
  validations: {
    localCallbacks: {
      $each: {
        criteria: { required },
        url: { required, url },
        version: { required, mustBeSemverVersion },
      },
    },
  },
  async beforeMount() {
    try {
      this.subscription = await SubscriptionService.getByCarrierId(this.$route.params.carrierId)
    } catch (err) {
      this.$store.dispatch('setSnackbar', {
        type: SnackBarType.ERROR,
        message: this.$t('messages.error'),
      })
      this.$emit('close')
      return
    }

    if (this.subscription) {
      this.localCallbacks = Object.entries(this.subscription.callbacks).map(([key, value]) => {
        return {
          ...value,
          criteria: key,
        }
      })
    } else {
      this.addSubscription()
    }
  },
  methods: {
    addSubscription(): void {
      this.localCallbacks.push({
        criteria: '',
        url: '',
        version: '',
      })

      if (this.$vuetify.breakpoint.xsOnly) {
        this.selectedChips = this.localCallbacks.length - 1
      }
    },
    deleteSubscription(chip: {
      subscription: Subscription
      value: number
      text: string
      index: number
    }): void {
      this.showChipsWrapper = false
      this.localCallbacks.splice(chip.index, 1)
      this.selectedChips = this.subscriptionChips[0]
      this.$nextTick(() => {
        this.showChipsWrapper = true
      })
    },
    handleSubmit(): void {
      try {
        const subscription = SubscriptionMapper.toDto(this.localCallbacks)

        this.subscription?.id
            ? SubscriptionService.updateByCarrierId(
                this.subscription.id,
                this.$route.params.carrierId,
                subscription,
            )
            : SubscriptionService.createByCarrierId(this.$route.params.carrierId, subscription)

        this.$emit('submit', subscription)
        this.$store.dispatch('setSnackbar', {
          message: this.$t('messages.carrierUpdated'),
          type: SnackBarType.SUCCESS,
        })
      } catch (e) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      } finally {
        this.$emit('close')
      }
    },
  },
})
</script>

<style lang="scss">
.carrier-detail-technical-subscription-modal {
  .main-dialog-content {
    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      @import '../../../../styles/mixins/macScrollbar';
      @include setMacScrollbar('&');
      max-height: calc(100vh - 33rem);
      overflow-y: scroll;
    }
  }

  .v-card__actions {
    border-top: 0.1rem solid $main-lighten-74-color;
  }
}
</style>
