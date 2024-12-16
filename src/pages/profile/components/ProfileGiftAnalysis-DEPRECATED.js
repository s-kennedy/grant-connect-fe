// Global DOM components.
import React, { Component, Suspense } from 'react'
import MediaQuery from 'react-responsive'
import { IconButton } from 'material-ui'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table'
import { InfoOutline } from 'material-ui-icons'
import ReactTooltip from 'react-tooltip'
import * as locationSearch from 'query-string'

import sortUpIcon from '../../../assets/sort_up.svg'
import sortDownIcon from '../../../assets/sort_down.svg'

// Custom DOM components.
import ProfileGiftAnalysisFilters from './ProfileGiftAnalysisFilters-DEPRECATED'
import TextLoading from '../../../components/global/loading/TextLoading'
import ProfileGiftAnalysisModal from './ProfileGiftAnalysisModal-DEPRECATED'

// Redux.
import { connect } from 'react-redux'
import { getGiftDataPerFunder, updateGiftDataQueryString } from 'store/actions/search'

// Helpers.
import { formatNumber } from '../../../utils/helpers'
import _ from 'lodash'

// App Language.
import { getLanguage } from 'data/locale'

// Controllers.
import * as FunderController from '../../../controllers/FunderController-DEPRECATED'

import LocationZip from '../../../components/global/locationzip/LocationZip'
// import PaginationControlled from 'components/Pagination/PaginationControlled'
// const LocationZip = React.lazy(() => import("../../../components/global/locationzip/LocationZip"));

class ProfileGiftAnalysis extends Component {
  state = {
    funderCharity: [],
    funderCause: [],
    pageOffset: 0,
    results: 10,
    currentPage: 1,
    pagerPages: 0,
    totalResults: 0,
    modalOpened: false,
    modalContent: '',
    modalName: '',
    noResult: false,
    sortField: 'year',
    sortDirection: 'DESC',
    numClicks: 0
  }

  componentDidMount() {
    const { pageOffset, results } = this.state
    const { funderInfo, updateGiftDataQueryString } = this.props
    const funderId = funderInfo.data.attributes.drupal_internal__nid

    const { getGiftDataPerFunder, updatGiftDataQueryString } = this.props

    updateGiftDataQueryString({})
    this.updatePagerInfo(funderId, {})

    // Getting the gift analysis data.
    this.getGiftDataResults(funderId, pageOffset, results)
    this.updatePagerInfo(funderId, {})
  }

  updatePagerInfo = (funderId, queryStrings) => {
    FunderController.getPagerInfo(funderId, queryStrings).then(pagerInfo => {
      const pagerPages = pagerInfo.total / this.state.results

      this.setState({
        totalResults: pagerInfo.total,
        pagerPages: Math.ceil(pagerPages)
      })
    })
  }

  sortTable(field) {
    let newField = field
    let newDirection = 'DESC'
    let numClicks = this.state.numClicks

    if (this.state.sortField === field) {
      if (numClicks < 1) {
        numClicks++
        if (this.state.sortDirection === 'ASC') {
          newDirection = 'DESC'
        } else {
          newDirection = 'ASC'
        }
      } else {
        newField = 'year'
        newDirection = 'DESC'
        numClicks = 0
      }
    } else {
      numClicks = 0
    }

    this.setState(
      { sortField: newField, sortDirection: newDirection, numClicks: numClicks },
      () => {
        this.handlePagerClick(this.state.currentPage)
      }
    )
  }

  getGiftDataResults = (funderId, offset, results) => {
    FunderController.getGiftData(
      funderId,
      offset,
      results,
      this.state.sortField,
      this.state.sortDirection
    ).then(_giftData => {
      this.processGiftData(_giftData)
    })
  }

  getGiftDataResultsWithArguments = queryString => {
    const apiUrlQueryStrings = decodeURIComponent(locationSearch.stringify(queryString))

    FunderController.getGiftDataWithArguments(apiUrlQueryStrings).then(_giftData => {
      const { getGiftDataPerFunder } = this.props
      this.processGiftData(_giftData)
    })
  }

  processGiftData = _giftData => {
    const { getGiftDataPerFunder } = this.props
    _.map(_giftData.data, data => {
      if (_.has(data, 'relationships')) {
        _.each(data.relationships, (elem, i) => {
          if (_.has(elem, 'data.id')) {
            data.attributes[i] = _.find(_giftData.included, { id: elem.data.id })
          } else {
            _.each(elem.data, iterator => {
              if (!_.has(data.attributes, i)) {
                data.attributes[i] = []
              }

              let find = _.find(_giftData.included, { id: iterator.id })
              if (!_.isEmpty(find)) {
                data.attributes[i].push(find)
              }
            })
          }
        })
        if (
          !!data.attributes.charity &&
          _.has(data.attributes.charity, 'relationships.region.data.id')
        ) {
          const regions = _giftData.included.filter(
            incl =>
              incl.type.indexOf('region') > -1 &&
              incl.id === data.attributes.charity.relationships.region.data.id
          )
          data.attributes.region = !!regions && regions.length > 0 ? regions[0].attributes : {}
        }
        return data
      }
    })
    if (_giftData.data.length === 0) {
      this.setState({ noResult: true })
    } else {
      this.setState({ noResult: false })
      this.updateCharityInfo(_giftData)
      this.updateCauseInfo(_giftData)
      getGiftDataPerFunder(_giftData)
    }
  }

  updateCharityInfo = giftData => {
    const charityInfo = []
    this.setState({ funderCharity: [] })

    for (let giftDatumIndex in giftData.data) {
      if (!_.isEmpty(giftData.data[giftDatumIndex].attributes.charity)) {
        // Get the charity.
        const charity = giftData.data[giftDatumIndex].attributes.charity
        charityInfo[giftDatumIndex] = {
          key: giftDatumIndex,
          title: charity.attributes.title,
          size: charity.attributes.recipient_size,
          location: charity.attributes.zipcode
        }
        this.setState({ funderCharity: charityInfo })
      }
    }
  }

  updateCauseInfo = giftData => {
    const causeInfo = []
    this.setState({ funderCause: [] })

    for (let giftDatumIndex in giftData.data) {
      if (
        !!giftData.data[giftDatumIndex].relationships &&
        !!giftData.data[giftDatumIndex].relationships.cause &&
        !!giftData.data[giftDatumIndex].relationships.cause.data
      ) {
        // Get the cause.
        const cause = giftData.data[giftDatumIndex].attributes.cause
        if (_.has(cause, 'attributes.name')) {
          causeInfo[giftDatumIndex] = {
            key: giftDatumIndex,
            name: cause.attributes.name
          }
          this.setState({ funderCause: causeInfo })
        }
      } else {
        causeInfo[giftDatumIndex] = {
          key: giftDatumIndex,
          name: ''
        }
        this.setState({ funderCause: causeInfo })
      }
    }
  }

  handlePagerClick = pageNumber => {
    const { results } = this.state
    const { funderInfo, giftDataTable } = this.props
    const funderId = funderInfo.data.attributes.drupal_internal__nid
    const newOffset = (pageNumber - 1) * results
    let newGiftDataTable = {}

    if (typeof giftDataTable['filter[funder][value]'] === 'undefined') {
      this.getGiftDataResults(funderId, newOffset, results)
      this.updatePagerInfo(funderId, giftDataTable)
    } else {
      for (let queryString in giftDataTable) {
        if (queryString.indexOf(`sort[sort-`) === -1 && queryString.indexOf(`sort[sort-`) === -1) {
          newGiftDataTable[queryString] = giftDataTable[queryString]
        }
      }

      newGiftDataTable['page[offset]'] = newOffset
      newGiftDataTable[`sort[sort-${this.state.sortField}][path]`] = this.state.sortField
      newGiftDataTable[`sort[sort-${this.state.sortField}][direction]`] = this.state.sortDirection

      this.getGiftDataResultsWithArguments(newGiftDataTable)
      this.updatePagerInfo(funderId, newGiftDataTable)
    }

    this.setState({ currentPage: pageNumber })
  }

  handleSearchPaginationChange = (e, index, value) => {
    const { funderInfo, giftDataTable } = this.props
    const funderId = funderInfo.data.attributes.drupal_internal__nid
    const newOffset = (this.state.currentPage - 1) * value

    if (typeof giftDataTable['filter[funder][value]'] === 'undefined') {
      this.getGiftDataResults(funderId, newOffset, value)
    } else {
      let newGiftDataTable = giftDataTable
      newGiftDataTable['page[limit]'] = value
      newGiftDataTable[`sort[sort-${this.state.sortField}][path]`] = this.state.sortField
      newGiftDataTable[`sort[sort-${this.state.sortField}][direction]`] = this.state.sortDirection

      this.getGiftDataResultsWithArguments(newGiftDataTable)
    }

    this.updatePagerInfo(funderId, giftDataTable)
    this.setState({ results: value })
  }

  showGiftDetail = (giftPurpose, charityName) => {
    this.setState({
      modalContent: giftPurpose,
      modalName: charityName,
      modalOpened: true
    })
  }

  hideGiftDetail = () => {
    this.setState({ modalOpened: false })
  }

  render() {
    const {
      currentPage,
      totalResults,
      results,
      pagerPages,
      funderCharity,
      funderCause,
      noResult
    } = this.state
    const { funderInfo, giftData } = this.props
    const pagerInfo = {
      viewsPerPage: this.state.results,
      pagerInfo: {
        current_page: currentPage - 1,
        items_per_page: results,
        count: totalResults,
        pages: pagerPages
      },
      pageNumber: currentPage,
      handleSearchPaginationChange: this.handleSearchPaginationChange,
      handlePagerClick: this.handlePagerClick
    }
    const { t } = getLanguage()
    if (noResult || typeof giftData.data === 'undefined') {
      return (
        <div className="Profile-gift-analysis">
          <h4 data-tip data-for="gift-history">
            {t.funder.giftHistory}
          </h4>
          {!!giftData.data && (
            <ReactTooltip className="Profile-tooltip" id="gift-history" place="top" effect="solid">
              <span>
                Gift History is sourced from Canada Revenue Agency T3010 Registered Charity
                Information Returns and/or material published by the organization (e.g., annual
                report, official website, etc.). While useful for researching the capacity and
                interests of this organization, please be aware that the information in this section
                may not be Inclusive and may contain errors.
              </span>
            </ReactTooltip>
          )}
          {!!giftData.data && (
            <ProfileGiftAnalysisFilters
              funderId={funderInfo.data.attributes.drupal_internal__nid}
              updateCause={this.updateCauseInfo}
              updateCharity={this.updateCharityInfo}
              updatePagerInfo={this.updatePagerInfo}
              sortField={this.state.sortField}
              sortDirection={this.state.sortDirection}
              processGiftData={this.processGiftData}
            />
          )}
          <p />
          <p>{t.funder.noresults}</p>
        </div>
      )
    }

    let gift_commentary = ''
    if (
      _.has(funderInfo, 'data.attributes.gift_commentary.value') &&
      !_.isEmpty(funderInfo.data.attributes.gift_commentary.value)
    ) {
      gift_commentary = funderInfo.data.attributes.gift_commentary.value
    }
    let showdetailsCount = []
    showdetailsCount = _.filter(giftData.data, elem => {
      if (
        _.has(elem, 'attributes.purpose') &&
        !_.isEmpty(elem.attributes.purpose) &&
        elem.attributes.purpose != 'NULL'
      ) {
        return elem
      }
    })
    showdetailsCount = showdetailsCount.length
    return (
      <div className="Profile-gift-analysis">
        <h4 data-tip data-for="gift-history">
          {t.funder.giftHistory}
        </h4>
        <ReactTooltip className="Profile-tooltip" id="gift-history" place="top" effect="solid">
          <span>
            Gift History is sourced from Canada Revenue Agency T3010 Registered Charity Information
            Returns and/or material published by the organization (e.g., annual report, official
            website, etc.). While useful for researching the capacity and interests of this
            organization, please be aware that the information in this section may not be Inclusive
            and may contain errors.
          </span>
        </ReactTooltip>
        <ProfileGiftAnalysisFilters
          funderId={funderInfo.data.attributes.drupal_internal__nid}
          updateCause={this.updateCauseInfo}
          updateCharity={this.updateCharityInfo}
          updatePagerInfo={this.updatePagerInfo}
          sortField={this.state.sortField}
          sortDirection={this.state.sortDirection}
          processGiftData={this.processGiftData}
        />
        <p />

        <div className="gift_commentary" dangerouslySetInnerHTML={{ __html: gift_commentary }} />

        <Table className="Profile-page-gift-data" selectable={false}>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn
                className="GiftAnalysisTable-RecepientName"
                data-selected={this.state.sortField == 'charity.title'}
              >
                <div
                  onClick={() => {
                    this.sortTable('charity.title')
                  }}
                >
                  <div className="GiftAnalysisTable-SortLabel">{t.funder.recipient}</div>
                  <div className="GiftAnalysisTable-SortArrow">
                    {this.state.sortField == 'charity.title' &&
                      this.state.sortDirection === 'ASC' && <img src={sortUpIcon} />}
                    {this.state.sortField == 'charity.title' &&
                      this.state.sortDirection === 'DESC' && <img src={sortDownIcon} />}
                  </div>
                </div>
              </TableHeaderColumn>
              <TableHeaderColumn data-selected={this.state.sortField == 'cause.name'}>
                <div
                  onClick={() => {
                    this.sortTable('cause.name')
                  }}
                >
                  <div className="GiftAnalysisTable-SortLabel">{t.funder.causes}</div>
                  <div className="GiftAnalysisTable-SortArrow">
                    {this.state.sortField == 'cause.name' && this.state.sortDirection === 'ASC' && (
                      <img src={sortUpIcon} />
                    )}
                    {this.state.sortField == 'cause.name' &&
                      this.state.sortDirection === 'DESC' && <img src={sortDownIcon} />}
                  </div>
                </div>
              </TableHeaderColumn>
              <TableHeaderColumn data-selected={this.state.sortField == 'location.title'}>
                <div
                  onClick={() => {
                    this.sortTable('location.title')
                  }}
                >
                  <div className="GiftAnalysisTable-SortLabel">{t.funder.location}</div>
                  <div className="GiftAnalysisTable-SortArrow">
                    {this.state.sortField == 'location.title' &&
                      this.state.sortDirection === 'ASC' && <img src={sortUpIcon} />}
                    {this.state.sortField == 'location.title' &&
                      this.state.sortDirection === 'DESC' && <img src={sortDownIcon} />}
                  </div>
                </div>
              </TableHeaderColumn>
              <TableHeaderColumn
                className="GiftAnalysisTable-Amount"
                data-selected={this.state.sortField == 'amount'}
              >
                <div
                  onClick={() => {
                    this.sortTable('amount')
                  }}
                >
                  <div className="GiftAnalysisTable-SortLabel">{t.funder.amount}</div>
                  <div className="GiftAnalysisTable-SortArrow">
                    {this.state.sortField == 'amount' && this.state.sortDirection === 'ASC' && (
                      <img src={sortUpIcon} />
                    )}
                    {this.state.sortField == 'amount' && this.state.sortDirection === 'DESC' && (
                      <img src={sortDownIcon} />
                    )}
                  </div>
                </div>
              </TableHeaderColumn>

              <TableHeaderColumn
                className="GiftAnalysisTable-Year"
                data-selected={this.state.sortField == 'year'}
              >
                <div
                  onClick={() => {
                    this.sortTable('year')
                  }}
                >
                  <div className="GiftAnalysisTable-SortLabel">{t.global.year}</div>
                  <div className="GiftAnalysisTable-SortArrow">
                    {this.state.sortField == 'year' && this.state.sortDirection === 'ASC' && (
                      <img src={sortUpIcon} />
                    )}
                    {this.state.sortField == 'year' && this.state.sortDirection === 'DESC' && (
                      <img src={sortDownIcon} />
                    )}
                  </div>
                </div>
              </TableHeaderColumn>

              <TableHeaderColumn
                className="GiftAnalysisTable-CharitySize"
                data-selected={this.state.sortField == 'charity.recipient_size'}
              >
                <div
                  onClick={() => {
                    this.sortTable('charity.recipient_size')
                  }}
                >
                  <div className="GiftAnalysisTable-SortLabel">{t.funder.charitySize}</div>
                  <div className="GiftAnalysisTable-SortArrow">
                    {this.state.sortField == 'charity.recipient_size' &&
                      this.state.sortDirection === 'ASC' && <img src={sortUpIcon} />}
                    {this.state.sortField == 'charity.recipient_size' &&
                      this.state.sortDirection === 'DESC' && <img src={sortDownIcon} />}
                  </div>
                </div>
              </TableHeaderColumn>
              {showdetailsCount && (
                <TableHeaderColumn className="GiftAnalysisTable-DetailButton">
                  {t.global.detail}
                </TableHeaderColumn>
              )}
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {giftData.data.length > 0 &&
              giftData.data.map((giftDatum, index) => {
                const amount =
                  giftDatum.attributes.amount !== '' && giftDatum.attributes.amount !== 0
                    ? formatNumber(giftDatum.attributes.amount)
                    : t.cards.unknown
                let charitySize = 0

                if (
                  typeof funderCharity[index] !== 'undefined' &&
                  funderCharity[index].size !== null
                ) {
                  charitySize = formatNumber(parseInt(funderCharity[index].size, 0))
                } else {
                  charitySize = t.cards.unknown
                }
                const charityName =
                  typeof funderCharity[index] !== 'undefined' ? (
                    funderCharity[index].title
                  ) : (
                    <TextLoading />
                  )

                return (
                  <TableRow key={_.uniqueId()}>
                    <TableRowColumn className="GiftAnalysisTable-RecepientName">
                      {charityName}
                    </TableRowColumn>
                    <TableRowColumn>
                      {typeof funderCause[index] !== 'undefined' ? (
                        funderCause[index].name
                      ) : (
                        <TextLoading />
                      )}
                    </TableRowColumn>
                    <TableRowColumn>{giftDatum.attributes.region.name}</TableRowColumn>
                    <TableRowColumn className="GiftAnalysisTable-Amount">{amount}</TableRowColumn>
                    <TableRowColumn className="GiftAnalysisTable-Year">
                      {giftDatum.attributes.year}
                    </TableRowColumn>
                    <TableRowColumn className="GiftAnalysisTable-CharitySize">
                      {typeof funderCharity[index] !== 'undefined' ? charitySize : <TextLoading />}
                    </TableRowColumn>
                    {showdetailsCount && (
                      <TableRowColumn className="GiftAnalysisTable-DetailButton">
                        {giftDatum.attributes.purpose !== null &&
                          giftDatum.attributes.purpose !== 'NULL' && (
                            <IconButton
                              onClick={() =>
                                this.showGiftDetail(giftDatum.attributes.purpose, charityName)
                              }
                            >
                              <InfoOutline />
                            </IconButton>
                          )}
                      </TableRowColumn>
                    )}
                  </TableRow>
                )
              })}
            {giftData.data.length === 0 && (
              <TableRow>
                <TableRowColumn colSpan={7}>{t.funder.noresults}</TableRowColumn>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {/* Business number should only display if it contains "RR" or "EIN" */}
        {funderInfo.data.attributes.bn !== null &&
          (funderInfo.data.attributes.bn.search('RR') > -1 ||
            funderInfo.data.attributes.bn.search('EIN') > -1) && (
            <a
              href={`http://www.cra-arc.gc.ca/ebci/haip/srch/charity-eng.action?bn=${funderInfo.data.attributes.bn}&m=1`}
              className="Profile-gift-analysis-source"
              target="_blank"
            >
              Source
            </a>
          )}
        {/* <MediaQuery query="(min-width: 990px)"> */}
        {/*   <PaginationControlled {...pagerInfo} pagerSize={5} /> */}
        {/* </MediaQuery> */}
        {/* <MediaQuery query="(max-width: 991px)"> */}
        {/*   <PaginationControlled {...pagerInfo} pagerSize={3} /> */}
        {/* </MediaQuery> */}
        <ProfileGiftAnalysisModal
          modalName={this.state.modalName}
          modalContent={this.state.modalContent}
          modalOpened={this.state.modalOpened}
          closeModal={this.hideGiftDetail}
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileGiftAnalysis)
