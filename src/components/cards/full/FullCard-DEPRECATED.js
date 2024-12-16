// Global DOM components.
import React, { Component } from 'react'
import { Col, Row } from 'react-flexbox-grid'
import { CircularProgress, FlatButton, Paper } from 'material-ui'
import { Check, Close, LocationOn } from 'material-ui-icons'
import TextTruncate from 'react-text-truncate'

// Custom DOM components.
import RequestSize from '../components/RequestSize-DEPRECATED'
import CardsActions from '../components/CardsActions-DEPRECATED'
import Notes from '../../notes/Notes-DEPRECATED'
import TextLoading from '../../global/loading/TextLoading'
import PipelineStages from '../components/PipelineStages-DEPRECATED'
// import I18nDate from '../../global/date/I18nDate'

// Controllers.
import * as SearchController from '../../../controllers/SearchController-DEPRECATED'

// Helpers.
import { formatSINumber, stripTags } from '../../../utils/helpers'
import _ from 'lodash'

// App Language.
import { getLanguage } from 'data/locale'

class FullCard extends Component {
  openWebsite = () => {
    const { funderInfo } = this.props

    window.open(funderInfo.data.attributes.website.uri)
  }

  render() {
    const {
      category,
      funderInfo,
      industry,
      opportunity,
      showRefreshIndicator,
      funderStatus
    } = this.props
    const { t } = getLanguage()
    let cardDeadline = { colorClass: 'gray' }
    let requestStatus = ''
    let requestStatusIcon = ''

    if (!showRefreshIndicator) {
      cardDeadline = SearchController.getDeadlineInfoFromResult({
        title: funderInfo.data.attributes.title,
        next_deadline_date: funderInfo.data.attributes.next_deadline,
        ongoing: funderInfo.data.attributes.ongoing
      })

      if (funderInfo.data.attributes.open_requests === 'yes') {
        requestStatus = t.search.openRequests
        requestStatusIcon = <Check />
      } else if (funderInfo.data.attributes.open_requests === 'no') {
        requestStatus = t.search.closeRequests
        requestStatusIcon = <Close />
      }
    }
    let fuderCount = '',
      location = ''
    if (_.has(funderInfo, 'data.attributes')) {
      fuderCount = `${t.funder.funderPrograms}: ${funderInfo.data.attributes.program_count}`
    }
    if (
      _.has(funderInfo, 'data.attributes.address') &&
      !_.isEmpty(funderInfo.data.attributes.address)
    ) {
      location = `${t.cards.headquarters}: ${funderInfo.data.attributes.address[0].locality}, ${funderInfo.data.attributes.address[0].administrative_area}`
    }
    const separator = category.length !== 0 && industry.length !== 0 ? '/' : ''
    let investment = ''
    if (
      category == 'Corporations' &&
      _.has(funderInfo, 'data.attributes.financial.community_investment')
    ) {
      investment = (
        <div className="Full-card__values-recipient">
          <small>{t.cards.estimatedCommunityInvestment}</small>
          <big>{formatSINumber(funderInfo.data.attributes.financial.community_investment)}</big>
        </div>
      )
    }
    let card = ''

    card = (
      <Col xs={12}>
        <Paper className={`Full-card ${cardDeadline.colorClass}`} zDepth={0}>
          {showRefreshIndicator && (
            <div className="refresh-container">
              <CircularProgress size={60} thickness={5} color="#4c9eff" />
            </div>
          )}
          {!showRefreshIndicator && (
            <Row>
              <Col xs={12} lg={7} xl={8}>
                <Row>
                  <Col xs={12} lg={12} xl={6}>
                    <h1>{funderInfo.data.attributes.title}</h1>
                  </Col>
                  <Col xs={12} lg={12} xl={6}>
                    <small className="Full-card__type">
                      {category.length === 0 ? (
                        <TextLoading />
                      ) : (
                        `${category}${separator}${industry}`
                      )}
                    </small>
                  </Col>
                </Row>
                <Row>
                  {funderInfo.data.attributes.mission !== null && (
                    <Col xs={12} lg={6} className="Full-card__teaser">
                      <TextTruncate
                        line={4}
                        truncateText="..."
                        text={funderInfo.data.attributes.tagline}
                      />
                    </Col>
                  )}
                </Row>
              </Col>
            </Row>
          )}
        </Paper>
      </Col>
    )

    if (!_.isEmpty(funderStatus) && funderStatus != 'Dissolved') {
      card = (
        <Col xs={12}>
          <Paper className={`Full-card ${cardDeadline.colorClass}`} zDepth={0}>
            {showRefreshIndicator && (
              <div className="refresh-container">
                <CircularProgress size={60} thickness={5} color="#4c9eff" />
              </div>
            )}
            {!showRefreshIndicator && (
              <Row>
                <Col xs={12} lg={7} xl={8}>
                  <Row>
                    <Col xs={12} lg={12} xl={6}>
                      <h1>{funderInfo.data.attributes.title}</h1>
                    </Col>
                    <Col xs={12} lg={12} xl={6}>
                      <small className="Full-card__type">
                        {category.length === 0 ? (
                          <TextLoading />
                        ) : (
                          `${category}${separator}${industry}`
                        )}
                      </small>
                      {funderInfo.data.attributes.website !== null && (
                        <FlatButton
                          className="Full-card__website"
                          label={t.cards.website}
                          onClick={this.openWebsite}
                        />
                      )}
                    </Col>
                  </Row>
                  <Row>
                    {funderInfo.data.attributes.mission !== null && (
                      <Col xs={12} lg={6} className="Full-card__teaser">
                        <TextTruncate
                          line={4}
                          truncateText="..."
                          text={funderInfo.data.attributes.tagline}
                        />
                      </Col>
                    )}
                    <Col xs={12} lg={6} className="Full-card__values">
                      {funderInfo.data.attributes.financial != null &&
                        funderInfo.data.attributes.financial['total gifts'] !== null && (
                          <div className="Full-card__values-gifts">
                            <small>{t.cards.totalGifts}</small>
                            <big>
                              {_.isEmpty(
                                funderInfo.data.attributes.financial['total gifts provided ($)']
                              )
                                ? _.isEmpty(funderInfo.data.attributes.financial['total gifts']) ||
                                  funderInfo.data.attributes.financial['total gifts'] == 0
                                  ? formatSINumber(
                                      funderInfo.data.attributes.financial['total gifts']
                                    )
                                  : t.cards.unknown
                                : formatSINumber(
                                    funderInfo.data.attributes.financial['total gifts']
                                  )}
                            </big>
                          </div>
                        )}
                      {investment}
                      {funderInfo.data.attributes.typical_gift !== 0 &&
                        funderInfo.data.attributes.title !== 'Mental Health Research Canada' && (
                          <div className="Full-card__values-typical-gift">
                            <small>{t.cards.typicalGift}</small>
                            <big>{formatSINumber(funderInfo.data.attributes.typical_gift)}</big>
                          </div>
                        )}
                      {funderInfo.data.attributes.typical_recipient_size !== 0 && (
                        <div className="Full-card__values-recipient">
                          <small>{t.cards.typicalRecipientSize}</small>
                          <big>
                            {formatSINumber(funderInfo.data.attributes.typical_recipient_size)}
                          </big>
                        </div>
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12}>
                      <div className="Full-card__open-to-requests">
                        <div>
                          <small>{fuderCount}</small>
                          {requestStatusIcon}
                          <small>{requestStatus} </small>
                          <LocationOn /> <small> {location} </small>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12}>
                      <div className={`Full-card__deadline ${cardDeadline.colorClass}`}>
                        {cardDeadline.deadlineIcon}
                        <small>
                          {/* {cardDeadline.deadlineText} <I18nDate date={cardDeadline.deadlineDate} /> */}
                        </small>
                      </div>
                    </Col>
                  </Row>
                </Col>
                <Col xs={12} lg={5} xl={4}>
                  {typeof opportunity[0] !== 'undefined' && (
                    <Row>
                      <Col xs={12}>
                        <div className="Full-card__actions">
                          <RequestSize
                            requestSize={
                              opportunity[0].request_size === '' ? 0 : opportunity[0].request_size
                            }
                            opportunityId={opportunity[0].uuid}
                            funderId={funderInfo.data.id}
                            flagId={opportunity[0].flag_uuid}
                            pipelineStageId={opportunity[0].pipeline_stage_uuid}
                          />
                          <PipelineStages
                            index={1}
                            opportunity={{ pipeline_stage: opportunity[0].pipeline_stage }}
                            opportunityId={opportunity[0].uuid}
                            funderId={funderInfo.data.id}
                            funderName={funderInfo.data}
                            flagId={opportunity[0].flag_uuid}
                            buttonClass="Full-card__status"
                          />
                          <CardsActions
                            index={1}
                            opportunity={{ uuid: opportunity[0].uuid }}
                            funderId={funderInfo.data.id}
                            history={this.props.history}
                          />
                        </div>
                      </Col>
                    </Row>
                  )}
                  {typeof opportunity[0] === 'undefined' && (
                    <Row>
                      <Col xs={12}>
                        <div className="Full-card__actions">
                          <PipelineStages
                            index={1}
                            funderId={funderInfo.data.id}
                            funderName={funderInfo.data}
                            buttonClass="Full-card__status"
                            shouldRederect={true}
                          />
                          <CardsActions
                            index={1}
                            funderId={funderInfo.data.id}
                            history={this.props.history}
                          />
                        </div>
                      </Col>
                    </Row>
                  )}
                  {!!opportunity[0] && (
                    <Row>
                      <Col xs={12}>
                        <Notes cardNotes={this.props.cardNotes} opportunity={opportunity[0]} />
                      </Col>
                    </Row>
                  )}
                </Col>
              </Row>
            )}
          </Paper>
        </Col>
      )
    }

    return card
  }
}

export default FullCard
