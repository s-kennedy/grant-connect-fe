import { debounce } from 'lodash'

import backend from 'utils/backend'


const MIXPANEL_ENDPOINT = 'api/mixpanel/'

const track = async ({type, properties = { } }) => {
  try {
    await backend.post(
      MIXPANEL_ENDPOINT,
      {
        type,
        properties,
        url: window.location.href,
      }
    )
  } catch (err) {
    console.log({ err })
  }
}


export const trackLogin = async () => {
  await track({
    type: 'login',
  })
}

export const trackSearchKeywords = async ({ searchText, count }) => {
  await track({
    type: 'search',
    properties: {
      text: searchText,
      result_count: count,
    },
  })
}

export const trackSearchAutocompleteFunderClick = async funderId => {
  await track({
    type: 'search_autocomplete_funder_click',
    properties: {
      id: funderId,
    },
  })
}

export const trackSearchAutocompleteFacetClick = async ({ id, facetType }) => {
  await track({
    type: 'search_autocomplete_facet_click',
    properties: {
      id,
      type: facetType,
    },
  })
}

export const trackFunderSearchResultClick = async funderId => {
  await track({
    type: 'funder_search_result_click',
    properties: {
      id: funderId,
    }
  })
}

export const trackFunderSearchFacet = async ({ id, facetType, selected }) => {
  await track({
    type: 'funder_search_facet',
    properties: {
      id,
      type: facetType,
      selected: Array.from(selected, item => ({ id: item.id, type: item.facetType })),
    },
  })
}

export const trackFunderSearchFilter = async ({ filter, value }) => {
  await track({
    type: 'funder_search_filter',
    properties: {
      filter,
      value,
    },
  })
}

// median gift fields generate too many events if not debounced
export const debouncedTrackFunderSearchFilter = debounce(async ({ filter, value }) => {
  if (value) {
    // do not generate event if user clears median gift fields
    await trackFunderSearchFilter({ filter, value })
  }
}, 3000)

export const trackFunderSearchSortBy = async sortBy => {
  await track({
    type: 'funder_search_sort_by',
    properties: {
      value: sortBy,
    },
  })
}

export const trackAddFunderToPipeline = async funderId => {
  await track({
    type: 'pipeline_add_funder',
    properties: {
      id: funderId,
    },
  })
}

export const trackChangeFunderPipelineStage = async ({ funderId, prevStageId, stageId }) => {
  await track({
    type: 'pipeline_change_funder_stage',
    properties: {
      funder_id: funderId,
      prev_id: prevStageId,
      id: stageId,
    },
  })
}

export const trackSideMenuPageClick = async page => {
  await track({
    type: 'side_menu_page_click',
    properties: {
      page,
    },
  })
}
