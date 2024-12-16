import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Col, Row } from 'react-flexbox-grid'
import { useTranslation } from 'react-i18next'
import { CircularProgress, FlatButton, Paper } from 'material-ui'
import { Check, Close, LocationOn } from 'material-ui-icons'

import Pills from 'components/Pills'
import { getDeadlineState, getNextDeadlinesFromPrograms } from 'components/Deadlines/helpers'
import Notes from './components/Notes'
import GiftInfo from './components/GiftInfo'
import PipelineStageButton from 'components/PipelineStageButton'
import CardActions from 'components/CardActions'
import ResetCardAction from 'components/CardActions/actions/ResetAction'
import ArchiveCardAction from 'components/CardActions/actions/ArchiveAction'
import HideCardAction from 'components/CardActions/actions/HideAction'

import { getFunderById } from 'store/actions/profile'
import {
  selectFunderPills,
  selectFunderProfileCategory,
  selectFunderProfileInfo,
  selectIsFunderProfileLoading,
  selectFunderPrecalculatedInfo
} from 'store/selectors/profile'
import RequestSize from './components/RequestSize'
import SpecialNote from './components/SpecialNote'
import Deadline from 'components/Deadlines'
import { selectIsLibraryMode } from 'store/selectors/user'
import NotEngagedNote from './components/NotEngagedNote'

const ProfileCard = ({}) => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)
  const isLoading = useSelector(selectIsFunderProfileLoading)
  const {
    id,
    name,
    websiteUrl,
    openToRequests,
    funderPrograms,
    addresses,
    funderOrganizationFunderOpportunity,
    funderActivityOption,
    primaryCategory
  } = useSelector(selectFunderProfileInfo)

  const { medianGiftSize, giftsLastYear, medianRecipientSize } =
    useSelector(selectFunderPrecalculatedInfo) || {}

  const pillItems = useSelector(selectFunderPills)
  const category = useSelector(selectFunderProfileCategory)
  const isLibraryMode = useSelector(selectIsLibraryMode)

  const funderHasNoPrograms = funderPrograms ? funderPrograms.length === 0 : true
  const { hasOngoingDeadline, closestDeadlineDate } = getNextDeadlinesFromPrograms(funderPrograms)

  const { color: cardColor, Icon, label, showDate } = getDeadlineState({
    deadlineDate: closestDeadlineDate,
    isOngoing: hasOngoingDeadline,
    hasNoPrograms: funderHasNoPrograms
  })
  const funderAddress = Array.isArray(addresses) && addresses.length && addresses[0]
  const headquarters = funderAddress
    ? `${t.cards.headquarters}: ${funderAddress.city}, ${funderAddress.province}`
    : 'N/A'

  let requestStatusIcon = ''
  let requestStatus = ''
  if (openToRequests === 'yes') {
    requestStatusIcon = <Check />
    requestStatus = t.search.openRequests
  }
  if (openToRequests === 'no') {
    requestStatusIcon = <Close />
    requestStatus = t.search.closeRequests
  }

  const giftInfos = [
    { label: t.cards.giftsLastYear, value: giftsLastYear },
    { label: t.cards.typicalGift, value: medianGiftSize },
    { label: t.cards.typicalRecipientSize, value: medianRecipientSize }
  ]

  const showResetCardAction =
    funderOrganizationFunderOpportunity &&
    (funderOrganizationFunderOpportunity.pipelineStage ||
      funderOrganizationFunderOpportunity.archived ||
      funderOrganizationFunderOpportunity.hidden)

  const showArchiveCardAction =
    funderOrganizationFunderOpportunity &&
    funderOrganizationFunderOpportunity.pipelineStage &&
    !funderOrganizationFunderOpportunity.hidden &&
    !funderOrganizationFunderOpportunity.archived

  const showHideCardAction =
    !funderOrganizationFunderOpportunity || !funderOrganizationFunderOpportunity.hidden

  const isFunderFoundation =
    !!primaryCategory?.root?.name && primaryCategory.root.name === t.categories.foundations
  const isFunderGrantmaking = funderActivityOption
    ? funderActivityOption.some(
        activity =>
          activity.name === t.activities.grantmaking ||
          activity.name === t.activities.grantmaking.toLowerCase()
      )
    : false

  return (
    <Col xs={12}>
      {isLoading ? (
        <div className="refresh-container">
          <CircularProgress size={60} thickness={5} color="#4c9eff" />
        </div>
      ) : (
        <React.Fragment>
          <Paper className={`Full-card ${cardColor}`}>
            <Row>
              <Col xs={12} lg={7} xl={8}>
                <Row>
                  <Col xs={12} lg={12} xl={6}>
                    <h1 className="tw-text-xl">{name}</h1>
                  </Col>
                  <Col xs={12} lg={12} xl={6}>
                    <small className="Full-card__type tw-text-sm">{category}</small>
                    {websiteUrl && (
                      <FlatButton
                        className="Full-card__website"
                        label={t.cards.website}
                        onClick={() => window.open(websiteUrl)}
                      />
                    )}
                  </Col>
                </Row>

                <Row>
                  <GiftInfo giftInfos={giftInfos} />
                </Row>

                <Row>
                  <Col xs={12}>
                    <div className="Full-card__open-to-requests">
                      <div className="tw-flex tw-items-center tw-mt-2">
                        <small className="tw-text-sm">{`${t.funder.funderPrograms}: ${funderPrograms.length}`}</small>
                        {requestStatusIcon}
                        <small className="tw-text-sm">{requestStatus} </small>
                        <LocationOn /> <small className="tw-text-sm"> {headquarters} </small>
                      </div>
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col xs={12}>
                    <div className={`Full-card__deadline ${cardColor}`}>
                      {!!Icon && <Icon />}
                      <small>
                        {label}
                        {showDate && <Deadline date={closestDeadlineDate} format="long" />}
                      </small>
                    </div>
                  </Col>
                </Row>
              </Col>

              <Col xs={12} lg={5} xl={4}>
                <Row>
                  <Col xs={12}>
                    <div className="Full-card__actions">
                      {!isLibraryMode && (
                        <RequestSize opportunity={funderOrganizationFunderOpportunity} />
                      )}
                      <PipelineStageButton
                        buttonClass="Full-card__status"
                        spinnerColor="white"
                        opportunity={funderOrganizationFunderOpportunity}
                        funderId={id}
                        loadData={() => getFunderById(id, false)}
                      />
                      <CardActions
                        funder={{ id }}
                        opportunityId={
                          funderOrganizationFunderOpportunity &&
                          funderOrganizationFunderOpportunity.id
                        }
                        actions={[
                          showResetCardAction && ResetCardAction,
                          showArchiveCardAction && ArchiveCardAction,
                          showHideCardAction && HideCardAction
                        ]}
                        loadData={() => getFunderById(id, false)}
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <Notes />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Paper>
          <Pills items={pillItems} areRemovable={false} selectOnClick renderInfoSection />
          <NotEngagedNote />
          <SpecialNote />
        </React.Fragment>
      )}
    </Col>
  )
}

export default ProfileCard
