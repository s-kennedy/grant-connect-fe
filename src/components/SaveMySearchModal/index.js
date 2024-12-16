import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Dialog, FlatButton } from 'material-ui'

import { addSavedSearch, getSavedSearches } from 'store/actions/savedSearches'
import { selectUserOganization } from 'store/selectors/user'

const SaveMySearchModal = ({ showModal, modalTitle, onDismiss }) => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)
  const dispatch = useDispatch()

  const [savedSearchName, setSavedSearchName] = useState('')

  const userOrganization = useSelector(selectUserOganization)

  const handleSaveSearch = () => {
    dispatch(addSavedSearch(savedSearchName, window.location.href, userOrganization.id))
    dispatch(getSavedSearches())
    onDismiss()
  }

  const handleUpdateSavedSearchName = e => {
    setSavedSearchName(e.target.value)
  }

  return (
    <Dialog
      title={modalTitle}
      modal={false}
      open={showModal}
      autoScrollBodyContent={true}
      onRequestClose={onDismiss}
    >
      <div className="dialog-body">
        <div className="Save-search">
          {t.search.saveSearch.title}

          <div>
            <input
              placeholder={t.search.saveSearch.placeholder}
              className="Save-search--input"
              type="text"
              maxLength={50}
              minLength={2}
              defaultValue={name}
              onChange={handleUpdateSavedSearchName}
            />
          </div>

          <div className="Dialog-buttons--wrapper">
            <FlatButton
              label={t.search.save}
              primary={true}
              className="main-button"
              disabled={false}
              onClick={handleSaveSearch}
            />

            <FlatButton
              label={t.global.close}
              className="Material-cards__expanded-state add"
              primary={true}
              onClick={onDismiss}
            />
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default SaveMySearchModal
