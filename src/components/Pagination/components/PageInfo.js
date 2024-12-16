import React from 'react'
import MediaQuery from 'react-responsive'

import { getLanguage } from 'data/locale'
import { numberWithCommas } from 'utils/helpers'

const PageInfo = ({ resultCount, viewsPerPage, pageNumber, className = '' }) => {
  const { t } = getLanguage()
  const pages = Math.ceil(resultCount / viewsPerPage)
  const firstResult = (pageNumber - 1) * viewsPerPage + 1
  const lastResult =
    viewsPerPage * pageNumber > resultCount ? resultCount : viewsPerPage * pageNumber

  return (
    <small className={className}>
      {`${firstResult} - ${lastResult} ${t.global.of} ${numberWithCommas(resultCount)} ${
        t.search.allResultsResult
      }`}
      <MediaQuery query="(min-width: 1200px)">
        {` ${t.search.of} ${numberWithCommas(pages)} pages`}
      </MediaQuery>
    </small>
  )
}

export default PageInfo
