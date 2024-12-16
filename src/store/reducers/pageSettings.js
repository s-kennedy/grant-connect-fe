import { TOGGLE_CARD_VIEW } from 'store/actions/pageSettings'

export const CardViewEnum = Object.freeze({
  COLLAPSED: 'COLLAPSED',
  EXPANDED: 'EXPANDED'
})

const initialState = {
  cardView: CardViewEnum.EXPANDED
}

const pageSettingsReducer = (state = initialState, { type }) => {
  switch (type) {
    case TOGGLE_CARD_VIEW:
      return {
        ...state,
        cardView: state.cardView === CardViewEnum.COLLAPSED ? CardViewEnum.EXPANDED : CardViewEnum.COLLAPSED
      }
    default:
      return state
  }
}

export default pageSettingsReducer
