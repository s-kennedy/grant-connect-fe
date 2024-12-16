import backend from 'utils/backend'
import {
  FACET_RESULTS_FAILURE,
  SET_CATEGORIES,
  SET_CAUSES,
  SET_POPULATIONS,
  SET_INTERNATIONALS,
  SET_REGIONS,
  SET_SUPPORTS,
  SET_HEADQUARTERS,
} from 'store/actions/facets'

export const getCauses = async () => {
  const url = 'api/causes/'
  try {
    const { data } = await backend.get(url)

    if (data) {
      return { data, type: SET_CAUSES }
    } else {
      throw new Error('No results')
    }
  } catch (error) {
    return { error: error.message, type: FACET_RESULTS_FAILURE }
  }
}

export const getRegions = async () => {
  const url = 'api/regions/'
  try {
    const { data } = await backend.get(url)

    if (data) {
      return { data, type: SET_REGIONS }
    } else {
      throw new Error('No results')
    }
  } catch (error) {
    return { error: error.message, type: FACET_RESULTS_FAILURE }
  }
}

export const getInternationals = async () => {
  const url = 'api/internationals/'
  try {
    const { data } = await backend.get(url)

    if (data) {
      return { data, type: SET_INTERNATIONALS }
    } else {
      throw new Error('No results')
    }
  } catch (error) {
    return { error: error.message, type: FACET_RESULTS_FAILURE }
  }
}

export const getPopulations = async () => {
  const url = 'api/populations/'
  try {
    const { data } = await backend.get(url)

    if (data) {
      return { data, type: SET_POPULATIONS }
    } else {
      throw new Error('No results')
    }
  } catch (error) {
    return { error: error.message, type: FACET_RESULTS_FAILURE }
  }
}

export const getSupports = async () => {
  const url = 'api/supports/'
  try {
    const { data } = await backend.get(url)

    if (data) {
      const { results } = data
      return { data: results, type: SET_SUPPORTS }
    } else {
      throw new Error('No results')
    }
  } catch (error) {
    return { error: error.message, type: FACET_RESULTS_FAILURE }
  }
}

export const getCategories = async () => {
  const url = 'api/categories/'
  try {
    const { data } = await backend.get(url)

    if (data) {
      return { data, type: SET_CATEGORIES }
    } else {
      throw new Error('No results')
    }
  } catch (error) {
    return { error: error.message, type: FACET_RESULTS_FAILURE }
  }
}

export const getHeadquarters = async () => {
  const url = 'api/headquarters/'
  try {
    const { data } = await backend.get(url)

    if (data) {
      return { data, type: SET_HEADQUARTERS }
    } else {
      throw new Error('No results')
    }
  } catch (error) {
    return { error: error.message, type: FACET_RESULTS_FAILURE }
  }
}
