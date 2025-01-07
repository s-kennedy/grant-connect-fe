import React, { useState, useEffect } from 'react'
import { Dialog, FlatButton, TextField, Checkbox, ListItem } from 'material-ui'
import SimpleInputField from './SimpleInputField'
import AutocompleteField from './AutocompleteField'
import causes from 'data/ge-data/causes.json'
import { getPrimaryText, hasSelection, facetSort } from 'components/Facets/helpers'

const FocusHeader = ({column}) => {
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
        className="Explorer ge-dialog"
        scroll="body"
      >
        <div className="tw-mb-5">
          <p className="tw-w-full tw-block tw-mb-2 tw-text-md tw-text-black tw-font-semibold">Filter by Focus Area</p>
          { causes.map(cause => {
            return (
              <ListItem
                key={cause.id}
                nestedLevel={0}
                primaryText={cause.name}
                primaryTogglesNestedList={false}
                leftCheckbox={
                  <Checkbox

                  />
                }
              />
            )
          })}
        </div>
        <div className="tw-flex tw-justify-end">
          <FlatButton onClick={handleClose} label="Apply" variant="contained" color="primary" className={`button-primary`} />
        </div>
      </Dialog>
    </div>
  )
}

export default FocusHeader
