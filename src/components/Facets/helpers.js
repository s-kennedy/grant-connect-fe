import { useSelector } from 'react-redux'

import { selectSelectedFacets } from 'store/selectors/facets'

export const getPrimaryText = (name, docCount) =>
  docCount && docCount != '0' ? `${name} (${docCount})` : name

/**
 * Determines whether the facet item is currently selected, or has any currently selected children
 * @param {Array} selectedFacets The list of currently selected facets retrieved from `selectSelectedFacets`
 * @param {Object} facetItem The current facet item being processed, contains `id` and `children`
 * @param {String} facetType The facet type we're looking for selections in (causes, regions, etc.)
 * @returns {Boolean} True if element, or any child is selected. False otherwise
 */
export const hasSelection = (selectedFacets, facetItem, facetType) => {
  return selectedFacets.some(
    ({ id, facetType: selectedFacetType }) =>
      (facetItem.id === id && facetType === selectedFacetType) ||
      (facetItem.children &&
        facetItem.children.some(item => hasSelection(selectedFacets, item, facetType)))
  )
}

/**
 * Sorts the Facet items based on whether or not they are selected, followed by their docCount
 * @param {*} a The `a` parameter provided in .sort
 * @param {*} b The `b` parameter provided in .sort
 * @param {*} facetType The facetType we are sorting for (to detect selections of that type)
 * @param {*} selectedFacets The array of selectedFacets retrieved from the selector
 * @returns {Integer} 0, -1, or 1 depending on the order the item should be placed relative to other item
 */
export const facetSort = (a, b, facetType, selectedFacets) => {
  if (hasSelection(selectedFacets, a, facetType) && !hasSelection(selectedFacets, b, facetType)) {
    return -1
  } else if (
    !hasSelection(selectedFacets, a, facetType) &&
    hasSelection(selectedFacets, b, facetType)
  )
    return 1
  else return b.docCount - a.docCount
}
