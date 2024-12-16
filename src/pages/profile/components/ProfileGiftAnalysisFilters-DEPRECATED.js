// Global DOM components.
import React, { Component } from 'react'
import url from 'url'
import * as locationSearch from 'query-string'

// Custom DOM components.
import SearchPageFiltersDropdown from '../../search/components/filters/SearchPageFiltersDropdown'
import FromToFilter from '../../search/components/filters/FromToFilter'

import { connect } from 'react-redux'
import { getGiftDataPerFunder, updateGiftDataQueryString } from 'store/actions/search'

// Controllers.
import * as SearchController from '../../../controllers/SearchController-DEPRECATED'
import * as FunderController from '../../../controllers/FunderController-DEPRECATED'

// Helpers.
import _ from 'lodash'

// App Language.
import { getLanguage } from 'data/locale'

const { t } = getLanguage()
class ProfileGiftAnalysisFilters extends Component {
  state = {
    cause: null,
    causeType: null,
    parentCauses: [],
    parentInternational: [],
    parentPopulation: [],
    year: null,
    showGiftSizeActions: false,
    showGiftSizeClear: false,
    giftSizeFrom: '',
    giftSizeTo: '',
    yearOptions: [{ value: null, primaryText: t.global.all }]
  }

  componentWillMount() {
    // Get all the parent causes.
    SearchController.getParentCauses().then(parentCauses => {
      this.setState({ parentCauses })
      SearchController.getParentInternational().then(parentInternational => {
        this.setState({ parentInternational })
        SearchController.getParentPopulation().then(parentPopulation => {
          this.setState({ parentPopulation })
        })
      })
    })
    const { giftData } = this.props
    const urlObject = url.parse(giftData.links.self)
    const queryStrings = locationSearch.parse(urlObject.search)

    if (!_.isEmpty(queryStrings)) {
      let yearOptions = this.state['yearOptions']
      for (let y = new Date().getFullYear(); y >= 1980; y--) {
        const qs = { 'filter[year][value]': y }
        FunderController.getPagerInfo(this.props.funderId, qs).then(pagerInfo => {
          if (pagerInfo.total > 0) {
            yearOptions.push({ value: y, primaryText: y })
            // yearOptions
            yearOptions = _.orderBy(yearOptions, ['value'], ['desc'])
            this.setState({ yearOptions: yearOptions })
          }
        })
      }
    }
  }

  handleCauseChange = (e, index, data) => {
    const { giftData } = this.props
    const urlObject = url.parse(giftData.links.self)
    const queryStrings = locationSearch.parse(urlObject.search)

    let newQueryString = {}

    if (data !== null) {
      let [type, id] = data.split('___')
      if (type.indexOf('cause') > -1) type = 'causes'
      if (type.indexOf('population') > -1) type = 'populations'
      const causeTids = [parseInt(id, 0)]
      SearchController.getTermTreeByParent(causeTids[0], type).then(causeChildren => {
        for (let causeChild in causeChildren) {
          causeTids.push(causeChildren[causeChild].tid)
        }

        for (let queryString in queryStrings) {
          if (queryString.indexOf('filter[cause]') === -1) {
            newQueryString[queryString] = queryStrings[queryString]
          }
        }

        // Get the proper URL for a new API call.
        newQueryString['filter[cause][condition][operator]'] = 'IN'
        newQueryString['filter[cause][condition][path]'] = 'cause'
        newQueryString['filter[cause][condition][value][]'] = causeTids

        this.updateGiftResults(newQueryString)
        this.setState({ cause: `${type}___${id}` })
      })
    } else {
      for (let queryString in queryStrings) {
        if (queryString.indexOf('filter[cause]') === -1) {
          newQueryString[queryString] = queryStrings[queryString]
        }
      }

      this.updateGiftResults(newQueryString)
      this.setState({ cause: data })
    }
  }

  handleYearChange = (e, index, year) => {
    const { giftData } = this.props
    const urlObject = url.parse(giftData.links.self)
    const queryStrings = locationSearch.parse(urlObject.search)
    let newQueryString = {}

    if (year !== null) {
      for (let queryString in queryStrings) {
        if (queryString.indexOf('filter[year][value]') === -1) {
          newQueryString[queryString] = queryStrings[queryString]
        }
      }

      // Get the proper URL for a new API call.
      newQueryString['filter[year][value]'] = year
    } else {
      for (let queryString in queryStrings) {
        if (queryString.indexOf('filter[year]') === -1) {
          newQueryString[queryString] = queryStrings[queryString]
        }
      }
    }

    this.updateGiftResults(newQueryString)

    this.setState({ year })
  }

  handleGiftSizeChange = (e, inputName) => {
    if (e.target.value !== '') {
      this.setState({ showGiftSizeActions: true })
    }

    this.setState({ [`giftSize${inputName}`]: e.target.value })
  }

  submitGiftSize = () => {
    const { giftData } = this.props
    const urlObject = url.parse(giftData.links.self)
    const queryStrings = locationSearch.parse(urlObject.search)
    let newQueryString = {}
    let operator

    for (let queryString in queryStrings) {
      if (queryString.indexOf('filter[amount][condition][value]') === -1) {
        newQueryString[queryString] = queryStrings[queryString]
      }
    }

    if (this.state.giftSizeFrom !== '' && this.state.giftSizeTo !== '') {
      operator = 'BETWEEN'
      newQueryString['filter[amount][condition][value][]'] = [
        this.state.giftSizeFrom,
        this.state.giftSizeTo
      ]
    } else if (this.state.giftSizeFrom === '' && this.state.giftSizeTo !== '') {
      operator = '<'
      newQueryString['filter[amount][condition][value][]'] = [this.state.giftSizeTo]
    } else if (this.state.giftSizeFrom !== '' && this.state.giftSizeTo === '') {
      operator = '>'
      newQueryString['filter[amount][condition][value][]'] = [this.state.giftSizeFrom]
    }

    if (operator !== undefined) {
      // Get the proper URL for a new API call.
      newQueryString['filter[amount][condition][operator]'] = operator
      newQueryString['filter[amount][condition][path]'] = 'amount'
    }

    this.updateGiftResults(newQueryString)

    this.setState({ showGiftSizeClear: true })
  }

  clearGiftSize = () => {
    this.setState({
      showGiftSizeActions: false,
      showGiftSizeClear: false,
      giftSizeFrom: '',
      giftSizeTo: ''
    })
  }

  updateGiftResults = queryString => {
    const { getGiftDataPerFunder, updateGiftDataQueryString } = this.props
    const apiUrlQueryStrings = decodeURIComponent(locationSearch.stringify(queryString))
    FunderController.getGiftDataWithArguments(apiUrlQueryStrings).then(_giftData => {
      const { funderId, processGiftData, updatePagerInfo } = this.props
      processGiftData(_giftData)
      /*
      _.map(_giftData.data, data => {
        if (_.has(data, "relationships")) {
          _.each(data.relationships, (elem, i) => {
            if (_.has(elem, "data.id")) {
              data.attributes[i] = _.find(_giftData.included, { id: elem.data.id });
            } else {
              _.each(elem.data, iterator => {
                if (!_.has(data.attributes, i)) {
                  data.attributes[i] = [];
                }
                let find = _.find(_giftData.included, { id: iterator.id });
                if (!_.isEmpty(find)) {
                  data.attributes[i].push(find);
                }
              });
            }
          });
          return data;
        }
      });
      updateCharity(_giftData);
      updateCause(_giftData);
      updatePagerInfo(funderId, queryString);

      // Updates the Redux Store.
      updateGiftDataQueryString(queryString);
      getGiftDataPerFunder(_giftData);*/

      updatePagerInfo(funderId, queryString)
      updateGiftDataQueryString(queryString)
    })
  }

  render() {
    const { parentCauses, parentInternational, parentPopulation, yearOptions } = this.state
    let parentCausesOptions = []

    for (let cause in parentCauses) {
      if (!_.has(parentCauses[cause], 'attributes.tid')) {
        parentCausesOptions.push({
          value: `${parentCauses[cause].tid}`,
          primaryText: parentCauses[cause].name,
          type: 'causes'
        })
      }
    }
    for (let international in parentInternational) {
      if (!_.has(parentInternational[international], 'attributes.tid')) {
        parentCausesOptions.push({
          value: `${parentInternational[international].tid}`,
          primaryText: parentInternational[international].name,
          type: 'international'
        })
      }
    }
    for (let population in parentPopulation) {
      if (!_.has(parentPopulation[population], 'attributes.tid')) {
        parentCausesOptions.push({
          value: `${parentPopulation[population].tid}`,
          primaryText: parentPopulation[population].name,
          type: 'populations'
        })
      }
    }

    parentCausesOptions = _.orderBy(parentCausesOptions, ['primaryText'], ['asc'])
    parentCausesOptions.unshift({ value: null, primaryText: t.global.all, type: 'all' })

    return (
      <div>
        <SearchPageFiltersDropdown
          fieldName="year"
          floatingLabelText={t.global.year}
          icon="KeyboardArrowDown"
          value={this.state.year}
          onChange={this.handleYearChange}
          menuItems={yearOptions}
        />
        <SearchPageFiltersDropdown
          fieldName="cause"
          floatingLabelText={t.funder.causes}
          icon="KeyboardArrowDown"
          value={this.state.cause}
          onChange={this.handleCauseChange}
          menuItems={parentCausesOptions}
        />
        <FromToFilter
          page="Profile"
          field="gift-size"
          fromLabel={t.funder.giftSize}
          toLabel=" "
          fromValue={this.state.giftSizeFrom}
          toValue={this.state.giftSizeTo}
          showActions={this.state.showGiftSizeActions}
          showClear={this.state.showGiftSizeClear}
          onChange={this.handleGiftSizeChange}
          onSubmit={this.submitGiftSize}
          onCancel={this.clearGiftSize}
        />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  giftData: state.giftData,
  giftDataTable: state.giftDataTable
})

const mapDispatchToProps = dispatch => ({
  getGiftDataPerFunder: giftData => dispatch(getGiftDataPerFunder(giftData)),
  updateGiftDataQueryString: queryStrings => dispatch(updateGiftDataQueryString(queryStrings))
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfileGiftAnalysisFilters)
