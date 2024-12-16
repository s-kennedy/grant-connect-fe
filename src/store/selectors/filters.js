import { initialState } from 'store/reducers/filters'

export const selectAllFilters = ({ filters }) => filters
export const selectIsResetButtonDisabled = ({
  filters,
  facets: { selected },
  searchPagination: { pageNumber },
  search: { text }
}) => {
  // check if current filters match initial values, and if any mismatches
  // are found, return false
  for (const filter in filters) {
    if (filters[filter] !== initialState[filter]) {
      return false
    }
  }

  // Validate no search text is present
  if (text) {
    return false
  }

  // selected facets are present
  if (selected.length) {
    return false
  }

  if (pageNumber !== 1) {
    return false
  }

  // facets and filters are in a clean state so filter button is disabled
  return true
}
