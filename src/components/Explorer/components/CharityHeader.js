import React, { useState, useEffect } from 'react'
import { Dialog, FlatButton, TextField } from 'material-ui'
import SimpleInputField from './SimpleInputField'
import AutocompleteField from './AutocompleteField'
import { FilterList } from 'material-ui-icons'


const CharityHeader = ({column, handleFilterChange, filters}) => {
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [ autocompleteResults, setAutocompleteResults ] = useState([])

  const isActive = !!filters["recipient_name"] || !!filters["recipient_min_size"] || !!filters["recipient_max_size"]
  
  const handleClose = () => {
    setShowForm(false)
  }

  const handleOpen = (e) => {
    e.stopPropagation()
    setShowForm(true)
  }

  useEffect(() => {
    setAutocompleteResults()
  })

  const handleSearchChange = (event, newInputValue) => {
    setAutocompleteResults([])
    const query = event?.target?.value
    console.log({query})

    setSearchTerm(query)

    if (query?.length > 2) {
      const autocomplete = ["Kitchener-Waterloo Art Gallery", "Lost & Found Theatre Inc.", "CAFKA - Contemporary Art Forum Kitchener & Area", "Centre in the Square Inc.", "J.M. Drama Alumni"]
      setAutocompleteResults(autocomplete)
    }
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
          <div>
            <label htmlFor="recipient_name" className="tw-w-full tw-block tw-mb-2 tw-text-md tw-text-black tw-font-semibold">Search by name</label>
            <SimpleInputField
              id="recipient_name"
              type="text"
              placeholder={`Try searching for "Kitchener-Waterloo Art Gallery"`}
              defaultValue={filters["recipient_name"]}
            />
          </div>

          <div className="tw-mb-5">
            <p className="tw-w-full tw-block tw-mb-2 tw-text-md tw-text-black tw-font-semibold">Filter by recipient size</p>
            <div className="tw-flex tw-gap-2 tw-items-center">
              <div>
                <SimpleInputField
                  id="recipient_min_size"
                  label="Minimum revenue ($)"
                  type="number"
                  defaultValue={filters["recipient_min_size"]}
                />
              </div>
              <p className="tw-mt-6">to</p>
              <div>
                <SimpleInputField
                  id="recipient_max_size"
                  label="Maximum revenue ($)"
                  type="number"
                  defaultValue={filters["recipient_max_size"]}
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

export default CharityHeader
