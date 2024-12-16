import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import renderHTML from 'react-render-html'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table'

// Custom Components.
import CardsActions from '../components/CardsActions-DEPRECATED'
import PipelineStages from '../components/PipelineStages-DEPRECATED'
// import I18nDate from '../../global/date/I18nDate'
import _, { filter, find, take } from 'lodash'

// Controllers.
import * as FunderController from '../../../controllers/FunderController-DEPRECATED'

// App Language.
import { getLanguage } from 'data/locale'

import { PROFILE_PAGE } from '../../../utils/paths'

class CollapsedCard_DEPRECATED extends Component {
  state = {
    opportunities: {}
  }

  componentDidMount() {
    const { searchResults } = this.props
    let funderNids = []

    for (let searchResultIndex in searchResults) {
      funderNids.push(searchResults[searchResultIndex].funderId)
    }

    const funderNidsList = funderNids.join(',')

    // Load the opportunity.
    FunderController.getOpportunity(funderNidsList).then(opportunities => {
      if (
        _.has(opportunities[0], 'funder_id') &&
        _.has(opportunities[0], 'pipeline_stage') &&
        opportunities[0].pipeline_stage != ''
      ) {
        let formattedOpportunities = []
        formattedOpportunities[opportunities[0].funder_id] = opportunities[0]
        this.setState({ opportunities: formattedOpportunities })
      }
    })
  }

  render() {
    const { searchResults, page } = this.props
    const featuredCount = filter(searchResults, { featured: true }).length
    let featuredItems = []
    const { t } = getLanguage()
    if (featuredCount > 5) {
      featuredItems = take(searchResults, 5)
    } else if (featuredCount > 0) {
      featuredItems = take(searchResults, featuredCount)
    }
    const isFeatered =
      (featuredCount > 0 && !parseInt(page)) || (parseInt(page) && parseInt(page) < 2)
    const regularItems = isFeatered
      ? filter(searchResults, item => {
          return !find(featuredItems, item)
        })
      : searchResults
    const isHasFeature = !!isFeatered && featuredCount > 0
    return (
      <React.Fragment>
        {isHasFeature && (
          <div className={'featured'}>
            <div className={'Search_tiles--header'}>{t.search.featured}</div>
            <Table className="Material-cards__collapsed" selectable={false}>
              <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                <TableRow>
                  <TableHeaderColumn>{t.cards.funderName}</TableHeaderColumn>
                  <TableHeaderColumn>{t.cards.typicalGift}</TableHeaderColumn>
                  <TableHeaderColumn>{t.cards.upcomingDeadline}</TableHeaderColumn>
                  <TableHeaderColumn>{t.cards.estimatedCapacity}</TableHeaderColumn>
                  {typeof localStorage.executeActions !== 'undefined' && (
                    <TableHeaderColumn>{t.cards.pipelineStage}</TableHeaderColumn>
                  )}
                  <TableHeaderColumn>{/* Action */}</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                {featuredItems.map((result, index) => {
                  let pipelineStagesAttrs = {}

                  if (typeof this.state.opportunities[result.funderId] !== 'undefined') {
                    pipelineStagesAttrs = {
                      opportunityId: this.state.opportunities[result.funderId].uuid,
                      flagId: this.state.opportunities[result.funderId].flag_uuid
                    }
                  }

                  return (
                    <TableRow key={result.nid} className={result.deadlineClass}>
                      <TableRowColumn>
                        <Link to={`${PROFILE_PAGE}/${result.nid}`}>{renderHTML(result.label)}</Link>
                      </TableRowColumn>
                      <TableRowColumn>{result.typicalGift}</TableRowColumn>
                      <TableRowColumn>
                        {/* <I18nDate date={result.deadlineDate} format="short" /> */}
                      </TableRowColumn>
                      <TableRowColumn>{result.revenue}</TableRowColumn>
                      {typeof localStorage.executeActions !== 'undefined' && (
                        <TableRowColumn>
                          <PipelineStages
                            index={index}
                            opportunity={this.state.opportunities[result.funderId]}
                            funderId={result.nid}
                            funderName={result}
                            buttonClass="Material-cards__expanded-state"
                            {...pipelineStagesAttrs}
                          />
                        </TableRowColumn>
                      )}
                      <TableRowColumn>
                        <CardsActions
                          index={index}
                          opportunity={this.state.opportunities[result.funderId]}
                          funderId={result.nid}
                          history={this.props.history}
                          {...pipelineStagesAttrs}
                        />
                      </TableRowColumn>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
        {!!regularItems.length && (
          <div className={'regular'} data-featured={isFeatered}>
            {!!isFeatered && (
              <div className={'Search_tiles--header more'} data-hidden={isHasFeature}>
                {isFeatered ? t.search.moreResults : t.search.results}
              </div>
            )}
            <Table className="Material-cards__collapsed" selectable={false}>
              {!isHasFeature && (
                <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                  <TableRow>
                    <TableHeaderColumn>{t.cards.funderName}</TableHeaderColumn>
                    <TableHeaderColumn>{t.cards.typicalGift}</TableHeaderColumn>
                    <TableHeaderColumn>{t.cards.upcomingDeadline}</TableHeaderColumn>
                    <TableHeaderColumn>{t.cards.estimatedCapacity}</TableHeaderColumn>
                    {typeof localStorage.executeActions !== 'undefined' && (
                      <TableHeaderColumn>{t.cards.pipelineStage}</TableHeaderColumn>
                    )}
                    <TableHeaderColumn>{/* Action */}</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
              )}
              <TableBody displayRowCheckbox={false}>
                {regularItems.map((result, index) => {
                  let pipelineStagesAttrs = {}

                  if (typeof this.state.opportunities[result.funderId] !== 'undefined') {
                    pipelineStagesAttrs = {
                      opportunityId: this.state.opportunities[result.funderId].uuid,
                      flagId: this.state.opportunities[result.funderId].flag_uuid
                    }
                  }

                  return (
                    <TableRow key={result.nid} className={result.deadlineClass}>
                      <TableRowColumn>
                        <Link to={`${PROFILE_PAGE}/${result.nid}`}>{renderHTML(result.label)}</Link>
                      </TableRowColumn>
                      <TableRowColumn>{result.typicalGift}</TableRowColumn>
                      <TableRowColumn>
                        {/* <I18nDate date={result.deadlineDate} format="short" /> */}
                      </TableRowColumn>
                      <TableRowColumn>{result.revenue}</TableRowColumn>
                      {typeof localStorage.executeActions !== 'undefined' && (
                        <TableRowColumn>
                          <PipelineStages
                            index={index}
                            opportunity={this.state.opportunities[result.funderId]}
                            funderId={result.nid}
                            funderName={result}
                            buttonClass="Material-cards__expanded-state"
                            {...pipelineStagesAttrs}
                          />
                        </TableRowColumn>
                      )}
                      <TableRowColumn>
                        <CardsActions
                          index={index}
                          opportunity={this.state.opportunities[result.funderId]}
                          funderId={result.nid}
                          history={this.props.history}
                          {...pipelineStagesAttrs}
                        />
                      </TableRowColumn>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </React.Fragment>
    )
  }
}

export default CollapsedCard_DEPRECATED
