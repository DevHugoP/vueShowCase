<template>
  <mp-block
    id="carrier-delivery-plus-block"
    :title="$vuetify.breakpoint.smAndUp ? $t('page.carrier.plus.title') : ''"
    :hasBorder="$vuetify.breakpoint.smAndUp"
    :hasMarginBottom="$vuetify.breakpoint.smAndUp"
    titleHasPaddingBottom
    :hasEditIcon="isDetailNotEmpty && hasEditIcon"
    @clickOnIcon="showModal = true"
  >
    <v-row no-gutters v-if="isDetailNotEmpty">
      <v-col
        cols="12"
        :class="`d-flex${carrier.plus[currentUser.language].two || carrier.plus[currentUser.language].three ? ' mb-4' : ''}`"
        v-if="carrier.plus[currentUser.language].one"
      >
        <v-icon size="1.8rem" class="success-color mr-4">mdi-plus</v-icon>
        <span class="regular14  main-color">
          {{ carrier.plus[currentUser.language].one }}
        </span>
      </v-col>

      <v-col
        cols="12"
        :class="`d-flex${carrier.plus[currentUser.language].three ? ' mb-4' : ''}`"
        v-if="carrier.plus[currentUser.language].two"
      >
        <v-icon size="1.8rem" class="success-color mr-4">mdi-plus</v-icon>
        <span class="regular14  main-color">
          {{ carrier.plus[currentUser.language].two }}
        </span>
      </v-col>

      <v-col
        cols="12"
        class="d-flex"
        v-if="carrier.plus[currentUser.language].three"
      >
        <v-icon size="1.8rem" class="success-color mr-4">mdi-plus</v-icon>
        <span class="regular14  main-color">
          {{ carrier.plus[currentUser.language].three }}
        </span>
      </v-col>
    </v-row>

    <v-row no-gutters v-else>
      <v-col cols="12" class="no-data-wrapper">
        <no-data
          dataId="carrier-delivery-plus-block-noData"
          :content="$t('common.noData.noContent')"
        />

        <mp-button
          v-if="hasEditIcon && $vuetify.breakpoint.smAndUp"
          format="primary"
          :text="$t('action.add.base')"
          icon="plus"
          class="mp-button"
          @click="showModal = true"
          dataId="carrier-delivery-plus-block-add"
        />
      </v-col>
    </v-row>

    <mp-dialog-confirmation
      v-if="showModal"
      dataId="carrier-delivery-plus-modal"
      classWrapper="carrier-delivery-plus-modal"
      color="primary"
      :header="{
        iconClose: 'mdi-close',
        icon: $vuetify.breakpoint.smAndUp ? 'mdi-pencil' : '',
        isColorBackground: true,
        text: $t('action.modify.plus'),
        textPolice: 'medium16',
      }"
      :btnValidation="{
        text: $t('action.save'),
        format: 'success',
        icon: 'content-save-outline',
      }"
      :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
      @close="
        showModal = !showModal
        editPlus = JSON.parse(JSON.stringify(carrier.plus)) || defaultValue
      "
      @submit="handleSubmit()"
    >
      <template #content>
        <v-row no-gutters>
          <v-col cols="10" offset="1" class="mt-9">
            <mp-chips-wrapper
              class="mb-4"
              :chips="translatedLanguages"
              v-model="selectedLanguage"
              :dataId="`chips-wrapper-language`"
              valueProps="language"
              :maxChips="4"
            />

            <div
              v-for="({ language }, index) in translatedLanguages"
              :key="`form-${language.language}-${index}`"
            >
              <v-row no-gutters v-if="language === selectedLanguage.language">
                <v-col cols="12">
                  <mp-textfield
                    class="mb-5"
                    :dataId="`carrier-delivery-plus-${language}-one`"
                    :label="`${$t('page.carrier.plus.one')}`"
                    v-model="editPlus[language].one"
                    :maxlength="50"
                  />

                  <mp-textfield
                    class="mb-5"
                    :dataId="`carrier-delivery-plus-${language}-two`"
                    :label="`${$t('page.carrier.plus.two')}`"
                    v-model="editPlus[language].two"
                    :maxlength="50"
                  />

                  <mp-textfield
                    class="mb-5"
                    :dataId="`carrier-delivery-plus-${language}-three`"
                    :label="`${$t('page.carrier.plus.three')}`"
                    v-model="editPlus[language].three"
                    :maxlength="50"
                  />
                </v-col>
              </v-row>
            </div>
          </v-col>
        </v-row>
      </template>
    </mp-dialog-confirmation>
  </mp-block>
</template>

<script lang="ts">
import mpBlock from '@/components/block/block.vue'
import noData from '@/components/noData/noData.vue'
import { AVAILABLE_LANGUAGES, TRANSLATED_LANGUAGES } from '@/plugins/i18n'
import { CarrierEntity } from '@/types'
import { validationMixin } from '@/mixins'
import mixins from 'vue-typed-mixins'
import CarrierService from '@/services/carrier/CarrierService'
import { SnackBarType } from '@/store/types'
import { mapGetters } from 'vuex'

export default mixins(validationMixin).extend({
  name: 'mp-carrier-detail-plus',
  components: {
    mpBlock,
    noData,
  },
  props: {
    carrier: {
      type: Object as () => CarrierEntity,
      required: true,
    },
    hasEditIcon: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    defaultValue: { fr: {}, en: {}, it: {}, de: {} } as Record<string, any>,
    editPlus: {} as Record<string, any>,
    showModal: false,
    selectedLanguage: '' as string,
    AVAILABLE_LANGUAGES,
    translatedLanguages: {} as Array<{ text: string; language: string }>,
    isDetailNotEmpty: false,
  }),
  beforeMount() {
    const { plus } = this.carrier
    this.translatedLanguages = AVAILABLE_LANGUAGES.map(language => {
      return {
        text: TRANSLATED_LANGUAGES[language],
        language,
      }
    })
    this.editPlus = JSON.parse(JSON.stringify(plus)) || this.defaultValue
  },
  mounted() {
    this.setIsDetailNotEmpty()
  },
  computed: {
    ...mapGetters({
      currentUser: 'auth/currentUser',
    }),
  },
  methods: {
    setIsDetailNotEmpty(): void {
      if (!this.editPlus) {
        this.isDetailNotEmpty = false
        return
      }

      const plus = this.editPlus[this.currentUser.language]

      if (!plus || (!plus.one && !plus.two && !plus.three)) {
        this.isDetailNotEmpty = false
        return
      }

      this.isDetailNotEmpty = true
    },
    async handleSubmit(): Promise<void> {
      try {
        await CarrierService.update(this.carrier.id, {
          plus: this.editPlus,
        })
        this.carrier.plus = JSON.parse(JSON.stringify(this.editPlus))
        this.setIsDetailNotEmpty()
        this.$store.dispatch('setSnackbar', {
          message: this.$t('messages.carrierUpdated'),
          type: SnackBarType.SUCCESS,
        })
      } catch (err) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      } finally {
        this.showModal = false
      }
    },
  },
  watch: {
    selectedLanguage(next) {
      if (!this.editPlus![next.language]) {
        this.editPlus![next.language] = { one: undefined, two: undefined, three: undefined }
      }
    },
    'carrier.plus'() {
      this.setIsDetailNotEmpty()
    },
  },
})
</script>

<style lang="scss" scoped>
#carrier-delivery-plus-block {
  .no-data-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;

    .mp-button {
      margin-top: 2.5rem;
      margin-bottom: 0.1rem;
    }
  }
}
</style>
