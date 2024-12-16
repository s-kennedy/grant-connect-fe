import React from 'react'
import { getLongFormatDate, getShortFormatDate } from 'utils/dates'

const Deadline = ({ date, format }) => {
  let formattedDate = ''

  if (date) {
    if (format === 'short') {
      formattedDate = getShortFormatDate(date)
    }
    if (format === 'long') {
      formattedDate = getLongFormatDate(date)
    }
  }

  return !!formattedDate ? <span className="i18n-date">{formattedDate}</span> : <span></span>
}

export default Deadline
