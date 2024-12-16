import React, { useState } from 'react'
import { Checkbox, CircularProgress, Dialog, FlatButton, MenuItem } from 'material-ui'
import { useTranslation } from 'react-i18next'

import { reset } from 'store/actions/pipeline'

const LS_RESET = 'dontShowCheckedReset'

const ResetDialog = ({ handleSubmit, handleClose }) => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)

  const [skipNextTime, setSkipNextTime] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  return (
    <Dialog
      className="Profile-gift-analysis-dialog"
      title={t.cards.resetTitle}
      actions={[
        !isLoading && <FlatButton
          labelPosition="before"
          label={t.global.cancel}
          onClick={handleClose}
          disabled={isLoading}
        />,
        <FlatButton
          labelPosition="before"
          label={!isLoading && t.cards.reset}
          icon={isLoading && <CircularProgress size={20} color="#4c9eff" />}
          onClick={async () => {
            setIsLoading(true)
            await handleSubmit(skipNextTime)
            handleClose()
          }}
          disabled={isLoading}
        />
      ]}
      open={true}
      onRequestClose={handleClose}
    >
      <p>{t.cards.resetConfirm}</p>
      <Checkbox label={t.cards.noShow} checked={skipNextTime} onCheck={() => setSkipNextTime(!skipNextTime)} />
    </Dialog>
  )
}

const ResetCardAction = ({ opportunityId, setShowDialog, loadData, dispatch }) => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)

  const handleSubmit = async (skipNextTime) => {
    if (skipNextTime) localStorage.setItem(LS_RESET, true)

    await dispatch(reset(opportunityId))
    await dispatch(loadData())
  }
  
  const handleReset = () => {
    const skip = localStorage[LS_RESET] === 'true'
  
    if (skip) {
      setShowDialog(false)
      return handleSubmit()
    }

    setShowDialog(<ResetDialog handleSubmit={handleSubmit} handleClose={() => setShowDialog(false)} />)
  }

  return (
    <MenuItem
      className="Material-cards__expanded-actions-item"
      primaryText={t.cards.reset}
      onClick={handleReset}
    />
  )
}

export default ResetCardAction
