import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
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

import { PROFILE_PAGE } from 'utils/paths'
import { getDeadlineState, getNextDeadlinesFromPrograms } from 'components/Deadlines/helpers'
import PipelineStageButton from 'components/PipelineStageButton'
import CardActions from 'components/CardActions'
import BasicPagination from 'components/BasicPagination'
import { getPipelines } from 'store/actions/pipeline'
import ResetCardAction from 'components/CardActions/actions/ResetAction'
import ArchiveCardAction from 'components/CardActions/actions/ArchiveAction'
import HideCardAction from 'components/CardActions/actions/HideAction'
import Deadline from 'components/Deadlines'

const PipelineTable = ({
  filteredOpportunities,
  resultsPerPage,
  setResultsPerPage,
  currentPage,
  setCurrentPage
}) => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)

  const [pageStart, pageEnd] = [(currentPage - 1) * resultsPerPage, currentPage * resultsPerPage]

  return (
    <div>
      <Table className="Pipeline-cards__collapsed" selectable={false}>
        <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
          <TableRow>
            <TableHeaderColumn>{t.cards.funderName}</TableHeaderColumn>
            <TableHeaderColumn>{t.cards.requestSize}</TableHeaderColumn>
            <TableHeaderColumn>{t.cards.upcomingDeadline}</TableHeaderColumn>
            <TableHeaderColumn>{t.cards.pipelineStage}</TableHeaderColumn>
            <TableHeaderColumn>{/* Action */}</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {filteredOpportunities.slice(pageStart, pageEnd).map((opportunity, index) => {
            const funderPrograms = opportunity.funder.funderPrograms

            const { hasOngoingDeadline, closestDeadlineDate } = getNextDeadlinesFromPrograms(
              funderPrograms
            )

            const { color: cardColor, showDate, label } = getDeadlineState({
              deadlineDate: closestDeadlineDate,
              isOngoing: hasOngoingDeadline
            })

            const deadlineLabel =
              hasOngoingDeadline && !closestDeadlineDate.isValid
                ? label
                : !!closestDeadlineDate &&
                  showDate && <Deadline format="short" date={closestDeadlineDate} />

            return (
              <TableRow key={opportunity.id} className={cardColor}>
                <TableRowColumn>
                  <Link to={`${PROFILE_PAGE}/${opportunity.funder.id}`}>
                    {opportunity.funder.name}
                  </Link>
                </TableRowColumn>
                <TableRowColumn>
                  {opportunity.requestSize &&
                    opportunity.requestSize.trim() !== '' &&
                    opportunity.requestSize}
                </TableRowColumn>
                <TableRowColumn>{deadlineLabel}</TableRowColumn>
                <TableRowColumn>
                  <PipelineStageButton
                    buttonClass="Full-card__status"
                    spinnerColor="#479cff"
                    opportunity={opportunity}
                    funderId={opportunity.funder.id}
                    loadData={() => getPipelines(false)}
                  />
                </TableRowColumn>
                <TableRowColumn>
                  <CardActions
                    opportunityId={opportunity.id}
                    actions={[
                      ResetCardAction,
                      !opportunity.hidden && !opportunity.archived && ArchiveCardAction,
                      !opportunity.hidden && HideCardAction
                    ]}
                    loadData={() => getPipelines(false)}
                  />
                </TableRowColumn>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      <MediaQuery query="(min-width: 990px)">
        <BasicPagination
          pagerSize={5}
          resultCount={filteredOpportunities.length}
          viewsPerPage={resultsPerPage}
          pageNumber={currentPage}
          onNumberOfResultsChange={setResultsPerPage}
          onSetPage={setCurrentPage}
        />
      </MediaQuery>
      <MediaQuery query="(max-width: 991px)">
        <BasicPagination
          pagerSize={3}
          resultCount={filteredOpportunities.length}
          viewsPerPage={resultsPerPage}
          pageNumber={currentPage}
          onNumberOfResultsChange={setResultsPerPage}
          onSetPage={setCurrentPage}
        />
      </MediaQuery>
    </div>
  )
}

export default PipelineTable
