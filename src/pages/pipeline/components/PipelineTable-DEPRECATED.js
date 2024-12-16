import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table'
import renderHTML from 'react-render-html'

// Custom DOM Components.
import CardsActions from '../../../components/cards/components/CardsActions-DEPRECATED'
import RequestSize from '../../../components/cards/components/RequestSize-DEPRECATED'
import PipelineStages from '../../../components/cards/components/PipelineStages-DEPRECATED'

// Controllers.
import * as SearchController from '../../../controllers/SearchController-DEPRECATED'

// App Language.
import { getLanguage } from 'data/locale'

import { PROFILE_PAGE } from '../../../utils/paths'

class PipelineTable extends Component {
  render() {
    const { opportunities } = this.props
    const { t } = getLanguage()

    return (
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
          {opportunities.map((opportunity, index) => {
            let deadline = ''

            if (parseInt(opportunity.next_deadline, 0) !== 0) {
              deadline = SearchController.getDeadlineInfoFromResult({
                title: opportunity.funder,
                next_deadline_date: opportunity.next_deadline,
                ongoing: opportunity.ongoing
              })
            }

            return (
              <TableRow key={opportunity.nid} className={deadline.colorClass}>
                <TableRowColumn>
                  <Link to={`${PROFILE_PAGE}/${opportunity.funder_uuid}`}>
                    {renderHTML(opportunity.funder)}
                  </Link>
                </TableRowColumn>
                <TableRowColumn>
                  {opportunity.request_size.trim() !== '' && (
                    <RequestSize
                      hideText={true}
                      requestSize={opportunity.request_size}
                      opportunityId={opportunity.uuid}
                      funderId={opportunity.funder_uuid}
                      flagId={opportunity.flag_uuid}
                      pipelineStageId={opportunity.pipeline_stage_uuid}
                    />
                  )}
                </TableRowColumn>
                <TableRowColumn>{deadline.deadlineTextShort}</TableRowColumn>
                <TableRowColumn>
                  <PipelineStages
                    buttonClass="Full-card__status"
                    opportunity={{ pipeline_stage: opportunity.stage }}
                    index={index}
                    funderName={opportunity}
                    opportunityId={opportunity.uuid}
                    funderId={opportunity.funder_uuid}
                    flagId={opportunity.flag_uuid}
                  />
                </TableRowColumn>
                <TableRowColumn>
                  <CardsActions
                    index={index}
                    opportunity={{ uuid: opportunity.uuid }}
                    funderId={opportunity.funder_uuid}
                    history={this.props.history}
                  />
                </TableRowColumn>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    )
  }
}

export default PipelineTable
