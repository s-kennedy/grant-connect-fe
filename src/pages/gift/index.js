import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { selectIsLibraryMode } from 'store/selectors/user'
import Explorer from 'components/Explorer'
import { redirectTo } from 'store/actions/user'
import { useHotjar } from 'utils/hotjar'

const GiftExplorer = () => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)

  const dispatch = useDispatch()
  const isLibraryMode = useSelector(selectIsLibraryMode)

  useEffect(() => {
    if (isLibraryMode) {
      dispatch(redirectTo('/search'))
    }
  }, [isLibraryMode])

  useHotjar()

  return <Explorer url={t.explorer.gift} />
}

export default GiftExplorer
