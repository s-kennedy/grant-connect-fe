import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { selectFunderProfileInfo } from 'store/selectors/profile'

const NotEngagedNote = () => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)
  const { funderActivityOption, primaryCategory } = useSelector(selectFunderProfileInfo)

  const isFunderFoundation =
    !!primaryCategory?.root?.name && primaryCategory.root.name === t.categories.foundations
  const isFunderGrantmaking = funderActivityOption
    ? funderActivityOption.some(
        activity =>
          activity.name === t.activities.grantmaking ||
          activity.name === t.activities.grantmaking.toLowerCase()
      )
    : false

  return (
    !isFunderGrantmaking &&
    isFunderFoundation && (
      <div className="profile-grantmaking-notes">
        <div className="profile-grantmaking-notes-note">{t.funder.organizationNotEngaged}</div>
      </div>
    )
  )
}

export default NotEngagedNote
