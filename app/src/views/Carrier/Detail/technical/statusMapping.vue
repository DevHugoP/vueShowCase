<template>
  <v-container id="carrier-status-mapping" data-id="carrier-status-mapping">
    <mp-block
      id="carrier-status-mapping-block"
      :hasBorder="$vuetify.breakpoint.smAndUp"
      :hasMarginBottom="$vuetify.breakpoint.smAndUp"
      titleHasPaddingBottom
    >
      <template #title v-if="$vuetify.breakpoint.smAndUp">
        <div :class="statusMappings.length ? 'title-wrapper' : ''">
          <h2>
            {{ $t('page.statusMappings.titleVariant') }}
          </h2>
          <v-menu
            v-if="statusMappings.length"
            bottom
            left
            offset-y
            origin="center top"
            transition="scale-transition"
          >
            <template v-slot:activator="{ on }">
              <v-icon color="black" v-on="on">
                mdi-dots-vertical
              </v-icon>
            </template>
            <v-list>
              <v-list-item
                v-for="(action, index) in menuItems"
                :key="index"
                @click="handleActionsClick(action.type, action.id)"
              >
                <v-list-item-icon class="mr-3">
                  {{ action.id }}
                  <v-icon color="black" v-text="action.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-title>{{ action.text }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </template>
      <v-row class="status-mapping-wrapper" no-gutters v-if="statusMappings.length && statusMappings">
        <v-col cols="12">
          <v-row no-gutters class="data-container">
            <v-col cols="6">
              <span class="regular14 main-lighten-52">
                {{ $t('common.numberOfLine') }}
              </span>
            </v-col>
            <v-col cols="6" class="value">
              <span class="regular14 main-color">
                {{ statusMappings.length }}
              </span>
            </v-col>
          </v-row>

          <v-row no-gutters class="data-container">
            <v-col cols="6">
              <span class="regular14 main-lighten-52">
                {{ $t('common.registerDate') }}
              </span>
            </v-col>
            <v-col cols="6" class="value">
              <span class="regular14 main-color">
                {{ getCreatedAt }}
              </span>
            </v-col>
          </v-row>

          <v-row no-gutters class="data-container last">
            <v-col cols="6">
              <span class="regular14 main-lighten-52">
                {{ $t('common.lastUpdate') }}
              </span>
            </v-col>
            <v-col cols="6" class="value">
              <span class="regular14 main-color">
                {{ getUpdatedAt }}
              </span>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <no-data v-else dataId="status-mapping-noData" :content="$t('common.noData.noContent')" />

      <mp-dialog-confirmation
        v-if="showDeleteModal"
        dataId="status-mapping-modal-delete"
        :textContent="$t('action.statusMapping.delete')"
        @close="showDeleteModal = false"
        @submit="deleteMapping()"
        color="error"
        :header="{
          icon: 'mdi-trash-can-outline',
          isColorBackground: false,
          iconClose: 'mdi-close',
        }"
        :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
        :btnValidation="{ text: $t('action.delete.base'), format: 'error' }"
        :btnToColumn="$vuetify.breakpoint.xsOnly"
      />

      <v-row
        v-if="!statusMappings.length && isAuthorized('WRITE_STATUS_MAPPINGS')"
        justify="center"
        no-gutters
      >
        <mp-button
          v-if="$vuetify.breakpoint.smAndUp"
          :text="`${$t('action.add.base')}`"
          icon="plus"
          iconSize="1.8rem"
          class="mp-button"
          @click="goToDetail()"
          dataId="add-notifications"
        />
      </v-row>
    </mp-block>
  </v-container>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'

import noData from '@/components/noData/noData.vue'
import mpBlock from '@/components/block/block.vue'
import StatusMappingService from '@/services/statusMapping/StatusMappingService'
import { dateHelper, dateHelperGetTimezonedDate } from '@/helpers/dateHelper'
import { ROUTES } from '@/constants'
import { authorizationMixin } from '@/mixins'
import { SnackBarType } from '@/store/types'
import { StatusMappingEntity } from '@/types'

export default mixins(authorizationMixin).extend({
  name: 'carrier-status-mapping',
  components: {
    noData,
    mpBlock,
  },
  data: () => ({
    statusMappings: [] as StatusMappingEntity[],
    hasData: false,
    showDeleteModal: false,
    menuItems: [] as Array<{ icon: string; text: string; type: string }>,
  }),
  async mounted() {
    const carrierId = Number(this.$route.params.carrierId)

    try {
      this.statusMappings = await StatusMappingService.getAll({ carrierId })
    } catch (error) {
      this.statusMappings = []
    }

    this.hasData = true

    this.menuItems = [
      ...(this.isAuthorized('READ_CARRIERS_TECHNICAL')
        ? [
            {
              text: this.$t('common.consult'),
              icon: 'mdi-eye',
              type: 'READ_CARRIERS_TECHNICAL',
            },
          ]
        : []),
      ...(this.isAuthorized('DELETE_STATUS_MAPPINGS')
        ? [
            {
              text: this.$t('action.delete.base'),
              icon: 'mdi-trash-can-outline',
              type: 'DELETE_STATUS_MAPPINGS',
            },
          ]
        : []),
    ]
  },
  computed: {
    getCreatedAt() {
      return dateHelper.formatToTimezone(
        dateHelperGetTimezonedDate(this.statusMappings[0].createdAt),
        'UTC',
        'Pp',
      )
    },
    getUpdatedAt() {
      return dateHelper.formatToTimezone(
        dateHelperGetTimezonedDate(this.statusMappings[0].updatedAt),
        'UTC',
        'Pp',
      )
    },
  },
  methods: {
    handleActionsClick(actionType: string): void {
      switch (actionType) {
        case 'READ_CARRIERS_TECHNICAL': {
          this.goToDetail()
          break
        }
        case 'DELETE_STATUS_MAPPINGS': {
          this.showDeleteModal = true
          break
        }
      }
    },
    goToDetail() {
      this.$router.push({
        name: ROUTES.statusMappings,
        params: {
          carrierId: this.$route.params.carrierId,
        },
      })
    },
    async deleteMapping() {
      try {
        await StatusMappingService.delete({ carrierId: Number(this.$route.params.carrierId) })
        this.statusMappings = []
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.SUCCESS,
          message: this.$t('messages.statusMappingDeleteConfirmed'),
        })
      } catch (error) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      }

      this.showDeleteModal = false
    },
  },
})
</script>

<style lang="scss">
@import '../../../../styles/mixins/macScrollbar';

#carrier-status-mapping {
  padding: 0;

  .title-wrapper {
    display: flex;
    justify-content: space-between !important;
    width: 100%;
  }

  @media #{map-get($display-breakpoints, 'xs-only')} {
    border-top: solid 0.1rem $main-lighten-74-color;
  }

  .expension-panels {
    overflow: auto;
    @include setMacScrollbar('&');

    i {
      color: $main-color;
    }

    .template-collapse-wrapper {
      margin-bottom: 0.7rem;
      margin-top: 0;

      .v-expansion-panel-header {
        border-bottom-left-radius: inherit;
        border-bottom-right-radius: inherit;
      }
    }
  }

  .status-mapping-wrapper {
    max-height: 34rem;
    overflow: auto;
    @include setMacScrollbar('&');
  }

  .mp-button {
    margin-top: 2.5rem;
    margin-bottom: 0.1rem;
  }
  

  .data-container {
    padding-bottom: 1.6rem;
    margin-bottom: 1.6rem;
    border-bottom: solid 0.1rem $main-lighten-74-color;

    &.last {
      border-bottom: none;
    }

    .label {
      .regular12 {
        color: $main-lighten-52-color;
      }
    }

    .value {
      display: flex;
      justify-content: flex-end;

      .regular14 {
        word-break: break-all;
        text-align: right;
      }
    }
  }
}
</style>
