// Global DOM components.
import React, { Component } from 'react'
import MediaQuery from 'react-responsive'
import { Row, Col } from 'react-flexbox-grid'
import { Drawer, FlatButton, CircularProgress, Snackbar } from 'material-ui'
import * as locationSearch from 'query-string'
import Dialog from 'material-ui/Dialog'
// Redux.
import { connect } from 'react-redux'
import { updateSearchResults, changeSearchText } from 'store/actions/search'

// Custom search components.
import SearchPageFilters from './components/filters/SearchPageFilters'
import SearchPageFacets from './components/facets/SearchPageFacets'
import SearchPageViewChanger from './components/SearchPageViewChanger'

// Custom global components.
import ExpandedCardDEPRECATED from '../../components/cards/expanded/ExpandedCardDEPRECATED'
import CollapsedCard_DEPRECATED from '../../components/cards/collapsed/CollapsedCard-deprecated'
import Pagination from '../../components/pagination/Pagination'
import ReactGA from 'react-ga'
// Helpers.
import _ from 'lodash'

// Controllers.
import * as SearchController from '../../controllers/SearchController-DEPRECATED'

// App Language.
import { getLanguage } from 'data/locale'

// Paths.
import { SEARCH_PAGE } from '../../utils/paths'
import Pills from './components/components/pills'
import SaveSearch from './components/components/saveSearch'
import SavedList from './components/components/savedList'
import { numberWithCommas } from '../../utils/helpers'

const { t } = getLanguage()

class SearchPage extends Component {
  state = SearchController.getInitialState()

  componentDidMount() {
    const queryStrings = locationSearch.parse(window.location.search)
    // Update the facets to look like the ugly way Drupal loves.
    const updatedQueryStrings = SearchController.uglifyFacets(queryStrings)

    // If the current path is search, call the API.
    this.updateSearchResults(updatedQueryStrings)
  }

  getSearches = () => {
    SearchController.getSaveSearch().then(req => {
      this.setState({ searches: req })
    })
  }

  saveSearches = nameSaveSearch => {
    SearchController.setSaveSearch(nameSaveSearch, window.location.href).then(req => {
      if (req.success) {
        this.setState({ open: false })
        this.setState({ searchTitleLength: '' })
      } else {
        this.setState({ snackbar: { open: true, message: t.search.saveSearch.error } })
      }
    })
  }

  handleOpen = data => {
    if (data === 'saved') {
      this.getSearches()
    }
    this.setState({ open: data })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  componentDidUpdate() {
    setTimeout(() => {
      if (this.props.searchResults.pager.count === 0 && this.state.timeout !== true) {
        this.setState({ timeout: true })
      } else if (this.props.searchResults.pager.count > 0 && this.state.timeout === true) {
        this.setState({ timeout: false })
      }
    }, 5000)
  }

  handleSearchFilterChange = () => {
    const { history } = this.props

    let searchArguments = SearchController.getSearchFilterArguments(
      this.props.searchLanguage,
      this.props.searchOpenToRequest,
      this.props.searchTypicalGiftFrom,
      this.props.searchTypicalGiftTo,
      this.props.searchSorting,
      locationSearch,
      this.props.searchText
    )

    history.push({
      pathname: SEARCH_PAGE,
      search: locationSearch.stringify(searchArguments)
    })

    searchArguments = SearchController.uglifyFacets(searchArguments)

    this.updateSearchResults(searchArguments)
  }

  transformToAssocArray = prmstr => {
    let params = {}
    const prmarr = prmstr.split('&')
    for (let i = 0; i < prmarr.length; i++) {
      var tmparr = prmarr[i].split('=')
      params[tmparr[0]] = tmparr[1]
    }
    return params
  }

  getSearchParameters = () => {
    let prmstr = window.location.search.substr(1)
    prmstr = prmstr != null && prmstr != '' ? this.transformToAssocArray(prmstr) : {}
    if (
      _.isEmpty(prmstr) &&
      _.get(this, 'props.searchRegion.default') &&
      !_.isEmpty(this.props.searchRegion.default)
    ) {
      prmstr = { region: this.props.searchRegion.default }
    }
    return prmstr
  }

  handleSearchFacetClick = (facetId, facetUrl, facetName, isSelected) => {
    const urlParams = new URLSearchParams(facetUrl)
    const { history, locationSearch } = this.props
    const facetArguments = locationSearch.parse(facetUrl.split('?')[1])
    let searchArguments = locationSearch.parse(window.location.search)
    let searchValues = []
    for (var pair of urlParams.entries()) {
      searchValues[pair[0]] = pair[1]
    }

    if (!isSelected) {
      if (
        facetName === 'new_region' &&
        _.values(searchValues).includes(`international:${facetId}`)
      ) {
        facetName = 'international'
      } else {
        facetName = facetName.replace('new_region', 'region')
      }
    } else {
      if (
        facetName === 'new_region' &&
        _.has(searchArguments, 'international') &&
        searchArguments.international.search(facetId) >= 0
      ) {
        facetName = 'international'
      }
    }
    facetName = facetName.replace('new_region', 'region')

    // Deleting unnecessary URL parameters.
    typeof facetArguments.q !== 'undefined' && delete facetArguments.q
    // Updating the search results.
    if (typeof searchArguments[facetName] !== 'undefined') {
      // If it's there already, it's time to remove.
      if (isSelected) {
        let locationSearchQuery = window.location.search

        if (locationSearchQuery.indexOf(facetId) !== -1) {
          const re = new RegExp(facetId, 'g')
          searchArguments = locationSearch.parse(locationSearchQuery.replace(re, ''))
        }
        console.log(searchArguments, facetName)
        if (searchArguments[facetName].endsWith(',,')) {
          searchArguments[facetName] = searchArguments[facetName].slice(0, -2)
        }
        if (searchArguments[facetName].endsWith(',')) {
          searchArguments[facetName] = searchArguments[facetName].slice(0, -1)
        }

        if (searchArguments[facetName].startsWith(',,')) {
          searchArguments[facetName] = searchArguments[facetName].substr(2)
        }
        if (searchArguments[facetName].startsWith(',')) {
          searchArguments[facetName] = searchArguments[facetName].substr(1)
        }

        searchArguments[facetName] = searchArguments[facetName].replace(/,,/g, ',')

        facetId = searchArguments[facetName] === '' ? undefined : searchArguments[facetName]
      } else {
        // If not, add it to the URL.
        facetId = `${searchArguments[facetName]},${facetId}`
      }
    }

    // Updates the search with a nice URL.
    searchArguments = {
      ...searchArguments,
      [facetName]: facetId
    }

    history.push({
      pathname: SEARCH_PAGE,
      search: decodeURIComponent(locationSearch.stringify(searchArguments))
    })
    this.updateSearchResults(facetArguments)
  }

  handleSearchPaginationChange = (e, index, value) => {
    const { history, locationSearch } = this.props
    let searchArguments = locationSearch.parse(window.location.search)

    this.setState({ viewsPerPage: value })

    history.push({
      pathname: SEARCH_PAGE,
      search: locationSearch.stringify(searchArguments)
    })

    searchArguments = { ...searchArguments, items_per_page: value }
    searchArguments = SearchController.uglifyFacets(searchArguments)

    this.updateSearchResults(searchArguments)
  }

  resetSearch = () => {
    const { history } = this.props
    this.props.searchCauseLiveUpdate({ causeText: t.search.cause, causeChildItemId: '', url: '' })
    this.props.searchRegionLiveUpdate({
      regionText: t.search.region,
      url: '',
      regionChildItemId: ''
    })
    this.props.boundChangeSearchText('')
    history.push({ pathname: SEARCH_PAGE })
    this.updateSearchResults({})
  }

  handleCardsView = (e, cardsView, cardsHide) => {
    // Update the state to show the view according to user selection.
    this.setState({
      cardsView,
      [`${cardsView}Active`]: 'active',
      [`${cardsHide}Active`]: ''
    })

    // Store the selction for when the user comes back to the page.
    localStorage.setItem('cardsView', cardsView)

    // @TODO: Update this to be one function with handleSearchFacetClick.
    const { locationSearch } = this.props
    const itemsPerView = cardsView === 'collapsed' ? 25 : 10
    let searchArguments = locationSearch.parse(window.location.search)

    if (cardsView === 'collapsed') {
      searchArguments = {
        ...searchArguments,
        items_per_page: itemsPerView
      }
      this.setState({
        viewsPerPage: itemsPerView
      })
    } else {
      searchArguments = {
        ...searchArguments,
        items_per_page: itemsPerView
      }
      this.setState({
        viewsPerPage: itemsPerView
      })
    }

    searchArguments = SearchController.uglifyFacets(searchArguments)
    this.updateSearchResults(searchArguments)
  }

  handlePagerClick = pageNumber => {
    const { history, locationSearch } = this.props
    let searchArguments = locationSearch.parse(window.location.search)

    searchArguments = { ...searchArguments, page: pageNumber }

    history.push({
      pathname: SEARCH_PAGE,
      search: locationSearch.stringify(searchArguments)
    })

    searchArguments = {
      ...searchArguments,
      items_per_page: this.state.viewsPerPage
    }

    searchArguments = SearchController.uglifyFacets(searchArguments)

    this.setState({ pageNumber })
    this.updateSearchResults(searchArguments)
    window.scrollTo(0, 0)
  }

  // Function that will perform the search query.
  updateSearchResults = searchArguments => {
    const { changeSearchResults } = this.props

    // Reset the search before doing anything.
    changeSearchResults([], [], {})

    // Update the search page because it's possible to have a page 0
    // but we don't want to show &page=0 on the URL (or the pager numbers).
    // So the pager on the URL will always be the API page + 1.
    if (typeof searchArguments.page !== 'undefined') {
      searchArguments.page--
    }
    if (_.has(searchArguments, 'international')) {
      const search = _.pickBy(searchArguments, elem => {
        if (_.isString(elem) && elem.search('international:') >= 0) {
          return false
        }
        return true
      })
      searchArguments = search
      if (_.has(locationSearch.parse(window.location.search), 'international')) {
        _.each(locationSearch.parse(window.location.search).international.split(','), (e, i) => {
          searchArguments[`f[100${i}]`] = `international:${e}`
        })
      }
    }
    // Run query rebuild for the next categories:
    const categories = {
      cause: 'causes:',
      population: 'populations:'
    }
    _.each(categories, (mainElem, mainKey) => {
      if (_.has(locationSearch.parse(window.location.search), mainKey)) {
        let keyFilter
        _.filter(searchArguments, (e, key) => {
          if (_.isString(e) && e.search(mainElem) >= 0) {
            keyFilter = key
            return keyFilter
          }
        })
        if (keyFilter) {
          const arg = locationSearch.parse(window.location.search)[mainKey]
          searchArguments[keyFilter] = `${mainElem}${arg}`
        }
      }
    })
    SearchController.getSearchResults(searchArguments).then(searchResults => {
      // Get the formatted search results.
      let results = SearchController.formatSearchResults(searchResults)
      if (!searchArguments.page) {
        results = _.sortBy(results, { featured: false })
      }
      // Get the facets
      const facets = SearchController.getSearchFacetsFromResults(searchResults)

      // Get the pager info to update the store.
      const pagerInfo = SearchController.getPagerInfoFromResults(searchResults)

      changeSearchResults(results, facets, pagerInfo)
    })
  }

  handleMobileFilters = () => {
    this.setState({
      mobileFiltersOpened: !this.state.mobileFiltersOpened
    })
  }

  getComponentsConfig = componentName => {
    const { history, locationSearch, searchResults } = this.props
    let facets = searchResults.facets
    if (!_.isEmpty(searchResults.facets)) {
      const international = _.find(searchResults.facets, { name: 'international' })
      let region = _.find(searchResults.facets, { name: 'new_region' })
      if (!_.isEmpty(region) && !_.isEmpty(international)) {
        region.data.items = _.union(region.data.items, international.data.items)
        region.data.itemsToDisplay = _.union(
          region.data.itemsToDisplay,
          international.data.itemsToDisplay
        )
      }
      const index = _.findIndex(facets, { name: 'new_region' })
      facets.splice(index, 1, region)
      facets = _.filter(facets, elem => {
        if (_.has(elem, 'name')) {
          return elem.name != 'international'
        }
      })
    }
    switch (componentName) {
      case 'facets':
        return {
          locationSearch: locationSearch,
          facets: facets,
          handleSearchFacetClick: this.handleSearchFacetClick,
          resetSearch: this.resetSearch,
          history
        }
      case 'pagination':
        return {
          viewsPerPage: this.state.viewsPerPage,
          pagerInfo: searchResults.pager,
          pageNumber: this.state.pageNumber,
          handleSearchPaginationChange: this.handleSearchPaginationChange,
          handlePagerClick: this.handlePagerClick
        }
      case 'card':
        return {
          searchResults: searchResults.value,
          history: this.props.history
        }
      default:
        return {}
    }
  }
  deepSearch = (list, id) => {
    let activeRegion = _.find(list, { id: id })
    if (_.isEmpty(activeRegion)) {
      activeRegion = _.find(list, item => {
        return _.get(item, 'values.id', '') === id
      })
      if (!_.isEmpty(activeRegion)) {
        return activeRegion
      }
    }
    if (_.isEmpty(activeRegion)) {
      _.each(list, elem => {
        if (_.has(elem, 'children') && _.isEmpty(activeRegion)) {
          const json = JSON.stringify(elem.children)
          if (json.search(id) > 0) {
            activeRegion = this.deepSearch(_.get(elem, 'children'), id)
            if (_.isEmpty(activeRegion)) {
              activeRegion = this.deepSearch(_.get(elem, 'children[0]'), id)
            }
          }
        }
        if (!_.isEmpty(activeRegion)) {
          return activeRegion
        }
      })
    }
    return activeRegion
  }

  render() {
    ReactGA.pageview(window.location.pathname + window.location.search)
    const {
      cardsView,
      collapsedActive,
      expandedActive,
      nameSaveSearch,
      selectedFilter,
      snackbar
    } = this.state
    const { searchResults } = this.props
    const showRefreshIndicator = searchResults.value.length === 0
    const queryStrings = locationSearch.parse(window.location.search)
    const facetsConfig = this.getComponentsConfig('facets')
    const paginationConfig = this.getComponentsConfig('pagination')
    const cardConfig = this.getComponentsConfig('card')
    const urlParams = this.getSearchParameters()
    let pills = []
    let searchArguments = locationSearch.parse(window.location.search)

    if (_.has(facetsConfig, 'facets') && urlParams) {
      // facetsConfig['facets']
      _.map(urlParams, (value, key) => {
        key = key === 'region' ? 'new_region' : key
        key = key === 'international' ? 'new_region' : key
        key = key === 'special%20populations' ? 'population' : key
        key = key === 'type%20of%20support' ? 'type_support' : key
        key = key === 'headquarters' ? 'administrative_area' : key
        const filter = _.find(facetsConfig['facets'], item => {
          return item.name === key
          // name: key
        })

        if (filter) {
          value = value.replace('%2C', ',')
          const items = _.uniq(value.split(','))
          if (_.isArray(items)) {
            _.each(items, item => {
              pills.push({ data: this.deepSearch(filter.data.items, item), name: filter.name })
            })
          } else {
            pills.push({ data: this.deepSearch(filter, items), name: filter.name })
          }
        }
      })
    }
    const { t } = getLanguage()
    let searchSubheader = ''
    let searchResultText = ''
    if (_.isEmpty(queryStrings)) {
      searchSubheader = t.search.allResults
    } else {
      const { pagerInfo } = paginationConfig
      const firstResult =
        parseInt(pagerInfo.current_page, 0) * parseInt(pagerInfo.items_per_page, 0)
      let lastResult = firstResult + parseInt(pagerInfo.items_per_page, 0)
      if (lastResult > pagerInfo.count) {
        lastResult = pagerInfo.count
      }
      if (!_.isEmpty(pagerInfo)) {
        searchSubheader = (
          <small>
            {firstResult + 1} - {lastResult} {t.global.of} {numberWithCommas(pagerInfo.count)}{' '}
            {t.search.allResultsResult} {t.search.of} {numberWithCommas(pagerInfo.pages)} pages
          </small>
        )
      }
      searchResultText = queryStrings.search_fulltext
    }

    if (typeof this.state.timeout !== 'undefined' && this.state.timeout === true) {
      ReactGA.event({
        category: 'Search',
        action: `no search results`
      })
    }

    if (typeof this.state.timeout !== 'undefined' && this.state.timeout === true) {
      return (
        <div className="profile-special-notes">
          <div className="profile-special-notes-note">{t.search.noResults}</div>
        </div>
      )
    }

    if (showRefreshIndicator) {
      return (
        <Row>
          <div className="refresh-container">
            <CircularProgress size={60} thickness={5} color="#4c9eff" />
          </div>
        </Row>
      )
    }
    const searchTitleLength = nameSaveSearch ? nameSaveSearch.length : 0
    const actions = [
      <FlatButton
        label={this.state.open === 'save' ? t.global.save : t.search.applyFilters}
        primary={true}
        className={'main-button'}
        disabled={this.state.open === 'save' ? !(searchTitleLength > 1) : false}
        onClick={() => {
          if (this.state.open === 'save') {
            this.saveSearches(nameSaveSearch)
          } else {
            if (!_.isEmpty(selectedFilter)) {
              window.location.href = selectedFilter.uri
            }
          }
          this.setState({ nameSaveSearch: '' })
          this.handleClose(this.state.open)
        }}
      />,
      <FlatButton
        label={t.global.close}
        className={'Material-cards__expanded-state add'}
        primary={true}
        onClick={this.handleClose}
      />
    ]
    return (
      <React.Fragment>
        <Snackbar
          open={_.get(snackbar, 'open', false)}
          message={_.get(snackbar, 'message', '')}
          autoHideDuration={4000}
          onRequestClose={() => this.setState({ snackbar: { open: false } })}
          className={'message-danger'}
        />
        <Row>
          <Col mdOffset={3} xs={12} md={9}>
            <h1 className={'search-title'} />
          </Col>
        </Row>
        <Row>
          {/* Facets + Filters on Mobile */}
          <MediaQuery query="(max-width: 767px)">
            <Drawer
              width={310}
              open={this.state.mobileFiltersOpened}
              docked={false}
              containerClassName="Search-page__filters-mobile"
              onRequestChange={open => {
                this.setState({ mobileFiltersOpened: open })
              }}
            >
              <SearchPageFacets {...facetsConfig} initiallyOpen={false} />
              <SearchPageFilters
                handleSearchFilterChange={this.handleSearchFilterChange}
                showOnlySorting={false}
                hideSorting={true}
              />
            </Drawer>
          </MediaQuery>
          {/* ENDOF: Facets + Filters on Mobile */}

          {/* Left column desktop */}
          <MediaQuery query="(min-width: 768px)">
            <Col xs={12} md={3}>
              {/* Search facets: /src/pages/pages/components/facets/SearchPageFacets.js */}
              <SearchPageFacets {...facetsConfig} initiallyOpen={true} />
              {/* ENDOF: Search facets */}
            </Col>
          </MediaQuery>
          {/* ENDOF: Left column desktop */}

          {/* Right column */}
          <Col xs={12} md={9}>
            <div className={'Search-page'}>
              <Row>
                <div className={'Row-search-header'}>
                  {searchResultText ? (
                    <div className={'Row-search-header--title'}>
                      <h3>
                        {t.search.label} <i>"{searchResultText}"</i>
                      </h3>
                    </div>
                  ) : (
                    <div className={'Row-search-header--title'}>
                      <h3>{t.search.mainTitle}</h3>
                    </div>
                  )}
                  <div className={'Search-page__buttons-container'}>
                    <FlatButton
                      className={`main-button`}
                      label={t.search.saveMySearch}
                      labelPosition="before"
                      onClick={() => this.handleOpen('save')}
                    />

                    <FlatButton
                      className={`main-button`}
                      label={t.search.viewMySearchs}
                      labelPosition="before"
                      onClick={() => this.handleOpen('saved')}
                    />

                    <FlatButton
                      className={`Material-cards__expanded-state add`}
                      label={t.search.reset}
                      labelPosition="before"
                      disabled={!window.location.search}
                      onClick={() => {
                        window.location.href = '/search'
                      }}
                    />
                  </div>
                </div>
                <hr />
                <Col xs={12}>
                  <div className={'Search-page__buttons-container'}>
                    <Pills items={pills} handleSearchFacetClick={this.handleSearchFacetClick} />
                  </div>
                </Col>
              </Row>
            </div>
            {/* Search filters: /src/pages/pages/components/filters/SearchPageFilters.js */}
            <MediaQuery query="(min-width: 768px)">
              <Row>
                <SearchPageFilters
                  handleSearchFilterChange={this.handleSearchFilterChange}
                  showOnlySorting={false}
                  hideSorting={false}
                />
              </Row>
            </MediaQuery>
            {/* ENDOF: Search filters */}
            <div style={{ position: 'relative' }}>
              <Row>
                <Col xs={12} md={10}>
                  {/* Results count */}
                  <h2 className="Search-page__results">{searchSubheader}</h2>
                  {/* ENDOF: Results count */}
                  <MediaQuery query="(max-width: 767px)">
                    <Row>
                      <SearchPageFilters
                        handleSearchFilterChange={this.handleSearchFilterChange}
                        showOnlySorting={true}
                        hideSorting={false}
                      />
                      <FlatButton
                        className="Search-page__mobile-filters-button"
                        label={t.search.filterMobile}
                        onClick={this.handleMobileFilters}
                      />
                    </Row>
                  </MediaQuery>
                </Col>

                <MediaQuery query="(min-width: 769px)">
                  <Col md={2}>
                    <SearchPageViewChanger
                      onClick={this.handleCardsView}
                      expandedActive={expandedActive}
                      collapsedActive={collapsedActive}
                    />
                  </Col>
                </MediaQuery>
              </Row>
            </div>
            <Row>
              {/* Expanded Card: /src/components/cards/ExpandedCardDEPRECATED.js */}
              {cardsView === 'expanded' && (
                <ExpandedCardDEPRECATED
                  {...cardConfig}
                  page={searchArguments.page}
                  pagination={paginationConfig}
                />
              )}
              {/* ENDOF: Expanded Card */}

              {/* Collapsed Card: /src/components/cards/CollapsedCard.js */}
              {cardsView === 'collapsed' && (
                <div>
                  <MediaQuery query="(max-width: 767px)">
                    <ExpandedCardDEPRECATED
                      {...cardConfig}
                      page={searchArguments.page}
                      pagination={paginationConfig}
                    />
                  </MediaQuery>
                  <MediaQuery query="(min-width: 768px)">
                    <CollapsedCard_DEPRECATED
                      {...cardConfig}
                      page={searchArguments.page}
                      pagination={paginationConfig}
                    />
                  </MediaQuery>
                </div>
              )}
              {/* ENDOF: Collapsed Card */}
            </Row>
            <Row>
              {/* Pagination */}
              <div>
                <MediaQuery query="(min-width: 990px)">
                  <Pagination {...paginationConfig} pagerSize={5} />
                </MediaQuery>
                <MediaQuery query="(max-width: 991px)">
                  <Pagination {...paginationConfig} pagerSize={3} />
                </MediaQuery>
              </div>
              {/* ENDOF: Pagination */}
            </Row>
          </Col>
          {/* ENDOF: Right column */}
        </Row>
        <Dialog
          title={
            this.state.open === 'save'
              ? t.search.saveSearch.blockTitle
              : t.search.savedSearch.blockTitle
          }
          actions={actions}
          modal={false}
          open={!!this.state.open}
          autoScrollBodyContent={true}
          onRequestClose={this.handleClose}
          actionsContainerClassName={'Dialog-buttons--wrapper'}
        >
          <div className={'dialog-body'}>
            {this.state.open === 'save' ? (
              <SaveSearch parent={this} />
            ) : (
              <SavedList parent={this} />
            )}
          </div>
        </Dialog>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  searchLanguage: state.searchLanguage,
  searchOpenToRequest: state.searchOpenToRequest,
  searchTypicalGiftFrom: state.searchTypicalGiftFrom,
  searchTypicalGiftTo: state.searchTypicalGiftTo,
  searchSorting: state.searchSorting,
  searchResults: state.searchResults
})

const mapDispatchToProps = dispatch => ({
  changeSearchResults: (searchResults, searchFacets, pagerInfo) =>
    dispatch(updateSearchResults(searchResults, searchFacets, pagerInfo)),
  searchCauseLiveUpdate: params => {
    dispatch({ type: 'CHANGE_SEARCH_LIVE_UPDATE_CAUSE', value: params })
  },
  searchRegionLiveUpdate: params => {
    dispatch({ type: 'CHANGE_SEARCH_LIVE_UPDATE_REGION', value: params })
  },
  boundChangeSearchText: searchText => dispatch(changeSearchText(searchText))
})

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage)
