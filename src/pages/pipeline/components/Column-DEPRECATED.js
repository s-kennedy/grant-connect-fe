// Global DOM components.
import React, { Component } from 'react'
import { DropTarget } from 'react-drag-drop-container'
import renderHTML from 'react-render-html'

// Custom DOM components.
import PipelineCard from './PipelineCard-DEPRECATED'

// Controllers.
import * as FunderController from '../../../controllers/FunderController-DEPRECATED'
// API calls.
import * as GrantConnectAPI from '../../../utils/API/ContentaAPI-DEPRECATED'

import ReactGA from 'react-ga'
import _ from 'lodash'
// Helpers.
import { sortArrayKey } from '../../../utils/helpers'

// App Language.
import { getLanguage } from 'data/locale'

// @TODO: Remove this hard coded when UUID is coming from the API.

class Column extends Component {
  state = {
    pipelineItems: [],
    pipelineStages: []
  }

  componentDidMount() {
    this.setState(this.props.pipelineStages)
    this.setState({ pipelineItems: this.sortPipelineItems(this.props.pipelineItems) })
  }

  sortPipelineItems = pipelineItems => {
    return sortArrayKey(pipelineItems, 'next_deadline')
  }

  getItemsInfo = dragData => {
    return {
      funder: dragData.funder,
      uid: dragData.uid,
      nid: dragData.uid,
      funder_uuid: dragData.funderId,
      uuid: dragData.opportunityId,
      request_size: dragData.requestSize,
      next_deadline: dragData.nextDeadline,
      ongoing: dragData.ongoing,
      flag_uuid: dragData.flagId,
      pipeline_stage_uuid: dragData.pipelineStageId
    }
  }

  handleDrop = e => {
    let stagesIds = this.props.pipelineStages
    let shouldCreate = true
    for (let funderInfo in this.state.pipelineItems) {
      if (this.state.pipelineItems[funderInfo].funder === e.dragData.funder) {
        shouldCreate = false
      }
    }

    if (shouldCreate) {
      let items = this.state.pipelineItems.slice()
      const stageId = stagesIds[this.props.columnName]

      items.push(this.getItemsInfo(e.dragData))
      items = this.sortPipelineItems(items)
      this.setState({ pipelineItems: items })
      if (this.props.columnName == 'Stewardship') {
        GrantConnectAPI.getUserInfo().then(user => {
          ReactGA.event({
            category: 'Founder',
            action: `${user[0].name} has successfully gained funding from ${e.dragData.funder}`
          })
        })
      } else {
        GrantConnectAPI.getUserInfo().then(user => {
          ReactGA.event({
            category: 'Founder',
            action: `${user[0].name} has moved ${e.dragData.funder} to ${this.props.columnName}`
          })
        })
      }

      this.updatePipelineStage(
        e.dragData.funderId,
        e.dragData.opportunityId,
        e.dragData.flagId,
        stageId
      )
    }
  }

  swap = (fromIndex, toIndex, dragData) => {
    let items = this.state.pipelineItems.slice()
    let stagesIds = this.props.pipelineStages
    const stageId = stagesIds[this.props.columnName]

    items.push(this.getItemsInfo(dragData))
    items = this.sortPipelineItems(items)
    this.setState({ pipelineItems: items })
    GrantConnectAPI.getUserInfo().then(user => {
      if (this.props.columnName == 'Stewardship') {
        ReactGA.event({
          category: 'Founder',
          action: `${user[0].name} has successfully gained funding from ${dragData.funder}`
        })
      } else {
        GrantConnectAPI.getUserInfo().then(user => {
          ReactGA.event({
            category: 'Founder',
            action: `${user[0].name} has moved ${dragData.funder} to ${this.props.columnName}`
          })
        })
      }
    })

    this.updatePipelineStage(dragData.funderId, dragData.opportunityId, dragData.flagId, stageId)
  }

  kill = uid => {
    let items = []
    items = _.filter(this.state.pipelineItems, item => {
      return item.nid != uid
    })
    items = this.sortPipelineItems(items)
    this.setState({ pipelineItems: items })
  }

  updatePipelineStage = (funderId, opportunityId, flagId, columnName) => {
    FunderController.updateStage(funderId, opportunityId, flagId, columnName)
  }

  render() {
    const { pipelineItems } = this.state
    const { columnName, isLast } = this.props
    const { t } = getLanguage()
    let fundersText = t.pipeline.prospectiveFunders

    return (
      <div>
        <h4>{columnName}</h4>
        <small>{`${pipelineItems.length} ${fundersText}`}</small>
        <DropTarget
          onHit={this.handleDrop}
          targetKey="pipelineCard"
          dropData={{ name: columnName, items: pipelineItems }}
        >
          <div className={`Pipeline__column ${columnName}`}>
            {pipelineItems.map((item, index) => {
              return (
                <PipelineCard
                  style={{ width: '100%' }}
                  key={item.nid}
                  className={item.nid}
                  uid={item.nid}
                  columnName={columnName}
                  funderId={item.funder_uuid}
                  opportunityId={item.uuid}
                  flagId={item.flag_uuid}
                  status={item.field_status}
                  pipelineStageId={item.pipeline_stage_uuid}
                  requestSize={item.request_size}
                  deadline={item.next_deadline}
                  ongoing={item.ongoing}
                  kill={this.kill}
                  index={index}
                  swap={this.swap}
                  history={this.props.history}
                >
                  {renderHTML(item.funder)}
                </PipelineCard>
              )
            })}
          </div>
        </DropTarget>
      </div>
    )
  }
}

export default Column
