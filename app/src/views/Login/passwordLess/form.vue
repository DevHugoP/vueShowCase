<template>
  <div id="form-password-less-wrapper">
    <div class="form-password-less">
      <h2 class="password-less-title">{{ $t('page.login.passwordLess.main') }}</h2>

      <v-row no-gutters>
        <v-col cols="10" sm="8" offset="1" offset-sm="0">
          <span class="regular16">{{ $t('page.login.passwordLess.info') }}</span>
        </v-col>

        <v-col
          cols="10"
          sm="8"
          class="mt-10"
          offset="1"
          offset-sm="0"
        >
          <mp-textfield
            class="send-password-less-email"
            :label="`${$t('common.email')} *`"
            name="email"
            dataId="send-password-less-form-email"
            v-model="email"
            @input="$v.email.$touch()"
            @blur="$v.email.$touch()"
            :errors="getModelErrors($v.email)"
            :isDirty="$v.email.$dirty"
            @keydown.enter="$v.$invalid ? null : $emit('submit', email)"
          />

          <VueRecaptcha
            :sitekey="RECAPTCHA_KEY"
            :loadRecaptchaScript="true"
            @verify="isHuman = true"
            @error="isHuman = false"
          ></VueRecaptcha>



          <div v-if="$vuetify.breakpoint.smAndUp" class="btn-wrapper">
            <mp-button
              dataId="return-password-less-btn"
              icon="arrow-left"
              :text="$t('action.return')"
              format="secondary"
              @click="$emit('return')"
              class="mr-2"
            />
            <mp-button
              dataId="password-less-form-btn"
              :text="$t('action.letsGo')"
              format="primary"
              :disabled="$v.$invalid || !isHuman"
              @click="$emit('submit', email)"
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
          dataId="password-less-form-btn"
          :text="$t('action.letsGo')"
          format="sticky"
          stickyColor="yellow"
          :disabled="$v.$invalid || !isHuman"
          @click="$emit('submit', email)"
          class="action-mobile"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'
import VueRecaptcha from 'vue-recaptcha'
import { required, email } from 'vuelidate/lib/validators'
import { validationMixin } from '@/mixins'
import Config from '@/config/Config'

export default mixins(validationMixin).extend({
  name: 'mp-form-password-less',
  components: {
    VueRecaptcha,
  },
  props: {
    username: {
      type: String,
      required: false,
    },
  },
  data: () => ({
    RECAPTCHA_KEY: '',
    email: '',
    isHuman: false,
  }),
  validations: {
    email: {
      required,
      email,
    },
  },
  beforeMount() {
    this.RECAPTCHA_KEY = Config.get('GOOGLE_RECAPTCHA_KEY')
    this.email = this.username
  },
})
</script>

<style lang="scss">
#form-password-less-wrapper {
  .form-password-less {
    @media #{map-get($display-breakpoints, 'xs-only')} {
      min-height: calc(100vh - 13.7rem - 6rem);
      max-height: calc(100vh - 13.7rem - 6rem);
      overflow: hidden;
    }

    .password-less-title {
      margin-top: 11.7rem;
      margin-bottom: 2.1rem;

      @media #{map-get($display-breakpoints, 'xs-only')} {
        text-align: center;
      }
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
