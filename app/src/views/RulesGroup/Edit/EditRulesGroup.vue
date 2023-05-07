<template>
  <div id="edit-rules-group" v-if="rulesGroup">
    <content-header
      hasBoxShadow
      id="edit-rules-group__header"
      v-if="$vuetify.breakpoint.smAndUp"
      dataId="rulesGroups-edit"
    >
      <template #breadcrumb>
        <mp-breadcrumb />
      </template>
      <template #title>
        <h1>{{ title }}</h1>
      </template>
    </content-header>

    <template v-if="$vuetify.breakpoint.xsOnly">
      <v-form ref="form" id="edit-rules-group__form" data-id="rulesGroups-edit-form">
        <v-row no-gutters class="mt-12 mb-2">
          <v-col cols="11" offset="1">
            <v-row no-gutters>
              <v-col cols="11" class="name-wrapper">
                <mp-textfield
                  :label="`${$t('page.rulesGroups.editRulesGroup.name')} *`"
                  v-model="rulesGroup.name"
                  dataId="rulesGroups-edit-form-name"
                  @input="$v.rulesGroup.name.$touch()"
                  @blur="$v.rulesGroup.name.$touch()"
                  :errors="getModelErrors($v.rulesGroup.name)"
                  :isDirty="$v.rulesGroup.name.$dirty"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row no-gutters class="edit-rules-group__rules-list">
          <v-col cols="11" offset="1">
            <v-row no-gutters class="mt-5">
              <v-col cols="11" class="edit-rules-group__panels-wrapper">
                <h2 class="mb-5">{{ $t('page.rulesGroups.associatedRules') }}</h2>
                <v-expansion-panels flat tile accordion>
                  <v-expansion-panel
                    :ref="`rules-group-${rulesCategory}`"
                    @click="scrollTo(`rules-group-${rulesCategory}`)"
                    v-for="[rulesCategory, rules] in Object.entries(rulesGroup.rules)"
                    :key="rulesCategory"
                  >
                    <v-expansion-panel-header>
                      <h4 class="d-flex align-center">
                        {{ $t(`technical.rulesCategory.${rulesCategory}`) }}
                        <v-spacer />
                        <span class="h2 mr-1">{{ getActive(rulesCategory) }}</span>
                        <span class="regular16 mr-6">/{{ Object.keys(rules).length }}</span>
                      </h4>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-row
                        no-gutters
                        v-for="[key, value] in Object.entries(rules)"
                        :key="key"
                        class="mb-5"
                      >
                        <v-checkbox
                          :label="$t(`technical.rules.${key}`)"
                          :input-value="value"
                          @change="handleCheckboxChange($event, rulesCategory, key)"
                          :data-id="`rulesGroups-edit-form-rule_${key}`"
                        />
                      </v-row>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col cols="12" class="action-mobile-wrapper">
            <mp-button
              class="action-mobile"
              format="sticky"
              stickyColor="yellow"
              :text="$t('action.save')"
              @click="submit()"
              dataId="rulesGroups-edit-form-save"
              :disabled="$v.rulesGroup.$invalid"
            />
          </v-col>
        </v-row>
      </v-form>
    </template>

    <v-row no-gutters class="mt-12" v-else>
      <v-col cols="11" offset="1">
        <v-form ref="form" id="edit-rules-group__form" data-id="rulesGroups-edit-form">
          <v-row no-gutters>
            <v-col cols="4" class="name-wrapper">
              <mp-textfield
                :label="`${$t('page.rulesGroups.editRulesGroup.name')} *`"
                v-model="rulesGroup.name"
                dataId="rulesGroups-edit-form-name"
                @input="$v.rulesGroup.name.$touch()"
                @blur="$v.rulesGroup.name.$touch()"
                :errors="getModelErrors($v.rulesGroup.name)"
                :isDirty="$v.rulesGroup.name.$dirty"
              />
            </v-col>
          </v-row>

          <v-row no-gutters class="mt-4">
            <v-col cols="11" class="edit-rules-group__panels-wrapper">
              <h2 class="mb-4">{{ $t('page.rulesGroups.associatedRules') }}</h2>
              <v-expansion-panels flat tile accordion>
                <v-expansion-panel
                  v-for="[rulesCategory, rules] in Object.entries(rulesGroup.rules)"
                  :key="rulesCategory"
                >
                  <v-expansion-panel-header>
                    <h4 class="d-flex align-center">
                      {{ $t(`technical.rulesCategory.${rulesCategory}`) }}
                      <v-spacer />
                      <span class="h2 mr-1">{{ getActive(rulesCategory) }}</span>
                      <span class="regular16 mr-6">/{{ Object.keys(rules).length }}</span>
                    </h4>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-row
                      no-gutters
                      v-for="[key, value] in Object.entries(rules)"
                      :key="key"
                      class="mb-5"
                    >
                      <v-checkbox
                        :label="$t(`technical.rules.${key}`)"
                        :input-value="value"
                        @change="handleCheckboxChange($event, rulesCategory, key)"
                        :data-id="`rulesGroups-edit-form-rule_${key}`"
                      />
                    </v-row>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>

            <v-col cols="11" class="d-flex justify-end my-10">
              <mp-button
                :text="$t('action.cancel.base')"
                format="link"
                linkColor="black"
                @click="$router.push({ name: ROUTES.rulesGroups })"
                dataId="rulesGroups-edit-form-cancel"
              />
              <mp-button
                :text="$t('action.apply')"
                format="success"
                icon="content-save-outline"
                :disabled="$v.rulesGroup.$invalid"
                @click="submit()"
                dataId="rulesGroups-edit-form-save"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'
import { required } from 'vuelidate/lib/validators'

import { SET_BREADCRUMBS_LABEL, SET_HEADER_TITLE } from '@/store/mutation-types'
import { SnackBarType } from '@/store/types'
import { RulesGroupRulesForm } from '@/store/modules/rulesGroups/types'

import { RulesKey } from '@/types'
import { ROUTES } from '@/constants'

import contentHeader from '@/components/contentHeader/contentHeader.vue'
import mpBreadcrumb from '@/components/breadcrumb/breadcrumb.vue'

import RulesGroupService from '@/services/rulesGroup/RulesGroupService'
import RulesGroupMapper from '@/services/rulesGroup/RulesGroupMapper'

import { validationMixin } from '@/mixins'

export default mixins(validationMixin).extend({
  name: 'edit-rules-group',
  components: {
    contentHeader,
    mpBreadcrumb,
  },
  data: () => ({
    ROUTES,
    rulesGroup: null as { name: string; rules: RulesGroupRulesForm } | null,
  }),
  computed: {
    title() {
      const { name } = this.$route
      return name === ROUTES.addRulesGroup
        ? this.$t('action.add.rulesGroup')
        : this.$t('action.modify.rulesGroup')
    },
  },
  validations: {
    rulesGroup: {
      name: { required },
    },
  },
  async beforeMount() {
    const {
      params: { id },
    } = this.$route

    let name = ''
    let rulesList: RulesKey[] = []

    await this.$store.dispatch('rulesGroups/fetchAllRules')

    const allRules = this.$store.getters['rulesGroups/allRules']

    let mappedRules: RulesGroupRulesForm = RulesGroupMapper.rulesListToRulesForm([], allRules)

    if (id) {
      try {
        const rulesGroup = await RulesGroupService.get(id)
        name = rulesGroup.name
        rulesList = rulesGroup.rules

        mappedRules = RulesGroupMapper.rulesListToRulesForm(rulesGroup.rules, allRules)
      } catch (e) {
        if (e.response?.status === 403) {
          return this.$router.push({ name: ROUTES.noAccess })
        }
        if (e.response?.status === 404) {
          return this.$router.push({ name: ROUTES.notFound })
        }
      }
    }

    const localRulesGroup = { name, rules: rulesList }

    this.rulesGroup = { name: localRulesGroup.name, rules: mappedRules }
    this.initializeBreadcrumb(this.rulesGroup.name)

    this.$store.commit(
      SET_HEADER_TITLE,
      id ? this.rulesGroup.name : this.$t('breadcrumbs.addRulesGroup'),
    )
  },
  methods: {
    async submit() {
      try {
        const { id } = this.$route.params
        let message = this.$t('messages.rulesGroupCreated')

        if (!this.rulesGroup) {
          return
        }

        if (id) {
          await RulesGroupService.editRulesGroup(id, this.rulesGroup)
          message = this.$t('messages.rulesGroupUpdated')
        } else {
          await RulesGroupService.createRulesGroup(this.rulesGroup)
        }

        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.SUCCESS,
          message,
        })

        this.$router.push({ name: ROUTES.rulesGroups, query: { id } })
      } catch (e) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      }
    },
    handleCheckboxChange(value: boolean, rulesCategory: string, rule: string) {
      this.rulesGroup!.rules[rulesCategory][rule] = value
    },
    getActive(rulesCategory: string) {
      if (!this.rulesGroup) {
        return
      }

      const activeRules = Object.values(this.rulesGroup.rules[rulesCategory]).filter(
        rule => rule,
      )

      return activeRules.length
    },
    initializeBreadcrumb(name: string) {
      const breadcrumbsLabel = {
        rulesGroup: name || '',
      }

      this.$store.commit(SET_BREADCRUMBS_LABEL, JSON.stringify(breadcrumbsLabel))
    },
    scrollTo(refToScroll: string) {
      setTimeout(() => {
        ;(this.$refs[refToScroll] as any)[0].$el.scrollIntoView(true, {
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest',
        })
      }, 300)
    },
  },
})
</script>

<style lang="scss">
#edit-rules-group {
  @media #{map-get($display-breakpoints, 'xs-only')} {
    .edit-rules-group__rules-list {
      background-color: $main-lighten-74-color;
      padding-bottom: 8.6rem;
      min-height: calc(100vh - 5.4rem - 6rem - 11rem);
      max-height: calc(100vh - 5.4rem - 6rem - 11rem);
      overflow: scroll !important;

      .edit-rules-group__panels-wrapper {
        .v-expansion-panel {
          border-radius: 0.4rem;
          margin-bottom: 0.5rem;

          &-header {
            border-bottom: 0.1rem solid $main-lighten-74-color;
          }

          &-content {
            padding-top: 3.8rem;
          }
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

  @media #{map-get($display-breakpoints, 'sm-and-up')} {
    .edit-rules-group__panels-wrapper {
      .v-expansion-panel {
        border-top: 0.1rem solid $main-lighten-74-color;

        .v-expansion-panel-header,
        .v-expansion-panel-content__wrap {
          padding-left: 0;
        }
      }
    }
  }

  .edit-rules-group__panels-wrapper {
    .v-expansion-panel-content__wrap {
      .v-input--checkbox {
        .v-input__slot {
          margin-bottom: 0;

          label {
            color: $main-color;
            @include regular-16();
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

        .v-messages {
          display: none;
        }
      }
    }
  }
}
</style>
