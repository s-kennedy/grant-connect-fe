const defaultResults = []

export const selectCauses = ({ facets: { causes } }) => causes || defaultResults
export const selectRegions = ({ facets: { regions } }) => regions || defaultResults
export const selectInternationals = ({ facets: { internationals } }) =>
  internationals || defaultResults
export const selectPopulations = ({ facets: { populations } }) => populations || defaultResults
export const selectSupports = ({ facets: { supports } }) => supports || defaultResults
export const selectCategories = ({ facets: { categories } }) => categories || defaultResults
export const selectHeadquarters = ({ facets: { headquarters } }) => headquarters || defaultResults
export const selectSelectedFacets = ({ facets: { selected } }) => selected || defaultResults

const getValuesRecursively = (item, facetType, parentFacetIds = []) => {
  return [
    ...item.children
      .map(child =>
        getValuesRecursively(child, facetType, (parentFacetIds = [...parentFacetIds, item.id]))
      )
      .flat(),
    getValues(item, facetType, parentFacetIds)
  ]
}

const getValues = (item, facetType, parentFacetIds) => {
  return {
    title: item.name,
    id: item.id,
    parent: `autocomplete.${facetType}`,
    facetType,
    parentFacetIds:
      parentFacetIds?.filter(
        (facetId, index, self) =>
          self.findIndex(t => t === facetId) === index && facetId !== item.id
      ) || []
  }
}

export const selectflatSearchFacets = ({
  facets: { causes, regions, internationals, populations, supports }
}) => {
  return [
    ...causes.map(item => getValuesRecursively(item, 'causes')).flat(),
    ...regions.map(item => getValuesRecursively(item, 'regions')).flat(),
    ...internationals.map(item => getValuesRecursively(item, 'internationals')).flat(),
    ...populations.map(item => getValuesRecursively(item, 'populations')).flat(),
    ...supports.map(item => getValues(item, 'supports')).flat()
  ]
}

export const selectAreFacetsAtIntialState = ({ facets }) =>
  Object.values(facets).some(facet => !!facet.length)
