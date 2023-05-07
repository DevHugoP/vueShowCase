<template>
  <div id="send-form-reset-password-wrapper">
    <div class="reset-password-form">
      <h2 class="reset-password-title">{{ $t('common.forgotPassword.main') }}</h2>

      <v-row no-gutters>
        <v-col cols="10" sm="8" offset="1">
          <span class="regular16">{{ $t('common.forgotPassword.info') }}</span>
        </v-col>

        <v-col cols="10" sm="8" class="mt-10" offset="1">
          <mp-textfield
            class="send-reset-email"
            :label="`${$t('common.email')} *`"
            name="email"
            dataId="send-reset-form-email"
            v-model="email"
            @input="$v.email.$touch()"
            @blur="$v.email.$touch()"
            :errors="getModelErrors($v.email)"
            :isDirty="$v.email.$dirty"
            @keydown.enter="$v.$invalid ? null : submitForm"
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
              @click="submitForm"
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
          @click="submitForm"
          class="action-mobile"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'
import { required, email } from 'vuelidate/lib/validators'
import { validationMixin } from '@/mixins'

export default mixins(validationMixin).extend({
  name: 'mp-form-send-reset',
  props: {
    username: {
      type: String,
      required: false,
    },
  },
  data: () => ({
    email: '',
  }),
  validations: {
    email: {
      required,
      email,
    },
  },
  beforeMount() {
    this.email = this.username
  },
  methods: {
    async submitForm() {
      await this.$recaptchaLoaded()
      const token = await this.$recaptcha('login')
      this.$emit('submit', { email: this.email, token })
    },
  },
})
</script>

<style lang="scss">
#send-form-reset-password-wrapper {
  .reset-password-form {
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
