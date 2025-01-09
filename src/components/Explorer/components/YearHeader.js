import React, { useState, useEffect } from 'react'
import { Dialog, FlatButton, TextField } from 'material-ui'
import SimpleInputField from './SimpleInputField'
import AutocompleteField from './AutocompleteField'
import { FilterList } from 'material-ui-icons'

const YearHeader = ({column, handleFilterChange}) => {
  const [showForm, setShowForm] = useState(false)
  
  const handleClose = () => {
    setShowForm(false)
  }

  const handleOpen = (e) => {
    e.stopPropagation()
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

    handleFilterChange(data)
    handleClose()
  }

  return (
    <div>
      <FlatButton onClick={handleOpen} className="ge-header-button">
        <div className="tw-inline-flex tw-items-center tw-text-dark">
          <FilterList />
          <span className="tw-ml-1">{column.columnDef.header}</span>
        </div>
      </FlatButton>
      <Dialog
        open={showForm}
        onClose={handleClose}
        onRequestClose={handleClose}
        onBackdropClick={handleClose}
        className="Explorer"
      >
        <form onSubmit={handleSubmit} >
        <div className="tw-mb-5">
          <p className="tw-w-full tw-block tw-mb-2 tw-text-md tw-text-black tw-font-semibold">Filter by year</p>
          <div>
            <SimpleInputField
              id="year_min"
              label="From"
              type="number"
              min="1980"
            />
          </div>
          <div>
            <SimpleInputField
              id="year_max"
              label="To"
              type="number"
              max="2024"
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

export default YearHeader