<template>
  <mp-dialog-confirmation
    dataId="modal-add-tag"
    classWrapper="modal-add-tag"
    @close="$emit('reset')"
    @submit="$emit('save')"
    color="primary"
    :header="{
      isColorBackground: true,
      icon: $vuetify.breakpoint.smAndUp ? 'mdi-pencil' : null,
      textPolice: $vuetify.breakpoint.smAndUp ? 'h4' : 'regular14',
      iconClose: 'mdi-close',
      text: isEdit ? $t('action.modify.tag') : $t('page.carrier.tag.add'),
    }"
    :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
    :btnValidation="{
      text: $t('action.save'),
      format: 'success',
      icon: 'content-save',
      disabled: $v.tag.$invalid,
    }"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    maxWidth="58.6rem"
    :btnToColumn="$vuetify.breakpoint.xsOnly"
  >
    <template #content>
      <v-row no-gutters>
        <v-col cols="12" class="info-wrapper">
          <v-icon size="2rem" class="main-lighten-65">mdi-information-outline</v-icon>
          <span class="italic14 main-lighten-52">{{ $t('page.carrier.tag.description') }}</span>
        </v-col>

        <v-col cols="12" class="mb-5">
          <mp-textfield
            dataId="form-title"
            :label="`${$t('common.title')} *`"
            name="name"
            v-model="tag.name"
            @input="$v.tag.name.$touch()"
            @blur="$v.tag.name.$touch()"
            :isDirty="$v.tag.name.$dirty"
          />
        </v-col>

        <v-col cols="12" class="mb-5">
          <mp-textfield
            dataId="form-key"
            :label="`${$t('common.key')} *`"
            name="common.key"
            v-model="tag.key"
            @input="$v.tag.key.$touch()"
            @blur="$v.tag.key.$touch()"
            :isDirty="$v.tag.key.$dirty"
          />
        </v-col>

        <v-col cols="12">
          <mp-textfield
            dataId="form-value"
            :label="`${$t('common.value')} *`"
            name="common.value"
            v-model="tag.value"
            @input="$v.tag.value.$touch()"
            @blur="$v.tag.value.$touch()"
            :isDirty="$v.tag.value.$dirty"
          />
        </v-col>
      </v-row>
    </template>
  </mp-dialog-confirmation>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'
import { languageMixin } from '@/mixins'

import { validationMixin } from '@/mixins'
import { required } from 'vuelidate/lib/validators'

export default mixins(languageMixin, validationMixin).extend({
  name: 'mp-carrier-add-tag',
  validations: {
    tag: {
      name: {
        required,
      },
      key: {
        required,
      },
      value: {
        required,
      },
    },
  },
  props: {
    tag: {
      type: Object,
      default: null,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
})
</script>

<style lang="scss">
@import '../../../../../../styles/mixins/macScrollbar';

.modal-add-tag {
  .main-dialog-content {
    padding: 3rem 4rem !important;
    @include setMacScrollbar('&');

    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      max-height: calc(100vh - 27rem);
      overflow-y: scroll;
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

    .info-wrapper {
      display: flex;
      background-color: $main-lighten-80-color;
      padding: 1.7rem !important;
      margin-bottom: 3rem;

      i {
        align-items: flex-start;
        margin-right: 1rem;
      }
    }
  }
  .v-card__actions {
    border-top: 0.1rem solid $main-lighten-74-color;
  }
}
</style>
