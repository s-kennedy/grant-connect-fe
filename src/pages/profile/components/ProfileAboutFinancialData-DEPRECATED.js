// Global DOM components.
import React, { Component } from 'react'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table'

// Controllers.
import * as FunderController from '../../../controllers/FunderController-DEPRECATED'

// Helpers.
import { formatNumber, stripTags } from '../../../utils/helpers'
import _ from 'lodash'

// App Language.
import { getLanguage } from 'data/locale'

class ProfileFinancialData extends Component {
  state = {
    financialData: {},
    taxData: {},
    lastYear: null
  }

  componentDidMount() {
    const { funderInfo } = this.props
    const funderId = funderInfo.data.attributes.drupal_internal__nid
    // These IDs were agreed to be hardcoded because they are just informative
    // and the client or no one else will change it on the API.

    // Get the financial data.
    // @TODO: Discuss a better implementation of this. Right now it's
    // using taxonomy terms and the TIDs need to be hardcoded in order to work
    // properly. Discuss a better Drupal implementation for this.
    FunderController.getRelatedData('/jsonapi/taxonomy_term/charitable_activity?sort=weight').then(
      data => {
        this.setState({
          taxData: {
            ...this.state.taxData,
            data
          }
        })
      }
    )

    FunderController.getFinancialData(funderId).then(financialData => {
      this.setState({
        financialData: {
          ...this.state.financialData,
          financialData
        }
      })
    })
  }

  render() {
    const { financialData, taxData } = this.state
    const { funderInfo } = this.props
    const fiscalPeriodDay = funderInfo.data.attributes.field_fiscal_period_day
    let fiscalPeriodMonth = funderInfo.data.attributes.fiscal_period_month
    const { t } = getLanguage()
    fiscalPeriodMonth = parseInt(fiscalPeriodMonth, 0)

    let years = ''
    let tableBody = ''
    let table = ''
    if (_.has(financialData, 'financialData.data')) {
      years = _.groupBy(financialData.financialData.data, e => {
        return e.attributes.year
      })
      years = _.map(years, (key, value) => {
        return <TableRowColumn key={value}>{value}</TableRowColumn>
      })
      years = _.reverse(years)
      years.unshift(<TableRowColumn key={1}></TableRowColumn>)

      let taxonomies = _.groupBy(financialData.financialData.data, e => {
        return e.relationships.activity.data.id
      })

      let result = _.mapValues(taxonomies, (taxonomy, key) => {
        return _.sortBy(taxonomy, [
          function (o) {
            return o.year
          }
        ])
      })

      if (!_.isEmpty(financialData) && !_.isEmpty(taxData)) {
        let filter = _.filter(taxData.data.data, elem => {
          if (_.includes(_.keys(result), elem.id)) {
            return elem
          }
        })
        filter = _.map(filter, elem => {
          elem.attributes['data'] = result[elem.id]
          return elem
        })
        tableBody = _.map(filter, (value, key) => {
          let column = _.map(value.attributes.data, data => {
            let amount = data.attributes.amount
            if (value.attributes.format == 'dollar') {
              amount = formatNumber(amount)
            }
            return (
              <TableRowColumn key={data.attributes.drupal_internal__fid}>{amount}</TableRowColumn>
            )
          })
          return (
            <TableRow key={key}>
              <TableRowColumn component="th" scope="row" className="data-name">
                <strong>{value.attributes.name}</strong>
              </TableRowColumn>
              {column}
            </TableRow>
          )
        })
        if (!_.isEmpty(tableBody)) {
          table = (
            <Table selectable={false} bodyStyle={{ overflow: 'visible' }} fixedHeader={true}>
              {!_.isEmpty(tableBody) && (
                <TableBody displayRowCheckbox={false}>
                  {!_.isEmpty(years) && <TableRow>{years}</TableRow>}
                  {tableBody}
                </TableBody>
              )}
            </Table>
          )
        }
      }
    }
    return (
      <div>
        {!_.isEmpty(table) && (
          <div className="profile-financial-data-wraper">
            <div>
              <h4>{t.funder.financialData}</h4>
              {funderInfo.data.attributes.financial_commentary !== null && (
                <small className="profile-financial-data-teaser">
                  {stripTags(funderInfo.data.attributes.financial_commentary.value)}
                </small>
              )}
              {table}
              {parseInt(fiscalPeriodMonth) > 0 && parseInt(fiscalPeriodMonth) < 13 && (
                <span>
                  <strong>{`${t.funder.fiscalPeriod}: `}</strong>
                  {/* {`${getMonthNames()[fiscalPeriodMonth - 1]} ${
                    fiscalPeriodDay !== null ? fiscalPeriodDay : ''
                  }`} */}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default ProfileFinancialData
