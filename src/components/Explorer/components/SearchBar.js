// Global DOM Components.
import React, { useState, useEffect } from 'react'
import { FlatButton, TextField } from 'material-ui'

// App Language.
import { useTranslation } from 'react-i18next'

function SearchBar({ classes, label, placeholderText, onChange }) {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)
  const [value, setValue] = useState('')

  return (
    <div className={`ge-search-field-wrapper tw-flex tw-gap-2`}>
      <TextField
        type="text"
        name={`ge-search-field`}
        className={`ge-search-field tw-flex-1`}
        value={value}
        placeholder={placeholderText}
        onChange={onChange}
        underlineShow={false}
      />
      <FlatButton label="Search" variant="contained" color="primary" className={`button-primary`} />
    </div>
  )
}

export default SearchBar
