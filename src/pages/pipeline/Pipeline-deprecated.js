// Global DOM components.
import React, { Component } from 'react'
import { Col, Row } from 'react-flexbox-grid'
import { CircularProgress } from 'material-ui'

// Custom DOM components.
import Column from './components/Column-DEPRECATED'
import PipelineTable from './components/PipelineTable-DEPRECATED'
import PipelineFilters from './components/PipelineFilters-DEPRECATED'
import SearchPageViewChanger from '../search/components/SearchPageViewChanger'
import * as FunderController from '../../controllers/FunderController-DEPRECATED'

// Controllers.
import * as PipelineController from '../../controllers/PipelineController-DEPRECATED'
import ReactGA from 'react-ga'
import _ from 'lodash'

// App Language.
import { getLanguage } from 'data/locale'
// import PaginationControlled from 'components/Pagination/PaginationControlled'

const hasViewStorage = typeof localStorage.pipelineView !== 'undefined'

if (!hasViewStorage) {
  localStorage.setItem('pipelineView', 'expanded')
}

class Pipeline extends Component {
  state = {
    pipelineData: [],
    pipelineFilters: {},
    pageNumber: 0,
    viewsPerPage: 10,
    showRefreshIndicator: true,
    pipelineArchived: {},
    showArchived: false,
    pipelineView: localStorage.pipelineView,
    expandedActive: localStorage.pipelineView === 'expanded' ? 'active' : '',
    collapsedActive: localStorage.pipelineView === 'collapsed' ? 'active' : '',
    hideStage: false
  }

  componentDidMount() {
    FunderController.getAllStages().then(pipelineStages => {
      let stagesIds = []
      pipelineStages.data = _.sortBy(pipelineStages.data, elem => {
        return elem.attributes.weight
      })
      _.each(pipelineStages.data, elem => {
        stagesIds[elem.attributes.name] = elem.id
      })
      localStorage.setItem('pipelineStages', JSON.stringify(pipelineStages))
      this.setState({ pipelineStages: stagesIds })
    })

    this.getPipelineData(false)
  }

  getPipelineData = (applyFilters, filterName = '', filters = {}) => {
    if (filterName === 'hide') {
      PipelineController.getPipelineHideData().then(pipelineData => {
        this.setState({ pipelineData, showRefreshIndicator: false })
      })
    } else {
      PipelineController.getPipelineData().then(pipelineData => {
        this.setState({ pipelineData, showRefreshIndicator: false })
        if (this.state.pipelineView === 'collapsed') {
          PipelineController.getPipelineDataArchived().then(pipelineDataArchived => {
            let initPipeline = []
            let exportArr = []
            _.filter(pipelineDataArchived, oportunity => {
              if (!_.filter(exportArr, { funder_nid: oportunity.funder_nid }).length) {
                exportArr.push(oportunity)
              }
            })
            _.each(pipelineData, opportunities => {
              _.each(JSON.parse(opportunities.opportunities), elem => {
                initPipeline.push(elem)
              })
            })
            exportArr = _.filter(exportArr, founder => {
              const find = _.find(initPipeline, { funder_nid: founder.funder_nid })
              return _.isEmpty(find)
            })
            this.setState({ pipelineArchived: exportArr })
          })
        }
      })
    }
  }

  handleCardsView = (e, pipelineView, pipelineHide) => {
    // Update the state to show the view according to user selection.
    this.setState({
      pipelineView,
      [`${pipelineView}Active`]: 'active',
      [`${pipelineHide}Active`]: ''
    })

    // Store the selction for when the user comes back to the page.
    localStorage.setItem('pipelineView', pipelineView)
    this.setState({ showRefreshIndicator: true })
    this.getPipelineData(false)
  }

  applyFilters = (filterValue, filterName) => {
    this.setState({ showArchived: false })
    const { pipelineData } = this.state
    let pipelineDataFiltered = []

    if (filterName === 'stage') {
      this.setState({
        pipelineFilters: {
          ...this.state.pipelineFilters,
          stage: filterValue
        }
      })
    } else {
      for (let pipelineIndex in pipelineData) {
        const pipelineStage = pipelineData[pipelineIndex]
        let opportunities = JSON.parse(pipelineStage.opportunities)
        opportunities = opportunities.filter(opportunity => {
          return opportunity.flag === filterValue
        })

        if (opportunities.length) {
          pipelineDataFiltered.push(pipelineStage)
        }
      }

      this.setState({
        pipelineFilters: {
          ...this.state.pipelineFilters,
          flag: filterValue
        },
        pipelineData: pipelineDataFiltered
      })
    }
  }

  resetFilters = filterName => {
    const { pipelineFilters } = this.state
    let newPipelineFilters = {}

    if (typeof filterName !== 'undefined') {
      if (filterName === 'stage' && typeof pipelineFilters.flag !== 'undefined') {
        newPipelineFilters = { flag: pipelineFilters.flag }
      }

      if (filterName === 'flag' && typeof pipelineFilters.stage !== 'undefined') {
        newPipelineFilters = { stage: pipelineFilters.stage }
      }
    }

    this.setState({
      showRefreshIndicator: true,
      pipelineFilters: newPipelineFilters,
      hideStage: false
    })

    const filterToApply = filterName === 'stage' ? 'flag' : 'stage'

    this.getPipelineData(true, filterToApply, newPipelineFilters)
  }

  showHide = () => {
    const { hideStage } = this.state

    if (hideStage === 'displayHidden') {
      this.setState({ showRefreshIndicator: true, hideStage: false })
      this.getPipelineData(false)
    } else {
      this.setState({ showRefreshIndicator: true, hideStage: 'displayHidden' })
      this.getPipelineData(true, 'hide')
    }
  }
  showArchived = () => {
    this.setState({ pipelineFilters: {} })
    this.setState({ showArchived: !this.state.showArchived })
  }

  handleSearchPaginationChange = (e, index, value) => {
    this.setState({ viewsPerPage: value })
  }

  handlePagerClick = pageNumber => {
    this.setState({ pageNumber: pageNumber - 1 })
  }

  render() {
    const {
      pipelineData,
      pipelineFilters,
      pipelineView,
      expandedActive,
      collapsedActive,
      showRefreshIndicator,
      pageNumber,
      viewsPerPage,
      hideStage,
      pipelineStages,
      pipelineArchived,
      showArchived
    } = this.state
    const { t } = getLanguage()
    let pipelineFlags = []
    let pipelineOpportinities = []
    let pipelineStageLengh = 0
    ReactGA.pageview(window.location.pathname + window.location.search + `?view=${pipelineView}`)
    if (showRefreshIndicator) {
      return (
        <div className="refresh-container">
          <CircularProgress size={60} thickness={5} color="#4c9eff" />
        </div>
      )
    }

    for (let pipelineIndex in pipelineData) {
      const pipelineStage = pipelineData[pipelineIndex]
      const opportunities = JSON.parse(pipelineStage.opportunities)

      // Get the lenght for every stage.
      pipelineStageLengh = opportunities.length

      for (let opportunityIndex in opportunities) {
        let pipelineOpportinity = opportunities[opportunityIndex]

        if (typeof pipelineOpportinity.funder !== 'undefined') {
          if (pipelineOpportinity.flag.trim() !== '') {
            pipelineFlags.push({ value: pipelineOpportinity.flag })
          }

          pipelineOpportinity['stage'] = pipelineStage.name
          pipelineOpportinities.push(pipelineOpportinity)
        }
      }
    }
    let pipelineOpportinitiesFiltered = pipelineOpportinities
    if (showArchived && pipelineView === 'collapsed' && !hideStage) {
      pipelineOpportinitiesFiltered = pipelineArchived
    }
    const saveAllItems = pipelineOpportinities
    if (_.has(pipelineFilters, 'stage')) {
      pipelineOpportinitiesFiltered = _.filter(pipelineOpportinities, {
        stage: pipelineFilters.stage
      })
      // Checking the views per page.
    }
    let totalCards = 0
    if (pipelineView === 'collapsed') {
      totalCards = pipelineOpportinitiesFiltered.length
    } else {
      for (let pipelineDataIndex in pipelineData) {
        opportunityLength = JSON.parse(pipelineData[pipelineDataIndex].opportunities).length

        if (typeof opportunityLength !== 'undefined') {
          totalCards += opportunityLength
        }
      }
    }
    if (_.has(pipelineFilters, 'stage')) {
      pipelineOpportinitiesFiltered = pipelineOpportinitiesFiltered.slice(
        pageNumber * viewsPerPage,
        pageNumber * viewsPerPage + viewsPerPage
      )
      if (pageNumber > 0 && !pipelineOpportinitiesFiltered.length) {
        this.setState({ pageNumber: 0 })
      }
    } else {
      pipelineOpportinities = pipelineOpportinities.slice(
        pageNumber * viewsPerPage,
        pageNumber * viewsPerPage + viewsPerPage
      )
    }

    // Checking the views per page.

    // Array unique.
    pipelineFlags = pipelineFlags
      .map(item => item.value)
      .filter((value, index, self) => self.indexOf(value) === index)

    // Calculating the amount of cards.

    let opportunityLength

    const columnSize = pipelineView === 'expanded' ? 12 : 9

    return (
      <div className={`Pipeline_container ${pipelineView}`}>
        {pipelineOpportinities.length === 0 && (
          <div className="profile-special-notes">
            <div className="profile-special-notes-note">
              There's nothing in your Pipeline. Get started by searching for funders.
            </div>
          </div>
        )}
        <Row className="Pipeline__container">
          {pipelineView === 'collapsed' && (
            <Col xs={12} md={3}>
              <PipelineFilters
                pipelineArchived={pipelineArchived}
                pipelineStages={pipelineStages}
                pipelineFlags={pipelineFlags}
                pipelineFilters={pipelineFilters}
                applyFilters={this.applyFilters}
                resetFilters={this.resetFilters}
                showHide={this.showHide}
                showArchived={this.showArchived}
                showArchivedState={this.state.showArchived}
                hideStage={hideStage}
                allItems={saveAllItems}
              />
            </Col>
          )}
          <Col md={columnSize}>
            <Row>
              <h3>{t.pipeline.pipeline}</h3>
              <p>{`${!isNaN(totalCards) ? totalCards : 0} ${t.pipeline.prospectiveFunders}`}</p>
              <SearchPageViewChanger
                onClick={this.handleCardsView}
                expandedActive={expandedActive}
                collapsedActive={collapsedActive}
                download={true}
              />
            </Row>
            <Row className="Pipeline">
              {pipelineView === 'expanded' &&
                pipelineData.map((pipelineItem, index) => {
                  const opportunities = JSON.parse(pipelineItem.opportunities)

                  return (
                    <div className="Pipeline__wrapper" key={pipelineItem.tid}>
                      <Column
                        pipelineStages={pipelineStages}
                        columnName={pipelineItem.name}
                        pipelineItems={opportunities}
                        pipelineData={pipelineData}
                        history={this.props.history}
                        isLast={index + 1 === pipelineData.length ? true : false}
                      />
                    </div>
                  )
                })}
              {pipelineView === 'collapsed' && (
                <div>
                  <PipelineTable
                    opportunities={pipelineOpportinitiesFiltered}
                    history={this.props.history}
                  />
                  {/* <PaginationControlled */}
                  {/*   viewsPerPage={this.state.viewsPerPage} */}
                  {/*   pagerInfo={{ */}
                  {/*     current_page: this.state.pageNumber, */}
                  {/*     items_per_page: this.state.viewsPerPage, */}
                  {/*     count: totalCards, */}
                  {/*     pages: Math.ceil(totalCards / this.state.viewsPerPage) */}
                  {/*   }} */}
                  {/*   pageNumber={this.state.pageNumber + 1} */}
                  {/*   pagerSize={5} */}
                  {/*   handleSearchPaginationChange={this.handleSearchPaginationChange} */}
                  {/*   handlePagerClick={this.handlePagerClick} */}
                  {/* /> */}
                </div>
              )}
            </Row>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Pipeline
