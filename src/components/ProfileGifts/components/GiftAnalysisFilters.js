import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import SearchPageFiltersDropdown from 'pages/search/components/filters/SearchPageFiltersDropdown'
import FromToFilter from 'pages/search/components/filters/FromToFilter'

const GiftAnalysisFilters = ({
  year,
  yearOptions = [],
  onYearChange,
  focus,
  focusOptions = [],
  onFocusChange,
  fromGiftValue,
  toGiftValue,
  setFromGiftValue,
  setToGiftValue
}) => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)

  const [showGiftSizeActions, setShowGiftSizeActions] = useState(false)
  const [newFromValue, setNewFromValue] = useState()
  const [newToValue, setNewToValue] = useState()

  useEffect(() => {
    setNewFromValue(fromGiftValue)
    setNewToValue(toGiftValue)
  }, [fromGiftValue, toGiftValue])

  const inputNameToFunction = {
    medianGiftMin: setNewFromValue,
    medianGiftMax: setNewToValue
  }

  const showGiftSizeClear = () => {
    return fromGiftValue !== null || toGiftValue !== null
  }

  const clearGiftSize = () => {
    setFromGiftValue(null)
    setToGiftValue(null)
  }

  const handleGiftSizeChange = ({ target: { value } }, inputName) => {
    if (value !== '') {
      setShowGiftSizeActions(true)
    }

    inputNameToFunction[inputName](value.replace(/\D/g, ''))
  }

  const handleSubmit = () => {
    setFromGiftValue(Number(newFromValue) || null)
    setToGiftValue(Number(newToValue) || null)
  }

  return (
    <div className="gift-analysis-filters">
      {!!yearOptions.length && (
        <SearchPageFiltersDropdown
          fieldName="year"
          floatingLabelText={t.global.year}
          icon="KeyboardArrowDown"
          value={year}
          onChange={(e, index, newValue) => newValue !== year && onYearChange(newValue)}
          menuItems={yearOptions}
        />
      )}
      {!!focusOptions.length && (
        <SearchPageFiltersDropdown
          fieldName="cause"
          floatingLabelText={t.funder.causes}
          icon="KeyboardArrowDown"
          value={focus}
          onChange={(e, index, newValue) => newValue !== focus && onFocusChange(newValue)}
          menuItems={focusOptions}
        />
      )}
      <FromToFilter
        page="Profile"
        field="gift-size"
        fromLabel={t.funder.giftSize}
        toLabel=" "
        fromValue={newFromValue}
        toValue={newToValue}
        showActions={showGiftSizeActions}
        showClear={showGiftSizeClear()}
        onChange={handleGiftSizeChange}
        onSubmit={handleSubmit}
        onCancel={clearGiftSize}
      />
    </div>
  )
}

export default GiftAnalysisFilters
