import { Chip, IconButton } from 'material-ui'
import { Close, Info } from 'material-ui-icons'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { selectFacet, unSelectFacet } from 'store/actions/facets'
import { resetFacetFilters } from 'store/actions/filters'
import { changeSearchText } from 'store/actions/search'

const Pills = ({
  items,
  areRemovable = true,
  selectOnClick = false,
  renderInfoSection = false
}) => {
  const dispatch = useDispatch()
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)

  const handleClick = (id, name, facetType) => {
    if (selectOnClick) {
      dispatch(resetFacetFilters())
      dispatch(changeSearchText(''))
      dispatch(selectFacet({ id, name, facetType }))
    } else {
      dispatch(unSelectFacet({ id }))
    }
  }
  return (
    <div className="profile-tags-list">
      {items.map(({ id, name, facetType }) => {
        if (facetType !== undefined) {
          return (
            <Chip key={id} onClick={() => handleClick(id, name, facetType)}>
              <div className="tw-flex tw-items-center tw-justify-between">
                {name}
                {areRemovable ? (
                  <div className="rounded-icon">
                    <Close />
                  </div>
                ) : (
                  <div />
                )}
              </div>
            </Chip>
          )
        } else {
          return (
            <Chip key={id} style={{ backgroundColor: '#ffcc33' }}>
              <div className="tw-flex tw-items-center tw-justify-between">
                {name}
                {areRemovable ? (
                  <div className="rounded-icon">
                    <Close />
                  </div>
                ) : (
                  <div />
                )}
              </div>
            </Chip>
          )
        }
      })}
      {!!renderInfoSection && (
        <IconButton
          tooltip={
            <div>
              {' '}
              {t.funder.toolTip} <p> {t.funder.toolTipDescription} </p>
            </div>
          }
          style={{
            position: 'absolute',
            right: '-60px',
            top: '-10px'
          }}
          tooltipPosition="top-left"
          className="profile-tags-list-info"
        >
          <Info aria-label="Info" />
        </IconButton>
      )}
    </div>
  )
}

export default Pills
