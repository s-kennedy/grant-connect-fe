import PropTypes from 'prop-types'
import { IconButton } from 'material-ui'
import { ViewStream, ViewList } from 'material-ui-icons'

import { useTranslation } from 'react-i18next'

const CardViewChanger = ({ onClick, expandedActive, collapsedActive }) => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)

  return (
    <div className="Search-page__view Search-page__view">
      <IconButton
        data-tip={t.search.view.cards}
        className={`Search-page__view Search-page__view-expanded ${expandedActive}`}
        onClick={onClick}
      >
        <ViewStream />
      </IconButton>

      <IconButton
        data-tip={t.search.view.table}
        className={`Search-page__view Search-page__view-collapsed ${collapsedActive}`}
        onClick={onClick}
      >
        <ViewList />
      </IconButton>
    </div>
  )
}

CardViewChanger.propTypes = {
  onClick: PropTypes.func.isRequired,
  expandedActive: PropTypes.string.isRequired,
  collapsedActive: PropTypes.string.isRequired
}

export default CardViewChanger
