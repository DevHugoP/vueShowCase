<template>
  <div id="form-login-wrapper">
    <div class="login-form-content">
      <h2 class="login-title">{{ $t('action.login') }}</h2>

      <v-row no-gutters>
        <v-col cols="10" sm="8" offset-sm="0" offset="1">
          <mp-textfield
            class="login-username mb-5 mt-5"
            name="userId"
            :label="`${$t('common.username')} *`"
            dataId="login-form-username"
            v-model="username"
            @input="$v.username.$touch()"
            @blur="$v.username.$touch()"
            :errors="getModelErrors($v.username)"
            :isDirty="$v.username.$dirty"
            @keydown.enter="$v.$invalid ? null : $emit('submit', { username, password })"
          />

          <mp-textfield
            class="login-password mb-3"
            name="password"
            :type="`${!showPassword ? 'password' : 'text'}`"
            :label="`${$t('common.password')} *`"
            dataId="login-form-password"
            v-model="password"
            @input="$v.password.$touch()"
            @blur="$v.password.$touch()"
            :errors="getModelErrors($v.password)"
            :isDirty="$v.password.$dirty"
            @keydown.enter="$v.$invalid ? null : $emit('submit', { username, password })"
          >
            <template #afterIcon>
              <v-icon @click="showPassword = !showPassword">
                {{ !showPassword ? 'mdi-eye' : 'mdi-eye-off' }}
              </v-icon>
            </template>
          </mp-textfield>
        </v-col>

        <v-col
          cols="10"
          sm="8"
          offset-sm="0"
          offset="1"
          class="btn-wrapper"
        >
          <span @click="$emit('sendToCallback', { username })" class="italic14">
            {{ $t('action.forgotPassword') }}
          </span>

          <mp-button
            v-if="$vuetify.breakpoint.smAndUp"
            dataId="login-form-btn"
            :text="$t('action.letsGo')"
            format="primary"
            :disabled="$v.$invalid"
            @click="$emit('submit', { username, password })"
          />
        </v-col>
      </v-row>
    </div>

    <v-row no-gutters v-if="$vuetify.breakpoint.xsOnly">
      <v-col cols="12" class="action-mobile-wrapper">
        <mp-button
          dataId="login-form-btn"
          :text="$t('action.letsGo')"
          format="sticky"
          stickyColor="yellow"
          :disabled="$v.$invalid"
          @click="$emit('submit', { username, password })"
          class="action-mobile"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'

import { required } from 'vuelidate/lib/validators'

import { validationMixin } from '@/mixins'

export default mixins(validationMixin).extend({
  name: 'mp-form-login',
  data: () => ({
    username: '',
    password: '',
    showPassword: false,
  }),
  validations: {
    username: { required },
    password: { required },
  },
})
</script>

<style lang="scss">
#form-login-wrapper {
  .login-form-content {
    @media #{map-get($display-breakpoints, 'xs-only')} {
      min-height: calc(100vh - 13.7rem - 6rem);
      max-height: calc(100vh - 13.7rem - 6rem);
      overflow: hidden;
    }

    .login-title {
      margin-top: 11.7rem;
      margin-bottom: 2.1rem;

      @media #{map-get($display-breakpoints, 'xs-only')} {
        text-align: center;
      }
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

  .form-login {
    .login-username {
      margin-top: 4rem !important;
    }

    .login-password {
      margin-top: 2rem !important;
      margin-bottom: 2rem !important;
    }
  }
  .btn-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    span {
      cursor: pointer;
    }

    button {
      margin-top: 4rem;
    }
  }
}
</style>
