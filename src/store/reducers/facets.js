import {
  SET_CAUSES,
  SET_REGIONS,
  SET_INTERNATIONALS,
  SET_POPULATIONS,
  SET_SUPPORTS,
  SET_CATEGORIES,
  SET_HEADQUARTERS,
  SET_SELECTED_FACETS,
  RESET_FACET_FILTERS,
  SET_FACETS
} from 'store/actions/facets'

const initialState = {
  causes: [],
  regions: [],
  internationals: [],
  populations: [],
  supports: [],
  categories: [],
  selected: [],
  headquarters: [],
}

const facetsReducer = (state = initialState, { type, payload = {} }) => {
  const { data } = payload

  switch (type) {
    case SET_CAUSES:
      return {
        ...state,
        causes: data
      }
    case SET_REGIONS:
      return {
        ...state,
        regions: data
      }
    case SET_INTERNATIONALS:
      return {
        ...state,
        internationals: data
      }
    case SET_POPULATIONS:
      return {
        ...state,
        populations: data
      }
    case SET_SUPPORTS:
      return {
        ...state,
        supports: data
      }
    case SET_CATEGORIES:
      return {
        ...state,
        categories: data
      }
    case SET_HEADQUARTERS:
      return {
        ...state,
        headquarters: data?.results
      }
    case SET_SELECTED_FACETS:
      return {
        ...state,
        selected: data
      }
    case RESET_FACET_FILTERS:
      return {
        ...state,
        selected: []
      }
    case SET_FACETS:
      const { facets } = payload
      return {
        ...state,
        ...facets
      }
    default:
      return state
  }
}

export default facetsReducer
