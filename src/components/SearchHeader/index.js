import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-flexbox-grid'
import { useTranslation } from 'react-i18next'
import { FlatButton } from 'material-ui'

import { getSavedSearches } from 'store/actions/savedSearches'
import { selectSelectedFacets } from 'store/selectors/facets'
import { selectSavedSearches } from 'store/selectors/savedSearch'
import { selectHasExecutePermissions, selectIsLibraryMode } from 'store/selectors/user'

import Pills from 'components/Pills'
import SaveMySearchModal from 'components/SaveMySearchModal'
import SavedSearchesModal from 'components/SavedSearchesModal'

const SearchHeader = ({ disableReset, onReset, searchText }) => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)
  const dispatch = useDispatch()
  const [showSaveMySearchModal, setShowSaveMySearchModal] = useState(false)
  const [showSavedSearchesModal, setShowSavedSearchesModal] = useState(false)

  const hasExecutePermissions = useSelector(selectHasExecutePermissions)
  const selectedFacets = useSelector(selectSelectedFacets)
  const savedSearches = useSelector(selectSavedSearches)
  const isLibraryMode = useSelector(selectIsLibraryMode)

  useEffect(() => {
    dispatch(getSavedSearches())
  }, [])

  return (
    <div className="Search-page">
      <Row>
        <div className="Row-search-header tw-items-center">
          <div className="Row-search-header--title tw-mb-2 lg:tw-mb-0">
            {!!searchText ? (
              <h3 className="tw-text-lg">
                {t.search.label} <i>"{searchText}"</i>
              </h3>
            ) : (
              <h3 className="tw-text-lg">{t.search.mainTitle}</h3>
            )}
          </div>

          <div className="Search-page__buttons-container">
            {hasExecutePermissions && !isLibraryMode && (
              <FlatButton
                className="main-button"
                label={t.search.saveMySearch}
                labelPosition="before"
                onClick={() => setShowSaveMySearchModal(true)}
              />
            )}

            {hasExecutePermissions && !isLibraryMode && (
              <FlatButton
                className="main-button"
                label={t.search.viewMySearchs}
                labelPosition="before"
                onClick={() => setShowSavedSearchesModal(true)}
              />
            )}

            <FlatButton
              className="Material-cards__expanded-state add tw-mb-8"
              label={t.search.reset}
              labelPosition="before"
              disabled={disableReset}
              onClick={onReset}
            />
          </div>
        </div>

        <hr />

        <Col xs={12}>
          <div className="Search-page__buttons-container">
            <Pills items={selectedFacets} />
          </div>
        </Col>
      </Row>

      {showSaveMySearchModal && (
        <SaveMySearchModal
          showModal={showSaveMySearchModal}
          modalTitle={t.search.saveSearch.blockTitle}
          onDismiss={() => setShowSaveMySearchModal(false)}
        />
      )}

      {showSavedSearchesModal && (
        <SavedSearchesModal
          showModal={showSavedSearchesModal}
          modalTitle={t.search.savedSearch.blockTitle}
          onDismiss={() => setShowSavedSearchesModal(false)}
          savedSearches={savedSearches.results}
        />
      )}
    </div>
  )
}

SearchHeader.propTypes = {
  disableReset: PropTypes.bool.isRequired,
  onReset: PropTypes.func.isRequired
}

export default SearchHeader
