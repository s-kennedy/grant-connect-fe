import { SET_NOTES, SET_NOTES_LOADING } from 'store/actions/notes'


const initialState = {
  isLoading: true
}

const notesReducer = (state = initialState, { payload, type }) => {
  switch (type) {
    case SET_NOTES_LOADING:
      const { isLoading } = payload
      return { ...state, isLoading }
    case SET_NOTES:
      const { data } = payload
      return { ...state, ...data }
    default:
      return state
  }
}

export default notesReducer
