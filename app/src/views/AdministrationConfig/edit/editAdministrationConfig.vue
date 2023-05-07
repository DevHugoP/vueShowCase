<template>
  <div v-if="hasData" id="administration-config-detail" class="d-flex flex-column">
    <content-header
      id="detail-administration-config__header"
      className="d-flex flex-column"
      hasBoxShadow
      v-if="$vuetify.breakpoint.smAndUp"
      data-id="administration-config-detail"
    >
      <template #breadcrumb>
        <mp-breadcrumb />
      </template>
      <template #title>
        <h1>{{ headerTitle }}</h1>
      </template>
      <template #actions-button>
        <v-row no-gutters class="create-administration-config-actions mt-4 pb-6">
          <v-col cols="10" offset-sm="1" class="d-flex justify-end">
            <mp-button
              :text="$t('action.cancel.base')"
              format="link"
              linkColor="black"
              @click="cancel()"
              dataId="administration-config-create-form-cancel"
            />
            <mp-button
              :text="$t('action.save')"
              format="success"
              icon="content-save-outline"
              @click="save()"
              :disabled="invalid"
              dataId="administration-config-create-form-save"
            />
          </v-col>
        </v-row>
      </template>
    </content-header>
    <v-form
      ref="form"
      class="create-administration-configs-form mt-6"
      data-id="create-administration-configs-form"
      id="create-admin-config-form"
    >
      <v-row no-gutters>
        <v-col cols="12" sm="5" offset-sm="1">
          <metabase-form
            :metabase="administrationConfig.metabase"
            @invalid="isValid.metabase = $event"
            @changeKey="hasChanged.metabase = $event"
          />
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="12" sm="5" offset-sm="1">
          <jwt-form
            :jwt="administrationConfig.jwt"
            @invalid="isValid.jwt = $event"
            @changeKey="hasChanged.jwt = $event"
          />
        </v-col>
      </v-row>
    </v-form>

    <v-row v-if="$vuetify.breakpoint.xsOnly" no-gutters class="mt-auto">
      <v-col cols="6" class="action-mobile-wrapper">
        <mp-button
          :text="$t('action.cancel.base')"
          icon="arrow-left"
          format="sticky"
          stickyColor="yellow"
          @click="cancel()"
          dataId="administration-config-create-form-cancel"
          class="action-mobile"
        />
      </v-col>
      <v-col cols="6" class="action-mobile-wrapper">
        <mp-button
          :text="$t('action.save')"
          format="sticky"
          stickyColor="yellow"
          :disabled="invalid"
          @click="save()"
          dataId="administration-config-create-form-save"
          class="action-mobile"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import metabaseForm from './metabaseForm/metabase.vue'
import jwtForm from './jwtForm/jwt.vue'
import AdministrationService from '@/services/administration/AdministrationService'

import contentHeader from '@/components/contentHeader/contentHeader.vue'
import mpBreadcrumb from '@/components/breadcrumb/breadcrumb.vue'
import { mapGetters } from 'vuex'
import { AdministrationConfig } from '@/types'

const AVAILABLE_CONFIGURATIONS_KEYS = ['metabase', 'jwt']

export default Vue.extend({
  name: 'create-administration',
  components: {
    contentHeader,
    mpBreadcrumb,
    metabaseForm,
    jwtForm,
  },
  async beforeMount() {
    this.administrationConfig = await AdministrationService.getAll()
    this.hasData = true
  },
  data: () => ({
    administrationConfig: {
      metabase: {
        url: '',
        secretKey: '',
      },
      jwt: {
        secretKey: '',
      },
    } as AdministrationConfig,
    hasChanged: {
      metabase: false,
      jwt: false,
    },
    isValid: {
      metabase: false,
      jwt: false,
    },
    hasData: false,
  }),
  computed: {
    ...mapGetters({
      headerTitle: 'getHeaderTitle',
    }),
    invalid() {
      return Object.values(this.isValid).some(invalid => invalid)
    },
  },
  methods: {
    async save() {
      const { administrationConfig, hasChanged } = this

      for (const [configurationKey, configurationPayload] of Object.entries(administrationConfig)) {
        if (AVAILABLE_CONFIGURATIONS_KEYS.includes(configurationKey)) {
          if (!(hasChanged as any)[configurationKey]) {
            configurationPayload.secretKey = ''
          }
          await AdministrationService.update(configurationKey, configurationPayload)
        }
      }
      this.$router.go(-1)
    },
    cancel() {
      this.$router.go(-1)
    },
  },
  watch: {
    '$v.administrationConfig.$invalid'(next) {
      this.$emit('invalid', next)
    },
  },
})
</script>

<style lang="scss">
@import '../../../styles/mixins/macScrollbar';

#administration-config-detail {
  #create-admin-config-form {
    @media #{map-get($display-breakpoints, 'xs-only')} {
      min-height: calc(100vh - 2.4rem - 5.4rem - 6rem);
      max-height: calc(100vh - 5.4rem);
      overflow: scroll !important;
    }
  }

  .action-mobile-wrapper {
    .action-mobile {
      width: 100%;
      height: 6rem;

      .v-btn__content {
        @include h3-18-medium;
      }
    }
  }
}

.create-administration-config-modal {
  max-width: 58.6rem !important;
  display: flex;
  flex-direction: column;

  .create-administration-configs-form {
    & > .row {
      display: flex;
      justify-content: space-around;
    }
  }

  .search-outer-wrapper {
    @media #{map-get($display-breakpoints, 'xs-only')} {
      padding-top: 2rem;
    }

    min-height: 8.4rem;
    background-color: $main-lighten-80-color;
    display: flex;
    align-items: center;
  }

  .main-dialog-content {
    @include setMacScrollbar('&');
    min-height: 28.7rem !important;
    overflow-y: scroll;
    overflow-x: hide !important;
    max-height: calc(100vh - 50rem);
    @media #{map-get($display-breakpoints, 'xs-only')} {
      max-height: calc(133vh - 50rem);
    }
    padding: 2rem !important;
  }

  h4 {
    text-align: center;
    margin-bottom: 1rem;
    line-height: 2.5rem;
  }

  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 5rem;
    height: 5rem;
    border: 0.1rem solid $main-color;
    border-radius: 50%;
    margin: 2rem auto;
    i {
      color: $main-color;
    }
  }

  .modal-header-wrapper {
    position: relative;
    background: $primary-color;
  }

  .cross-icon {
    position: absolute;
    top: 2.4rem;
    right: 2.1rem;
    z-index: 2;
    color: $main-color;
  }

  .notification-type-selector {
    border: 1px solid #cdced9;
    box-sizing: border-box;
    border-radius: 4px;
    color: #272833;
    text-align: center;

    label {
      justify-content: center;
    }
    width: 15rem;
    height: 7.5rem;

    .v-input--selection-controls__input {
      display: none;
    }
  }

  .radio-button-wrapper {
    p {
      margin: 0;
    }
  }

  .v-item--active {
    border: 2px solid #272833;
    box-sizing: border-box;
    border-radius: 4px;
  }

  .v-input--radio-group.v-input--radio-group--row .v-radio {
    margin-right: 0;
  }

  .v-input--radio-group--row .v-input--radio-group__input {
    justify-content: space-around;
  }

  .main-dialog-content {
    justify-content: center;

    @media #{map-get($display-breakpoints, 'xs-only')} {
      padding-left: 2rem;
      padding-right: 2rem;
    }

    .action-outer-wrapper {
      margin-top: 10rem;

      @media #{map-get($display-breakpoints, 'xs-only')} {
        justify-content: center;
      }

      .action-wrapper {
        display: flex;
        justify-content: flex-end;

        @media #{map-get($display-breakpoints, 'xs-only')} {
          align-items: center;

          .v-btn {
            width: fit-content;
          }
        }

        i {
          &.mdi-content-save {
            margin-right: 1rem;
          }
        }

        @media #{map-get($display-breakpoints, 'xs-only')} {
          flex-direction: column-reverse;
        }
      }
    }
  }
}
</style>
