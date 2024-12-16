import React, { Fragment } from 'react'
import { FlatButton, IconButton } from 'material-ui'
import { FirstPage, KeyboardArrowLeft, KeyboardArrowRight, LastPage } from 'material-ui-icons'

import { calculateVisiblePageNumbers } from './helpers'

const Pager = ({
  pagerSize,
  viewsPerPage,
  pageNumber,
  resultCount,
  onClickNumber,
  onClickNext,
  onClickPrevious,
  onClickFirst,
  onClickLast
}) => {
  const pages = Math.ceil(resultCount / viewsPerPage)

  const visiblePageNumbers = calculateVisiblePageNumbers({
    pagerSize,
    currentPage: pageNumber,
    totalPages: pages
  })

  const handleClickNumber = (e, pageNumber) => {
    e.preventDefault()
    onClickNumber(pageNumber)
  }

  return (
    <Fragment>
      {pageNumber > 1 && (
        <div className="pagination__left">
          <IconButton className="pagination__arrow-double-left" onClick={onClickFirst}>
            <FirstPage />
          </IconButton>
          <IconButton className="pagination__arrow-left" onClick={onClickPrevious}>
            <KeyboardArrowLeft />
          </IconButton>
          <span className="pagination__three-dots">{visiblePageNumbers[0] !== 1 && '...'}</span>
        </div>
      )}

      {visiblePageNumbers.map(visiblePageNumber => (
        <FlatButton
          key={visiblePageNumber}
          className={visiblePageNumber === pageNumber ? 'selected' : ''}
          onClick={e => handleClickNumber(e, visiblePageNumber)}
          label={visiblePageNumber}
        />
      ))}

      {pageNumber !== pages && (
        <div className="pagination__right">
          <span className="pagination__three-dots">
            {visiblePageNumbers[visiblePageNumbers.length - 1] !== pages && '...'}
          </span>
          <IconButton className="pagination__arrow-right" onClick={onClickNext}>
            <KeyboardArrowRight />
          </IconButton>
          <IconButton className="pagination__arrow-double-right" onClick={onClickLast}>
            <LastPage />
          </IconButton>
        </div>
      )}
    </Fragment>
  )
}

export default Pager
