import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import ReactTooltip from 'react-tooltip'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table'
import MediaQuery from 'react-responsive'
import _ from 'lodash'

import sortUpIcon from 'assets/sort_up.svg'
import sortDownIcon from 'assets/sort_down.svg'
import { formatNumber } from 'utils/helpers'
import TextLoading from 'components/global/loading/TextLoading'
import GiftAnalysisFilters from './GiftAnalysisFilters'
import GiftAnalysisPagination from './GiftAnalysisPagination'

import { selectFunderProfileInfo, selectFunderPrecalculatedInfo } from 'store/selectors/profile'
import {
  selectFunderPaginatedGiftHistoryPage,
  selectIsFunderPaginatedGiftDataLoading
} from 'store/selectors/giftHistory'
import {
  getFunderPaginatedGiftHistory,
  getPaginatedGiftHistoryCancelSource,
  resetPaginatedGiftHistory,
  DEFAULT_PAGINATION_PARAMS
} from 'store/actions/giftHistory'
import { useParams } from 'react-router-dom'
import { CircularProgress, IconButton } from 'material-ui'
import { InfoOutline } from 'material-ui-icons'
import ProfileGiftAnalysisModal from './ProfileGiftAnalysisModal'

const TOOLTIP =
  'Gift History is sourced from Canada Revenue Agency T3010 Registered Charity Information Returns and/or material published by the organization (e.g., annual report, official website, etc.). While useful for researching the capacity and interests of this organization, please be aware that the information in this section may not be Inclusive and may contain errors.'

const GiftAnalysis = () => {
  const dispatch = useDispatch()
  const { profileId } = useParams()
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)

  const { giftCommentary, businessNumber } = useSelector(selectFunderProfileInfo)

  const { focusOptions, relevantYears } = useSelector(selectFunderPrecalculatedInfo) || {}

  const [sortField, setSortField] = useState(DEFAULT_PAGINATION_PARAMS.sortField)
  const [sortDirection, setSortDirection] = useState(DEFAULT_PAGINATION_PARAMS.sortDirection)
  const [resultsPerPage, setResultsPerPage] = useState(DEFAULT_PAGINATION_PARAMS.resultsPerPage)
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGINATION_PARAMS.currentPage)
  const [filterYear, setFilterYear] = useState(DEFAULT_PAGINATION_PARAMS.filterYear)
  const [filterFocus, setFilterFocus] = useState(DEFAULT_PAGINATION_PARAMS.filterFocus)
  const [fromGiftValue, setFromGiftValue] = useState(DEFAULT_PAGINATION_PARAMS.fromGiftValue)
  const [toGiftValue, setToGiftValue] = useState(DEFAULT_PAGINATION_PARAMS.toGiftValue)
  const [modal, setModal] = useState({
    name: '',
    content: '',
    opened: false
  })

  const isLoading = useSelector(selectIsFunderPaginatedGiftDataLoading(currentPage))
  const { paginatedResults, totalCount } = useSelector(
    selectFunderPaginatedGiftHistoryPage(currentPage)
  )
  const GiftCancelSource = getPaginatedGiftHistoryCancelSource()

  useEffect(() => {
    dispatch(
      getFunderPaginatedGiftHistory(
        GiftCancelSource,
        profileId,
        resultsPerPage,
        currentPage,
        filterYear,
        filterFocus,
        fromGiftValue,
        toGiftValue,
        sortField,
        sortDirection
      )
    )
    return () => {
      dispatch(resetPaginatedGiftHistory(GiftCancelSource))
    }
  }, [
    profileId,
    resultsPerPage,
    filterYear,
    filterFocus,
    fromGiftValue,
    toGiftValue,
    sortField,
    sortDirection
  ])

  // This side effect handles requesting a page that has not been prefilled into the results
  useEffect(() => {
    if (!isLoading && paginatedResults[currentPage] === undefined) {
      dispatch(
        getFunderPaginatedGiftHistory(
          GiftCancelSource,
          profileId,
          resultsPerPage,
          currentPage,
          filterYear,
          filterFocus,
          fromGiftValue,
          toGiftValue,
          sortField,
          sortDirection
        )
      )
    }
  }, [currentPage])

  const updateResultsPerPage = count => {
    setCurrentPage(1)
    setResultsPerPage(count)
  }
  const updateSortDirection = () => setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc')

  const updateSort = field => {
    if (field === sortField) return updateSortDirection()

    setSortField(field)
    setSortDirection('desc')
  }

  const updateFilter = setStateFunction => newValue => {
    setStateFunction(newValue)
    setCurrentPage(1)
  }

  const formattedFunderGiftHistory = paginatedResults

  const yearOptionChoices = _(relevantYears)
    .sort()
    .reverse()
    .reduce((agg, item) => agg.concat(item), [null])
    .map(year => ({ value: year, primaryText: year || t.global.all }))

  const focusOptionChoices = _(focusOptions)
    .sort()
    .reduce((agg, item) => agg.concat(item), [null])
    .map(focus => ({ value: focus, primaryText: focus || t.global.all }))

  const closeGiftDetail = () => {
    setModal({
      content: '',
      name: '',
      opened: false
    })
  }

  const showGiftDetail = (giftPurpose, charityName) => {
    setModal({
      content: giftPurpose,
      name: charityName,
      opened: true
    })
  }

  const hasDetails = formattedFunderGiftHistory
    ? formattedFunderGiftHistory.find(h => h.details) !== undefined
    : false

  return (
    <React.Fragment>
      <div className="Profile-gift-analysis">
        <h4 data-tip data-for="gift-history">
          {t.funder.giftHistory}
        </h4>
        <ReactTooltip className="Profile-tooltip" id="gift-history" place="top" effect="solid">
          <div style={{ maxWidth: 500, textAlign: 'left' }}>{TOOLTIP}</div>
        </ReactTooltip>
        <GiftAnalysisFilters
          year={filterYear}
          yearOptions={yearOptionChoices}
          onYearChange={updateFilter(setFilterYear)}
          focus={filterFocus}
          focusOptions={focusOptionChoices}
          onFocusChange={updateFilter(setFilterFocus)}
          fromGiftValue={fromGiftValue}
          toGiftValue={toGiftValue}
          setFromGiftValue={setFromGiftValue}
          setToGiftValue={setToGiftValue}
        />
        <div className="gift_commentary" dangerouslySetInnerHTML={{ __html: giftCommentary }} />

        <Table className="Profile-page-gift-data" selectable={false}>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn
                className="GiftAnalysisTable-RecepientName"
                data-selected={sortField == 'recipient'}
              >
                <div
                  onClick={() => {
                    updateSort('recipient')
                  }}
                >
                  <div className="GiftAnalysisTable-SortLabel">{t.funder.recipient}</div>
                  <div className="GiftAnalysisTable-SortArrow">
                    {sortField == 'recipient' && sortDirection === 'asc' && (
                      <img src={sortUpIcon} />
                    )}
                    {sortField == 'recipient' && sortDirection === 'desc' && (
                      <img src={sortDownIcon} />
                    )}
                  </div>
                </div>
              </TableHeaderColumn>
              <TableHeaderColumn data-selected={sortField == 'focus'}>
                <div
                  onClick={() => {
                    updateSort('focus')
                  }}
                >
                  <div className="GiftAnalysisTable-SortLabel">{t.funder.causes}</div>
                  <div className="GiftAnalysisTable-SortArrow">
                    {sortField == 'focus' && sortDirection === 'asc' && <img src={sortUpIcon} />}
                    {sortField == 'focus' && sortDirection === 'desc' && <img src={sortDownIcon} />}
                  </div>
                </div>
              </TableHeaderColumn>
              <TableHeaderColumn data-selected={sortField == 'location'}>
                <div
                  onClick={() => {
                    updateSort('location')
                  }}
                >
                  <div className="GiftAnalysisTable-SortLabel">{t.funder.location}</div>
                  <div className="GiftAnalysisTable-SortArrow">
                    {sortField == 'location' && sortDirection === 'asc' && <img src={sortUpIcon} />}
                    {sortField == 'location' && sortDirection === 'desc' && (
                      <img src={sortDownIcon} />
                    )}
                  </div>
                </div>
              </TableHeaderColumn>
              <TableHeaderColumn
                className="GiftAnalysisTable-Amount"
                data-selected={sortField == 'giftAmount'}
              >
                <div
                  onClick={() => {
                    updateSort('giftAmount')
                  }}
                >
                  <div className="GiftAnalysisTable-SortLabel">{t.funder.amount}</div>
                  <div className="GiftAnalysisTable-SortArrow">
                    {sortField == 'giftAmount' && sortDirection === 'asc' && (
                      <img src={sortUpIcon} />
                    )}
                    {sortField == 'giftAmount' && sortDirection === 'desc' && (
                      <img src={sortDownIcon} />
                    )}
                  </div>
                </div>
              </TableHeaderColumn>

              <TableHeaderColumn
                className="GiftAnalysisTable-Year"
                data-selected={sortField == 'year'}
              >
                <div
                  onClick={() => {
                    updateSort('year')
                  }}
                >
                  <div className="GiftAnalysisTable-SortLabel">{t.global.year}</div>
                  <div className="GiftAnalysisTable-SortArrow">
                    {sortField == 'year' && sortDirection === 'asc' && <img src={sortUpIcon} />}
                    {sortField == 'year' && sortDirection === 'desc' && <img src={sortDownIcon} />}
                  </div>
                </div>
              </TableHeaderColumn>

              <TableHeaderColumn
                className="GiftAnalysisTable-CharitySize"
                data-selected={sortField == 'charitySize'}
              >
                <div
                  onClick={() => {
                    updateSort('charitySize')
                  }}
                >
                  <div className="GiftAnalysisTable-SortLabel">{t.funder.charitySize}</div>
                  <div className="GiftAnalysisTable-SortArrow">
                    {sortField == 'charitySize' && sortDirection === 'asc' && (
                      <img src={sortUpIcon} />
                    )}
                    {sortField == 'charitySize' && sortDirection === 'desc' && (
                      <img src={sortDownIcon} />
                    )}
                  </div>
                </div>
              </TableHeaderColumn>
              {hasDetails && (
                <TableHeaderColumn className="GiftAnalysisTable-DetailButton">
                  {t.global.detail}
                </TableHeaderColumn>
              )}
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {isLoading && (
              <TableRow style={{ height: 61 * resultsPerPage }}>
                <TableRowColumn colSpan={7}>
                  <CircularProgress
                    size={60}
                    thickness={5}
                    color="#4c9eff"
                    style={{ left: '50%' }}
                  />
                </TableRowColumn>
              </TableRow>
            )}
            {!isLoading &&
              formattedFunderGiftHistory.map(
                ({ giftAmount, year, charity, focusDisplay, charityName, region, details }) => {
                  const amount =
                    giftAmount && giftAmount !== '' && giftAmount !== 0
                      ? formatNumber(giftAmount)
                      : t.cards.unknown
                  const charitySize =
                    typeof charity.recipientSize !== 'undefined' && charity.recipientSize !== null
                      ? formatNumber(charity.recipientSize)
                      : t.cards.unknown

                  return (
                    <TableRow key={_.uniqueId()}>
                      <TableRowColumn className="GiftAnalysisTable-RecepientName">
                        {charityName}
                      </TableRowColumn>
                      <TableRowColumn>{focusDisplay}</TableRowColumn>
                      <TableRowColumn>{region}</TableRowColumn>
                      <TableRowColumn className="GiftAnalysisTable-Amount">{amount}</TableRowColumn>
                      <TableRowColumn className="GiftAnalysisTable-Year">{year}</TableRowColumn>
                      <TableRowColumn className="GiftAnalysisTable-CharitySize">
                        {charitySize || <TextLoading />}
                      </TableRowColumn>
                      {hasDetails && (
                        <TableRowColumn className="GiftAnalysisTable-DetailButton">
                          {details && (
                            <IconButton onClick={() => showGiftDetail(details, charity.name)}>
                              <InfoOutline />
                            </IconButton>
                          )}
                        </TableRowColumn>
                      )}
                    </TableRow>
                  )
                }
              )}
            {!isLoading && formattedFunderGiftHistory.length === 0 && (
              <TableRow>
                <TableRowColumn colSpan={7}>{t.funder.noresults}</TableRowColumn>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {/* Business number should only display if it contains "RR" or "EIN" */}
        {(businessNumber &&
          (businessNumber.search('RR') > -1 || businessNumber.search('EIN') > -1) && (
            <a
              href={`http://www.cra-arc.gc.ca/ebci/haip/srch/charity-eng.action?bn=${businessNumber}&m=1`}
              className="Profile-gift-analysis-source"
              target="_blank"
            >
              Source
            </a>
          )) || <a href="#" className="Profile-gift-analysis-source"></a>}
        <MediaQuery query="(min-width: 990px)">
          {totalCount > 0 && (
            <GiftAnalysisPagination
              pagerSize={5}
              resultCount={totalCount}
              viewsPerPage={resultsPerPage}
              pageNumber={currentPage}
              onNumberOfResultsChange={updateResultsPerPage}
              onSetPage={setCurrentPage}
            />
          )}
        </MediaQuery>
        <MediaQuery query="(max-width: 991px)">
          {totalCount > 0 && (
            <GiftAnalysisPagination
              pagerSize={3}
              resultCount={totalCount}
              viewsPerPage={resultsPerPage}
              pageNumber={currentPage}
              onNumberOfResultsChange={updateResultsPerPage}
              onSetPage={setCurrentPage}
            />
          )}
        </MediaQuery>
        <ProfileGiftAnalysisModal
          name={modal.name}
          content={modal.content}
          opened={modal.opened}
          onClose={closeGiftDetail}
        />
      </div>
    </React.Fragment>
  )
}

export default GiftAnalysis
