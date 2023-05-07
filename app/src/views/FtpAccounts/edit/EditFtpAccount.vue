<template>
  <div v-if="hasData" no-gutters id="ftp-account-edit">
    <content-header
      id="ftp-account_edit_header"
      className="d-flex flex-column"
      v-if="$vuetify.breakpoint.smAndUp"
      data-id="ftp-account-edit__header"
    >
      <template #breadcrumb>
        <mp-breadcrumb />
      </template>
      <template #title>
        <h1>{{ headerTitle }}</h1>
      </template>
      <template #actions-button>
        <div class="actions-wrapper">
          <mp-button
            :text="$t('action.cancel.base')"
            format="link"
            linkColor="black"
            dataId="ftp-account-cancel"
            @click.stop="cancel()"
          />
          <mp-button
            :text="$t('action.save')"
            format="success"
            icon="content-save-outline"
            dataId="ftp-account-submit"
            @click="submit()"
            :disabled="$v.$invalid"
          />
        </div>
      </template>
    </content-header>
    <v-row no-gutters class="fields-container">
      <v-col class="formFieldsContainer" :cols="$vuetify.breakpoint.lgAndUp ? 6 : 10" offset="1">
        <mp-textfield
          :label="$t('page.ftpAccounts.form.name')"
          v-model="form.name"
          dataId="ftp-account-name"
          @input="$v.form.name.$touch()"
          @blur="$v.form.name.$touch()"
          :errors="getModelErrors($v.form.name)"
          :isDirty="$v.form.name.$dirty"
        />

        <span class="regular-16 main-lighten-65">
          {{ $t('page.ftpAccounts.form.protocol') }}
        </span>
        <mp-radio-group
          row
          required
          dataId="ftp-account-protocol"
          v-model="form.protocol"
          :radioValues="protocolValues"
          :propsRadio="{
            class: 'shadow-hover',
          }"
        />

        <mp-textfield
          :label="$t('page.ftpAccounts.form.host')"
          v-model="form.host"
          dataId="ftp-account-host"
          @input="$v.form.host.$touch()"
          @blur="$v.form.host.$touch()"
          :errors="getModelErrors($v.form.host)"
          :isDirty="$v.form.host.$dirty"
        />

        <mp-textfield
          :label="$t('page.ftpAccounts.form.port')"
          v-model="form.port"
          dataId="ftp-account-port"
          type="number"
          @input="$v.form.port.$touch()"
          @blur="$v.form.port.$touch()"
          :errors="getModelErrors($v.form.port)"
          :isDirty="$v.form.port.$dirty"
        />

        <mp-textfield
          :label="$t('page.ftpAccounts.form.username')"
          v-model="form.username"
          dataId="ftp-account-username"
          @input="$v.form.username.$touch()"
          @blur="$v.form.username.$touch()"
          :errors="getModelErrors($v.form.username)"
          :isDirty="$v.form.username.$dirty"
        />

        <div class="auth-block">
          <mp-radio-group
            row
            required
            dataId="ftp-account-authenticationMethod"
            v-model="form.authenticationMethod"
            :radioValues="authenticationMethodValues"
            :propsRadio="{
              class: 'shadow-hover',
            }"
          />

          <mp-textfield
            v-if="form.authenticationMethod === 'PASSWORD'"
            :type="!showPassword ? 'password' : 'text'"
            :label="$t('page.ftpAccounts.form.password')"
            v-model="form.password"
            dataId="ftp-account-password"
            @input="$v.form.password.$touch()"
            @blur="$v.form.password.$touch()"
            :errors="getModelErrors($v.form.password)"
            :isDirty="$v.form.password.$dirty"
          >
            <template #afterIcon>
              <v-icon @click="showPassword = !showPassword">
                {{ !showPassword ? 'mdi-eye-off' : 'mdi-eye' }}
              </v-icon>
            </template>
          </mp-textfield>
          <mp-textarea
            v-if="form.authenticationMethod === 'SSH'"
            :label="$t('page.ftpAccounts.form.privateKey')"
            v-model="form.privateKey"
            dataId="ftp-account-privateKey"
            :rows="4"
            @input="$v.form.privateKey.$touch()"
            @blur="$v.form.privateKey.$touch()"
            :errors="getModelErrors($v.form.privateKey)"
            :isDirty="$v.form.privateKey.$dirty"
          />
        </div>

        <mp-textfield
          :label="$t('page.ftpAccounts.form.dirPath')"
          v-model="form.dirPath"
          dataId="ftp-account-dirPath"
          @input="$v.form.dirPath.$touch()"
          @blur="$v.form.dirPath.$touch()"
          :errors="getModelErrors($v.form.dirPath)"
          :isDirty="$v.form.dirPath.$dirty"
        />
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="10" offset="1">
        <mp-button
          :text="$t('page.ftpAccounts.testConnection')"
          format="secondary"
          linkColor="black"
          icon="cogs"
          dataId="ftp-account-test"
          @click="testConnection()"
          :disabled="$v.$invalid"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'
import { maxValue, minValue, required, requiredIf } from 'vuelidate/lib/validators'

import mpBreadcrumb from '@/components/breadcrumb/breadcrumb.vue'
import contentHeader from '@/components/contentHeader/contentHeader.vue'

import FtpAccountsService from '@/services/ftpAccounts/FtpAccountsService'
import FtpService from '@/services/ftp/FtpService'
import CarrierService from '@/services/carrier/CarrierService'
import RetailerService from '@/services/retailer/RetailerService'
import { SET_BREADCRUMBS_LABEL } from '@/store/mutation-types'
import { SnackBarType } from '@/store/types'
import { authorizationMixin, validationMixin } from '@/mixins'
import {
  AuthenticationMethod,
  FtpAccountCreate,
  FtpAccountEntity,
  FtpAccountUpdate,
  FtpProtocol,
} from '@/types'

export default mixins(validationMixin, authorizationMixin).extend({
  name: 'edit-ftp-accounts',
  components: {
    mpBreadcrumb,
    contentHeader,
  },
  data: () => ({
    ftpAccount: null as FtpAccountEntity | null,
    thirdPartyId: null as number | null,
    hasData: false,
    accountId: null as number | null,
    showPassword: false,
    partnerType: null as 'carrier' | 'retailer' | null,
    form: {
      name: undefined,
      host: undefined,
      protocol: FtpProtocol.SFTP,
      port: undefined,
      username: undefined,
      authenticationMethod: AuthenticationMethod.PASSWORD,
      dirPath: undefined,
      password: undefined,
      privateKey: undefined,
    } as {
      name?: string
      host?: string
      protocol: FtpProtocol
      port?: number
      username?: string
      authenticationMethod: AuthenticationMethod
      dirPath?: string
      password?: string
      privateKey?: string
    },
    protocolValues: [
      {
        label: FtpProtocol.SFTP.toUpperCase(),
        value: FtpProtocol.SFTP,
      },
      {
        label: FtpProtocol.FTP.toUpperCase(),
        value: FtpProtocol.FTP,
      },
    ],
  }),
  async mounted() {
    const partnerId = Number(this.$route.params.carrierId || this.$route.params.retailerId)
    const accountId = Number(this.$route.params.accountId)
    const partnerType = this.$route.params.carrierId ? 'carrier' : 'retailer'

    this.partnerType = partnerType

    if (accountId) {
      const oldAccount = await FtpAccountsService.get(partnerType, accountId)
      this.form.name = oldAccount?.name
      this.form.host = oldAccount?.host
      this.form.protocol = oldAccount!.protocol
      this.form.port = oldAccount?.port
      this.form.username = oldAccount?.username
      this.form.authenticationMethod = oldAccount!.authenticationMethod
      this.form.dirPath = oldAccount?.dirPath
      this.form.password = oldAccount?.password
      this.form.privateKey = oldAccount?.privateKey

      this.accountId = accountId
    }

    const [partner] =
      partnerType === 'carrier'
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

    this.thirdPartyId = partner.id
    this.hasData = true
  },
  validations() {
    return {
      form: {
        name: { required },
        host: { required },
        protocol: { required },
        port: { required, minValue: minValue(1), maxValue: maxValue(65535) },
        username: { required },
        dirPath: {
          required,
          absolutePath(): boolean {
            const regex = /^\/.*$/gi
            return (
              (this as any).form.dirPath !== undefined && regex.test((this as any).form.dirPath)
            )
          },
        },
        password: {
          required: requiredIf(function(this: any): boolean {
            return this.form.authenticationMethod === AuthenticationMethod.PASSWORD
          }),
        },
        privateKey: {
          required: requiredIf(function(this: any): boolean {
            return this.form.authenticationMethod === AuthenticationMethod.SSH
          }),
        },
        authenticationMethod: { required },
      },
    }
  },
  computed: {
    headerTitle(): string {
      return this.$t(`page.ftpAccounts.${this.accountId ? 'modifyTitle' : 'addTitle'}`)
    },
    authenticationMethodValues(): Array<{ label: string; value: string }> {
      const values = [
        {
          label: this.$t(`page.ftpAccounts.form.auth.${AuthenticationMethod.PASSWORD}`),
          value: AuthenticationMethod.PASSWORD,
        },
      ]

      if (this.form.protocol === FtpProtocol.SFTP) {
        values.push({
          label: this.$t(`page.ftpAccounts.form.auth.${AuthenticationMethod.SSH}`),
          value: AuthenticationMethod.SSH,
        })
      }

      return values
    },
  },
  methods: {
    cancel() {
      const { path } = this.$route
      this.$router.push(path.replace(/(\/\d+\/edit|\/add)$/gi, ''))
    },
    async submit(): Promise<void> {
      if (!this.thirdPartyId || !this.partnerType) {
        return
      }
      if (this.accountId) {
        return this.submitModify()
      }
      try {
        const { password, privateKey, ...account } = this.form

        await FtpAccountsService.create(this.partnerType, {
          ...account,
          thirdPartyId: this.thirdPartyId,
          ...(account.authenticationMethod === 'SSH' && { privateKey }),
          ...(account.authenticationMethod === 'PASSWORD' && { password }),
        } as FtpAccountCreate)
        this.cancel()
      } catch (e) {
        if (e.response?.status === 409) {
          this.$store.dispatch('setSnackbar', {
            type: SnackBarType.ERROR,
            message: this.$t(`page.ftpAccounts.alreadyExisting`),
          })
        }
        return
      }
    },
    async submitModify(): Promise<void> {
      if (!this.accountId || !this.partnerType) {
        return
      }
      try {
        const { password, privateKey, ...account } = this.form
        await FtpAccountsService.update(this.partnerType, this.accountId, {
          ...account,
          ...(this.partnerType === 'carrier' && { carrierId: this.thirdPartyId }),
          ...(this.partnerType === 'retailer' && { retailerId: this.thirdPartyId }),
          ...(account.authenticationMethod === 'SSH' && privateKey ? { privateKey } : {}),
          ...(account.authenticationMethod === 'PASSWORD' ? { password } : {}),
        } as FtpAccountUpdate)
      } catch (e) {
        if (e.response?.status === 409) {
          this.$store.dispatch('setSnackbar', {
            type: SnackBarType.ERROR,
            message: this.$t(`page.ftpAccounts.alreadyExisting`),
          })
        }
        return
      }
      this.cancel()
    },
    async testConnection(): Promise<void> {
      const { password, privateKey, ...account } = this.form
      const ftpAccount = {
        ...account,
        ...(account.authenticationMethod === 'SSH' && { privateKey }),
        ...(account.authenticationMethod === 'PASSWORD' && { password }),
      } as FtpAccountUpdate

      const { status, errors } = await FtpService.test(ftpAccount)

      this.$store.dispatch('setSnackbar', {
        type: status ? SnackBarType.SUCCESS : SnackBarType.ERROR,
        message: this.$t(
          `page.ftpAccounts.messages.${status ? 'successfulConnection' : 'failedConnection'}`,
          {
            ...(errors?.length && { messages: errors.join(', ') }),
          },
        ),
      })
    },
  },
})
</script>

<style lang="scss">
#ftp-account-edit {
  margin: 3rem 0;
  padding: 0;

  .fields-container {
    margin-bottom: 2.5rem;

    .auth-block {
      padding: 1rem;
      margin-bottom: 1.5rem;
      background-color: $main-lighten-80-color;
    }
  }

  .formFieldsContainer {
    display: flex;
    flex-direction: column;
    gap: 2.2rem;
  }
}
</style>
