import React from 'react'
import { Checkbox, IconButton, List, ListItem } from 'material-ui'
import { Close } from 'material-ui-icons'

const SearchPageFiltersList = ({ menuItems, value }) => {
  return (
    <List>
      {menuItems.map(item => {
        return (
          <ListItem
            primaryText={item.primaryText}
            className={item.value === value ? 'Search-page__facets-item selected' : 'Search-page__facets-item'}
            primaryTogglesNestedList={true}
            leftCheckbox={<Checkbox />}
          />
        )
      })}
    </List>
  )
}

export default SearchPageFiltersList
