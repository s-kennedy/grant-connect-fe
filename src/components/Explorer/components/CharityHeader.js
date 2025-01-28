import React, { useState, useEffect } from 'react'
import { Dialog, FlatButton } from 'material-ui'
import { FilterList } from 'material-ui-icons'
import { useTranslation } from 'react-i18next'
import SimpleInputField from './SimpleInputField'
import DefaultButton from './DefaultButton'

const CharityHeader = ({column, handleFilterChange, filters}) => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)
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
            <label htmlFor="recipient_name" className="tw-w-full tw-block tw-mb-2 tw-text-md tw-text-black tw-font-semibold">{t.explorer.search_by_name}</label>
            <SimpleInputField
              id="recipient_name"
              type="text"
              placeholder={t.explorer.recipient_name_placeholder}
              defaultValue={filters["recipient_name"]}
            />
          </div>

          <div className="tw-mb-5">
            <p className="tw-w-full tw-block tw-mb-2 tw-text-md tw-text-black tw-font-semibold">{t.explorer.filter_by_recipient_size}</p>
            <div className="tw-flex tw-gap-2 tw-items-center">
              <div>
                <SimpleInputField
                  id="recipient_min_size"
                  label={t.explorer.min_revenue}
                  type="number"
                  defaultValue={filters["recipient_min_size"]}
                />
              </div>
              <p className="tw-mt-6">to</p>
              <div>
                <SimpleInputField
                  id="recipient_max_size"
                  label={t.explorer.max_revenue}
                  type="number"
                  defaultValue={filters["recipient_max_size"]}
                />
              </div>
            </div>
          </div>
          <div className="tw-pt-3 tw-flex tw-justify-end tw-flex-none tw-border tw-border-b-0 tw-border-r-0 tw-border-l-0 tw-border-solid tw-border-grey">
            <DefaultButton type="submit" label={t.explorer.apply} />
          </div>
        </form>
      </Dialog>
    </div>
  )
}

export default CharityHeader
