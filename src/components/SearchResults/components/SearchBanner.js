import React from 'react'
import { getLanguage } from 'data/locale'

const RESULT_COUNT_TO_BROADEN = 3

const SearchBanner = ({ resultCount }) => {
  const { t } = getLanguage()

  const noBanner = resultCount > RESULT_COUNT_TO_BROADEN
  const bannerContent = !!resultCount ? t.search.broadenSearch : t.search.noResults

  return !noBanner ? (
    <div className="Search_tiles">
      <div className="Search_tiles--header">{bannerContent}</div>
    </div>
  ) : null
}

export default SearchBanner
