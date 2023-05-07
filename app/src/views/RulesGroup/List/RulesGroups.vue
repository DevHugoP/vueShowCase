<template>
  <div id="rules-groups">
    <content-header
      hasBoxShadow
      id="rules-groups__header"
      v-if="$vuetify.breakpoint.smAndUp"
      dataId="rulesGroups-list"
    >
      <template #breadcrumb>
        <mp-breadcrumb />
      </template>
      <template #title>
        <h1>{{ $t('page.rulesGroups.title') }}</h1>
      </template>
      <template #actions-button v-if="isAuthorized('CREATE_RULES_GROUP')">
        <mp-button
          format="primary"
          icon="plus"
          class="action-add__btn"
          :text="$t('action.add.rulesGroup')"
          :to="{ name: ROUTES.addRulesGroup }"
          dataId="rulesGroups-list-addRulesGroups"
        />
      </template>
    </content-header>

    <template v-if="$vuetify.breakpoint.xsOnly">
      <v-col
        v-if="group"
        cols="12"
        :class="`pa-0${displayFullSize ? ' display-bottom-button' : ''}`"
      >
        <v-row no-gutters class="mt-12 mb-2 group-detail-rules">
          <v-col cols="11" class="name-wrapper">
            <h2 class="rules-group__tab__title">{{ group.name }}</h2>
          </v-col>
          <v-col cols="11" offset="1">
            <v-row no-gutters class="mt-5">
              <v-col cols="11" class="edit-rules-group__panels-wrapper">
                <v-tabs-items v-if="isAuthorized('READ_RULES_GROUP')" v-model="group">
                  <rules-list :rulesGroup="group" />
                </v-tabs-items>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        
        <v-row no-gutters>
          <div v-if="displayFullSize" class="actions-wrapper-mobile">
            <mp-button
              v-if="isAuthorized('EDIT_RULES_GROUP')"
              class="action-edit"
              tile
              format="sticky"
              stickyColor="yellow"
              :text="$t('action.modify.rulesGroup')"
              :to="getEditRoute()"
              dataId="rulesGroups-list-editRulesGroups"
            />
            <mp-button
              v-if="isAuthorized('DELETE_RULES_GROUP')"
              class="action-delete"
              tile
              format="sticky"
              stickyColor="yellow"
              :text="$t('action.delete.rulesGroup')"
              @click="showDeleteDialog = true"
              dataId="rulesGroups-list-deleteRulesGroups"
            />
          </div>
        </v-row>
      </v-col>

      <v-col cols="12" v-else class="pa-0">
        <v-row no-gutters class="rules-groups__wrapper">
          <v-col cols="12">
            <v-list flat>
              <div v-for="(rulesGroup, index) in rulesGroups" :key="`${rulesGroup.id}`">
                <v-list-item
                  @click="selectGroup(rulesGroup.id)"
                  class="d-flex rules-group pa-0 mx-4"
                >
                  <h4 class="rules-group__title">{{ rulesGroup.name }}</h4>
                  <v-spacer />
                  <v-icon>mdi-chevron-right</v-icon>
                </v-list-item>

                <v-divider class="mx-4" v-if="index !== rulesGroups.length - 1" />
              </div>
            </v-list>
          </v-col>
        </v-row>
        <v-row no-gutters v-if="isAuthorized('CREATE_RULES_GROUP')">
          <v-col cols="12" class="action-mobile-wrapper">
            <mp-button
              format="sticky"
              stickyColor="yellow"
              class="action-mobile"
              :text="$t('action.add.rulesGroup')"
              :to="{ name: ROUTES.addRulesGroup }"
              dataId="rulesGroups-list-addRulesGroups"
            />
          </v-col>
        </v-row>
      </v-col>
    </template>

    <template v-else>
      <v-tabs vertical hide-slider v-model="selectedGroup" v-if="rulesGroups.length > 0">
        <v-row no-gutters class="rules-groups__wrapper mb-10" justify="start">
          <v-col cols="3" offset="1" class="pr-10">
            <v-tab
              v-for="rulesGroup in rulesGroups"
              :key="`tab_${rulesGroup.id}`"
              class="rules-group__tab d-flex justify-start px-5 py-3 mb-3"
              :ripple="false"
            >
              <h4 class="rules-group__tab__title">{{ rulesGroup.name }}</h4>
            </v-tab>
          </v-col>
          <v-col cols="7">
            <v-row no-gutters justify="space-between" align="center" class="mb-10">
              <h2 class="rules-group__rules-title">
                {{ $t('page.rulesGroups.associatedRules') }}
              </h2>
              <div class="carrier-list-actions-wrapper">
                <v-menu
                  bottom
                  offset-y
                  origin="center top"
                  transition="scale-transition"
                  v-if="menuItems.length"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <mp-button
                      v-bind="attrs"
                      v-on="on"
                      dataId="rulesGroups-actions"
                      format="link"
                      linkColor="black"
                      :text="$t('action.base')"
                      icon="apps"
                    />
                  </template>
                  <v-list>
                    <v-list-item
                      v-for="(action, index) in menuItems"
                      :key="`rulesGroups-list-actions-${index}`"
                      @click="handleActionsClick(action.type)"
                      :data-id="`rulesGroups-list-actions-${index}`"
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
              </div>
            </v-row>
            <v-tabs-items v-if="isAuthorized('READ_RULES_GROUP')" v-model="selectedGroup">
              <v-tab-item v-for="rulesGroup in rulesGroups" :key="`tab-content_${rulesGroup.id}`">
                <rules-list :rulesGroup="rulesGroup" />
              </v-tab-item>
            </v-tabs-items>
            <h2 v-else class="rules-group__rules-title">
              {{ $t('messages.notAllowed') }}
            </h2>
          </v-col>
        </v-row>
      </v-tabs>
    </template>
    <mp-dialog-confirmation
      v-if="showDeleteDialog"
      dataId="rulesGroup-dialog-delete"
      :textContent="$t('validation.confirmation.deleteRulesGroups')"
      @close="showDeleteDialog = false"
      @submit="deleteGroup()"
      color="error"
      :header="{
        icon: 'mdi-trash-can-outline',
        isColorBackground: false,
        iconClose: 'mdi-close',
      }"
      persistent
      :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
      :btnValidation="{
        text: $t('action.delete.base'),
        format: 'error',
      }"
      :btnToColumn="$vuetify.breakpoint.xsOnly"
    />
  </div>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'

import contentHeader from '@/components/contentHeader/contentHeader.vue'
import mpBreadcrumb from '@/components/breadcrumb/breadcrumb.vue'
import rulesList from './rulesList/rulesList.vue'

import { ROUTES } from '@/constants'

import RulesGroupService from '@/services/rulesGroup/RulesGroupService'

import { authorizationMixin } from '@/mixins'
import { RulesGroupEntity } from '@/types'
import { SnackBarType } from '@/store/types'

export default mixins(authorizationMixin).extend({
  name: 'rules-groups',
  components: {
    contentHeader,
    mpBreadcrumb,
    rulesList,
  },
  data: () => ({
    ROUTES,
    rulesGroups: [] as RulesGroupEntity[],
    showDeleteDialog: false,
    selectedGroup: 0,
    group: null as RulesGroupEntity | null,
    menuItems: [] as Array<{ text: string; icon: string; type: string }>,
  }),
  async beforeMount() {
    this.rulesGroups = await RulesGroupService.getAll()
    if (this.$route.query && this.$route.query.id) {
      const ruleId = this.$route.query.id as string
      this.selectedGroup = this.rulesGroups.map(({ id }: { id: string }) => id).indexOf(ruleId)
      this.group = this.rulesGroups.find(({ id }: { id: string }) => id === ruleId) || null
    }

    this.menuItems = [
      ...(this.isAuthorized('EDIT_RULES_GROUP')
        ? [
            {
              text: this.$t('action.modify.rulesGroup'),
              icon: 'mdi-pencil',
              type: 'EDIT_RULES_GROUP',
            },
          ]
        : []),
      ...(this.isAuthorized('DELETE_RULES_GROUP')
        ? [
            {
              text: this.$t('action.delete.rulesGroup'),
              icon: 'mdi-trash-can-outline',
              type: 'DELETE_RULES_GROUP',
            },
          ]
        : []),
    ]
  },
  computed: {
    displayFullSize(): boolean {
      return (
        this.$vuetify.breakpoint.xsOnly &&
        (Boolean(this.isAuthorized('EDIT_RULES_GROUP')) || Boolean(this.isAuthorized('DELETE_RULES_GROUP'))
      )
    )},
  },
  methods: {
    getEditRoute() {
      const { id } = this.rulesGroups[this.selectedGroup]
      
      return this.$vuetify.breakpoint.xsOnly 
        ? { name: ROUTES.editRulesGroup, params: { id } } 
        : this.$router.push({ name: ROUTES.editRulesGroup, params: { id } })
    },
    selectGroup(selectedId: string) {
      this.group = this.rulesGroups.find(({ id }: { id: string }) => id === selectedId) || null
      this.selectedGroup = this.rulesGroups.map(({ id }: { id: string }) => id).indexOf(selectedId)
    },
    async deleteGroup() {
      try {
        const { id } = this.rulesGroups[this.selectedGroup]

        await RulesGroupService.deleteRulesGroup(id)

        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.SUCCESS,
          message: this.$t('messages.rulesGroupDeleted'),
        })
      } catch (e) {
        return this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message:
            e.response?.status === 403
              ? this.$t(`messages.rulesGroupDeleteError`)
              : this.$t('messages.error'),
        })
      } finally {
        this.showDeleteDialog = false
      }
    },
    handleActionsClick(actionType: string): void {
      switch (actionType) {
        case 'EDIT_RULES_GROUP': {
          this.getEditRoute()
          break
        }
        case 'DELETE_RULES_GROUP': {
          this.showDeleteDialog = true
          break
        }
      }
    },
  },
})
</script>

<style lang="scss">
#rules-groups {
  .action-mobile-wrapper {
    .action-mobile {
      width: 100%;
      min-height: 6rem;

      .v-btn__content {
        @include h3-18-medium;
      }
    }
  }

  @media #{map-get($display-breakpoints, 'xs-only')} {
    .rules-groups__wrapper {
      min-height: calc(100vh - 5.4rem - 6rem - 3.4rem);
      max-height: calc(100vh - 5.4rem - 6rem - 3.4rem);
      overflow: scroll !important;

      .v-list {
        padding: 0;
      }

      .rules-group {
        min-height: 5.4rem;
      }

      .v-divider {
        background-color: $main-lighten-74-color;
      }
    }

    &.display-bottom-button {
    @media #{map-get($display-breakpoints, 'xs-only')} {
      max-height: calc(100vh - 5.4rem - 6rem);
      overflow-y: scroll;
    }
  }

    .group-detail-rules {
      min-height: calc(100vh - 5.4rem - 6rem - 5.4rem);
      max-height: calc(100vh - 5.4rem - 6rem - 5.4rem);
      overflow: scroll !important;

      .name-wrapper {
        padding-left: 1rem;
      }
    }
  }

  @media #{map-get($display-breakpoints, 'sm-and-up')} {
    .v-slide-group__content {
      max-width: 100%;
    }

    .rules-groups__wrapper {
      max-width: fit-content;
      min-width: 100%;

      .rules-group__tab {
        width: 100%;
        border-radius: 3rem;
        min-height: fit-content;

        &::before {
          display: none;
        }

        &__title {
          color: $main-color;
          text-align: start;
          white-space: break-spaces;
          word-break: break-all;
        }

        &.v-tab--active {
          border: 0.2rem solid $main-color;
        }

        &:hover:not(.v-tab--active) {
          background-color: $main-lighten-80-color;
        }

        &.v-tab {
          height: fit-content !important;
        }
      }

      .rules-group__rules-title {
        color: $main-color;
      }
    }
  }

  .rules-groups__wrapper {
    margin-top: 3.4rem;
  }

  .actions-wrapper-mobile {
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 3;
    display: flex;

    flex-direction: row;
    overflow-x: auto;

    .action-modify {
      @media #{map-get($display-breakpoints, 'xs-only')} {
        padding-left: 2rem !important;
        padding-right: 2rem !important;
      }
    }
    
    .action-edit,
    .action-delete {
      height: 6rem !important;
      border-radius: 0;
      flex-grow: 1;
    }
  }
}
</style>
