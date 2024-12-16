// App Language.
import { getLanguage } from 'data/locale'
import { getI18n } from 'react-i18next'

export const numberWithCommas = x => {
  let parts = x.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

export const stripTags = string => {
  let div = document.createElement('div')
  div.innerHTML = string
  let text = div.textContent || div.innerText || ''

  return text
}

export const formatString = str => {
  var frags = str.split('_')

  for (let i = 0; i < frags.length; i++) {
    frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1)
  }

  return frags.join(' ')
}

export const formatNumber = (number, parentheses = false) => {
  if (number !== null && parseInt(number, 0) !== 0) {
    let value = parseInt(number, 0);
    if (parentheses && value < 0) {
      value = `(${Math.abs(value)})`;
    }
    const { language } = getLanguage()
    if (language === 'en') {
      return `$${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
    }
    return `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} $`
  }

  return 0
}

export const formatSINumber = (num, digits) => {
  const { language } = getLanguage()
  const absNum = Math.abs(num)
  const sign = num < 0 ? '-' : ''

  const si = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'K' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' }
  ]
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
  let i

  for (i = si.length - 1; i > 0; i--) {
    if (absNum >= si[i].value) {
      break
    }
  }

  let formattedNumber = (absNum / si[i].value).toFixed(digits).replace(rx, '$1')

  if (((absNum / si[i].value.toFixed(digits).replace(rx, '$1')) % 1) * 1000 === 500) {
    formattedNumber--
  }

  let symbol = si[i].symbol
  if (language === 'en') {
    symbol = symbol === 'G' ? 'B' : symbol
    return `${sign}$${formattedNumber + symbol}`
  }
  return `${sign}${formattedNumber} ${symbol}$`
}

export const sortArrayKey = (arr, key) => {
  let noKey = []
  let withKey = []

  if (Array.isArray(arr)) {
    arr.sort(function (a, b) {
      return a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0
    })

    for (let i in arr) {
      if (parseInt(arr[i][key], 0) === 0) {
        noKey.push(arr[i])
      } else {
        withKey.push(arr[i])
      }
    }

    return withKey.concat(noKey)
  }

  return []
}

// adds offset and limit query params to given URL
export const paginate = ({ url, pageNumber, viewsPerPage }) => {
  if (!pageNumber || !viewsPerPage) {
    return url
  }

  const [base, params] = url.split('?')
  const paginationParams = `limit=${viewsPerPage}&offset=${(pageNumber - 1) * viewsPerPage}`

  if (!params) {
    // no existing query params, add pagination to base
    return `${base}?${paginationParams}`
  } else {
    // existing query params, concatenate pagination params
    return `${url}&${paginationParams}`
  }
}

// given offset and limit values, return `viewsPerPage` and `pageNumber`
export const deserializePaginationParams = ({ offset, limit }) => ({
  viewsPerPage: Math.ceil(limit),
  pageNumber: Math.ceil(offset / limit) + 1
})

// recursively flatten arrays by their children keys
export const flatten = (data = []) => {
  return data.reduce((acc, { children, ...rest }) => {
    acc.push(rest)
    if (children) acc.push(...flatten(children))
    return acc
  }, [])
}

export const addFacetType = (facets = [], facetType) =>
  facets.map(facet => ({ ...facet, facetType }))

export const getFullAddress = address => {
  const street = `${address.streetAddress1 || ''}${
    address.streetAddress2 ? ` ${address.streetAddress2}` : ''
  }`
  return [street, address.city, address.province, address.postalCode].filter(Boolean).join(', ')
}
