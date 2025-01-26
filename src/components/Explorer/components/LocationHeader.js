import React, { useState, useEffect } from 'react'
import { Dialog, FlatButton, TextField } from 'material-ui'
import SimpleInputField from './SimpleInputField'
import { FilterList } from 'material-ui-icons'

const RegionHeader = ({column, handleFilterChange, filters}) => {
  const [showForm, setShowForm] = useState(false)
  const isActive = !!filters["location"]
  
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
      <FlatButton title="Gift recipient location" onClick={handleOpen} className={`ge-header-button ${isActive ? 'active' : ''}`}>
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
        <form onSubmit={handleSubmit}>
          <div className="tw-mb-4">
            <label htmlFor="location" className="tw-w-full tw-block tw-mb-2 tw-text-md tw-text-black tw-font-semibold">Search locations</label>
            <SimpleInputField
              type="text"
              id="location"
              placeholder={`Try searching for "Vancouver"`}
              defaultValue={filters["location"]}
            />
          </div>

          <div className="tw-pt-3 tw-flex tw-justify-end tw-flex-none tw-border tw-border-b-0 tw-border-r-0 tw-border-l-0 tw-border-solid tw-border-grey">
            <FlatButton type="submit" label="Apply" variant="contained" color="primary" className={`button-primary`} />
          </div>
        </form>
      </Dialog>
    </div>
  )
}

export default RegionHeader
