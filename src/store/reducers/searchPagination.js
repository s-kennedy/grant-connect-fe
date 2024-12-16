import { SET_PAGE_NUMBER, SET_VIEWS_PER_PAGE } from 'store/actions/searchPagination'

const initialState = {
  viewsPerPage: 10,
  pageNumber: 1
}

const paginationReducer = (state = initialState, { type, payload = {} }) => {
  switch (type) {
    case SET_VIEWS_PER_PAGE:
      const { viewsPerPage } = payload
      return {
        ...state,
        viewsPerPage
      }
    case SET_PAGE_NUMBER:
      const { pageNumber } = payload
      return { ...state, pageNumber }
    default:
      return state
  }
}

export default paginationReducer
