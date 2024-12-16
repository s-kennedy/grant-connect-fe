import backend from 'utils/backend'
import { debounce } from 'lodash'
import { SET_PAGE_NUMBER } from './searchPagination'
import history from 'utils/history'
import { trackSearchKeywords } from 'utils/mixpanel'
import { serializeSearchParams } from 'components/SearchParams/helpers'
import { setFacets } from './facets'

export const UPDATE_SEARCH_RESULTS = 'UPDATE_SEARCH_RESULTS'
export const SEARCH_RESULTS_FAILURE = 'SEARCH_RESULTS_FAILURE'

export const CHANGE_SEARCH_TEXT = 'CHANGE_SEARCH_TEXT'
export const CHANGE_SEARCH_LANGUAGE = 'CHANGE_SEARCH_LANGUAGE'
export const CHANGE_SEARCH_OPEN_TO_REQUEST = 'CHANGE_SEARCH_OPEN_TO_REQUEST'
export const CHANGE_SEARCH_TYPICAL_GIFT_FROM = 'CHANGE_SEARCH_TYPICAL_GIFT_FROM'
export const CHANGE_SEARCH_TYPICAL_GIFT_TO = 'CHANGE_SEARCH_TYPICAL_GIFT_TO'
export const CHANGE_SEARCH_SORTING = 'CHANGE_SEARCH_SORTING'
export const GET_GIFT_DATA_PER_FUNDER = 'GET_GIFT_DATA_PER_FUNDER'
export const UPDATE_GIFT_DATA_QUERY_STRINGS = 'UPDATE_GIFT_DATA_QUERY_STRINGS'
export const CHANGE_SEARCH_CAUSE = 'CHANGE_SEARCH_CAUSE'
export const CHANGE_SEARCH_PARAMS = 'CHANGE_SEARCH_PARAMS'
export const CHANGE_SEARCH_REGION = 'CHANGE_SEARCH_REGION'
export const CHANGE_SEARCH_LIVE_UPDATE_CAUSE = 'CHANGE_SEARCH_LIVE_UPDATE_CAUSE'
export const CHANGE_SEARCH_LIVE_UPDATE_REGION = 'CHANGE_SEARCH_LIVE_UPDATE_REGION'
export const SET_SEARCH_LOADING = 'SET_SEARCH_LOADING'

export const changeSearchText = text => {
  return {
    type: CHANGE_SEARCH_TEXT,
    payload: { text }
  }
}

export const searchFundersByParams = source => async (dispatch, getState) => {
  const {
    facets: { selected },
    filters: { language, openToRequests, sortBy, medianGiftMin, medianGiftMax },
    searchPagination: { pageNumber, viewsPerPage },
    search: { text: searchText }
  } = getState()
  const searchParams = serializeSearchParams({
    selected,
    language,
    openToRequests,
    sortBy,
    searchText,
    pageNumber,
    viewsPerPage,
    medianGiftMin,
    medianGiftMax,
    statusToExclude: 'dissolved'
  })
  const url = `api/search/funders/${searchParams}`

  try {
    dispatch(setSearchLoading());
    history.push(`/search${searchParams}`)
    const { data: { results, count, facets: facetCountData } = {} } = await backend.get(url)

    if ((pageNumber - 1) * viewsPerPage > count) {
      // current page number is out of bounds for current viewsPerPage and needs to be recalculated
      // A new search is then initiated
      dispatch({
        type: SET_PAGE_NUMBER,
        payload: { pageNumber: Math.ceil(count / viewsPerPage) || 1 }
      })
      dispatch(searchFundersByParams())
    }

    dispatch(updateSearchResults(results, count))

    // update facet counts
    dispatch(setFacets(facetCountData))

    if (source === 'SEARCH_FORM') {
      if (searchText.length > 0) {
        await trackSearchKeywords({searchText, count})
      }
    }
  } catch (error) {
    dispatch({ type: SEARCH_RESULTS_FAILURE, payload: { error } })
  }
}

export const debouncedFunderSearchByParams = debounce(dispatch => {
  dispatch(searchFundersByParams())
}, 500)

export const changeSearchLanguage = selectedLanguage => {
  return {
    type: CHANGE_SEARCH_LANGUAGE,
    selectedLanguage
  }
}

export const changeSearchOpenToReques = selectedRequest => {
  return {
    type: CHANGE_SEARCH_OPEN_TO_REQUEST,
    selectedRequest
  }
}

export const changeSearchTypicalGiftFrom = typicalGiftFrom => {
  return {
    type: CHANGE_SEARCH_TYPICAL_GIFT_FROM,
    typicalGiftFrom
  }
}

export const changeSearchTypicalGiftTo = typicalGiftTo => {
  return {
    type: CHANGE_SEARCH_TYPICAL_GIFT_TO,
    typicalGiftTo
  }
}

export const changeSearchSorting = sorting => {
  return {
    type: CHANGE_SEARCH_SORTING,
    sorting
  }
}

export const setSearchLoading = () => {
  return {
    type: SET_SEARCH_LOADING
  }
}

export const updateSearchResults = (results, count) => {
  return {
    type: UPDATE_SEARCH_RESULTS,
    payload: { results, count }
  }
}

export const getGiftDataPerFunder = giftData => {
  return {
    type: GET_GIFT_DATA_PER_FUNDER,
    giftData
  }
}

export const updateGiftDataQueryString = queryStrings => {
  return {
    type: UPDATE_GIFT_DATA_QUERY_STRINGS,
    queryStrings
  }
}
