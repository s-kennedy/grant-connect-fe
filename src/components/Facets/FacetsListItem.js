import PropTypes from 'prop-types'
import { useState } from 'react'
import { Checkbox, FlatButton, ListItem } from 'material-ui'
import { useDispatch, useSelector } from 'react-redux'

import { selectFacet, unSelectFacet } from 'store/actions/facets'
import { selectSelectedFacets } from 'store/selectors/facets'

import FacetsNestedListItem from './FacetsNestedListItem'
import FacetsModal from './Modal'
import { getPrimaryText, hasSelection, facetSort } from './helpers'
import { useTranslation } from 'react-i18next'

const MAX_NUMBER_OF_ITEMS = 7

const FacetsListItem = ({ facetType, name, items, parents }) => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)

  if (!items || !Array.isArray(items)) return <div />

  const [showModal, setShowModal] = useState(false)
  const selectedFacets = useSelector(selectSelectedFacets)
  const itemsWithDocCount = items
    .filter(
      item => item.docCount || hasSelection(selectedFacets, item, facetType) || item.level === 0
    )
    .sort((a, b) => facetSort(a, b, facetType, selectedFacets))
  const firstSevenItems = itemsWithDocCount.slice(0, MAX_NUMBER_OF_ITEMS)
  const remainingItems = itemsWithDocCount.slice(MAX_NUMBER_OF_ITEMS)
  const dispatch = useDispatch()

  return (
    <>
      <ListItem
        primaryText={name}
        style={{ fontWeight: 700 }}
        nestedLevel={-1} // hack...
        initiallyOpen={true}
        primaryTogglesNestedList={true}
        onNestedListToggle={() => {}}
        nestedItems={
          firstSevenItems &&
          firstSevenItems.map(({ id, name, children, docCount }) => {
            const isSelected = selectedFacets.some(
              ({ id: facetId, facetType: type }) => facetId === id && type === facetType
            )

            if (children && children.length > 0) {
              return (
                <FacetsNestedListItem
                  indentation={0}
                  key={id}
                  id={id}
                  facetType={facetType}
                  name={name}
                  docCount={docCount != '0' ? docCount : (docCount = '')}
                  items={children}
                />
              )
            } else {
              return (
                <ListItem
                  key={id}
                  nestedLevel={0}
                  primaryText={getPrimaryText(name, docCount)}
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
                />
              )
            }
          })
        }
      />

      {items.length > MAX_NUMBER_OF_ITEMS && (
        <FlatButton
          className="Search-page__facets-show-more-button"
          label={t.facets.showMore.replace('{countResults}', remainingItems.length)}
          onClick={() => setShowModal(true)}
        />
      )}

      <hr />

      {showModal && (
        <FacetsModal
          showModal={showModal}
          facetType={facetType}
          modalTitle={name}
          items={remainingItems}
          onClick={() => console.log('hello')}
          onDismiss={() => setShowModal(false)}
        />
      )}
    </>
  )
}

FacetsListItem.propTypes = {
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
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      facetType: PropTypes.string.isRequired
    })
  )
}

FacetsListItem.defaultProps = {
  parents: []
}

export default FacetsListItem
