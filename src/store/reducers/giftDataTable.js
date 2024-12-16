import { UPDATE_GIFT_DATA_QUERY_STRINGS } from 'store/actions/search'

const giftDataTable = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_GIFT_DATA_QUERY_STRINGS:
      return action.queryStrings
    default:
      return state
  }
}

export default giftDataTable
