<template>
  <div v-if="hasData" no-gutters>
    <content-header
      id="ftp-account__header"
      className="d-flex flex-column"
      v-if="$vuetify.breakpoint.smAndUp"
      data-id="ftp-account"
    >
      <template #breadcrumb>
        <mp-breadcrumb />
      </template>
      <template #title>
        <h1>{{ $t(`page.ftpAccounts.title`) }}</h1>
      </template>
      <template #actions-button v-if="isAuthorized('WRITE_CARRIER_FTP')">
        <v-row no-gutters class="mt-4 pb-6">
          <v-col cols="12" class="d-flex justify-end">
            <mp-button
              :text="$t('action.add.base')"
              format="primary"
              icon="plus"
              dataId="ftp-account-add"
              @click="goToEdit()"
            />
          </v-col>
        </v-row>
      </template>
    </content-header>
    <v-row no-gutters>
      <v-col cols="10" offset="1">
        <mp-data-table
          id="ftp-account-list"
          :items="ftpAccounts"
          :headers="getHeaders"
          :itemsPerPage="-1"
          :footer-props="null"
          :pageLabel="$t('common.page')"
        >
          <template v-slot:authenticationMethod="{ item }">
            {{ $t(`page.ftpAccounts.form.auth.${item.authenticationMethod}`) }}
          </template>
          <template v-slot:actions="{ item }">
            <v-menu
              bottom
              left
              offset-y
              origin="center top"
              transition="scale-transition"
              v-if="menuItem"
            >
              <template
                v-if="isAuthorized('WRITE_CARRIER_FTP' || 'WRITE_RETAILER_FTP')"
                v-slot:activator="{ on }"
              >
                <v-icon v-on="on" :data-id="`ftp-account-menu-${item.id}`">
                  mdi-dots-vertical
                </v-icon>
              </template>

              <v-list>
                <v-list-item
                  :data-id="`ftp-account-item-${item.id}-${action.type}`"
                  v-for="(action, index) in menuItem"
                  :key="`ftp-account-action-${index}`"
                  @click="handleActionsClick(action.type, item.id)"
                  :class="
                    `fab-actions${index === 0 ? ' first' : ''}${
                      index === menuItem.length - 1 ? ' last' : ''
                    }`
                  "
                >
                  <v-list-item-icon>
                    <v-icon v-text="action.icon"></v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-text="action.text"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </mp-data-table>
      </v-col>
    </v-row>

    <mp-dialog-confirmation
      v-if="displayDeleteAccount && modalProps && modalProps.ftpAccount"
      classWrapper="delete-account-modal"
      dataId="delete-account-modal"
      color="primary"
      :header="{
        iconClose: 'mdi-close',
        icon: $vuetify.breakpoint.smAndUp ? 'mdi-exclamation-thick' : '',
        isColorBackground: true,
      }"
      :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
      :btnValidation="{
        text: $t(`action.delete.base`),
        format: 'error',
        icon: 'content-save',
      }"
      @close="closeModal"
      :textContent="$t(`page.ftpAccounts.deleteAccount`)"
      @submit="() => deleteAccount(modalProps.ftpAccount.id)"
    />
  </div>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'

import mpBreadcrumb from '@/components/breadcrumb/breadcrumb.vue'
import contentHeader from '@/components/contentHeader/contentHeader.vue'

import FtpAccountsService from '@/services/ftpAccounts/FtpAccountsService'
import CarrierService from '@/services/carrier/CarrierService'
import { SET_BREADCRUMBS_LABEL } from '@/store/mutation-types'
import { SnackBarType } from '@/store/types'
import { authorizationMixin, validationMixin } from '@/mixins'
import { FtpAccountEntity } from '@/types'
import { ROUTES } from '@/constants'
import RetailerService from '@/services/retailer/RetailerService'

const HEADERS = [
  'name',
  'protocol',
  'host',
  'port',
  'username',
  'authenticationMethod',
  'dirPath',
  'actions',
]

export default mixins(validationMixin, authorizationMixin).extend({
  name: 'ftp-accounts',
  components: {
    mpBreadcrumb,
    contentHeader,
  },
  data: () => ({
    ftpAccounts: [] as FtpAccountEntity[],
    hasData: false,
    menuItem: [] as Array<{ icon: string; text: string; type: string }>,
    displayDeleteAccount: false,
    modalProps: null as { ftpAccount?: FtpAccountEntity } | null,
    partnerType: null as 'carrier' | 'retailer' | null,
  }),
  async mounted() {
    this.partnerType = this.$route.params.carrierId ? 'carrier' : 'retailer'

    const partnerId = Number(this.$route.params.carrierId || this.$route.params.retailerId)

    const [partner] =
      this.partnerType === 'carrier'
        ? await CarrierService.getFilters({
            ids: partnerId,
            forRule: 'LIST_CARRIER_FTP',
          })
        : await RetailerService.getFilters({
            id: partnerId,
            forRule: 'LIST_RETAILER_FTP',
          })

    this.$store.commit(
      SET_BREADCRUMBS_LABEL,
      JSON.stringify({
        carriers: partner.name,
        retailers: partner.name,
      }),
    )

    this.menuItem = [
      {
        text: this.$t('action.modify.base'),
        icon: 'mdi-pencil',
        type: 'MODIFY_FTP_ACCOUNT',
      },
      {
        text: this.$t('action.delete.base'),
        icon: 'mdi-trash-can-outline',
        type: 'DELETE_FTP_ACCOUNT',
      },
    ]

    try {
      this.ftpAccounts = await FtpAccountsService.getAll({
        thirdPartyId: partnerId,
        type: this.partnerType,
      })
    } catch (error) {
      this.ftpAccounts = []
    }

    this.hasData = true
  },
  computed: {
    getHeaders() {
      return HEADERS.map(header => ({
        text: header === 'actions' ? '' : this.$t(`page.ftpAccounts.table.${header}`),
        value: header,
        sortable: false,
      }))
    },
  },
  methods: {
    closeModal(): void {
      this.displayDeleteAccount = false
      this.modalProps = null
    },
    async deleteAccount(id: number): Promise<void> {
      if (!this.partnerType) {
        this.closeModal()
        return
      }

      try {
        await FtpAccountsService.delete(this.partnerType, id)
        this.ftpAccounts = this.ftpAccounts.filter(({ id: accountId }) => id !== accountId)
      } catch (err) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t(`page.ftpAccounts.messages.failedRemoval`),
          timeout: 2000,
        })
      }
      this.closeModal()
    },
    goToEdit() {
      this.$router.push({
        name:
          this.partnerType === 'carrier'
            ? ROUTES.addCarrierFtpAccounts
            : ROUTES.addRetailerFtpAccounts,
        params: {
          carrierId: this.$route.params.carrierId,
          retailerId: this.$route.params.retailerId,
        },
      })
    },
    handleActionsClick(actionType: string, accountId: number): void {
      switch (actionType) {
        case 'DELETE_FTP_ACCOUNT': {
          this.displayDeleteAccount = true
          this.modalProps = { ftpAccount: this.ftpAccounts.find(({ id }) => id === accountId) }
          break
        }

        case 'MODIFY_FTP_ACCOUNT': {
          this.$router.push({
            name:
              this.partnerType === 'carrier'
                ? ROUTES.editCarrierFtpAccounts
                : ROUTES.editRetailerFtpAccounts,
            params: {
              carrierId: this.$route.params.carrierId,
              retailerId: this.$route.params.retailerId,
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
#ftp-account-list {
  margin: 3rem 0;
  padding: 0;

  .disable-display-input {
    input {
      display: none;
    }
  }
}
</style>
