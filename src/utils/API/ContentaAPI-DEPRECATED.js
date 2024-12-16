// OAuth.
import * as OAuth from '../OAuth/ContentaOauth-DEPRECATED'

// API URL.
import { getBaseURL } from '../../config/env'

// Helpers.
import _ from 'lodash'
import { getLanguage } from 'data/locale'

const UrlPathObject = window.location.pathname.split('/')
const pathLanguage = UrlPathObject[1] === 'fr' ? '/fr' : ''

const api = `${getBaseURL()}${pathLanguage}`
const headers = OAuth.getHeaders()

// Getting all the results from the search autocomplete field.
export const getFunderGiftByCause = _.memoize(nid => {
  return fetch(`${api}/jsonapi/gift/breakdown/cause?funder=${nid}&_format=json`, {
    method: 'GET',
    headers
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(data => {
      return data
    })
    .catch(function (error) {
      manageError(error)
    })
})
// Getting all the results from the search autocomplete field.
export const getFunderGiftByRegion = _.memoize(nid => {
  return fetch(`${api}/jsonapi/gift/breakdown/region?funder=${nid}&_format=json`, {
    method: 'GET',
    headers
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(data => {
      return data
    })
    .catch(function (error) {
      manageError(error)
    })
})

// Getting all the results from the search autocomplete field.
export const getFunderResultData = _.memoize(searchText => {
  return fetch(`${api}/jsonapi/funder/autocomplete?string=${searchText}`, {
    method: 'GET',
    headers
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(AutoCompleteResults => JSON.stringify(AutoCompleteResults))
    .catch(function (error) {
      manageError(error)
    })
})

// Getting all parent causes.
export const getCSV = () => {
  const date = new Date()
  return fetch(
    `${api}/jsonapi/opportunity/csv/Pipeline-GrantConnect-${date.getMonth()}${date.getDate()}${date.getFullYear()}`,
    {
      method: 'GET',
      headers
    }
  )
    .then(handleErrors)
    .catch(function (error) {
      manageError(error)
    })
}

// Getting full taxonomy.
export const getFullTaxonomy = _.memoize(taxonomyName => {
  return fetch(`${api}/jsonapi/taxonomy/tree/${taxonomyName}`, {
    method: 'GET',
    headers
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(data => {
      return data
    })
    .catch(function (error) {
      manageError(error)
    })
})

// Getting all parent causes.
export const getParentCauses = _.memoize(() => {
  return fetch(`${api}/jsonapi/taxonomy/tree/causes`, {
    method: 'GET',
    headers
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(data => data)
    .catch(function (error) {
      manageError(error)
    })
})
// Getting all parent International.
export const getParentInternational = _.memoize(() => {
  return fetch(`${api}/jsonapi/taxonomy/tree/international`, {
    method: 'GET',
    headers
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(data => data)
    .catch(function (error) {
      manageError(error)
    })
})
// Getting all parent Population.
export const getParentPopulation = _.memoize(() => {
  return fetch(`${api}/jsonapi/taxonomy/tree/populations`, {
    method: 'GET',
    headers
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(data => data)
    .catch(function (error) {
      manageError(error)
    })
})

// Getting all parent regions.
export const getParentRegions = _.memoize(() => {
  return fetch(`${api}/jsonapi/taxonomy/tree/regions`, {
    method: 'GET',
    headers
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(data => data)
    .catch(function (error) {
      manageError(error)
    })
})

// Getting all child causes based on UUID.
export const getChildTemsByUuid = (uuid, term) => {
  return fetch(`${api}/jsonapi/taxonomy_term/${term}?filter[parent.uuid][value]=${uuid}`, {
    method: 'GET',
    headers
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(data => data.data)
    .catch(function (error) {
      manageError(error)
    })
}

// Getting all child causes based on UUID.
export const getTermTreeByParent = (parentUuid, vocabulary) => {
  return fetch(`${api}/jsonapi/taxonomy/depth?vid=${vocabulary}&tid=${parentUuid}&_format=json`, {
    method: 'GET',
    headers
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(data => data)
    .catch(function (error) {
      manageError(error)
    })
}

// Getting all regions.
export const getAllRegions = () => {
  return fetch(`${api}/jsonapi/taxonomy_term/regions`, {
    method: 'GET',
    headers
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(data => data)
    .catch(function (error) {
      manageError(error)
    })
}

// Getting all stages.
export const getAllStages = () => {
  return fetch(`${api}/jsonapi/taxonomy_term/pipeline_stage`, {
    method: 'GET',
    headers
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(data => data)
    .catch(function (error) {
      manageError(error)
    })
}

export const getSearchResults = _.memoize(queryStrings => {
  return fetch(`${api}/jsonapi/search/funder?${queryStrings}&_format=json`, {
    method: 'GET',
    headers
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(searchResults => searchResults)
    .catch(function (error) {
      manageError(error)
    })
})

export const getFunderInfoByUuid = uuid => {
  return fetch(
    `${api}/jsonapi/node/funder/${uuid}?include=cause,industry,activity,field_status,geographic_scope,international,population,new_region,program,language`,
    {
      method: 'GET',
      headers
    }
  )
    .then(handleErrors)
    .then(res => res.json())
    .then(funderInfo => funderInfo)
    .catch(function (error) {
      manageError(error)
    })
}

export const getRelatedData = rawApiUrl => {
  let apiUrl = rawApiUrl
  if (_.has(rawApiUrl, 'href')) {
    apiUrl = rawApiUrl.href
  }
  if (apiUrl.indexOf('://') === -1) {
    apiUrl = `${api}${apiUrl}`
  }

  const baseApi = `${getBaseURL()}`
  if (baseApi === 'https://app-beta-grantconnect-ca.eztest.ocls.ca/drupal') {
    apiUrl = apiUrl.replace(
      'app.beta.grantconnect.ca',
      'app-beta-grantconnect-ca.eztest.ocls.ca/drupal'
    )
  }
  return fetch(apiUrl, {
    method: 'GET',
    headers
  })
    .then(handleErrors)
    .then(res => res.json())
    .catch(function (error) {
      manageError(error)
    })
}

export const getCardsActionsOptions = () => {
  return fetch(`${api}/jsonapi/taxonomy_term/flag`, {
    method: 'GET',
    headers
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(flags => flags)
    .catch(function (error) {
      manageError(error)
    })
}

export const getAllRoles = () => {
  return fetch(`${api}/jsonapi/taxonomy_term/role`, {
    method: 'GET',
    headers
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(roles => roles)
    .catch(function (error) {
      manageError(error)
    })
}

const getGiftDataUrl = _.memoize(url => {
  return fetch(url, {
    method: 'GET',
    headers
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(roles => roles)
    .catch(function (error) {
      manageError(error)
    })
})

export const getGiftData = (funderId, offset, results, sort_field, sort_direction) => {
  // const url = `${api}/jsonapi/gift/gift?_format=json&filter[funder][value]=${funderId}&page[offset]=${offset}&page[limit]=${results}&sort[sort-${sort_field}][path]=${sort_field}&sort[sort-${sort_field}][direction]=${sort_direction}&include=cause,charity,international,population`;
  const url = `${api}/jsonapi/gift/gift/advanced?filter[funder][value]=${funderId}&page[offset]=${offset}&page[limit]=${results}&sort[sort-${sort_field}][path]=${sort_field}&sort[sort-${sort_field}][direction]=${sort_direction}&include=cause,charity,international,population`
  return getGiftDataUrl(url)
}

export const getGiftDataWithArguments = args => {
  const url = `${api}/jsonapi/gift/gift/advanced?${args}`
  return fetch(url, {
    method: 'GET',
    headers
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(roles => roles)
    .catch(function (error) {
      manageError(error)
    })
}

export const getFinancialData = _.memoize(funderId => {
  return fetch(
    `${api}/jsonapi/financial/financial?filter[funder.nid][value]=${funderId}&sort[sort-year][path]=year&sort[sort-year][direction]=DESC&page[offset]=0`,
    {
      method: 'GET',
      headers
    }
  )
    .then(handleErrors)
    .then(res => res.json())
    .then(financialData => financialData)
    .catch(function (error) {
      manageError(error)
    })
})

export const getPipelineData = () => {
  return fetch(`${api}/jsonapi/opportunity/view?_format=json`, {
    method: 'GET',
    headers
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(oportunity => oportunity)
    .catch(function (error) {
      manageError(error)
    })
}
export const getPipelineDataArchived = () => {
  return fetch(`${api}/jsonapi/opportunity/viewreset?_format=json`, {
    method: 'GET',
    headers
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(oportunity => oportunity)
    .catch(function (error) {
      manageError(error)
    })
}

export const getPipelineHideData = () => {
  return fetch(`${api}/jsonapi/hide-opportunity?_format=json`, {
    method: 'GET',
    headers
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(oportunity => oportunity)
    .catch(function (error) {
      manageError(error)
    })
}

export const getPagerInfo = _.memoize(pagerArguments => {
  return fetch(`${api}/jsonapi/gift/pager?_format=json&${pagerArguments}`, {
    method: 'GET',
    headers
  })
    .then(res => res.json())
    .then(pagerInfo => pagerInfo)
})

export const getOpportunity = nid => {
  return fetch(`${api}/jsonapi/opportunities/byfunder/${nid}?_format=json`, {
    method: 'GET',
    headers
  })
    .then(res => res.json())
    .then(opportunity => opportunity)
}

export const getUserInfo = _.memoize(() => {
  return fetch(`${api}/jsonapi/user/actual/?_format=json`, {
    method: 'GET',
    headers
  }).then(res => res.json())
})

export const updateOpportunity = updatedOpportunity => {
  return fetch(`${api}/jsonapi/node/opportunity/${updatedOpportunity.id}`, {
    method: 'PATCH',
    headers: {
      ...headers,
      'Content-Type': 'application/vnd.api+json',
      Accept: 'application/vnd.api+json'
    },
    body: JSON.stringify({ data: updatedOpportunity })
  }).then(res => res.json())
}

export const getSaveSearch = () => {
  return fetch(`${api}/jsonapi/saved-search/get?`, {
    method: 'GET',
    headers: {
      ...headers,
      'Content-Type': 'application/vnd.api+json',
      Accept: 'application/vnd.api+json'
    }
  })
    .then(res => res.json())
    .then(searchinfo => searchinfo)
}

export const createSaveSearch = (searchTitle, searchURL) => {
  return fetch(
    `${api}/jsonapi/saved-search/post?uri=${encodeURIComponent(
      searchURL
    )}&title=${encodeURIComponent(searchTitle)}`,
    {
      method: 'GET',
      headers: {
        ...headers,
        'Content-Type': 'application/vnd.api+json',
        Accept: 'application/vnd.api+json'
      }
    }
  ).then(res => res.json())
}

export const deleteSaveSearch = (url, title) => {
  return fetch(
    `${api}/jsonapi/saved-search/delete?uri=${encodeURIComponent(url)}&title=${encodeURIComponent(
      title
    )}`,
    {
      method: 'GET',
      headers: {
        ...headers,
        'Content-Type': 'application/vnd.api+json',
        Accept: 'application/vnd.api+json'
      }
    }
  ).then(res => res.json())
}

export const createOpportunity = opportunity => {
  return fetch(`${api}/jsonapi/node/opportunity`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/vnd.api+json',
      Accept: 'application/vnd.api+json'
    },
    body: JSON.stringify({ data: opportunity })
  }).then(res => res.json())
}

export const getFunderNotes = nid => {
  return fetch(
    `${api}/jsonapi/comment/note?filter[entity_id.id][value]=${nid}&sort[sort-changed][path]=changed&sort[sort-changed][direction]=DESC&filter[status][value]=1`,
    {
      method: 'GET',
      headers
    }
  )
    .then(res => res.json())
    .then(notes => notes)
}

export const updateNote = (updatedNote, noteId) => {
  return fetch(`${api}/jsonapi/comment/note/${noteId}`, {
    method: 'PATCH',
    headers: {
      ...headers,
      'Content-Type': 'application/vnd.api+json',
      Accept: 'application/vnd.api+json'
    },
    body: JSON.stringify({ data: updatedNote })
  }).then(res => res.json())
}

export const createNote = newNote => {
  return fetch(`${api}/jsonapi/comment/note`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/vnd.api+json',
      Accept: 'application/vnd.api+json'
    },
    body: JSON.stringify({ data: newNote })
  })
    .then(res => res.json())
    .then(note => note)
}

export const deleteNote = (updatedNote, noteId) => {
  return fetch(`${api}/jsonapi/comment/note/${noteId}`, {
    method: 'DELETE',
    headers: {
      ...headers,
      'Content-Type': 'application/vnd.api+json',
      Accept: 'application/vnd.api+json'
    }
    //  body: JSON.stringify({ data: updatedNote })
  }).then(res => {
    return res.status
  })
}

export const editUsername = (username, newUsername, password) => {
  const params = {
    username: username,
    newUsername: newUsername,
    password: password
  }
  return fetch(`${api}/jsonapi/edit_account/update_username`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/vnd.api+json',
      Accept: 'application/vnd.api+json'
    },
    body: JSON.stringify(params)
  })
    .then(res => res.json())
    .then(note => note)
}
export const updatePasswordProfile = (username, password, newPassword) => {
  const params = {
    username: username,
    password: password,
    newPassword: newPassword
  }
  return fetch(`${api}/jsonapi/edit_account/update_password`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/vnd.api+json',
      Accept: 'application/vnd.api+json'
    },
    body: JSON.stringify(params)
  })
    .then(res => res.json())
    .then(note => note)
}
const manageError = error => {
  if (window.location.pathname !== '/login' && window.location.pathname !== '/fr/login') {
    const { language } = getLanguage()
    if (language === 'fr') {
      window.location.href = '/fr/login'
    } else {
      window.location.href = '/login'
    }
  } else {
    localStorage.clear()
  }
}

function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText)
  }

  return response
}
