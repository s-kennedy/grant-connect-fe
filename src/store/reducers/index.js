import { combineReducers } from 'redux'
import leftMenu from './leftMenu'
import giftDataTable from './giftDataTable'
import search from 'store/reducers/search'
import savedSearches from 'store/reducers/savedSearches'
import user from 'store/reducers/user'
import searchPagination from 'store/reducers/searchPagination'
import facets from 'store/reducers/facets'
import pageSettings from 'store/reducers/pageSettings'
import filters from 'store/reducers/filters'
import profile from 'store/reducers/profile'
import notes from 'store/reducers/notes'
import pipeline from 'store/reducers/pipeline'
import pipelineCards from 'store/reducers/pipelineCards'
import pipelineStages from 'store/reducers/pipelineStages'
import funderGiftHistory from 'store/reducers/giftHistory'

export default combineReducers({
  leftMenu,
  giftDataTable,
  search,
  savedSearches,
  user,
  searchPagination,
  facets,
  pageSettings,
  filters,
  profile,
  notes,
  pipeline,
  pipelineCards,
  pipelineStages,
  funderGiftHistory
})
