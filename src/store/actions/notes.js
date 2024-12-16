import backend from 'utils/backend'

export const SET_NOTES = 'SET_NOTES'
export const NOTES_RESULTS_FAILURE = 'NOTES_RESULTS_FAILURE'
export const SET_NOTES_LOADING = 'SET_NOTES_LOADING'

export const getNotesByFunderId = (funderId, setLoadingState = true) => async dispatch => {
  if (setLoadingState)
    dispatch({ type: SET_NOTES_LOADING, payload: { isLoading: true } })

  try {
    const { data } = await backend.get(`api/funders/${funderId}/notes/`)
    if (data) {
      dispatch({ type: SET_NOTES, payload: { data } })
      dispatch({ type: SET_NOTES_LOADING, payload: { isLoading: false } })
    }
  } catch (err) {
    console.log({ err })
  }
}

export const addNoteByFunderId = (funderId, note) => async dispatch => {
  try {
    await backend.post(
      `api/funders/${funderId}/notes/`,
      { note }
    )
  } catch (err) {
    console.log({ err })
  }
}

export const updateNote = (id, note) => async dispatch => {
  try {
    await backend.patch(
      `api/notes/${id}/`,
      { note }
    )
  } catch (err) {
    console.log({ err })
  }
}

export const deleteNote = (id) => async dispatch => {
  try {
    await backend.delete(`api/notes/${id}/`)
  } catch (err) {
    console.log({ err })
  }
}