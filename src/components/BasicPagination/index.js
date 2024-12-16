import React from 'react'

import Pagination from 'components/Pagination'

const BasicPagination = ({
  pagerSize,
  resultCount,
  viewsPerPage,
  pageNumber,
  onNumberOfResultsChange,
  onSetPage,
}) => {
  const pages = Math.ceil(resultCount / viewsPerPage)

  const onClickNumber = (newPageNumber) => {
    onSetPage(newPageNumber)
  }
  const onClickNext = () => {
    onSetPage(pageNumber + 1)
  }
  const onClickPrevious = () => {
    onSetPage(pageNumber - 1)
  }
  const onClickFirst = () => {
    onSetPage(1)
  }
  const onClickLast = () => {
    onSetPage(pages)
  }

  return <Pagination
    pagerSize={pagerSize}
    resultCount={resultCount}
    viewsPerPage={viewsPerPage}
    pageNumber={pageNumber}
    onNumberOfResultsChange={onNumberOfResultsChange}
    onClickNumber={onClickNumber}
    onClickNext={onClickNext}
    onClickPrevious={onClickPrevious}
    onClickFirst={onClickFirst}
    onClickLast={onClickLast}
  />
}

export default BasicPagination
