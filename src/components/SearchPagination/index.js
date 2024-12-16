import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { setViewsPerPage, setPageNumber } from 'store/actions/searchPagination'
import { searchFundersByParams } from 'store/actions/search'
import { selectPaginationState } from 'store/selectors/searchPagination'
import { selectResultCount } from 'store/selectors/search'

import Pagination from 'components/Pagination'

const SearchPagination = ({ pagerSize }) => {
  const dispatch = useDispatch()
  const { viewsPerPage, pageNumber } = useSelector(selectPaginationState)
  const resultCount = useSelector(selectResultCount)
  const pages = Math.ceil(resultCount / viewsPerPage)

  const onNumberOfResultsChange = newViewsPerPage => {
    dispatch(setViewsPerPage(newViewsPerPage))
    dispatch(searchFundersByParams())
  }

  const onClickNumber = newPageNumber => {
    dispatch(setPageNumber(newPageNumber))
    dispatch(searchFundersByParams())
  }
  const onClickNext = () => {
    dispatch(setPageNumber(pageNumber + 1))
    dispatch(searchFundersByParams())
  }
  const onClickPrevious = () => {
    dispatch(setPageNumber(pageNumber - 1))
    dispatch(searchFundersByParams())
  }
  const onClickFirst = () => {
    dispatch(setPageNumber(1))
    dispatch(searchFundersByParams())
  }
  const onClickLast = () => {
    dispatch(setPageNumber(pages))
    dispatch(searchFundersByParams())
  }

  return (
    <Pagination
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
  )
}

export default SearchPagination
