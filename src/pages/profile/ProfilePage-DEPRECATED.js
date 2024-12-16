// Global DOM components.
import React, { Component } from 'react'
import { Col, Row } from 'react-flexbox-grid'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { Chip, IconButton } from 'material-ui'

import { Info } from 'material-ui-icons'

// Custom DOM components.
import FullCard from '../../components/cards/full/FullCard-DEPRECATED'
import ProfilePrograms from './components/ProfilePrograms-DEPRECATED'
import ProfileProgramsDeadline from './components/ProfileProgramsDeadline-DEPRECATED'
import ProfileAbout from './components/ProfileAbout-DEPRECATED'
import ProfileLinkedIn from './components/ProfileLinkedIn-DEPRECATED'
import ProfileAboutFinancialData from './components/ProfileAboutFinancialData-DEPRECATED'
import ProfileAboutPositions from './components/ProfileAboutPositions-DEPRECATED'
import ProfileGiftAnalysis from './components/ProfileGiftAnalysis-DEPRECATED'
import ProfileGiftAnalysisCause from './components/ProfileGiftAnalysisCause-DEPRECAT'
import ProfileGiftAnalysisRegion from './components/ProfileGiftAnalysisRegion-DEPRECATED'
import ProfileGiftAnalysisInterest from './components/ProfileGiftAnalysisInterest-DEPRECATED'
// Controllers.
import * as FunderController from '../../controllers/FunderController-DEPRECATED'

// Paths.
import { SEARCH_PAGE } from '../../utils/paths'

import ReactGA from 'react-ga'

// Helpers.
// import { getMonthNames } from '../../utils/helpers'
import _ from 'lodash'

// App Language.
import { getLanguage } from 'data/locale'
import ReportProfileError from './components/ReportProfileError'

class ProfilePage extends Component {
  state = {
    showRefreshIndicator: true,
    funderUuid: null,
    funderInfo: {},
    funderRelatedCategory: '',
    funderRelatedIndustry: '',
    geographic_scope: '',
    funderRelatedTags: [],
    funderOpportunity: {},
    cardNotes: { data: { items: [], itemsToDisplay: [] } },
    showNotGrantMakingNote: false,
    showPrograms: true,
    showGifts: true,
    funderStatus: '',
    showMore: false,
    showMoreDisable: false
  }

  componentDidMount() {
    const uuid = this.props.match.params.profileId
    this.setState({ funderUuid: uuid })
    this.getFunderInfoByUuid(uuid)
  }

  componentDidUpdate() {
    const { funderUuid, funderRelatedTags, showMoreDisable } = this.state
    const uuid = this.props.match.params.profileId

    if (funderUuid !== null && uuid !== funderUuid) {
      this.setState({ showRefreshIndicator: true, funderUuid: uuid })
      this.getFunderInfoByUuid(uuid)
    }

    if (!_.isEmpty(document.querySelector('.profile-tags-list'))) {
      if (document.querySelector('.profile-tags-list').offsetHeight > 100 && !showMoreDisable) {
        let last = _.findLast(funderRelatedTags, function (elem) {
          return elem['show'] != false
        })
        last['show'] = false
        last = [...funderRelatedTags, ...last]
        this.setState({ funderRelatedTags: last })
        this.setState({ showMore: true })
      }
    }
  }
  showMoreDisable = () => {
    this.setState({ showMoreDisable: true })
  }
  getFunderInfoByUuid = uuid => {
    FunderController.getFunderInfoByUuid(uuid).then(funderInfo => {
      if (_.has(funderInfo.data, 'relationships')) {
        _.each(funderInfo.data.relationships, (elem, i) => {
          if (_.has(elem, 'data.id')) {
            funderInfo.data.attributes[i] = _.find(funderInfo.included, { id: elem.data.id })
          } else {
            _.each(elem.data, iterator => {
              if (!_.has(funderInfo.data.attributes, i)) {
                funderInfo.data.attributes[i] = []
              }

              let find = _.find(funderInfo.included, { id: iterator.id })
              if (!_.isEmpty(find)) {
                funderInfo.data.attributes[i].push(find)
              }
            })
          }
        })
      }
      const funderRelation = funderInfo.data.relationships
      // Getting the related category.
      if (funderRelation.category.data !== null) {
        // Set industry.

        let composeCategory = _.map(funderInfo.data.attributes.industry, category => {
          return category.attributes.name
        })
        this.setState({ funderRelatedCategory: composeCategory.join(', ') })

        const funderNid = funderInfo.data.attributes.drupal_internal__nid
        if (funderInfo.data.attributes.open_requests === 'unknown') {
          this.setState({ showPrograms: false })
        }

        // cardNotes: { data: { items: [], itemsToDisplay: [] } },
        FunderController.getOpportunity(funderNid).then(funderOpportunity => {
          const nID =
            !!funderOpportunity && funderOpportunity.length > 0 ? funderOpportunity[0].uuid : ''
          if (_.has(funderOpportunity[0], 'uuid')) {
            const oppID = funderOpportunity[0].uuid

            // if (funderOpportunity[0].pipeline_stage == "") {
            //   funderOpportunity = {};
            //   funderOpportunity.content = "[]";
            //   funderOpportunity.nid = nID;
            //   funderOpportunity.uuid = oppID;
            // }
          }
          this.setState({ funderOpportunity })
          // if (typeof funderOpportunity.content === "undefined") {
          if (nID !== '') {
            // Get the notes from this opportunity.
            FunderController.getFunderNotes(nID).then(notes => {
              if (notes.data.length !== 0) {
                const formattedNoted = FunderController.formatNotes(notes)
                this.setState({ cardNotes: formattedNoted })
              } else {
              }
            })
          }
        })

        if (_.has(funderInfo, 'data.attributes.field_status')) {
          const status = funderInfo.data.attributes.field_status
          if (_.has(status.attributes, 'name')) {
            if (status.attributes.name == 'Dissolved') {
              this.setState({
                funderStatus: status.attributes.name,
                showGifts: false,
                showPrograms: false
              })
            } else {
              this.setState({ funderStatus: status.attributes.name })
              FunderController.getGiftData(funderNid, 0, 10, 'year', 'DESC').then(giftData => {
                if (giftData.included === undefined) {
                  this.setState({ showGifts: false })
                }
              })
            }
          }
        }
      }
      if (_.has(funderInfo, 'data.relationships.geographic_scope.links.related')) {
        FunderController.getRelatedData(
          funderInfo.data.relationships.geographic_scope.links.related
        ).then(geographic_scope => {
          if (_.has(geographic_scope, 'data.attributes.name')) {
            this.setState({ geographic_scope: geographic_scope.data.attributes.name })
          }
        })
      }
      // Getting the related activities.
      if (funderRelation.activity.data.length) {
        const activities = funderInfo.data.attributes.activity
        let grantCount = 0
        if (activities.length) {
          activities.map(activity => {
            if (
              activity.attributes.name === 'Grantmaking' ||
              activity.attributes.name === 'Octroi de subventions'
            ) {
              grantCount++
            }
            return grantCount
          })
        }

        grantCount === 0 && this.setState({ showNotGrantMakingNote: true })
      }

      // Remove the refresh indicator.
      this.setState({ funderInfo, showRefreshIndicator: false })
      if (_.has(funderInfo, 'data.attributes')) {
        ReactGA.pageview(
          window.location.pathname +
            window.location.search +
            '?profile=' +
            encodeURIComponent(funderInfo.data.attributes.title),
          [],
          `Profile: ${funderInfo.data.attributes.title}`
        )
      }
      const tagsList = [
        'cause',
        'population',
        'new_region',
        'international',
        'activity',
        'geographic_scope'
      ]

      let requestData = _.map(funderInfo.data.relationships, function (item, key) {
        if (tagsList.indexOf(key) >= 0 && !_.isEmpty(item.data)) {
          item['category'] = key
          return item
        } else {
          return false
        }
      })
      requestData = _.filter(requestData, item => !!item)
      _.each(requestData, itemEach => {
        const category = _.map(funderInfo.data.attributes[itemEach.category], item => {
          if (typeof item === 'object' && _.has(item, 'attributes')) {
            item.attributes['category'] = itemEach.category
            return item.attributes
          }
        })
        if (!_.isEmpty(category)) {
          let state = _.concat(this.state.funderRelatedTags, category)
          state = _.sortBy(state, ['name'])
          state = _.filter(state, elem => {
            if (!_.isEmpty(elem)) {
              return elem
            }
          })
          this.setState({ funderRelatedTags: state })
        }
      })
    })
  }

  render() {
    const {
      funderInfo,
      cardNotes,
      showRefreshIndicator,
      showPrograms,
      showGifts,
      geographic_scope,
      funderStatus,
      showMore,
      showMoreDisable
    } = this.state

    const { language, t } = getLanguage()
    let formattedLastUpdated = ''
    let chips = ''
    let programCount = 0
    if (!_.isEmpty(this.state.funderRelatedTags) && funderStatus != 'Dissolved') {
      chips = _.map(this.state.funderRelatedTags, (elem, i) => {
        if (!_.isEmpty(elem) && (elem['show'] != false || showMoreDisable)) {
          return (
            <Chip
              key={i}
              onClick={() => {
                this.props.history.push(
                  `${SEARCH_PAGE}?${elem.category}=${elem.drupal_internal__tid}`
                )
              }}
            >
              {elem.name}
            </Chip>
          )
        }
      })
      if (!_.isEmpty(geographic_scope)) {
        const geographic = <Chip key={9999}>{geographic_scope}</Chip>
        chips.push(geographic)
      }
      let showMoreItems = ''
      if (showMore && !showMoreDisable) {
        showMoreItems = <a onClick={this.showMoreDisable}>Show more</a>
      }

      chips = (
        <div className="profile-tags-list">
          {chips}
          <IconButton
            tooltip={
              <div>
                {' '}
                {t.funder.toolTip} <p> {t.funder.toolTipDescription} </p>
              </div>
            }
            style={{
              position: 'absolute',
              right: '-60px',
              top: '-10px'
            }}
            tooltipPosition="top-left"
            className="profile-tags-list-info"
          >
            <Info aria-label="Info" />
          </IconButton>
          {showMoreItems}
        </div>
      )
    }
    if (typeof funderInfo.data !== 'undefined') {
      // const monthNames = getMonthNames()
      const lastUpdated = new Date(funderInfo.data.attributes.changed.split('T'))
      formattedLastUpdated =
        language === 'fr'
          ? `${lastUpdated.getDate()} ${monthNames[lastUpdated.getMonth()]}
         ${lastUpdated.getFullYear()}`
          : `${monthNames[lastUpdated.getMonth()]}
        ${lastUpdated.getDate()}, ${lastUpdated.getFullYear()}`
    }

    if (_.has(funderInfo, 'data.attributes')) {
      programCount = funderInfo.data.attributes.program_count
      return (
        <div>
          <Row>
            <ReportProfileError />
          </Row>
          <Row>
            <FullCard
              funderInfo={funderInfo}
              showRefreshIndicator={showRefreshIndicator}
              category={this.state.funderRelatedCategory}
              industry={this.state.funderRelatedIndustry}
              opportunity={this.state.funderOpportunity}
              cardNotes={cardNotes}
              history={this.props.history}
              funderStatus={funderStatus}
            />
          </Row>
          {typeof funderInfo.data !== 'undefined' && (
            <div className="profile-page-content-wrapper">
              {funderInfo.data.attributes.special_note !== null && (
                <div className="profile-special-notes">
                  <div
                    className="profile-special-notes-note"
                    dangerouslySetInnerHTML={{
                      __html: funderInfo.data.attributes.special_note.value
                    }}
                  />
                </div>
              )}
              {chips}
              {this.state.showNotGrantMakingNote === true && (
                <div className="profile-grantmaking-notes">
                  <div className="profile-grantmaking-notes-note">
                    {t.funder.organizationNotEngaged}
                  </div>
                </div>
              )}
              <div className="profile-last-updated">{`${t.funder.profileUpdated}: ${formattedLastUpdated}`}</div>
              <Tabs
                defaultIndex={2}
                onSelect={tabIndex => {
                  let tabs = []
                  if (showGifts && funderStatus !== 'Dissolved') {
                    tabs.push(t.funder.giftAnalysis)
                  }
                  if (showPrograms && funderStatus !== 'Dissolved') {
                    tabs.push(t.funder.programs)
                  }
                  tabs.push(t.funder.about)

                  ReactGA.pageview(
                    window.location.pathname +
                      window.location.search +
                      '?profile=' +
                      encodeURIComponent(funderInfo.data.attributes.title) +
                      '?tab=' +
                      encodeURIComponent(tabs[tabIndex]),
                    [],
                    `Profile: ${funderInfo.data.attributes.title}`
                  )
                }}
              >
                <TabList>
                  {showGifts && <Tab>{t.funder.giftAnalysis}</Tab>}
                  {showPrograms && programCount > 0 && <Tab>{t.funder.programs}</Tab>}
                  <Tab>{t.funder.about}</Tab>
                </TabList>
                {showGifts && (
                  <TabPanel className="row">
                    <Col xl={3} lg={3} md={12} sm={12} xs={12}>
                      <div className="profile-page-charts-container">
                        <ProfileGiftAnalysisCause
                          nid={funderInfo.data.attributes.drupal_internal__nid}
                        />
                        <ProfileGiftAnalysisRegion
                          nid={funderInfo.data.attributes.drupal_internal__nid}
                        />
                      </div>
                    </Col>
                    <Col xl={9} lg={9} md={12} sm={12} xs={12}>
                      <ProfileGiftAnalysis funderInfo={funderInfo} />
                      {/* <ProfileGiftAnalysisInterest /> */}
                    </Col>
                  </TabPanel>
                )}
                {showPrograms && programCount > 0 && (
                  <TabPanel className="row profile-programs">
                    <Col xs={12} sm={12} md={7}>
                      <ProfileProgramsDeadline funderInfo={funderInfo} />
                    </Col>
                    <Col xs={12} sm={12} md={5}>
                      <ProfilePrograms funderInfo={funderInfo} />
                    </Col>
                  </TabPanel>
                )}
                <TabPanel className="row">
                  <Col xs={12} sm={12} md={12} lg={5}>
                    <ProfileAbout funderInfo={funderInfo} funderStatus={funderStatus} />
                    <ProfileAboutPositions funderInfo={funderInfo} />
                  </Col>
                  {funderStatus != 'Dissolved' && (
                    <Col xs={12} sm={12} md={12} lg={7}>
                      <ProfileAboutFinancialData funderInfo={funderInfo} />
                      <ProfileLinkedIn funderInfo={funderInfo} funderStatus={funderStatus} />
                    </Col>
                  )}
                </TabPanel>
              </Tabs>
            </div>
          )}
        </div>
      )
    } else {
      return <div />
    }
  }
}

export default ProfilePage
