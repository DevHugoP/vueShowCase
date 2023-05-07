<template>
  <v-container id="carrier-detail-commitment" data-id="carrier-detail-commitment">
    <mp-block
      id="carrier-detail-commitment-block"
      :hasBorder="$vuetify.breakpoint.smAndUp"
      :hasMarginBottom="$vuetify.breakpoint.smAndUp"
      titleHasPaddingBottom
    >
      <template #title>
        <div class="d-flex justify-space-between">
          <h2>{{ $t('page.carrier.commitment.title') }}</h2>
          <v-menu
            bottom
            offset-y
            origin="center top"
            transition="scale-transition"
            v-if="isAuthorized('MANAGE_CARRIERS_PARAMETERS')"
          >
            <template v-slot:activator="{ on, attrs }" v-if="$vuetify.breakpoint.smAndUp">
              <v-icon
                v-bind="attrs"
                v-on="on"
                data-id="commitments-actions"
              >
                mdi-dots-vertical
              </v-icon>
            </template>
            <v-list>
              <v-list-item v-if="displayDeleteButton" @click="setDelete()">
                <v-list-item-icon>
                  <v-icon v-text="'mdi-trash-can-outline'" />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="$t('action.delete.base')" />
                </v-list-item-content>
              </v-list-item>

              <v-list-item @click="update()">
                <v-list-item-icon>
                  <v-icon v-text="'mdi-refresh'" />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="$t('action.update.base')" />
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </template>

      <template #default>
        <v-row
          no-gutters
          cols="12"
          class="commitment"
          v-if="commitments && commitments.length && !loading"
        >
          <v-col cols="12" class="data-container">
            <span class="regular14 label">
              {{ $t('page.carrier.commitment.title') }}
            </span>

            <span class="regular14 value">
              {{ commitments[0].amount }}
            </span>
          </v-col>

          <v-col cols="12" class="data-container">
            <span class="regular14 label">
              {{ $t('page.carrier.commitment.period.title') }}
            </span>

            <span class="regular14 value">
              {{ $t(`page.carrier.commitment.period.${commitments[0].period}`) }}
            </span>
          </v-col>

          <v-col cols="12" class="data-container">
            <span class="regular14 label">
              {{ $t('page.carrier.commitment.scoreToAdd') }}
            </span>

            <span class="regular14 value">
              {{ commitments[0].scoreToAdd }}
            </span>
          </v-col>

          <v-col cols="12" v-if="commitments[0].attributes && commitments[0].attributes.tags">
            <v-row
              no-gutters
              v-for="(tag, index) in commitments[0].attributes.tags"
              :key="index"
              class="data-container"
            >
              <span class="regular14 label">
                {{ index }}
              </span>

              <span class="regular14 value">
                {{ tag }}
              </span>
            </v-row>
          </v-col>
        </v-row>

        <no-data v-else dataId="commitments-noData" :content="$t('common.noData.noContent')" />

        <v-row
          no-gutters
          class="action-outer-wrapper"
          v-if="isAuthorized('MANAGE_CARRIERS_PARAMETERS') && !commitments.length"
        >
          <v-col cols="12" class="d-flex justify-center" v-if="$vuetify.breakpoint.smAndUp">
            <mp-button
              icon="plus"
              iconSize="1.8rem"
              :text="$t('action.add.base')"
              dataId="carrier-detail-commitment-add"
              @click="!commitments.length ? (showSaveDialog = !showSaveDialog) : null"
            />
          </v-col>
        </v-row>
      </template>
    </mp-block>

    <mp-dialog-commitment
      v-if="showSaveDialog"
      :commitment="commitment"
      @reset="reset()"
      @save="save()"
      :isEdit="Boolean(commitments) && Boolean(commitments[0])"
    />
    <mp-dialog-confirmation
      v-if="showDeleteDialog"
      dataId="modal-delete"
      :textContent="$t('validation.confirmation.deleteCommitment')"
      @close="reset()"
      @submit="sendDelete()"
      color="error"
      :header="{ icon: 'mdi-trash-can-outline', isColorBackground: false, iconClose: 'mdi-close' }"
      :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
      :btnValidation="{ text: $t('action.delete.base'), format: 'error' }"
      :btnToColumn="$vuetify.breakpoint.xsOnly"
    />
  </v-container>
</template>

<script lang="ts">
import { GetCarrierParams } from '@/services/carrier/CarrierRepository'
import mixins from 'vue-typed-mixins'

import noData from '@/components/noData/noData.vue'
import mpBlock from '@/components/block/block.vue'
import mpDialogCommitment from './modals/commitmentForm.vue'

import OrderEligibilityService from '@/services/orderEligibility/OrderEligibilityService'

import { authorizationMixin } from '@/mixins'
import { CommitmentEntity } from '@/types'
import { SnackBarType } from '@/store/types'

const DEFAULT_COMMITMENT = {
  amount: 0,
  name: '',
  period: '',
  scoreToAdd: 0,
}

export default mixins(authorizationMixin).extend({
  name: 'mp-carrier-detail-commitment',
  components: {
    noData,
    mpBlock,
    mpDialogCommitment,
  },
  props: {
    commitments: {
      type: Array as () => CommitmentEntity[],
      required: true,
    },
    parentCommitments: {
      type: Array as () => CommitmentEntity[],
      required: true
    },
    params: {
      type: Object as () => GetCarrierParams,
      required: true,
    },
  },
  data: () => ({
    displayDeleteButton: false,
    showSaveDialog: false,
    commitment: { ...DEFAULT_COMMITMENT, attributes: {} } as CommitmentEntity,
    showDeleteDialog: false,
    loading: false,
  }),
  async mounted() {
    this.checkDeleteButton()
  },
  methods: {
    scrollTo(refToScroll: string) {
      setTimeout(() => {
        ;(this.$refs[refToScroll] as any)[0].$el?.scrollIntoView(true, {
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest',
        })
      }, 300)
    },
    reset() {
      this.commitment = { ...DEFAULT_COMMITMENT, attributes: {} }
      this.showSaveDialog = false
      this.showDeleteDialog = false
    },
    async save() {
      if (this.commitments && this.commitments[0]) {
        this.commitments[0] = {
          ...this.commitment,
          amount: Number(this.commitment.amount),
          scoreToAdd: Number(this.commitment.scoreToAdd)
        }
      } else {
        this.commitments.push({
          ...this.commitment,
          amount: Number(this.commitment.amount),
          scoreToAdd: Number(this.commitment.scoreToAdd)
        })
      }

      await this.sendRequest(this.commitments)
      this.checkDeleteButton()
      this.reset()
    },
    update() {
      this.commitment = { ...this.commitments[0] }
      this.showSaveDialog = true
    },
    checkDeleteButton(): void {
      this.displayDeleteButton = this.commitments.length > 1 ||
        !(
          this.parentCommitments.length === this.commitments.length &&
          JSON.stringify(this.commitments) === JSON.stringify(this.parentCommitments)
        )
    },
    async sendRequest(commitments: CommitmentEntity[]) {
      this.loading = true

      try {
        await OrderEligibilityService.updateCommitments(this.params, { commitments })
      } catch (e) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      } finally {
        this.loading = false
      }
    },
    setDelete() {
      this.showDeleteDialog = !this.showDeleteDialog
    },
    async sendDelete() {
      this.commitments.splice(0, 1)
      await this.sendRequest(this.commitments)

      this.reset()
    },
  },
})
</script>

<style lang="scss" scoped>
#carrier-detail-commitment {
  padding: 0;

  @media #{map-get($display-breakpoints, 'xs-only')} {
    border-top: solid 0.1rem $main-lighten-74-color;
  }

  .title-outer-wrapper {
    margin-bottom: 2.3rem;
  }

  .action-outer-wrapper {
    margin-top: 2rem;
  }

  .data-container {
    padding-bottom: 1.6rem;
    margin-bottom: 1.6rem;
    border-bottom: solid 0.1rem $main-lighten-74-color;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }

    &:last-of-type {
      border-bottom: none;
      margin-bottom: 0;
    }

    .label {
      color: $main-lighten-52-color;
    }

    .value {
      color: $main-color;
      display: flex;
      justify-content: flex-end;
      word-break: break-all;
      text-align: right;
    }
  }

  .main-commitment-outer-wrapper {
    display: flex;
    &.margin-bottom {
      margin-bottom: 5rem;
    }

    .main-commitment-label-wrapper {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .main-commitment-icon {
        margin-right: 1.5rem;
      }
    }

    .main-commitment-value-wrapper {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      align-self: flex-end;

      .main-commitment-icon {
        margin-right: 1.5rem;
      }
    }

    .option-commitment-outer-wrapper {
      margin-bottom: 2.6rem;

      &:first-child {
        margin-top: 1.8rem;
      }

      &:last-child {
        margin-bottom: 5rem;
      }

      .option-commitment-wrapper {
        margin-left: 3rem;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        i {
          margin-right: 1.5rem;
        }
      }
    }
  }
}
</style>
