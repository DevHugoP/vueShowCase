<template>
  <div id="client-page-edit-custom-content" data-id="client-page-edit-custom-content">
    <v-row no-gutters class="mb-5">
      <v-col cols="12">
        <h2 data-id="client-page-edit-carrier-info-title">
          {{ $t('page.clientPage.customContent.title') }}
        </h2>
      </v-col>
    </v-row>

    <v-col cols="12" md="8" lg="6" class="pa-0">
      <v-row no-gutters class="mb-5 header-field-wrapper">
        <v-col cols="12" class="header-field d-flex align-center">
          <span class="regular14">
            {{ $t(`page.clientPage.customContent.showCustomContent`) }}
          </span>
          <v-spacer />
          <mp-switch
            v-model="customContent.toggle"
            dataId="clientPage-edit-header-showCarrierLogo"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <wysiwyg-custom-content
            v-if="customContent.toggle"
            v-model="customContent.body"
          />
        </v-col>
      </v-row>
    </v-col>
  </div>
</template>

<script lang="ts">
import { CustomContent } from '@/types'
import { validationMixin } from '@/mixins'
import mixins from 'vue-typed-mixins'

export default mixins(validationMixin).extend({
  name: 'client-page-edit-custom-content',
  components: {
    WysiwygCustomContent: () => import('@/views/ClientPage/edit/customContent/wysiwygContent.vue'),
  },
  props: {
    customContent: {
      type: Object as () => CustomContent,
      required: true,
    },
    validations: {
      type: Object as () => Record<string, any>,
      required: true,
    },

  },
})
</script>

<style lang="scss">
#client-page-edit-carrier-infos {
  padding: 0 !important;
  margin-top: 5.6rem !important;

  .header-field-wrapper {
    min-height: 6rem;
    display: flex;
    align-items: center;

    .header-field {
      text-decoration: none;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>
