<template>
  <v-container id="retailer-ftp-account" data-id="retailer-ftp-account">
    <mp-block
      id="retailer-ftp-account-block"
      :hasBorder="$vuetify.breakpoint.smAndUp"
      :hasMarginBottom="$vuetify.breakpoint.smAndUp"
      titleHasPaddingBottom
    >
      <template #title>
        <div :class="ftpAccounts.length ? 'title-wrapper' : ''">
          <h2>
            {{ $t('page.ftpAccounts.title') }}
          </h2>
          <v-menu
            v-if="ftpAccounts.length"
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
                v-for="(action, index) in menuItem"
                :key="index"
                @click="handleActionsClick(action.type, action.id)"
              >
                <v-list-item-icon>
                  {{ action.id }}
                  <v-icon color="black" v-text="action.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-title>{{ action.text }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </template>
      <div class="content-ftp-wrapper" v-if="!ftpAccounts.length">
        <v-icon> mdi-cancel </v-icon>
        <h4 class="greyText">{{ $t('common.noData.noContent') }}</h4>
        <mp-button
          v-if="isAuthorized('WRITE_RETAILER_FTP')"
          icon="plus"
          :text="$t('action.add.base')"
          dataId="ftp-account-retailer-add"
          @click="goToAdd()"
        />
      </div>
      <div v-if="ftpAccounts.length" class="accounts-number-wrapper">
        <h4 class="regular14 greyText">{{ $t('page.ftpAccounts.numberOfAccounts') }}</h4>
        <h4 class="regular14 pr-2">{{ ftpAccounts.length }}</h4>
      </div>
    </mp-block>
  </v-container>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'

import mpBlock from '@/components/block/block.vue'
import { ROUTES } from '@/constants'
import { authorizationMixin } from '@/mixins'

import { FtpAccountEntity } from '@/types'
import FtpAccountsService from '@/services/ftpAccounts/FtpAccountsService'

export default mixins(authorizationMixin).extend({
  name: 'ftp-account-retailer-block',
  components: {
    mpBlock,
  },
  data: () => ({
    ftpAccounts: [] as FtpAccountEntity[],
    hasData: false,
    partnerType: null as 'carrier' | 'retailer' | null,
    menuItem: [] as Array<{ icon: string; text: string; type: string }>,
  }),
  async mounted() {
    this.partnerType = this.$route.params.carrierId ? 'carrier' : 'retailer'

    const partnerId = Number(this.$route.params.id)

    try {
      this.ftpAccounts = await FtpAccountsService.getAll({
        thirdPartyId: partnerId,
        type: this.partnerType,
      })
    } catch (error) {
      this.ftpAccounts = []
    }

    this.hasData = true

    this.menuItem = [
      {
        text: this.$t('page.ftpAccounts.showAccounts'),
        icon: 'mdi-eye',
        type: 'LIST_RETAILER_FTP',
      },
      ...(this.isAuthorized('WRITE_RETAILER_FTP')
        ? [
            {
              text: this.$t('page.ftpAccounts.addTitle'),
              icon: 'mdi-plus',
              type: 'WRITE_RETAILER_FTP',
            },
          ]
        : []),
    ]
  },

  methods: {
    goToAdd() {
      this.$router.push({
        name: ROUTES.addRetailerFtpAccounts,
        params: {
          retailerId: this.$route.params.id,
        },
      })
    },
    handleActionsClick(actionType: string, accountId: number): void {
      switch (actionType) {
        case 'LIST_RETAILER_FTP': {
          this.$router.push({
            name: ROUTES.retailerFtpAccounts,
            params: {
              retailerId: this.$route.params.id,
              accountId: `${accountId}`,
            },
          })
          break
        }
        case 'WRITE_RETAILER_FTP': {
          this.$router.push({
            name: ROUTES.addRetailerFtpAccounts,
            params: {
              retailerId: this.$route.params.id,
              accountId: `${accountId}`,
            },
          })
          break
        }
      }
    },
  },
})
</script>

<style lang="scss">
@import '../../../../styles/mixins/macScrollbar';

#retailer-ftp-account {
  padding: 0;

  .title-wrapper {
    display: flex;
    justify-content: space-between !important;
    width: 100%;
  }

  .content-ftp-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2rem;
  }
  .accounts-number-wrapper {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
  .greyText {
    color: var(--v-mainLighten52Color-base);
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

  .ftp-account-wrapper {
    max-height: 34rem;
    overflow: auto;
    @include setMacScrollbar('&');
  }

  .data-container {
    padding-bottom: 1.1rem;
    margin-bottom: 1.3rem;
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
