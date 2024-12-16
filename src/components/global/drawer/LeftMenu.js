// Global DOM Components.
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Drawer, IconButton, MenuItem } from 'material-ui'
import { Close } from 'material-ui-icons'

import { getAllFacetsAndSyncURL } from 'store/actions/facets'
import { updateSearchResults } from 'store/actions/search'
import { selectHasExecutePermissions, selectIsLibraryMode } from 'store/selectors/user'
import { setPipelineLoading } from 'store/actions/pipeline'
import { setProfileLoading } from 'store/actions/profile'
import { trackSideMenuPageClick } from 'utils/mixpanel'

function LeftMenu(props) {
  const { showMenu, onCloseIconButtonClick } = props
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)
  const dispatch = useDispatch()
  const hasExecutePermissions = useSelector(selectHasExecutePermissions)
  const isLibraryMode = useSelector(selectIsLibraryMode)

  const handleLanguageSwitch = e => {
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

  const handleClick = page => async e => {
    await trackSideMenuPageClick(page)
  }

  return (
    <div className="Left-menu">
      <Drawer
        width={310}
        open={showMenu}
        docked={false}
        containerClassName="Left-menu__wrapper"
        onRequestChange={onCloseIconButtonClick}
      >
        <IconButton onClick={onCloseIconButtonClick}>
          <Close />
        </IconButton>
        {hasExecutePermissions && !isLibraryMode && (
          <MenuItem href={t.leftMenu.pipeline_url} onClick={handleClick('pipeline')}>
            <a href={t.leftMenu.pipeline_url}>{t.leftMenu.pipeline}</a>
          </MenuItem>
        )}
        <MenuItem href={t.leftMenu.funder_url} onClick={handleClick('search')}>
          <a href={t.leftMenu.funder_url}>{t.leftMenu.funder}</a>
        </MenuItem>
        {hasExecutePermissions && !isLibraryMode && (
          <>
            <MenuItem href={t.leftMenu.gift_url} onClick={handleClick('gift')}>
              <a href={t.leftMenu.gift_url}>{t.leftMenu.gift}</a>
            </MenuItem>
            <MenuItem href={t.leftMenu.contact_url} onClick={handleClick('contact')}>
              <a href={t.leftMenu.contact_url}>{t.leftMenu.contact}</a>
            </MenuItem>
          </>
        )}
        <hr />
        <MenuItem href={t.leftMenu.help_center_url} target="_blank" onClick={handleClick('help-centre')}>
          <a href={t.leftMenu.help_center_url} target="_blank">
            {t.leftMenu.help_center}
          </a>
        </MenuItem>
        <MenuItem onClick={handleLanguageSwitch}>
          <a onClick={handleLanguageSwitch}> {t.leftMenu.lang}</a>
        </MenuItem>
        <MenuItem href={t.leftMenu.terms_url} target="_blank" onClick={handleClick('terms-of-use')}>
          <a href={t.leftMenu.terms_url} target="_blank">
            {t.leftMenu.terms}
          </a>
        </MenuItem>
        <MenuItem href={t.leftMenu.accessibility_url} target="_blank" onClick={handleClick('accessibility-policy')}>
          <a href={t.leftMenu.accessibility_url} target="_blank">
            {t.leftMenu.accessibility}
          </a>
        </MenuItem>
        <hr />
        <MenuItem href={t.leftMenu.ic_url} target="_blank" onClick={handleClick('imagine-canada')}>
          <a href={t.leftMenu.ic_url} target="_blank">
            {t.leftMenu.ic}
          </a>
        </MenuItem>
      </Drawer>
    </div>
  )
}

export default LeftMenu
