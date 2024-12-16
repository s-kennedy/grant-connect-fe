// Global DOM components.
import React, { Component } from 'react'
import { AutoComplete, FlatButton } from 'material-ui'
import { Search } from 'material-ui-icons'
import ReactTooltip from 'react-tooltip'

import { changeSearchText } from '../../../store/actions'

// Helpers.
import _ from 'lodash'

// Custom global components.
import NestedDropdown from '../../inputs/NestedDropdown'

import { connect } from 'react-redux'
// Controllers.
import * as SearchController from '../../../controllers/SearchController-DEPRECATED'

// App Language.
import { getLanguage } from 'data/locale'

// OAuth.
import * as OAuth from '../../../utils/OAuth/ContentaOauth-DEPRECATED'

const { t } = getLanguage()
const initialState = {
  causeText: t.search.cause,
  regionText: t.search.region,
  formHighlighted: '',
  causeSelectOpened: false,
  causeItems: [],
  regionSelectOpened: false,
  regionItems: [],
  causeParentItemId: '',
  regionParentItemId: '',
  causeChildItemId: '',
  regionChildItemId: '',
  opened: null,
  causeChildItems: [
    {
      id: -1,
      attributes: {
        name: t.global.loading
      }
    }
  ],
  regionChildItems: [
    {
      id: -1,
      attributes: {
        name: t.global.loading
      }
    }
  ]
}

class SearchForm extends Component {
  state = initialState

  // Adding mousedown event listener when component is mounted.
  componentDidMount() {
    // Adding the listener for when clicking out of the component.
    document.addEventListener('mousedown', this.handleClickOutsideElement)
    if (_.isEmpty(this.props.globalStore.searchCause.cause)) {
      // SearchController.getTaxonomy('causes').then(parentTermsData => {
      //   this.setState({ causeItems: parentTermsData })
      //   this.props.updateCause(parentTermsData)
      //   this.buildCausesData()
      // })
    } else {
      this.setState({ causeItems: this.props.globalStore.searchCause.cause })
    }
    if (_.isEmpty(this.props.globalStore.searchRegion.value)) {
      // SearchController.getTaxonomy('new_region').then((parentTermsData = {}) => {
      //   const firstItem = { ...parentTermsData['0'] }
      //   delete firstItem.children
      //   // Let's start from Canada.
      //   let children = _.get(parentTermsData['0'], 'children', [])
      //   children = this.regionSort(children)
      //   children.unshift(firstItem)
      //   const regions = _.merge(this.state.regionItems, children)
      //   this.setState({ regionItems: regions })
      //   this.props.updateRegion(regions, null)
      //   this.buildRegionData()
      // })
    } else {
      this.setState({ regionItems: this.props.globalStore.searchRegion.value })
    }
  }
  regionSort = regions => {
    _.each(regions, region => {
      if (_.has(region, 'children')) {
        region.children = this.regionSort(region.children)
      }
    })
    return _.orderBy(regions, ['name'], ['asc'])
  }
  componentDidUpdate() {
    const searchParams = this.getSearchParameters()
    if (!_.isEqual(this.props.searchParams.value, searchParams)) {
      this.props.searchParamsUpdate(searchParams)
    }
    // this.buildCausesData();
  }

  getSearchParameters = () => {
    let prmstr = window.location.search.substr(1)
    prmstr = prmstr != null && prmstr != '' ? this.transformToAssocArray(prmstr) : {}
    if (_.isEmpty(prmstr) && !_.isEmpty(this.props.searchRegion.default)) {
      prmstr = { region: this.props.searchRegion.default }
    }
    return prmstr
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

  buildCausesData = () => {
    let causeActive = { name: t.search.cause }
    if (_.has(this.props.globalStore, 'searchParams.value.cause')) {
      if (!_.isEmpty(this.state.causeItems)) {
        const split = _.split(this.props.globalStore.searchParams.value.cause, ',')
        _.each(split, causeElem => {
          const activeCause = _.find(this.state.causeItems, { tid: causeElem })
          if (!_.isEmpty(activeCause)) {
            causeActive = activeCause
          }
        })
      }
    }

    if (_.has(causeActive, 'name') && this.state.causeText != causeActive.name) {
      this.setState({
        causeText: causeActive.name,
        causeChildItemId: causeActive.tid,
        url: JSON.stringify(this.getSearchParameters())
      })
    }
    this.updateSearchHistory()
  }

  buildRegionData = () => {
    let regionActive = {}
    const split = _.split(this.props.globalStore.searchParams.value.region, ',')
    if (
      _.isEmpty(this.state.regionChildItemId) ||
      this.state.regionChildItemId == this.state.opened
    ) {
      if (!_.isEmpty(this.state.regionItems)) {
        regionActive = this.regionRecursion(this.state.regionItems, split[0])
      }
    }
    if (!_.isEmpty(regionActive) && this.state.regionText != regionActive.name) {
      this.setState({
        regionText: regionActive.name,
        regionChildItemId: regionActive.tid,
        opened: regionActive.tid,
        url: JSON.stringify(this.getSearchParameters())
      })
    }
    this.updateSearchHistory('new_region')
  }

  regionRecursion = (initElem, searchTarget) => {
    let activeRegion = _.find(initElem, { tid: searchTarget })
    if (_.isEmpty(activeRegion)) {
      _.each(initElem, elem => {
        if (_.has(elem, 'children')) {
          const json = JSON.stringify(elem.children)
          if (json.search(searchTarget) > 0) {
            activeRegion = this.regionRecursion(elem.children, searchTarget)
          }
        }
      })
    }
    return activeRegion
  }

  // Removing mousedown event listener before component is unmounted.
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutsideElement)
  }

  handleClickOutsideElement = event => {
    if (this.causeWrapperRef && !this.causeWrapperRef.contains(event.target)) {
      this.setState({ causeSelectOpened: false })
    }

    if (this.regionWrapperRef && !this.regionWrapperRef.contains(event.target)) {
      this.setState({ regionSelectOpened: false })
    }

    if (this.formWrapperRef && !this.formWrapperRef.contains(event.target)) {
      this.setState({ formHighlighted: '' })
    }
  }

  setFormHighlighted = () => {
    this.setState({ formHighlighted: 'highlight' })
  }

  handleItemSelection = (childItemId, childItemLabel, term) => {
    if (this.state[`${term}Text`] == childItemLabel) {
      this.setState({
        [`${term}Text`]: initialState[`${term}Text`],
        [`${term}SelectOpened`]: false,
        [`${term}ChildItemId`]: '',
        [`${term}ParentItemId`]: ''
      })
    } else {
      this.setState({
        [`${term}Text`]: childItemLabel,
        [`${term}SelectOpened`]: false,
        [`${term}ChildItemId`]: childItemId
      })
    }
    //Change the text of the dropdown.

    document.getElementById('Header-submit').focus()
  }
  handleItemSelectToggle = term => {
    this.setState({ [`${term}SelectOpened`]: !this.state[`${term}SelectOpened`] })
  }

  handleItemCloseSelection = term => {
    this.setState({
      [`${term}Text`]: initialState[`${term}Text`],
      [`${term}SelectOpened`]: false,
      [`${term}ChildItemId`]: '',
      [`${term}ParentItemId`]: ''
    })
  }

  loadChildTermsFromParent = (uuid, term) => {
    // Adding a loading before it loads the items.
    this.setState({
      [`${term}ChildItems`]: initialState[`${term}ChildItems`],
      [`${term}ParentItemId`]: uuid
    })

    SearchController.getChildTemsByUuid(uuid, `${term}s`).then(childTermsData => {
      this.setState({ [`${term}ChildItems`]: childTermsData })
    })
  }

  updateSearchHistory = (term = 'cause') => {
    if (term == 'cause') {
      const states = {
        causeText: this.state.causeText,
        causeChildItemId: this.state.causeChildItemId,
        url: JSON.stringify(this.getSearchParameters())
      }

      if (!_.isEqual(states, this.props.searchLiveCause.value)) {
        this.props.searchCauseLiveUpdate({
          causeText: this.state.causeText,
          causeChildItemId: this.state.causeChildItemId,
          url: JSON.stringify(this.getSearchParameters())
        })
      }
    } else {
      const states = {
        regionText: this.state.regionText,
        regionChildItemId: this.state.regionChildItemId,
        url: JSON.stringify(this.getSearchParameters())
      }

      if (!_.isEqual(states, this.props.searchLiveCause.value)) {
        this.props.searchRegionLiveUpdate({
          regionText: this.state.regionText,
          regionChildItemId: this.state.regionChildItemId,
          url: JSON.stringify(this.getSearchParameters())
        })
      }
    }
  }

  filter = (i, e) => {
    return e
  }

  render() {
    let causeText, causeChildItemId
    if (
      _.has(this.props.searchLiveCause, 'value.url') &&
      this.props.searchLiveCause.value.url != JSON.stringify(this.getSearchParameters())
    ) {
      if (JSON.stringify(this.getSearchParameters()) == '{}') {
        this.setState({ causeText: t.search.cause, causeChildItemId: '', url: '{}' })
        this.updateSearchHistory()
        causeText = t.search.cause
        causeChildItemId = ''
      } else {
        this.buildCausesData()
        causeText = this.props.searchLiveCause.value.causeText
        causeChildItemId = this.props.searchLiveCause.value.causeChildItemId
      }
    } else {
      causeText = this.state.causeText
      causeChildItemId = this.state.causeChildItemId
    }

    // Regions handler
    let regionText, regionChildItemId
    if (
      _.has(this.props.searchLiveRegion, 'value.url') &&
      this.props.searchLiveRegion.value.url != JSON.stringify(this.getSearchParameters())
    ) {
      if (JSON.stringify(this.getSearchParameters()) == '{}') {
        this.setState({ regionText: t.search.region, regionChildItemId: '', url: '{}' })
        this.updateSearchHistory('new_region')
        regionText = t.search.cause
        regionChildItemId = ''
      } else {
        this.buildRegionData()
        regionText = this.props.searchLiveRegion.value.regionText
        regionChildItemId = this.props.searchLiveRegion.value.regionChildItemId
      }
    } else {
      regionText = this.state.regionText
      regionChildItemId = this.state.regionChildItemId
    }

    const {
      searchText,
      searchAutocomplete,
      onUpdateInput,
      handleSearchRequest,
      gotoFunder,
      clearSearchText
    } = this.props

    return (
      <form
        className="Header-search"
        ref={node => (this.formWrapperRef = node)}
        onSubmit={e => {
          clearSearchText('')
          return handleSearchRequest(
            e,
            this.state.causeText,
            this.state.causeChildItemId,
            initialState.causeText,
            this.state.regionText,
            this.state.regionChildItemId,
            initialState.regionText
          )
        }}
      >
        {/* Autocomplete Field */}
        <div className="Header-search-field-container">
          <AutoComplete
            data-tip={t.search.toolTip}
            className={`Header-search__autocomplete ${this.state.formHighlighted}`}
            menuCloseDelay={0}
            openOnFocus={true}
            underlineShow={false}
            hintText={t.search.hintText}
            searchText={searchText}
            dataSource={searchAutocomplete}
            menuProps={{ className: 'Header-search__autocomplete-menu-list' }}
            popoverProps={{ className: 'Header-search__autocomplete-menu-wrapper' }}
            onFocus={this.setFormHighlighted}
            filter={this.filter}
            onUpdateInput={onUpdateInput}
            onNewRequest={gotoFunder}
            fullWidth={true}
            menuStyle={{ overflowY: 'hidden' }}
            listStyle={{ root: { border: '1px solid #ddd' } }}
          />
          <ReactTooltip place="bottom" effect="solid" />
        </div>
        {/* ENDOF: Autocomplete Field */}

        {/* Cause Dropdown */}
        <div className="Header-search-field-container" ref={node => (this.causeWrapperRef = node)}>
          <NestedDropdown
            open={this.state.causeSelectOpened}
            primaryText={causeText}
            formHighlighted={this.state.formHighlighted}
            items={this.state.causeItems}
            deep={1}
            childItemId={causeChildItemId}
            parentItemId={this.state.causeParentItemId}
            onCloseClickHandler={() => this.handleItemCloseSelection('cause')}
            onClickHandler={(childItemId, childItemLabel) =>
              this.handleItemSelection(childItemId, childItemLabel, 'cause')
            }
            changeOpened={item => {
              if (item.props.openstate == 'true') {
                this.setState({ opened: item.props.parenttid })
              } else {
                this.setState({ opened: item.props.tid })
              }
            }}
            onFocusHandler={this.setFormHighlighted}
            onNestedListToggleHandler={() => this.handleItemSelectToggle('cause')}
          />
        </div>
        {/* ENDOF: Cause Dropdown */}

        {/* Region Dropdown */}
        <div className="Header-search-field-container" ref={node => (this.regionWrapperRef = node)}>
          <NestedDropdown
            open={this.state.regionSelectOpened}
            primaryText={regionText}
            deep={3}
            items={this.state.regionItems}
            formHighlighted={this.state.formHighlighted}
            parentItemId={this.state.regionParentItemId}
            childItemId={regionChildItemId}
            opened={this.state.opened}
            onParentClickHandler={uuid => this.loadChildTermsFromParent(uuid, 'region')}
            onCloseClickHandler={() => this.handleItemCloseSelection('region')}
            onClickHandler={(parentId, parentItemId) =>
              this.handleItemSelection(parentId, parentItemId, 'region')
            }
            onFocusHandler={this.setFormHighlighted}
            changeOpened={item => {
              if (item.props.openstate == 'true') {
                this.setState({ opened: item.props.parenttid })
              } else {
                this.setState({ opened: item.props.tid })
              }
            }}
            onNestedListToggleHandler={() => this.handleItemSelectToggle('region')}
          />
        </div>
        {/* ENDOF: Region Dropdown */}

        <FlatButton
          id="Header-submit"
          type="submit"
          icon={<Search className="Header-search__submit-icon" />}
          className="Header-search__submit"
        />
      </form>
    )
  }
}

export default connect(
  state => ({
    globalStore: state,
    searchParams: state.searchParams,
    searchLiveCause: state.searchLiveCause,
    searchLiveRegion: state.searchLiveRegion,
    searchRegion: state.searchRegion
  }),
  dispatch => ({
    updateCause: cause => {
      dispatch({ type: 'CHANGE_SEARCH_CAUSE', value: cause })
    },
    updateRegion: (region, Default = null) => {
      dispatch({ type: 'CHANGE_SEARCH_REGION', value: region, default: Default })
    },
    searchParamsUpdate: params => {
      dispatch({ type: 'CHANGE_SEARCH_PARAMS', value: params })
    },
    searchCauseLiveUpdate: params => {
      dispatch({ type: 'CHANGE_SEARCH_LIVE_UPDATE_CAUSE', value: params })
    },
    searchRegionLiveUpdate: params => {
      dispatch({ type: 'CHANGE_SEARCH_LIVE_UPDATE_REGION', value: params })
    },
    clearSearchText: () => dispatch(changeSearchText(''))
  })
)(SearchForm)
