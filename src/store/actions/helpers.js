export const updateFacetState = (facet = [], updateBuckets = []) => {
  return facet.reduce((acc, curr) => {
    // list of IDs that need updates
    const updateIds = updateBuckets.map(({ key }) => key)

    const updatedItem = { ...curr }

    if (updateIds.includes(curr.id)) {
      // current facet needs update
      updatedItem.docCount = updateBuckets.find(({ key }) => key === curr.id).docCount
    } else {
      // set docCount = '0' and delete the undefined ones
      typeof updatedItem.docCount === 'undefined'
        ? delete updatedItem.docCount
        : (updatedItem.docCount = '0')
    }

    if (curr.children && curr.children.length) {
      // recursively update children
      updatedItem.children = updateFacetState(curr.children, updateBuckets)
    }

    acc.push(updatedItem)

    return acc
  }, [])
}

/*
 * using `facetCounts` coming from search endpoint response, map through all
 * store facets and update the count based on the ID
 *
 * updateFacetsData: {
 *    category: string,
 *    updateBuckets: {key: number; docCount: number}[]
 *  }[]
 * facetsState: "facets" redux state
 *
 * @returns
 * facetsState - updated with docCount
 */
export const updateDocCount = (updateFacetsData = [], facetsState) => {
  const mapStateToResponse = {
    categories: 'FilterCategories',
    causes: 'FilterCauses',
    populations: 'FilterPopulations',
    internationals: 'FilterInternationals',
    regions: 'FilterRegions',
    supports: 'FilterSupports',
    headquarters: 'FilterHeadquarters'
  }

  const updatedState = {}

  // loop through all facet state items (disregarding `selected`)
  for (const facetStateGroup in mapStateToResponse) {
    const { updateBuckets } =
      updateFacetsData.find(({ category }) => category === facetStateGroup) || {}
    if (updateBuckets) {
      // update every facet state item
      updatedState[facetStateGroup] = updateFacetState(facetsState[facetStateGroup], updateBuckets)
    }
  }

  return updatedState
}

/* transform response data format to `updateFacetsData` */
export const mapResponseToFacetsData = facetsResponse => {
  const mapResponseToState = {
    FilterCategories: 'categories',
    FilterCauses: 'causes',
    FilterPopulations: 'populations',
    FilterInternationals: 'internationals',
    FilterRegions: 'regions',
    FilterSupports: 'supports',
    FilterHeadquarters: 'headquarters'
  }

  const result = []

  for (const facetGroupName in mapResponseToState) {
    const facetGroup = facetsResponse[facetGroupName]
    if (facetGroup) {
      const category = mapResponseToState[facetGroupName]
      result.push({
        category,
        updateBuckets: facetGroup[category].buckets
      })
    }
  }

  return result
}
