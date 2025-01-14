import React, { useState, useEffect } from 'react'
import { Dialog, FlatButton, TextField } from 'material-ui'
import SimpleInputField from './SimpleInputField'
import AutocompleteField from './AutocompleteField'
import ButtonWithIcon from './ButtonWithIcon'
import ResultsSummary from './ResultsSummary'
import { FilterList } from 'material-ui-icons'
import { Star, Undo, Close } from 'material-ui-icons'

const SaveSearch = ({filters}) => {
  const [showForm, setShowForm] = useState(false)
  
  const handleClose = () => {
    setShowForm(false)
  }

  const handleOpen = (e) => {
    setShowForm(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const formKeys = formData.keys()
    const data = formKeys.reduce((obj, key) => {
      const value = formData.get(key)
      if (value) {
        obj[key] = value
      }
      return obj
    }, {})

    // handleFilterChange(data)
    handleClose()
  }

  const today = new Date()
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  };
  const localizedDateString = today.toLocaleTimeString([], options);
  const defaultSearchTitle = `Search saved on ${localizedDateString}`


  return (
    <div>
      <ButtonWithIcon onClick={handleOpen} color="grey" label="Save this search" Icon={Star} />
      <Dialog
        open={showForm}
        onClose={handleClose}
        onRequestClose={handleClose}
        onBackdropClick={handleClose}
        className="Explorer"
      >
        <form onSubmit={handleSubmit}>
          <div className="tw-mb-5">
            <p className="tw-w-full tw-block tw-mb-2 tw-text-md tw-text-black tw-font-semibold">Save this search</p>
            <ResultsSummary filters={filters} displayMode={true} />
            <div>
              <SimpleInputField
                id="saved_search_title"
                label="Enter a title for your saved search"
                type="text"
                placeholder={defaultSearchTitle}
                defaultValue={defaultSearchTitle}
              />
            </div>
          </div>
          <div className="tw-flex tw-justify-end">
            <FlatButton type="submit" label="Apply" variant="contained" color="primary" className={`button-primary`} />
          </div>
        </form>
      </Dialog>
    </div>
  )
}

export default SaveSearch
