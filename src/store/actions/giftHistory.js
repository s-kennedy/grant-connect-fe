import axios from 'axios'
import backend from 'utils/backend'
import { selectIsFunderPaginatedGiftDataLoading } from 'store/selectors/giftHistory'

export const SET_GIFT_HISTORY = 'SET_GIFT_HISTORY'
export const SET_PAGINATED_GIFT_HISTORY = 'SET_PAGINATED_GIFT_HISTORY'
export const SET_GIFT_HISTORY_LOADING = 'SET_GIFT_HISTORY_LOADING'
export const SET_PAGINATED_GIFT_HISTORY_LOADING = 'SET_PAGINATED_GIFT_HISTORY_LOADING'
export const ADD_TO_GIFT_HISTORY = 'ADD_TO_GIFT_HISTORY'
export const RESET_GIFT_HISTORY = 'RESET_GIFT_HISTORY'
export const RESET_PAGINATED_GIFT_HISTORY = 'RESET_PAGINATED_GIFT_HISTORY'

const GIFT_HISTORY_CHUNK_SIZE = 1000
const MAX_ITERATIONS = 4

// Ordering map handles translating ordering fields from component friendly name to API field
const ORDERING_API_MAP = {
  recipient: 'charity_name',
  location: 'charity__charity_regions__name',
  charitySize: 'charity__recipientSize'
}

export const setGiftHistoryLoading = newLoadingState => async dispatch => {
  dispatch({ type: SET_GIFT_HISTORY_LOADING, payload: { isLoading: newLoadingState } })
}
export const setPaginatedGiftHistoryLoading = (pageIndex, newLoadingState) => async dispatch => {
  dispatch({
    type: SET_PAGINATED_GIFT_HISTORY_LOADING,
    payload: { pageIndex, isLoading: newLoadingState }
  })
}

export const getGiftHistoryCancelSource = () => axios.CancelToken.source()
export const getPaginatedGiftHistoryCancelSource = () => axios.CancelToken.source()

export const resetGiftHistory = GiftCancelSource => async dispatch => {
  GiftCancelSource.cancel('Gift data loading cancelled by the user')
  dispatch({ type: RESET_GIFT_HISTORY })
}

export const resetPaginatedGiftHistory = GiftCancelSource => {
  GiftCancelSource.cancel('Paginated gift data loading cancelled by the user')
  return { type: RESET_PAGINATED_GIFT_HISTORY }
}

export const getFunderGiftHistory = (
  funderId,
  GiftCancelSource,
  setLoadingState = true
) => async dispatch => {
  if (setLoadingState) dispatch(setGiftHistoryLoading(true))

  try {
    let counter = 0
    let nextPageUrl = `api/gifthistories/${funderId}/`
    let isfirstPagefetched = false

    while (nextPageUrl && counter < MAX_ITERATIONS) {
      const { data } = await backend.get(nextPageUrl, {
        params: { limit: GIFT_HISTORY_CHUNK_SIZE },
        cancelToken: GiftCancelSource.token
      })

      if (data && !isfirstPagefetched) {
        dispatch({ type: SET_GIFT_HISTORY, payload: { data } })
        isfirstPagefetched = true
      } else {
        dispatch({ type: ADD_TO_GIFT_HISTORY, payload: { results: data.results } })
      }

      nextPageUrl = data.next
      counter += 1
    }

    dispatch(setGiftHistoryLoading(false))
  } catch (err) {
    console.log({ err })

    //Fix SUP-13008 while we dont have backend log, we do a retry.
    setTimeout(async () => {
      let counter = 0
      let nextPageUrl = `api/gifthistories/${funderId}/`
      let isfirstPagefetched = false

      while (nextPageUrl && counter < MAX_ITERATIONS) {
        const { data } = await backend.get(nextPageUrl, {
          params: { limit: GIFT_HISTORY_CHUNK_SIZE },
          cancelToken: GiftCancelSource.token
        })

        if (data && !isfirstPagefetched) {
          dispatch({ type: SET_GIFT_HISTORY, payload: { data } })
          isfirstPagefetched = true
        } else {
          dispatch({ type: ADD_TO_GIFT_HISTORY, payload: { results: data.results } })
        }

        nextPageUrl = data.next
        counter += 1
      }

      dispatch(setGiftHistoryLoading(false))
    }, 1000)
  }
}

export const DEFAULT_PAGINATION_PARAMS = {
  resultsPerPage: 10,
  currentPage: 1,
  filterYear: null,
  filterFocus: null,
  fromGiftValue: null,
  toGiftValue: null,
  sortField: 'year',
  sortDirection: 'desc'
}

export const getFunderPaginatedGiftHistory = (
  GiftCancelSource,
  funderId,
  resultsPerPage,
  currentPage,
  filterYear,
  filterFocus,
  fromGiftValue,
  toGiftValue,
  sortField,
  sortDirection,
  numPages = 5
) => async (dispatch, getState) => {
  const isLoading = selectIsFunderPaginatedGiftDataLoading(currentPage)(getState())
  // If the page is loading, or has already loaded skip fetching
  if (isLoading !== undefined) {
    return
  }
  dispatch(setPaginatedGiftHistoryLoading(currentPage, true))
  const params = {
    limit: resultsPerPage,
    offset: (currentPage - 1) * resultsPerPage
  }
  if (filterYear) params.year = filterYear
  if (filterFocus) params.focus = filterFocus
  if (fromGiftValue) params.giftAmount__gt = fromGiftValue
  if (toGiftValue) params.giftAmount__lt = toGiftValue
  if (sortField) {
    params.ordering = sortField in ORDERING_API_MAP ? ORDERING_API_MAP[sortField] : sortField
    params.ordering = sortDirection === 'desc' ? `-${params.ordering}` : params.ordering
  }

  const url = `api/gifthistories/${funderId}/`

  try {
    const { data } = await backend.get(url, {
      params: params,
      cancelToken: GiftCancelSource.token
    })

    // Check if the promise has been canceled
    if (GiftCancelSource.token.reason) {
      console.log('GiftCancelSource reason: ', GiftCancelSource.token.reason)
      return // Abort if the request has been canceled
    }

    dispatch({ type: SET_PAGINATED_GIFT_HISTORY, payload: { data, currentPage } })
    dispatch(setPaginatedGiftHistoryLoading(currentPage, false))
    if (data.next && numPages > 1) {
      dispatch(
        getFunderPaginatedGiftHistory(
          GiftCancelSource,
          funderId,
          resultsPerPage,
          currentPage + 1,
          filterYear,
          filterFocus,
          fromGiftValue,
          toGiftValue,
          sortField,
          sortDirection,
          (numPages = numPages - 1)
        )
      )
    }
  } catch (err) {
    console.log('Error retrieving data: ', err)
  }
}
