// Global DOM components.
import React, { Component } from 'react'
import * as locationSearch from 'query-string'

// Custom Search Components.
import SearchPageFiltersDropdown from './SearchPageFiltersDropdown'
import FromToFilter from './FromToFilter-DEPRECATED'

// Redux.
import { connect } from 'react-redux'
import {
  changeSearchLanguage,
  changeSearchOpenToReques,
  changeSearchTypicalGiftFrom,
  changeSearchTypicalGiftTo,
  changeSearchSorting
} from 'store/actions/search'

// App Language.
import { getLanguage } from 'data/locale'

class SearchPageFilters extends Component {
  state = {
    showTypicalGiftActions: false,
    showTypicalGiftClear: false,
    searchTypicalGiftFrom: '',
    searchTypicalGiftTo: ''
  }

  componentDidMount() {
    const {
      handleChangeSearchLanguage,
      handleChangeSearchOpenToRequest,
      handleChangeSearchSorting
    } = this.props
    const queryStrings = locationSearch.parse(window.location.search)
    let sorting = 'search_api_relevance'

    if (typeof queryStrings.sort_by !== 'undefined') {
      sorting = queryStrings.sort_by
    } else if (typeof queryStrings.search_fulltext !== 'undefined') {
      sorting = 'search_api_relevance'
    }

    let searchFilters = {
      language: typeof queryStrings.language !== 'undefined' ? queryStrings.language : null,
      openToRequest:
        typeof queryStrings.open_requests !== 'undefined' ? queryStrings.open_requests : null,
      typicalFrom:
        typeof queryStrings.typical_gift_min !== 'undefined' ? queryStrings.typical_gift_min : '',
      typicalTo:
        typeof queryStrings.typical_gift_max !== 'undefined' ? queryStrings.typical_gift_max : '',
      sorting
    }

    // Update the store with the values provided on the query string.
    handleChangeSearchLanguage(searchFilters.language)
    handleChangeSearchOpenToRequest(searchFilters.openToRequest)
    handleChangeSearchSorting(searchFilters.sorting)

    // Update the states, that will update the store
    // when the submit button is pressed.
    this.setState({
      searchTypicalGiftFrom: searchFilters.typicalFrom,
      searchTypicalGiftTo: searchFilters.typicalTo
    })
  }

  // Controlled components. Single source of true for the input values.
  handleTypicalChange = (e, inputName) => {
    if (e.target.value !== '') {
      this.setState({ showTypicalGiftActions: true })
    }

    this.setState({ ['searchTypicalGift' + inputName]: e.target.value })
  }

  hideTypicalActions = () => {
    const {
      handleSearchFilterChange,
      handleChangeSearchTypicalGiftFrom,
      handleChangeSearchTypicalGiftTo
    } = this.props

    this.setState({
      showTypicalGiftActions: false,
      showTypicalGiftClear: false,
      searchTypicalGiftFrom: '',
      searchTypicalGiftTo: ''
    })

    // Update the redux store.
    handleChangeSearchTypicalGiftFrom('')
    handleChangeSearchTypicalGiftTo('')

    setTimeout(function () {
      handleSearchFilterChange()
    }, 10)
  }

  submitTypicalValues = () => {
    const {
      handleSearchFilterChange,
      handleChangeSearchTypicalGiftFrom,
      handleChangeSearchTypicalGiftTo
    } = this.props

    const { searchTypicalGiftFrom, searchTypicalGiftTo } = this.state

    // Show clear button.
    this.setState({
      showTypicalGiftActions: false,
      showTypicalGiftClear: true
    })

    // Update the redux store.
    handleChangeSearchTypicalGiftFrom(searchTypicalGiftFrom)
    handleChangeSearchTypicalGiftTo(searchTypicalGiftTo)

    setTimeout(function () {
      handleSearchFilterChange()
    }, 10)
  }

  handleLanguageFilterChange = (e, index, value) => {
    const { handleSearchFilterChange, handleChangeSearchLanguage } = this.props

    // Update the Redux store.
    handleChangeSearchLanguage(value)

    setTimeout(function () {
      handleSearchFilterChange()
    }, 10)
  }

  handleOpenToRequestFilterChange = (e, index, value) => {
    const { handleSearchFilterChange, handleChangeSearchOpenToRequest } = this.props

    // Update the Redux store.
    handleChangeSearchOpenToRequest(value)

    setTimeout(function () {
      handleSearchFilterChange()
    }, 10)
  }

  handleSearchSortingChange = (e, index, value) => {
    const { handleSearchFilterChange, handleChangeSearchSorting } = this.props

    // Update the Redux store.
    handleChangeSearchSorting(value)

    setTimeout(function () {
      handleSearchFilterChange()
    }, 10)
  }

  render() {
    const { hideSorting, searchLanguage, showOnlySorting } = this.props
    const { t } = getLanguage()
    const sortingMenuOptions = [
      { value: 'title_2', primaryText: t.search.filter.name },
      { value: 'search_api_relevance', primaryText: t.search.filter.match },
      { value: 'typical_gift', primaryText: t.cards.typicalGift },
      { value: 'next_deadline_date', primaryText: t.search.filter.priority },
      { value: 'estimated_capacity', primaryText: t.search.filter.capacity }
    ]

    if (showOnlySorting) {
      return (
        <SearchPageFiltersDropdown
          fieldName="sorting"
          floatingLabelText={t.search.filter.sortBy}
          icon="Sort"
          value={this.props.searchSorting.value}
          onChange={this.handleSearchSortingChange}
          menuItems={sortingMenuOptions}
        />
      )
    }

    return (
      <div className="Search-page__filters">
        <SearchPageFiltersDropdown
          fieldName="language"
          floatingLabelText={t.global.language}
          icon="KeyboardArrowDown"
          value={searchLanguage.language}
          onChange={this.handleLanguageFilterChange}
          menuItems={[
            { value: null, primaryText: t.global.all },
            { value: 'en', primaryText: t.global.languages.english },
            { value: 'fr', primaryText: t.global.languages.french },
            { value: 'bi', primaryText: t.global.languages.bilingual }
          ]}
        />

        <SearchPageFiltersDropdown
          fieldName="requests"
          floatingLabelText={t.search.openRequests}
          icon="KeyboardArrowDown"
          value={this.props.searchOpenToRequest.value}
          onChange={this.handleOpenToRequestFilterChange}
          menuItems={[
            { value: null, primaryText: t.global.all },
            { value: 'yes', primaryText: t.global.yes },
            { value: 'no', primaryText: t.global.no },
            { value: 'unknown', primaryText: t.global.unknown }
          ]}
        />

        <FromToFilter
          page="Search"
          field="typical"
          fromLabel={t.cards.typicalGift}
          toLabel=" "
          fromValue={this.state.searchTypicalGiftFrom}
          toValue={this.state.searchTypicalGiftTo}
          showActions={this.state.showTypicalGiftActions}
          showClear={this.state.showTypicalGiftClear}
          onChange={this.handleTypicalChange}
          onSubmit={this.submitTypicalValues}
          onCancel={this.hideTypicalActions}
        />

        {!hideSorting && (
          <SearchPageFiltersDropdown
            fieldName="sorting"
            floatingLabelText={t.search.filter.sortBy}
            icon="Sort"
            value={this.props.searchSorting.value}
            onChange={this.handleSearchSortingChange}
            menuItems={sortingMenuOptions}
          />
        )}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  searchLanguage: state.searchLanguage,
  searchOpenToRequest: state.searchOpenToRequest,
  searchTypicalGiftFrom: state.searchTypicalGiftFrom,
  searchTypicalGiftTo: state.searchTypicalGiftTo,
  searchSorting: state.searchSorting
})

const mapDispatchToProps = dispatch => ({
  handleChangeSearchLanguage: selectedLanguage => dispatch(changeSearchLanguage(selectedLanguage)),
  handleChangeSearchOpenToRequest: selectedRequest =>
    dispatch(changeSearchOpenToReques(selectedRequest)),
  handleChangeSearchTypicalGiftFrom: value => dispatch(changeSearchTypicalGiftFrom(value)),
  handleChangeSearchTypicalGiftTo: value => dispatch(changeSearchTypicalGiftTo(value)),
  handleChangeSearchSorting: sorting => dispatch(changeSearchSorting(sorting))
})

export default connect(mapStateToProps, mapDispatchToProps)(SearchPageFilters)
