<template>
  <v-form ref="form" id="permission-form" v-model="validForm" :data-id="dataId">
    <div class="global-perm-form-wrapper">
      <v-row no-gutters class="mt-8 permission-form__contexts-wrapper">
        <v-col ref="titleMarginRef" cols="11" offset="1" class="mb-6">
          <h2>{{ $t('page.editPermission.contexts') }}</h2>
        </v-col>

        <v-col cols="12">
          <template v-if="$vuetify.breakpoint.xsOnly">
            <v-row
              no-gutters
              class="mb-12"
              :style="{
                marginLeft: `${offsetLeft}px`,
                maxWidth: `calc(100vw - ${offsetLeft}px)`,
              }"
            >
              <v-col cols="12">
                <mp-chips-wrapper
                  :dataId="`${dataId}-chipsWrapper`"
                  canAdd
                  :chips="contextsChips"
                  :maxChips="contextsChips.length"
                  @addChip="addContext()"
                  v-model="selectedChip"
                  @input="$event ? (selectedChipIndex = $event.index) : null"
                  valueProps="text"
                />
              </v-col>
            </v-row>
          </template>
          <v-col
            cols="11"
            offset="1"
            :class="$vuetify.breakpoint.xsOnly ? '' : 'mb-9'"
            v-for="(_context, index) in contexts"
            :key="index"
          >
            <v-row
              no-gutters
              align="baseline"
              v-if="$vuetify.breakpoint.xsOnly ? selectedChipIndex === index : contexts.length > 0"
            >
              <v-col cols="1" class="context-counter__wrapper" v-if="$vuetify.breakpoint.smAndUp">
                <v-avatar class="context-counter" size="2.6rem">
                  <span class="medium14">{{ index + 1 }}</span>
                </v-avatar>
              </v-col>
              <v-col
                :cols="$vuetify.breakpoint.xsOnly ? 11 : 3"
                :class="$vuetify.breakpoint.xsOnly ? 'mb-8' : 'mr-10'"
              >
                <mp-select
                  :label="`${$t('page.editPermission.subject')} *`"
                  v-model="contexts[index].subject"
                  :items="subjects"
                  @change="handleSubjectChange($event, index)"
                  cacheItems
                  clearable
                  :dataId="`${dataId}-subject`"
                  @input="$v.contexts[index].subject.$touch()"
                  @blur="$v.contexts[index].subject.$touch()"
                  :errors="getModelErrors($v.contexts[index].subject)"
                  :isDirty="$v.contexts[index].subject.$dirty"
                />
              </v-col>
              <v-col :cols="$vuetify.breakpoint.xsOnly ? 11 : 4">
                <template v-if="contexts[index].subject === ContextFormSubject.CARRIER">
                  <mp-select
                    :label="`${$t('page.editPermission.value')} *`"
                    v-model="contexts[index].value.carrierId"
                    :items="contexts[index].carrierItems"
                    :disabled="!contexts[index].carrierItems.length"
                    clearable
                    required
                    :dataId="`${dataId}-context_${index}-carrier`"
                    @input="$v.contexts[index].value.carrierId.$touch()"
                    @blur="$v.contexts[index].value.carrierId.$touch()"
                    :errors="getModelErrors($v.contexts[index].value.carrierId)"
                    :isDirty="$v.contexts[index].value.carrierId.$dirty"
                  />
                </template>
                <template v-else-if="contexts[index].subject === ContextFormSubject.RETAILER">
                  <mp-select
                    :label="`${$t('page.editPermission.value')} *`"
                    v-model="contexts[index].value.retailerId"
                    :items="contexts[index].retailerItems"
                    :disabled="!contexts[index].retailerItems.length"
                    clearable
                    required
                    :dataId="`${dataId}-context_${index}-retailer`"
                    @input="$v.contexts[index].value.retailerId.$touch()"
                    @blur="$v.contexts[index].value.retailerId.$touch()"
                    :errors="getModelErrors($v.contexts[index].value.retailerId)"
                    :isDirty="$v.contexts[index].value.retailerId.$dirty"
                  />
                </template>
                <template v-else-if="contexts[index].subject === ContextFormSubject.STORE">
                  <div class="d-flex flex-column">
                    <mp-select
                      :class="$vuetify.breakpoint.xsOnly ? 'mb-3' : ''"
                      :label="`${$t('common.retailer')} *`"
                      v-model="contexts[index].value.retailerId"
                      :items="contexts[index].retailerItems"
                      :disabled="!contexts[index].retailerItems.length"
                      @change="handleRetailerChange($event, index)"
                      clearable
                      required
                      :dataId="`${dataId}-context_${index}-retailer`"
                      @input="$v.contexts[index].value.retailerId.$touch()"
                      @blur="$v.contexts[index].value.retailerId.$touch()"
                      :errors="getModelErrors($v.contexts[index].value.retailerId)"
                      :isDirty="$v.contexts[index].value.retailerId.$dirty"
                    />
                    <mp-select
                      :label="`${$t('common.store')} *`"
                      v-model="contexts[index].value.storeIds"
                      :items="contexts[index].storeItems"
                      :disabled="!contexts[index].storeItems.length"
                      multiple
                      chips
                      smallChips
                      clearable
                      deletableChips
                      hideSelected
                      required
                      :dataId="`${dataId}-context_${index}-store`"
                      @input="$v.contexts[index].value.storeIds.$touch()"
                      @blur="$v.contexts[index].value.storeIds.$touch()"
                      :errors="getModelErrors($v.contexts[index].value.storeIds)"
                      :isDirty="$v.contexts[index].value.storeIds.$dirty"
                    />
                  </div>
                </template>
                <template v-else-if="contexts[index].subject === ContextFormSubject.EXCHANGE_PLACE">
                  <div class="d-flex flex-column">
                    <mp-select
                      :class="$vuetify.breakpoint.xsOnly ? 'mb-3' : ''"
                      :label="`${$t('common.retailer')} *`"
                      v-model="contexts[index].value.retailerId"
                      :items="contexts[index].retailerItems"
                      :disabled="!contexts[index].retailerItems.length"
                      @change="handleRetailerChange($event, index)"
                      clearable
                      required
                      :dataId="`${dataId}-context_${index}-retailer`"
                      @input="$v.contexts[index].value.retailerId.$touch()"
                      @blur="$v.contexts[index].value.retailerId.$touch()"
                      :errors="getModelErrors($v.contexts[index].value.retailerId)"
                      :isDirty="$v.contexts[index].value.retailerId.$dirty"
                    />
                    <mp-select
                      :label="`${$t('common.store')} *`"
                      v-model="contexts[index].value.storeIds"
                      :items="contexts[index].storeItems"
                      :disabled="!contexts[index].storeItems.length"
                      @change="handleStoreChange($event, index)"
                      clearable
                      required
                      :dataId="`${dataId}-context_${index}-store`"
                      @input="$v.contexts[index].value.storeIds.$touch()"
                      @blur="$v.contexts[index].value.storeIds.$touch()"
                      :errors="getModelErrors($v.contexts[index].value.storeIds)"
                      :isDirty="$v.contexts[index].value.storeIds.$dirty"
                    />
                    <mp-select
                      :label="`${$t('common.exchangePlace')} *`"
                      v-model="contexts[index].value.exchangePlaceIds"
                      :items="contexts[index].exchangePlaceItems"
                      :disabled="!contexts[index].exchangePlaceItems.length"
                      multiple
                      chips
                      smallChips
                      clearable
                      deletableChips
                      hideSelected
                      required
                      :dataId="`${dataId}-context_${index}-exchange-place`"
                      @input="$v.contexts[index].value.exchangePlaceIds.$touch()"
                      @blur="$v.contexts[index].value.exchangePlaceIds.$touch()"
                      :errors="getModelErrors($v.contexts[index].value.exchangePlaceIds)"
                      :isDirty="$v.contexts[index].value.exchangePlaceIds.$dirty"
                    />
                  </div>
                </template>
              </v-col>
              <v-col
                cols="1"
                v-if="$vuetify.breakpoint.smAndUp"
                class="remove-context-button__wrapper"
              >
                <v-btn
                  v-if="!userHasAlreadyAGlobalContext || index > 0"
                  icon
                  size="1.8rem"
                  @click="removeContext(index)"
                  class="remove-context-button"
                  :data-id="`${dataId}-removeContext`"
                >
                  <v-icon>mdi-close-circle</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-col>

          <v-row
            v-if="$vuetify.breakpoint.xsOnly && contexts.length > 0"
            no-gutters
            justify="center"
            class="delete-context-button__wrapper"
          >
            <mp-button
              class="delete-context-button"
              :text="$t('action.delete.context')"
              icon="trash-can-outline"
              format="secondary"
              :dataId="`${dataId}-removeContext`"
              @click="removeContext(selectedChipIndex)"
            />
          </v-row>
        </v-col>

        <v-col cols="11" offset="1" v-if="$vuetify.breakpoint.smAndUp">
          <mp-button
            format="secondary"
            :text="$t('action.add.context')"
            icon="plus"
            @click="addContext()"
            :dataId="`${dataId}-addContext`"
          />
        </v-col>
      </v-row>

      <v-row no-gutters class="permission-form__groups-wrapper mb-12">
        <v-col cols="11" offset="1" class="mb-6">
          <h2>
            {{ $t(`page.editPermission.groups${$vuetify.breakpoint.xsOnly ? '_light' : ''}`) }}
          </h2>
        </v-col>

        <v-col cols="11" offset="1" v-if="groups">
          <v-list class="pa-0">
            <v-list-item
              no-gutters
              v-for="(group, index) in groups.items"
              :key="group.id"
              :class="`pa-0${index + 1 === groups.items.length ? '' : ' mb-5'}`"
            >
              <v-checkbox
                class="regular16"
                :label="group.name"
                :input-value="group.value"
                hide-details
                @change="handleCheckboxChange($event, group.id)"
                :data-id="`${dataId}-rulesGroup_${group.id}`"
              />
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>

      <v-row
        v-if="$vuetify.breakpoint.xsOnly && isAuthorized('DELETE_PERMISSIONS')"
        no-gutters
        justify="center"
        class="permission-form__actions-wrapper pb-10"
      >
        <mp-button
          :text="$t('action.delete.permission')"
          icon="trash-can-outline"
          class="action-delete__button pl-0"
          format="link"
          linkColor="red"
          @click="showDeleteModal = true"
          :disabled="!noUserEditMode && !permissionId"
          :dataId="`${dataId}-deletePermission`"
        />
      </v-row>
      <v-row
        no-gutters
        class="permission-form__actions-wrapper"
        :justify="permissionId ? 'start' : 'end'"
        v-else
      >
        <template v-if="isAuthorized('DELETE_PERMISSIONS') && (permissionId || noUserEditMode)">
          <v-col cols="4" offset="1" class="action-delete__wrapper">
            <mp-button
              :disabled="isLastOwnPermission"
              @click="showDeleteModal = true"
              :text="$t('action.delete.permission')"
              icon="trash-can-outline"
              class="action-delete__button pl-0"
              format="link"
              linkColor="red"
              :dataId="`${dataId}-deletePermission`"
            />
          </v-col>
          <v-spacer />
        </template>
        <v-col cols="3" class="action-cancel__wrapper mr-2">
          <mp-button
            @click="cancel()"
            :text="$t('action.cancel.base')"
            class="action-cancel__button"
            format="link"
            linkColor="black"
            :dataId="`${dataId}-cancel`"
          />
        </v-col>
        <v-col cols="4" class="action-add__wrapper">
          <mp-button
            @click="submit()"
            :text="permissionId || noUserEditMode ? $t('action.save') : $t('action.add.base')"
            class="action-add__button"
            :icon="permissionId || noUserEditMode ? 'content-save-outline' : null"
            :disabled="!canSubmitForm"
            format="success"
            :dataId="`${dataId}-submit`"
          />
        </v-col>
      </v-row>
    </div>

    <v-row v-if="$vuetify.breakpoint.xsOnly" no-gutters>
      <v-col cols="12" class="action-mobile-wrapper">
        <mp-button
          class="action-mobile"
          format="sticky"
          stickyColor="yellow"
          :text="permissionId || noUserEditMode ? $t('action.save') : $t('action.add.base')"
          @click="submit()"
          :disabled="!canSubmitForm"
          :dataId="`${dataId}-submit`"
        />
      </v-col>
    </v-row>

    <mp-dialog-confirmation
      v-if="showDeleteModal"
      dataId="permission-form-modal-deletePermission"
      :textContent="$t('validation.confirmation.deletePermission')"
      @close="showDeleteModal = false"
      @submit="deletePermission()"
      color="error"
      :header="{ icon: 'mdi-trash-can-outline', isColorBackground: false, iconClose: 'mdi-close' }"
      :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
      :btnValidation="{ text: $t('action.delete.base'), format: 'error' }"
      :btnToColumn="$vuetify.breakpoint.xsOnly"
    />
  </v-form>
</template>

<script lang="ts">
import ExchangePlaceService from '@/services/exchangePlace/ExchangePlaceService'
import { mapGetters, mapMutations } from 'vuex'
import { required, requiredIf } from 'vuelidate/lib/validators'

import { Filters, RulesGroupEntity, RulesGroupLight, RulesKey, SelectItem } from '@/types'
import { ROUTES } from '@/constants'

import { SnackBarType } from '@/store/types'

import {
  SET_PERMISSION_GROUPS,
  SET_PERMISSION_GROUPS_ITEMS,
  SET_PERMISSION_CONTEXTS,
  SET_CONTEXT_RETAILERITEMS,
  SET_CONTEXT_STOREITEMS,
  SET_CONTEXT_VALUE,
  PUSH_PERMISSION_GROUPS_ID,
  REMOVE_PERMISSION_GROUPS_ID,
  PUSH_PERMISSION,
  REMOVE_PERMISSION,
  SET_CONTEXT_CARRIERITEMS,
  SET_CONTEXT_EXCHANGEPLACEITEMS,
} from '@/store/modules/user/mutation-types'
import {
  ContextFormSubject,
  ContextForm,
  GroupsForm,
  getDefaultContextForm,
  getDefaultGroupsForm,
} from '@/store/modules/user/types'

import CarrierService from '@/services/carrier/CarrierService'
import RetailerService from '@/services/retailer/RetailerService'
import RulesGroupService from '@/services/rulesGroup/RulesGroupService'
import StoreService from '@/services/store/StoreService'
import UserService from '@/services/user/UserService'
import UserMapper from '@/services/user/UserMapper'
import DashboardService from '@/services/dashboard/DashboardService'

import mixins from 'vue-typed-mixins'
import { authorizationMixin, validationMixin } from '@/mixins'

export default mixins(validationMixin, authorizationMixin).extend({
  name: 'permission-form',
  props: {
    dashboardId: {
      type: String,
      default: null,
    },
    userId: {
      type: String,
      default: null,
    },
    permissionId: {
      type: String,
      default: null,
    },
    dataId: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    ContextFormSubject: ContextFormSubject as typeof ContextFormSubject,
    subjects: [] as SelectItem[],
    exchangePlaces: [] as Filters[],
    stores: [] as Filters[],
    retailers: [] as Filters[],
    carriers: [] as Filters[],
    rulesGroups: [] as RulesGroupEntity[],
    validForm: false,
    selectedChipIndex: 0,
    selectedChip: null as Record<string, any> | null,
    offsetLeft: 0,
    noUserEditMode: false,
    showDeleteModal: false,
    userHasAlreadyAGlobalContext: false,
  }),
  validations() {
    const contextsRules = this.contexts?.reduce(
      (acc, { subject }, i) => ({
        ...acc,
        [i]: {
          subject: { required },
          value: {
            carrierId: { required: requiredIf(() => subject === ContextFormSubject.CARRIER) },
            retailerId: {
              required: requiredIf(
                (): boolean =>
                  subject === ContextFormSubject.RETAILER ||
                  subject === ContextFormSubject.STORE ||
                  subject === ContextFormSubject.EXCHANGE_PLACE,
              ),
            },
            storeIds: {
              required: requiredIf(
                (): boolean =>
                  subject === ContextFormSubject.STORE ||
                  subject === ContextFormSubject.EXCHANGE_PLACE,
              ),
            },
            exchangePlaceIds: {
              required: requiredIf((): boolean => subject === ContextFormSubject.EXCHANGE_PLACE),
            },
          },
        },
      }),
      {},
    )
    return { contexts: contextsRules }
  },
  computed: {
    ...mapGetters({
      currentUser: 'auth/currentUser',
      permissionBeingEditedIndex: 'user/permissionBeingEditedIndex',
      contexts: 'user/permissionContexts',
      groups: 'user/permissionGroups',
      permission: 'user/permission',
    }),

    canSubmitForm(): boolean {
      const isContextValid =
        !this.userHasAlreadyAGlobalContext &&
        this.contexts.length === 1 &&
        this.contexts[0].subject === ''
          ? true
          : !this.$v.contexts.$invalid

      return isContextValid && this.groups && this.groups.ids.length > 0
    },
    getRule(): RulesKey {
      return this.$route.params.permissionId ? 'EDIT_PERMISSIONS' : 'CREATE_PERMISSIONS'
    },
    isLastOwnPermission(): boolean {
      const { permissions, id } = this.currentUser

      return this.userId === id && permissions.length === 1
    },
    contextsChips(): Array<Record<string, any>> {
      return this.contexts.map((context: ContextForm, index: number) => {
        return {
          ...context,
          text: `${this.$t('page.editPermission.context')} ${index + 1}`,
          index,
        }
      })
    },
  },
  async beforeMount() {
    await this.initData()
  },
  updated(this: any) {
    this.offsetLeft = this.$refs.titleMarginRef.offsetLeft
    const el = this.$el.getElementsByClassName('chip-active')[0]

    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  },
  methods: {
    ...mapMutations('user', {
      setPermissionGroups: SET_PERMISSION_GROUPS,
      setPermissionGroupsItems: SET_PERMISSION_GROUPS_ITEMS,
      setPermissionContexts: SET_PERMISSION_CONTEXTS,
      setContextRetailerItems: SET_CONTEXT_RETAILERITEMS,
      setContextCarrierItems: SET_CONTEXT_CARRIERITEMS,
      setContextStoreItems: SET_CONTEXT_STOREITEMS,
      setContextExchangePlaceItems: SET_CONTEXT_EXCHANGEPLACEITEMS,
      setContextValue: SET_CONTEXT_VALUE,
      pushPermissionGroupsId: PUSH_PERMISSION_GROUPS_ID,
      removePermissionGroupsId: REMOVE_PERMISSION_GROUPS_ID,
      pushPermission: PUSH_PERMISSION,
      removePermission: REMOVE_PERMISSION,
    }),
    async initData() {
      this.subjects = [
        {
          value: ContextFormSubject.RETAILER,
          text: this.$t('common.retailer'),
        },
        {
          value: ContextFormSubject.STORE,
          text: this.$t('common.store'),
        },
        {
          value: ContextFormSubject.EXCHANGE_PLACE,
          text: this.$t('common.exchangePlace'),
        },
        {
          value: ContextFormSubject.CARRIER,
          text: this.$t('common.carrier'),
        },
      ]

      const [retailers, carriers, rulesGroup] = await Promise.all([
        RetailerService.getFilters({ forRule: this.getRule }),
        CarrierService.getFilters({ forRule: this.getRule }),
        RulesGroupService.getAll(),
      ])
      this.retailers = retailers
      this.carriers = carriers
      this.rulesGroups = rulesGroup

      let groupsForm: GroupsForm = {
        items: [],
        ids: [],
      }
      let groupsItems: Array<RulesGroupLight & { value: boolean }> = []
      let contexts: ContextForm[] = []

      if (this.userId && this.permissionId) {
        try {
          const permission = await UserService.getPermission(this.userId, this.permissionId)
          const rulesGroupIds = permission.rulesGroups.map(({ id: rulesGroupId }) => rulesGroupId)

          groupsForm = UserMapper.fromPermissionEntityToGroupsForm(permission)
          groupsItems = UserMapper.fromRulesGroupToRulesGroupForm(this.rulesGroups, rulesGroupIds)
          contexts = await UserMapper.fromPermissionEntityToContextsForm(
            permission,
            this.getSelectItems(this.retailers),
            this.getSelectItems(this.carriers),
          )
        } catch (e) {
          if (e.response?.status === 403) {
            return this.$router.push({ name: ROUTES.noAccess })
          }
          if (e.response?.status === 404) {
            return this.$router.push({ name: ROUTES.notFound })
          }
        }
      } else if (this.userId && !this.permissionId) {
        groupsForm = getDefaultGroupsForm()
        groupsItems = UserMapper.fromRulesGroupToRulesGroupForm(this.rulesGroups)
        contexts = [getDefaultContextForm()]
      } else if (this.contexts.length && this.groups.ids.length) {
        this.noUserEditMode = true

        return
      } else if (this.dashboardId && this.permissionId) {
        const permission = await DashboardService.getPermission(this.dashboardId, this.permissionId)
        const rulesGroupIds = permission.rulesGroups.map(({ id: rulesGroupId }) => rulesGroupId)

        groupsForm = UserMapper.fromPermissionEntityToGroupsForm(permission)
        groupsItems = UserMapper.fromRulesGroupToRulesGroupForm(this.rulesGroups, rulesGroupIds)
        contexts = await UserMapper.fromPermissionEntityToContextsForm(
          permission,
          this.getSelectItems(this.retailers),
          this.getSelectItems(this.carriers),
        )
      } else {
        groupsForm = {
          ...getDefaultGroupsForm(),
          ...this.groups,
        }
        groupsItems = UserMapper.fromRulesGroupToRulesGroupForm(this.rulesGroups)
        contexts = this.contexts.length > 0 ? this.contexts : [getDefaultContextForm()]
      }

      this.setPermissionGroups(groupsForm)
      this.setPermissionGroupsItems(groupsItems)
      this.setPermissionContexts(contexts)

      const userPermissions = await UserService.getPermissions(this.userId)

      userPermissions.forEach(permission => {
        if (!permission.contexts.length) {
          this.userHasAlreadyAGlobalContext = true
        }
      })
    },
    getSelectItems(entity: any) {
      return entity.length
        ? entity.map(({ id, name }: any) => ({
            value: id,
            text: name,
          }))
        : []
    },
    handleSubjectChange(subject: string | undefined, index: number) {
      this.setContextValue({
        index,
        value: {
          carrierId: null,
          retailerId: null,
          storeIds: [],
          exchangePlaceIds: [],
        },
      })
      this.setContextCarrierItems({ index, value: this.getSelectItems(this.carriers) })
      this.setContextStoreItems({ index, value: [] })
      this.setContextExchangePlaceItems({ index, value: [] })
      this.setContextRetailerItems({ index, value: this.getSelectItems(this.retailers) })
    },
    async handleRetailerChange(retailerId: number, index: number) {
      if (retailerId) {
        this.stores = await StoreService.getFilters({ forRule: this.getRule, retailerId })
      }

      this.contexts[index].value.storeIds = undefined
      this.contexts[index].value.exchangePlaceIds = undefined
      this.setContextStoreItems({
        index,
        value: retailerId ? this.getSelectItems(this.stores) : [],
      })
      this.setContextExchangePlaceItems({
        index,
        value: [],
      })

      this.$nextTick(() => this.$v.contexts[index]!.value.storeIds.$reset())
      this.$nextTick(() => this.$v.contexts[index]!.value.exchangePlaceIds.$reset())
    },
    async handleStoreChange(storeId: number, index: number) {
      if (storeId) {
        this.exchangePlaces = await ExchangePlaceService.getFilters({
          forRule: this.getRule,
          storeId,
        })
      }

      this.contexts[index].value.exchangePlaceIds = undefined
      this.setContextExchangePlaceItems({
        index,
        value: storeId ? this.getSelectItems(this.exchangePlaces) : [],
      })

      this.$nextTick(() => this.$v.contexts[index]!.value.exchangePlaceIds.$reset())
    },
    handleCheckboxChange(value: boolean, rulesGroupId: string) {
      if (value) {
        this.pushPermissionGroupsId(rulesGroupId)
      } else {
        this.removePermissionGroupsId(rulesGroupId)
      }
    },
    addContext() {
      this.setPermissionContexts([...this.contexts, getDefaultContextForm()])

      if (this.$vuetify.breakpoint.xsOnly) {
        this.selectedChipIndex = this.contexts.length - 1
      }
    },
    removeContext(index: number) {
      const contexts = this.contexts

      this.setPermissionContexts(
        contexts.slice(0, index).concat(contexts.slice(index + 1, contexts.length)),
      )

      if (this.$vuetify.breakpoint.xsOnly) {
        this.selectedChipIndex = this.contexts.length - 1
      }
    },
    cancel() {
      this.setPermissionContexts([])
      this.setPermissionGroups({
        ids: [],
        items: [],
      })

      if (!this.userId && !this.permissionId) {
        this.$emit('cancel')
      } else {
        this.$router.go(-1)
      }
    },
    async submit() {
      try {
        const { contexts, groups } = this
        let message = this.$t('messages.permissionAdded')

        if (!groups) {
          return
        }

        const payload = UserMapper.fromPermissionFormToPermissionPayload({ contexts, groups })

        if (this.userId && this.permissionId) {
          await UserService.editPermission(this.userId, this.permissionId, payload)
          message = this.$t('messages.permissionUpdated')
        } else if (this.userId && !this.permissionId) {
          await UserService.addPermission(this.userId, payload)
        } else if (this.dashboardId && this.permissionId) {
          await DashboardService.editPermission(this.dashboardId, this.permissionId, payload)
          message = this.$t('messages.permissionUpdated')
        } else if (this.dashboardId && !this.permissionId) {
          await DashboardService.addPermission(this.dashboardId, payload)
        } else {
          this.$emit(this.noUserEditMode ? 'edit' : 'submit', this.permissionBeingEditedIndex)

          return
        }

        this.$store.dispatch('auth/fetchUserData')
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.SUCCESS,
          message,
        })
      } catch (e) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      } finally {
        if (this.userId) {
          this.$router.push({ name: ROUTES.detailUser, params: { id: this.userId } })
        } else if (this.dashboardId) {
          this.$router.push({ name: ROUTES.shareDashboard, params: { id: this.dashboardId } })
        }
      }
    },
    async deletePermission() {
      this.showDeleteModal = false

      try {
        if (this.permissionId && this.userId) {
          await UserService.deletePermission(this.userId, this.permissionId)
          this.$router.push({ name: ROUTES.detailUser, params: { id: this.userId } })
        }
        if (this.permissionId && this.dashboardId) {
          await DashboardService.deletePermission(this.dashboardId, this.permissionId)
          this.$router.push({ name: ROUTES.shareDashboard, params: { id: this.dashboardId } })
        } else if (this.noUserEditMode) {
          this.removePermission(this.permissionBeingEditedIndex)
          this.$emit('delete')
        }

        this.$store.dispatch('auth/fetchUserData')

        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.SUCCESS,
          message: this.$t('messages.permissionDeleted'),
        })
      } catch (e) {
        this.$router.go(-1)
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      }
    },
  },
})
</script>

<style lang="scss">
#permission-form {
  .global-perm-form-wrapper {
    @media #{map-get($display-breakpoints, 'xs-only')} {
      min-height: calc(100vh - 5.4rem - 6rem);
      max-height: calc(100vh - 5.4rem - 6rem);
      overflow: scroll !important;
    }

    .permission-form__contexts-wrapper {
      .context-counter__wrapper {
        max-width: fit-content;
        margin-right: 2.6rem;

        .context-counter {
          background-color: $main-color;

          span {
            color: $white;
          }
        }
      }

      .remove-context-button__wrapper {
        .remove-context-button {
          color: $main-color;
        }
      }

      @media #{map-get($display-breakpoints, 'xs-only')} {
        .delete-context-button__wrapper {
          margin-top: 5rem;

          .delete-context-button {
            height: 4rem;
          }
        }
      }
    }

    .permission-form__groups-wrapper {
      margin-top: 7rem;

      .v-list {
        @media #{map-get($display-breakpoints, 'xs-only')} {
          padding-bottom: 5rem;
        }

        .v-list-item {
          min-height: fit-content;

          .v-input--checkbox {
            .v-input__slot {
              margin-bottom: 0;

              label {
                color: $main-color;
              }

              .v-input--selection-controls__ripple {
                color: $success-color !important;
                caret-color: $success-color !important;
              }

              .v-icon {
                &.mdi-checkbox-marked {
                  color: $success-color !important;
                }

                &.mdi-checkbox-blank-outline {
                  color: $main-color !important;
                }
              }
            }
          }
        }
      }
    }

    .permission-form__actions-wrapper {
      .action-cancel__wrapper {
        max-width: fit-content;
      }

      @media #{map-get($display-breakpoints, 'xs-only')} {
        margin-bottom: 5rem;
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
</style>
