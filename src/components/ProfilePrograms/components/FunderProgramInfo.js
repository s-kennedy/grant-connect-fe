import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { stripTags } from 'utils/helpers'
import ProfileProgramsList from 'pages/profile/components/ProfileProgramsList.js'

const FunderProgramInfo = ({ funderProgram }) => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)

  const hasApplicationInformation =
    funderProgram.applicationProcedure ||
    funderProgram.applicationTurnaround ||
    funderProgram.applicationDeadline ||
    funderProgram.applicationMethods.length > 0

  const eligibleCosts = funderProgram.programEligibleCosts.filter(cost => cost.type === 'eligible')
  const ineligibleCosts = funderProgram.programEligibleCosts.filter(
    cost => cost.type === 'ineligible'
  )

  const applicationMethods =
    Array.isArray(funderProgram.applicationMethods) && funderProgram.applicationMethods.length ? (
      <ul>
        {funderProgram.applicationMethods.map((method, index) => (
          <li key={index}>{method.name}</li>
        ))}
      </ul>
    ) : null

  return (
    <div>
      {(!!funderProgram.grantingRegionDescription || !!funderProgram.averageGrantRange) && (
        <div className="profile-programs-regions main">
          {!!funderProgram.grantingRegionDescription && (
            <div>
              <h4>{t.funder.grantingRegions}</h4>
              <p dangerouslySetInnerHTML={{ __html: funderProgram.grantingRegionDescription }} />
            </div>
          )}
          {!!funderProgram.averageGrantRange && (
            <div>
              <h4>{t.funder.grantRange}</h4>
              <p dangerouslySetInnerHTML={{ __html: funderProgram.averageGrantRange }} />
            </div>
          )}
        </div>
      )}
      {!!funderProgram.programEligibleCosts.length && (
        <div className="profile-programs-regions profile-programs-funding-info">
          <div>
            <h4>{t.funder.eligibleCosts}</h4>
            <p>{t.funder.eligibleCostsDescription}</p>
          </div>
          {!!eligibleCosts.length && (
            <ProfileProgramsList
              headerTitle={t.funder.eligibleCosts}
              termData={eligibleCosts}
              RenderElement="div"
            />
          )}
          {!!ineligibleCosts.length && (
            <ProfileProgramsList
              headerTitle={t.funder.fundingRestrictions}
              termData={ineligibleCosts}
              RenderElement="div"
            />
          )}
        </div>
      )}
      {hasApplicationInformation && (
        <div className="profile-programs-regions profile-programs-application-info">
          <h4> {t.funder.applicationInfo} </h4>
          {(funderProgram.applicationProcedure || applicationMethods) && (
            <div className="profile-info-wrapper profile-info-procedure">
              <h5>{t.funder.applicationProcedure}</h5>
              {applicationMethods && <div> {applicationMethods} </div>}
              {!!funderProgram.applicationProcedure && (
                <p dangerouslySetInnerHTML={{ __html: funderProgram.applicationProcedure }} />
              )}
            </div>
          )}
          {!!funderProgram.applicationTurnaround && (
            <div className="profile-info-wrapper">
              <h5>{t.funder.applicationTurnaround}</h5>
              <p dangerouslySetInnerHTML={{ __html: funderProgram.applicationTurnaround }} />
            </div>
          )}
          {funderProgram.applicationDeadline !== null && (
            <div className="profile-info-wrapper">
              <h5>{t.funder.applicationDeadline}</h5>
              <p dangerouslySetInnerHTML={{ __html: funderProgram.applicationDeadline }} />
            </div>
          )}
        </div>
      )}
      {!!funderProgram.evaluationCriteria.length && (
        <div className="profile-programs-regions profile-programs-dealines">
          <h4> {t.funder.evaluationCriteria} </h4>
          <p> {t.funder.evaluationCriteriaDescription} </p>
          <ul>
            {funderProgram.evaluationCriteria.map(criteria => {
              return (
                <li key={criteria.id} className="profile-programs-regions-item">
                  {criteria.name}
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

export default FunderProgramInfo
