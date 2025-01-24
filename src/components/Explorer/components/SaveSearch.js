import React, { useState, useEffect } from 'react'
import { Dialog, FlatButton, TextField } from 'material-ui'
import SimpleInputField from './SimpleInputField'
import AutocompleteField from './AutocompleteField'
import ButtonWithIcon from './ButtonWithIcon'
import ResultsSummary from './ResultsSummary'
import { FilterList } from 'material-ui-icons'
import { Star, Undo, Close } from 'material-ui-icons'

const SaveSearch = ({filters, saveSearch}) => {
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
    const title = formData.get("saved_search_title")

    saveSearch(title                                               )
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
  const filterKeys = Object.keys(filters)
  const activeFilterKeys = filterKeys.filter(k => !!filters[k])

  return (
    <div>
      <ButtonWithIcon onClick={handleOpen} color="grey" label="Save my search" Icon={Star} />
      <Dialog
        open={showForm}
        onClose={handleClose}
        onRequestClose={handleClose}
        onBackdropClick={handleClose}
        className="Explorer"
      >
       {
        (activeFilterKeys.length === 0) ? (
          <p>No filters applied yet.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="tw-mb-5">
              <p className="tw-w-full tw-block tw-mb-2 tw-text-md tw-text-black tw-font-semibold">Save my search</p>
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
              <FlatButton type="submit" label="Save" variant="contained" color="primary" className={`button-primary`} />
            </div>
          </form>
        )
       }
      </Dialog>
    </div>
  )
}

export default SaveSearch
