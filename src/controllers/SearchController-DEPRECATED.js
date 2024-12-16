// Global DOM components.
import React from 'react'
import { AlarmOn, Check, Close, NewReleases, Update, LocationOn } from 'material-ui-icons'
import * as locationSearch from 'query-string'
import renderHTML from 'react-render-html'

// API calls.
import * as GrantConnectAPI from '../utils/API/ContentaAPI-DEPRECATED'

// Helpers.
import { formatNumber, formatString, formatSINumber } from '../utils/helpers'
import { convertISODateToLocalDate } from '../utils/dates'

// Helpers.
import _ from 'lodash'

// App Language.
import { getLanguage } from 'data/locale'

let hasViewStorage = typeof localStorage.cardsView !== 'undefined'

// Getting the initial state for the search.
export const getInitialState = () => {
  const queryStrings = locationSearch.parse(window.location.search)

  if (!hasViewStorage) {
    localStorage.setItem('cardsView', 'expanded')
  }

  const initialState = {
    cardsView: localStorage.cardsView,
    expandedActive: localStorage.cardsView === 'expanded' ? 'active' : '',
    collapsedActive: localStorage.cardsView === 'collapsed' ? 'active' : '',
    viewsPerPage: localStorage.cardsView === 'expanded' ? 10 : 25,
    mobileFiltersOpened: false,
    open: false,
    snackbar: {
      open: false,
      message: ''
    },
    pageNumber: typeof queryStrings.page !== 'undefined' ? parseInt(queryStrings.page, 0) : 0
  }

  return initialState
}

// Getting all the results from the search autocomplete field.
export const setSaveSearch = (searchTitle, searchURL) => {
  return GrantConnectAPI.createSaveSearch(searchTitle, searchURL)
}

// Getting all the results from the search autocomplete field.
export const getSaveSearch = () => {
  return GrantConnectAPI.getSaveSearch()
}

// Getting all the results from the search autocomplete field.
export const deleteSaveSearch = (url, title) => {
  return GrantConnectAPI.deleteSaveSearch(url, title)
}

// Getting all the results from the search autocomplete field.
export const getFunderResultData = searchText => {
  return GrantConnectAPI.getFunderResultData(searchText)
}

// Getting the parent causes to show on the dropdown.
export const getParentCauses = () => {
  return GrantConnectAPI.getParentCauses()
}
// Getting the parent international to show on the dropdown.
export const getParentInternational = () => {
  return GrantConnectAPI.getParentInternational()
}
// Getting the parent population to show on the dropdown.
export const getParentPopulation = () => {
  return GrantConnectAPI.getParentPopulation()
}

// Getting the parent causes to show on the dropdown.
export const getParentRegions = () => {
  return GrantConnectAPI.getParentRegions()
}

// Getting the parent causes to show on the dropdown.
export const getTaxonomy = term => {
  // const callback = _.memoize(term => GrantConnectAPI.getFullTaxonomy(term))
  // return callback(term)
}

// Getting the child causes to show on the dropdown.
export const getChildTemsByUuid = (uuid, term) => {
  return GrantConnectAPI.getChildTemsByUuid(uuid, term)
}

// Getting the child causes to show on the dropdown.
export const getTermTreeByParent = (parentUuid, vocabulary) => {
  return GrantConnectAPI.getTermTreeByParent(parentUuid, vocabulary)
}

export const getSearchResults = searchArguments => {
  // @TODO: Change this mapping to look on the API.
  const searchLanguage = {
    en: 37194,
    fr: 37195,
    bi: 37196,
    unknown: 37197
  }

  if (typeof searchArguments.search_fulltext !== 'undefined') {
    searchArguments.search_fulltext = `"${searchArguments.search_fulltext}"`

    if (typeof searchArguments.sort_by === 'undefined') {
      searchArguments.sort_by = 'search_api_relevance'
    }
  } else {
    if (typeof searchArguments.sort_by === 'undefined') {
      searchArguments.sort_by = 'search_api_relevance'
    }
  }

  if (typeof searchArguments.language !== 'undefined') {
    searchArguments.language = searchLanguage[searchArguments.language]
  }

  if (typeof searchArguments.items_per_page === 'undefined') {
    searchArguments.items_per_page = localStorage.cardsView === 'collapsed' ? 25 : 10
  }

  // Fixing multiple facets combined.
  let lastFacetIndex = 0
  let combinedFacets = []

  for (let i = 0; i < Object.keys(searchArguments).length; i++) {
    if (typeof searchArguments[`f[${i}]`] !== 'undefined') {
      lastFacetIndex = i

      if (searchArguments[`f[${i}]`].indexOf(',') > -1) {
        combinedFacets.push(searchArguments[`f[${i}]`])

        searchArguments[`f[${i}]`] = searchArguments[`f[${i}]`].substring(
          0,
          searchArguments[`f[${i}]`].indexOf(',')
        )
      }
    }
  }

  combinedFacets.forEach(combinedFacet => {
    let facetInfo = combinedFacet.split(':')
    let facetName = facetInfo[0]
    let facetIds = facetInfo[1].split(',')

    facetIds.forEach((facetId, facetIdIndex) => {
      // Ignore the first id because it's already set.
      if (facetIdIndex > 0) {
        ++lastFacetIndex

        searchArguments[`f[${lastFacetIndex}]`] = `${facetName}:${facetId}`
      }
    })
  })

  return GrantConnectAPI.getSearchResults(locationSearch.stringify(searchArguments))
}

const { t } = getLanguage()

export const formatSearchResults = searchResults => {
  const { t } = getLanguage()
  let formattedResults = []

  if (typeof searchResults.search_results !== 'undefined') {
    searchResults.search_results.map(searchResult => {
      /* Open to Requests */
      let requestStatus = t.search.openRequests
      let requestStatusIcon = <Check />

      if (searchResult.open_requests === 'No') {
        requestStatus = t.search.closeRequests
        requestStatusIcon = <Close />
      } else if (searchResult.open_requests === 'Unknown') {
        requestStatus = ''
        requestStatusIcon = ''
      }
      /* ENDOF: Open to Requests */

      /* Deadline */
      const deadlineInfo = getDeadlineInfoFromResult(searchResult)
      /* ENDOF: Deadline */

      /* Profile */
      const fullDateToday = new Date(Date.now())
      const changedDate = new Date(parseInt(searchResult.changed, 0) * 1000)
      const daysDifference = Math.floor((fullDateToday - changedDate) / 1000 / 60 / 60 / 24)
      let notificationIcon = ''
      let notification = ''

      if (daysDifference <= 14) {
        if (searchResult.changed === searchResult.created) {
          notificationIcon = <NewReleases />
          notification = t.cards.profileNew
        } else {
          notificationIcon = <Update />
          notification = t.cards.profileUpdated
        }
      }
      /* ENDOF: Profile */
      const locationIcon = <LocationOn />

      return formattedResults.push({
        funderPrograms: `${t.funder.funderPrograms}: ${searchResult.program_count}`,
        location: !searchResult.locality
          ? ''
          : `${t.cards.headquarters}: ${searchResult.locality}, ${searchResult.administrative_area}`,
        locationIcon: locationIcon,
        featured: searchResult.featured,
        nid: searchResult.uuid,
        funderId: searchResult.nid,
        label: searchResult.title,
        teaser: searchResult.cause,
        notificationIcon: notificationIcon,
        notification: notification,
        typicalGift:
          searchResult.typical_gift !== '' ? formatNumber(searchResult.typical_gift) : '-',
        buttonLabel: t.pipeline.addToPipeline,
        buttonClass: 'add',
        requestStatusIcon: requestStatusIcon,
        requestStatus: requestStatus,
        revenue:
          searchResult.estimated_capacity !== ''
            ? formatSINumber(searchResult.estimated_capacity)
            : '-',
        deadlineIcon: deadlineInfo.deadlineIcon,
        deadlineClass: deadlineInfo.colorClass,
        deadlineDate: deadlineInfo.deadlineDate,
        deadline:
          hasViewStorage && localStorage.cardsView === 'collapsed'
            ? deadlineInfo.deadlineTextShort
            : renderHTML(deadlineInfo.deadlineText)
      })
    })
  }

  return formattedResults
}

export const getDeadlineInfoFromResult = searchResult => {
  const deadLineDateTimeStamp = searchResult.next_deadline_date
  let deadlineIcon = ''
  let deadlineText = ''
  let deadlineTextShort = ''
  let colorClass = 'gray'
  let deadlineDate = ''

  // Handling inconsistend data from the API.
  searchResult.ongoing = searchResult.ongoing === false ? '0' : searchResult.ongoing

  if (deadLineDateTimeStamp !== '' && deadLineDateTimeStamp !== null) {
    // const monthNames = getMonthNames()
    deadlineDate = new Date(deadLineDateTimeStamp * 1000)
    deadlineDate = convertISODateToLocalDate(deadlineDate)
    const dateToday = new Date()
    const diffWeeks = Math.round((deadlineDate - dateToday) / 604800000)

    // Updating the values.
    deadlineIcon = <AlarmOn />
    deadlineText = `${t.funder.deadlineFor}: `
    //console.log(deadlineDate.getYear());
    if (deadlineDate.getFullYear() != 1970) {
      deadlineTextShort = `${monthNames[deadlineDate.getMonth()].substring(
        0,
        3
      )}. ${deadlineDate.getDate()}`
    }
    /*
     * Color: It is also denoted using color, both in the text of the date
     * and with a colored border on the left side of the card.
     * Each color represents a state of priority:
     *
     * Red: denotes a program deadline approaching in 2-6 weeks
     * Yellow: a program deadline approaching in 2-3 months
     * Green: a program deadline approaching in greater than 3 months /
     * denotes a funder whose deadline is set to “ongoing”
     * Grey: no specific program deadline.
     */
    if (searchResult.ongoing !== null && parseInt(searchResult.ongoing, 0) !== 0) {
      colorClass = 'green'
      deadlineDate = 'Ongoing'
    } else {
      if (diffWeeks >= 0 && diffWeeks <= 6) {
        colorClass = 'red'
      } else if (diffWeeks > 6 && diffWeeks <= 12) {
        colorClass = 'yellow'
      } else if (diffWeeks > 12) {
        colorClass = 'green'
      }
    }
  }

  // If the Ongoing Flag === 1, it's always green.
  if (parseInt(searchResult.ongoing, 0) === 1 || searchResult.ongoing === true) {
    deadlineIcon = <AlarmOn />
    colorClass = 'green'
    deadlineText = deadlineTextShort = t.funder.ongoing
  }

  return {
    deadlineIcon,
    deadlineText,
    colorClass,
    deadlineTextShort,
    deadlineDate
  }
}

export const ITEMS_TO_DISPLAY = 5

export const getSearchFacetsFromResults = searchResults => {
  const formattedFacets = []
  const { t } = getLanguage()
  searchResults.facets.map((facet, index) => {
    if (typeof facet[0] !== 'undefined') {
      const facetId = Object.keys(facet[0])[0]
      var facetTitle = Object.keys(facet[0])[0]
      if (!_.isEmpty(t.facets[facetId])) {
        facetTitle = t.facets[facetId]
      }

      formattedFacets.push({
        name: facetId,
        data: {
          type: facetId === 'type_support' ? 'checkboxes' : 'links',
          title: facetTitle,
          id: index,
          itemsToDisplay: [],
          items: []
        }
      })

      if (facet[0][facetId].length > ITEMS_TO_DISPLAY) {
        if (!_.isEmpty(formattedFacets[index])) {
          formattedFacets[index].data.buttonLabel = t.facets.showMore.replace(
            '{countResults}',
            facet[0][facetId].length - ITEMS_TO_DISPLAY
          )
        }
      }
      if (facet[0][facetId].length > 0) {
        facet[0][facetId].map((facetItem, facetItemIndex) => {
          if (typeof formattedFacets[index] !== 'undefined') {
            formattedFacets[index].data.items.push({
              id: facetItem.values.id,
              label: `${facetItem.values.value} (${facetItem.values.count})`,
              url: facetItem.url,
              children: typeof facetItem.children !== 'undefined' ? facetItem.children : null
            })
          }

          if (facetItemIndex < ITEMS_TO_DISPLAY) {
            if (typeof formattedFacets[index] !== 'undefined') {
              formattedFacets[index].data.itemsToDisplay.push({
                id: facetItem.values.id,
                label: `${facetItem.values.value} (${facetItem.values.count})`,
                url: facetItem.url,
                children: typeof facetItem.children !== 'undefined' ? facetItem.children : null
              })
            }
          }

          return formattedFacets
        })
      }
    }
    return formattedFacets
  })

  return formattedFacets
}

export const uglifyFacets = queryStrings => {
  // @TODO: Create an admin interface to map them.
  const facetsMapping = {
    administrative_area: 'funder_location',
    category: 'category',
    cause: 'causes',
    population: 'populations',
    region: 'new_region',
    type_support: 'types_of_support'
  }
  let updatedQueryString = queryStrings
  let facetIndex = 0

  for (let queryString in queryStrings) {
    if (typeof facetsMapping[queryString] !== 'undefined') {
      updatedQueryString[
        `f[${facetIndex}]`
      ] = `${facetsMapping[queryString]}:${queryStrings[queryString]}`
      delete queryStrings[queryString]
      facetIndex++
    }
  }

  return updatedQueryString
}

export const getPagerInfoFromResults = searchResults => {
  return searchResults.pager
}

// Function to get the query string for the search, according to the
// selected fields (Top Search).
export const getSearchArguments = (
  searchText,
  causeText,
  causeId,
  initialCauseText,
  regionText,
  regionId,
  initialRegionText,
  locationSearch
) => {
  let searchArguments = {}

  searchArguments =
    regionText !== initialRegionText
      ? Object.assign(searchArguments, { region: regionId })
      : searchArguments

  searchArguments =
    causeText !== initialCauseText
      ? Object.assign(searchArguments, { cause: causeId })
      : searchArguments

  searchArguments =
    searchText !== ''
      ? Object.assign(searchArguments, { search_fulltext: searchText })
      : searchArguments

  return locationSearch.stringify(searchArguments)
}

export const getSearchFilterArguments = (
  searchLanguage,
  searchOpenToRequest,
  searchTypicalGiftFrom,
  searchTypicalGiftTo,
  searchSorting,
  locationSearch,
  searchText
) => {
  const DEFAULT_VALUE = null
  let searchArguments = locationSearch.parse(window.location.search)
  let sortingValue = 'search_api_relevance'

  if (searchText === '') {
    sortingValue = 'search_api_relevance'
  }

  searchArguments =
    searchLanguage.language !== DEFAULT_VALUE
      ? { ...searchArguments, language: searchLanguage.language }
      : { ...searchArguments, language: undefined }

  searchArguments =
    searchOpenToRequest.value !== DEFAULT_VALUE
      ? { ...searchArguments, open_requests: searchOpenToRequest.value }
      : { ...searchArguments, open_requests: undefined }

  searchArguments =
    searchTypicalGiftFrom.value !== ''
      ? { ...searchArguments, typical_gift_min: searchTypicalGiftFrom.value }
      : { ...searchArguments, typical_gift_min: undefined }

  searchArguments =
    searchTypicalGiftTo.value !== ''
      ? { ...searchArguments, typical_gift_max: searchTypicalGiftTo.value }
      : { ...searchArguments, typical_gift_max: undefined }

  searchArguments =
    searchSorting.value !== sortingValue
      ? { ...searchArguments, sort_by: searchSorting.value }
      : { ...searchArguments, sort_by: undefined }

  return searchArguments
}
