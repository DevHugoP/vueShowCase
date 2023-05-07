<template>
  <v-row no-gutters align="center" class="range-cell" v-if="range">
    <v-col cols="6" sm="12" class="icon">
      <v-icon size="1.6rem" class="main-color mr-2">
        {{
          `${channel === 'MAIL' ? 'mdi-email' : 'mdi-message-bulleted'}${
            !range.activation ? '-off' : ''
          }`
        }}
      </v-icon>
      <span class="regular16">{{ label }}</span>
    </v-col>
    <v-col cols="6" sm="12" v-if="!mobile" class="range">
      <span class="regular14 label">{{ formatedDate }}</span>
    </v-col>
    <v-col cols="6" sm="12" v-else class="range">
      <span class="regular14 label">
        {{ formatedDateStart }}<br />
        {{ formatedDateEnd }}<br />
        ({{ range.timezone }})
      </span>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'
import { authorizationMixin } from '@/mixins'

import { ChannelType, NotificationActivationRange } from '@/types/entities/notificationActivations'

import { dateHelper } from '@/helpers/dateHelper'

export default mixins(authorizationMixin).extend({
  name: 'notification-range',
  props: {
    channel: {
      type: String as () => ChannelType,
      required: true,
    },
    range: {
      type: [Object as () => NotificationActivationRange],
      required: false,
    },
    mobile: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    formatedDate(): string {
      return this.$t('common.dateBetweenTimezone', {
        begin: dateHelper.formatToTimezone(this.range.start, this.range.timezone, 'Pp'),
        end: dateHelper.formatToTimezone(this.range.end, this.range.timezone, 'Pp'),
        timezone: this.range.timezone,
      })
    },
    formatedDateStart(): string {
      return `${this.$t('common.from')} ${dateHelper.formatToTimezone(
        this.range.start,
        this.range.timezone,
        'Pp',
      )}`
    },
    formatedDateEnd(): string {
      return `${this.$t('common.to')} ${dateHelper.formatToTimezone(
        this.range.end,
        this.range.timezone,
        'Pp',
      )}`
    },
    label(): string {
      return this.mobile
        ? this.$t(
            `page.notificationAdministration.${this.range.activation ? 'enabled' : 'disabled'}`,
          )
        : this.$t(
            `page.notificationAdministration.${this.channel}_${
              this.range.activation ? 'enabled' : 'disabled'
            }`,
          )
    },
  },
})
</script>

<style lang="scss">
.administration-row {
  .label {
    color: $main-lighten-28-color;
  }

  .administration-row-row__logo-name {
    min-width: 20rem;
    text-align: center;
    color: $main-lighten-52-color;
    word-break: break-word;
  }

  .state-chip {
    .success {
      color: $white !important;
      background-color: $success-color !important;
    }

    .failure {
      color: $white !important;
      background-color: $alert-color !important;
    }
  }
}
</style>
