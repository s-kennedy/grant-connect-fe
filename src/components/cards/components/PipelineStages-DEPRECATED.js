// Global DOM Components.
import React, { Component } from 'react'
import { FlatButton, Menu, MenuItem, Popover } from 'material-ui'
import { KeyboardArrowDown } from 'material-ui-icons'
import _ from 'lodash'
import * as GrantConnectAPI from '../../../utils/API/ContentaAPI-DEPRECATED'
import ReactGA from 'react-ga'
// Controllers.
import * as FunderController from '../../../controllers/FunderController-DEPRECATED'

import { getLanguage } from 'data/locale'

import CircularProgress from 'material-ui/CircularProgress'
import { connect } from 'react-redux'
import { RoleEnum } from 'store/reducers/user'

const { t } = getLanguage()

class PipelineStages extends Component {
  state = {
    opportunity: this.props.opportunity,
    pipelineStages: { data: [] },
    popoverOpen: {},
    buttonLabel: t.pipeline.addToPipeline,
    newOpportunityId: null,
    processing: false
  }

  componentDidMount() {
    if (typeof localStorage.pipelineStages === 'undefined') {
      FunderController.getAllStages().then(pipelineStages => {
        localStorage.setItem('pipelineStages', JSON.stringify(pipelineStages))
        this.setState({ pipelineStages })
      })
    } else {
      // this.setState({ pipelineStages: JSON.parse(localStorage.pipelineStages) })
    }
  }

  handleActionsClick = (e, index) => {
    this.setState({
      popoverOpen: {
        [index]: true
      },
      anchorEl: e.currentTarget
    })

    e.preventDefault()
  }

  handleRequestClose = () => {
    this.setState({ popoverOpen: {} })
  }

  updateStage = e => {
    // const { pipelineStages, newOpportunityId } = this.state
    // const { funderId, opportunityId, flagId, funderName } = this.props
    // let pipelineStageId
    // let buttonLabel = e.target.innerText
    // // Getting the right ID.
    // for (let stageIndex in pipelineStages.data) {
    //   if (buttonLabel === pipelineStages.data[stageIndex].attributes.name) {
    //     pipelineStageId = pipelineStages.data[stageIndex].id
    //   }
    // }
    // this.setState({ buttonLabel })
    // this.handleRequestClose()
    // let name = ''
    // if (_.has(funderName, 'label')) {
    //   name = funderName.label
    // }
    // if (_.has(funderName, 'attributes.alias')) {
    //   name = funderName.attributes.alias
    // }
    // if (_.has(funderName, 'attributes.title')) {
    //   name = funderName.attributes.title
    // }
    // if (buttonLabel == 'Stewardship') {
    //   GrantConnectAPI.getUserInfo().then(user => {
    //     ReactGA.event({
    //       category: 'Founder',
    //       action: `${user[0].name} has successfully gained funding from ${name}`
    //     })
    //   })
    // } else {
    //   GrantConnectAPI.getUserInfo().then(user => {
    //     ReactGA.event({
    //       category: 'Founder',
    //       action: `${user[0].name} has moved ${name} to ${buttonLabel}`
    //     })
    //   })
    // }
    // if (typeof opportunityId !== 'undefined' && typeof flagId !== 'undefined') {
    //   FunderController.updateStage(funderId, opportunityId, flagId, pipelineStageId)
    // } else {
    //   FunderController.updateStage(funderId, newOpportunityId, '', pipelineStageId)
    // }
  }

  createOpportunity = e => {
    // this.setState({ processing: true })
    // const { pipelineStages } = this.state
    // const { shouldRederect, funderId, funderName } = this.props
    // FunderController.getFunderInfoByUuid(funderId).then(funderInfo => {
    //   const funderNid = funderInfo.data.attributes.drupal_internal__nid
    //   FunderController.getOpportunity(funderNid).then(funderOpportunity => {
    //     if (_.has(funderOpportunity[0], 'uuid')) {
    //       const oppID = funderOpportunity[0].uuid
    //       if (funderOpportunity[0].pipeline_stage == '') {
    //         this.updateOpportunity(e, oppID, '2c5e7d99-1752-4a41-a25a-c60a602bae34')
    //       }
    //     } else {
    //       let name = ''
    //       if (_.has(funderName, 'label')) {
    //         name = funderName.label
    //       }
    //       if (_.has(funderName, 'name')) {
    //         name = funderName.name
    //       }
    //       if (_.has(funderName, 'attributes.title')) {
    //         name = funderName.attributes.title
    //       }
    //       ReactGA.event({
    //         category: 'Founder',
    //         action: `${name} Added to pipeline`
    //       })
    //       FunderController.createOpportunity(funderId, pipelineStages.data[0].id).then(opportunity => {
    //         this.setState({
    //           opportunity: { pipeline_stage: pipelineStages.data[0].attributes.name },
    //           newOpportunityId: opportunity.data.id
    //         })
    //         if (shouldRederect && window.location.pathname.search('profile') !== -1) {
    //           window.location.reload()
    //         }
    //       })
    //     }
    //   })
    // })
  }
  updateOpportunity = (e, oppID, pipeline_stage_uuid) => {
    const { funderId } = this.props
    FunderController.updateStage(funderId, oppID, '', pipeline_stage_uuid).then(opportunity => {
      window.location.reload()
    })
  }

  componentDidUpdate() {
    if (
      typeof this.state.opportunity === 'undefined' &&
      typeof this.props.opportunity !== 'undefined'
    ) {
      this.setState({
        opportunity: { pipeline_stage: this.props.opportunity.pipeline_stage }
      })
    }
  }

  render() {
    const { pipelineStages, opportunity } = this.state
    const {
      buttonClass,
      index,
      user: { role }
    } = this.props
    let buttonLabel

    if (![RoleEnum.ESSENTIAL, RoleEnum.PROFESSIONAL].includes(role)) {
      return <div />
    }
    if (typeof opportunity === 'undefined' || _.isEmpty(opportunity.pipeline_stage)) {
      if (this.state.processing) {
        return (
          <div className="Material-cards-stages-wrapper">
            <FlatButton
              className={`${buttonClass} add`}
              label={this.state.buttonLabel}
              labelPosition="before"
              icon={<CircularProgress size={20} color="#479cff" />}
              onClick={this.createOpportunity}
            />
          </div>
        )
      }
      return (
        <div className="Material-cards-stages-wrapper">
          <FlatButton
            className={`${buttonClass} add`}
            label={this.state.buttonLabel}
            onClick={this.createOpportunity}
          />
        </div>
      )
    } else {
      buttonLabel = opportunity.pipeline_stage

      if (this.state.buttonLabel !== t.pipeline.addToPipeline) {
        buttonLabel = this.state.buttonLabel
      }
    }
    pipelineStages.data = _.sortBy(pipelineStages.data, [
      function (o) {
        return o.attributes.weight
      }
    ])
    return (
      <div className="Material-cards-stages-wrapper">
        <FlatButton
          className={`${buttonClass}`}
          label={buttonLabel}
          labelPosition="before"
          icon={<KeyboardArrowDown />}
          onClick={e => this.handleActionsClick(e, index)}
        />
        <Popover
          open={this.state.popoverOpen[index]}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
          targetOrigin={{ horizontal: 'right', vertical: 'top' }}
          onRequestClose={this.handleRequestClose}
        >
          <Menu className="Material-cards__expanded-stages-menu-wrapper">
            {pipelineStages.data.length > 0 &&
              pipelineStages.data.map((stageOption, stageIndex) => {
                return (
                  <MenuItem
                    key={stageIndex}
                    className="Material-cards__expanded-stages-item"
                    primaryText={stageOption.attributes.name}
                    onClick={this.updateStage}
                  />
                )
              })}
          </Menu>
        </Popover>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  user: state.user
})

export default connect(mapStateToProps)(PipelineStages)
