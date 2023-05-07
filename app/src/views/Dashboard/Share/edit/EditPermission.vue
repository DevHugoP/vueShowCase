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
        :dashboardId="$route.params.id"
        :permissionId="$route.params.permissionId || null"
        data-id="user-permission-form"
        @cancel="cancel()"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import contentHeader from '@/components/contentHeader/contentHeader.vue'
import mpBreadcrumb from '@/components/breadcrumb/breadcrumb.vue'
import permissionForm from '@/components/form/permissionForm/permissionForm.vue'

import { ROUTES } from '@/constants'
import { SET_HEADER_TITLE, SET_BREADCRUMBS_LABEL } from '@/store/mutation-types'

export default Vue.extend({
  name: 'edit-permission-dashboard',
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
    cancel() {
      this.$router.go(-1)
    },
    async setTitleAndBreadcrumb() {
      const {
        name,
        params: { permissionId },
      } = this.$route

      const breadcrumbLabels: Record<string, string> = {}
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
