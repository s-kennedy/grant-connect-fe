// Global DOM components.
import React, { useState } from 'react'
import { Link, Router, useLocation } from 'react-router-dom'
import { AppBar, FlatButton, IconButton, Menu, MenuItem, Popover } from 'material-ui'
import { HelpOutline, Menu as MenuIcon, AccountCircle } from 'material-ui-icons'

// Custom DOM components.
import logo from '../../../logo.svg'
import logoFr from '../../../logo-fr.svg'
import { PIPELINE_PAGE, SEARCH_PAGE, USER_PROFILE } from '../../../utils/paths'

import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from 'store/actions/user'
import { useTranslation } from 'react-i18next'
import { getAllFacetsAndSyncURL } from 'store/actions/facets'
import { setPipelineLoading } from 'store/actions/pipeline'
import { setProfileLoading } from 'store/actions/profile'
import { updateSearchResults } from 'store/actions/search'
import { selectHasExecutePermissions, selectIsLibraryMode, selectRole } from 'store/selectors/user'
import { RoleEnum } from 'store/reducers/user'

const HeaderBar = ({ onLeftIconButtonClick, history }) => {
  const { t, i18n } = useTranslation()
  const location = useLocation()

  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)

  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector(state => state.user)
  const hasExecutePermissions = useSelector(selectHasExecutePermissions)
  const role = useSelector(selectRole)

  const isLibraryMode = useSelector(selectIsLibraryMode)

  const languageSwitchString = i18n.language === 'en' ? 'FR' : 'EN'
  const logoSrc = i18n.language === 'en' ? logo : logoFr

  const handleAccountMenuClick = e => {
    e.preventDefault()
    setShowAccountMenu(true)
    setAnchorEl(e.currentTarget)
  }

  const handleLanguageSwitch = () => {
    dispatch(setPipelineLoading(true))
    dispatch(setProfileLoading(true))
    dispatch(updateSearchResults([]))

    const [_, params] = location.search.split('?')
    const newLang = i18n.language === 'en' ? 'fr' : 'en'

    // Update localstorage state for new language at next page load
    localStorage.setItem('lang', newLang)

    // refetch facet tree with correct content
    dispatch(getAllFacetsAndSyncURL(params))

    // Reload page to get new language content from the API
    history.go(0)
  }

  return (
    <AppBar
      className="Header-wrapper"
      iconStyleLeft={isLibraryMode && { display: 'none' }}
      iconElementLeft={
        isAuthenticated ? (
          <IconButton disabled={isLibraryMode}>
            <MenuIcon className="Header-icon" disabled={isLibraryMode} />
          </IconButton>
        ) : (
          <></>
        )
      }
      onLeftIconButtonClick={() => !isLibraryMode && onLeftIconButtonClick()}
      iconElementRight={
        <div className="tw-flex tw-items-center tw-content-center">
          <div style={{ width: '30px' }}>
            <a className="tw-block" href={t('leftMenu.help_center_url')} target="_blank">
              {<HelpOutline data-class="Header-help" />}
            </a>
          </div>
          <FlatButton
            style={{ minWidth: '44px', height: '100%' }}
            className="tw-w-4 tw-min-w-4"
            label={languageSwitchString}
            onClick={handleLanguageSwitch}
          />
          {/* Account Menu */}
          {isAuthenticated && (
            <>
              <div>
                <IconButton onClick={handleAccountMenuClick}>
                  <AccountCircle className="Header-icon-account" />
                </IconButton>
              </div>
              <Popover
                open={showAccountMenu}
                anchorEl={anchorEl}
                onRequestClose={() => setShowAccountMenu(false)}
                className="Header-popover"
              >
                <Menu>
                  <MenuItem onClick={() => dispatch(logoutUser())} primaryText={t('user.logout')} />
                  {!isLibraryMode && role != RoleEnum.LICENSE && (
                    <Router history={history}>
                      <Link to={USER_PROFILE}>
                        <MenuItem primaryText={t('user.profileEdit.changeLogin')} />
                      </Link>
                    </Router>
                  )}
                </Menu>
              </Popover>
            </>
          )}
        </div>
      }
      title={
        <Link
          to={
            isAuthenticated && hasExecutePermissions & !isLibraryMode ? PIPELINE_PAGE : SEARCH_PAGE
          }
        >
          <img src={logoSrc} className="App-logo" alt="logo" />
        </Link>
      }
    />
  )
}

export default HeaderBar
