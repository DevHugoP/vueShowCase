<template>
  <div id="carrier-create" data-id="carrier-create" v-if="carrier">
    <content-header v-if="$vuetify.breakpoint.smAndUp" dataId="carrier-create">
      <template #breadcrumb>
        <mp-breadcrumb />
      </template>
      <template #title>
        <h1 data-id="carrier-create-title">
          {{
            $route.params.carrierId
              ? `${$t('action.modify.base')} ${carrier.name}`
              : $t('breadcrumbs.createCarrier')
          }}
        </h1>
      </template>

      <template #actions-button>
        <div class="actions-wrapper">
          <mp-button
            dataId="carrier-create-header-cancel"
            @click="cancel()"
            :text="$t('action.cancel.base')"
            format="link"
            linkColor="black"
          />
          <mp-button
            dataId="carrier-create-header-submit"
            :text="$t('action.save')"
            format="success"
            icon="content-save-outline"
            :disabled="invalid"
            @click="submit()"
          />
        </div>
      </template>
    </content-header>

    <v-row no-gutters class="mobile-scroll">
      <v-col cols="10" offset="1">
        <carrier-create-profil
          class="mt-8 mb-4"
          :carrier="carrier"
          @invalid="invalids.createProfil = $event"
        />
      </v-col>
    </v-row>

    <v-row v-if="$vuetify.breakpoint.xsOnly" no-gutters>
      <v-col cols="6" class="action-mobile-wrapper">
        <mp-button
          :text="$t('action.cancel.base')"
          dataId="carrier-create-cancel"
          @click.stop="cancel()"
          icon="arrow-left"
          format="sticky"
          stickyColor="yellow"
          class="action-mobile"
        />
      </v-col>
      <v-col cols="6" class="action-mobile-wrapper">
        <mp-button
          class="action-mobile"
          :text="$t('action.save')"
          :disabled="invalid"
          dataId="carrier-create-submit"
          format="sticky"
          stickyColor="yellow"
          :loading="loading"
          @click="submit()"
        />
      </v-col>
    </v-row>

    <v-row no-gutters class="actions-outer-wrapper mb-4" v-else>
      <v-col cols="10" offset="1" class="actions-wrapper">
        <mp-button
          @click="cancel()"
          :text="$t('action.cancel.base')"
          format="link"
          linkColor="black"
          dataId="carrier-create-cancel"
        />
        <mp-button
          :text="$t('action.save')"
          format="success"
          icon="content-save-outline"
          :disabled="invalid"
          dataId="carrier-create-submit"
          :loading="loading"
          @click="submit()"
        />
      </v-col>
    </v-row>

    <client-secret-modal
      v-if="createdCarrier && showClientSecret"
      :showDialog="showClientSecret"
      :clientSecret="createdCarrier.apiClientSecret"
      @close="confirmClientSecret()"
      dataId="carrier-create-client-secret-modal"
    />
  </div>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'

import { CarrierEntity, CreateCarrier } from '@/types'
import { ROUTES } from '@/constants'
import { authorizationMixin } from '@/mixins'

import { SET_HEADER_TITLE } from '@/store/mutation-types'
import { SnackBarType } from '@/store/types'

import contentHeader from '@/components/contentHeader/contentHeader.vue'
import mpBreadcrumb from '@/components/breadcrumb/breadcrumb.vue'
import clientSecretModal from '@/components/clientSecretModal/clientSecretModal.vue'
import carrierCreateProfil from '@/views/Carrier/create/profil/profil.vue'

import CarrierService from '@/services/carrier/CarrierService'
import CarrierMapper from '@/services/carrier/CarrierMapper'

export default mixins(authorizationMixin).extend({
  name: 'carrier-create',
  components: {
    contentHeader,
    mpBreadcrumb,
    clientSecretModal,
    carrierCreateProfil,
  },
  data: () => ({
    carrier: null as CarrierEntity | null,
    ROUTES,
    showClientSecret: false,
    loading: false,
    createdCarrier: null as Partial<CarrierEntity> | null,
    invalids: {
      createProfil: false,
    },
  }),
  computed: {
    invalid() {
      return this.invalids.createProfil
    },
  },
  async mounted() {
    let localCarrier
    if (this.$route.params.carrierId) {
      localCarrier = await CarrierService.get(parseInt(this.$route.params.carrierId, 10))
    }
    this.carrier = CarrierService.buildCarrier(localCarrier)

    // set title mobile
    this.$store.commit(
      SET_HEADER_TITLE,
      this.$route.params.carrierId
        ? this.$t('action.modify.value', { value: this.carrier.name })
        : this.$t('breadcrumbs.createCarrier'),
    )
  },
  methods: {
    cancel() {
      const { path } = this.$route
      this.$router.push(path.replace('/edit', '').replace('/add', ''))
    },
    async submit() {
      const { carrierId } = this.$route.params
      const localCarrier = await CarrierMapper.toDto(this.carrier as CarrierEntity)

      try {
        this.loading = true
        if (carrierId) {
          await CarrierService.update(carrierId, localCarrier)
          this.$store.dispatch('setSnackbar', {
            message: this.$t('messages.carrierUpdated'),
            type: SnackBarType.SUCCESS,
          })
          this.$router.push(this.$route.path.replace('/edit', ''))
          return
        }
        this.createdCarrier = await CarrierService.create(localCarrier as CreateCarrier)

        this.loading = false
        this.showClientSecret = true

        this.$store.dispatch('setSnackbar', {
          message: this.$t('messages.carrierCreated'),
          type: SnackBarType.SUCCESS,
        })
      } catch (e) {
        this.loading = false
        if (e.response && e.response.status === 403) {
          return this.$store.dispatch('setSnackbar', {
            message: this.$t('messages.carrierAlreadyExists'),
            type: SnackBarType.ERROR,
          })
        }
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      }
    },
    confirmClientSecret() {
      this.showClientSecret = false
      const { id } = this.createdCarrier as Partial<CarrierEntity>

      if (this.createdCarrier && id) {
        this.$router.push({
          name: ROUTES.detailCarrier,
          params: { carrierId: id.toString() },
        })
      }
    },
  },
})
</script>

<style lang="scss">
@import '../../../styles/mixins/macScrollbar';

#carrier-create {
  padding: 0;

  .action-mobile-wrapper {
    .action-mobile {
      width: 100%;
      height: 6rem;

      .v-btn__content {
        @include h3-18-medium;
      }
    }
  }

  .mobile-scroll {
    @media #{map-get($display-breakpoints, 'xs-only')} {
      max-height: calc(100vh - 8.3rem - 3.1rem);
      min-height: calc(100vh - 8.3rem - 3.1rem);
      overflow-y: scroll;
    }
  }

  @media #{map-get($display-breakpoints, 'sm-only')} {
    .main-header__actions {
      padding: 0;

      .actions-wrapper {
        flex-direction: column-reverse;
      }
    }
  }

  .actions-outer-wrapper {
    .actions-wrapper {
      display: flex;
      justify-content: flex-end;
    }
  }

  .chip-outer-wrapper {
    margin-top: 0;
    margin-bottom: 2rem;
  }

  .chip-wrapper {
    @include setMacScrollbar('&');
    display: flex;
    justify-content: flex-start;
    overflow-y: auto;
    padding-bottom: 1rem !important;

    @media #{map-get($display-breakpoints, 'xs-only')} {
      position: inherit !important;
    }

    .chip {
      margin-top: 0;
      margin-right: 1.4rem;
      min-width: fit-content;
      cursor: pointer;

      &.chip-selected {
        background-color: $white;
        border: solid 0.2rem $main-color;
        border-radius: 5rem;
        cursor: default;
      }

      &.chip-no-selected {
        background-color: $white;
        border: solid 0.1rem $main-lighten-74-color;
      }
    }
  }
}
</style>
