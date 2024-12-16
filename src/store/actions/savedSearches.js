import backend from 'utils/backend'

export const SET_SAVED_SEARCHES = 'SET_SAVED_SEARCHES'

export const getSavedSearches = (limit, offset) => async dispatch => {
  try {
    const { data } = await backend.get('api/organizationsavedsearches/', {
      params: { limit, offset }
    })
    if (data) {
      dispatch({ type: SET_SAVED_SEARCHES, payload: { data } })
    }
  } catch (err) {
    console.log({ err })
  }
}

export const addSavedSearch = (name, search_url, organization) => async dispatch => {
  try {
    await backend.post('api/organizationsavedsearches/', {
      name: name,
      search_url: search_url,
      organization: organization
    })
  } catch (err) {
    console.log({ err })
  }
}

export const deleteSavedSearch = id => async dispatch => {
  try {
    await backend.delete(`api/organizationsavedsearches/${id}/`)
  } catch (err) {
    console.log({ err })
  }
}
