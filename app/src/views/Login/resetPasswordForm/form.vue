<template>
  <div id="form-reset-password-wrapper">
    <div class="reset-form-password">
      <h2 class="reset-password-title">{{ $t('action.resetPassword') }}</h2>

      <v-row no-gutters>
        <v-col cols="10" sm="8" offset="1" offset-sm="0">
          <mp-textfield
            class="reset-password mb-5 mt-5"
            name="password"
            type="password"
            :label="`${$t('common.password')} *`"
            dataId="reset-password-form-password"
            v-model="password"
            @input="$v.password.$touch()"
            @blur="$v.password.$touch()"
            :errors="getModelErrors($v.password)"
            :isDirty="$v.password.$dirty"
            @keydown.enter="$v.$invalid ? null : $emit('submit', { passwordConfirmation, password })"
          />

          <mp-textfield
            class="reset-password-confirmation mb-3"
            name="password-confirmation"
            type="password"
            :label="`${$t('common.passwordConfirmation')} *`"
            dataId="reset-password-form-password-confirmation"
            v-model="passwordConfirmation"
            @input="$v.passwordConfirmation.$touch()"
            @blur="$v.passwordConfirmation.$touch()"
            :errors="getModelErrors($v.passwordConfirmation)"
            :isDirty="$v.passwordConfirmation.$dirty"
            @keydown.enter="$v.$invalid ? null : $emit('submit', { passwordConfirmation, password })"
          />

          <div v-if="$vuetify.breakpoint.smAndUp" class="btn-wrapper">
            <mp-button
              dataId="return-reset-btn"
              icon="arrow-left"
              :text="$t('action.return')"
              format="secondary"
              @click="$emit('return')"
              class="mr-2"
            />
            <mp-button
              dataId="reset-password-form-btn"
              :text="$t('action.letsGo')"
              format="primary"
              :disabled="$v.$invalid"
              @click="$emit('submit', { passwordConfirmation, password })"
            />
          </div>
        </v-col>
      </v-row>
    </div>

    <v-row v-if="$vuetify.breakpoint.xsOnly" no-gutters>
      <v-col cols="6" class="action-mobile-wrapper">
        <mp-button
          dataId="go-back-form-btn"
          icon="arrow-left"
          format="sticky"
          stickyColor="yellow"
          @click="$emit('return')"
          class="action-mobile"
        />
      </v-col>
      <v-col cols="6" class="action-mobile-wrapper">
        <mp-button
          dataId="reset-password-form-btn"
          :text="$t('action.letsGo')"
          format="sticky"
          stickyColor="yellow"
          :disabled="$v.$invalid"
          @click="$emit('submit', { passwordConfirmation, password })"
          class="action-mobile"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'

import { minLength, required, sameAs } from 'vuelidate/lib/validators'

import { validationMixin } from '@/mixins'

export default mixins(validationMixin).extend({
  name: 'mp-form-reset-password',
  data: () => ({
    passwordConfirmation: '',
    password: '',
  }),
  validations: {
    password: {
      required,
      minLength: minLength(10),
      containsNumber: (value: string) => {
        return /[0-9]/.test(value)
      },
      containsSpecial: (value: string) => {
        return /[#?!@$%^&*-/]/.test(value)
      },
      containsUppercase: (value: string) => {
        return /[A-Z]/.test(value)
      },
    },
    passwordConfirmation: {
      required,
      sameAsPassword: sameAs('password'),
    },
  },
})
</script>

<style lang="scss">
#form-reset-password-wrapper {
  .reset-form-password {
    @media #{map-get($display-breakpoints, 'xs-only')} {
      min-height: calc(100vh - 13.7rem - 6rem);
      max-height: calc(100vh - 13.7rem - 6rem);
      overflow: hidden;
    }

    .reset-password-title {
      margin-top: 11.7rem;
      margin-bottom: 2.1rem;

      @media #{map-get($display-breakpoints, 'xs-only')} {
        text-align: center;
      }
    }

    .reset-password {
      margin-top: 4rem !important;
    }

    .reset-password-confirmation {
      margin-top: 2rem !important;
      margin-bottom: 2rem !important;
    }

    .btn-wrapper {
      display: flex;
      justify-content: flex-end;
      margin-top: 4rem;
    }
  }

  @media #{map-get($display-breakpoints, 'xs-only')} {
    .action-mobile-wrapper {
      .action-mobile {
        width: 100%;
        min-height: 6rem;

        .v-btn__content {
          @include h3-18-medium;
          text-transform: uppercase;
        }
      }
    }
  }
}
</style>
