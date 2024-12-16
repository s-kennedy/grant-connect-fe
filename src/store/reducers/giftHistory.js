import {
  SET_GIFT_HISTORY,
  SET_PAGINATED_GIFT_HISTORY,
  SET_GIFT_HISTORY_LOADING,
  SET_PAGINATED_GIFT_HISTORY_LOADING,
  ADD_TO_GIFT_HISTORY,
  RESET_GIFT_HISTORY,
  RESET_PAGINATED_GIFT_HISTORY
} from 'store/actions/giftHistory'

const initialState = {
  isLoading: true,
  count: 0,
  results: [],
  isPaginatedLoading: {},
  paginatedTotalCount: 0,
  paginatedResults: []
}

const giftHistoryReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_GIFT_HISTORY_LOADING:
      const { isLoading } = payload
      return { ...state, isLoading }
    case SET_GIFT_HISTORY:
      const { data } = payload
      return { ...state, count: data.count, results: data.results }
    case ADD_TO_GIFT_HISTORY:
      const { results } = payload
      return {
        ...state,
        results: [...state.results, ...results]
      }
    case RESET_GIFT_HISTORY:
      return {
        ...state,
        isLoading: true,
        count: 0,
        results: []
      }
    case SET_PAGINATED_GIFT_HISTORY_LOADING:
      const { pageIndex, isLoading: isPaginatedLoading } = payload
      return {
        ...state,
        isPaginatedLoading: {
          ...state.isPaginatedLoading,
          [pageIndex]: isPaginatedLoading
        }
      }
    case SET_PAGINATED_GIFT_HISTORY:
      const { data: paginatedData, currentPage } = payload
      let newPaginatedResults = state.paginatedResults
      newPaginatedResults[currentPage] = paginatedData.results
      return {
        ...state,
        paginatedTotalCount: paginatedData.count,
        paginatedResults: newPaginatedResults
      }
    case RESET_PAGINATED_GIFT_HISTORY:
      return {
        ...state,
        isPaginatedLoading: {},
        paginatedTotalCount: 0,
        paginatedResults: []
      }

    default:
      return state
  }
}

export default giftHistoryReducer
