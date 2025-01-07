import React, { useState, useEffect } from 'react'
import { Dialog, FlatButton, TextField } from 'material-ui'
import SimpleInputField from './SimpleInputField'
import AutocompleteField from './AutocompleteField'

const CharityHeader = ({column}) => {
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
        <div>
          <label htmlFor="recipient-name" className="tw-w-full tw-block tw-mb-2 tw-text-md tw-text-black tw-font-semibold">Search by name</label>
          <AutocompleteField
            type="text"
            id="recipient-name"
          />
        </div>

        <div className="tw-mb-5">
          <p className="tw-w-full tw-block tw-mb-2 tw-text-md tw-text-black tw-font-semibold">Filter by size</p>
          <div>
            <SimpleInputField
              id="recipient-min-size"
              label="Minimum"
              type="number"
            />
          </div>
          <div>
            <SimpleInputField
              id="recipient-max-size"
              label="Maximum"
              type="number"
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

export default CharityHeader