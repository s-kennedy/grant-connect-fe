// Global DOM components.
import React, { Component } from 'react'
import { AutoComplete, FlatButton, IconButton } from 'material-ui'
import { ArrowBack, Search } from 'material-ui-icons'

// App Language.
import { withTranslation } from 'react-i18next'

class SearchFormMobile extends Component {
  state = {
    showSearchForm: false
  }

  handleSearchIconClick = (e, showSearchForm) => {
    this.setState({ showSearchForm })
  }

  render() {
    const {
      searchText,
      searchAutocomplete,
      onUpdateInput,
      handleSearchRequest,
      gotoFunder,
      i18n
    } = this.props
    const t = i18n.getResourceBundle(i18n.language)

    return (
      <div>
        {this.state.showSearchForm && (
          <form
            className="Header-search Header-search-mobile"
            ref={this.setFormWrapperRef}
            onSubmit={handleSearchRequest}
          >
            <IconButton onClick={e => this.handleSearchIconClick(e, false)}>
              <ArrowBack />
            </IconButton>
            {/* Autocomplete Field */}
            <div className="Header-search-mobile-field-container">
              <AutoComplete
                className={`Header-search__autocomplete`}
                menuCloseDelay={0}
                openOnFocus={true}
                underlineShow={false}
                hintText={t.search.hintText}
                searchText={searchText}
                dataSource={searchAutocomplete}
                dataSourceConfig={{ text: 'text', value: 'uuid' }}
                onFocus={this.setFormHighlighted}
                onUpdateInput={onUpdateInput}
                onNewRequest={gotoFunder}
                fullWidth={true}
              />
            </div>
            {/* ENDOF: Autocomplete Field */}

            <FlatButton
              type="submit"
              icon={<Search className="Header-search__submit-icon" />}
              className="Header-search__submit"
            />
          </form>
        )}

        {!this.state.showSearchForm && (
          <IconButton
            className="Header-search__open-search"
            onClick={e => this.handleSearchIconClick(e, true)}
          >
            <Search />
          </IconButton>
        )}
      </div>
    )
  }
}

export default withTranslation()(SearchFormMobile)
