import React from 'react'

import { getDeadlinesFromProgram, getDeadlineState } from 'components/Deadlines/helpers'
import Deadline from 'components/Deadlines'
import { getLanguage } from 'data/locale'

const ProgramDeadlines = ({ funderProgram }) => {
  const { t } = getLanguage()
  const programDeadlines = getDeadlinesFromProgram(funderProgram)

  return (
    !!programDeadlines &&
    programDeadlines.map(({ name, date, condition }, index) => {
      const { color, Icon } = getDeadlineState({
        deadlineDate: date,
        isOngoing: condition === t.funder.ongoing
      })
      const deadlineText = `${name}${!!condition ? ` (${condition})` : ''}`

      return (
        <div className={`Full-card__deadline ${color}`} key={index}>
          {!!Icon && <Icon />}
          <small>
            {deadlineText}
            {!!date && (
              <>
                {': '}
                <Deadline date={date} format="long" />
              </>
            )}
          </small>
        </div>
      )
    })
  )
}

export default ProgramDeadlines
