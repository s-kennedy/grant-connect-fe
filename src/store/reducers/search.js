import {
  CHANGE_SEARCH_TEXT,
  CHANGE_SEARCH_LANGUAGE,
  CHANGE_SEARCH_OPEN_TO_REQUEST,
  CHANGE_SEARCH_TYPICAL_GIFT_FROM,
  CHANGE_SEARCH_TYPICAL_GIFT_TO,
  CHANGE_SEARCH_SORTING,
  UPDATE_SEARCH_RESULTS,
  SEARCH_RESULTS_FAILURE,
  CHANGE_SEARCH_CAUSE,
  CHANGE_SEARCH_PARAMS,
  CHANGE_SEARCH_REGION,
  CHANGE_SEARCH_LIVE_UPDATE_CAUSE,
  CHANGE_SEARCH_LIVE_UPDATE_REGION,
  SET_SEARCH_LOADING
} from 'store/actions/search'

import _ from 'lodash'
import { getLanguage } from 'data/locale'

const { t } = getLanguage()

const initialState = {
  text: '',
  language: '',
  liveRegion: { text: t.search.region, url: '' },
  results: [],
  count: null
}

const searchReducer = (state = initialState, { payload, type }) => {
  switch (type) {
    case CHANGE_SEARCH_LIVE_UPDATE_REGION:
      const { liveRegion } = payload
      return {
        ...state,
        liveRegion: {
          ...liveRegion
        }
      }
    case CHANGE_SEARCH_TEXT:
      const { text } = payload
      return {
        ...state,
        text
      }
    case SET_SEARCH_LOADING:
      return {
        ...state,
        loading: true
      }
    case UPDATE_SEARCH_RESULTS:
      const { results, count } = payload
      return {
        ...state,
        loading: false,
        results,
        count
      }
    case SEARCH_RESULTS_FAILURE:
      return {
        ...state,
        loading: false,
        results: []
      }
    default:
      return state
  }
}

/* Search Text */

const searchLiveDefaults = { value: { causeText: t.search.cause, url: '' } }

export const searchLiveCause = (state = searchLiveDefaults, action) => {
  switch (action.type) {
    case CHANGE_SEARCH_LIVE_UPDATE_CAUSE:
      return {
        ...state,
        value: action.value
      }
    default:
      return state
  }
}

export const searchParams = (state = [], action) => {
  switch (action.type) {
    case CHANGE_SEARCH_PARAMS:
      return {
        ...state,
        value: action.value
      }
    default:
      return state
  }
}

export const searchCause = (state = [], action) => {
  switch (action.type) {
    case CHANGE_SEARCH_CAUSE:
      return {
        ...state,
        cause: action.value
      }
    default:
      return state
  }
}

export const searchRegion = (state = [], action) => {
  switch (action.type) {
    case CHANGE_SEARCH_REGION:
      let storageRegion = localStorage.getItem('region')
      if (action.default == null && !_.isEmpty(storageRegion)) {
        // Do not do anything right now.
      } else {
        storageRegion = action.default
        localStorage.setItem('region', storageRegion)
      }
      return {
        ...state,
        value: action.value,
        default: storageRegion
      }
    default:
      return state
  }
}

/* Search Text */
const initialSearchText = {
  value: ''
}

export const searchText = (state = initialSearchText, action) => {
  switch (action.type) {
    case CHANGE_SEARCH_TEXT:
      return {
        ...state,
        value: action.searchText
      }
    default:
      return state
  }
}
/* ENDOF: Search Text */

/* Language Filter */
const initialSearchLanguage = {
  language: null
}

export const searchLanguage = (state = initialSearchLanguage, action) => {
  switch (action.type) {
    case CHANGE_SEARCH_LANGUAGE:
      return {
        ...state,
        language: action.selectedLanguage
      }
    default:
      return state
  }
}
/* ENDOF: Language Filter */

/* Open to Requests Filter */
const initialSearchOpenToRequest = {
  value: null
}

export const searchOpenToRequest = (state = initialSearchOpenToRequest, action) => {
  switch (action.type) {
    case CHANGE_SEARCH_OPEN_TO_REQUEST:
      return {
        ...state,
        value: action.selectedRequest
      }
    default:
      return state
  }
}
/* ENDOF: Open to Requests Filter */

/* Typical Gifts */
export const searchTypicalGiftFrom = (state = {}, action) => {
  switch (action.type) {
    case CHANGE_SEARCH_TYPICAL_GIFT_FROM:
      return {
        ...state,
        value: action.typicalGiftFrom
      }
    default:
      return state
  }
}

export const searchTypicalGiftTo = (state = {}, action) => {
  switch (action.type) {
    case CHANGE_SEARCH_TYPICAL_GIFT_TO:
      return {
        ...state,
        value: action.typicalGiftTo
      }
    default:
      return state
  }
}
/* ENDOF: Typical Gifts */

/* Sorting */
const initialSearchSorting = {
  value: ''
}

export const searchSorting = (state = initialSearchSorting, action) => {
  switch (action.type) {
    case CHANGE_SEARCH_SORTING:
      return {
        ...state,
        value: action.sorting
      }
    default:
      return state
  }
}
/* ENDOF: Sorting */

export default searchReducer
