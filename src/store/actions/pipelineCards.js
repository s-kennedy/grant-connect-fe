export const SET_CARD_UPDATING = 'SET_CARD_UPDATING'

export const setCardIsUpdating = newUpdatingState => async dispatch => {
  dispatch({ type: SET_CARD_UPDATING, payload: { isCardUpdating: newUpdatingState } })
}
