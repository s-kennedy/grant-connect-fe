import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactTooltip from 'react-tooltip'
import { useSelector, useDispatch } from 'react-redux'
import { AutoComplete, FlatButton, Divider, MenuItem, IconButton } from 'material-ui'
import { ArrowBack, Search } from 'material-ui-icons'
import _ from 'lodash'

import backend from 'utils/backend'
import { useDebounce, useOutsideRef } from 'hooks'
import { changeSearchText, searchFundersByParams } from 'store/actions/search'
import { serializeSearchParams } from 'components/SearchParams/helpers'
import { selectflatSearchFacets } from 'store/selectors/facets'
import { selectSearchText } from 'store/selectors/search'
import { resetFacetFilters } from 'store/actions/filters'
import { trackSearchAutocompleteFacetClick, trackSearchAutocompleteFunderClick } from 'utils/mixpanel'

const SearchForm = ({ gotoFunder, mobile = false }) => {
  const dispatch = useDispatch()
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)
  const searchText = useSelector(selectSearchText)
  const flatSearchFacets = useSelector(selectflatSearchFacets)

  const [showSearchForm, setShowSearchForm] = useState(false)
  const [localSearchText, setLocalSearchText] = useState(searchText)
  const debouncedSearchTerm = useDebounce(localSearchText, 500)
  const [filteredFacets, setFilteredFacets] = useState([])
  const [localResults, setLocalResults] = useState([])

  const autocompleteStyle = mobile
    ? 'Header-search-mobile-field-container'
    : 'Header-search-field-container'

  useEffect(() => setLocalSearchText(searchText), [searchText])

  useEffect(() => {
    const getQuickResults = async searchText => {
      const searchParams = serializeSearchParams({
        searchText,
        pageNumber: 1,
        viewsPerPage: 5,
        sortBy: 'match',
        searchFields: ['name', 'alias']
      })
      const { data: { results } = {} } = await backend.get(`api/search/funders/${searchParams}`)
      setLocalResults(
        results.map(item => ({
          text: item.alias ? `${item.name} (${item.alias})` : item.name,
          value: { funder: item.id }
        }))
      )
    }

    const getFilteredFacets = searchText => {
      setFilteredFacets(
        flatSearchFacets
          .filter(item => item.title.toLowerCase().includes(searchText.toLowerCase()))
          .slice(0, 5)
          .map(item => ({
            text: `${item.title} ${t.global.in} ${_.get(t, item.parent)}`,
            value: {
              facet: item.id,
              facetType: item.facetType,
              parentFacetIds: item.parentFacetIds
            }
          }))
      )
    }

    if (debouncedSearchTerm && debouncedSearchTerm.length >= 3) {
      getFilteredFacets(debouncedSearchTerm)
      getQuickResults(debouncedSearchTerm)
    } else {
      setFilteredFacets([])
      setLocalResults([])
    }
  }, [debouncedSearchTerm])

  const handleFormSubmit = async e => {
    e.preventDefault()

    //  full text search
    dispatch(changeSearchText(localSearchText))
    dispatch(resetFacetFilters())
    dispatch(searchFundersByParams('SEARCH_FORM'))
  }

  const handleNewRequest = async (profileInfo, index) => {
    await gotoFunder(profileInfo, index)

    if (index === -1) {
      return
    }

    if (_.has(profileInfo.value, 'funder')) {
      await trackSearchAutocompleteFunderClick(profileInfo.value.funder)
    } else if (_.has(profileInfo.value, 'facet')) {
      await trackSearchAutocompleteFacetClick({
        id: profileInfo.value.facet,
        facetType: profileInfo.value.facetType,
      })
    }
  }

  const [formHighlighted, setFormHighlighted, formRef] = useOutsideRef()

  return (
    <div>
      {((showSearchForm && mobile) || !mobile) && (
        <form className="Header-search" ref={formRef} onSubmit={handleFormSubmit}>
          {mobile && (
            <IconButton onClick={e => setShowSearchForm(false)}>
              <ArrowBack />
            </IconButton>
          )}
          {/* Autocomplete Field */}
          <div className={autocompleteStyle}>
            <AutoComplete
              data-tip={t.search.toolTip}
              className={`Header-search__autocomplete ${formHighlighted}`}
              menuCloseDelay={0}
              openOnFocus={true}
              underlineShow={false}
              hintText={t.search.hintText}
              searchText={localSearchText}
              dataSource={
                ((localResults.length || filteredFacets.length) && [
                  ...filteredFacets,
                  filteredFacets.length &&
                    localResults.length && { text: 'divider', value: <Divider /> },
                  ...localResults,
                  {
                    text: localSearchText,
                    value: (
                      <MenuItem search={{ searchText: localSearchText }} className="extra">
                        <div className="extra--text">
                          <div>{t.search.extraMenuItem}</div>
                          <div>{t.search.extraMenuItemSecond}</div>
                        </div>
                        <div className="extra--item">{t.search.go}</div>
                      </MenuItem>
                    )
                  }
                ]) ||
                []
              }
              menuProps={{ className: 'Header-search__autocomplete-menu-list' }}
              popoverProps={{ className: 'Header-search__autocomplete-menu-wrapper' }}
              onFocus={() => setFormHighlighted('highlight')}
              filter={(searchText, key) => key}
              onUpdateInput={setLocalSearchText}
              onNewRequest={handleNewRequest}
              fullWidth={true}
              menuStyle={{ overflowY: 'hidden' }}
              listStyle={{ root: { border: '1px solid #ddd' } }}
            />
            <ReactTooltip place="bottom" effect="solid" />
          </div>

          <FlatButton
            id="Header-submit"
            type="submit"
            icon={<Search className="Header-search__submit-icon" />}
            className="Header-search__submit"
          />
        </form>
      )}
      {!showSearchForm && mobile && (
        <IconButton className="Header-search__open-search" onClick={e => setShowSearchForm(true)}>
          <Search />
        </IconButton>
      )}
    </div>
  )
}

export default SearchForm
