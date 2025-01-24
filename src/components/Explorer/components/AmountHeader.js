import React, { useState, useEffect } from 'react'
import { Dialog, FlatButton, TextField } from 'material-ui'
import SimpleInputField from './SimpleInputField'
import AutocompleteField from './AutocompleteField'
import { FilterList } from 'material-ui-icons'

const AmountHeader = ({column, handleFilterChange, filters}) => {
  const [showForm, setShowForm] = useState(false)
  const isActive = !!filters["amount_min"] || !!filters["amount_max"]
  
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
      <FlatButton onClick={handleOpen} className={`ge-header-button ${isActive ? 'active' : ''}`}>
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
          <div className="tw-mb-5">
            <p className="tw-w-full tw-block tw-mb-2 tw-text-md tw-text-black tw-font-semibold">Filter by gift size</p>
            <div className="tw-flex tw-gap-2 tw-items-center">
              <div>
                <SimpleInputField
                  id="amount_min"
                  label="Minimum ($)"
                  type="number"
                />
              </div>
              <p className="tw-mt-6">to</p>
              <div>
                <SimpleInputField
                  id="amount_max"
                  label="Maximum ($)"
                  type="number"
                />
              </div>
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

export default AmountHeader
