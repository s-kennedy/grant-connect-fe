import React, { useState, useEffect } from 'react'
import { Dialog, FlatButton, TextField } from 'material-ui'
import SimpleInputField from './SimpleInputField'

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
          <SimpleInputField
            type="text"
            id="recipient-name"
            name="recipient-name"
            className={`ge-simple-text-field tw-flex-1`}
            underlineShow={false}
          />
        </div>

        <div>
          <p htmlFor="recipient-name" className="tw-w-full tw-block tw-mb-2 tw-text-md tw-text-black tw-font-semibold">Filter by size</p>
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
      </Dialog>
    </div>
  )
}

export default CharityHeader
