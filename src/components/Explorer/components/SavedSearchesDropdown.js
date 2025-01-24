// Global DOM Components.
import React, { useState, useEffect } from 'react'
import { Dialog, FlatButton, TextField } from 'material-ui'
import { Star } from 'material-ui-icons'

// App Language.
import { useTranslation } from 'react-i18next'

function SavedSearchesDropdown({savedSearches, applySearch, deleteSearch}) {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)
  const [value, setValue] = useState('')
  const [showForm, setShowForm] = useState(false)
  
  const handleClose = () => {
    setShowForm(false)
  }

  const handleOpen = (e) => {
    setShowForm(true)
  }

  const handleApply = (index) => {
    applySearch(index)
    handleClose()
  }

  const handleDelete = (index) => {
    deleteSearch(index)
  }

  return (
    <div className={`ge-search-field-wrapper tw-flex tw-gap-2 tw-mt-2`}>
      <FlatButton onClick={handleOpen} color="primary" className={`ge-button grey`}>
        <div className="tw-inline-flex tw-px-2 tw-items-center">
          <Star />
          <span className="tw-ml-1 tw-uppercase">{t.explorer.your_saved_searches}</span>
        </div>
      </FlatButton>
      <Dialog
        open={showForm}
        onClose={handleClose}
        onRequestClose={handleClose}
        onBackdropClick={handleClose}
        className="Explorer"
      >
       {
        (savedSearches.length === 0) ? (
          <p>No saved searches.</p>
        ) : (
          <div>
            <div className="tw-mb-5">
              <p className="tw-w-full tw-block tw-mb-2 tw-text-md tw-text-black tw-font-semibold tw-text-md">Use a Saved Search</p>
              {savedSearches.map((search, index) => {
                return (
                  <div className="tw-flex tw-justify-between">
                    <p className="tw-text-md">{search.title}</p>
                    <div className="tw-inline tw-gap-1">
                      <FlatButton onClick={() => handleApply(index)} color="primary" className={`button-primary`}>
                        <span className="tw-text-md">Apply</span>
                      </FlatButton>
                      <FlatButton onClick={() => handleDelete(index)} color="primary" className={`button-link`}>
                        <div className="tw-inline-flex tw-px-2 tw-items-center">
                          <span className="tw-underline tw-text-md">Delete</span>
                        </div>
                      </FlatButton>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
       }
      </Dialog>
    </div>
  )
}

export default SavedSearchesDropdown
