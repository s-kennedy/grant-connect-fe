import { useTranslation } from 'react-i18next'
import { Close } from 'material-ui-icons'
import { IconButton } from 'material-ui'
import causes from 'data/ge-data/causes.json'


const ResultSummary = ({filters, handleRemoveFilter, displayMode=false}) => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)
  const filterKeys = Object.keys(filters)
  const activeFilterKeys = filterKeys.filter(k => !!filters[k])

  if (activeFilterKeys.length === 0) {
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
      const selectedCauses = causes.filter(c => filterValue.includes(c.id))
      return `${t.explorer[filterKey]}: ${selectedCauses.map(c => c.name).join(", ")}`
    } else {
      return `${t.explorer[filterKey]}: ${filterValue}`
    }
  }

  return (
      <div className="tw-flex tw-flex-col tw-md:flex-row tw-items-start tw-gap-2">
        <div className="tw-flex-none tw-mt-1">{displayMode ? t.explorer.saved_search_summary_text : t.explorer.results_summary_text}</div>
        <div className="tw-inline-flex tw-items-center tw-gap-2 tw-mb-2 tw-flex-wrap">
        {
          activeFilterKeys.map(filterKey => {
            const filterValue = filters[filterKey]
            if (!filterValue) {
              return null
            }
            return (
              <div key={`${filterKey}-${filterValue}`} className="ge-result-button tw-hover:bg-lightGrey tw-border tw-border-grey tw-border-solid tw-bg-white tw-rounded tw-py-1 tw-px-2 tw-flex tw-items-center tw-gap-1">
                {generateButtonText(filterKey, filterValue)}
                {!displayMode && <IconButton className="ge-icon-button" onClick={() => handleRemoveFilter(filterKey)}><Close className=""/></IconButton>}
              </div>
            )
          })
        }
        </div>
      </div>
  )
}

export default ResultSummary
