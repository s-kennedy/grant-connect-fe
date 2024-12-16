import PropTypes from 'prop-types'
import { Checkbox, ListItem } from 'material-ui'
import { useDispatch, useSelector } from 'react-redux'

import { selectFacet, unSelectFacet } from 'store/actions/facets'
import { selectSelectedFacets } from 'store/selectors/facets'
import { getPrimaryText, hasSelection, facetSort } from './helpers'

/**
 * Determines whether any element in the list, or children of list elements have a docCount
 * @param {Array} facetChildren An array of facets, generally the current items "children"
 * @returns {Boolean} True if any element, or any child has a docCount. False otherwise
 */
const hasDocCount = facetChildren => {
  return facetChildren.some(({ docCount, children }) => docCount || hasDocCount(children))
}

const FacetsNestedListItem = ({ id, facetType, name, items, docCount, indentation, parents }) => {
  const dispatch = useDispatch()
  const selectedFacets = useSelector(selectSelectedFacets)
  const isSelected = selectedFacets.some(
    ({ id: facetId, facetType: type }) => facetId === id && type === facetType
  )

  const itemsWithDocCount = items
    .filter(
      item =>
        item.docCount ||
        hasSelection(selectedFacets, item, facetType) ||
        (facetType === 'regions' && hasDocCount(item.children))
    )
    .sort((a, b) => facetSort(a, b, facetType, selectedFacets))

  const itemsWithSelection = items.filter(item => hasSelection(selectedFacets, item, facetType))

  return (
    <ListItem
      style={{ paddingBottom: '8px', paddingTop: '8px' }}
      primaryText={getPrimaryText(name, docCount)}
      nestedLevel={indentation || 0}
      initiallyOpen={itemsWithSelection.length > 0}
      primaryTogglesNestedList={false}
      leftCheckbox={
        <Checkbox
          checked={isSelected}
          onCheck={() => {
            if (isSelected) {
              dispatch(unSelectFacet({ id }))
            } else {
              dispatch(selectFacet({ id, name, facetType, parents }))
            }
          }}
        />
      }
      nestedItems={itemsWithDocCount.map(({ id: itemId, name: itemName, children, docCount }) => {
        const isSelected = selectedFacets.some(
          ({ id: facetId, facetType: type }) => facetId === itemId && type === facetType
        )

        if (children && children.length > 0) {
          return (
            <FacetsNestedListItem
              indentation={indentation + 1}
              key={itemId}
              id={itemId}
              facetType={facetType}
              name={itemName}
              items={children}
              docCount={docCount}
              parents={[...parents, { id, name, facetType }]}
            />
          )
        } else {
          return (
            <ListItem
              style={{ paddingBottom: '8px', paddingTop: '8px' }}
              key={itemId}
              nestedLevel={indentation + 1 || 0}
              primaryText={getPrimaryText(itemName, docCount)}
              primaryTogglesNestedList={false}
              leftCheckbox={
                <Checkbox
                  checked={isSelected}
                  onCheck={() => {
                    if (isSelected) {
                      dispatch(unSelectFacet({ id: itemId }))
                    } else {
                      dispatch(
                        selectFacet({
                          id: itemId,
                          name: itemName,
                          facetType,
                          parents: [...parents, { id, name, facetType }]
                        })
                      )
                    }
                  }}
                />
              }
            />
          )
        }
      })}
    />
  )
}

FacetsNestedListItem.propTypes = {
  id: PropTypes.number.isRequired,
  facetType: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired,
  parents: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      facetType: PropTypes.string
    })
  )
}

FacetsNestedListItem.defaultProps = {
  parents: []
}

export default FacetsNestedListItem
