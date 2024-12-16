import { paginate } from 'utils/helpers'

/* Based on `min` and `max` values determine which query param to use:
 * 1) median_gift_size__range=${min}__${max}
 * 2) median_gift_size__lte=${max}
 * 3) median_gift_size__gte=${min}
 */
export const calculateMedianGiftParams = (min, max) => {
  const minSize = parseInt(min, 10)
  const maxSize = parseInt(max, 10)

  // no query params if min and max not defined
  if (isNaN(minSize) && isNaN(maxSize)) {
    return {}
  }

  // only min defined
  if (!isNaN(minSize) && isNaN(maxSize)) {
    return {
      median_gift_size__gte: minSize
    }
  }

  // only max defined
  if (isNaN(minSize) && !isNaN(maxSize)) {
    return {
      median_gift_size__lte: maxSize
    }
  }

  // both min and max defined
  if (!isNaN(minSize) && !isNaN(maxSize)) {
    return {
      median_gift_size__range: `${minSize}__${maxSize}`
    }
  }
}

const getFacetParams = selected => {
  const groupedFacets = selected.reduce((acc, { id, facetType }) => {
    acc[`${facetType}__in`] = [...(acc[`${facetType}__in`] || []), id]

    return acc
  }, {})

  const paramsObject = Object.keys(groupedFacets).reduce((acc, facetKey) => {
    acc[facetKey] = groupedFacets[facetKey].join('__')

    return acc
  }, {})

  return paramsObject
}

export const serializeSearchParams = ({
  selected = [],
  language,
  openToRequests,
  sortBy,
  searchText,
  pageNumber,
  viewsPerPage,
  medianGiftMin,
  medianGiftMax,
  statusToExclude = '',
  searchFields = []
}) => {
  // mapping between `key` used for network request, and `value` used locally in the app
  const allowedParams = {
    // we should ignore `all` option because having no `language__in` param includes all results
    ...(language && language !== 'all' && { language__in: language }),
    // we should ignore `match` option because having no `ordering` param includes all results
    ...(sortBy && sortBy !== 'match' && { ordering: sortBy }),
    search:
      searchFields.length > 0
        ? searchFields.map(fieldName => `${fieldName}:${searchText}`)
        : searchText,
    // we should ignore `all` option because having no `open_to_requests__in` param includes all results
    ...(openToRequests && openToRequests !== 'all' && { open_to_requests__in: openToRequests }),
    ...calculateMedianGiftParams(medianGiftMin, medianGiftMax),
    ...getFacetParams(selected),
    // we use the status to exclude in the case of hiding dissolved funders from search results
    ...(statusToExclude && { status__exclude: statusToExclude })
  }

  const paramsArray = new URLSearchParams()

  for (const [param, paramValue] of Object.entries(allowedParams)) {
    // Make sure we serialize only truthy values
    if (paramValue) {
      // If multiple values are provided, we create a query string entry for each
      const values = paramValue.toString().split(',')
      values.forEach(value => paramsArray.append(param, value))
    }
  }

  const queryUrl = paramsArray.toString().length > 0 ? `?${paramsArray.toString()}` : ''

  return paginate({ url: queryUrl, pageNumber, viewsPerPage })
}

export const deserializeSearchParams = params => {
  const searchParams = new URLSearchParams(params)

  const deserializedParams = {}
  for (const key of searchParams.keys()) {
    // reconcile key names with search param names

    // Concatenate values of multiple identical query string keys
    const concatenatedValues = searchParams.getAll(key).join(',')

    // no difference between redux store key and search param name
    if (['limit', 'offset'].includes(key)) {
      deserializedParams[key] = concatenatedValues
    }

    if (key === 'open_to_requests__in') {
      deserializedParams.openToRequests = concatenatedValues
    }

    if (key === 'sort_by') {
      deserializedParams.sortBy = concatenatedValues
    }

    if (key === 'language__in') {
      switch (concatenatedValues) {
        case 'all':
          break
        default:
          deserializedParams.language = concatenatedValues
      }
    }

    if (key === 'median_gift_size__lte') {
      deserializedParams.medianGiftMax = parseInt(concatenatedValues, 10)
    }
    if (key === 'median_gift_size__gte') {
      deserializedParams.medianGiftMin = parseInt(concatenatedValues, 10)
    }
    if (key === 'median_gift_size__range') {
      const [min, max] = concatenatedValues.split('__')
      deserializedParams.medianGiftMin = parseInt(min, 10)
      deserializedParams.medianGiftMax = parseInt(max, 10)
    }

    if (key === 'ordering') {
      deserializedParams.sortBy = concatenatedValues
    }

    if (key === 'status__exclude') {
      deserializedParams.status__exclude = concatenatedValues
    }

    const facetTypes = [
      'causes__in',
      'regions__in',
      'populations__in',
      'supports__in',
      'categories__in',
      'headquarters__in',
      'internationals__in'
    ]

    if (facetTypes.includes(key)) {
      const [facetType] = key.split('__in')
      // if multiple facet values are selected for a group, they are divided by `__`
      const [...facetIds] = concatenatedValues.split('__')

      if (!deserializedParams.selected) {
        // first found facet type filter, `selected` needs to be created
        deserializedParams.selected = []
        for (const id of facetIds) {
          deserializedParams.selected = deserializedParams.selected.concat({
            id: parseInt(id, 10),
            facetType
          })
        }
      } else {
        // `selected` already exists so add to the array
        for (const id of facetIds) {
          deserializedParams.selected = deserializedParams.selected.concat({
            id: parseInt(id, 10),
            facetType
          })
        }
      }
    }
  }

  return deserializedParams
}
