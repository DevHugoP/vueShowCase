<template>
  <v-container :id="id" class="light-contact-component-contact" :data-id="id">
    <v-row no-gutters class="light-contact-dsk" v-if="$vuetify.breakpoint.smAndUp && hasData">
      <v-col cols="12">
        <mp-block :id="`block-${id}`" :title="title">
          <v-row no-gutters class="action-show-outter-wrapper" v-if="!showInformation">
            <v-col cols="12" class="action-show-wrapper">
              <mp-button
                :dataId="`${id}-showInformation`"
                :text="$t('page.detailOrder.retailer.display')"
                format="primary"
                @click="handleClickShow()"
              />
            </v-col>
          </v-row>

          <v-row no-gutters class="information-outter-wrapper" v-if="showInformation && hasData">
            <v-col cols="12" class="contact-information-container">
              <v-row no-gutters class="information-persona-outter-wrapper">
                <v-col cols="12" class="information-persona-wrapper">
                  <div class="persona">
                    <v-icon size="1.8rem">mdi-account</v-icon>
                  </div>

                  <span class="contact-value regular14" :data-id="`${id}-fullName`">
                    {{ contact.firstName }} {{ contact.lastName }}
                  </span>
                </v-col>
              </v-row>

              <v-row
                v-if="isAuthorized('CALL_CLIENT')"
                no-gutters 
                class="information-phone-outter-wrapper"
              >
                <v-col cols="12" class="information-phone-wrapper" :data-id="`${id}-phone`">
                  <div class="phone">
                    <v-icon size="1.8rem">mdi-phone</v-icon>
                  </div>

                  <span class="contact-value regular14">{{ contact.phone }}</span>
                </v-col>
              </v-row>

              <v-row no-gutters class="information-email-outter-wrapper">
                <v-col cols="12" class="information-email-wrapper" :data-id="`${id}-email`">
                  <div class="email">
                    <v-icon size="1.8rem">mdi-email</v-icon>
                  </div>

                  <span class="contact-value regular14">{{ contact.email }}</span>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </mp-block>
      </v-col>
    </v-row>

    <v-row no-gutters v-else-if="$vuetify.breakpoint.xsOnly && hasData">
      <v-col cols="12">
        <div class="d-flex light-contact-information ml-3">
          <div class="d-flex align-center" :data-id="`${id}-name`">
            <v-icon size="2rem">mdi-account</v-icon>
            <span class="regular14 pl-3"> {{ contact.lastName }} {{ contact.firstName }} </span>
          </div>
          <div class="d-flex mt-4 ml-6" :data-id="`${id}-professional`">
            <mp-badge
              color="black"
              class="d-flex"
              :content="
                contact.isProfessional
                  ? $t('page.contact.professionalTitle')
                  : $t('page.contact.individualTitle')
              "
              :dataId="`${id}-contact-professional`"
            />
          </div>
          <div class="d-flex align-center mt-4" :data-id="`${id}-language`" v-if="contact.language">
            <v-icon size="2rem">mdi-account-voice</v-icon>
            <span class="regular14 pl-3">
              {{ contact.language ? $t(`common.languages.${contact.language}`) : '--' }}
            </span>
          </div>

          <!-- Timezone -->
          <div class="d-flex align-center mt-4" :data-id="`${id}-timezone`" v-if="contact.timezone">
            <v-icon size="2rem">mdi-clock-outline</v-icon>
            <span class="regular14 pl-3">
              {{ contact.timezone || '--' }}
            </span>
          </div>
        </div>
        <v-row class="light-contact-mobile" no-gutters>
          <v-col cols="12" class="icon-outer-wrapper">
            <a 
              v-if="isAuthorized('CALL_CLIENT')" 
              :href="`tel:${contact.phone}`" 
              class="icon-wrapper" 
              :data-id="`${id}-phone`"
            >
              <v-icon size="2rem">mdi-phone</v-icon>
            </a>
            <a :href="`mailto:${contact.email}`" class="icon-wrapper" :data-id="`${id}-email`">
              <v-icon size="2rem">mdi-email</v-icon>
            </a>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import OrderService from '@/services/order/OrderService'
import mixins from 'vue-typed-mixins'

import { authorizationMixin } from '@/mixins'

import { SHOW_INFORMATION_LENGTH } from '@/constants'
import { Contact } from '@/types'

import mpBlock from '@/components/block/block.vue'

export default mixins(authorizationMixin).extend({
  name: 'mp-light-contact',
  components: {
    mpBlock,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    durationTime: {
      type: Number,
      default: SHOW_INFORMATION_LENGTH,
    },
    orderId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      contact: null as Contact | null,
      showInformation: false,
    }
  },
  async beforeMount() {
    const {
      delivery: { contact },
    } = await OrderService.get(this.orderId, { personalData: true })
    this.contact = contact
  },
  computed: {
    hasData(): boolean {
      return !!this.contact
    },
  },
  methods: {
    handleClickShow(): void {
      this.showInformation = true
      setTimeout(() => {
        this.showInformation = false
      }, this.durationTime)
    },
  },
})
</script>

<style lang="scss">
.light-contact-component-contact {
  @media #{map-get($display-breakpoints, 'sm-and-up')} {
    padding: 0;
  }

  @media #{map-get($display-breakpoints, 'xs-only')} {
    border-top: solid 0.1rem $main-lighten-74-color;
    padding: 2.4rem 0 2.2rem 0;
  }

  .light-contact-dsk {
    .action-show-outter-wrapper {
      margin-top: 4.9rem;
      margin-bottom: 3.9rem;

      .action-show-wrapper {
        display: flex;
        justify-content: center;
      }
    }

    .information-outter-wrapper {
      .contact-information-container {
        margin-top: 1.9rem;

        .information-persona-outter-wrapper {
          margin-top: 1.6rem;

          .information-persona-wrapper {
            display: flex;
            align-items: center;
          }

          .persona {
            width: 4.6rem;
            height: 4.6rem;
            min-width: 4.6rem;
            min-height: 4.6rem;
            border-radius: 2.3rem;
            display: flex;
            justify-content: center;

            @media #{map-get($display-breakpoints, 'xs-only')} {
              border: solid 0.1rem $primary-color;

              i {
                color: $primary-color;
              }
            }

            @media #{map-get($display-breakpoints, 'sm-and-up')} {
              border: solid 0.1rem $main-lighten-65-color;

              i {
                color: $main-lighten-65-color;
              }
            }
          }

          .contact-value {
            margin-left: 0.8rem;
          }
        }

        .information-phone-outter-wrapper {
          margin-top: 1.6rem;

          .information-phone-wrapper {
            display: flex;
            align-items: center;
          }

          .phone {
            width: 4.6rem;
            height: 4.6rem;
            min-width: 4.6rem;
            min-height: 4.6rem;
            border-radius: 2.3rem;
            display: flex;
            justify-content: center;

            @media #{map-get($display-breakpoints, 'xs-only')} {
              border: solid 0.1rem $primary-color;
            }

            @media #{map-get($display-breakpoints, 'sm-and-up')} {
              border: solid 0.1rem $main-lighten-65-color;
            }

            i {
              @media #{map-get($display-breakpoints, 'xs-only')} {
                color: $primary-color;
              }

              @media #{map-get($display-breakpoints, 'sm-and-up')} {
                color: $main-lighten-65-color;
              }
            }
          }

          .contact-value {
            margin-left: 0.8rem;
          }
        }

        .information-email-outter-wrapper {
          margin-top: 1.7rem;

          .information-email-wrapper {
            display: flex;
            align-items: center;
          }

          .email {
            width: 4.6rem;
            height: 4.6rem;
            min-width: 4.6rem;
            min-height: 4.6rem;
            border-radius: 2.3rem;
            display: flex;
            justify-content: center;

            @media #{map-get($display-breakpoints, 'xs-only')} {
              border: solid 0.1rem $primary-color;
            }

            @media #{map-get($display-breakpoints, 'sm-and-up')} {
              border: solid 0.1rem $main-lighten-65-color;
            }

            i {
              @media #{map-get($display-breakpoints, 'xs-only')} {
                color: $primary-color;
              }

              @media #{map-get($display-breakpoints, 'sm-and-up')} {
                color: $main-lighten-65-color;
              }
            }
          }

          .contact-value {
            margin-left: 0.8rem;
          }
        }
      }
    }
  }

  .light-contact-mobile {
    .icon-outer-wrapper {
      display: flex;
      margin-top: 2.2rem;
      justify-content: center;

      .icon-wrapper {
        width: 5rem;
        height: 5rem;
        background-color: $primary-color;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;

        i {
          color: $main-color;
          display: block;
        }
      }

      .icon-wrapper:last-of-type {
        margin-left: 2.7rem;
      }
    }
  }

  .mp-badge {
    margin-left: 0;

    .v-badge__wrapper {
      margin: 0;

      .v-badge__badge {
        width: fit-content;
        @media #{map-get($display-breakpoints, 'xs-only')} {
          margin: -0.5rem;
        }
      }
    }
  }

  .light-contact-information {
    i {
      color: $main-lighten-65-color !important;
    }
    flex-direction: column;
  }
}
</style>
