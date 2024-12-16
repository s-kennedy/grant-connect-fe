import backend from 'utils/backend'

export const SET_FUNDER_INFO = 'SET_FUNDER_INFO'
export const FUNDER_INFO_RESULTS_FAILURE = 'FUNDER_INFO_RESULTS_FAILURE'
export const SET_FUNDER_INFO_LOADING = 'SET_FUNDER_INFO_LOADING'

export const setProfileLoading = (newLoadingState) => async dispatch => {
  dispatch({ type: SET_FUNDER_INFO_LOADING, payload: { isLoading: newLoadingState } })
}

export const getFunderById = (id, setLoadingState = true) => async dispatch => {
  if (setLoadingState)
    dispatch(setProfileLoading(true))

  try {
    const { data } = await backend.get(`api/funders/${id}/`)
    if (data) {
      dispatch({ type: SET_FUNDER_INFO, payload: { data } })
      dispatch({ type: SET_FUNDER_INFO_LOADING, payload: { isLoading: false } })
    }
  } catch (err) {
    console.log({ err })
  }
}
