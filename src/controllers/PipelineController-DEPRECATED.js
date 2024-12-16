// API calls.
import * as GrantConnectAPI from '../utils/API/ContentaAPI-DEPRECATED'

export const getPipelineData = () => {
  return GrantConnectAPI.getPipelineData()
}

export const getPipelineHideData = () => {
  return GrantConnectAPI.getPipelineHideData()
}

export const getPipelineDataArchived = () => {
  return GrantConnectAPI.getPipelineDataArchived()
}

// Getting all the results from the search autocomplete field.
export const getCSV = searchText => {
  return GrantConnectAPI.getCSV()
}
