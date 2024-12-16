// Global DOM Components.
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col } from 'react-flexbox-grid'
import { Paper } from 'material-ui'
import { AttachMoney } from 'material-ui-icons'
import TextTruncate from 'react-text-truncate'
import renderHTML from 'react-render-html'

// Custom Components.
import PipelineStages from '../components/PipelineStages-DEPRECATED'
import CardsActions from '../components/CardsActions-DEPRECATED'
// import I18nDate from '../../global/date/I18nDate'

// Controllers.
import * as FunderController from '../../../controllers/FunderController-DEPRECATED'

// Helpers.
import { stripTags } from '../../../utils/helpers'

// Paths.
import { PROFILE_PAGE } from '../../../utils/paths'

// App Language.
import { getLanguage } from 'data/locale'

import { filter, take, find, get } from 'lodash'
import ReactGA from 'react-ga'

class ExpandedCardDEPRECATED extends Component {
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
      let formattedOpportunities = []

      for (let opportunityIndex in opportunities) {
        formattedOpportunities[opportunities[opportunityIndex].funder_id] =
          opportunities[opportunityIndex]
      }

      this.setState({ opportunities: formattedOpportunities })
    })
  }

  printItems(searchResults) {
    const { t } = getLanguage()
    const {
      page,
      pagination: { viewsPerPage }
    } = this.props
    return searchResults.map((searchResult, index) => {
      let pipelineStagesAttrs = {}

      if (typeof this.state.opportunities[searchResult.funderId] !== 'undefined') {
        pipelineStagesAttrs = {
          opportunityId: this.state.opportunities[searchResult.funderId].uuid,
          flagId: this.state.opportunities[searchResult.funderId].flag_uuid
        }
      }

      let typicalGift =
        searchResult.typicalGift === '-' ||
        get(searchResult, 'nid') === '6c97d7b6-db4a-4039-bdef-61b74a756f7a'
          ? ''
          : `${t.cards.typicalGift}: ${searchResult.typicalGift}`
      if (typicalGift !== '') {
        typicalGift = (
          <small className="Material-cards__expanded-typical-gift">
            <strong>{typicalGift}</strong>
          </small>
        )
      }
      const annualRevenue =
        searchResult.revenue === '-' || searchResult.revenue === '$0'
          ? ''
          : `Annual Revenue: ${searchResult.revenue}`

      return (
        <Paper
          key={index}
          className={`Material-cards Material-cards__expanded ${searchResult.deadlineClass}`}
          zDepth={0}
        >
          <Row>
            <Col xs={12} md={5} lg={5}>
              <h3>
                <Link
                  to={`${PROFILE_PAGE}/${searchResult.nid}`}
                  onClick={() => {
                    ReactGA.event({
                      category: 'Click on search result',
                      action: `click`,
                      label: `position: ${
                        viewsPerPage * (page ? parseInt(page) - 1 : 0) + index + 1
                      }`,
                      value: viewsPerPage * (page ? parseInt(page) - 1 : 0) + index + 1
                    })
                  }}
                >
                  {renderHTML(searchResult.label)}
                </Link>
              </h3>
              <div className="Material-cards__expanded-teaser">
                <small>
                  <TextTruncate line={2} truncateText="..." text={stripTags(searchResult.teaser)} />
                </small>
              </div>
            </Col>
            <Col xs={12} md={7} lg={7} className="Material-cards__expanded-right">
              <div className="Material-cards__expanded-actions-wrapper">
                <small className="Material-cards__expanded-typical-gift">
                  <strong>{searchResult.funderPrograms}</strong>
                </small>
                {typicalGift}
                <PipelineStages
                  index={index}
                  opportunity={this.state.opportunities[searchResult.funderId]}
                  funderId={searchResult.nid}
                  buttonClass="Material-cards__expanded-state"
                  funderName={searchResult}
                  {...pipelineStagesAttrs}
                />
                <CardsActions
                  index={index}
                  opportunity={this.state.opportunities[searchResult.funderId]}
                  funderId={searchResult.nid}
                  history={this.props.history}
                  {...pipelineStagesAttrs}
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <div className="Material-cards__expanded-notification">
                <small>
                  {searchResult.notificationIcon} {searchResult.notification}
                </small>
              </div>
              {/*{console.log(searchResult.location)}*/}
              {searchResult.location && (
                <div className="Material-cards__expanded-location">
                  <small>
                    {searchResult.locationIcon} {searchResult.location}
                  </small>
                </div>
              )}
              <div className={`Material-cards__expanded-deadline ${searchResult.deadlineClass}`}>
                <small>
                  {searchResult.deadlineIcon} {searchResult.deadline}{' '}
                  {/* <I18nDate date={searchResult.deadlineDate} format="long" /> */}
                </small>
              </div>
            </Col>
          </Row>
        </Paper>
      )
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
    return (
      <div className={'Search_tiles'}>
        {isFeatered && featuredCount > 0 ? (
          <div className={'featured'}>
            <div className={'Search_tiles--header'}>{t.search.featured}</div>
            <div className={'Search_tiles--content'}>{this.printItems(featuredItems)} </div>
          </div>
        ) : (
          <div className={'featured'} />
        )}
        {!!regularItems.length && (
          <div className={'regular'} data-featured={isFeatered}>
            {!!isFeatered && (
              <div className={'Search_tiles--header more'}>
                {isFeatered ? t.search.moreResults : t.search.results}
              </div>
            )}
            <div className={'Search_tiles--content'}>{this.printItems(regularItems)}</div>
          </div>
        )}
      </div>
    )
  }
}

export default ExpandedCardDEPRECATED
