import {
  calculateMedianGiftParams,
  deserializeSearchParams,
  serializeSearchParams
} from './helpers'

describe('serializeSearchParams', () => {
  it('should correctly serialize all params', () => {
    const params = serializeSearchParams({
      language: 'english',
      openToRequests: 'yes',
      sortBy: 'name',
      searchText: 'search'
    })
    expect(params).toEqual(
      '?language__in=english&ordering=name&search=search&open_to_requests__in=yes'
    )
  })
  it('should correctly serialize partial params without search text', () => {
    const params = serializeSearchParams({
      language: 'english',
      openToRequests: 'yes',
      sortBy: 'name'
    })
    expect(params).toEqual('?language__in=english&ordering=name&open_to_requests__in=yes')
  })
  it('should correctly serialize partial params without language and search text', () => {
    const params = serializeSearchParams({
      openToRequests: 'yes',
      sortBy: 'name'
    })
    expect(params).toEqual('?ordering=name&open_to_requests__in=yes')
  })
  it('should correctly serialize partial params without language, search text and sortBy', () => {
    const params = serializeSearchParams({
      openToRequests: 'yes'
    })
    expect(params).toEqual('?open_to_requests__in=yes')
  })
  it('should return empty string if no params passed', () => {
    const params = serializeSearchParams({})
    expect(params).toEqual('')
  })
  it('should correctly serialize params with pagination data', () => {
    const params = serializeSearchParams({
      language: 'english',
      openToRequests: 'yes',
      sortBy: 'name',
      searchText: 'search',
      pageNumber: 2,
      viewsPerPage: 50
    })
    expect(params).toEqual(
      '?language__in=english&ordering=name&search=search&open_to_requests__in=yes&limit=50&offset=50'
    )
  })
  it('should correctly serialize language params', () => {
    expect(
      serializeSearchParams({
        language: 'english__french__bilingual__unknown'
      })
    ).toEqual('?language__in=english__french__bilingual__unknown')
    expect(
      serializeSearchParams({
        language: 'english'
      })
    ).toEqual('?language__in=english')
    expect(
      serializeSearchParams({
        language: 'french'
      })
    ).toEqual('?language__in=french')
    expect(
      serializeSearchParams({
        language: 'bilingual'
      })
    ).toEqual('?language__in=bilingual')
  })
  it('should correctly serialize median gift sizes when both given', () => {
    expect(serializeSearchParams({ medianGiftMax: 100, medianGiftMin: 0 })).toEqual(
      '?median_gift_size__range=0__100'
    )
  })
  it('should correctly serialize median gift sizes when max given', () => {
    expect(serializeSearchParams({ medianGiftMax: 100 })).toEqual('?median_gift_size__lte=100')
  })
  it('should correctly serialize median gift sizes when min given', () => {
    expect(serializeSearchParams({ medianGiftMin: 100 })).toEqual('?median_gift_size__gte=100')
  })
  it('should correctly serialize open to requests when value is yes', () => {
    expect(serializeSearchParams({ openToRequests: 'yes' })).toEqual('?open_to_requests__in=yes')
  })
  it('should correctly serialize open to requests when value is no', () => {
    expect(serializeSearchParams({ openToRequests: 'no' })).toEqual('?open_to_requests__in=no')
  })
  it('should correctly serialize open to requests when value is unknown', () => {
    expect(serializeSearchParams({ openToRequests: 'unknown' })).toEqual(
      '?open_to_requests__in=unknown'
    )
  })
  it('should correctly serialize open to requests when value is all', () => {
    expect(serializeSearchParams({ openToRequests: 'all' })).toEqual('')
  })
  it('should correctly serialize when ordering by name', () => {
    expect(serializeSearchParams({ sortBy: 'name' })).toEqual('?ordering=name')
  })
  it('should correctly serialize when ordering by capacity_score', () => {
    expect(serializeSearchParams({ sortBy: 'capacity_score' })).toEqual('?ordering=capacity_score')
  })
  it('should correctly serialize when ordering by median_gift_size', () => {
    expect(serializeSearchParams({ sortBy: 'median_gift_size' })).toEqual(
      '?ordering=median_gift_size'
    )
  })
  it('should correctly serialize ordering when match is passed', () => {
    expect(serializeSearchParams({ sortBy: 'match' })).toEqual('')
  })

  it('should correctly serialize facet params', () => {
    expect(
      serializeSearchParams({
        selected: [
          { id: 0, facetType: 'cause', name: 'cause' },
          { id: 1, facetType: 'category', name: 'category' }
        ]
      })
    ).toEqual('?cause__in=0&category__in=1')
  })
  it('should correctly serialize a single searchField and value', () => {
    expect(serializeSearchParams({ searchText: 'test', searchFields: ['name'] })).toEqual(
      '?search=name%3Atest'
    )
  })
  it('should correctly serialize a multiple searchFields with values', () => {
    expect(serializeSearchParams({ searchText: 'test', searchFields: ['name', 'alias'] })).toEqual(
      '?search=name%3Atest&search=alias%3Atest'
    )
  })
})

describe('deserializeSearchParams', () => {
  it('should correctly deserialize language params for all', () => {
    const params = '?language__in=english__french__bilingual__unknown'
    expect(deserializeSearchParams(params)).toEqual({
      language: 'english__french__bilingual__unknown'
    })
  })
  it('should correctly deserialize language params for en', () => {
    const params = '?language__in=english'
    expect(deserializeSearchParams(params)).toEqual({ language: 'english' })
  })
  it('should correctly deserialize language params for fr', () => {
    const params = '?language__in=french'
    expect(deserializeSearchParams(params)).toEqual({ language: 'french' })
  })
  it('should correctly deserialize language params for bi', () => {
    const params = '?language__in=bilingual'
    expect(deserializeSearchParams(params)).toEqual({ language: 'bilingual' })
  })
  it('should correctly deserialize open to requests', () => {
    const params = '?open_to_requests__in=yes'
    expect(deserializeSearchParams(params)).toEqual({ openToRequests: 'yes' })
  })
  it('should correctly deserialize median gift lte', () => {
    const params = '?median_gift_size__lte=100'
    expect(deserializeSearchParams(params)).toEqual({ medianGiftMax: 100 })
  })
  it('should correctly deserialize median gift gte', () => {
    const params = '?median_gift_size__gte=100'
    expect(deserializeSearchParams(params)).toEqual({ medianGiftMin: 100 })
  })
  it('should correctly deserialize median gift range', () => {
    const params = '?median_gift_size__range=100__200'
    expect(deserializeSearchParams(params)).toEqual({ medianGiftMin: 100, medianGiftMax: 200 })
  })
  it('should correctly deserialize selected facet filters', () => {
    const params = '?causes__in=488__387&regions__in=1005&populations__in=7'
    expect(deserializeSearchParams(params).selected).toEqual([
      {
        id: 488,
        facetType: 'causes'
      },
      {
        id: 387,
        facetType: 'causes'
      },
      {
        id: 1005,
        facetType: 'regions'
      },
      {
        id: 7,
        facetType: 'populations'
      }
    ])
  })
})

describe('calculateMedianGiftParams', () => {
  it('should return empty object when min and max not defined', () => {
    expect(calculateMedianGiftParams()).toEqual({})
  })
  it('should return lte params when only max defined', () => {
    expect(calculateMedianGiftParams(undefined, 100)).toEqual({ median_gift_size__lte: 100 })
  })
  it('should return gte params when only min defined', () => {
    expect(calculateMedianGiftParams(100, undefined)).toEqual({ median_gift_size__gte: 100 })
  })
  it('should return range when both min and max defined', () => {
    expect(calculateMedianGiftParams(100, 200)).toEqual({ median_gift_size__range: '100__200' })
  })
})
