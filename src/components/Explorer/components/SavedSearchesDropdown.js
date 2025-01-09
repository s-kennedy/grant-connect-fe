// Global DOM Components.
import React, { useState, useEffect } from 'react'
import { FlatButton, TextField } from 'material-ui'
import { Star } from 'material-ui-icons'

// App Language.
import { useTranslation } from 'react-i18next'

function SavedSearchesDropdown({ classes, label, placeholderText, onChange }) {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)
  const [value, setValue] = useState('')

  return (
    <div className={`ge-search-field-wrapper tw-flex tw-gap-2 tw-mt-2`}>
      <FlatButton color="primary" className={`button-link`}>
        <div className="tw-inline-flex tw-px-2 tw-items-center">
          <Star />
          <span className="tw-underline tw-ml-1">Your Saved Searches</span>
        </div>
      </FlatButton>
    </div>
  )
}

export default SavedSearchesDropdown
