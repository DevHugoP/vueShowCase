<template>
  <mp-dialog-confirmation
    dataId="order-detail-memo-modal"
    color="primary"
    :header="{
      isColorBackground: true,
      text: $t('page.detailOrder.memo.title'),
      textPolice: $vuetify.breakpoint.smAndUp ? 'h4' : 'regular14',
      icon: 'mdi-message-reply-text',
      iconClose: 'mdi-close',
    }"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    :classWrapper="`order-detail-memo${showForm ? ' order-detail-memo-form' : ''}`"
    @close="cancel()"
    @submit="sendMemo()"
  >
    <template #content>
      <div class="display-wrapper" v-if="!showForm">
        <div class="medium14 memo-label">{{ $t('page.detailOrder.memo.last') }}</div>
        <div class="divider" />

        <div class="comments-wrapper" ref="wrapper-comments">
          <v-row
            no-gutters
            v-for="(comment, index) in comments"
            :key="`comments-${index}`"
            class="comments"
            :ref="`comments-${index}`"
            :data-id="`order-detail-memo-modal-comments-${index}`"
          >
            <v-col cols="12">
              <v-row no-gutters class="wrapper">
                <v-col cols="1" class="icon-wrapper">
                  <v-icon size="1.8rem">mdi-message-reply-text</v-icon>
                </v-col>
                <v-col cols="11" class="content-wrapper">
                  <h4 class="date" :data-id="`order-detail-memo-modal-comments-${index}-createdAt`">
                    {{ getDate(comment.createdAt) }}
                  </h4>
                  <span
                    class="by regular12"
                    :data-id="`order-detail-memo-modal-comments-${index}-by`"
                  >
                    {{ $t('page.detailOrder.memo.by', { author: comment.author }) }}
                  </span>

                  <div
                    class="content regular14"
                    :data-id="`order-detail-memo-modal-comments-${index}-content`"
                  >
                    {{ comment.content }}
                  </div>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </div>
      </div>
      <div class="form-wrapper" v-else>
        <mp-textarea
          :label="`${$t(`page.detailOrder.memo.write`)} *`"
          class="textarea"
          :rows="4"
          noResize
          v-model.trim="$v.form.comment.$model"
          @input="$v.form.comment.$touch()"
          @blur="$v.form.comment.$touch()"
          :errors="getModelErrors($v.form.comment)"
          :isDirty="$v.form.comment.$dirty"
          dataId="order-detail-memo-modal-form-comment"
        />
      </div>
    </template>

    <template #actions v-if="isAddMemoAuthorize">
      <div class="action-wrapper" @click="showForm = true" v-if="!showForm">
        <h3>{{ $t('page.detailOrder.memo.write') }}</h3>
      </div>
      <div class="action-form-outer-wrapper" v-else>
        <v-divider class="divider" v-if="$vuetify.breakpoint.smAndUp" />
        <div class="action-from-wrapper">
          <mp-button
            format="link"
            linkColor="black"
            :text="$t('page.detailOrder.memo.form.cancel')"
            dataId="order-detail-memo-modal-form-cancel"
            @click="cancelForm()"
          />
          <mp-button
            :text="$t('page.detailOrder.memo.form.send')"
            :disabled="!form.comment"
            format="success"
            @click="sendMemo()"
            dataId="order-detail-memo-modal-form-submit"
          />
        </div>
      </div>
    </template>
  </mp-dialog-confirmation>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'
import { required } from 'vuelidate/lib/validators'

import { dateHelper, dateHelperGetTimezonedDate } from '@/helpers/dateHelper'
import { validationMixin } from '@/mixins'

import CommentService from '@/services/comment/CommentService'
import { CommentEntity } from '@/types'

export default mixins(validationMixin).extend({
  name: 'mp-memo',
  props: {
    showDialog: {
      type: Boolean,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    externalOrderId: {
      type: String,
      required: true,
    },
    isAddMemoAuthorize: {
      type: Boolean,
      required: true,
    },
    comments: {
      type: Array as () => CommentEntity[],
      required: true,
    },
  },
  data: () => ({
    showForm: false,
    form: {
      comment: '',
    },
  }),
  validations: {
    form: {
      comment: { required },
    },
  },
  methods: {
    cancel() {
      this.$emit('hide')
    },
    cancelForm() {
      this.form.comment = ''
      this.showForm = false
    },
    async sendMemo() {
      const comment = {
        content: this.form.comment,
        orderId: parseInt(this.orderId, 10),
      }
      const newMemo = await CommentService.create(comment)

      this.comments.unshift(newMemo)
      this.form.comment = ''
      this.showForm = false
      this.$v.$reset()
    },
    getDate(date: string) {
      return dateHelper.formatToTimezone(dateHelperGetTimezonedDate(date), 'UTC', 'P')
    },
  },
})
</script>

<style lang="scss">
@import '../../../../styles/mixins/macScrollbar';

.order-detail-memo {
  &.order-detail-memo-form {
    .main-dialog-content {
      @media #{map-get($display-breakpoints, 'xs-only')} {
        height: calc(100vh - 28rem);
      }

      @media #{map-get($display-breakpoints, 'sm-and-up')} {
        height: calc(100vh - 33rem);
        max-height: 12rem;
      }
    }
  }

  .main-dialog-content {
    padding: 0;

    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      height: calc(100vh - 27rem);
      max-height: 40rem;
    }

    @media #{map-get($display-breakpoints, 'xs-only')} {
      height: calc(100vh - 16.8rem);
    }

    .display-wrapper {
      margin-left: 3.1rem;

      .memo-label {
        padding-top: 3.4rem;
      }

      .divider {
        width: 4rem;
        height: 0.5rem;
        background-color: $primary-color;
        margin-top: 0.6rem;
      }

      .comments-wrapper {
        overflow: auto;
        @include setMacScrollbar('&');
        @media #{map-get($display-breakpoints, 'sm-and-up')} {
          height: calc(100vh - 33rem);
          max-height: 34rem;
        }

        @media #{map-get($display-breakpoints, 'xs-only')} {
          height: calc(100vh - 22.8rem);
        }

        .comments {
          padding-top: 2.6rem;

          .wrapper {
            display: flex;

            i {
              color: $main-color;
            }

            .content-wrapper {
              @media #{map-get($display-breakpoints, 'sm-and-up')} {
                margin-left: -2rem;
              }

              .date {
                color: $main-color;
              }

              .by {
                color: $main-lighten-52-color;
                margin-top: 0.4rem;
              }

              .content {
                margin-top: 1.5rem;
                color: $main-color;
              }
            }
          }
        }
      }
    }

    .form-wrapper {
      margin-top: 5.2rem;

      .textarea {
        margin: 0 4.9rem 0 4.9rem;

        @media #{map-get($display-breakpoints, 'xs-only')} {
          margin: 0 2.4rem 0 2.4rem;
        }
      }

      .v-input__slot::before {
        border-color: $main-lighten-65-color;
      }
    }
  }

  .v-card__actions {
    padding: 0;

    .action-wrapper {
      width: 100%;
      height: 6rem;
      background-color: $primary-color;
      color: $main-color;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .action-form-outer-wrapper {
      min-height: 11.6rem;
      width: 100%;

      @media #{map-get($display-breakpoints, 'xs-only')} {
        display: flex;
        justify-content: center;
      }

      .action-from-wrapper {
        display: flex;

        @media #{map-get($display-breakpoints, 'sm-and-up')} {
          justify-content: flex-end;
          align-items: center;
          margin-right: 4.7rem;
        }

        @media #{map-get($display-breakpoints, 'xs-only')} {
          flex-direction: column-reverse;
          width: fit-content;
          align-items: center;
          justify-content: center;
        }

        height: 11.5rem;

        .cancel {
          margin-right: 0.5rem;
        }
      }
    }
  }
}
</style>
