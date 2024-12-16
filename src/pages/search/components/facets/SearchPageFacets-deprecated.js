// Global DOM components.
import React, { Component } from 'react'
import { Checkbox, FlatButton, IconButton, List, ListItem } from 'material-ui'
import { Close } from 'material-ui-icons'

// Custom DOM components.
import SearchPageFacetsModal from './SearchPageFacetsModal'
import _ from 'lodash'

// App Language.
import { getLanguage } from 'data/locale'

class SearchPageFacets extends Component {
  state = {
    modalOpened: false,
    modalTitle: null,
    modalItems: [],
    modalFacet: [],
    modalType: '',
    showShowMoreButton: {}
  }

  toggleModal = (e, facetTitle, items, type, name) => {
    this.setState({
      modalOpened: !this.state.modalOpened,
      modalTitle: facetTitle,
      modalItems: items,
      modalType: type,
      modalFacet: name
    })
  }

  handleButtonDisplay = (facetId, listItem) => {
    const { showShowMoreButton } = this.state

    if (listItem.props.initiallyOpen === true) {
      if (typeof showShowMoreButton[facetId] === 'undefined') {
        this.setState({
          showShowMoreButton: {
            ...showShowMoreButton,
            [facetId]: false
          }
        })
      } else {
        this.setState({
          showShowMoreButton: {
            ...showShowMoreButton,
            [facetId]: !showShowMoreButton[facetId]
          }
        })
      }
    } else {
      if (typeof showShowMoreButton[facetId] === 'undefined') {
        this.setState({
          showShowMoreButton: {
            ...showShowMoreButton,
            [facetId]: true
          }
        })
      } else {
        this.setState({
          showShowMoreButton: {
            ...showShowMoreButton,
            [facetId]: !showShowMoreButton[facetId]
          }
        })
      }
    }
  }

  render() {
    // Removing the default styles for the list.
    const innerDivStyle = { padding: 10, margin: 0 }
    const { facets, handleSearchFacetClick, initiallyOpen, resetSearch, search } = this.props
    const {
      modalItems,
      modalType,
      modalOpened,
      modalTitle,
      showShowMoreButton,
      modalFacet
    } = this.state
    const { t } = getLanguage()

    return (
      <div className="Search-page__facets">
        <p>
          <small>{t.search.filters}</small>
          <FlatButton onClick={resetSearch} label={t.global.reset} />
        </p>
        <hr />

        {facets.map((facet, index) => {
          let showButton = true

          if (
            typeof showShowMoreButton[facet.data.id] !== 'undefined' &&
            !showShowMoreButton[facet.data.id] &&
            initiallyOpen
          ) {
            showButton = false
          } else if (!initiallyOpen && !showShowMoreButton[facet.data.id]) {
            showButton = false
          }
          if (facet.name != '#type' && facet.name != '0') {
            return (
              <div className="Search-page__facets-facet" key={facet.data.id}>
                <List>
                  <ListItem
                    primaryText={facet.data.title}
                    className="Search-page__facets-item"
                    initiallyOpen={initiallyOpen}
                    primaryTogglesNestedList={true}
                    onNestedListToggle={listItem =>
                      this.handleButtonDisplay(facet.data.id, listItem)
                    }
                    nestedItems={facet.data.itemsToDisplay.map((item, itemIndex) => {
                      const urlArguments = window.location.search
                      const isSelected = urlArguments.indexOf(item.id) !== -1
                      let listItemAttrs = {
                        key: item.id,
                        className: isSelected
                          ? 'Search-page__facets-item-child selected'
                          : 'Search-page__facets-item-child',
                        primaryText: item.label,
                        innerDivStyle: innerDivStyle,
                        primaryTogglesNestedList: true,
                        insetChildren: true,
                        leftIcon: isSelected ? (
                          <IconButton>
                            <Close />
                          </IconButton>
                        ) : (
                          <span />
                        ),
                        initiallyOpen: isSelected ? true : false,
                        onClick: () =>
                          handleSearchFacetClick(item.id, item.url, facet.name, isSelected)
                      }

                      if (facet.data.type !== 'links') {
                        listItemAttrs['leftCheckbox'] = (
                          <Checkbox
                            onCheck={() =>
                              handleSearchFacetClick(item.id, item.url, facet.name, isSelected)
                            }
                          />
                        )
                        listItemAttrs['className'] += ' checkbox'
                      }
                      //Second level
                      if (item.children !== null) {
                        listItemAttrs['nestedItems'] = item.children[0].map(child => {
                          const grandChildIsSelected = urlArguments.indexOf(child.values.id) !== -1

                          if (grandChildIsSelected) {
                            listItemAttrs['initiallyOpen'] = true
                          }
                          let grandchildListItemAttrs = {
                            key: child.values.id,
                            className: grandChildIsSelected
                              ? 'Search-page__facets-item-grandchild selected'
                              : 'Search-page__facets-item-grandchild',
                            primaryText: `${child.values.value} (${child.values.count})`,
                            primaryTogglesNestedList: true,
                            insetChildren: true,
                            initiallyOpen: grandChildIsSelected ? true : false,
                            leftIcon: grandChildIsSelected ? (
                              <IconButton>
                                <Close />
                              </IconButton>
                            ) : (
                              <span />
                            ),

                            onClick: () =>
                              handleSearchFacetClick(
                                child.values.id,
                                child.url,
                                facet.name,
                                grandChildIsSelected
                              )
                          }
                          //Third level
                          if (child.children !== undefined && child.children !== null) {
                            // grandchildListItemAttrs['onNestedListToggle'] = {
                            //   listItem => this.handleButtonDisplay(facet.data.id, listItem)
                            // }
                            grandchildListItemAttrs['nestedItems'] = child.children.map(
                              grandchild => {
                                const grandChildIsSelected =
                                  urlArguments.indexOf(grandchild.values.id) !== -1

                                if (grandChildIsSelected) {
                                  listItemAttrs['initiallyOpen'] = true
                                }
                                let grandgrandchildListItemAttrs = {
                                  key: grandchild.values.id,
                                  className: grandChildIsSelected
                                    ? 'Search-page__facets-item-grandchild selected'
                                    : 'Search-page__facets-item-grandchild',
                                  primaryText: `${grandchild.values.value} (${grandchild.values.count})`,
                                  primaryTogglesNestedList: true,
                                  insetChildren: true,
                                  rightIcon: grandChildIsSelected ? <Close /> : <span />,
                                  onClick: () =>
                                    handleSearchFacetClick(
                                      grandchild.values.id,
                                      grandchild.url,
                                      facet.name,
                                      grandChildIsSelected
                                    )
                                }
                                return <ListItem {...grandgrandchildListItemAttrs} />
                              }
                            )
                          } else {
                            grandchildListItemAttrs['onClick'] = () =>
                              handleSearchFacetClick(
                                child.values.id,
                                child.url,
                                facet.name,
                                grandChildIsSelected
                              )
                          }
                          return <ListItem {...grandchildListItemAttrs} />
                        })
                      } else {
                        listItemAttrs['onClick'] = () =>
                          handleSearchFacetClick(item.id, item.url, facet.name, isSelected)
                      }

                      return <ListItem {...listItemAttrs} />
                    })}
                  />
                </List>
                {typeof facet.data.buttonLabel !== 'undefined' && showButton && (
                  <FlatButton
                    className="Search-page__facets-show-more-button"
                    label={facet.data.buttonLabel}
                    onClick={e =>
                      this.toggleModal(
                        e,
                        facet.data.title,
                        facet.data.items,
                        facet.data.type,
                        facet.name
                      )
                    }
                  />
                )}
                <hr />
              </div>
            )
          }
        })}
        {search}
        <SearchPageFacetsModal
          modalTitle={modalTitle}
          toggleModal={this.toggleModal}
          modalOpened={modalOpened}
          modalItems={modalItems}
          modalType={modalType}
          modalFacet={modalFacet}
          handleSearchFacetClick={handleSearchFacetClick}
        />
      </div>
    )
  }
}

export default SearchPageFacets
