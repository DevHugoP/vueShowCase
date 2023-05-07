<template>
  <div id="custom-checkout" v-if="hasLoaded">
    <!-- Header -->
    <content-header
      id="custom-checkout-header"
      v-if="$vuetify.breakpoint.smAndUp"
      dataId="custom-checkout-header"
    >
      <template #breadcrumb>
        <mp-breadcrumb />
      </template>
      <template #title>
        <h1 data-id="custom-checkout-header-title">
          {{ $t(`page.customCheckout.${isEdit ? 'editTitle' : 'title'}`) }}
        </h1>
      </template>
      <template #actions-button>
        <div class="actions-wrapper">
          <mp-button
            @click="cancel()"
            :text="$t('action.cancel.base')"
            format="link"
            linkColor="black"
            dataId="custom-checkout-header-cancel"
          />
          <mp-button
            :text="$t('action.save')"
            format="success"
            icon="content-save-outline"
            dataId="custom-checkout-header-submit"
            @click="submit()"
            :disabled="isSubmitDisabled"
          />
        </div>
      </template>
    </content-header>

    <v-row no-gutters class="mb-5">
      <!-- Infos -->
      <v-col cols="10" offset="1" class="custom-checkout-infos">
        <div class="custom-checkout-infos-illustration-wrapper">
          <v-img
            src="@/assets/illustrations/customCheckout.svg"
            class="custom-checkout-infos-illustration"
          />
        </div>
        <div class="custom-checkout-infos-content-wrapper">
          <span class="regular14"> {{ $t('page.customCheckout.infos.base') }} </span>
          <li class="regular14">{{ $t('page.customCheckout.infos.firstPoint') }}</li>
          <li class="regular14">{{ $t('page.customCheckout.infos.secondPoint') }}</li>
          <li class="regular14">{{ $t('page.customCheckout.infos.thirdPoint') }}</li>
          <li class="regular14">{{ $t('page.customCheckout.infos.fourthPoint') }}</li>
        </div>
      </v-col>

      <!-- Available block -->
      <v-col cols="12" class="custom-checkout-available-block">
        <v-row no-gutters>
          <!-- Legend -->
          <v-col cols="10" offset="1" class="custom-checkout-available-block-infos-wrapper">
            <div class="custom-checkout-available-block-infos">
              <h4 class="main-lighten-52">{{ $t('page.customCheckout.infos.availableBlock') }}</h4>

              <div class="mandatory-wrapper">
                <div class="mandatory-exemple" />
                <span class="regular12 main-lighten-28">
                  {{ $t('page.customCheckout.infos.mandatory') }}
                </span>
              </div>

              <div class="optional-wrapper">
                <div class="optional-exemple" />
                <span class="regular12 main-lighten-28">
                  {{ $t('page.customCheckout.infos.optional') }}
                </span>
              </div>

              <div class="recommanded-wrapper">
                <div class="recommanded-exemple-wrapper">
                  <v-img
                    src="@/assets/icons/customCheckout/woop_like.svg"
                    class="recommanded-exemple"
                  />
                </div>

                <span class="regular12 main-lighten-28">
                  {{ $t('page.customCheckout.infos.recommanded') }}
                </span>
              </div>
            </div>

            <div class="custom-checkout-available-block-dialog-btn-wrapper">
              <mp-button
                :text="$t('page.customCheckout.infos.dialogBtn')"
                icon="information-variant"
                format="link"
                linkColor="black"
                @click="showDetailBlocksModal = true"
                dataId="custom-checkout-infos-dialog-detail-btn"
              />
            </div>
          </v-col>

          <!-- available Block -->
          <v-col cols="10" offset="1" class="custom-checkout-draggable-available-blocks">
            <draggable
              :id="IDS.AVAILABLE_BLOCKS"
              v-model="availableBlocks"
              group="orderBlock"
              class="d-flex"
              ghost-class="moving-block"
              @end="checkEnd"
              :move="checkMoveAvailableBlocks"
            >
              <div
                v-for="block in availableBlocks"
                :key="block.name"
                :class="
                  `custom-checkout-draggable-available-block${
                    block.isOptional ? ' is-optional' : ''
                  }${block.isRecommended ? ' is-recommended' : ''}${
                    block.disabled ? ' disabled' : ''
                  }`
                "
              >
                <v-img
                  src="@/assets/icons/customCheckout/picto_block.svg"
                  class="img"
                  v-if="block.isRecommended"
                />
                <span class="medium14">
                  {{ $t(`page.customCheckout.blocks.${block.name.toLowerCase()}`) }}
                </span>
              </div>
            </draggable>
          </v-col>
        </v-row>
      </v-col>

      <!-- Name-->
      <v-col cols="10" offset="1" class="custom-checkout-name">
        <h3 class="mb-3">{{ $t('page.order.common.checkoutTitle') }}</h3>
        <v-row no-gutters>
          <v-col cols="6">
            <mp-textfield
              :label="`${$t('page.order.common.checkoutName')} *`"
              v-model="name"
              dataId="custom-checkout-name"
              @input="$v.name.$touch()"
              @blur="$v.name.$touch()"
              :errors="getModelErrors($v.name)"
              :isDirty="$v.name.$dirty"
            />
          </v-col>
        </v-row>
      </v-col>

      <!-- steps -->
      <v-col cols="10" offset="1" class="custom-checkout-steps">
        <!-- header -->
        <div class="custom-checkout-steps-header">
          <span class="medium14 main-lighten-52">
            {{ $t('page.customCheckout.steps.steps') }}
          </span>

          <div class="custom-checkout-steps-header-step-number ml-12" v-if="isStepShow('step1')">
            <span class="medium14">1</span>
          </div>

          <div v-if="isStepShow('step2')" class="custom-checkout-steps-header-seprator" />

          <div class="custom-checkout-steps-header-step-number" v-if="isStepShow('step2')">
            <span class="medium14">2</span>
          </div>

          <div v-if="isStepShow('step3')" class="custom-checkout-steps-header-seprator" />

          <div class="custom-checkout-steps-header-step-number" v-if="isStepShow('step3')">
            <span class="medium14">3</span>
          </div>

          <div v-if="isStepShow('step4')" class="custom-checkout-steps-header-seprator" />

          <div class="custom-checkout-steps-header-step-number" v-if="isStepShow('step4')">
            <span class="medium14">4</span>
          </div>

          <div v-if="isStepShow('step5')" class="custom-checkout-steps-header-seprator" />

          <div class="custom-checkout-steps-header-step-number" v-if="isStepShow('step5')">
            <span class="medium14">5</span>
          </div>

          <div v-if="numberOfStepsFilled < 5" class="custom-checkout-steps-header-seprator" />

          <div v-if="numberOfStepsFilled < 5" @click="addStep()" data-id="custom-checkout-add-step">
            <div class="custom-checkout-steps-header-add">
              <v-icon>mdi-plus</v-icon>
            </div>
          </div>
        </div>

        <!-- Steps -->
        <div class="custom-checkout-steps-dnd">
          <draggable
            :id="IDS.FIRST_STEP"
            v-model="steps.step1"
            group="orderBlock"
            ghost-class="moving-block"
            @end="checkEnd"
            v-if="steps.step1"
            :move="checkMove"
          >
            <div
              v-for="(block, index) in steps.step1"
              :key="`custom-checkout-steps-dnd-block-${index}`"
              :class="
                `custom-checkout-steps-dnd-block${!block.name ? ' empty' : ''}${
                  index - 1 > -1 && !steps.step1[index - 1].name ? ' opacity' : ''
                }${block.isOptional ? ' is-optional' : ''}`
              "
            >
              <custom-checkout-block-content
                :block="block"
                @removeBlock="blockBackToAvailableBlocks(IDS.FIRST_STEP, index)"
              />
            </div>
          </draggable>

          <draggable
            :id="IDS.SECOND_STEP"
            v-model="steps.step2"
            group="orderBlock"
            ghost-class="moving-block"
            @end="checkEnd"
            v-if="steps.step2"
          >
            <div
              v-for="(block, index) in steps.step2"
              :key="`custom-checkout-steps-dnd-block-${index}`"
              :class="
                `custom-checkout-steps-dnd-block${!block.name ? ' empty' : ''}${
                  index - 1 > -1 && !steps.step2[index - 1].name ? ' opacity' : ''
                }${block.isOptional ? ' is-optional' : ''}`
              "
            >
              <custom-checkout-block-content
                :block="block"
                @removeBlock="blockBackToAvailableBlocks(IDS.SECOND_STEP, index)"
              />
            </div>
          </draggable>

          <draggable
            :id="IDS.THIRD_STEP"
            v-model="steps.step3"
            group="orderBlock"
            ghost-class="moving-block"
            @end="checkEnd"
            v-if="steps.step3"
          >
            <div
              v-for="(block, index) in steps.step3"
              :key="`custom-checkout-steps-dnd-block-${index}`"
              :class="
                `custom-checkout-steps-dnd-block${!block.name ? ' empty' : ''}${
                  index - 1 > -1 && !steps.step3[index - 1].name ? ' opacity' : ''
                }${block.isOptional ? ' is-optional' : ''}`
              "
            >
              <custom-checkout-block-content
                :block="block"
                @removeBlock="blockBackToAvailableBlocks(IDS.THIRD_STEP, index)"
              />
            </div>
          </draggable>

          <draggable
            :id="IDS.FOURTH_STEP"
            v-model="steps.step4"
            group="orderBlock"
            ghost-class="moving-block"
            @end="checkEnd"
            v-if="steps.step4"
          >
            <div
              v-for="(block, index) in steps.step4"
              :key="`custom-checkout-steps-dnd-block-${index}`"
              :class="
                `custom-checkout-steps-dnd-block${!block.name ? ' empty' : ''}${
                  index - 1 > -1 && !steps.step4[index - 1].name ? ' opacity' : ''
                }${block.isOptional ? ' is-optional' : ''}`
              "
            >
              <custom-checkout-block-content
                :block="block"
                @removeBlock="blockBackToAvailableBlocks(IDS.FOURTH_STEP, index)"
              />
            </div>
          </draggable>

          <br />
          <draggable
            :id="IDS.FITH_STEP"
            v-model="steps.step5"
            group="orderBlock"
            ghost-class="moving-block"
            @end="checkEnd"
            v-if="steps.step5"
          >
            <div
              v-for="(block, index) in steps.step5"
              :key="`custom-checkout-steps-dnd-block-${index}`"
              :class="
                `custom-checkout-steps-dnd-block${!block.name ? ' empty' : ''}${
                  index - 1 > -1 && !steps.step5[index - 1].name ? ' opacity' : ''
                }${block.isOptional ? ' is-optional' : ''}`
              "
            >
              <custom-checkout-block-content
                :block="block"
                @removeBlock="blockBackToAvailableBlocks(IDS.FITH_STEP, index)"
              />
            </div>
          </draggable>
        </div>
      </v-col>

      <v-col cols="10" offset="1" class="d-flex justify-end">
        <mp-button
          @click="cancel()"
          :text="$t('action.cancel.base')"
          format="link"
          linkColor="black"
          dataId="custom-checkout-header-cancel"
        />
        <mp-button
          :text="$t('action.save')"
          format="success"
          icon="content-save-outline"
          dataId="custom-checkout-header-submit"
          @click="submit()"
          :disabled="isSubmitDisabled"
        />
      </v-col>
    </v-row>

    <custom-checkout-dialog-detail
      v-if="showDetailBlocksModal"
      @close="showDetailBlocksModal = false"
      @submit="showDetailBlocksModal = false"
      :blocks="getDefaultBlock"
    />

    <mp-dialog-confirmation
      v-if="showDeleteStepDialog"
      dataId="custom-checkout-dialog-delete-step"
      :textContent="$t('page.customCheckout.deleteStep', { number: saveStepIdForDelete[4] })"
      @close="showDeleteStepDialog = false"
      @submit="deleteStep()"
      color="error"
      :header="{
        icon: 'mdi-trash-can-outline',
        isColorBackground: false,
        iconClose: 'mdi-close',
      }"
      persistent
      :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
      :btnValidation="{ text: $t('action.delete.base'), format: 'error' }"
      :btnToColumn="$vuetify.breakpoint.xsOnly"
    />
  </div>
</template>

<script lang="ts">
/* eslint @typescript-eslint/no-non-null-asserted-optional-chain: off */
import contentHeader from '@/components/contentHeader/contentHeader.vue'
import customCheckoutBlockContent from '@/views/customCheckout/components/blockContent.vue'
import customCheckoutDialogDetail from '@/views/customCheckout/components/dialogDetail.vue'
import draggable from 'vuedraggable'
import mpBreadcrumb from '@/components/breadcrumb/breadcrumb.vue'
import { CHECKOUT_BLOCKS, CustomCheckoutBlock, Checkout, StoreEntity } from '@/types'
import { ROUTES } from '@/constants'
import RetailerService from '@/services/retailer/RetailerService'
import { SnackBarType } from '@/store/types'
import { SET_BREADCRUMBS_LABEL, SET_HEADER_TITLE } from '@/store/mutation-types'
import StoreService from '@/services/store/StoreService'
import CheckoutsService from '@/services/checkouts/checkoutsService'
import mixins from 'vue-typed-mixins'
import { required } from 'vuelidate/lib/validators'
import { validationMixin } from '@/mixins'

const defaultBlocks = (): CustomCheckoutBlock[] => {
  return [
    {
      name: CHECKOUT_BLOCKS.SCAN,
      isOptional: true,
      isRecommended: false,
      fakeId: 1,
      disabled: false,
    },
    {
      name: CHECKOUT_BLOCKS.DEPARTURE,
      isOptional: false,
      isRecommended: false,
      fakeId: 2,
      disabled: false,
    },
    {
      name: CHECKOUT_BLOCKS.ARRIVAL,
      isOptional: false,
      isRecommended: false,
      fakeId: 3,
      disabled: false,
    },
    {
      name: CHECKOUT_BLOCKS.ORDER_CONTENT,
      isOptional: false,
      isRecommended: false,
      fakeId: 4,
      disabled: false,
    },
    {
      name: CHECKOUT_BLOCKS.TICKET_CONTENT,
      isOptional: false,
      isRecommended: false,
      fakeId: 5,
      disabled: true,
    },
    {
      name: CHECKOUT_BLOCKS.SHIPPING_DATE,
      isOptional: false,
      isRecommended: false,
      fakeId: 6,
      disabled: false,
    },
    {
      name: CHECKOUT_BLOCKS.SERVICES,
      isOptional: false,
      isRecommended: false,
      fakeId: 7,
      disabled: false,
    },
    {
      name: CHECKOUT_BLOCKS.PICKUP_POINT,
      isOptional: false,
      isRecommended: false,
      fakeId: 8,
      disabled: false,
    },
    {
      name: CHECKOUT_BLOCKS.DELIVERY_DATE,
      isOptional: false,
      isRecommended: false,
      fakeId: 9,
      disabled: false,
    },
    {
      name: CHECKOUT_BLOCKS.CARRIERS,
      isOptional: true,
      isRecommended: false,
      fakeId: 10,
      disabled: false,
    },
    {
      name: CHECKOUT_BLOCKS.CUSTOMER_CODE,
      isOptional: false,
      isRecommended: false,
      fakeId: 11,
      disabled: false,
    },
    {
      name: CHECKOUT_BLOCKS.SHIPPING_CONTACT,
      isOptional: false,
      isRecommended: false,
      fakeId: 12,
      disabled: false,
    },
    {
      name: CHECKOUT_BLOCKS.DELIVERY_CONTACT,
      isOptional: false,
      isRecommended: false,
      fakeId: 13,
      disabled: false,
    },
    {
      name: CHECKOUT_BLOCKS.STATE,
      isOptional: true,
      isRecommended: false,
      fakeId: 14,
      disabled: false,
    },
  ]
}

export interface Steps {
  step1: CustomCheckoutBlock[]
  step2: CustomCheckoutBlock[] | null
  step3: CustomCheckoutBlock[] | null
  step4: CustomCheckoutBlock[] | null
  step5: CustomCheckoutBlock[] | null
}

const defaultBlock = (): CustomCheckoutBlock => {
  return {
    name: '',
    isOptional: false,
    isRecommended: false,
    disabled: false,
  }
}

const defaultStep = (): CustomCheckoutBlock[] => {
  return [defaultBlock(), defaultBlock(), defaultBlock(), defaultBlock(), defaultBlock()]
}

enum IDS {
  AVAILABLE_BLOCKS = 'available-blocks',
  FIRST_STEP = 'step1',
  SECOND_STEP = 'step2',
  THIRD_STEP = 'step3',
  FOURTH_STEP = 'step4',
  FITH_STEP = 'step5',
}

const matrix = {
  [CHECKOUT_BLOCKS.SENDER_IDENTITY]: [
    CHECKOUT_BLOCKS.DEPARTURE,
    CHECKOUT_BLOCKS.ARRIVAL,
    CHECKOUT_BLOCKS.SHIPPING_DATE,
    CHECKOUT_BLOCKS.DELIVERY_DATE,
    CHECKOUT_BLOCKS.SERVICES,
    CHECKOUT_BLOCKS.CUSTOMER_CODE,
    CHECKOUT_BLOCKS.CARRIERS,
    CHECKOUT_BLOCKS.SHIPPING_CONTACT,
    CHECKOUT_BLOCKS.DELIVERY_CONTACT,
    CHECKOUT_BLOCKS.PICKUP_POINT,
    CHECKOUT_BLOCKS.SCAN,
    CHECKOUT_BLOCKS.STATE
  ],
  [CHECKOUT_BLOCKS.SCAN]: [
    CHECKOUT_BLOCKS.DEPARTURE,
    CHECKOUT_BLOCKS.ARRIVAL,
    CHECKOUT_BLOCKS.SHIPPING_DATE,
    CHECKOUT_BLOCKS.DELIVERY_DATE,
    CHECKOUT_BLOCKS.SERVICES,
    CHECKOUT_BLOCKS.CUSTOMER_CODE,
    CHECKOUT_BLOCKS.CARRIERS,
    CHECKOUT_BLOCKS.SHIPPING_CONTACT,
    CHECKOUT_BLOCKS.DELIVERY_CONTACT,
    CHECKOUT_BLOCKS.PICKUP_POINT,
    CHECKOUT_BLOCKS.STATE
  ],
  [CHECKOUT_BLOCKS.DEPARTURE]: [
    CHECKOUT_BLOCKS.ARRIVAL,
    CHECKOUT_BLOCKS.SHIPPING_DATE,
    CHECKOUT_BLOCKS.DELIVERY_DATE,
    CHECKOUT_BLOCKS.SERVICES,
    CHECKOUT_BLOCKS.CUSTOMER_CODE,
    CHECKOUT_BLOCKS.CARRIERS,
    CHECKOUT_BLOCKS.SHIPPING_CONTACT,
    CHECKOUT_BLOCKS.DELIVERY_CONTACT,
    CHECKOUT_BLOCKS.PICKUP_POINT,
    CHECKOUT_BLOCKS.SCAN,
    CHECKOUT_BLOCKS.STATE
  ],
  [CHECKOUT_BLOCKS.ARRIVAL]: [
    CHECKOUT_BLOCKS.DEPARTURE,
    CHECKOUT_BLOCKS.SHIPPING_DATE,
    CHECKOUT_BLOCKS.DELIVERY_DATE,
    CHECKOUT_BLOCKS.SERVICES,
    CHECKOUT_BLOCKS.CUSTOMER_CODE,
    CHECKOUT_BLOCKS.CARRIERS,
    CHECKOUT_BLOCKS.SHIPPING_CONTACT,
    CHECKOUT_BLOCKS.DELIVERY_CONTACT,
    CHECKOUT_BLOCKS.PICKUP_POINT,
    CHECKOUT_BLOCKS.STATE
  ],
  [CHECKOUT_BLOCKS.ORDER_CONTENT]: [CHECKOUT_BLOCKS.STATE],
  [CHECKOUT_BLOCKS.TICKET_CONTENT]: [CHECKOUT_BLOCKS.STATE],
  [CHECKOUT_BLOCKS.SHIPPING_DATE]: [
    CHECKOUT_BLOCKS.DEPARTURE,
    CHECKOUT_BLOCKS.ARRIVAL,
    CHECKOUT_BLOCKS.DELIVERY_DATE,
    CHECKOUT_BLOCKS.SERVICES,
    CHECKOUT_BLOCKS.CUSTOMER_CODE,
    CHECKOUT_BLOCKS.CARRIERS,
    CHECKOUT_BLOCKS.SHIPPING_CONTACT,
    CHECKOUT_BLOCKS.DELIVERY_CONTACT,
    CHECKOUT_BLOCKS.PICKUP_POINT,
    CHECKOUT_BLOCKS.SCAN,
    CHECKOUT_BLOCKS.STATE
  ],
  [CHECKOUT_BLOCKS.DELIVERY_DATE]: [
    CHECKOUT_BLOCKS.DEPARTURE,
    CHECKOUT_BLOCKS.ARRIVAL,
    CHECKOUT_BLOCKS.SERVICES,
    CHECKOUT_BLOCKS.CUSTOMER_CODE,
    CHECKOUT_BLOCKS.CARRIERS,
    CHECKOUT_BLOCKS.SHIPPING_CONTACT,
    CHECKOUT_BLOCKS.DELIVERY_CONTACT,
    CHECKOUT_BLOCKS.PICKUP_POINT,
    CHECKOUT_BLOCKS.SCAN,
    CHECKOUT_BLOCKS.STATE
  ],
  [CHECKOUT_BLOCKS.SERVICES]: [
    CHECKOUT_BLOCKS.SHIPPING_DATE,
    CHECKOUT_BLOCKS.DELIVERY_DATE,
    CHECKOUT_BLOCKS.CUSTOMER_CODE,
    CHECKOUT_BLOCKS.CARRIERS,
    CHECKOUT_BLOCKS.SHIPPING_CONTACT,
    CHECKOUT_BLOCKS.DELIVERY_CONTACT,
    CHECKOUT_BLOCKS.SCAN,
    CHECKOUT_BLOCKS.STATE
  ],
  [CHECKOUT_BLOCKS.CUSTOMER_CODE]: [
    CHECKOUT_BLOCKS.DEPARTURE,
    CHECKOUT_BLOCKS.ARRIVAL,
    CHECKOUT_BLOCKS.SHIPPING_DATE,
    CHECKOUT_BLOCKS.DELIVERY_DATE,
    CHECKOUT_BLOCKS.SERVICES,
    CHECKOUT_BLOCKS.CARRIERS,
    CHECKOUT_BLOCKS.SHIPPING_CONTACT,
    CHECKOUT_BLOCKS.DELIVERY_CONTACT,
    CHECKOUT_BLOCKS.SCAN,
    CHECKOUT_BLOCKS.STATE
  ],
  [CHECKOUT_BLOCKS.STATE]: [
    CHECKOUT_BLOCKS.DEPARTURE,
    CHECKOUT_BLOCKS.ARRIVAL,
    CHECKOUT_BLOCKS.SHIPPING_DATE,
    CHECKOUT_BLOCKS.DELIVERY_DATE,
    CHECKOUT_BLOCKS.CUSTOMER_CODE,
    CHECKOUT_BLOCKS.SERVICES,
    CHECKOUT_BLOCKS.CARRIERS,
    CHECKOUT_BLOCKS.SHIPPING_CONTACT,
    CHECKOUT_BLOCKS.DELIVERY_CONTACT,
    CHECKOUT_BLOCKS.SCAN,
  ],
  [CHECKOUT_BLOCKS.CARRIERS]: [
    CHECKOUT_BLOCKS.SHIPPING_CONTACT,
    CHECKOUT_BLOCKS.DELIVERY_CONTACT,
    CHECKOUT_BLOCKS.PICKUP_POINT,
    CHECKOUT_BLOCKS.SCAN,
    CHECKOUT_BLOCKS.STATE
  ],
  [CHECKOUT_BLOCKS.SHIPPING_CONTACT]: [CHECKOUT_BLOCKS.DELIVERY_CONTACT, CHECKOUT_BLOCKS.SCAN,CHECKOUT_BLOCKS.STATE],
  [CHECKOUT_BLOCKS.DELIVERY_CONTACT]: [CHECKOUT_BLOCKS.STATE],
  [CHECKOUT_BLOCKS.PICKUP_POINT]: [
    CHECKOUT_BLOCKS.DEPARTURE,
    CHECKOUT_BLOCKS.ORDER_CONTENT,
    CHECKOUT_BLOCKS.DELIVERY_DATE,
    CHECKOUT_BLOCKS.CUSTOMER_CODE,
    CHECKOUT_BLOCKS.CARRIERS,
    CHECKOUT_BLOCKS.SHIPPING_CONTACT,
    CHECKOUT_BLOCKS.DELIVERY_CONTACT,
    CHECKOUT_BLOCKS.SCAN,
    CHECKOUT_BLOCKS.STATE
  ],
}

const advisedMatrix = {
  [CHECKOUT_BLOCKS.SENDER_IDENTITY]: [CHECKOUT_BLOCKS.DEPARTURE],
  [CHECKOUT_BLOCKS.DEPARTURE]: [CHECKOUT_BLOCKS.ARRIVAL],
  [CHECKOUT_BLOCKS.ARRIVAL]: [],
  [CHECKOUT_BLOCKS.ORDER_CONTENT]: [],
  [CHECKOUT_BLOCKS.SHIPPING_DATE]: [CHECKOUT_BLOCKS.SERVICES],
  [CHECKOUT_BLOCKS.SERVICES]: [],
  [CHECKOUT_BLOCKS.DELIVERY_DATE]: [CHECKOUT_BLOCKS.CARRIERS, CHECKOUT_BLOCKS.PICKUP_POINT],
  [CHECKOUT_BLOCKS.CARRIERS]: [CHECKOUT_BLOCKS.PICKUP_POINT],
  [CHECKOUT_BLOCKS.PICKUP_POINT]: [CHECKOUT_BLOCKS.CARRIERS],
  [CHECKOUT_BLOCKS.CUSTOMER_CODE]: [CHECKOUT_BLOCKS.SHIPPING_CONTACT],
  [CHECKOUT_BLOCKS.SHIPPING_CONTACT]: [CHECKOUT_BLOCKS.DELIVERY_CONTACT],
  [CHECKOUT_BLOCKS.DELIVERY_CONTACT]: [],
}

export default mixins(validationMixin).extend({
  name: 'customCheckout',
  components: {
    contentHeader,
    customCheckoutBlockContent,
    customCheckoutDialogDetail,
    draggable,
    mpBreadcrumb,
  },
  data: () => ({
    availableBlocks: [] as CustomCheckoutBlock[],
    showDetailBlocksModal: false,
    steps: {
      step1: defaultStep(),
      step2: null,
      step3: null,
      step4: null,
      step5: null,
    } as Steps,
    IDS,
    hasLoaded: false as boolean,
    localCheckout: null as Checkout | null,
    showDeleteStepDialog: false,
    saveStepIdForDelete: null as string | null,
    name: '',
  }),
  computed: {
    getDefaultBlock(): CustomCheckoutBlock[] {
      return [
        {
          name: CHECKOUT_BLOCKS.SENDER_IDENTITY,
          isOptional: false,
          isRecommended: false,
          fakeId: 0,
          disabled: false,
        },
        ...defaultBlocks(),
      ]
    },
    isSubmitDisabled(): boolean {
      let aloneRule = false
      const cantBeAloneArray = [
        CHECKOUT_BLOCKS.SENDER_IDENTITY,
        CHECKOUT_BLOCKS.PICKUP_POINT,
        CHECKOUT_BLOCKS.SCAN,
      ]
      let numberOfStep = 0

      for (const stepKey in this.steps) {
        if (this.steps[stepKey as keyof Steps]) {
          if (this.steps[stepKey as keyof Steps]?.filter(block => block.name).length) {
            numberOfStep++
          }

          if (
            this.steps[stepKey as keyof Steps]?.filter(block => block.name).length === 1 &&
            cantBeAloneArray.includes(
              this.steps[stepKey as keyof Steps]?.[0].name as CHECKOUT_BLOCKS,
            )
          ) {
            aloneRule = true
          }
        }
      }

      const stepsKeys = Object.keys(this.steps)
      const lastStep = this.steps[stepsKeys[numberOfStep - 1] as keyof Steps]?.filter(
        block => block.name,
      )

      return (
        this.availableBlocks.some(block => !block.isOptional && !block.disabled) ||
        this.steps[IDS.FIRST_STEP][0].name !== CHECKOUT_BLOCKS.SENDER_IDENTITY ||
        !lastStep ||
        lastStep[lastStep?.length - 1]?.name !== CHECKOUT_BLOCKS.DELIVERY_CONTACT ||
        aloneRule ||
        this.$v.$invalid
      )
    },
    numberOfStepsFilled(): number {
      let numberOfStep = 0
      for (const stepKey in this.steps) {
        if (this.steps[stepKey as keyof Steps]) {
          numberOfStep++
        }
      }
      return numberOfStep
    },
    isEdit(): boolean {
      return (
        this.$route.name === ROUTES.retailerEditCustomCheckout ||
        this.$route.name === ROUTES.storeEditCustomCheckout
      )
    },
  },
  validations: {
    name: { required },
  },
  async beforeMount() {
    try {
      const retailer = await RetailerService.get(parseInt(this.$route.params.id, 10))
      let store: StoreEntity | null = null

      if (this.$route.params.storeId) {
        store = await StoreService.get(parseInt(this.$route.params.storeId, 10))
      }

      const localBlocks = defaultStep()
      localBlocks[0] = {
        name: CHECKOUT_BLOCKS.SENDER_IDENTITY,
        isOptional: false,
        isRecommended: false,
        disabled: false,
      }
      this.steps.step1 = localBlocks
      this.availableBlocks = defaultBlocks()

      if (this.isEdit) {
        this.localCheckout = await CheckoutsService.get(parseInt(this.$route.params.checkoutId, 10))

        if (this.localCheckout?.published) {
          this.$router.push({ name: ROUTES.notFound })
        }

        this.name = this.localCheckout.name

        for (const step in this.localCheckout?.steps) {
          if (this.localCheckout?.steps[step as keyof Steps]) {
            this.steps[step as keyof Steps] = this.localCheckout?.steps[step as keyof Steps].map(
              block => {
                const availableIndex = this.availableBlocks.findIndex(
                  localBlock => localBlock.name === block,
                )
                if (availableIndex > -1) {
                  this.availableBlocks.splice(availableIndex, 1)
                }

                return { ...defaultBlocks().find(localBlock => localBlock.name === block)! }
              },
            )

            for (let length = this.steps[step as keyof Steps]!.length; length < 5; length++) {
              this.steps[step as keyof Steps]!.push(defaultBlock())
            }
          }
        }

        this.steps[IDS.FIRST_STEP][0] = {
          name: CHECKOUT_BLOCKS.SENDER_IDENTITY,
          isOptional: false,
          isRecommended: false,
          disabled: false,
        }
      }

      const breadcrumbLabel = { retailers: retailer.name, ...(store && { stores: store.name }) }

      this.$store.commit(SET_BREADCRUMBS_LABEL, JSON.stringify(breadcrumbLabel))

      this.$store.commit(SET_HEADER_TITLE, store ? store.name : retailer.name)

      this.hasLoaded = true
    } catch (e) {
      this.$store.dispatch('setSnackbar', {
        type: SnackBarType.ERROR,
        message: this.$t('messages.error'),
      })
    }
  },
  methods: {
    isStepShow(stepId: string): boolean {
      return Boolean(this.steps[stepId as keyof Steps])
    },
    addStep(): void {
      if (!this.steps.step2) {
        this.steps = { ...this.steps, step2: defaultStep() }
      } else if (!this.steps.step3) {
        this.steps = { ...this.steps, step3: defaultStep() }
      } else if (!this.steps.step4) {
        this.steps = { ...this.steps, step4: defaultStep() }
      } else if (!this.steps.step5) {
        this.steps = { ...this.steps, step5: defaultStep() }
      }
    },
    checkMove(event: any) {
      return event.draggedContext.element.name !== CHECKOUT_BLOCKS.SENDER_IDENTITY
    },
    checkMoveAvailableBlocks(event: any) {
      return !event.draggedContext.element.disabled
    },
    checkEnd(event: any): void {
      if (event.from.id === event.to.id && event.from.id === IDS.AVAILABLE_BLOCKS) {
        this.availableBlocks.sort((blackA, blockB) => blackA.fakeId! - blockB.fakeId!)
        return
      } else if (event.to.id === IDS.AVAILABLE_BLOCKS) {
        const block = this.availableBlocks.splice(event.newIndex, 1)[0]!
        this.steps[event.from.id as keyof Steps]?.splice(event.oldIndex, 0, block)
        return
      }

      if (event.to.id === event.from.id && !this.isCurrentStepHaveEmptyBlock(event.to.id)) {
        if (
          !this.rulesMatrix(
            event.to.id,
            this.steps[event.to.id as keyof Steps]![event.newIndex].name,
          )
        ) {
          this.removeBlockFromStepAndPutInOldPosition(
            event.to.id,
            event.newIndex,
            event.from.id,
            event.oldIndex,
          )
          return
        }
      } else if (this.isCurrentStepHaveEmptyBlock(event.to.id)) {
        if (
          // move inside the same step
          event.from.id === event.to.id &&
          // if it's a real block
          Boolean(this.steps[event.to.id as keyof Steps]![event.newIndex].name) &&
          // if put in the middle of real block
          !this.hasEmptyBefore(event.to.id, event.newIndex)
        ) {
          if (
            !this.rulesMatrix(
              event.to.id,
              this.steps[event.to.id as keyof Steps]![event.newIndex].name,
            )
          ) {
            this.removeBlockFromStepAndPutInOldPosition(
              event.to.id,
              event.newIndex,
              event.from.id,
              event.oldIndex,
            )
            return
          }
        } else {
          const previousBlock = this.steps[event.to.id as keyof Steps]![event.newIndex - 1]
          const nextBlock = this.steps[event.to.id as keyof Steps]![event.newIndex + 1]
          const blockName = this.steps[event.to.id as keyof Steps]![event.newIndex].name

          if ((previousBlock && !previousBlock.name) || (nextBlock && !nextBlock.name)) {
            // remove the new block from the list
            const block = this.steps[event.to.id as keyof Steps]?.splice(event.newIndex, 1)[0]

            if (block?.name) {
              // put the new block at the place of the first empty block
              this.steps[event.to.id as keyof Steps]?.splice(
                this.getFirstIndexOfEmptyBlock(event.to.id)!,
                0,
                block,
              )

              // remove the first empty block
              this.steps[event.to.id as keyof Steps]?.splice(
                this.getFirstIndexOfEmptyBlock(event.to.id)!,
                1,
              )
            }
          } else {
            // remove the first empty block
            this.steps[event.to.id as keyof Steps]?.splice(
              this.getFirstIndexOfEmptyBlock(event.to.id)!,
              1,
            )
          }

          if (event.from.id !== IDS.AVAILABLE_BLOCKS) {
            this.steps[event.from.id as keyof Steps]?.push(defaultBlock())
          }

          if (!this.rulesMatrix(event.to.id, blockName)) {
            this.removeBlockFromStepAndPutInOldPosition(
              event.to.id,
              this.steps[event.to.id as keyof Steps]!.findIndex(bk => bk.name === blockName),
              event.from.id,
              event.oldIndex,
              true,
            )
          }

          if (this.getFirstIndexOfEmptyBlock(event.from.id) === 0) {
            this.saveStepIdForDelete = event.from.id
            this.showDeleteStepDialog = true
          }
        }
      } else {
        this.removeBlockFromStepAndPutInOldPosition(
          event.to.id,
          event.newIndex,
          event.from.id,
          event.oldIndex,
        )
      }
      return
    },
    rulesMatrix(stepId: string, blockName: string): boolean {
      const previousStepsBlocks = this.previousStepsBlocks(stepId, blockName)
      const nextStepsBlocks = this.nextStepsBlocks(stepId, blockName)

      let previousIsOkay = true
      let nextIsOkay = true

      for (const previousBlocks of previousStepsBlocks) {
        const isRuleOkay = ((matrix as any)[previousBlocks.name] as string[]).includes(blockName)

        if (!isRuleOkay) {
          if (blockName !== '') {
            this.$store.dispatch('setSnackbar', {
              type: SnackBarType.ERROR,
              message: this.$t('page.customCheckout.error', {
                firstBlock: this.$t(`page.customCheckout.blocks.${previousBlocks.name.toLowerCase()}`),
                secondBlock: this.$t(`page.customCheckout.blocks.${blockName.toLowerCase()}`),
              }),
              timeout: 4000,
            })
          }
          previousIsOkay = isRuleOkay
          return false
        }
      }

      for (const nextBlocks of nextStepsBlocks) {
        const isRuleOkay = ((matrix as any)[blockName] as string[]).includes(nextBlocks.name)

        if (!isRuleOkay) {
          if (blockName !== '') {
            this.$store.dispatch('setSnackbar', {
              type: SnackBarType.ERROR,
              message: this.$t('page.customCheckout.error', {
                firstBlock: this.$t(`page.customCheckout.blocks.${blockName.toLowerCase()}`),
                secondBlock: this.$t(`page.customCheckout.blocks.${nextBlocks.name.toLowerCase()}`),
              }),
              timeout: 4000,
            })
          }
          nextIsOkay = isRuleOkay
          return false
        }
      }

      return previousIsOkay && nextIsOkay
    },
    removeBlockFromStepAndPutInOldPosition(
      toId: string,
      blockIndex: number,
      fromId: string,
      oldIndex: number,
      addEmptyInDestinationStep = false,
    ): void {
      const block = this.steps[toId as keyof Steps]?.splice(blockIndex, 1)[0]!

      if (fromId === IDS.AVAILABLE_BLOCKS) {
        this.availableBlocks.splice(oldIndex, 0, block)
      } else {
        this.steps[fromId as keyof Steps]?.splice(oldIndex, 0, block)
      }

      if (addEmptyInDestinationStep) {
        this.steps[toId as keyof Steps]?.push(defaultBlock())

        if (fromId !== IDS.AVAILABLE_BLOCKS) {
          this.steps[fromId as keyof Steps]?.splice(this.getFirstIndexOfEmptyBlock(fromId)!, 1)
        }
      }
    },
    isCurrentStepHaveEmptyBlock(stepId: string): boolean {
      return !!this.steps[stepId as keyof Steps]?.some(block => !block.name)
    },
    getFirstIndexOfEmptyBlock(stepId: string): number | undefined {
      return this.steps[stepId as keyof Steps]?.findIndex(block => !block.name)
    },
    hasEmptyBefore(stepId: string, index: number) {
      return this.getFirstIndexOfEmptyBlock(stepId)! < index
    },
    blockBackToAvailableBlocks(stepId: string, index: number): void {
      const block = this.steps[stepId as keyof Steps]?.splice(index, 1)[0]!
      this.steps[stepId as keyof Steps]?.push(defaultBlock())

      this.availableBlocks.push(block)
      this.availableBlocks.sort((blackA, blockB) => blackA.fakeId! - blockB.fakeId!)

      if (this.getFirstIndexOfEmptyBlock(stepId) === 0) {
        this.saveStepIdForDelete = stepId
        this.showDeleteStepDialog = true
      }
    },
    previousStepsBlocks(stepId: string, blockName: string): CustomCheckoutBlock[] {
      let blocks = this.steps[stepId as keyof Steps]?.filter(block => block.name)!

      if (stepId === stepId && blocks) {
        blocks = blocks.slice(
          0,
          this.steps[stepId as keyof Steps]?.findIndex(block => block.name === blockName),
        )
      }

      return blocks
    },
    nextStepsBlocks(stepId: string, blockName: string): CustomCheckoutBlock[] {
      let blocks = this.steps[stepId as keyof Steps]?.filter(block => block.name)!

      if (stepId === stepId && blocks) {
        blocks = blocks.slice(
          this.steps[stepId as keyof Steps]?.findIndex(block => block.name === blockName)! + 1,
          this.steps[stepId as keyof Steps]?.length,
        )
      }

      return blocks
    },
    cancel(): void {
      if (this.$route.params.storeId) {
        this.$router.push({
          name: ROUTES.detailStore,
          params: { id: this.$route.params.id, storeId: this.$route.params.storeId },
        })

        return
      }

      this.$router.push({ name: ROUTES.detailRetailer, params: { id: this.$route.params.id } })
    },
    async submit(): Promise<void> {
      try {
        const payload = {
          steps: {} as {
            step1?: string[]
            step2?: string[]
            step3?: string[]
            step4?: string[]
            step5?: string[]
          },
          published: false,
          name: this.name,
          retailerId: this.$route.params.id,
          storeId: this.$route.params.storeId,
        }

        for (const step in this.steps) {
          if (this.steps[step as keyof Steps]) {
            const stepHasBlock = this.steps[step as keyof Steps]?.map(block => block.name).filter(
              block => block,
            ).length
            payload.steps[step as keyof Steps] = stepHasBlock
              ? this.steps[step as keyof Steps]?.map(block => block.name).filter(block => block)
              : undefined
          }
        }

        if (this.isEdit) {
          await CheckoutsService.update(parseInt(this.$route.params.checkoutId, 10), payload as any)
        } else {
          await CheckoutsService.create(payload as any)
        }

        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.SUCCESS,
          message: this.$t(
            this.isEdit ? 'messages.customCheckoutEdit' : 'messages.customCheckoutCreated',
          ),
        })

        if (this.$route.params.storeId) {
          this.$router.push({
            name: ROUTES.detailStore,
            params: { id: this.$route.params.id, storeId: this.$route.params.storeId },
          })

          return
        }
        this.$router.push({ name: ROUTES.detailRetailer, params: { id: this.$route.params.id } })
      } catch (e) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      }
    },
    deleteStep(): void {
      const steps = Object.values(IDS)
      let stepDeletedNumber = parseInt(this.saveStepIdForDelete![4], 10)

      for (
        let stepNumber = stepDeletedNumber + 1;
        this.steps[steps[stepNumber] as keyof Steps];
        stepNumber++
      ) {
        this.steps[steps[stepDeletedNumber] as keyof Steps] = this.steps[
          steps[stepNumber] as keyof Steps
        ]!
        stepDeletedNumber++
      }

      this.steps[steps[this.numberOfStepsFilled] as keyof Steps] = null as any
      this.saveStepIdForDelete = null
      this.showDeleteStepDialog = false
    },
  },
  watch: {
    steps: {
      deep: true,
      handler(next) {
        const firstIndex = this.getFirstIndexOfEmptyBlock(`step${this.numberOfStepsFilled}`)
        const lastBlockName =
          next[`step${this.numberOfStepsFilled}`][
            firstIndex && firstIndex > -1 ? firstIndex - 1 : 4
          ].name

        const advicedBlocks = (advisedMatrix as any)[lastBlockName]

        // reset recommand
        for (const step in this.steps) {
          if (this.steps[step as keyof Steps]) {
            for (const block of this.steps[step as keyof Steps]!) {
              block.isRecommended = false
            }
          }
        }

        // set new recommand
        for (const block of this.availableBlocks) {
          block.isRecommended = !!(advicedBlocks && advicedBlocks.includes(block.name))
        }
      },
    },
    availableBlocks(next: CustomCheckoutBlock[]) {
      const hasOrderContent = next.find(n => n.name === CHECKOUT_BLOCKS.ORDER_CONTENT)
      const hasTicketContent = next.find(n => n.name === CHECKOUT_BLOCKS.TICKET_CONTENT)

      if (hasOrderContent && hasTicketContent) {
        hasOrderContent.disabled = false
        hasTicketContent.disabled = false
      } else if (!hasOrderContent) {
        hasTicketContent!.disabled = true
      } else if (!hasTicketContent) {
        hasOrderContent!.disabled = true
      }
    },
  },
})
</script>

<style lang="scss">
@import '../../styles/mixins/macScrollbar';
#custom-checkout {
  .custom-checkout-infos {
    border: 0.1rem solid $main-lighten-65-color;
    border-radius: 0.4rem;
    display: flex;
    height: 14.4rem;

    .custom-checkout-infos-illustration-wrapper {
      max-width: 32.7rem;
      display: flex;
    }

    .custom-checkout-infos-content-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-left: 2.5rem;

      li {
        padding-left: 1rem;
      }
    }
  }

  .custom-checkout-name {
    margin-top: 3rem;
  }

  .custom-checkout-available-block {
    margin-top: 3rem;
    background-color: $main-lighten-80-color;
    padding-top: 2.4rem;
    padding-bottom: 3.7rem;

    .custom-checkout-available-block-infos-wrapper {
      display: flex;
      align-items: center;
      margin-bottom: 1.1rem;

      .custom-checkout-available-block-infos {
        display: flex;

        .mandatory-wrapper {
          display: flex;
          align-items: center;
          margin-left: 4.5rem;

          .mandatory-exemple {
            width: 3rem;
            height: 1.5rem;
            background-color: $white;
            border: 0.1rem solid $main-color;
            border-radius: 0.2rem;
            margin-right: 0.8rem;
          }
        }

        .optional-wrapper {
          display: flex;
          align-items: center;
          margin-left: 3rem;

          .optional-exemple {
            width: 3rem;
            height: 1.5rem;
            background-color: $white;
            border: 0.1rem dashed $main-color;
            border-radius: 0.2rem;
            margin-right: 0.8rem;
          }
        }

        .recommanded-wrapper {
          display: flex;
          align-items: center;
          margin-left: 3rem;

          .recommanded-exemple-wrapper {
            width: 3rem;
            height: 1.5rem;
            background-color: $primary-color;
            border-radius: 0.2rem;
            margin-right: 0.8rem;
            display: flex;
            align-items: center;
            justify-content: center;

            .recommanded-exemple {
              max-width: 2.6rem;
              max-height: 1.2rem;
            }
          }
        }
      }

      .custom-checkout-available-block-dialog-btn-wrapper {
        margin-left: auto;
      }
    }

    .custom-checkout-draggable-available-blocks {
      display: flex;
      overflow-x: auto;
      @include setMacScrollbar('&');
      padding-right: 1rem;

      .custom-checkout-draggable-available-block {
        width: 12rem;
        height: 6rem;
        background-color: $white;
        border: 0.1rem solid $main-color;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        word-break: break-word;
        padding: 0.5rem;
        margin-left: 1.5rem;
        box-sizing: border-box;
        border-radius: 0.4rem;
        cursor: grabbing;
        position: relative;

        &.is-recommended {
          .img {
            position: absolute;
            left: 0;
            top: 0;
          }
        }

        &.disabled {
          cursor: not-allowed;
          background-color: $main-lighten-80-color;
          position: relative;
          overflow: hidden;
          border: 0.1rem dashed $main-lighten-74-color;
          color: $main-lighten-65-color;

          &:before {
            position: absolute;
            content: '';
            background: $main-lighten-65-color;
            display: block;
            width: 18.9rem;
            height: 0.1rem;
            -webkit-transform: rotate(-25deg);
            transform: rotate(-25deg);
            margin: auto;
          }
        }

        &.is-optional {
          border: 0.1rem dashed $main-color;
        }

        &:first-of-type {
          margin-left: 0;
        }
      }
    }
  }

  .custom-checkout-steps {
    margin-top: 3rem;
    margin-bottom: 3.1rem;

    .custom-checkout-steps-header {
      display: flex;
      align-items: center;
      margin-right: 7.8rem;

      .custom-checkout-steps-header-step-number {
        height: 2.6rem;
        width: 2.6rem;
        background-color: $success-color;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: $white;
      }

      .custom-checkout-steps-header-add {
        height: 5rem;
        width: 5rem;
        background-color: $primary-color;
        border: 0.2rem solid $main-color;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }

      .custom-checkout-steps-header-seprator {
        width: calc((100% - 5rem - (2.6rem * 5) - 4.8rem) / 4);
        height: 0.1rem;
        background-color: $main-lighten-74-color;
      }
    }

    .custom-checkout-steps-dnd {
      margin-top: 1.1rem;
      display: flex;

      #step1,
      #step2,
      #step3,
      #step4,
      #step5 {
        width: 19rem;
        margin-left: calc(((100% - (19rem * 5)) / 4)); // 3.8rem;

        &:first-of-type {
          margin-left: 0;
        }
      }

      .custom-checkout-steps-dnd-block {
        height: 9.3rem;
        background-color: $white;
        border: 0.1rem solid $main-color;
        border-radius: 0.4rem;
        margin-bottom: 2rem;
        cursor: grabbing;

        &.is-optional {
          border: 0.1rem dashed $main-color;
        }

        &.empty {
          background-color: $main-lighten-80-color;
          border: 0.1rem dashed $main-lighten-52-color;

          &.opacity {
            opacity: 0.3;
          }
        }

        &:hover {
          .mdi-close-circle {
            color: $main-color !important;
          }
        }

        &:last-of-type {
          margin-bottom: 0;
        }

        .custom-checkout-steps-dnd-block-wrapper {
          height: 100%;
          position: relative;

          .custom-checkout-steps-dnd-block-header {
            right: 0;
            display: flex;
            justify-content: flex-end;
            padding-right: 0.9rem;
            padding-top: 0.8rem;
            position: absolute;

            .mdi-close-circle {
              cursor: pointer;
              color: $main-lighten-65-color;
            }
          }

          .custom-checkout-steps-dnd-block-content {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
          }
        }
      }
    }
  }

  .moving-block {
    display: none;
  }
}
</style>
