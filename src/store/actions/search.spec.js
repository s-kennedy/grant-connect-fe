import { mockFacetCountResponse, mockFacetCountResponseMinimum } from 'mocks/mockFacetCountResponse'
import { mapResponseToFacetsData, updateDocCount } from './helpers'

const mockUpdateFacetsData = [
  {
    category: 'categories',
    updateBuckets: [
      { key: 1059, docCount: 14 },
      { key: 1060, docCount: 100 }
    ]
  },

  {
    category: 'causes',
    updateBuckets: [{ key: 1000, docCount: 200 }]
  }
]

const mockFacetsState = {
  categories: [
    {
      id: 1222,
      name: 'Foo',
      children: [
        { id: 200, name: 'Bar' },
        { id: 1059, name: 'Baz' }
      ]
    },
    { id: 1060, name: 'Baq' }
  ],
  causes: [
    { id: 1000, name: 'Cause' },
    { id: 2000, name: 'Other cause', docCount: 100 }
  ]
}

describe('updateDocCount', () => {
  it('should update facet tree category with facets count', () => {
    const updatedState = JSON.parse(JSON.stringify(mockFacetsState))
    updatedState.categories[0].children[1] = {
      ...updatedState.categories[0].children[1],
      docCount: 14
    }
    updatedState.categories[1] = {
      ...updatedState.categories[1],
      docCount: 100
    }
    updatedState.causes[0] = {
      ...updatedState.causes[0],
      docCount: 200
    }
    // strip outdated `docCount`
    updatedState.causes[1] = {
      id: 2000,
      name: 'Other cause'
    }

    const result = updateDocCount(mockUpdateFacetsData, mockFacetsState)

    expect(result).toEqual(updatedState)
  })
})

describe('mapResponseToFacetsData', () => {
  it('should correctly transform data when dealing with minimal example', () => {
    expect(mapResponseToFacetsData(mockFacetCountResponseMinimum)).toEqual([
      {
        category: 'causes',
        updateBuckets: [
          {
            key: 387,
            docCount: 25
          },
          {
            key: 419,
            docCount: 25
          }
        ]
      }
    ])
  })
  it('should correctly transform data', () => {
    const result = mapResponseToFacetsData(mockFacetCountResponse)

    // check causes
    expect(result[1].category).toEqual('causes')
    expect(result[1].updateBuckets).toEqual([
      {
        docCount: 25,
        key: 387
      },
      {
        docCount: 25,
        key: 419
      },
      {
        docCount: 25,
        key: 495
      },
      {
        docCount: 12,
        key: 488
      },
      {
        docCount: 9,
        key: 462
      },
      {
        docCount: 8,
        key: 398
      },
      {
        docCount: 7,
        key: 389
      },
      {
        docCount: 7,
        key: 391
      },
      {
        docCount: 7,
        key: 450
      },
      {
        docCount: 7,
        key: 489
      }
    ])

    // check populations
    expect(result[2].category).toEqual('populations')
    expect(result[2].updateBuckets).toEqual([
      {
        docCount: 17,
        key: 5
      },
      {
        docCount: 17,
        key: 48
      },
      {
        docCount: 9,
        key: 7
      },
      {
        docCount: 7,
        key: 8
      },
      {
        docCount: 5,
        key: 11
      },
      {
        docCount: 5,
        key: 22
      },
      {
        docCount: 3,
        key: 26
      },
      {
        docCount: 3,
        key: 29
      },
      {
        docCount: 3,
        key: 55
      },
      {
        docCount: 2,
        key: 23
      }
    ])
  })
})
