// Global DOM components.
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { DragDropContainer, DropTarget } from 'react-drag-drop-container'
import TextTruncate from 'react-text-truncate'

// Custom DOM components.
import RequestSize from '../../../components/cards/components/RequestSize-DEPRECATED'
import CardsActions from '../../../components/cards/components/CardsActions-DEPRECATED'

// Controllers.
import * as SearchController from '../../../controllers/SearchController-DEPRECATED'

// Paths.
import { PROFILE_PAGE } from '../../../utils/paths'

// Helpers.
import _ from 'lodash'

class PipelineCard extends Component {
  state = {
    highlighted: false,
    linkActive: true,
    activate: true
  }

  highlight = () => {
    this.setState({ highlighted: true })
  }

  unHighlight = () => {
    this.setState({ highlighted: false })
  }

  handleDrop = e => {
    const { index, swap } = this.props

    e.stopPropagation()
    this.unHighlight()
    swap(e.dragData.index, index, e.dragData)
  }
  onDrag = () => {
    // @todo sometimes this code doesn't works fine with the d&d in chrome.
    // this.setState({linkActive: false});
  }
  onDragEnd = () => {
    this.setState({ linkActive: true })
  }
  onDrop = dropData => {
    if (this.state.activate) {
      this.setState({ activate: false })
      let original = ''
      if (_.has(dropData, 'path')) {
        original = dropData.path[1].classList.value
      }
      if (_.has(dropData, 'originalTarget')) {
        original = dropData.originalTarget.parentElement.getAttribute('class')
      }
      if (dropData.dropElem.lastElementChild.classList.value !== original) {
        this.props.kill(this.props.uid, dropData)
      }
    }
  }

  render() {
    const {
      status,
      children,
      columnName,
      deadline,
      requestSize,
      uid,
      ongoing,
      funderId,
      opportunityId,
      flagId,
      pipelineStageId
    } = this.props
    let outerStyles = { borderTop: '2px solid transparent' }

    if (this.state.highlighted) {
      outerStyles.borderTop = '2px solid #ccc'
    }

    let deadlineInfo = {
      deadlineIcon: '',
      deadlineTextShort: '',
      colorClass: 'gray'
    }

    deadlineInfo = SearchController.getDeadlineInfoFromResult({
      title: children,
      next_deadline_date: deadline,
      ongoing: ongoing
    })

    const dragData = {
      funder: children,
      uid,
      columnName,
      opportunityId,
      funderId,
      requestSize,
      nextDeadline: deadline,
      ongoing,
      pipelineStageId,
      flagId
    }

    // @todo try to find solution without overlay
    let link = (
      <Link to={`${PROFILE_PAGE}/${funderId}`}>
        <TextTruncate line={2} truncateText="..." text={children} />
      </Link>
    )
    if (!this.state.linkActive) {
      link = (
        <Link to={`#`}>
          <div className="overlay-noClick"></div>
          <TextTruncate line={2} truncateText="..." text={children} />
        </Link>
      )
    }
    if (this.state.activate) {
      return (
        <DragDropContainer
          targetKey="pipelineCard"
          returnToBase={true}
          dragData={dragData}
          onDragEnd={this.onDragEnd}
          onDrop={this.onDrop}
        >
          <DropTarget
            onHit={this.handleDrop}
            onDragEnter={this.highlight}
            onDragLeave={this.unHighlight}
            targetKey="pipelineCard"
          >
            <div style={outerStyles} className={`${uid}`}>
              <div className={`Pipeline__card ${deadlineInfo.colorClass}`}>
                <div>{link}</div>
                <CardsActions
                  index={uid}
                  funderId={funderId}
                  opportunity={{ uuid: opportunityId }}
                  history={this.props.history}
                  status={status}
                />
                {typeof requestSize !== 'undefined' && requestSize.trim() !== '' && (
                  <RequestSize
                    hideText={true}
                    requestSize={requestSize}
                    opportunityId={opportunityId}
                    funderId={funderId}
                    flagId={flagId}
                    pipelineStageId={pipelineStageId}
                  />
                )}
                <div className="Pipeline__card-deadline">
                  {deadlineInfo.deadlineIcon}
                  {deadlineInfo.deadlineTextShort}
                </div>
              </div>
            </div>
          </DropTarget>
        </DragDropContainer>
      )
    } else {
      return <div> </div>
    }
  }
}

export default PipelineCard
