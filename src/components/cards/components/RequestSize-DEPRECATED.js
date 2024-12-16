// Global DOM components.
import React, { Component } from 'react'
import { FlatButton, IconButton } from 'material-ui'
import { ModeEdit } from 'material-ui-icons'

// Controllers.
import * as FunderController from '../../../controllers/FunderController-DEPRECATED'

// App Language.
import { getLanguage } from 'data/locale'

class requestSize extends Component {
  state = {
    requestSize: 0,
    previousRequestSizeValue: null,
    showRequestSizeInput: false
  }

  componentDidMount() {
    const { requestSize } = this.props

    this.setState({ requestSize })
  }

  updateRequestSize = e => {
    this.setState({ requestSize: e.target.value })
  }

  saveRequestSize = () => {
    const { requestSize } = this.state
    const { funderId, opportunityId, flagId, pipelineStageId } = this.props

    FunderController.updateRequestSize(
      requestSize,
      funderId,
      opportunityId,
      flagId,
      pipelineStageId
    )

    this.setState({ showRequestSizeInput: false })
  }

  showRequestSizeInput = () => {
    this.setState({
      showRequestSizeInput: true,
      previousRequestSizeValue: this.state.requestSize
    })
  }

  cancelRequestSizeForm = () => {
    const { previousRequestSizeValue } = this.state

    this.setState({
      requestSize: previousRequestSizeValue,
      showRequestSizeInput: false
    })
  }

  render() {
    const { showRequestSizeInput } = this.state
    const { hideText } = this.props
    const { t } = getLanguage()
    const requestSizeText =
      typeof hideText !== 'undefined' && hideText === true ? '' : `${t.cards.requestSize}:`

    if (typeof localStorage.executeActions === 'undefined') {
      return <div />
    }
    let classname = `Full-card__request-size open-${showRequestSizeInput}`
    return (
      <div className={classname}>
        {!showRequestSizeInput && <small>{`${requestSizeText} ${this.state.requestSize}`}</small>}
        {showRequestSizeInput && (
          <div>
            <small>{`${t.cards.requestSize}:`}</small>
            <input
              className="Full-card__request-size-input"
              type="text"
              maxlength="10"
              value={this.state.requestSize}
              onChange={this.updateRequestSize}
            />
            <FlatButton
              className="Full-card__status"
              label={t.global.save}
              onClick={this.saveRequestSize}
            />
            <FlatButton
              className="Full-card__status"
              label={t.global.cancel}
              onClick={this.cancelRequestSizeForm}
            />
          </div>
        )}
        {!showRequestSizeInput && (
          <IconButton className="Full-card__request-size-edit" onClick={this.showRequestSizeInput}>
            <ModeEdit />
          </IconButton>
        )}
      </div>
    )
  }
}

export default requestSize
