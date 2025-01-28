import React, { useState } from 'react'
import { Dialog, FlatButton } from 'material-ui'
import { FilterList } from 'material-ui-icons'
import { Star } from 'material-ui-icons'
import { useTranslation } from 'react-i18next'
import SimpleInputField from './SimpleInputField'
import ButtonWithIcon from './ButtonWithIcon'
import ResultsSummary from './ResultsSummary'
import DefaultButton from './DefaultButton'

const SaveSearch = ({filters, saveSearch, savedSearches}) => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState()
  const [value, setValue] = useState("")
  
  const handleClose = () => {
    setShowForm(false)
  }

  const handleOpen = (e) => {
    setValue("")
    setShowForm(true)
  }

  const handleChange = e => {
    const duplicateTitle = savedSearches.find(s => s.title === e.target.value)
    if (duplicateTitle) {
      setError(t.explorer.duplicate_title_error)
    } else {
      setError(null)
    }

    setValue(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const title = formData.get("saved_search_title")

    const duplicateTitle = savedSearches.find(s => s.title === title)
    if (!duplicateTitle) {
      saveSearch(title)
      setError(null)
      setValue("")
      handleClose()
    }
  }

  const filterKeys = Object.keys(filters)
  const activeFilterKeys = filterKeys.filter(k => !!filters[k])
  const today = new Date()
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  };
  const localizedDateString = today.toLocaleTimeString([], options);
  const defaultSearchTitle = `${t.explorer.search_saved_on} ${localizedDateString}`

  return (
    <>
      <ButtonWithIcon onClick={handleOpen} color="grey" label={t.explorer.save_my_search} Icon={Star} />
      <Dialog
        open={showForm}
        onClose={handleClose}
        onRequestClose={handleClose}
        onBackdropClick={handleClose}
        className="Explorer"
      >
       {
        (activeFilterKeys.length === 0) ? (
          <p>{t.explorer.no_filters}</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="tw-mb-5">
              <p className="tw-w-full tw-block tw-mb-2 tw-text-md tw-text-black tw-font-semibold">{t.explorer.save_my_search}</p>
              <ResultsSummary filters={filters} displayMode={true} />
              <div>
                <SimpleInputField
                  id="saved_search_title"
                  label={t.explorer.save_my_search_label}
                  type="text"
                  placeholder={defaultSearchTitle}
                  errorMessage={error}
                  onChange={handleChange}
                  value={value}
                />
              </div>
            </div>
            <div className="tw-flex tw-justify-end">
              <DefaultButton type="submit" label={t.explorer.save} />
            </div>
          </form>
        )
       }
      </Dialog>
    </>
  )
}

export default SaveSearch
