<template>
  <div id="clientPage-edit" data-id="clientPage-edit" v-if="hasLoaded">
    <content-header v-if="$vuetify.breakpoint.smAndUp" dataId="clientPage-edit">
      <template #breadcrumb>
        <mp-breadcrumb />
      </template>
      <template #title>
        <h1 data-id="clientPage-edit-title">
          {{
            $route.params.clientPageId
              ? $t('action.modify.value', { value: clientPage.config.title })
              : $t('breadcrumbs.addClientPage')
          }}
        </h1>
      </template>
      <template #actions-button>
        <div class="actions-wrapper">
          <mp-button
            :text="$t('action.cancel.base')"
            format="link"
            linkColor="black"
            dataId="clientPage-edit-cancel"
            @click.stop="cancel()"
          />
          <mp-button
            :text="$t('action.save')"
            format="success"
            icon="content-save-outline"
            dataId="clientPage-edit-submit"
            :disabled="$v.$invalid || isBodyInvalid"
            @click="submit()"
          />
        </div>
      </template>
    </content-header>

    <v-row no-gutters class="mobile-scroll">
      <v-col cols="10" offset="1">
        <v-form ref="form">
          <v-row no-gutters :class="`mb-10${$vuetify.breakpoint.xsOnly ? ' mt-8' : ''}`">
            <v-col cols="12" md="8" lg="6" class="d-flex align-center">
              <mp-switch
                v-model="clientPage.isActive"
                dataId="store-create-profil-form-switchActive"
              />
              <span class="regular16">{{ $t('common.active') }}</span>
            </v-col>
          </v-row>

          <client-page-edit-definition
            :clientPage="clientPage"
            :validations="$v.clientPage"
            @changeType="handleChangeType($event)"
            @changeCategory="handleChangeCategory($event)"
          />

          <client-page-edit-questions
            class="mt-6"
            :clientPage="clientPage"
            v-if="isClientPageSurvey && clientPage.config.content"
            :questions="clientPage.config.content"
            :validations="$v.clientPage.config.content"
            @deleteQuestion="handleDeleteQuestion($event)"
            :disabled="clientPage.config.default"
          />

          <client-page-edit-header
            :header="clientPage.config.header"
            :disabled="clientPage.config.default"
            :selectedType="clientPage.type"
            :defaultHeader="defaultHeaderValue"
          />

          <client-page-edit-body
            v-if="hasBody"
            :body="clientPage.config.body"
            :disabled="clientPage.config.default"
            :selectedType="clientPage.type"
            @isInvalid="invalid => (isBodyInvalid = invalid)"
          />

          <client-page-edit-custom-content
            :clientPage="clientPage"
            v-if="
              (isClientPageSurvey || isClientPageConfirmation) && clientPage.config.customContent
            "
            :customContent="clientPage.config.customContent"
            :validations="$v.clientPage.config.customContent"
            :disabled="clientPage.config.default"
          />

          <client-page-edit-footer
            :footer="clientPage.config.footer"
            :validations="$v.clientPage.config.footer"
            :disabled="clientPage.config.default"
            :clientPageType="clientPage.type"
          />

          <client-page-edit-carrier-infos
            v-if="isClientPageTracking && clientPage.config.carrierInfos"
            :carrierInfos="clientPage.config.carrierInfos"
            :validations="$v.clientPage.config.carrierInfos"
          />

          <v-row no-gutters class="actions-outer-wrapper" v-if="$vuetify.breakpoint.smAndUp">
            <v-col cols="12" class="actions-wrapper-bottom">
              <mp-button
                :text="$t('action.cancel.base')"
                format="link"
                linkColor="black"
                dataId="store-create-cancel"
                @click.stop="cancel()"
              />
              <mp-button
                :text="$t('action.save')"
                format="success"
                icon="content-save-outline"
                dataId="store-create-submit"
                :disabled="$v.$invalid || isBodyInvalid"
                @click="submit()"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>

    <v-row no-gutters v-if="$vuetify.breakpoint.xsOnly" class="action-outer-wrapper-mobile">
      <v-col cols="6" class="action-cancel-wrapper">
        <mp-button
          :text="$t('action.cancel.base')"
          dataId="store-create-cancel"
          @click.stop="cancel()"
          icon="arrow-left"
          format="sticky"
          stickyColor="yellow"
        />
      </v-col>
      <v-col cols="6">
        <mp-button
          :text="$t('action.save')"
          dataId="store-create-submit"
          @click="submit()"
          :disabled="$v.$invalid || isBodyInvalid"
          format="sticky"
          stickyColor="yellow"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import mpBreadcrumb from '@/components/breadcrumb/breadcrumb.vue'

import contentHeader from '@/components/contentHeader/contentHeader.vue'
import {
  CarrierContactType,
  ClientPageCategory,
  ClientPagePhoneType,
  ClientPageQuestionType,
  ClientPageType,
  CollectClientPageType,
  DeliveryClientPageType,
  ROUTES,
} from '@/constants'

import phoneHelper from '@/helpers/phoneHelper'

import ClientPageService from '@/services/clientPage/clientPageService'
import RetailerService from '@/services/retailer/RetailerService'

import { SET_BREADCRUMBS_LABEL, SET_HEADER_TITLE } from '@/store/mutation-types'

import { SnackBarType } from '@/store/types'

import {
  ClientPageConfigHeader,
  ClientPageConfigMapping,
  ClientPageCreate,
  defaultBody,
  defaultCarrierInfos,
  defaultCustomContent,
  defaultFooter,
  defaultHeader,
  getDefaultQuestion,
} from '@/types'
import Vue from 'vue'
import {
  email,
  integer,
  maxLength,
  maxValue,
  minValue,
  required,
  requiredIf,
  url,
} from 'vuelidate/lib/validators'
import clientPageEditBody from './body/body.vue'
import clientPageEditCarrierInfos from './carrierInfos/carrierInfos.vue'
import clientPageEditCustomContent from './customContent/customContent.vue'
import clientPageEditDefinition from './definition/definition.vue'
import clientPageEditFooter from './footer/footer.vue'
import clientPageEditHeader from './header/header.vue'
import clientPageEditQuestions from './questions/questions.vue'

const defaultClientPage = (): ClientPageCreate => ({
  retailerId: null,
  type: '',
  category: '',
  isActive: false,
  language: '',
  config: {
    title: '',
    default: false,
    header: defaultHeader(),
    body: defaultBody(),
    footer: defaultFooter(),
    content: [],
    customContent: defaultCustomContent(),
  },
})

const TRACKING_PAGES: string[] = [
  DeliveryClientPageType.TRACKING,
  DeliveryClientPageType.MULTI_TRACKING,
]

const SURVEY_PAGES: string[] = [DeliveryClientPageType.SURVEY, CollectClientPageType.DRIVE_SURVEY]

export default Vue.extend({
  name: 'edit-client-page',
  components: {
    contentHeader,
    mpBreadcrumb,
    clientPageEditDefinition,
    clientPageEditHeader,
    clientPageEditFooter,
    clientPageEditQuestions,
    clientPageEditCustomContent,
    clientPageEditBody,
    clientPageEditCarrierInfos,
  },
  data: () => ({
    clientPage: defaultClientPage() as ClientPageCreate,
    retailerUrl: '',
    hasLoaded: false,
    isBodyInvalid: false,
  }),
  computed: {
    hasBody(): boolean {
      return (
        this.clientPage.config.body &&
        !!Object.keys(this.clientPage.config.body).length &&
        Boolean(this.clientPage.type)
      )
    },
    isClientPageSurvey(): boolean {
      return SURVEY_PAGES.includes(this.clientPage.type)
    },
    isClientPageConfirmation(): boolean {
      return (
        this.clientPage.type === DeliveryClientPageType.CONFIRMATION ||
        this.clientPage.type === CollectClientPageType.DRIVE_CONFIRMATION
      )
    },
    isClientPageTracking(): boolean {
      return TRACKING_PAGES.includes(this.clientPage.type)
    },
    defaultHeaderValue(): ClientPageConfigHeader {
      return (
        ClientPageConfigMapping.header[
          this.clientPage.type as DeliveryClientPageType | CollectClientPageType
        ] || defaultHeader()
      )
    },
  },
  validations() {
    const {
      clientPage: {
        category,
        config: { footer, carrierInfos, content },
      },
      isClientPageSurvey,
      isClientPageTracking,
      isClientPageConfirmation,
    } = this

    return {
      clientPage: {
        type: { required },
        category: { required },
        language: { required },
        config: {
          title: { required, maxLength: maxLength(60) },
          footer: {
            phone: {
              type: { required },
              number: {
                validPhoneNumber(): boolean {
                  if (footer.phone.type !== CarrierContactType.CUSTOM) {
                    return true
                  }

                  if (!footer.phone.number) {
                    return false
                  }

                  return phoneHelper.isValid(footer.phone.number!, footer.phoneLanguage as any)
                },
              },
            },
            customerServiceUrl: { url },
            legalNotice: {},
            criticalScore: { integer, maxValue: maxValue(10), minValue: minValue(1) },
          },
          carrierInfos: {
            phone: {
              type: { required: requiredIf((): boolean => isClientPageTracking) },
              number: {
                validPhoneNumber(): boolean {
                  if (
                    !isClientPageTracking ||
                    carrierInfos?.phone.type !== CarrierContactType.CUSTOM
                  ) {
                    return true
                  }

                  if (!carrierInfos.phone.number) {
                    return false
                  }

                  return phoneHelper.isValid(
                    carrierInfos.phone.number,
                    carrierInfos.phoneLanguage as any,
                  )
                },
              },
            },
            email: {
              type: { required: requiredIf((): boolean => isClientPageTracking) },
              value: {
                required: requiredIf(
                  (): boolean =>
                    isClientPageTracking && carrierInfos?.email.type === CarrierContactType.CUSTOM,
                ),
                email,
              },
            },
          },
          content: {
            validQuestion(): boolean {
              if (!isClientPageSurvey) {
                return true
              }

              const questionTypes = [
                ClientPageQuestionType.SCORE_SATISFACTION,
                ClientPageQuestionType.SCORE_RECOMMENDATION,
              ] as string[]

              return !!(
                content
                  ?.filter(
                    ({ type, required: requiredQuestion }) =>
                      requiredQuestion && questionTypes.includes(type),
                  )
                  .some(({ toggle }) =>
                    category === ClientPageCategory.DELIVERY ? toggle : true,
                  ) || false
              )
            },
            $each: {
              title: { required, maxLength: maxLength(60) },
              type: { required },
              question: { required },
              uniqueId: {},
              toggle: {},
            },
          },
          customContent: {
            toggle: {
              required: requiredIf((): boolean => isClientPageSurvey || isClientPageConfirmation),
            },
            body: {
              required: requiredIf(function (this: any): boolean {
                return this.clientPage.config.customContent?.toggle
              }),
            },
          },
        },
      },
    }
  },
  async mounted() {
    const { id: retailerId, clientPageId } = this.$route.params
    const breadcrumbLabel: Record<string, string> = {}
    let title = ''

    if (!retailerId) {
      return
    }

    try {
      if (clientPageId) {
        const clientPage = await ClientPageService.get(clientPageId)

        if (clientPage) {
          if (clientPage.config.footer.phone.number === undefined) {
            clientPage.config.footer.phone.number = ''
          }

          if (!clientPage.config.carrierInfos && TRACKING_PAGES.includes(clientPage.type)) {
            clientPage.config.carrierInfos = Vue.observable(defaultCarrierInfos())
          }
          if (
            !clientPage.config.customContent &&
            (this.isConfirmation(clientPage.type) || this.isSurvey(clientPage.type))
          ) {
            clientPage.config.customContent = Vue.observable(defaultCustomContent())
          }

          this.clientPage = clientPage

          const {
            config: { title: pageTitle },
          } = this.clientPage
          title = pageTitle
          breadcrumbLabel.clientPage = pageTitle
        }
      }

      const {
        name,
        administration: { url: retailerUrl },
      } = await RetailerService.get(parseInt(retailerId, 10))

      this.retailerUrl = retailerUrl || ''

      if (name) {
        title = name
        breadcrumbLabel.retailers = name
      }

      this.$store.commit(SET_HEADER_TITLE, title)
      this.$store.commit(SET_BREADCRUMBS_LABEL, JSON.stringify(breadcrumbLabel))
    } catch (e) {
      if (e.response?.status === 403) {
        return this.$router.push({ name: ROUTES.noAccess })
      }
      if (e.response?.status === 404) {
        return this.$router.push({ name: ROUTES.notFound })
      }
    }

    if (this.$route.name === ROUTES.editClientPage) {
      this.$v.$touch()
      if (!this.clientPage.config.footer.legalNotice) {
        this.$v.clientPage.config!.footer.legalNotice.$reset()
      }
    }

    this.hasLoaded = true
  },
  methods: {
    isSurvey(type: string): boolean {
      return SURVEY_PAGES.includes(type)
    },
    isConfirmation(type: string): boolean {
      return (
        type === DeliveryClientPageType.CONFIRMATION ||
        type === CollectClientPageType.DRIVE_CONFIRMATION
      )
    },
    handleChangeType(type: string) {
      if (SURVEY_PAGES.includes(type)) {
        this.clientPage.config.content = [{ ...getDefaultQuestion() }]
      } else {
        this.clientPage.config.content = []
      }

      if (this.isClientPageTracking) {
        this.clientPage.config.carrierInfos = Vue.observable(defaultCarrierInfos())
      } else {
        delete this.clientPage.config.carrierInfos
      }

      if (this.hasBody) {
        this.isBodyInvalid = true
      }
      this.clientPage.config.default = false
      this.clientPage.language = ''
    },
    handleChangeCategory(category: string) {
      this.clientPage.category = category
      this.clientPage.type = ''
      this.clientPage.config.default = false
      this.clientPage.language = ''
    },
    handleDeleteQuestion(index: number) {
      this.clientPage.config.content!.splice(index, 1)

      if (this.clientPage.config.content!.length === 1) {
        this.clientPage.config.content![0].required = true
      }
    },
    cancel() {
      const { id: retailerId, clientPageId } = this.$route.params

      if (clientPageId) {
        this.$router.push({ name: ROUTES.detailClientPage, params: { retailerId, clientPageId } })
      } else {
        this.$router.push({ name: ROUTES.detailRetailer, params: { retailerId } })
      }
    },
    async submit() {
      try {
        const { id } = this.$route.params
        let { clientPageId } = this.$route.params
        let message = this.$t('messages.clientPageCreated')

        if (clientPageId) {
          const payload = (({ isActive, config, category, type, language }) => ({
            isActive,
            config,
            category,
            type,
            language,
          }))(this.clientPage)

          delete payload.config.footer.phoneLanguage

          if (payload.config.footer.phone.type !== ClientPagePhoneType.CUSTOM) {
            delete payload.config.footer.phone.number
          }

          if (payload.config.footer.criticalScore) {
            payload.config.footer.criticalScore = Number(payload.config.footer.criticalScore)
          } else {
            payload.config.footer.criticalScore = undefined
          }

          await ClientPageService.update(clientPageId, payload)
          message = this.$t('messages.clientPageUpdated')
        } else {
          const payload = {
            ...this.clientPage,
            retailerId: parseInt(id, 10),
          }

          delete payload.config.footer.phoneLanguage

          if (payload.config.footer.phone.type !== ClientPagePhoneType.CUSTOM) {
            delete payload.config.footer.phone.number
          }

          if (payload.config.footer.criticalScore) {
            payload.config.footer.criticalScore = Number(payload.config.footer.criticalScore)
          } else {
            payload.config.footer.criticalScore = undefined
          }

          const { id: newClientPageId } = await ClientPageService.create(payload)
          clientPageId = newClientPageId
        }

        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.SUCCESS,
          message,
        })

        this.$router.push({
          name: ROUTES.detailClientPage,
          params: { id, clientPageId },
        })
      } catch (e) {
        let message = this.$t('messages.error')

        if (e.response?.status === 409) {
          message = this.$t('messages.clientPageAlreadyExists')
        }

        this.$store.dispatch('setSnackbar', {
          message,
          type: SnackBarType.ERROR,
        })
      }
    },
  },
  watch: {
    'clientPage.config.default'(next, current) {
      const { type } = this.clientPage

      if (current === undefined) {
        return
      }

      if (next) {
        let header = {
          ...ClientPageConfigMapping.header[type as DeliveryClientPageType | CollectClientPageType],
        }
        let footer = {
          ...ClientPageConfigMapping.footer[type as DeliveryClientPageType | CollectClientPageType],
        }
        const body = {
          ...ClientPageConfigMapping.body[type as DeliveryClientPageType | CollectClientPageType],
        }

        switch (type) {
          case ClientPageType.DELIVERY.MULTI_TRACKING:
            header = { ...header, showPickingDate: false }
            footer.phone = { type: ClientPagePhoneType.STORE, number: '' }
            break
          case ClientPageType.COLLECT.DRIVE_SURVEY:
            header = {
              showLogo: true,
              showOrderId: true,
              showOrderCreationDate: true,
            }
            break
          case ClientPageType.DELIVERY.TRACKING:
          case ClientPageType.DELIVERY.SURVEY:
            header = {
              showLogo: true,
              showOrderId: true,
              showOrderCreationDate: true,
              showDeliveryDate: false,
              showCarrierName: false,
            }
            footer = {
              phone: { type: ClientPagePhoneType.STORE, number: '' },
              phoneLanguage: 'FR',
              customerServiceUrl: '',
              legalNotice: '',
              criticalScore: 8,
            }
            break
          default:
            break
        }
        if (this.isClientPageSurvey) {
          this.clientPage.config.content = [
            {
              title: this.$t('common.question', { number: 1 }),
              type: ClientPageQuestionType.SCORE_SATISFACTION,
              question: this.$t('page.editClientPage.questions.question.defaultOne'),
              toggle: this.clientPage.category === ClientPageCategory.DELIVERY ? true : undefined,
              required: true,
            },
            {
              title: this.$t('common.question', { number: 2 }),
              type: ClientPageQuestionType.SCORE_RECOMMENDATION,
              question: this.$t('page.editClientPage.questions.question.defaultTwo'),
              toggle: this.clientPage.category === ClientPageCategory.DELIVERY ? true : undefined,
              required: true,
            },
            {
              title: this.$t('common.question', { number: 3 }),
              type: ClientPageQuestionType.CUSTOM,
              question: this.$t('page.editClientPage.questions.question.defaultThree'),
              toggle: undefined,
              required: false,
            },
          ]
        }
        this.clientPage.config.header = header
        this.clientPage.config.footer = footer
        this.clientPage.config.body = body
      } else {
        const header = {
          ...ClientPageConfigMapping.header[type as DeliveryClientPageType | CollectClientPageType],
        }
        const body = {
          ...ClientPageConfigMapping.body[type as DeliveryClientPageType | CollectClientPageType],
        }
        const footer = {
          ...ClientPageConfigMapping.footer[type as DeliveryClientPageType | CollectClientPageType],
        }
        const localClientPageConfig = {
          ...defaultClientPage().config,
          title: this.clientPage.config.title,
          header,
          body,
          footer,
        }

        if (this.isClientPageSurvey) {
          localClientPageConfig.content = [{ ...getDefaultQuestion() }]
        } else {
          localClientPageConfig.content = []
        }

        if (this.isClientPageTracking) {
          localClientPageConfig.carrierInfos = Vue.observable({
            ...defaultCarrierInfos(),
            ...this.clientPage.config.carrierInfos,
          })
        }

        this.clientPage.config = localClientPageConfig
      }

      this.$nextTick(() => {
        this.$v.$reset()
      })
    },
    'clientPage.type'(next, current) {
      if (this.$route.name === ROUTES.editClientPage && !current) {
        return
      }
      const { config } = this.clientPage

      if (!next) {
        this.clientPage.config = {
          ...config,
          header: defaultHeader(),
          body: defaultBody(),
          footer: defaultFooter(),
        }

        return
      }

      this.clientPage.config = {
        ...config,
        header: { ...(ClientPageConfigMapping.header as any)[next] },
        body: { ...(ClientPageConfigMapping.body as any)[next] },
        footer: { ...(ClientPageConfigMapping.footer as any)[next] },
      }
    },
  },
})
</script>

<style lang="scss">
#clientPage-edit {
  padding: 0;

  @media #{map-get($display-breakpoints, 'sm-only')} {
    .actions-wrapper {
      flex-direction: column-reverse;
    }
  }

  .actions-outer-wrapper {
    margin-top: 4.5rem;
    margin-bottom: 7rem;

    .actions-wrapper-bottom {
      display: flex;
      justify-content: flex-end;
    }
  }

  .mobile-scroll {
    @media #{map-get($display-breakpoints, 'xs-only')} {
      max-height: calc(100vh - 8.3rem - 3.1rem);
      min-height: calc(100vh - 8.3rem - 3.1rem);
      overflow-y: scroll;

      padding-bottom: 2rem;
    }
  }

  .action-outer-wrapper-mobile {
    .action-cancel-wrapper {
      padding-right: 0.1rem;
    }

    button {
      min-height: 6rem;
      width: 100%;
    }
  }
}
</style>
