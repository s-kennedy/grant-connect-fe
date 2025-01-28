import React, { useState } from 'react'
import { Dialog, FlatButton } from 'material-ui'
import { FilterList } from 'material-ui-icons'
import { useTranslation } from 'react-i18next'
import SimpleInputField from './SimpleInputField'
import DefaultButton from './DefaultButton'

const FunderHeader = ({column, handleFilterChange, filters}) => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)
  const [showForm, setShowForm] = useState(false)
  const isActive = !!filters["funder_name"]
  
  
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
          <div className="tw-mb-4">
            <label htmlFor="recipient-name" className="tw-w-full tw-block tw-mb-2 tw-text-md tw-text-black tw-font-semibold">{t.explorer.search_by_name}</label>
            <SimpleInputField
              id="funder_name"
              type="text"
              placeholder={t.explorer.funder_name_placeholder}
              defaultValue={filters["funder_name"]}
            />
          </div>

          <div className="tw-pt-3 tw-flex tw-justify-end tw-flex-none tw-border tw-border-b-0 tw-border-r-0 tw-border-l-0 tw-border-solid tw-border-grey">
            <DefaultButton type="submit" label={t.explorer.apply} />
          </div>
        </form>
      </Dialog>
    </div>
  )
}

export default FunderHeader
