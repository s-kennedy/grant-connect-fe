import PropTypes from 'prop-types'
import { Dialog, FlatButton } from 'material-ui'
import { useDispatch } from 'react-redux'

import { selectFacet } from 'store/actions/facets'

import { useTranslation } from 'react-i18next'

const FacetsModal = ({ showModal, facetType, modalTitle, items, onDismiss }) => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)
  const dispatch = useDispatch()

  return (
    <Dialog
      className="Search-page__facets-dialog"
      title={modalTitle}
      actions={<FlatButton label={t.global.close} onClick={onDismiss} />}
      open={showModal}
    >
      {items.map(item => {
        return (
          <div
            key={item.id}
            onClick={() => {
              onDismiss()
              dispatch(selectFacet({ id: item.id, name: item.name, facetType }))
            }}
          >
            {`${item.name} ${item.docCount && item.docCount != '0' ? `(${item.docCount})` : ''}`}
          </div>
        )
      })}
    </Dialog>
  )
}

FacetsModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  facetType: PropTypes.string.isRequired,
  modalTitle: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired,
  onDismiss: PropTypes.func.isRequired
}

export default FacetsModal
