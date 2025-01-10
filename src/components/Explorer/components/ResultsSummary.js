// Global DOM Components.
import React, { useState, useEffect } from 'react'
import { Loop } from 'material-ui-icons'
import { useTranslation } from 'react-i18next'
import { Close } from 'material-ui-icons'


const ResultSummary = ({filters}) => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)
  const filterKeys = Object.keys(filters)

  if (filterKeys.length === 0) {
    return null
  }

  const generateButtonText = (filterKey, filterValue) => {
    if (filterKey === "keyword") {
      return `${t.explorer[filterKey]}: "${filterValue}"`
    } else if (['amount_min', 'amount_max', 'recipient_min_size', 'recipient_max_size'].includes(filterKey)) {
      const formattedValue = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0, minimumFractionDigits: 0 }).format(
        filterValue,
      )
      return `${t.explorer[filterKey]}: ${formattedValue}`
    } else if (filterKey === "focus") {
      return `${t.explorer[filterKey]}: ${filterValue.map(v => v.name).join(", ")}`
    } else {
      return `${t.explorer[filterKey]}: ${filterValue}`
    }
  }

  return (
      <div className="tw-flex tw-items-start tw-gap-2 tw-mb-4">
        <div className="tw-flex-none tw-mt-2">{t.explorer.results_summary_text}</div>
        <div className="tw-inline-flex tw-items-center tw-gap-2 tw-mb-4 tw-flex-wrap">
        {
          filterKeys.map(filterKey => {
            const filterValue = filters[filterKey]
            return (
              <div key={`${filterKey}-${filterValue}`} className="result-button tw-border tw-border-grey tw-border-solid tw-bg-white tw-rounded tw-py-1 tw-px-2 tw-flex tw-items-center tw-gap-1">
                {generateButtonText(filterKey, filterValue)}
                <Close className=""/>
              </div>
            )
          })
        }
        </div>
      </div>
  )
}

export default ResultSummary
