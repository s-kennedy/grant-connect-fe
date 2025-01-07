import React, { useState, useEffect } from 'react'
import { Dialog, FlatButton, TextField } from 'material-ui'
import SimpleInputField from './SimpleInputField'
import AutocompleteField from './AutocompleteField'

const PurposeHeader = ({column}) => {
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
        <div className="tw-mb-4">
          <label htmlFor="recipient-name" className="tw-w-full tw-block tw-mb-2 tw-text-md tw-text-black tw-font-semibold">Search by purpose</label>
          <AutocompleteField
            type="text"
            id="purpose"
          />
        </div>

        <div className="tw-flex tw-justify-end">
          <FlatButton onClick={handleClose} label="Apply" variant="contained" color="primary" className={`button-primary`} />
        </div>
      </Dialog>
    </div>
  )
}

export default PurposeHeader
