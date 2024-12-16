import PropTypes from 'prop-types'
import { MenuItem, SelectField } from 'material-ui'
import { KeyboardArrowDown, Sort } from 'material-ui-icons'

import { SORT_BY_OPTIONS } from './helpers'
import { useTranslation } from 'react-i18next'

const SortBySelect = ({ value, onChange }) => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)
  const items = SORT_BY_OPTIONS({ t })

  const selectFieldStyle = {
    listStyle: { border: '1px solid #bfd0da' },
    menuItemStyle: { paddingTop: 2, paddingBottom: 2 }
  }

  return (
    <div className="Search-page__filters-sorting-wrapper">
      <SelectField
        className="Search-page__filters-sorting"
        autoWidth={true}
        floatingLabelText={t.search.filter.sortBy}
        floatingLabelFixed={true}
        value={value}
        underlineShow={false}
        listStyle={selectFieldStyle.listStyle}
        menuItemStyle={selectFieldStyle.menuItemStyle}
        dropDownMenuProps={{ iconButton: <Sort /> }}
        onChange={onChange}
      >
        {items.map(({ value, label }, index) => {
          const lastClass = index + 1 === items.length ? 'last' : ''

          return (
            <MenuItem
              key={index}
              className={`Search-page__filters-menu-item ${lastClass}`}
              value={value}
              primaryText={label}
            />
          )
        })}
      </SelectField>
    </div>
  )
}

SortBySelect.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

export default SortBySelect
