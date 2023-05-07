<template>
  <v-container id="carrier-detail-tag" data-id="carrier-detail-tag">
    <mp-block
      id="carrier-detail-tag-block"
      :hasBorder="$vuetify.breakpoint.smAndUp"
      :hasMarginBottom="$vuetify.breakpoint.smAndUp"
      titleHasPaddingBottom
    >
      <template v-if="$vuetify.breakpoint.smAndUp">
        <slot name="title">
          <div class="d-flex justify-space-between title-padding-bottom">
            <h2>{{ $t('page.carrier.tag.title') }}</h2>
          </div>
        </slot>
      </template>

      <v-expansion-panels v-for="(tag, index) in tags" :key="`carrier-detail-tag-${index}`">
        <mp-collapse
          :ref="`tag-${index}`"
          :title="tag.name"
          leftIcon="mdi-book"
          leftIconSize="2.5rem"
          noPadding
          typographyClass="medium16"
          dataId="carrier-detail-tag-collapse"
        >
          <v-col cols="12" class="tag">
            <v-row no-gutters class="data-container">
              <v-col sm="8" cols="6" class="label">
                <span class="regular14">
                  {{ $t('common.key') }}
                </span>
              </v-col>

              <v-col sm="4" cols="6" class="value">
                <span class="regular14 main-color">
                  {{ tag.key }}
                </span>
              </v-col>
            </v-row>

            <v-row no-gutters class="data-container">
              <v-col sm="8" cols="6" class="label">
                <span class="regular14">
                  {{ $t('common.value') }}
                </span>
              </v-col>

              <v-col sm="4" cols="6" class="value">
                <span class="regular14 main-color">
                  {{ tag.value }}
                </span>
              </v-col>
            </v-row>

            <v-row
              no-gutters
              class="action-outer-wrapper d-flex justify-end"
              v-if="isAuthorized('MANAGE_CARRIERS_PARAMETERS') &&
                $vuetify.breakpoint.smAndUp"
            >
              <v-col
                cols="12"
                md="auto"
                class="d-flex justify-center mt-2"
                v-if="displayDeleteButton"
              >
                <mp-button
                  icon="trash-can-outline"
                  format="link"
                  linkColor="red"
                  iconSize="1.8rem"
                  :text="$t('action.delete.base')"
                  dataId="carrier-detail-tag-delete"
                  :small="$vuetify.breakpoint.smAndDown"
                  @click="setDelete(index)"
                />
              </v-col>
              <v-col
                cols="12"
                :md="`${displayDeleteButton ? 'auto' : 12}`"
                class="d-flex justify-center mt-2"
              >
                <mp-button
                  iconSize="1.8rem"
                  format="secondary"
                  icon="pencil"
                  :text="$t('action.modify.base')"
                  dataId="carrier-detail-tag-update"
                  :small="$vuetify.breakpoint.smAndDown"
                  @click="update(index)"
                />
              </v-col>
            </v-row>
          </v-col>
        </mp-collapse>
      </v-expansion-panels>
      <no-data v-if="!tags.length" dataId="tags-noData" />

      <v-row
        no-gutters
        class="action-outer-wrapper"
        v-if="isAuthorized('MANAGE_CARRIERS_PARAMETERS')"
      >
        <v-col cols="12" class="d-flex justify-center" v-if="$vuetify.breakpoint.smAndUp">
          <mp-button
            icon="plus"
            iconSize="1.8rem"
            :text="$t('action.add.base')"
            dataId="carrier-detail-tag-add"
            @click="showSaveDialog = !showSaveDialog"
          />
        </v-col>
      </v-row>
    </mp-block>

    <mp-tag
      v-if="showSaveDialog"
      :tag="tag"
      @reset="reset"
      @save="save"
      :isEdit="typeof selectedIndex === 'number'"
    />

    <mp-dialog-confirmation
      v-if="showDeleteDialog"
      :dataId="`${selectedIndex}-modal-delete`"
      :textContent="$t('validation.confirmation.deleteTag')"
      @close="reset()"
      @submit="sendDelete(selectedIndex)"
      color="error"
      :header="{ icon: 'mdi-trash-can-outline', isColorBackground: false, iconClose: 'mdi-close' }"
      :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
      :btnValidation="{ text: $t('action.delete.base'), format: 'error' }"
      :btnToColumn="$vuetify.breakpoint.xsOnly"
    />
  </v-container>
</template>

<script lang="ts">
import { GetCarrierParams } from '@/services/carrier/CarrierRepository'
import mixins from 'vue-typed-mixins'

import noData from '@/components/noData/noData.vue'
import mpBlock from '@/components/block/block.vue'
import mpTag from './modals/tagForm.vue'

import OrderEligibilityService from '@/services/orderEligibility/OrderEligibilityService'

import { authorizationMixin } from '@/mixins'
import { SnackBarType } from '@/store/types'
import { Tag } from '@/types'
import objectHelper from '@/helpers/objectHelper'

const DEFAULT_TAG: Tag = {
  name: '',
  key: '',
  value: '',
}
const DEFAULT_INDEX = null

export default mixins(authorizationMixin).extend({
  name: 'mp-carrier-detail-tag',
  components: {
    noData,
    mpBlock,
    mpTag,
  },
  props: {
    tags: {
      type: Array as () => Tag[],
      required: true,
    },
    parentTags: {
      type: Array as () => Tag[],
      required: false,
    },
    params: {
      type: Object as () => GetCarrierParams,
      required: true,
    },
  },
  data: () => ({
    showSaveDialog: false,
    tag: { ...DEFAULT_TAG } as Tag,
    selectedIndex: DEFAULT_INDEX as number | null,
    showDeleteDialog: false,
  }),
  methods: {
    scrollTo(refToScroll: string) {
      setTimeout(() => {
        ;(this.$refs[refToScroll] as any)[0].$el?.scrollIntoView(true, {
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest',
        })
      }, 300)
    },
    reset() {
      this.tag = { ...DEFAULT_TAG }
      this.selectedIndex = DEFAULT_INDEX
      this.showSaveDialog = false
      this.showDeleteDialog = false
    },
    async save() {
      const tags = [...this.tags]
      // update
      if (typeof this.selectedIndex === 'number') {
        tags[this.selectedIndex] = this.tag
      } else {
        tags.push(this.tag)
      }

      await this.sendRequest(tags)
      this.reset()
    },
    update(index: number) {
      this.tag = { ...this.tags[index] }
      this.selectedIndex = index
      this.showSaveDialog = true
    },
    async sendRequest(tags: Tag[], updateChild?: boolean) {
      const params = {
        ...this.params,
        ...(updateChild && { updateChild }),
      }
      await OrderEligibilityService.updateTags(params, { tags })

      this.$emit('update:tags', tags)
    },
    setDelete(index: number) {
      this.showDeleteDialog = !this.showDeleteDialog
      this.selectedIndex = index
    },
    async sendDelete() {
      const tags = [...this.tags]
      tags.splice(this.selectedIndex as number, 1)
      await this.sendRequest(tags)

      this.reset()
    },
    async updateChild() {
      if (!this.tags?.length) {
        this.reset()
        return
      }

      await this.sendRequest(this.tags, true)

      this.$store.dispatch('setSnackbar', {
        type: SnackBarType.SUCCESS,
        message: this.$t('common.success'),
      })

      this.reset()
    },
    async updateWithInheritTag() {
      if (!this.parentTags?.length) {
        this.reset()
        return
      }

      await this.sendRequest(this.parentTags)

      this.$store.dispatch('setSnackbar', {
        type: SnackBarType.SUCCESS,
        message: this.$t('common.success'),
      })

      this.reset()
    },
  },
  computed: {
    displayDeleteButton(): boolean {
      return (
        this.tags.length > 1 ||
        !(
          this.parentTags.length === this.tags.length &&
          this.tags.every((o, idx) => objectHelper.objectsEqual(o, this.parentTags[idx]))
        )
      )
    },
  },
})
</script>

<style lang="scss">
#carrier-detail-tag {
  padding: 0;

  .left-icon {
    color: $main-color !important;
  }

  @media #{map-get($display-breakpoints, 'xs-only')} {
    border-top: solid 0.1rem $main-lighten-74-color;
  }

  .template-collapse-wrapper {
    margin-bottom: 0.7rem;
    margin-top: 0;

    .v-expansion-panel-header {
      border-bottom-left-radius: inherit;
      border-bottom-right-radius: inherit;
    }
  }

  .v-size--small {
    margin-right: -0.4rem !important;
  }

  .title-outer-wrapper {
    margin-bottom: 2.3rem;
  }

  .action-outer-wrapper {
    margin-top: 2rem;
  }

  .data-container {
    padding-bottom: 1.1rem;
    margin-bottom: 1.3rem;
    border-bottom: solid 0.1rem $main-lighten-74-color;

    &:last-child {
      border-bottom: none;
      margin-bottom: 0;
    }

    .label {
      .regular12 {
        color: $main-lighten-52-color;
      }
    }

    .value {
      display: flex;
      justify-content: flex-end;

      .regular14 {
        word-break: break-all;
        text-align: right;
      }
    }
  }

  .main-tag-outer-wrapper {
    display: flex;
    &.margin-bottom {
      margin-bottom: 5rem;
    }

    .main-tag-label-wrapper {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .main-tag-icon {
        margin-right: 1.5rem;
      }
    }

    .main-tag-value-wrapper {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      align-self: flex-end;

      .main-tag-icon {
        margin-right: 1.5rem;
      }
    }

    .option-tag-outer-wrapper {
      margin-bottom: 2.6rem;

      &:first-child {
        margin-top: 1.8rem;
      }

      &:last-child {
        margin-bottom: 5rem;
      }

      .option-tag-wrapper {
        margin-left: 3rem;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        i {
          margin-right: 1.5rem;
        }
      }
    }
  }
}
</style>
