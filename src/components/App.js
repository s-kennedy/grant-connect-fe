// Global DOM components.
import React, { Component } from 'react'
import { Route, withRouter } from 'react-router-dom'
import MediaQuery from 'react-responsive'
import { MuiThemeProvider, MenuItem } from 'material-ui'
import { Grid } from 'react-flexbox-grid'
import * as locationSearch from 'query-string'
import ReactGA from 'react-ga4'

// Helpers.
import _ from 'lodash'

// Redux.
import { connect } from 'react-redux'
import { toggleLeftMenu } from 'store/actions'
import { changeSearchText, updateSearchResults } from 'store/actions/search'

// Custom global components.
import LeftMenu from './global/drawer/LeftMenu'
import HeaderBar from './global/header/HeaderBar'
import SearchForm from 'components/SearchForm'
import AuthRoute from 'components/AuthRoute'
import SessionTimeoutModal from 'components/SessionTimeoutModal'

// Custom Pages.
import Login from '../pages/login/Login'

// URL paths.
import {
  BASE_PAGE,
  SEARCH_PAGE,
  PROFILE_PAGE,
  PIPELINE_PAGE,
  GIFT_PAGE,
  CONTACT_PAGE,
  LOGIN,
  USER_PROFILE,
  RESET_PASSWORD
} from '../utils/paths'

// App Language.
import { checkIpRange, updateSessionStatus, redirectTo } from 'store/actions/user'
import { getAllFacetsAndSyncURL } from 'store/actions/facets'
import { withTranslation } from 'react-i18next'

// Rebuilt Pages
import SearchPage from 'pages/search'
import ProfilePage from 'pages/profile'
import PipelinePage from 'pages/pipeline'
import GiftPage from 'pages/gift'
import ContactPage from 'pages/contact'
import PasswordResetPage from 'pages/password'
import UserProfilePage from 'pages/user_profile'

ReactGA.initialize('G-0PJB5KMFL2')

// Check if there is any search on the URL.
const queryStrings = locationSearch.parse(window.location.search)

let searchText = {
  value: typeof queryStrings.search !== 'undefined' ? queryStrings.search : ''
}

let timer

const FRENCH_DOMAIN = 'connexionsubvention'

class App extends Component {
  state = {
    searchAutocompleteData: [],
    initSearchText: ''
  }

  componentWillMount() {
    const { i18n } = this.props
    const { hostname } = window.location

    const lang = localStorage.getItem('lang') || 'en'
    i18n.changeLanguage(lang)

    const language = i18n.language

    const path = window.location.pathname.split('/')
    let first_path = ''
    if (path[1] == 'fr') {
      first_path = '/' + path[2]
    } else {
      first_path = '/' + path[1]
    }

    // Adding language to main div.
    document.getElementById('root').className = language
    document.getElementsByTagName('body')[0].className = language
    this.updateLoginClass()
  }

  /* Search handlers */
  componentDidMount() {
    const {
      boundChangeSearchText,
      location,
      checkIpRangeAuth,
      updateSessionStatus,
      isAuthenticated,
      redirectTo,
      getAllFacetsAndSyncURL
    } = this.props

    // Check if user is authenticated based on IP range
    if (!isAuthenticated) {
      if (this.props.location.pathname !== RESET_PASSWORD) {
        checkIpRangeAuth()
      }
    } else {
      updateSessionStatus()
      // if base route or /login, redirect to /search
      if (this.props.location.pathname === BASE_PAGE ||
          this.props.location.pathname === LOGIN) {
        redirectTo('/search')
      }
    }

    document.title = this.props.t('global.title')
    // Change the search text if there is any keyword.
    if (location.pathname === SEARCH_PAGE && searchText.value !== '') {
      boundChangeSearchText(searchText.value)
    }

    if (isAuthenticated) {
      // read URL params and set correct filter and pagination settings
      const [_, params] = this.props.location.search.split('?')

      // fetch facet trees and once all succeed, sync url with redux store
      getAllFacetsAndSyncURL(params)
    }
  }

  componentDidUpdate() {
    this.updateLoginClass()
  }

  updateLoginClass() {
    const path = window.location.pathname.split('/')
    let first_path = ''
    if (path[1] == 'fr') {
      first_path = '/fr/' + path[2]
    } else {
      first_path = '/' + path[1]
    }
    if (window.location.pathname === LOGIN || first_path === RESET_PASSWORD) {
      document.getElementById('root').className += ` ${LOGIN.split('/').join('')}`
    } else {
      document.getElementById('root').classList.remove('login')
    }
  }

  transformToAssocArray = prmstr => {
    let params = {}
    const prmarr = prmstr.split('&')
    for (let i = 0; i < prmarr.length; i++) {
      var tmparr = prmarr[i].split('=')
      params[tmparr[0]] = tmparr[1]
    }
    return params
  }

  gotoFunder = (profileInfo, index) => {
    if (index !== -1) {
      if (
        (_.has(profileInfo, 'value') && _.has(profileInfo.value, 'funder')) ||
        _.has(profileInfo.value, 'facet')
      ) {
        if (_.has(profileInfo.value, 'funder')) {
          this.props.history.push({ pathname: `${PROFILE_PAGE}/${profileInfo.value.funder}` })
        } else if (_.has(profileInfo.value, 'facet')) {
          let searchTerm =
            profileInfo.value.facetType === 'regions'
              ? [profileInfo.value.facet, ...profileInfo.value.parentFacetIds].join('__')
              : profileInfo.value.facet
          this.props.history.push({
            pathname: SEARCH_PAGE,
            search: decodeURIComponent(
              `?${profileInfo.value.facetType}__in=${searchTerm}&limit=10&offset=0`
            )
          })
          this.props.history.go()
        }
      } else {
        let search = {}
        search['search'] = profileInfo.value.props.search.searchText
        this.props.history.push({
          pathname: SEARCH_PAGE,
          search: decodeURIComponent(locationSearch.stringify(search))
        })
        this.props.history.go()
      }
    }
  }

  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <LeftMenu
            onCloseIconButtonClick={this.props.toggleLeftMenu}
            showMenu={this.props.leftMenu.opened}
          />
          <header className="App-header">
            <HeaderBar
              history={this.props.history}
              onLeftIconButtonClick={this.props.toggleLeftMenu}
            />
            {this.props.isAuthenticated && (
              <>
                <MediaQuery query="(min-width: 768px)">
                  <SearchForm gotoFunder={this.gotoFunder} />
                </MediaQuery>
                <MediaQuery query="(max-width: 767px)">
                  <SearchForm gotoFunder={this.gotoFunder} mobile={true} />
                </MediaQuery>
              </>
            )}
          </header>

          <SessionTimeoutModal />

          <Grid>
            <Route path={LOGIN} exact component={Login} />
            <Route path={RESET_PASSWORD} exact component={PasswordResetPage} />
            <AuthRoute path={BASE_PAGE} exact component={SearchPage} />
            <AuthRoute path={SEARCH_PAGE} exact component={SearchPage} />
            <AuthRoute path={`${PROFILE_PAGE}/:profileId`} component={ProfilePage} />
            <AuthRoute path={USER_PROFILE} exact component={UserProfilePage} />
            <AuthRoute path={PIPELINE_PAGE} exact component={PipelinePage} />
            <AuthRoute path={GIFT_PAGE} exact component={GiftPage} />
            <AuthRoute path={CONTACT_PAGE} exact component={ContactPage} />
          </Grid>
        </div>
      </MuiThemeProvider>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  leftMenu: state.leftMenu,
  isAuthenticated: state.user.isAuthenticated,
  isLibraryMode: state.user.isLibraryMode
})

const mapDispatchToProps = dispatch => ({
  toggleLeftMenu: () => dispatch(toggleLeftMenu()),
  boundChangeSearchText: searchText => dispatch(changeSearchText(searchText)),
  changeSearchResults: (searchResults, searchFacets, pagerInfo) =>
    dispatch(updateSearchResults(searchResults, searchFacets, pagerInfo)),
  updateRegion: (region, Default = null) => {
    dispatch({ type: 'CHANGE_SEARCH_REGION', value: region, default: Default })
  },
  redirectTo: path => {
    dispatch(redirectTo(path))
  },
  clearSearchText: () => dispatch(changeSearchText('')),
  checkIpRangeAuth: () => dispatch(checkIpRange()),
  updateSessionStatus: () => dispatch(updateSessionStatus()),
  getAllFacetsAndSyncURL: params => dispatch(getAllFacetsAndSyncURL(params))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withTranslation()(App)))
