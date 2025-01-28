import React, { useState } from 'react'
import { Dialog, FlatButton } from 'material-ui'
import { FilterList } from 'material-ui-icons'
import { useTranslation } from 'react-i18next'
import DefaultButton from './DefaultButton'
import SimpleInputField from './SimpleInputField'

const AmountHeader = ({column, handleFilterChange, filters}) => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)
  const [showForm, setShowForm] = useState(false)
  const isActive = !!filters["amount_min"] || !!filters["amount_max"]
  
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
          <div className="tw-mb-5">
            <p className="tw-w-full tw-block tw-mb-2 tw-text-md tw-text-black tw-font-semibold">{t.explorer.filter_by_gift_size}</p>
            <div className="tw-flex tw-gap-2 tw-items-center">
              <div>
                <SimpleInputField
                  id="amount_min"
                  label={t.explorer.min_size}
                  type="number"
                  defaultValue={filters["amount_min"]}
                />
              </div>
              <p className="tw-mt-6">to</p>
              <div>
                <SimpleInputField
                  id="amount_max"
                  label={t.explorer.max_size}
                  type="number"
                  defaultValue={filters["amount_max"]}
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

export default AmountHeader
