<template>
  <div id="users" data-id="user-list">
    <content-header
      id="users__header"
      className="d-flex flex-column"
      v-if="$vuetify.breakpoint.smAndUp && isAuthorized('CREATE_USERS')"
      dataId="user-list"
    >
      <template #breadcrumb>
        <mp-breadcrumb />
      </template>
      <template #title>
        <h1>{{ $t('page.users.title') }}</h1>
      </template>
      <template #actions-button v-if="isAuthorized('CREATE_USERS')">
        <div class="users-list-actions-wrapper">
          <v-menu
            bottom
            offset-y
            origin="center top"
            transition="scale-transition"
          >
            <template v-slot:activator="{ on, attrs }">
              <mp-button
                v-bind="attrs"
                v-on="on"
                dataId="users-actions"
                format="link"
                linkColor="black"
                :text="$t('action.base')"
                icon="apps"
                class="actionButton"
              />
            </template>
            <v-list>
              <v-list-item
                link
                :to="{ name: ROUTES.addUser }"
                dataId="user-list-addUser"
              >
                <v-list-item-icon>
                  <v-icon v-text="'mdi-account'" />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="$t('action.add.user')" />
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                @click="showFileModal = true"
                dataId="user-list-addUsers"
              >
                <v-list-item-icon>
                  <v-icon v-text="'mdi-account-group'" />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="$t('action.add.users')" />
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </template>
    </content-header>

    <users-filters id="user-list-filter" @submit="getAllUsers(defaultFilters)" @reset="getAllUsers()" />

    <v-row no-gutters id="users-content" v-if="users.length">
      <v-col
        cols="12"
        sm="10"
        offset="0"
        offset-sm="1"
        class="mb-5 pt-2"
      >
        <mp-data-table
          id="user-list-data-table"
          :items="users"
          :headers="headers"
          :totalItems="count"
          :pageLabel="$t('common.page')"
          :footer-props="{ itemsPerPageOptions: [10, 25, 100] }"
          @update:options="onOptionsUpdated"
          :to="
            isAuthorized('READ_USERS')
              ? {
                name: ROUTES.detailUser,
                paramKey: 'id',
                objectKey: 'id',
                toExclude: ['actions'],
              }
              : {
                toExclude: [],
              }
          "
          :isCustomMobile="$vuetify.breakpoint.xsOnly"
        >
          <template v-slot:lastname="{ item }">
            <div class="d-flex align-center" :class="item.active ? '' : 'main-lighten-52'">
              <div>
                <v-avatar class="initials">
                  <h2>{{ getInitials(item) }}</h2>
                </v-avatar>
              </div>

              <div class="d-flex flex-column ml-6" v-if="item.lastname && item.firstname">
                <div class="d-flex">
                  <h3>{{ `${item.lastname.toUpperCase()} ${item.firstname}` }}</h3>
                </div>

                <div>
                  <span class="regular14 main-lighten-52">{{ item.email }}</span>
                </div>
              </div>
              <div v-else class="ml-6">
                <span class="regular14 main-lighten-52">{{ item.email }}</span>
              </div>
            </div>
          </template>

          <template v-slot:context="{ item }">
            <div
              v-if="[...getRetailerNames(item), ...getCarrierNames(item)].length"
              :class="item.active ? '' : 'main-lighten-52'"
            >
              <div
                v-for="(context, index) in [...getRetailerNames(item), ...getCarrierNames(item)]"
                :key="`user-${item.id}-context-${index}`"
              >
                <span class="regular14">{{ context }}</span>
              </div>
            </div>
            <span v-else>-</span>
          </template>

          <template v-slot:groups="{ item, groups }">
            <div v-if="groups.length" :class="item.active ? '' : 'main-lighten-52'">
              <div v-for="(group, index) in groups" :key="`user-${item.id}-context-${index}`">
                <span class="medium14">{{ group }}</span>
              </div>
            </div>
            <span v-else>-</span>
          </template>

          <template v-slot:lastConnection="{ item }">
            <span
              class="medium14"
              v-if="item.lastConnection"
              :class="item.active ? '' : 'main-lighten-52'"
            >
              {{
                item.lastConnection
                  ? formatLastConnection(item.lastConnection)
                  : $t('page.users.dataTable.noConnection')
              }}
            </span>
            <span v-else>-</span>
          </template>

          <template v-slot:active="{ active, item }">
            <span class="regular14 main-lighten-28">
              <mp-badge
                :color="getColor(item)"
                :data-id="`user-list-${item.id}-status`"
                :content="active ? $t('common.active') : $t(`common.inactive`)"
              >
              </mp-badge>
            </span>
          </template>

          <template v-slot:actions="{ item }">
            <v-menu
              bottom
              left
              offset-y
              origin="center top"
              transition="scale-transition"
              v-if="getActions(item).length"
            >
              <template v-slot:activator="{ on }">
                <v-icon v-on="on">mdi-dots-vertical</v-icon>
              </template>
              <v-list>
                <v-list-item
                  v-for="(action, index) in getActions(item)"
                  :key="`user-${item.id}-action-${index}`"
                  @click="handleActionsClick(action.type, item)"
                >
                  <v-list-item-icon>
                    <v-icon v-text="action.icon" />
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-text="action.text" />
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>

          <template v-slot:mobile="{ item, to }">
            <div class="mobile-wrapper">
              <div class="content-wrapper">
                <router-link :to="to" class="d-flex align-center justify-space-between">
                  <div class="text-wrapper" :class="item.active ? '' : 'main-lighten-52'">
                    <div
                      class="d-flex align-left mb-1 flex-column"
                      v-if="item.lastname && item.firstname"
                    >
                      <span class="medium16 text-left ellipsis">
                        {{ `${item.lastname.toUpperCase()} ${item.firstname}` }}
                      </span>
                    </div>
                    <div class="d-flex align-left mb-1 flex-column" v-else>
                      <span class="medium16 text-left ellipsis">
                        {{ item.email }}
                      </span>
                    </div>

                    <div
                      class="d-flex justify-space-between align-left flex-column"
                      v-if="[...getRetailerNames(item), ...getCarrierNames(item)]"
                    >
                      <span class="regular14 retailers ellipsis">
                        {{ getConcatRetailerNames(item) }}
                      </span>
                      <span class="regular14 carriers ellipsis">
                        {{ getConcatCarrierNames(item) }}
                      </span>
                    </div>
                  </div>

                  <div class="d-flex align-right mb-1 flex-column">
                    <span class="regular14 main-lighten-28 mr-4">
                      <mp-badge
                        :color="getColor(item)"
                        :data-id="`user-list-${item.id}-status`"
                        :content="item.active ? $t('common.active') : $t(`common.inactive`)"
                      >
                      </mp-badge>
                    </span>
                  </div>
                </router-link>
              </div>
            </div>
          </template>
        </mp-data-table>
      </v-col>
    </v-row>

    <no-data id="users-no-data" v-if="users && !users.length && hasLoaded" dataId="user-list-noData" />

    <v-row v-if="$vuetify.breakpoint.xsOnly && isAuthorized('CREATE_USERS')" no-gutters>
      <v-col cols="12" class="action-mobile-wrapper">
        <mp-button
          id="create-user-mobile-btn"
          class="action-mobile"
          format="sticky"
          stickyColor="yellow"
          :text="$t('action.add.user')"
          :to="{ name: ROUTES.addUser }"
          dataId="user-list-addUser"
        />
      </v-col>
    </v-row>

    <v-row v-if="showFileModal">
      <v-col cols="12">
        <mp-dialog-confirmation
          persistent
          classWrapper="users-add-file-dialog"
          dataId="user-modal-add-file"
          @close="resetFile()"
          @submit="parseFile()"
          color="primary"
          :header="{
            icon: 'mdi-account-group',
            text: $t('action.add.users'),
            textPolice: 'h4',
            isColorBackground: true,
            iconClose: 'mdi-close',
          }"
          :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
          :btnValidation="{
            text: $t('action.save'),
            format: 'success',
            loading: loadFile,
            disabled: !file,
          }"
        >
          <template #content>
            <v-col class="mt-10" cols="10" offset="1">
              <mp-input-file
                showSize
                counter
                v-model="file"
                accept=".csv"
                appendIcon="mdi-paperclip"
                dataId="status-mapping-form-file"
                :label="$t('page.users.usersFile.import')"
              />
            </v-col>
            <v-col
              class="centerDownloadBtn mb-10 d-flex justify-end"
              cols="10"
              offset="1"
            >
              <a
                data-id="add-users-file-download-example"
                @click="downloadExample()"
                class="download-example regular14"
              >
                <v-icon size="1.6rem" class="mr-1 download-icon">mdi-file-download</v-icon>
                <span>{{ $t('page.retailerDetail.catalogs.modal.example') }}</span>
              </a>
            </v-col>
            <v-col class="mb-10" cols="10" offset="1">
              <mp-checkbox-new
                :label="$t('page.users.usersFile.sendEmails')"
                :input-value="sendEmails"
                dataId="user-create-form-send-emails"
                @change="handleChangeSendEmails"
              />
            </v-col>
          </template>
        </mp-dialog-confirmation>
      </v-col>
    </v-row>

    <v-row v-if="showEnableModal">
      <v-col cols="12">
        <mp-dialog-confirmation
          dataId="user-modal-enable"
          :textContent="userSelected.active ? $t('action.user.disable') : $t('action.user.enable')"
          @close="showEnableModal = false"
          @submit="toggleUser()"
          color="error"
          :header="{
            icon: 'mdi-exclamation-thick',
            isColorBackground: false,
            iconClose: 'mdi-close',
          }"
          :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
          :btnValidation="{
            text: userSelected.active ? $t('action.disable.base') : $t('action.enable.base'),
            format: 'error',
          }"
          :btnToColumn="$vuetify.breakpoint.xsOnly"
        />
      </v-col>
    </v-row>

    <url-modal
      v-if="showResetLink && resetUrl && isAuthorized('SHOW_USER_RESET_TOKEN')"
      :showDialog="showResetLink"
      :url="resetUrl"
      @close="confirmUserResetUrl()"
      dataId="user-detail-reset-password-link"
    />
  </div>
</template>

<script lang="ts">
import mpBreadcrumb from '@/components/breadcrumb/breadcrumb.vue'
import urlModal from '@/components/urlModal/urlModal.vue'
import Config from '@/config/Config'
import { SET_SHOW_LOADER } from '@/store/mutation-types'
import FileDownload from 'js-file-download'
import Papa from 'papaparse'
import mixins from 'vue-typed-mixins'

import contentHeader from '@/components/contentHeader/contentHeader.vue'
import filtersPanel from '@/components/filtersPanel/filtersPanel.vue'
import noData from '@/components/noData/noData.vue'

import { ROUTES, USER_LIST_ACTIONS_TYPE } from '@/constants'
import { dateHelper, dateHelperGetTimezonedDate, OperationUnit } from '@/helpers/dateHelper'
import { authorizationMixin } from '@/mixins'

import UserMapper from '@/services/user/UserMapper'
import UserService from '@/services/user/UserService'
import { SnackBarType } from '@/store/types'
import { CarrierEntity, RetailerEntity, BadgeColor, UserEntity, DataTableHeader } from '@/types'

import { mapGetters, mapMutations } from 'vuex'
import usersFilters from './usersFilters/usersFilters.vue'

const HEADERS = ['firstname', 'lastname', 'email', 'language', 'role', 'retailerCode', 'storeId']

export default mixins(authorizationMixin).extend({
  name: 'users',
  components: {
    contentHeader,
    mpBreadcrumb,
    filtersPanel,
    noData,
    usersFilters,
    urlModal,
  },
  data: () => ({
    ROUTES,
    users: [] as UserEntity[],
    userSelected: null as UserEntity | null,
    showEnableModal: false,
    showFileModal: false,
    file: null as File | null,
    loadFile: false,
    sendEmails: false,
    hasLoaded: false,
    headers: [] as DataTableHeader[],
    count: 0,
    pagination: {
      offset: 0,
      limit: 10,
    },
    order: {
      sortBy: 'lastname',
      sort: 'ASC',
    },
    defaultFilters: {
      offset: 0,
    },
    showResetLink: false,
    resetUrl: '',
  }),
  updated() {
    const scrollSection = this.users.length ? document.getElementById('users-content') : document.getElementById('users-no-data')
    const header = document.getElementsByTagName('header')
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    const userFilters = document.getElementById('user-list-filter')
    const button = document.getElementById('create-user-mobile-btn')

    if (scrollSection && header && userFilters && button) {
      const newHeight = vh - header[0].clientHeight - userFilters.clientHeight - button.clientHeight
      scrollSection.style.height = `${newHeight}px`
    }
  },
  async beforeMount() {
    await Promise.all([this.getRetailers(), this.getCarriers()])

    this.headers = [
      { text: this.$t('common.name'), value: 'lastname', align: 'left', sortable: true },
      {
        text: this.$t('common.context'),
        value: 'context',
        align: 'left',
        sortable: false,
        width: '15%',
      },
      {
        text: this.$t('common.rulesGroup'),
        value: 'groups',
        align: 'left',
        sortable: false,
        width: '15%',
      },
      {
        text: this.$t('common.lastConnection'),
        value: 'lastConnection',
        align: 'left',
        sortable: false,
        width: '15%',
      },
      {
        text: this.$t('common.state'),
        value: 'active',
        align: 'left',
        sortable: true,
        width: '10%',
      },
      { text: '', value: 'actions', sortable: false, width: '5%' },
    ]
  },
  computed: {
    ...mapGetters({
      currentUser: 'auth/currentUser',
      allRetailers: 'retailer/retailers',
      allCarriers: 'carrier/carriers',
      filters: 'filters/filters',
    }),
  },
  methods: {
    ...mapMutations({
      setShowLoader: SET_SHOW_LOADER,
    }),
    async getAllUsers(params = {} as Record<string, any>) {
      const defaultParams = { count: true }
      const { users, count } = await UserService.getAll({
        ...defaultParams,
        ...this.filters,
        ...this.pagination,
        ...this.order,
        ...params,
      })

      this.users = users.map(user => UserMapper.formatUser(user))
      this.count = count
      this.hasLoaded = true
    },
    getRetailers() {
      if (this.isAuthorized('READ_RETAILERS')) {
        this.$store.dispatch('retailer/fetchAllRetailers')
      }
    },
    getCarriers() {
      if (this.isAuthorized('READ_CARRIERS')) {
        this.$store.dispatch('carrier/fetchAllCarriers')
      }
    },
    getInitials(user: UserEntity) {
      return UserService.getInitials(user)
    },
    getConcatRetailerNames(user: UserEntity) {
      return this.getRetailerNames(user).join(', ')
    },
    getConcatCarrierNames(user: UserEntity) {
      return this.getCarrierNames(user).join(', ')
    },
    getRetailerNames(user: UserEntity) {
      const { retailerIds } = user

      const retailerNames = []

      if (retailerIds?.length) {
        const filteredRetailers: RetailerEntity[] = this.allRetailers.filter(
            ({ id }: RetailerEntity) => retailerIds.includes(id),
        )

        for (const retailer of filteredRetailers) {
          retailerNames.push(retailer.name)
        }

        return retailerNames
      }
      return []
    },
    getCarrierNames(user: UserEntity) {
      const { carrierIds } = user

      const carrierNames = []

      if (carrierIds?.length) {
        const filteredCarriers: CarrierEntity[] = this.allCarriers.filter(({ id }: CarrierEntity) =>
            carrierIds.includes(id),
        )

        for (const carrier of filteredCarriers) {
          carrierNames.push(carrier.name)
        }

        return carrierNames
      }
      return []
    },
    hasGoogleProvider(user: UserEntity): boolean {
      return !!user.providers?.find(({ provider }) => provider === 'google')
    },
    getActions(user: UserEntity) {
      const actions = []
      if (!user.lastConnection && this.isAuthorized('INVITE_USERS') && !user.external) {
        actions.push({
          icon: 'mdi-email',
          text: this.$t('action.user.sendInvite'),
          type: USER_LIST_ACTIONS_TYPE.SEND_INVITE,
        })
      }

      if (this.isAuthorized('EDIT_USERS') && this.currentUser.id !== user.id) {
        actions.push({
          icon: user.active ? 'mdi-account-off' : 'mdi-account',
          text: user.active ? this.$t('page.users.disable') : this.$t('page.users.enable'),
          type: USER_LIST_ACTIONS_TYPE.TOGGLE_USER,
        })
      }
      if (this.isAuthorized('EDIT_USERS') && (!user.external || this.hasGoogleProvider(user))) {
        actions.push({
          icon: 'mdi-lock',
          text: this.$t('action.user.modify'),
          type: USER_LIST_ACTIONS_TYPE.EDIT_USERS,
        })
      }

      return actions
    },
    handleActionsClick(type: string, user: UserEntity) {
      switch (type) {
        case USER_LIST_ACTIONS_TYPE.EDIT_USERS:
          this.$router.push({ name: ROUTES.editUser, params: { id: user.id } })
          break
        case USER_LIST_ACTIONS_TYPE.SEND_INVITE:
          this.inviteUser(user)
          this.$store.dispatch('setSnackbar', {
            type: SnackBarType.SUCCESS,
            message: this.$t('messages.userInviteSend'),
          })
          break
        case USER_LIST_ACTIONS_TYPE.TOGGLE_USER:
          this.userSelected = user
          this.showEnableModal = true
          break
      }
    },
    async toggleUser() {
      try {
        if (this.userSelected) {
          await UserService.patch(this.userSelected.id, { active: !this.userSelected.active })
          this.getAllUsers()
        }
      } catch (err) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      } finally {
        this.showEnableModal = false
      }
    },
    confirmUserResetUrl() {
      this.showResetLink = false
    },
    async inviteUser(user: UserEntity) {
      try {
        const token = await UserService.inviteUser(user.id)

        if (this.isAuthorized('SHOW_USER_RESET_TOKEN')) {
          this.resetUrl = `${Config.get(
            'VUE_APP_FRONT_BASE_URL',
          )}/login?token=${token}${user.language && `&language=${user.language}`}`
          this.$nextTick(() => {
            this.showResetLink = true
          })
        }
      } catch (e) {
        return
      }
    },
    getColor(user: UserEntity) {
      let color: string = BadgeColor.ORANGE
      if (user.active) {
        color = BadgeColor.GREEN
      }
      return color
    },
    onOptionsUpdated(options: Record<string, any>) {
      const {
        page,
        itemsPerPage,
        sortBy: [sortBy],
        sortDesc: [sortDesc],
      } = options

      this.pagination.limit = itemsPerPage > 0 ? itemsPerPage : null
      this.pagination.offset = itemsPerPage * (page - 1)
      ;(this.order.sortBy = sortBy ?? 'lastname'), (this.order.sort = sortDesc ? 'DESC' : 'ASC')

      this.getAllUsers()
    },
    formatLastConnection(date: string) {
      const oldDate = dateHelperGetTimezonedDate(date)
      const currentDate = dateHelperGetTimezonedDate()
      const minutes = dateHelper.diff(oldDate, currentDate, OperationUnit.MINUTES)
      const hours = dateHelper.diff(oldDate, currentDate, OperationUnit.HOURS)
      const days = dateHelper.diff(oldDate, currentDate, OperationUnit.DAYS)
      const months = dateHelper.diff(oldDate, currentDate, OperationUnit.MONTHS)
      const years = dateHelper.diff(oldDate, currentDate, OperationUnit.YEARS)

      if (minutes < 60) {
        return this.$t('common.timeAgo.minutes', { minutes })
      } else if (hours < 24) {
        return this.$t('common.timeAgo.hours', { hours })
      } else if (days < 30) {
        return this.$t('common.timeAgo.days', { days })
      } else if (months < 12) {
        return this.$t('common.timeAgo.months', { months })
      } else if (years > 0) {
        return this.$t('common.timeAgo.years', { years })
      }
      return dateHelper.formatToTimezone(dateHelperGetTimezonedDate(date), 'UTC', 'P p')
    },
    handleChangeSendEmails(sendEmails: boolean) {
      this.sendEmails = sendEmails
    },
    downloadExample() {
      const rows = [
        HEADERS,
        ['Jeanne', 'Testeuse', 'jeanne@test.fr', 'fr', 'Consultant', 'lmmp-enseigne', 'LMMPMAG'],
      ]

      const csvContent = rows.map(e => e.join(',')).join('\n')

      FileDownload(csvContent, 'example.csv')
    },
    resetFile() {
      this.file = null
      this.showFileModal = false
    },
    async parseFile() {
      if (!this.file) {
        this.showFileModal = false
        return
      }

      this.loadFile = true

      await Papa.parse(this.file, {
        header: true,
        skipEmptyLines: true,
        delimitersToGuess: [',', ';', '|'],
        transformHeader: (header, index: number) => {
          return HEADERS[index] || header
        },
        // with file papaparse return undefined
        complete: async result => {
          const isError =
              result.data.length > 450 ||
              result.data.some(
                  (fileData: any) =>
                      !fileData.firstname ||
                      !fileData.lastname ||
                      !fileData.email ||
                      !fileData.language ||
                      !fileData.retailerCode,
              )

          if (isError) {
            this.$store.dispatch('setSnackbar', {
              type: SnackBarType.ERROR,
              message: this.$t('messages.invalidFile'),
            })
            this.showFileModal = false
            this.file = null
            this.loadFile = false

            return
          }

          const newUsers = result.data.map((fileData: any) => ({
            firstname: fileData.firstname,
            lastname: fileData.lastname,
            email: fileData.email,
            language: fileData.language,
            active: true,
            sendEmail: this.sendEmails,
            role: fileData.role,
            retailerCode: fileData.retailerCode,
            ...(fileData.storeId && { storeId: fileData.storeId })
          }))

          try {
            await UserService.createMany(newUsers)

            this.$store.dispatch('setSnackbar', {
              type: SnackBarType.SUCCESS,
              message: this.$t('messages.userCreated'),
            })
          } catch (error) {
            this.$store.dispatch('setSnackbar', {
              type: SnackBarType.ERROR,
              message: this.$t('messages.error'),
            })
          }

          this.showFileModal = false
          this.file = null
          this.loadFile = false
        },
      })
    },
  },
})
</script>


<style lang="scss">
#users {
  .main-header__actions {
    .actions-wrapper {
      @media #{map-get($display-breakpoints, 'sm-only')} {
        flex-direction: column-reverse;

        button {
          margin-right: 0 !important;
          margin-top: 1rem;
        }
      }

      @media #{map-get($display-breakpoints, 'md-only')} {
        flex-direction: column-reverse;

        button {
          margin-right: 0 !important;
          margin-top: 1rem;
        }
      }
    }
  }

  #users-content {
    @media #{map-get($display-breakpoints, 'xs-only')} {
      overflow: scroll !important;
    }
  }

  .user-row__wrapper {
    &:hover {
      background-color: $main-lighten-80-color;
    }
  }

  @media #{map-get($display-breakpoints, 'sm-and-up')} {
    .v-avatar {
      height: 6.6rem !important;
      width: 6.6rem !important;
    }
  }

  .v-data-table__wrapper {
    @media #{map-get($display-breakpoints, 'xs-only')} {
      margin-top: 2rem;

      .initials {
        min-width: 4rem !important;
        color: $white !important;
      }

      .mobile-wrapper {
        display: flex;
        min-width: 100%;
        justify-content: space-between;
        align-items: center;
        padding-left: 4%;
        padding-right: 4%;
        min-height: 6rem;
        max-height: 6rem;
        max-width: 100vw;

        .content-wrapper {
          word-break: break-all;
          padding-bottom: 1rem;
          padding-top: 1rem;
          min-width: 100%;

          .text-wrapper {
            max-width: calc(100vw - 35%);
            padding-left: 1rem;
          }

          .ellipsis {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          a {
            text-decoration: none;
          }

          .table-title {
            min-width: fit-content;
            margin-right: 1rem;
          }
        }

        .icon-wrapper {
          display: flex;
          justify-content: center;
          max-height: 2.4rem;
          margin-left: 1rem;

          .mdi-apps {
            &::after {
              display: none;
            }
          }
        }
      }
    }

    .pointer {
      min-height: 9rem;
      height: 9rem;

      a {
        text-decoration: none;
      }
    }
  }

  .v-data-footer {
    @media #{map-get($display-breakpoints, 'xs-only')} {
      .v-data-footer__select {
        display: none;
      }

      .v-data-footer__pagination {
        margin-left: auto;
      }
    }
  }

  .action-mobile-wrapper {
    .action-mobile {
      width: 100%;
      min-height: 6rem;
    }
  }
}

.users-add-file-dialog {
  .main-dialog-content {
    .centerDownloadBtn {
      display: flex;
      justify-content: center;

      .download-icon {
        color: $main-color;
      }

      .download-example {
        span {
          vertical-align: middle;
        }
        &:hover {
          span {
            text-decoration: underline;
          }
        }
      }
    }
  }
}
</style>
