<template>
  <div id="create-exchange-place" v-if="exchangePlace" data-id="exchangePlace-create">
    <content-header v-if="$vuetify.breakpoint.smAndUp" dataId="exchangePlace-create">
      <template #breadcrumb>
        <mp-breadcrumb />
      </template>
      <template #title>
        <h1 data-id="exchangePlace-create-tile">
          {{ exchangePlace.name || $t('breadcrumbs.createExchangePlace') }}
        </h1>
      </template>
      <template #actions-button>
        <div class="actions-wrapper">
          <mp-button
            :text="$t('action.cancel.base')"
            format="link"
            linkColor="black"
            dataId="exchangePlace-create-cancel"
            @click.stop="cancel()"
          />
          <mp-button
            :text="$t('action.save')"
            format="success"
            icon="content-save-outline"
            dataId="exchangePlace-create-submit"
            :disabled="invalid"
            @click="submit()"
          />
        </div>
      </template>
    </content-header>

    <v-form ref="form" class="form">
      <v-row no-gutters class="form-inner-wrapper">
        <v-col cols="10" offset="1" sm="10" offset-sm="1">
          <v-row no-gutters class="title-outer-wrapper">
            <v-col cols="12">
              <h2 data-id="store-create-profil-title">{{ $t('common.profile') }}</h2>
            </v-col>
          </v-row>
          <v-row no-gutters class="state-outer-wrapper">
            <v-col cols="12" class="state-wrapper">
              <mp-switch v-model="exchangePlace.active" />
              <span class="regular16" data-id="exchangePlace-create-active">
                {{ $t('common.active') }}
              </span>
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col cols="12">
              <v-row no-gutters class="mb-5">
                <v-col cols="12" md="8" lg="6">
                  <mp-textfield
                    :label="`${$t('common.name')} *`"
                    name="create-exchange-place__name"
                    v-model="exchangePlace.name"
                    dataId="exchangePlace-create-name"
                    @input="$v.exchangePlace.name.$touch()"
                    @blur="$v.exchangePlace.name.$touch()"
                    :errors="getModelErrors($v.exchangePlace.name)"
                    :isDirty="$v.exchangePlace.name.$dirty"
                  />
                </v-col>
              </v-row>

              <v-row no-gutters class="mb-5">
                <v-col cols="12" md="8" lg="6">
                  <mp-textfield
                    :label="`${$t('page.exchangePlace.externalPlaceId')} *`"
                    name="create-exchange-place__name"
                    v-model="exchangePlace.externalPlaceId"
                    dataId="exchangePlace-create-externalPlaceId"
                    @input="$v.exchangePlace.externalPlaceId.$touch()"
                    @blur="$v.exchangePlace.externalPlaceId.$touch()"
                    :errors="getModelErrors($v.exchangePlace.externalPlaceId)"
                    :isDirty="$v.exchangePlace.externalPlaceId.$dirty"
                  />
                </v-col>
              </v-row>
              <v-row no-gutters class="mb-5">
                <v-col cols="12" md="8" lg="6">
                  <timezone-autocomplete
                    :timezone="exchangePlace.timezone"
                    dataId="create-exchange-place_timezone"
                    @updateTimezone="handleChangeTimezone($event)"
                    :label="`${$t('common.timezone')} *`"
                    @input="$v.exchangePlace.timezone.$touch()"
                    @blur="$v.exchangePlace.timezone.$touch()"
                    :errors="getModelErrors($v.exchangePlace.timezone)"
                    :isDirty="$v.exchangePlace.timezone.$dirty"
                  />
                </v-col>
              </v-row>
              <v-row no-gutters class="mb-5">
                <v-col cols="12" md="8" lg="6">
                  <mp-textfield
                    :label="`${$t('page.exchangePlace.minuteBeforeCutOff')}`"
                    name="create-exchange-place__minute-before-cutoff"
                    v-model="exchangePlace.minuteBeforeCutoff"
                    type="number"
                    dataId="exchangePlace-create-minuteBeforeCutoff"
                    :suffix="$t('common.minutes')"
                    @input="$v.exchangePlace.minuteBeforeCutoff.$touch()"
                    @blur="$v.exchangePlace.minuteBeforeCutoff.$touch()"
                    :errors="getModelErrors($v.exchangePlace.minuteBeforeCutoff)"
                    :isDirty="$v.exchangePlace.minuteBeforeCutoff.$dirty"
                  />
                </v-col>
              </v-row>
              <v-row no-gutters class="mb-5">
                <v-col cols="12" md="8" lg="6">
                  <mp-select
                    dataId="exchangePlace-create-address-type"
                    :label="`${$t('common.type')} *`"
                    :items="exchangePlaceTypes"
                    v-model="exchangePlace.type"
                    @input="$v.exchangePlace.type.$touch()"
                    @blur="$v.exchangePlace.type.$touch()"
                    :errors="getModelErrors($v.exchangePlace.type)"
                    :isDirty="$v.exchangePlace.type.$dirty"
                    :disabled="isEditing"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <!-- address -->

          <v-row no-gutters class="address-container" data-id="exchangePlace-create-address">
            <v-col cols="12" md="8" lg="6">
              <v-row no-gutters class="address-label-outer-wrapper">
                <v-col cols="12">
                  <h2 data-id="exchangePlace-create-address-title">
                    {{ $t('common.address.base') }}
                  </h2>
                </v-col>
              </v-row>

              <v-row no-gutters class="mb-5">
                <v-col cols="12">
                  <mp-textfield
                    :label="`${$t('common.address.base')} *`"
                    name="create-exchange-place__address-line1"
                    v-model="exchangePlace.address.addressLine1"
                    dataId="exchangePlace-create-address-addressLine1"
                    @input="$v.exchangePlace.address.addressLine1.$touch()"
                    @blur="$v.exchangePlace.address.addressLine1.$touch()"
                    :errors="getModelErrors($v.exchangePlace.address.addressLine1)"
                    :isDirty="$v.exchangePlace.address.addressLine1.$dirty"
                  />
                </v-col>
              </v-row>

              <v-row no-gutters class="mb-5">
                <v-col cols="12">
                  <mp-textfield
                    :label="$t('common.complementAddress')"
                    name="create-exchange-place__address-line2"
                    v-model="exchangePlace.address.addressLine2"
                    dataId="exchangePlace-create-address-addressLine2"
                    @input="$v.exchangePlace.address.addressLine2.$touch()"
                    @blur="$v.exchangePlace.address.addressLine2.$touch()"
                    :errors="getModelErrors($v.exchangePlace.address.addressLine2)"
                    :isDirty="$v.exchangePlace.address.addressLine2.$dirty"
                  />
                </v-col>
              </v-row>

              <v-row no-gutters class="mb-5">
                <v-col cols="12">
                  <mp-textfield
                    :label="`${$t('common.postalCode')} *`"
                    name="create-exchange-place__address-postal-code"
                    v-model="exchangePlace.address.postalCode"
                    dataId="exchangePlace-create-address-postalCode"
                    @input="$v.exchangePlace.address.postalCode.$touch()"
                    @blur="$v.exchangePlace.address.postalCode.$touch()"
                    :errors="getModelErrors($v.exchangePlace.address.postalCode)"
                    :isDirty="$v.exchangePlace.address.postalCode.$dirty"
                  />
                </v-col>
              </v-row>

              <v-row no-gutters class="mb-5">
                <v-col cols="12">
                  <mp-textfield
                    :label="`${$t('common.town')} *`"
                    name="create-exchange-place__address-town"
                    v-model="exchangePlace.address.city"
                    dataId="exchangePlace-create-address-city"
                    @input="$v.exchangePlace.address.city.$touch()"
                    @blur="$v.exchangePlace.address.city.$touch()"
                    :errors="getModelErrors($v.exchangePlace.address.city)"
                    :isDirty="$v.exchangePlace.address.city.$dirty"
                  />
                </v-col>
              </v-row>

              <v-row no-gutters class="mb-5">
                <v-col cols="12">
                  <mp-select
                    :label="`${$t('common.country.base')} *`"
                    dataId="exchangePlace-create-address-country"
                    v-model="exchangePlace.address.country"
                    :items="getCountries"
                    @input="$v.exchangePlace.address.country.$touch()"
                    @blur="$v.exchangePlace.address.country.$touch()"
                    :errors="getModelErrors($v.exchangePlace.address.country)"
                    :isDirty="$v.exchangePlace.address.country.$dirty"
                  />
                </v-col>
              </v-row>

              <v-row no-gutters class="mb-5">
                <v-col cols="12">
                  <mp-textarea
                    v-model.trim="$v.exchangePlace.address.comment.$model"
                    :label="$t('common.comment')"
                    :rows="4"
                    noResize
                    dataId="exchangePlace-create-address-comment"
                    @input="$v.exchangePlace.address.comment.$touch()"
                    @blur="$v.exchangePlace.address.comment.$touch()"
                    :errors="getModelErrors($v.exchangePlace.address.comment)"
                    :isDirty="$v.exchangePlace.address.comment.$dirty"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <!-- contact -->
          <contacts
            class="contacts-container"
            dataId="exchangePlace-create-contacts"
            :contacts="exchangePlace.contacts"
            :title="$t('common.contacts')"
            @invalid="invalids.contacts = $event"
            :withTimezone="true"
            :withLanguage="true"
          />
        </v-col>

        <v-col cols="12" sm="10" offset-sm="1">
          <v-row
            no-gutters
            class="slot-container"
            v-if="exchangePlace.openingHours"
            data-id="exchangePlace-create-schedule"
          >
            <v-col
              cols="11"
              offset="1"
              sm="12"
              offset-sm="0"
              class="title-wrapper"
            >
              <h2 data-id="exchangePlace-create-schedule-title">
                {{ $t('page.exchangePlace.schedule.title') }}
              </h2>
            </v-col>

            <v-col cols="12" md="6" :class="`${$vuetify.breakpoint.mdAndUp ? 'column-grey' : ''}`">
              <mp-slot
                id="exchangePlace-create-schedule-monday"
                :days.sync="exchangePlace.openingHours.monday"
                label="mon"
                :limit="4"
                @invalid="invalids.monday = $event"
              />
            </v-col>
            <v-col cols="12" md="6" class="column-grey column-even">
              <mp-slot
                id="exchangePlace-create-schedule-tuesday"
                :days.sync="exchangePlace.openingHours.tuesday"
                label="tue"
                :limit="4"
                @invalid="invalids.tuesday = $event"
              />
            </v-col>
            <v-col cols="12" md="6">
              <mp-slot
                id="exchangePlace-create-schedule-wednesday"
                :days.sync="exchangePlace.openingHours.wednesday"
                label="wed"
                :limit="4"
                @invalid="invalids.wednesday = $event"
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
              :class="`${$vuetify.breakpoint.mdAndUp ? 'column-even' : 'column-even column-grey'}`"
            >
              <mp-slot
                id="exchangePlace-create-schedule-thursday"
                :days.sync="exchangePlace.openingHours.thursday"
                label="thu"
                :limit="4"
                @invalid="invalids.thursday = $event"
              />
            </v-col>
            <v-col cols="12" md="6" :class="`${$vuetify.breakpoint.mdAndUp ? 'column-grey' : ''}`">
              <mp-slot
                id="exchangePlace-create-schedule-friday"
                :days.sync="exchangePlace.openingHours.friday"
                label="fri"
                :limit="4"
                @invalid="invalids.friday = $event"
              />
            </v-col>
            <v-col cols="12" md="6" class="column-grey column-even">
              <mp-slot
                id="exchangePlace-create-schedule-saturday"
                :days.sync="exchangePlace.openingHours.saturday"
                label="sat"
                :limit="4"
                @invalid="invalids.saturday = $event"
              />
            </v-col>
            <v-col cols="12" md="6">
              <mp-slot
                id="exchangePlace-create-schedule-sunday"
                :days.sync="exchangePlace.openingHours.sunday"
                label="sun"
                :limit="4"
                @invalid="invalids.sunday = $event"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-row no-gutters class="action-outer-wrapper" v-if="$vuetify.breakpoint.smAndUp">
        <v-col cols="10" offset="1" class="action-wrapper action-save">
          <mp-button
            dataId="exchangePlace-create-cancel"
            :text="$t('action.cancel.base')"
            format="link"
            linkColor="black"
            @click.stop="cancel()"
          />

          <mp-button
            dataId="exchangePlace-create-submit"
            :text="$t('action.save')"
            format="success"
            icon="content-save-outline"
            :disabled="invalid"
            @click="submit()"
          />
        </v-col>
      </v-row>

      <v-row no-gutters v-if="$vuetify.breakpoint.xsOnly" class="action-outer-wrapper-mobile">
        <v-col cols="6" class="action-cancel-wrapper">
          <mp-button
            dataId="exchangePlace-create-cancel"
            icon="arrow-left"
            format="sticky"
            stickyColor="yellow"
            @click.stop="cancel()"
          />
        </v-col>
        <v-col cols="6">
          <mp-button
            dataId="exchangePlace-create-submit"
            :text="$t('action.save')"
            format="sticky"
            stickyColor="yellow"
            @click="submit()"
            :disabled="invalid"
          />
        </v-col>
      </v-row>
    </v-form>

    <v-row no-gutters v-if="showUpdateModal">
      <v-col cols="12">
        <mp-dialog-confirmation
          :dataId="`exchangeplace-update-modal`"
          :textContent="$t('page.exchangePlace.updateOpeningHours.message')"
          @close="confirm()"
          color="error"
          :header="{
            icon: 'mdi-exclamation-thick',
            isColorBackground: false,
            iconClose: 'mdi-close',
          }"
          persistent
          :showIconClose="false"
          :btnValidation="{ text: $t('action.exchangePlace.updateOpeningHours'), format: 'error' }"
          @submit="confirm()"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { COUNTRY } from '@/constants/shared'
import ExchangePlaceMapper from '@/services/exchangePlace/ExchangePlaceMapper'
import mixins from 'vue-typed-mixins'
import { maxLength, required, integer } from 'vuelidate/lib/validators'

import contentHeader from '@/components/contentHeader/contentHeader.vue'
import mpBreadcrumb from '@/components/breadcrumb/breadcrumb.vue'
import mpSlot from '@/components/form/slot/slot.vue'
import contacts from '@/components/contacts/contacts.vue'

import { validationMixin } from '@/mixins'

import ExchangePlaceService from '@/services/exchangePlace/ExchangePlaceService'
import StoreService from '@/services/store/StoreService'
import TimezoneAutocomplete from '@/components/form/timezoneAutocomplete/timezoneAutocomplete.vue'

import {
  getDefaultExchangePlace,
  ExchangePlaceEntity,
  DayCapacity,
  StoreEntity,
  SelectItem,
} from '@/types'
import { SnackBarType } from '@/store/types'
import { SET_BREADCRUMBS_LABEL, SET_HEADER_TITLE } from '@/store/mutation-types'
import {
  SET_EXCHANGE_PLACE_DATA,
  SET_UPDATED_SLOTS,
} from '@/store/modules/exchangePlace/mutations-type'

import { ROUTES, EXCHANGE_PLACE_TYPE } from '@/constants'

export default mixins(validationMixin).extend({
  name: 'create-exchange-place',
  components: {
    contentHeader,
    mpBreadcrumb,
    mpSlot,
    contacts,
    TimezoneAutocomplete,
  },
  data: () => ({
    store: null as StoreEntity | null,
    exchangePlace: null as ExchangePlaceEntity | null,
    exchangePlaceTypes: [] as SelectItem[],
    invalids: {
      contacts: false,
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    },
    isEditing: false,
    showUpdateModal: false,
  }),
  validations: {
    exchangePlace: {
      name: { required },
      externalPlaceId: { required },
      minuteBeforeCutoff: { integer },
      type: { required },
      timezone: { required },
      address: {
        addressLine1: { required },
        addressLine2: {},
        postalCode: { required },
        city: { required },
        country: { required },
        comment: { maxLength: maxLength(255) },
      },
    },
  },
  computed: {
    getCountries() {
      return Object.values(COUNTRY).map(value => ({
        text: this.$t(`common.country.${value}`),
        value,
      }))
    },
    invalid() {
      return (
        this.$v.exchangePlace.$invalid ||
        this.invalids.contacts ||
        this.invalids.monday ||
        this.invalids.tuesday ||
        this.invalids.wednesday ||
        this.invalids.thursday ||
        this.invalids.friday ||
        this.invalids.saturday ||
        this.invalids.sunday
      )
    },
  },
  async beforeMount() {
    this.store = await StoreService.get(parseInt(this.$route.params.storeId, 10), {
      retailerId: parseInt(this.$route.params.id, 10),
    })

    // initialize store with either vuex or request
    const getExchangePlaceVuex: ExchangePlaceEntity =
      this.$store.getters['exchangePlace/exchangePlaceData']
    let getExchangePlaceApi = null
    if (this.$route.params.exchangePlaceId && !getExchangePlaceVuex.id) {
      getExchangePlaceApi = await ExchangePlaceService.get(
        parseInt(this.$route.params.exchangePlaceId, 10),
      )
    }

    const localExchangePlace = ExchangePlaceService.buildExchangePlace(
      getExchangePlaceApi ? getExchangePlaceApi : getExchangePlaceVuex,
      !this.$route.params.exchangePlaceId ? false : true,
      true,
    )

    if (this.store) {
      const breadcrumbLabels: { stores: string; exchangePlaces: string; retailers?: string } = {
        stores: this.store.name,
        exchangePlaces: localExchangePlace!.name,
      }

      if (this.store.Retailer) {
        breadcrumbLabels.retailers = this.store.Retailer.name
      }
      this.$store.commit(SET_BREADCRUMBS_LABEL, JSON.stringify(breadcrumbLabels))
    }

    if (localExchangePlace) {
      this.$store.commit(
        SET_HEADER_TITLE,
        localExchangePlace.name || this.$t('breadcrumbs.createExchangePlace'),
      )
    }

    // fix input value (used 0 as unlimited but 0 is falsy)
    if (typeof localExchangePlace.minuteBeforeCutoff === 'number') {
      localExchangePlace.minuteBeforeCutoff = localExchangePlace.minuteBeforeCutoff.toString()
    }

    // type of exchangePlace
    for (const exchangePlaceType in EXCHANGE_PLACE_TYPE) {
      if (this.exchangePlaceTypes) {
        this.exchangePlaceTypes.push({
          value: exchangePlaceType,
          text: this.$t(`technical.exchangePlaceTypes.${exchangePlaceType}`),
        })
      }
    }

    this.isEditing = this.$route.name === ROUTES.updateExchangePlace

    this.exchangePlace = localExchangePlace
  },
  beforeDestroy() {
    this.$store.commit(`exchangePlace/${SET_EXCHANGE_PLACE_DATA}`, getDefaultExchangePlace())
  },
  methods: {
    handleChangeTimezone(newTimezone: string) {
      this.exchangePlace!.timezone = newTimezone
    },
    async submit() {
      let exchangePlaceId = this.$route.params.exchangePlaceId
      const { storeId, id: retailerId } = this.$route.params
      const formattedExchangePlace = ExchangePlaceMapper.toDto(this.exchangePlace!)
      let message = this.$t('messages.exchangePlaceCreated')

      try {
        if (exchangePlaceId) {
          if (!formattedExchangePlace.exceptions) {
            delete formattedExchangePlace.exceptions
          }
          if (!formattedExchangePlace.schedule) {
            delete formattedExchangePlace.schedule
          } else {
            const oldSlots: Record<string, DayCapacity[]> = formattedExchangePlace.schedule.slots
            const generatedSlots: Record<string, DayCapacity[]> =
              ExchangePlaceService.generateSlots(
                formattedExchangePlace.openingHours,
                formattedExchangePlace.schedule.slotsFrequency,
              )
            const newSlots: Record<string, DayCapacity[]> = {}

            Object.keys(generatedSlots).forEach(key => {
              newSlots[key] = generatedSlots[key].map(slot => {
                return (
                  oldSlots[key]?.find(oldSlot => {
                    return slot.start === oldSlot.start && slot.end === oldSlot.end
                  }) || slot
                )
              })
            })

            formattedExchangePlace.schedule.slots = newSlots
            const updatedSlots = this.slotsDiff(generatedSlots, oldSlots)

            await ExchangePlaceService.updateSchedules(
              exchangePlaceId,
              formattedExchangePlace.schedule,
            )
            await ExchangePlaceService.update(exchangePlaceId, formattedExchangePlace)
            message = this.$t('messages.exchangePlaceUpdated')
            this.showUpdateModal = Object.values(updatedSlots).some(item =>
              Object.values(item).some((d: DayCapacity[]) => d.length > 0),
            )
            if (this.showUpdateModal) {
              this.$store.commit(`exchangePlace/${SET_UPDATED_SLOTS}`, updatedSlots)
              return
            }
          }

          await ExchangePlaceService.update(exchangePlaceId, formattedExchangePlace)
          message = this.$t('messages.exchangePlaceUpdated')
        } else {
          const exchangePlace = await ExchangePlaceService.create({
            ...formattedExchangePlace,
            retailerId,
            storeId,
          })
          exchangePlaceId = exchangePlace.id
        }

        this.$store.dispatch('setSnackbar', {
          message,
          type: SnackBarType.SUCCESS,
        })

        this.$router.push({
          name: ROUTES.exchangePlace,
          params: {
            id: retailerId,
            storeId,
            exchangePlaceId,
          },
        })
      } catch (e) {
        if (e.response && e.response.status === 409) {
          return this.$store.dispatch('setSnackbar', {
            message: this.$t('messages.exchangePlaceAlreadyExists'),
            type: SnackBarType.ERROR,
          })
        }
        this.$store.dispatch('setSnackbar', {
          message: this.$t('messages.error'),
          type: SnackBarType.ERROR,
        })
      }
    },
    confirm() {
      this.showUpdateModal = false

      const exchangePlaceId = this.$route.params.exchangePlaceId
      const { storeId, id: retailerId } = this.$route.params

      this.$router.push({
        name: ROUTES.editTypicalWeek,
        params: {
          id: retailerId,
          storeId,
          exchangePlaceId,
        },
      })
    },
    cancel() {
      this.$router.go(-1)
    },
    slotsDiff(newSlots: Record<string, DayCapacity[]>, oldSlots: Record<string, DayCapacity[]>) {
      const slotsDiff: Record<string, Record<string, DayCapacity[]>> = { added: {}, removed: {} }

      for (const [key] of Object.entries(newSlots)) {
        if (!oldSlots[key]) {
          continue
        }
        const oldSlotsMap: DayCapacity[] = oldSlots[key].map((dayCapacity: DayCapacity) => {
          return {
            start: dayCapacity.start,
            end: dayCapacity.end,
            capacity: 0,
          }
        })
        const added = newSlots[key].filter(
          slot1 => !oldSlotsMap.map(slot2 => JSON.stringify(slot2)).includes(JSON.stringify(slot1)),
        )
        const removed = oldSlotsMap.filter(
          slot1 =>
            !newSlots[key].map(slot2 => JSON.stringify(slot2)).includes(JSON.stringify(slot1)),
        )
        // added slots
        slotsDiff.added[key] = added
        // removed slots
        slotsDiff.removed[key] = removed
      }
      return slotsDiff
    },
  },
})
</script>

<style lang="scss">
#create-exchange-place {
  padding: 0;
  padding-bottom: 5.4rem;

  .main-header__actions {
    .actions-wrapper {
      @media #{map-get($display-breakpoints, 'sm-only')} {
        display: flex;
        flex-direction: column-reverse;
      }
    }
  }

  .form {
    .form-inner-wrapper {
      @media #{map-get($display-breakpoints, 'xs-only')} {
        max-height: calc(100vh - 8.3rem - 3.1rem);
        min-height: calc(100vh - 8.3rem - 3.1rem);
        overflow-y: scroll;
      }

      .title-outer-wrapper {
        margin-bottom: 2rem;
      }

      .state-outer-wrapper {
        margin-bottom: 2rem;

        @media #{map-get($display-breakpoints, 'xs-only')} {
          margin-bottom: 4rem;
        }

        .state-wrapper {
          display: flex;
          align-items: center;

          .v-input__control {
            .v-input__slot {
              margin-bottom: 0;
            }

            .v-messages {
              display: none;
            }
          }
        }
      }

      .address-container {
        .address-label-outer-wrapper {
          margin-bottom: 4.8rem;
        }
      }

      .contacts-container {
        margin-top: 4rem;
        margin-bottom: 3rem;
      }

      .slot-container {
        .slot-component {
          @media #{map-get($display-breakpoints, 'xs-only')} {
            padding-left: 0 !important;
          }
        }

        .title-wrapper {
          margin-bottom: 2rem;
        }

        .column-grey {
          .slot-component {
            background-color: $main-lighten-80-color;
          }
        }

        > :not(.column-even) {
          @media #{map-get($display-breakpoints, 'md-and-up')} {
            padding-right: 3.5rem;
          }
        }
      }
    }

    .action-outer-wrapper {
      margin-top: 8rem;

      .action-wrapper {
        display: flex;
        justify-content: flex-end;
      }
    }

    .action-outer-wrapper-mobile {
      .action-cancel-wrapper {
        padding-right: 0.1rem;
      }

      button {
        min-height: 6rem;
        width: 100%;
      }
    }
  }
}
</style>
