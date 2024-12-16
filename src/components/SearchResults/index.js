import React from 'react'
import { useSelector } from 'react-redux'
import { CircularProgress, Table, TableBody, TableHeader, TableHeaderColumn, TableRow } from 'material-ui'

import { selectCardView } from 'store/selectors/pageSettings'
import { CardViewEnum } from 'store/reducers/pageSettings'

import FunderCard from 'components/FunderCard'
import { useTranslation } from 'react-i18next'
import { selectPipeline } from 'store/selectors/pipeline'
import SearchBanner from './components/SearchBanner'
import { selectResultCount } from 'store/selectors/search'
import { selectIsLibraryMode } from 'store/selectors/user'

const SearchResults = ({ loading, results }) => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)

  const cardView = useSelector(selectCardView)
  const { results: pipelineData } = useSelector(selectPipeline)
  const resultCount = useSelector(selectResultCount)
  const isLibraryMode = useSelector(selectIsLibraryMode)

  const buildFunderCard = (funder, index) => (
    <FunderCard
      data={funder}
      key={funder.id}
      index={index}
      opportunity={pipelineData.find(opportunity => opportunity.funder.id === funder.id)}
    />
  )

  return (
    <>
      {loading ? (
        <div className="refresh-container">
          <CircularProgress size={60} thickness={5} color="#4c9eff" />
        </div>
      ) : null}
      {cardView === CardViewEnum.COLLAPSED ? (
        <Table className="Material-cards__collapsed" selectable={false}>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn>{t.cards.funderName}</TableHeaderColumn>
              <TableHeaderColumn>{t.cards.typicalGift}</TableHeaderColumn>
              <TableHeaderColumn>{t.cards.upcomingDeadline}</TableHeaderColumn>
              <TableHeaderColumn>{t.cards.estimatedCapacity}</TableHeaderColumn>
              {!isLibraryMode && (
                <TableHeaderColumn>{t.cards.pipelineStage}</TableHeaderColumn>
              )}
              <TableHeaderColumn>{/* Action */}</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>{results.map(buildFunderCard)}</TableBody>
        </Table>
      ) : (
        <div className="tw-w-full">
          <div className={'Search_tiles'}>
            <div className={'Search_tiles--content'}>{results.map(buildFunderCard)}</div>
          </div>
        </div>
      )}
      {resultCount !== null && <SearchBanner resultCount={resultCount} />}
    </>
  )
}

export default SearchResults
