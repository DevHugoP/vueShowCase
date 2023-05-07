<template>
  <div id="create-user" v-if="hasLoaded">
    <content-header
      id="create-user__header"
      v-if="$vuetify.breakpoint.smAndUp"
      data-id="user-create"
    >
      <template #breadcrumb>
        <mp-breadcrumb />
      </template>
      <template #title>
        <h1 v-if="profile">{{ $t('breadcrumbs.editProfile') }}</h1>
        <h1 v-else>{{ $route.params.id ? $t('breadcrumbs.editUser') : headerTitle }}</h1>
      </template>
    </content-header>

    <div v-if="userForm">
      <v-row no-gutters class="create-user-splits mt-5 mb-auto">
        <v-col :cols="$vuetify.breakpoint.xsOnly ? 10 : 5" offset="1" class="split-left">
          <v-row
            no-gutters
            :class="`fields__wrapper${$vuetify.breakpoint.smAndUp ? ' mt-9' : ''}`"
          >
            <v-col cols="12" class="mb-4">
              <mp-switch
                :disabled="profile"
                v-model="user.active"
                :labels="[$t('common.active'), $t('common.inactive')]"
                required
              />
            </v-col>

            <v-col cols="12" class="mb-4">
              <mp-switch
                :disabled="
                  !edit || !(isAuthorized('TOGGLE_LOCAL_ACCOUNT') && localAccountAllowed)
                "
                v-model="user.local"
                :labels="[$t('page.user.local'), $t('page.user.local')]"
                required
              />
            </v-col>

            <v-col cols="12" class="mb-4">
              <mp-select
                :label="`${$t('page.user.language')} *`"
                v-model="user.language"
                :items="languagesNames"
                itemText="value"
                itemValue="key"
                @input="$v.user.language.$touch()"
                @blur="$v.user.language.$touch()"
                attach="#user-create-form-language-switch-select"
                dropdownId="user-create-form-language-switch-select"
                dataId="user-create-form-language"
                :isDirty="$v.user.language.$dirty"
                :errors="getModelErrors($v.user.language)"
              />
            </v-col>

            <v-col cols="12" class="mb-4">
              <mp-textfield
                name="lastname"
                :label="`${$t('common.name')} *`"
                dataId="user-create-form-lastname"
                v-model="user.lastname"
                @input="$v.user.lastname.$touch()"
                @blur="$v.user.lastname.$touch()"
                :errors="getModelErrors($v.user.lastname)"
                :isDirty="$v.user.lastname.$dirty"
              />
            </v-col>

            <v-col cols="12" class="mb-4">
              <mp-textfield
                name="firstname"
                :label="`${$t('common.firstname')} *`"
                dataId="user-create-form-firstname"
                v-model="user.firstname"
                @input="$v.user.firstname.$touch()"
                @blur="$v.user.firstname.$touch()"
                :errors="getModelErrors($v.user.firstname)"
                :isDirty="$v.user.firstname.$dirty"
              />
            </v-col>

            <v-col cols="12" class="mb-4">
              <mp-textfield
                name="email"
                :label="`${$t('common.email')} *`"
                dataId="user-create-form-email"
                v-model="user.email"
                @input="$v.user.email.$touch()"
                @blur="$v.user.email.$touch()"
                :errors="getModelErrors($v.user.email)"
                :isDirty="$v.user.email.$dirty"
              />
            </v-col>

            <v-col cols="12" class="mb-4" v-if="!edit">
              <mp-checkbox-new
                :label="$t('page.user.sendEmail')"
                :input-value="user.sendEmail"
                dataId="user-create-form-send-email"
                @change="handleChangeSendEmail"
              />
            </v-col>

            <v-col cols="12" class="mb-4" v-if="edit">
              <mp-textfield
                name="password"
                type="password"
                :label="$t('common.password')"
                dataId="user-create-form-password"
                v-model="user.password"
                @input="$v.user.password.$touch()"
                @blur="$v.user.password.$touch()"
                :errors="getModelErrors($v.user.password)"
                :isDirty="$v.user.password.$dirty"
              />
            </v-col>

            <v-col cols="12" class="mb-4" v-if="edit">
              <mp-textfield
                name="passwordConfirmation"
                type="password"
                :label="$t('common.passwordConfirmation')"
                dataId="user-create-form-password-confirm"
                v-model="user.passwordConfirmation"
                @input="$v.user.passwordConfirmation.$touch()"
                @blur="$v.user.passwordConfirmation.$touch()"
                :errors="getModelErrors($v.user.passwordConfirmation)"
                :isDirty="$v.user.passwordConfirmation.$dirty"
              />
            </v-col>
          </v-row>
        </v-col>
        <v-col
          v-if="!edit"
          :cols="$vuetify.breakpoint.xsOnly ? 10 : 5"
          :offset="$vuetify.breakpoint.xsOnly ? 1 : null"
          :class="
            `split-right d-flex flex-column${
              $vuetify.breakpoint.xsOnly ? ' align-center' : ' pl-10'
            }`
          "
        >
          <v-row no-gutters class="permissions__wrapper">
            <v-col
              cols="12"
              v-for="(permission, index) in permissions"
              :key="`permission_${index}`"
            >
              <permission-card
                :permission="fromPermissionFormToPermissionEntity(permission)"
                :retailers="getAllRetailers()"
                :carriers="getAllCarriers()"
                :index="index + 1"
                @clickEdit="handleClickEdit(index)"
                dataId="user-create-permission"
              />
            </v-col>
          </v-row>

          <v-row no-gutters class="d-flex justify-end">
            <mp-button
              :text="$t('action.add.permission')"
              format="secondary"
              icon="plus"
              @click="userForm = false"
              dataId="user-create-addPermission"
            />
          </v-row>
        </v-col>
      </v-row>

      <v-row v-if="$vuetify.breakpoint.xsOnly" no-gutters class="mt-auto">
        <v-col cols="12" class="action-mobile-wrapper">
          <mp-button
            class="action-mobile"
            format="sticky"
            stickyColor="yellow"
            :text="$t('action.save')"
            :disabled="$v.user.$invalid"
            @click="submit()"
            dataId="user-create-form-save"
          />
        </v-col>
      </v-row>

      <v-row no-gutters class="create-user-actions mt-10 pb-10" v-else>
        <v-col cols="10" offset-sm="1" class="d-flex justify-end">
          <mp-button
            :text="$t('action.cancel.base')"
            format="link"
            linkColor="black"
            @click="cancel()"
            dataId="user-create-form-cancel"
          />
          <mp-button
            :text="$t('action.save')"
            format="success"
            :disabled="$v.user.$invalid"
            @click="submit()"
            dataId="user-create-form-save"
          />
        </v-col>
      </v-row>
    </div>
    <div v-else class="create-user-permission-form">
      <permission-form
        @submit="submitPermissionForm()"
        @edit="editPermissionForm($event)"
        @cancel="cancelPermissionForm()"
        @delete="cancelPermissionForm()"
        dataId="user-create-form"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { dateHelperGetUtcDate } from '@/helpers/dateHelper'
import { AVAILABLE_LANGUAGES, TRANSLATED_LANGUAGES } from '@/plugins/i18n'
import { UserProvider } from '@/types'
import mixins from 'vue-typed-mixins'
import { mapGetters, mapMutations } from 'vuex'

import contentHeader from '@/components/contentHeader/contentHeader.vue'
import mpBreadcrumb from '@/components/breadcrumb/breadcrumb.vue'
import permissionCard from '@/components/permissionCard/permissionCard.vue'
import permissionForm from '@/components/form/permissionForm/permissionForm.vue'

import { SET_BREADCRUMBS_LABEL, SET_HEADER_TITLE } from '@/store/mutation-types'
import { PermissionFormData } from '@/store/modules/user/types'
import {
  PUSH_PERMISSION,
  RESET,
  SET_PERMISSION_BEING_EDITED_INDEX,
  SET_PERMISSION_CONTEXTS,
  SET_PERMISSION_GROUPS,
  SET_PERMISSION_GROUPS_ITEMS,
  SET_PERMISSIONS,
  SET_BASIC_USER_INFOS,
} from '@/store/modules/user/mutation-types'

import { LOCAL_ACCOUNT_ALLOWED, ROUTES } from '@/constants'

import UserMapper from '@/services/user/UserMapper'
import UserService from '@/services/user/UserService'
import { SnackBarType } from '@/store/types'

import { validationMixin, authorizationMixin } from '@/mixins'
import { required, email, minLength, sameAs } from 'vuelidate/lib/validators'

export default mixins(validationMixin, authorizationMixin).extend({
  name: 'create-user',
  components: {
    contentHeader,
    mpBreadcrumb,
    permissionCard,
    permissionForm,
  },
  data: () => ({
    userForm: true,
    hasLoaded: false,
    fromPath: ROUTES.users,
    userProviders: [] as UserProvider[],
  }),
  validations() {
    return {
      user: {
        local: { required },
        language: { required },
        firstname: { required },
        lastname: { required },
        email: { required, email },
        password: {
          containsNumber: (value: string) => {
            return this.edit && value ? /[0-9]/.test(value) : true
          },
          containsSpecial: (value: string) => {
            return this.edit && value ? /[#?!@$%^&*-/]/.test(value) : true
          },
          containsUppercase: (value: string) => {
            return this.edit && value ? /[A-Z]/.test(value) : true
          },
          minLength: minLength(this.edit && this.user.password ? 10 : 0),
        },
        passwordConfirmation: {
          sameAsPassword: sameAs('password'),
        },
      },
    }
  },
  beforeRouteEnter(to, from, next) {
    const { path } = from

    next((vm: any) => {
      vm.fromPath = path
    })
  },
  computed: {
    ...mapGetters({
      headerTitle: 'getHeaderTitle',
      user: 'user/user',
      permissions: 'user/permissions',
      rulesGroups: 'rulesGroups/rulesGroups',
      currentUser: 'auth/currentUser',
    }),
    edit(): boolean {
      return this.$route.name === ROUTES.editUser || this.$route.name === ROUTES.editProfile
    },
    profile(): boolean {
      return this.$route.name === ROUTES.editProfile
    },
    languagesNames() {
      return AVAILABLE_LANGUAGES.map((language: string) => ({
          key: language,
          value: TRANSLATED_LANGUAGES[language] || '',
      }))
    },
    countries() {
      return AVAILABLE_LANGUAGES
    },
    localAccountAllowed(): boolean {
      if (this.userProviders) {
        return !!LOCAL_ACCOUNT_ALLOWED.filter(localProvider =>
          this.userProviders.find(
            ({ provider }: { provider: string }) => provider === localProvider,
          ),
        ).length
      }

      return false
    },
  },
  beforeMount() {
    this.$store.dispatch('retailer/fetchAllRetailers')
    this.$store.dispatch('carrier/fetchAllCarriers')
    this.$store.dispatch('rulesGroups/fetchAllRulesGroups')
  },
  async mounted() {
    const { id } = this.$route.params

    try {
      if (id) {
        const user = await UserService.get(id)

        this.$store.commit(`user/${SET_BASIC_USER_INFOS}`, {
          ...UserMapper.formatUser(user),
          password: '',
          passwordConfirmation: '',
        })
        this.userProviders = user.providers ?? []
        const fullname = `${UserService.getFullname(user)}`
        this.$store.commit(SET_BREADCRUMBS_LABEL, JSON.stringify({ user: fullname }))
      } else {
        if (this.profile) {
          this.userProviders = this.currentUser.providers || []
          this.$store.commit(`user/${SET_BASIC_USER_INFOS}`, {
            ...UserMapper.formatUser(this.currentUser),
            password: '',
            passwordConfirmation: '',
          })
        }
        this.$store.commit(SET_HEADER_TITLE, this.$t('action.add.user'))
      }
      this.hasLoaded = true
    } catch (e) {
      if (e.response?.status === 403) {
        return this.$router.push({ name: ROUTES.noAccess })
      }
      if (e.response?.status === 404) {
        return this.$router.push({ name: ROUTES.notFound })
      }
    }
  },
  beforeDestroy() {
    this.setPermissionGroups({ items: [], ids: [] })
    this.setPermissionContexts([])
    this.setPermissions([])

    this.$store.commit(`user/${SET_BASIC_USER_INFOS}`, UserService.buildDefaultUserFormData())
  },
  methods: {
    ...mapMutations('user', {
      setPermissionBeingEditedIndex: SET_PERMISSION_BEING_EDITED_INDEX,
      setPermissionGroups: SET_PERMISSION_GROUPS,
      setPermissionGroupsItems: SET_PERMISSION_GROUPS_ITEMS,
      setPermissionContexts: SET_PERMISSION_CONTEXTS,
      setPermissions: SET_PERMISSIONS,
      pushPermission: PUSH_PERMISSION,
      reset: RESET,
    }),
    fromPermissionFormToPermissionEntity(value: PermissionFormData) {
      return UserMapper.fromPermissionFormToPermissionEntity(value)
    },
    changeLanguage(language: string) {
      this.user.language = language
    },
    handleChangeSendEmail(sendEmail: boolean) {
      this.user.sendEmail = sendEmail
    },
    submitPermissionForm() {
      this.pushPermission()

      this.userForm = true

      this.setPermissionGroups({ items: [], ids: [] })
      this.setPermissionContexts([])
    },
    editPermissionForm() {
      this.userForm = true

      this.setPermissionGroups({ items: [], ids: [] })
      this.setPermissionContexts([])
    },
    cancelPermissionForm() {
      this.userForm = true

      this.setPermissionGroups({ items: [], ids: [] })
      this.setPermissionContexts([])
    },
    handleClickEdit(index: number) {
      const {
        groups,
        groups: { ids },
        contexts,
      }: PermissionFormData = this.permissions[index]

      this.setPermissionBeingEditedIndex(index)
      this.setPermissionGroups(groups)
      this.setPermissionGroupsItems(
        UserMapper.fromRulesGroupToRulesGroupForm(this.rulesGroups, ids),
      )
      this.setPermissionContexts(contexts)

      this.userForm = false
    },
    cancel() {
      this.reset()
      this.$router.push({ path: this.fromPath })
    },
    goBack(id: string) {
      if (this.profile) {
        return this.$router.push({ name: ROUTES.profile })
      }

      return this.$router.push({ name: ROUTES.detailUser, params: { id } })
    },
    async submit() {
      const { id: userId } = this.$route.params
      if (this.$v.user.$invalid) {
        return
      }

      const cleanUser = UserMapper.cleanUserUpdate(this.user)

      try {
        if (userId) {
          await UserService.patch(userId, cleanUser)

          this.$store.dispatch('setSnackbar', {
            type: SnackBarType.SUCCESS,
            message: this.$t('messages.userUpdated'),
          })

          this.reset()
          this.goBack(userId)
        } else {
          if (this.profile) {
            await UserService.updateCurrent(cleanUser)
            // This force update of i18n system to allow the use of this.$t in methods and computeds
            this.$root.$i18n.i18nLoadedAt = dateHelperGetUtcDate().toString()

            await this.$store.dispatch('auth/fetchUserData')
            this.$store.dispatch('setSnackbar', {
              type: SnackBarType.SUCCESS,
              message: this.$t('messages.userUpdated'),
            })

            return this.$router.push({ name: ROUTES.profile })
          }
          const { id } = await UserService.create(cleanUser)

          for (const { contexts, groups } of this.permissions) {
            if (!contexts.length || !groups) {
              continue
            }

            const payload = UserMapper.fromPermissionFormToPermissionPayload({ contexts, groups })
            await UserService.addPermission(id, payload)
          }

          this.$store.dispatch('setSnackbar', {
            type: SnackBarType.SUCCESS,
            message: this.$t('messages.userCreated'),
          })

          return this.$router.push({ name: ROUTES.detailUser, params: { id } })
        }
      } catch (e) {
        let message = this.$t('messages.error')

        if (e.response?.status === 409) {
          message = this.$t('messages.userAlreadyExists')
        }

        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message,
          timeout: 4000,
          clearable: true,
        })
        this.cancel()
      }
    },
    getAllRetailers() {
      return this.$store.getters['retailer/retailers']
    },
    getAllCarriers() {
      return this.$store.getters['carrier/carriers']
    },
  },
})
</script>

<style lang="scss">
#create-user {
  .action-mobile-wrapper {
    .action-mobile {
      width: 100%;
      min-height: 6rem;
    }
  }

  #create-user__header {
    box-shadow: $box-shadow-active;
  }

  .create-user-splits {
    @media #{map-get($display-breakpoints, 'xs-only')} {
      min-height: calc(100vh - 5.4rem - 6rem - 2rem);
      max-height: calc(100vh - 5.4rem - 2rem);
      overflow: scroll !important;
    }

    .split-left {
      .avatar__wrapper {
        .v-avatar {
          h2 {
            color: $white;
          }
        }

        .col {
          max-width: fit-content;
        }
      }

      .mp-switch {
        .v-input__slot {
          margin: 0;
        }

        .v-messages {
          display: none;
        }
      }
    }

    .split-right {
      @media #{map-get($display-breakpoints, 'xs-only')} {
        .permissions__wrapper {
          width: 100%;
        }
      }
    }
  }
}
</style>
