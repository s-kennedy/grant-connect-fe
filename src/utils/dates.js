import { getLanguage } from 'data/locale'
import { DateTime, Info } from 'luxon'

const SHORT_FORMAT = {
  ...DateTime.DATE_MED,
  year: undefined
}

const MONTH_DAY_FORMAT = {
  ...DateTime.DATE_FULL,
  year: undefined
}

export const convertISODateToLocalDate = date => {
  // We assume the server sends dates in YYYY-MM-DD ISO format
  // This is due to usage of Djangos Datefield class on the backend (datetime.date instance)
  // Luxon automatically converts an ISO date to the local timezone with a value of midnight for hours
  const localDate = DateTime.fromISO(date)

  return localDate.isValid ? localDate : null
}

export const getCurrentDate = () => {
  return DateTime.now().startOf('day')
}

export const getLongFormatDate = date => {
  const { language } = getLanguage()
  const localDate = convertISODateToLocalDate(date)

  return localDate?.isValid
    ? localDate.setLocale(language).toLocaleString(DateTime.DATE_FULL)
    : null
}
export const getShortFormatDate = date => {
  const { language } = getLanguage()
  const localDate = convertISODateToLocalDate(date)

  return localDate?.isValid ? localDate.setLocale(language).toLocaleString(SHORT_FORMAT) : null
}

export const getDashFormatDate = date => {
  const { language } = getLanguage()
  const localDate = convertISODateToLocalDate(date)
  const months = Info.months('long', { locale: language })

  return localDate?.isValid
    ? `${localDate.year}-${months[localDate.month - 1]}-${localDate.day}`
    : null
}

export const getFiscalPeriodDate = fiscalPeriodEnd => {
  const { language } = getLanguage()
  // The fiscal period field is provided as a concatenated numerical value under MMDD format
  const fiscalPeriodMonth = fiscalPeriodEnd && fiscalPeriodEnd.substring(0, 2)
  const fiscalPeriodDay = fiscalPeriodEnd && fiscalPeriodEnd.substring(2)

  const currentDate = getCurrentDate()
  const fiscalPeriodDate = new DateTime.local(
    currentDate.year,
    parseInt(fiscalPeriodMonth),
    parseInt(fiscalPeriodDay)
  )

  return fiscalPeriodDate?.isValid
    ? fiscalPeriodDate.setLocale(language).toLocaleString(MONTH_DAY_FORMAT)
    : null
}
