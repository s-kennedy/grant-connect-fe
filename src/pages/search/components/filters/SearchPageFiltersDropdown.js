import React, { Component } from 'react'
import { MenuItem, SelectField } from 'material-ui'
import { KeyboardArrowDown, Sort } from 'material-ui-icons'

class SearchPageFiltersDropdown extends Component {
  render() {
    const { fieldName, floatingLabelText, icon, value, onChange, menuItems } = this.props
    const dropDownIcon = icon === 'Sort' ? <Sort /> : <KeyboardArrowDown />
    const selectFieldStyle = {
      listStyle: { border: '1px solid #bfd0da' },
      menuItemStyle: { paddingTop: 2, paddingBottom: 2 }
    }

    return (
      <div className={`Search-page__filters-${fieldName}-wrapper`}>
        <SelectField
          className={`Search-page__filters-${fieldName}`}
          autoWidth={true}
          floatingLabelText={floatingLabelText}
          floatingLabelFixed={true}
          value={value}
          underlineShow={false}
          listStyle={selectFieldStyle.listStyle}
          menuItemStyle={selectFieldStyle.menuItemStyle}
          dropDownMenuProps={{ iconButton: dropDownIcon }}
          onChange={onChange}
        >
          {menuItems.map((menuItem, index) => {
            let lastClass = index + 1 === menuItems.length ? 'last' : ''
            return (
              <MenuItem
                key={index}
                className={`Search-page__filters-menu-item ${lastClass}`}
                value={
                  menuItem.value
                }
                primaryText={menuItem.primaryText}
              />
            )
          })}
        </SelectField>
      </div>
    )
  }
}

export default SearchPageFiltersDropdown
