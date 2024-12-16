import { TOGGLE_LEFT_MENU } from '../actions'

const initialLeftMenuState = {
  opened: false
}

const leftMenu = (state = initialLeftMenuState, action) => {
  switch (action.type) {
    case TOGGLE_LEFT_MENU:
      return {
        ...state,
        opened: !state.opened
      }
    default:
      return state
  }
}

export default leftMenu
