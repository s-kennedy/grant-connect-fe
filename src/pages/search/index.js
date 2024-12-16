import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import MediaQuery from 'react-responsive'
import { Row, Col } from 'react-flexbox-grid'
import { Drawer, FlatButton } from 'material-ui'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { changeSearchText, searchFundersByParams } from 'store/actions/search'
import { selectCardView } from 'store/selectors/pageSettings'
import { CardViewEnum } from 'store/reducers/pageSettings'

import Facets from 'components/Facets'
import SearchHeader from 'components/SearchHeader'
import Filters from 'components/Filters'
import Pagination from 'components/SearchPagination'
import CardViewChanger from 'components/CardViewChanger'
import SearchResults from 'components/SearchResults'

import { toggleCardView } from 'store/actions/pageSettings'
import { selectAllFilters, selectIsResetButtonDisabled } from 'store/selectors/filters'
import { resetFilters, setFilterByKey } from 'store/actions/filters'
import { selectAreFacetsAtIntialState } from 'store/selectors/facets'
import { getAllFacetsAndSyncURL } from 'store/actions/facets'
import { getPipelines } from 'store/actions/pipeline'
import { getPipelineStages } from 'store/actions/pipelineStages'
import { selectPaginationState } from 'store/selectors/searchPagination'
import { selectResultCount } from 'store/selectors/search'
import PageInfo from 'components/Pagination/components/PageInfo'
import { selectIsLibraryMode } from 'store/selectors/user'

import { useHotjar } from 'utils/hotjar'

const MOBILE_DRAWER_WIDTH = 310

const Search = () => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)

  const dispatch = useDispatch()
  const { language, openToRequests, sortBy, medianGiftMin, medianGiftMax } = useSelector(
    selectAllFilters
  )
  const isResetButtonDisabled = useSelector(selectIsResetButtonDisabled)

  const [state, setState] = useState({
    showMobileDrawer: false
  })

  const { text: searchText, results: searchResults, loading } = useSelector(({ search }) => search)
  const cardView = useSelector(selectCardView)
  const areFacetsAtInitialState = useSelector(selectAreFacetsAtIntialState)
  const isLibraryMode = useSelector(selectIsLibraryMode)

  const { viewsPerPage, pageNumber } = useSelector(selectPaginationState)
  const resultCount = useSelector(selectResultCount)

  useHotjar()

  useEffect(() => {
    if (!isLibraryMode) {
      dispatch(getPipelines())
      dispatch(getPipelineStages())
    }
  }, [])

  useEffect(() => {
    const fetchFacets = async () => {
      if (areFacetsAtInitialState) {
        // fetch facets before searching, because search results will update facet docCount
        await getAllFacetsAndSyncURL()
        dispatch(searchFundersByParams())
      }
    }
    fetchFacets()
  }, [areFacetsAtInitialState, dispatch])

  const handleReset = () => {
    dispatch(changeSearchText(''))
    dispatch(resetFilters())
  }

  return (
    <>
      <MediaQuery query="(max-width: 767px)">
        <Drawer
          width={MOBILE_DRAWER_WIDTH}
          open={state.showMobileDrawer}
          docked={false}
          containerClassName="Search-page__filters-mobile"
          onRequestChange={open => setState({ showMobileDrawer: open })}
        >
          <Facets />

          <Filters
            language={language}
            openToRequests={openToRequests}
            sortBy={sortBy}
            onChange={({ key, value }) => dispatch(setFilterByKey({ [key]: value }))}
            showOnlySortBy={false}
            hideSortBy={true}
          />
        </Drawer>
      </MediaQuery>

      <Row>
        <Col mdOffset={3} xs={12} md={9}>
          <h1 className={'search-title'}>&nbsp;</h1>
        </Col>

        <MediaQuery query="(min-width: 768px)">
          <Col xs={12} md={4} xl={3}>
            <Facets />
          </Col>
        </MediaQuery>

        <Col xs={12} md={8} xl={9}>
          <SearchHeader
            onReset={handleReset}
            disableReset={isResetButtonDisabled}
            searchText={searchText}
          />

          <MediaQuery query="(min-width: 768px)">
            <Filters
              language={language}
              openToRequests={openToRequests}
              sortBy={sortBy}
              onChange={({ key, value }) => dispatch(setFilterByKey({ [key]: value }))}
              showOnlySortBy={false}
              hideSortBy={false}
            />
          </MediaQuery>

          <div>
            <Row>
              <Col xs={12} md={10}>
                <div className="tw-flex tw-justify-between tw-items-center">
                  {!!resultCount && (
                    <PageInfo
                      className={'Search-page__results tw-flex-none'}
                      resultCount={resultCount}
                      viewsPerPage={viewsPerPage}
                      pageNumber={pageNumber}
                    />
                  )}
                  <div className="tw-block md:tw-hidden tw-flex tw-w-64 tw-justify-end">
                    <Filters
                      language={language}
                      openToRequests={openToRequests}
                      sortBy={sortBy}
                      onChange={({ key, value }) => dispatch(setFilterByKey({ [key]: value }))}
                      showOnlySortBy={true}
                      hideSortBy={false}
                    />
                    <div className="tw-mx-2">
                      <FlatButton
                        className="Search-page__mobile-filters-button tw-ml-4"
                        label={t.search.filterMobile}
                        onClick={() => setState({ showMobileDrawer: true })}
                      />
                    </div>
                  </div>
                </div>
              </Col>

              <MediaQuery query="(min-width: 769px)">
                <Col md={2}>
                  <CardViewChanger
                    onClick={() => dispatch(toggleCardView())}
                    expandedActive={cardView === CardViewEnum.EXPANDED ? 'active' : ''}
                    collapsedActive={cardView === CardViewEnum.COLLAPSED ? 'active' : ''}
                  />
                </Col>
              </MediaQuery>
            </Row>
          </div>

          <Row>
            <SearchResults loading={loading} results={searchResults} />
            {searchResults.length ? (
              <Row>
                <div className="tw-w-full">
                  <MediaQuery query="(min-width: 990px)">
                    <Pagination pagerSize={5} />
                  </MediaQuery>
                  <MediaQuery query="(max-width: 991px)">
                    <Pagination pagerSize={3} />
                  </MediaQuery>
                </div>
              </Row>
            ) : null}
          </Row>
        </Col>
      </Row>
    </>
  )
}

export default Search
