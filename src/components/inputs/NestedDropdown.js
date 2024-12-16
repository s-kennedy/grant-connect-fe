// Global DOM components.
import React, { Component } from 'react'
import { IconButton, List, ListItem } from 'material-ui'
import { Close, KeyboardArrowDown, KeyboardArrowUp } from 'material-ui-icons'

// Helpers.
import _ from 'lodash'

// App Language.
import { getLanguage } from 'data/locale'

class NestedDropdown extends Component {
  state = {
    parentOpened: false,
    parentRightIcon: {},
    parentId: null,
    parentTid: null,
    open: false
  }

  checkNested = item => {
    let open = this.props.childItemId
    if (this.props.opened == null) {
      return false
    }
    if (this.props.opened) {
      open = this.props.opened
    }
    const json = JSON.stringify(item)
    if (json.search(open) > 0) {
      return true
    }
    return false
  }

  makeLists = (itteration = {}, deep = 1) => {
    let list = this.props.items
    const originDeep = _.has(this.props, 'deep') ? this.props.deep : 999
    if (!_.isEmpty(itteration.children)) {
      list = itteration.children
    }
    let itemList = _.map(list, (item, i) => {
      if (!_.isEmpty(item)) {
        if (_.has(item, 'children') && !_.isEmpty(item.children) && originDeep > deep + 1) {
          if (!_.has(itteration, 'tid')) {
            itteration.tid = null
          }
          return (
            <ListItem
              key={item.tid}
              className="Header-search__select-item"
              primaryText={
                this.props.childItemId === item.tid ? (
                  <span className="Header-search__select-item-flex">
                    {item.name}
                    <Close />
                  </span>
                ) : (
                  item.name
                )
              }
              open={this.checkNested(item)}
              openstate={this.checkNested(item) ? 'true' : 'false'}
              nestedListStyle={{ padding: 0 }}
              primaryTogglesNestedList={true}
              onNestedListToggle={this.props.changeOpened}
              nestedItems={this.makeLists(item, deep + 1)}
              tid={item.tid}
              parenttid={_.isEmpty(itteration.tid) ? null : itteration.tid}
              onClick={() => this.props.onClickHandler(item.tid, item.name)}
            />
          )
        } else {
          return (
            <ListItem
              className="Header-search__select-item"
              primaryText={item.name}
              key={i}
              rightIconButton={
                this.props.childItemId === item.tid ? (
                  <IconButton onClick={this.props.onCloseClickHandler}>
                    <Close />
                  </IconButton>
                ) : undefined
              }
              onClick={() => this.props.onClickHandler(item.tid, item.name)}
            />
          )
        }
      }
    })

    // Don't remove, we can use this if we'll need "all" elements.

    // if (deep > 1) {
    //   const all =
    //     <ListItem
    //       className="Header-search__select-item"
    //       primaryText={ 'All'  }
    //       key={itteration.tid}
    //       rightIconButton={
    //         (this.props.childItemId === itteration.tid)
    //           ? <IconButton onClick={ this.props.onCloseClickHandler }>
    //           <Close />
    //         </IconButton>
    //           : undefined
    //       }
    //       onClick={ () => this.props.onClickHandler(
    //         itteration.tid,
    //         itteration.name
    //       )}
    //     />;
    //   itemList.unshift(all);
    // }
    return itemList
  }

  render() {
    // const { parentId, parentTid, parentOpened, parentRightIcon } = this.state
    const { t } = getLanguage()

    return (
      <List
        className={`Header-search__select ${this.props.formHighlighted}`}
        onFocus={this.props.onFocusHandler}
      >
        {' '}
        <ListItem
          className="Header-search__select-item"
          primaryText={this.props.primaryText}
          open={this.props.open}
          primaryTogglesNestedList={true}
          nestedListStyle={{ padding: 0 }}
          onNestedListToggle={this.props.onNestedListToggleHandler}
          nestedItems={this.makeLists()}
        />
      </List>
    )
  }
}

export default NestedDropdown
