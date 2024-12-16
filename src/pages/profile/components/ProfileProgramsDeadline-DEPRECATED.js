// Global DOM components.
import React, { Component } from 'react'
import TextTruncate from 'react-text-truncate'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { AlarmOn, AlarmOff } from 'material-ui-icons'
// import I18nDate from '../../../components/global/date/I18nDate'
// Helpers.
// import { stripTags, getMonthNames } from '../../../utils/helpers'
import _ from 'lodash'

// Controllers.
import * as FunderController from '../../../controllers/FunderController-DEPRECATED'

// App Language.
import { getLanguage } from 'data/locale'

class ProfileProgramsDeadline extends Component {
  state = {
    funderDeadlines: {},
    textExpanded: {}
  }

  componentWillMount() {
    const { language, t } = getLanguage()
    const { funderInfo } = this.props

    if (_.has(funderInfo, 'data.attributes.program')) {
      // Getting the region info.
      let funderDeadlines = funderInfo.data.attributes.program

      _.map(funderDeadlines, (program, key) => {
        let categoryApiUrl = program.relationships.deadline.links.related.href
        categoryApiUrl += '&include=condition'
        FunderController.getRelatedData(categoryApiUrl).then(deadline => {
          _.map(deadline.data, (info, iteration) => {
            if (_.has(info, 'relationships.condition.data.id')) {
              info.attributes.condition = `(${
                _.find(deadline.included, { id: info.relationships.condition.data.id }).attributes
                  .name
              })`
            } else {
              info.attributes.condition = ''
            }
          })
          funderDeadlines[key].deadlineFullInfo = deadline
          deadline.data = _.map(deadline.data, (info, keyDead) => {
            if (
              _.has(info, 'attributes.deadline_date') &&
              !_.isEmpty(info.attributes.deadline_date)
            ) {
              let deadlineIcon = <AlarmOn />
              let deadlineText = ''

              let colorClass = ''
              const dd = new Date(info.attributes.deadline_date + ' 23:59')
              const diffWeeks = Math.round((dd.getTime() - new Date().getTime()) / 604800000)
              if (
                _.has(program, 'attributes.ongoing') &&
                program.attributes.ongoing !== null &&
                program.attributes.ongoing !== false &&
                parseInt(info.attributes.ongoing, 0) !== 0
              ) {
                colorClass = 'green'
                deadlineText = 'Ongoing'
              } else {
                deadlineText = `${info.attributes.deadline_name} ${info.attributes.condition}: `
                if (diffWeeks >= 0 && diffWeeks <= 6) {
                  colorClass = 'red'
                } else if (diffWeeks > 6 && diffWeeks <= 12) {
                  colorClass = 'yellow'
                } else if (diffWeeks > 12) {
                  colorClass = 'green'
                } else if (diffWeeks < 0) {
                  colorClass = 'gray'
                  deadlineText =
                    language === 'fn'
                      ? `${info.attributes.deadline_name} ${info.attributes.condition} (${t.funder.passed}) : `
                      : `${info.attributes.deadline_name} ${info.attributes.condition} (${t.funder.passed}): `
                  deadlineIcon = <AlarmOff />
                }
              }
              info.fullDeadline = (
                <div className={`Full-card__deadline ${colorClass}`} key={keyDead}>
                  {deadlineIcon}
                  <small>{/* {deadlineText} <I18nDate date={dd} format="full" /> */}</small>
                </div>
              )
              return info
            } else {
              if (deadline.data.length) {
                FunderController.getRelatedData(info.relationships.condition.links.related).then(
                  deadline => {
                    if (
                      _.has(deadline, 'data.attributes.name') &&
                      deadline.data.attributes.name == 'Ongoing'
                    ) {
                      let deadlineIcon = <AlarmOn />
                      let deadlineText = `${info.attributes.deadline_name}: ${t.funder.ongoing}`
                      let colorClass = 'green'
                      info.fullDeadline = (
                        <div className={`Full-card__deadline ${colorClass}`} key={keyDead}>
                          {deadlineIcon}
                          <small>{deadlineText}</small>
                        </div>
                      )
                      funderDeadlines[key].deadlineFullInfo.data[keyDead] = info

                      this.setState({ funderDeadlines })
                    }
                  }
                )
              }
            }
          })

          // // Updating the values.
          // deadlineIcon = <AlarmOn />
          // deadlineText = `${t.funder.deadlineFor}: ${niceDeadLineDate}`
          // deadlineTextShort = `${monthNames[deadlineDate.getMonth()].substring(0, 3)}. ${deadlineDate.getDate()}`

          /*
           * Color: It is also denoted using color, both in the text of the date
           * and with a colored border on the left side of the card.
           * Each color represents a state of priority:
           *
           * Red: denotes a program deadline approaching in 2-6 weeks
           * Yellow: a program deadline approaching in 2-3 months
           * Green: a program deadline approaching in greater than 3 months /
           * denotes a funder whose deadline is set to “ongoing”
           * Grey: no specific program deadline.
           */

          this.setState({ funderDeadlines })
        })
        FunderController.getRelatedData(program.relationships.program_contact.links.related).then(
          contact => {
            if (!_.isEmpty(contact.data)) {
              const contacts = _.map(contact.data, (el, key) => {
                if (!_.isEmpty(el.attributes.name)) {
                  return (
                    <div key={key}>
                      <h4>{t.funder.programContact}</h4>
                      <div dangerouslySetInnerHTML={{ __html: el.attributes.name.value }}></div>
                    </div>
                  )
                }
              })
              funderDeadlines[key].attributes.programContact = contacts
            } else {
              funderDeadlines[key].attributes.programContact = ''
            }
            this.setState({ funderDeadlines })
          }
        )
      })
      this.setState({ funderDeadlines })
    }
  }

  toggleText = programId => {
    this.setState({
      ...this.state.textExpanded,
      textExpanded: {
        ...this.state.textExpanded[programId],
        [programId]:
          typeof this.state.textExpanded[programId] === 'undefined' ||
          this.state.textExpanded[programId] === false
            ? true
            : false
      }
    })
  }

  render() {
    const { funderDeadlines, textExpanded } = this.state
    const { t } = getLanguage()

    const tabsList = _.map(funderDeadlines, (elem, i) => {
      return <Tab key={i}>{elem.attributes.title}</Tab>
    })

    const tabPanel = _.map(funderDeadlines, (elem, i) => {
      let deadline = ''
      if (_.has(elem, 'deadlineFullInfo.data') && !_.isEmpty(elem.deadlineFullInfo.data)) {
        deadline = _.map(elem.deadlineFullInfo.data, el => {
          if (!_.isEmpty(el)) {
            return el.fullDeadline
          }
        })
      }
      let grant_range = ''
      let granting_region_description = ''
      let description = ''
      if (!_.isEmpty(elem.attributes.grant_range)) {
        grant_range = (
          <div>
            <h4>{t.funder.grantRange}</h4>
            <div dangerouslySetInnerHTML={{ __html: elem.attributes.grant_range.value }}></div>
          </div>
        )
      }
      if (!_.isEmpty(elem.attributes.granting_region_description)) {
        granting_region_description = (
          <div>
            <h4>{t.funder.geographicEligibility}</h4>
            <div
              dangerouslySetInnerHTML={{
                __html: elem.attributes.granting_region_description.value
              }}
            ></div>
          </div>
        )
      }
      if (!_.isEmpty(elem.attributes.field_description)) {
        description = (
          <div dangerouslySetInnerHTML={{ __html: elem.attributes.field_description.value }}></div>
        )
      }
      return (
        <TabPanel key={i}>
          {description}
          <div className="extra_contact">
            {grant_range}
            {granting_region_description}
            {elem.attributes.programContact}
          </div>
          {deadline}
        </TabPanel>
      )
    })
    return (
      <div>
        {!_.isEmpty(tabsList) && !_.isEmpty(tabPanel) && (
          <Tabs className="row vertical-tabs" defaultIndex={0}>
            <TabList className="col-xs-12 col-sm-12 col-md-4">{tabsList}</TabList>
            <div className="col-xs-12 col-sm-12 col-md-8">{tabPanel}</div>
          </Tabs>
        )}
      </div>
    )
  }
}

export default ProfileProgramsDeadline
