import React, { useState, useEffect } from 'react'
import { Dialog, FlatButton, TextField } from 'material-ui'
import SimpleInputField from './SimpleInputField'
import AutocompleteField from './AutocompleteField'

const YearHeader = ({column}) => {
  const [showForm, setShowForm] = useState(false)
  
  const handleClose = () => {
    setShowForm(false)
  }

  const handleOpen = () => {
    setShowForm(true)
  }

  return (
    <div>
      <FlatButton onClick={handleOpen}>{column.columnDef.header}</FlatButton>
      <Dialog
        open={showForm}
        onClose={handleClose}
        onRequestClose={handleClose}
        onBackdropClick={handleClose}
        className="Explorer"
      >
        <div className="tw-mb-5">
          <p className="tw-w-full tw-block tw-mb-2 tw-text-md tw-text-black tw-font-semibold">Filter by year</p>
          <div>
            <SimpleInputField
              id="year-min"
              label="From"
              type="number"
              min="1980"
            />
          </div>
          <div>
            <SimpleInputField
              id="year-max"
              label="To"
              type="number"
              max="2024"
            />
          </div>
        </div>
        <div className="tw-flex tw-justify-end">
          <FlatButton onClick={handleClose} label="Apply" variant="contained" color="primary" className={`button-primary`} />
        </div>
      </Dialog>
    </div>
  )
}

export default YearHeader
