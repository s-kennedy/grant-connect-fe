import {
  getCategories,
  getCauses,
  getInternationals,
  getPopulations,
  getRegions,
  getSupports,
  getHeadquarters
} from 'controllers/api'
import { flatten } from 'utils/helpers'
import { trackFunderSearchFacet } from 'utils/mixpanel'
import { syncURL } from './filters'
import { mapResponseToFacetsData, updateDocCount } from './helpers'
import { debouncedFunderSearchByParams } from './search'
import { setPageNumber } from './searchPagination'

export const SET_CAUSES = 'SET_CAUSES'
export const SET_REGIONS = 'SET_REGIONS'
export const SET_INTERNATIONALS = 'SET_INTERNATIONALS'
export const SET_POPULATIONS = 'SET_POPULATIONS'
export const SET_SUPPORTS = 'SET_SUPPORTS'
export const SET_CATEGORIES = 'SET_CATEGORIES'
export const SET_HEADQUARTERS = 'SET_HEADQUARTERS'
export const SET_SELECTED_FACETS = 'SET_SELECTED_FACETS'
export const FACET_RESULTS_FAILURE = 'FACET_RESULTS_FAILURE'
export const RESET_FACET_FILTERS = 'RESET_FACET_FILTERS'
export const SET_FACETS = 'SET_FACETS'

/*
 * In order to sync URL params with selected facets, facet results need to be available
 * before sync is performed so we can get the name of each facet filter shown as Pills
 */
export const getAllFacetsAndSyncURL = params => async dispatch => {
  try {
    const results = await Promise.all([
      getCauses(),
      getRegions(),
      getInternationals(),
      getPopulations(),
      getSupports(),
      getCategories(),
      getHeadquarters()
    ])

    for (const { type, data, error } of results) {
      if (error) {
        dispatch({ type, payload: { error } })
      } else {
        dispatch({ type, payload: { data } })
      }
    }

    if (params) {
      dispatch(syncURL(params))
    }
  } catch (err) {
    console.log({ err })
  }
}

export const selectFacets = (selectedFacets = []) => (dispatch, getState) => {
  const {
    facets,
    facets: { selected }
  } = getState()

  // When syncing URL to redux store only id and facetType are available
  // in the URL so a manual lookup to store for name is needed
  const lookupName = ({ facetType, id, name }) => {
    const allFacets = flatten(facets[facetType] || [])
    const facet = allFacets.find(facet => facet.id === id)
    return facet ? facet.name : name
  }

  const updatedFacets = selectedFacets.map(facet =>
    facet.name ? facet : { ...facet, name: lookupName(facet) }
  )
  const data = selected.concat(updatedFacets)

  dispatch({ type: SET_SELECTED_FACETS, payload: { data } })
  debouncedFunderSearchByParams(dispatch)
}

export const selectFacet = ({ id, name, facetType, parents }) => async (dispatch, getState) => {
  const {
    facets: { selected },
    t
  } = getState()

  const data =
    facetType === 'regions'
      ? selected
          .concat({ id, name, facetType }, parents || [])
          .filter((item, index, self) => self.findIndex(t => t.id === item.id) === index)
      : selected.concat({ id, name, facetType })

  dispatch({ type: SET_SELECTED_FACETS, payload: { data } })
  debouncedFunderSearchByParams(dispatch)
  dispatch(setPageNumber(1))

  await trackFunderSearchFacet({id, facetType, selected})
}

export const unSelectFacet = ({ id }) => (dispatch, getState) => {
  const {
    facets: { selected }
  } = getState()

  const data = selected.filter(facet => facet.id !== id)

  dispatch({ type: SET_SELECTED_FACETS, payload: { data } })
  debouncedFunderSearchByParams(dispatch)
  dispatch(setPageNumber(1))
}

export const resetFacetFilters = () => ({
  type: RESET_FACET_FILTERS
})

export const setFacets = facetCountData => async (dispatch, getState) => {
  const { facets } = getState()

  const updatedFacetsData = mapResponseToFacetsData(facetCountData)
  const updatedFacets = updateDocCount(updatedFacetsData, facets)

  dispatch({
    type: SET_FACETS,
    payload: { facets: updatedFacets }
  })
}
