// Global DOM Components.
import React, { Component } from 'react'
import Collapsible from 'react-collapsible'
import { Col, Row } from 'react-flexbox-grid'

// Custom DOM Components.
import ProfileProgramsList from './ProfileProgramsList'

// Helpers.
import { stripTags } from '../../../utils/helpers'
import _ from 'lodash'

// Controllers.
import * as FunderController from '../../../controllers/FunderController-DEPRECATED'

// App Language.
import { getLanguage } from 'data/locale'

class ProfilePrograms extends Component {
  state = {
    funderRegions: {},
    supportTypes: {},
    funderRestrictions: {},
    funderCauses: {},
    funderDeadlines: {},
    funderMethods: {},
    funderRequirements: {},
    funderEvaluation: {},
    type_support: {}
  }

  componentDidMount() {
    this.loadFundingInformation()
    this.loadApplicationInformation()
  }

  loadFundingInformation = () => {
    const { funderInfo } = this.props
    const relData = funderInfo.data.relationships

    // Getting the types of support info.
    if (relData.type_support.data.length) {
      const typeApiUrl = relData.type_support.links.related

      FunderController.getRelatedData(typeApiUrl).then(supportTypes => {
        this.setState({ supportTypes })
      })
    }

    // Getting the funding restrictions info.
    if (relData.fund_restrict.data.length) {
      const restrictionsApiUrl = relData.fund_restrict.links.related

      FunderController.getRelatedData(restrictionsApiUrl).then(restrictions => {
        this.setState({ funderRestrictions: restrictions })
      })
    }

    // Getting the causes info.
    if (relData.cause.data.length) {
      // const causesApiUrl = relData.cause.links.related
      // FunderController.getRelatedData(causesApiUrl).then(funderCauses => {
      //   this.setState({ funderCauses })
      // })
    }

    // Getting the deadlines.
  }

  loadApplicationInformation = () => {
    const { funderInfo } = this.props
    const relData = funderInfo.data.relationships

    // Getting the application method.
    if (relData.application_method.data.length) {
      const AppApiUrl = relData.application_method.links.related

      FunderController.getRelatedData(AppApiUrl).then(funderMethods => {
        this.setState({ funderMethods })
      })
    }

    // Getting the application requirements.
    if (_.has(relData, 'application_req.data')) {
      const ReqApiUrl = relData.application_req.links.related

      FunderController.getRelatedData(ReqApiUrl).then(funderRequirements => {
        this.setState({ funderRequirements })
      })
    }

    // Getting the application requirements.
    if (_.has(relData, 'evaluation.links.related')) {
      const ReqApiUrl = relData.evaluation.links.related

      FunderController.getRelatedData(ReqApiUrl).then(funderRequirements => {
        this.setState({ funderEvaluation: funderRequirements })
      })
    }

    // Getting the application requirements.
    if (_.has(relData, 'type_support.links.related')) {
      const ReqApiUrl = relData.type_support.links.related

      FunderController.getRelatedData(ReqApiUrl).then(funderRequirements => {
        this.setState({ type_support: funderRequirements })
      })
    }
  }

  render() {
    const { funderMethods, funderEvaluation, funderRestrictions, type_support } = this.state
    const { funderInfo } = this.props

    const { t } = getLanguage()

    let funderMethodsElement = ''
    if (_.has(funderMethods, 'data[0].attributes.name')) {
      if (funderMethods.data.length > 0) {
        funderMethodsElement = _.map(funderMethods.data, (elem, it) => {
          return <li key={it}>{elem.attributes.name}</li>
        })
        funderMethodsElement = <ul>{funderMethodsElement}</ul>
      } else {
        funderMethodsElement = funderMethods.data[0].attributes.name
      }
    }

    let funderEvaluationElem = ''
    if (!_.isEmpty(funderEvaluation)) {
      funderEvaluationElem = funderEvaluation.data.map(term => {
        return (
          <li key={term.id} className="profile-programs-regions-item">
            {term.attributes.name}
          </li>
        )
      })
      if (!_.isEmpty(funderEvaluationElem)) {
        funderEvaluationElem = <ul> {funderEvaluationElem} </ul>
      }
    }
    return (
      <div>
        {(funderInfo.data.attributes.grant_desc !== null ||
          funderInfo.data.attributes.grant_range) !== null && (
          <div className="profile-programs-regions main">
            {funderInfo.data.attributes.grant_desc !== null && (
              <div>
                <h4>{t.funder.grantingRegions}</h4>
                <p
                  dangerouslySetInnerHTML={{ __html: funderInfo.data.attributes.grant_desc.value }}
                />
              </div>
            )}
            {funderInfo.data.attributes.grant_range !== null && (
              <div>
                <h4>{t.funder.grantRange}</h4>
                <p>{stripTags(funderInfo.data.attributes.grant_range.value)}</p>
              </div>
            )}
          </div>
        )}
        {((_.has(type_support, 'data') && !_.isEmpty(type_support.data)) ||
          (_.has(funderRestrictions, 'data') && !_.isEmpty(funderRestrictions.data))) && (
          <div className="profile-programs-regions profile-programs-funding-info">
            <div>
              <h4>{t.funder.eligibleCosts}</h4>
              <p>{t.funder.eligibleCostsDescription}</p>
            </div>
            {_.has(type_support, 'data') && !_.isEmpty(type_support.data) && (
              <ProfileProgramsList
                headerTitle={t.funder.eligibleCosts}
                termData={type_support}
                RenderElement="div"
              />
            )}
            {_.has(funderRestrictions, 'data') && !_.isEmpty(funderRestrictions.data) && (
              <ProfileProgramsList
                headerTitle={t.funder.fundingRestrictions}
                termData={funderRestrictions}
                RenderElement="div"
              />
            )}
          </div>
        )}
        {(funderMethodsElement != '' ||
          funderInfo.data.attributes.application_procedure !== null ||
          funderInfo.data.attributes.application_turn !== null ||
          funderInfo.data.attributes.application_deadline !== null) && (
          <div className="profile-programs-regions profile-programs-application-info">
            <h4> {t.funder.applicationInfo} </h4>
            {(funderInfo.data.attributes.application_procedure !== null ||
              funderMethodsElement) && (
              <div className="profile-info-wrapper profile-info-procedure">
                {(funderInfo.data.attributes.application_procedure !== null ||
                  funderMethodsElement) && <h5>{t.funder.applicationProcedure}</h5>}
                {funderMethodsElement && <div> {funderMethodsElement} </div>}
                {funderInfo.data.attributes.application_procedure !== null && (
                  <p
                    dangerouslySetInnerHTML={{
                      __html: funderInfo.data.attributes.application_procedure.value
                    }}
                  />
                )}
              </div>
            )}
            {funderInfo.data.attributes.application_turn !== null && (
              <div className="profile-info-wrapper">
                <h5>{t.funder.applicationTurnaround}</h5>
                <p
                  dangerouslySetInnerHTML={{
                    __html: funderInfo.data.attributes.application_turn.value
                  }}
                />
              </div>
            )}
            {funderInfo.data.attributes.application_deadline !== null && (
              <div className="profile-info-wrapper">
                <h5>{t.funder.applicationDeadline}</h5>
                <p
                  dangerouslySetInnerHTML={{
                    __html: funderInfo.data.attributes.application_deadline.value
                  }}
                />
              </div>
            )}
          </div>
        )}
        {!_.isEmpty(funderEvaluationElem) && (
          <div className="profile-programs-regions profile-programs-dealines">
            <h4> {t.funder.evaluationCriteria} </h4>
            <p> {t.funder.evaluationCriteriaDescription} </p>
            {funderEvaluationElem}
          </div>
        )}
      </div>
    )
  }
}

export default ProfilePrograms
