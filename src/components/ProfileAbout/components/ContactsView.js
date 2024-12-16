import React from 'react'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'

import { stripTags } from 'utils/helpers'

const ContactsView = ({ funderContacts }) => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)

  if (!Array.isArray(funderContacts) || !funderContacts.length) {
    return null
  }

  const positions = _.groupBy(funderContacts, (contact) => {
    const roleNamePlural = `${contact?.role?.name}s`

    return contact.ceaseDate
      ? `${t.funder.past} ${roleNamePlural || ''}`
      : roleNamePlural || ''
  })

  // Sort the contacts within position groups according to order field
  for (const [position, contacts] of Object.entries(positions)) {
    positions[position] = _.sortBy(contacts, ['order'])
  }

  return (
    <div className="profile-positions-wrapper row">
      {_.map(positions, (people, position) => {
        return (
          <div key={position} className="col-xs-6">
            <h4>{position}</h4>
            {people.map((person, index) => {
              return (
                <li key={index}>
                  {stripTags(person.name.trim())}
                  {person.position ? `, ${person.position}` : ''}
                </li>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

export default ContactsView
