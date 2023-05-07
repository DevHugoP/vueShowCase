import {
  DateFormat,
  DateHelper,
  getTimezones,
  OperationUnit,
} from '@meltingpoint/lastmile-internationalization'

const dateHelper = new DateHelper('fr', 'UTC')

export const dateHelperFormatToTimezone = (date: string | Date, format: string): string => {
  return dateHelper.formatToTimezone(dateHelper.getDate(date), dateHelper.getTimezone(), format)
}

export const dateHelperSetUtcTime = (
  date: Date,
  times: { hours: number; minutes: number; seconds: number; milliseconds: number },
  days?: { years: number; months: number; days: number },
): Date => {
  date.setUTCHours(times.hours)
  date.setUTCMinutes(times.minutes)
  date.setUTCSeconds(times.seconds)
  date.setUTCMilliseconds(times.milliseconds)

  if (days) {
    date.setUTCFullYear(days.years)
    date.setUTCMonth(days.months)
    date.setUTCDate(days.days)
  }

  return date
}

export const dateHelperGetUtcDate = (date?: string, timezone?: string): Date => {
  let localDate = date || new Date().toISOString()
  const localTimezone = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone

  localDate = localDate.replace('T', ' ').replace('Z', '')
  return dateHelper.getUtcDate(
    dateHelper.parse(localDate, 'yyyy-MM-dd HH:mm:ss.SSS'),
    localTimezone,
  )
}

export const dateHelperGetTimezonedDate = (date?: string | Date, timezone?: string): Date => {
  const localDate = !date ? new Date() : typeof date === 'string' ? new Date(date) : date
  const localTimezone = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone

  return new Date(
    `${dateHelper.formatToTimezone(new Date(localDate), localTimezone).replace(' ', 'T')}Z`,
  )
}

export const dateHelperGetUTCHours = (date: Date): string => {
  return formatTime(date.getUTCHours().toString())
}

export const dateHelperGetUTCMinutes = (date: Date): string => {
  return formatTime(date.getUTCMinutes().toString())
}

export const dateHelperMinutes = (date: Date): string => {
  return formatTime(date.getMinutes().toString())
}
export const dateHelperHours = (date: Date): string => {
  return formatTime(date.getHours().toString())
}

export const formatTime = (time: string): string => {
  if (time.length === 1) {
    return `0${time}`
  }
  return time
}

export { dateHelper, DateFormat, getTimezones, OperationUnit }
