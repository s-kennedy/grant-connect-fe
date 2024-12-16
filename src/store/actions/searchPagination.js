export const SET_VIEWS_PER_PAGE = 'SET_VIEWS_PER_PAGE'
export const SET_PAGE_NUMBER = 'SET_PAGE_NUMBER'

export const setViewsPerPage = viewsPerPage => ({
  type: SET_VIEWS_PER_PAGE,
  payload: { viewsPerPage }
})

export const setPageNumber = pageNumber => ({ type: SET_PAGE_NUMBER, payload: { pageNumber } })
export const setPagerSize = pagerSize => ({ type: SET_PAGER_SIZE, payload: { pagerSize } })
