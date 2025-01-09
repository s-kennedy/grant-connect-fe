import React, { useState, useEffect } from 'react'
import { Dialog, FlatButton, TextField, Checkbox, ListItem } from 'material-ui'
import SimpleInputField from './SimpleInputField'
import AutocompleteField from './AutocompleteField'
import causes from 'data/ge-data/causes.json'
import { getPrimaryText, hasSelection, facetSort } from 'components/Facets/helpers'
import { FilterList } from 'material-ui-icons'

const FocusHeader = ({column, handleFilterChange}) => {
  const [showForm, setShowForm] = useState(false)
  const [selected, setSelected] = useState([])
  
  const handleClose = () => {
    setShowForm(false)
  }

  const handleOpen = (e) => {
    e.stopPropagation()
    setShowForm(true)
  }

  const handleSubmit = (e) => {
    handleFilterChange({focus: selected})
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
        className="Explorer ge-dialog"
        scroll="body"
      >
        <div className="tw-mb-5">
          <p className="tw-w-full tw-block tw-mb-2 tw-text-md tw-text-black tw-font-semibold">Filter by Focus Area</p>
          { causes.map(cause => {
            const selectedId = selected.findIndex(s => s.id === cause.id)
            const isSelected = selectedId >= 0
            return (
              <ListItem
                key={cause.id}
                nestedLevel={0}
                primaryText={cause.name}
                primaryTogglesNestedList={false}
                leftCheckbox={
                  <Checkbox
                    checked={isSelected}
                    onCheck={() => {
                      if (isSelected) {
                        console.log({selectedId})
                        console.log({selected})
                        const newArray = [...selected]
                        newArray.splice(selectedId, 1)
                        console.log({newArray})
                        setSelected(newArray)
                      } else {
                        setSelected([...selected, cause])
                      }
                    }}
                  />
                }
              />
            )
          })}
        </div>
        <div className="tw-flex tw-justify-end">
          <FlatButton onClick={handleSubmit} label="Apply" variant="contained" color="primary" className={`button-primary`} />
        </div>
      </Dialog>
    </div>
  )
}

export default FocusHeader
