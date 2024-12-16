import { deserializeSearchParams } from 'components/SearchParams/helpers'
import { deserializePaginationParams } from 'utils/helpers'
import { RESET_FACET_FILTERS, selectFacets } from './facets'
import { setPageNumber, setViewsPerPage } from './searchPagination'
import { debouncedFunderSearchByParams, searchFundersByParams } from './search'

export const RESET_FILTERS = 'RESET_FILTERS'
export const SET_FILTER_BY_KEY = 'SET_FILTER_BY_KEY'

export const resetFacetFilters = () => ({
  type: RESET_FACET_FILTERS
})

export const resetFacetFiltersAndReload = () => dispatch => {
  dispatch(resetFacetFilters())
  dispatch(setPageNumber(1))
  // refetch results after resetting filters
  dispatch(searchFundersByParams())
}

export const resetFilters = () => dispatch => {
  dispatch({ type: RESET_FILTERS })
  dispatch(resetFacetFiltersAndReload())
}

export const setFilterByKey = filter => dispatch => {
  dispatch({ type: SET_FILTER_BY_KEY, payload: { filter } })
  debouncedFunderSearchByParams(dispatch)
}

// read URL query params and set filter and pagination settings
export const syncURL = params => dispatch => {
  const deserializedParams = deserializeSearchParams(params)

  for (const [key, value] of Object.entries(deserializedParams)) {
    if (key !== 'offset' && key !== 'limit') {
      // disregard pagination data when dispatching filters
      dispatch(setFilterByKey({ [key]: value }))
    }

    // dispatch pagination data
    const { offset, limit } = deserializedParams
    if (offset && limit) {
      const { viewsPerPage, pageNumber } = deserializePaginationParams({ offset, limit })
      dispatch(setPageNumber(pageNumber))
      dispatch(setViewsPerPage(viewsPerPage))
    }
  }

  // dispatch selected facets data
  const { selected } = deserializedParams
  if (selected && selected.length) {
    dispatch(selectFacets(selected))
  }
}
