import React from 'react'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'
import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table'

import { formatNumber, stripTags } from 'utils/helpers'
import { getFiscalPeriodDate } from 'utils/dates'

const FinancialView = ({
  funderFinancialHistories,
  financialCommentary,
  fiscalPeriodEnd,
  showAllActivities
}) => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)

  const NON_FORMATED_ACTIVITIES = [t.activities.numGifts]

  const fiscalPeriodDate = getFiscalPeriodDate(fiscalPeriodEnd)

  if (
    !fiscalPeriodEnd &&
    !financialCommentary &&
    (!Array.isArray(funderFinancialHistories) || !funderFinancialHistories.length)
  ) {
    return null
  }

  const FinancialTable = () => {
    if (!Array.isArray(funderFinancialHistories) || !funderFinancialHistories.length) {
      return null
    }

    // Extraction of the last three years from financial data
    const years = _(funderFinancialHistories)
      .groupBy('year')
      .map((key, val) => Number(val))
      .reverse()
      .value()

    // First we group data by the financial activity name (alphabetically)
    // Then we categorize each activities histories by year and calculate the sum of each year
    const activityAmountsByYear = _(funderFinancialHistories)
      .groupBy('financialActivity.name')
      .toPairs()
      .filter(
        ([_, activities]) =>
          showAllActivities || activities.some(activity => activity.financialActivityAmount !== 0)
      )
      .orderBy(0)
      .fromPairs()
      .mapValues(activities => {
        return _(activities)
          .filter(
            activity =>
              years.includes(activity.year) &&
              activity.financialActivityAmount !== null &&
              activity.financialActivityAmount !== undefined
          )
          .groupBy('year')
          .mapValues(year => {
            return _(year).reduce((sum, history) => {
              return sum + history.financialActivityAmount
            }, 0)
          })
          .value()
      })
      .value()

    // Generation of the years header row
    let evenColumn = false
    const yearsRow = [
      <TableRowColumn key={0} className="data-name">
        <strong>{t.global.year}</strong>
      </TableRowColumn>,
      ...years.map(year => {
        evenColumn = !evenColumn
        return (
          <TableRowColumn key={year} className={evenColumn ? 'even-column' : 'odd-column'}>
            {year}
          </TableRowColumn>
        )
      })
    ]

    // Generation of the amount columns according to previously extracted years
    const tableBody = [
      ..._.map(activityAmountsByYear, (amounts, activityName) => {
        if (_.isEmpty(amounts)) return null

        evenColumn = false
        const columns = years.map(year => {
          evenColumn = !evenColumn
          let formattedAmount = null
          const amount = amounts[year] !== null && amounts[year] !== undefined ? amounts[year] : ''
          if (amount || amount === 0) {
            formattedAmount = NON_FORMATED_ACTIVITIES.includes(activityName)
              ? amount
              : formatNumber(amount, true)
          }
          return (
            <TableRowColumn key={year} className={evenColumn ? 'even-column' : 'odd-column'}>
              {formattedAmount}
            </TableRowColumn>
          )
        })
        return (
          <TableRow key={activityName}>
            <TableRowColumn component="th" scope="row" className="data-name">
              <strong>{activityName}</strong>
            </TableRowColumn>
            {columns}
          </TableRow>
        )
      })
    ]

    return (
      <Table selectable={false} bodyStyle={{ overflow: 'visible' }} fixedHeader={true}>
        {!_.isEmpty(tableBody) && (
          <TableBody displayRowCheckbox={false}>
            {!_.isEmpty(years) && <TableRow>{yearsRow}</TableRow>}
            {tableBody}
          </TableBody>
        )}
      </Table>
    )
  }

  return (
    <div className="profile-financial-data-wraper">
      <div>
        <h4>{t.funder.financialData}</h4>
        {financialCommentary && (
          <small className="profile-financial-data-teaser">{stripTags(financialCommentary)}</small>
        )}
        <FinancialTable />
        {fiscalPeriodDate && (
          <span>
            <strong>{`${t.funder.fiscalPeriod}: `}</strong>
            {fiscalPeriodDate}
          </span>
        )}
      </div>
    </div>
  )
}

export default FinancialView
