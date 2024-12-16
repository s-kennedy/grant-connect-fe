import { getI18n } from 'react-i18next'
import { AlarmOn } from 'material-ui-icons'
import _ from 'lodash'

import { convertISODateToLocalDate, getCurrentDate } from 'utils/dates'

/**
 * Accessor for getting all deadline color states
 */
const getDeadlineColors = () => {
  const i18n = getI18n()
  const t = i18n.getResourceBundle(i18n.language)

  return {
    // Deadline based colours and states
    red: { color: 'red', label: `${t.funder.deadlineFor}: `, Icon: AlarmOn, showDate: true },
    yellow: { color: 'yellow', label: `${t.funder.deadlineFor}: `, Icon: AlarmOn, showDate: true },
    green: { color: 'green', label: `${t.funder.deadlineFor}: `, Icon: AlarmOn, showDate: true },
    gray: { color: 'gray', label: '', Icon: AlarmOn, showDate: false },
    // Additional conditions colours and states
    ongoing: { color: 'green', label: t.funder.ongoing, Icon: AlarmOn, showDate: false },
    noPrograms: { color: 'gray', label: '', Icon: null, showDate: false }
  }
}

/*
 * Red: denotes a program deadline approaching within 6 weeks (within 42 days)
 * Yellow: a program deadline approaching in 6 weeks to 3 months (between 42 and 90 days)
 * Green: a program deadline approaching in greater than 3 months (over 90 days)
 * Gray: no specific program deadline.
 */
export const getDeadlineState = ({
  deadlineDate,
  isOngoing = false,
  hasNoPrograms = false,
  isFunderDissolved = false,
  currentDate = getCurrentDate()
}) => {
  const deadlineColors = getDeadlineColors()

  // Conditions for guarded states
  if (hasNoPrograms) return deadlineColors.noPrograms
  if (isFunderDissolved) return deadlineColors.gray

  // Conditions for when a deadline date is present
  if (deadlineDate) {
    const diffDays = deadlineDate.diff(currentDate, 'days').toObject().days

    if (diffDays >= 0 && diffDays <= 42) return deadlineColors.red
    if (diffDays > 42 && diffDays <= 90) return deadlineColors.yellow
    if (diffDays > 90) return deadlineColors.green
  }

  // Conditions for when no deadline date is present or it has passed
  if (isOngoing) return deadlineColors.ongoing

  return deadlineColors.gray
}

/**
 * Accessor for getting the next upcoming deadline date
 */
export const getNextDeadlineDate = (dates = []) => {
  const sortedDates = dates
    .filter(date => date)
    .map(date => convertISODateToLocalDate(date))
    .filter(date => date >= getCurrentDate())
    .sort((firstDate, secondDate) => firstDate.toMillis() - secondDate.toMillis())

  return sortedDates?.length ? sortedDates[0] : null
}

/**
 * Accessor for getting upcoming deadline informations from a list of funder programs
 */
export const getNextDeadlinesFromPrograms = funderPrograms => {
  const i18n = getI18n()
  const t = i18n.getResourceBundle(i18n.language)

  const hasOngoingDeadline = !!_.reduce(
    funderPrograms ? funderPrograms.filter(item => item.programDeadlines) : [],
    (agg, program) =>
      agg.concat(
        program.programDeadlines.map(
          deadline => deadline.deadlineCondition && deadline.deadlineCondition.name
        )
      ),
    []
  ).find(item => item === t.funder.ongoing)

  const sortedDeadlineDates = _.reduce(
    funderPrograms ? funderPrograms.filter(item => item.programDeadlines) : [],
    (agg, program) => agg.concat(program.programDeadlines.map(deadline => deadline.deadlineDate)),
    []
  )
    .filter(item => item)
    .map(item => convertISODateToLocalDate(item))
    .filter(date => date >= getCurrentDate())
    .sort((firstDate, secondDate) => firstDate.toMillis() - secondDate.toMillis())

  const closestDeadlineDate = !!sortedDeadlineDates.length && sortedDeadlineDates[0]

  return { sortedDeadlineDates, hasOngoingDeadline, closestDeadlineDate }
}

/**
 * Accessor for obtaining all deadlines from a single funder program
 * @returns An array of deadlines in the { name, date, condition } format
 */
export const getDeadlinesFromProgram = funderProgram => {
  const deadlines = funderProgram?.programDeadlines

  return deadlines
    ? deadlines
        .filter(deadline => deadline.name)
        .map(deadline => {
          return {
            name: deadline.name,
            date: !!deadline.deadlineDate ? convertISODateToLocalDate(deadline.deadlineDate) : null,
            condition: !!deadline.deadlineCondition ? deadline.deadlineCondition.name : null
          }
        })
        .sort((firstDeadline, secondDeadline) => {
          if (firstDeadline.date === null) return 1
          else if (secondDeadline.date === null) return -1
          else return firstDeadline.date.toMillis() - secondDeadline.date.toMillis()
        })
    : null
}
