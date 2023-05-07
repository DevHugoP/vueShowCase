<template>
  <div id="edit-permission">
    <content-header
      id="edit-permission__header"
      hasBoxShadow
      v-if="$vuetify.breakpoint.smAndUp"
      dataId="user-permission"
    >
      <template #breadcrumb>
        <mp-breadcrumb />
      </template>
      <template #title>
        <h1>{{ headerTitle }}</h1>
      </template>
    </content-header>

    <div class="create-user-permission-form">
      <permission-form
        :userId="$route.params.id"
        :permissionId="$route.params.permissionId || null"
        data-id="user-permission-form"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import contentHeader from '@/components/contentHeader/contentHeader.vue'
import mpBreadcrumb from '@/components/breadcrumb/breadcrumb.vue'
import permissionForm from '@/components/form/permissionForm/permissionForm.vue'

import UserService from '@/services/user/UserService'

import { ROUTES } from '@/constants'
import { SET_HEADER_TITLE, SET_BREADCRUMBS_LABEL } from '@/store/mutation-types'

export default Vue.extend({
  name: 'edit-permission',
  components: {
    contentHeader,
    mpBreadcrumb,
    permissionForm,
  },
  computed: {
    headerTitle() {
      return this.$store.getters.getHeaderTitle
    },
  },
  beforeMount() {
    this.setTitleAndBreadcrumb()
  },
  methods: {
    async setTitleAndBreadcrumb() {
      const {
        name,
        params: { id, permissionId },
      } = this.$route

      const userEntity = await UserService.get(id)
      const user = `${this.$t('action.modify.base')} ${UserService.getFullname(userEntity)}`

      const breadcrumbLabels: Record<string, string> = { user }

      if (permissionId && name === ROUTES.editPermission) {
        breadcrumbLabels.permission = this.$t('action.modify.permission')
      }

      this.$store.commit(
        SET_HEADER_TITLE,
        permissionId ? this.$t('action.modify.permission') : this.$t('action.add.permission'),
      )
      this.$store.commit(SET_BREADCRUMBS_LABEL, JSON.stringify(breadcrumbLabels))
    },
  },
})
</script>
