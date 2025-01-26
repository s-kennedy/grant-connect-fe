import React, { useState, useEffect } from 'react'
import { Dialog, FlatButton, TextField, MenuItem, SelectField } from 'material-ui'
import SimpleInputField from './SimpleInputField'
import SimpleSelectField from './SimpleSelectField'
import { FilterList, KeyboardArrowDown } from 'material-ui-icons'

const range = (start, stop, step=1) =>
  Array.from(
    { length: Math.ceil((stop - start) / step) },
    (_, i) => start + i * step,
  );

const YearHeader = ({column, handleFilterChange, filters}) => {
  const [showForm, setShowForm] = useState(false)
  const isActive = !!filters["year_min"] || !!filters["year_max"]
  const [minValue, setMinValue] = useState()
  const [maxValue, setMaxValue] = useState()
  
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

  const selectFieldStyle = {
    listStyle: { border: '1px solid #bfd0da' },
    menuItemStyle: { paddingTop: 2, paddingBottom: 2 }
  }

  const options = range(1980, 2024).reverse().map(y => ({ value: y, label: y }))

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
        <form onSubmit={handleSubmit} >
        <div className="tw-mb-5">
          <p className="tw-w-full tw-block tw-text-md tw-text-black tw-font-semibold">Filter by year</p>
          <p className="tw-w-full tw-block tw-mb-4">Data is available from 1980 to 2023</p>
          <div className="tw-flex tw-gap-2 tw-items-center">
            <div>
              <SimpleSelectField
                id="year_min"
                label="Start year"
                options={options}
                defaultValue={filters["year_min"]}
                value={minValue}
                onChange={(e) => setMinValue(e.target.value)}
              />
            </div>
            <p className="tw-mt-6">to</p>
            <div>
              <SimpleSelectField
                id="year_max"
                label="End year"
                options={options}
                defaultValue={filters["year_max"] || filters["year_min"] || undefined }
                value={maxValue}
                onChange={(e) => setMaxValue(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="tw-pt-3 tw-flex tw-justify-end tw-flex-none tw-border tw-border-b-0 tw-border-r-0 tw-border-l-0 tw-border-solid tw-border-grey">
          <FlatButton type="submit" label="Apply" variant="contained" color="primary" className={`button-primary`} />
        </div>
        </form>
      </Dialog>
    </div>
  )
}

export default YearHeader
