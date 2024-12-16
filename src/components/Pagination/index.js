import React from 'react'
import { useTranslation } from 'react-i18next'

import SearchPageFiltersDropdown from 'pages/search/components/filters/SearchPageFiltersDropdown'
import Pager from './components/Pager'
import PageInfo from './components/PageInfo'

const Pagination = ({
  resultCount,
  viewsPerPage,
  pageNumber,
  onNumberOfResultsChange,
  ...restProps
}) => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)

  const handleSearchPaginationChange = (e, _, newViewsPerPage) => {
    e.preventDefault()
    if (newViewsPerPage !== viewsPerPage) {
      onNumberOfResultsChange(newViewsPerPage)
    }
  }

  const menuItems = [
    { value: 5, primaryText: 5 },
    { value: 10, primaryText: 10 },
    { value: 25, primaryText: 25 },
    { value: 50, primaryText: 50 },
    { value: 100, primaryText: 100 }
  ]

  return (
    <div className="tw-grid tw-grid-cols-2 md:tw-grid-cols-4 tw-grid-rows-2 md:tw-grid-rows-1 tw-items-center">
      {/* Views per page dropdown */}
      <div className="pagination__dropdown-actions tw-col-span-1 tw-flex tw-justify-center tw-items-center tw-order-3 md:tw-order-2">
        <small className="tw-mr-4">{t.search.viewsPerPage}</small>
        <SearchPageFiltersDropdown
          fieldName="pagination"
          icon="KeyboardArrowDown"
          value={viewsPerPage}
          onChange={handleSearchPaginationChange}
          menuItems={menuItems}
        />
      </div>

      <PageInfo
        className={
          'tw-col-span-1 tw-flex tw-justify-center tw-h-full tw-items-center tw-text-md tw-order-2'
        }
        resultCount={resultCount}
        viewsPerPage={viewsPerPage}
        pageNumber={pageNumber}
      />

      {/* Pager */}
      <div className="pagination__pager tw-col-span-2 md:tw-col-span-2 sm:tw-order-1 md:tw-order-3 tw-flex tw-justify-center tw-ml-4">
        <Pager
          viewsPerPage={viewsPerPage}
          pageNumber={pageNumber}
          resultCount={resultCount}
          {...restProps}
        />
      </div>
    </div>
  )
}

export default Pagination
