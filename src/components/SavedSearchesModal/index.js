import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Dialog, FlatButton } from 'material-ui'

import { getAllFacetsAndSyncURL } from 'store/actions/facets'
import { deleteSavedSearch, getSavedSearches } from 'store/actions/savedSearches'
import { changeSearchText, searchFundersByParams } from 'store/actions/search'
import { resetFacetFilters } from 'store/actions/filters'

const SavedSearchesModal = ({ showModal, modalTitle, onDismiss, savedSearches }) => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)
  const dispatch = useDispatch()

  const [selectedSavedSearch, setSelectedSavedSearch] = useState({})

  const handleApplySavedSearch = () => {
    if (selectedSavedSearch.searchUrl) {
      const savedUrl = new URL(selectedSavedSearch.searchUrl)
      const urlParams = new URLSearchParams(savedUrl.search.slice(1))

      dispatch(changeSearchText(urlParams.get('search')))
      dispatch(resetFacetFilters())
      dispatch(getAllFacetsAndSyncURL(urlParams.toString()))
      dispatch(searchFundersByParams())
    }
    onDismiss()
  }

  const handleDeleteSavedSearch = async item => {
    await dispatch(deleteSavedSearch(item.id))
    await dispatch(getSavedSearches())
  }

  const savedSearchActions = (
    <div className="Dialog-buttons--wrapper">
      <FlatButton
        label={t.search.applyFilters}
        primary={true}
        className="main-button"
        disabled={false}
        onClick={handleApplySavedSearch}
      />

      <FlatButton
        label={t.global.close}
        className="Material-cards__expanded-state add"
        primary={true}
        onClick={onDismiss}
      />
    </div>
  )
  // Update component on change of savedSearches
  useEffect(() => {}, [savedSearches])

  return (
    <Dialog
      title={modalTitle}
      modal={false}
      open={showModal}
      autoScrollBodyContent={true}
      onRequestClose={onDismiss}
      actions={savedSearchActions}
    >
      <div className="dialog-body">
        <div className="Saved-filter">
          <div className="Saved-filter--list">
            {savedSearches &&
              savedSearches.map(item => {
                return (
                  <div
                    data-selected={selectedSavedSearch.id === item.id}
                    key={item.id}
                    className="Saved-filter--list-item"
                  >
                    <div>{item.name}</div>

                    <span
                      className="Saved-filter--list-item--selected"
                      data-selected={selectedSavedSearch.id === item.id}
                      onClick={() => setSelectedSavedSearch(item)}
                    >
                      {t.search.savedSearch.select}
                    </span>

                    <span
                      className="Saved-filter--list-item--delete"
                      onClick={() => handleDeleteSavedSearch(item)}
                    >
                      {t.search.savedSearch.delete}
                    </span>
                  </div>
                )
              })}
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default SavedSearchesModal
