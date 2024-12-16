import React, { useState } from 'react'
import { Checkbox, CircularProgress, Dialog, FlatButton, MenuItem } from 'material-ui'
import { useTranslation } from 'react-i18next'

import { addToPipelineAndHide, markHidden } from 'store/actions/pipeline'

const LS_HIDE = 'dontShowCheckedHide'

const HideDialog = ({ handleSubmit, handleClose }) => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)

  const [skipNextTime, setSkipNextTime] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  return (
    <Dialog
      className="Profile-gift-analysis-dialog"
      title={t.cards.hideTitle}
      actions={[
        !isLoading && <FlatButton
          labelPosition="before"
          label={t.global.cancel}
          onClick={handleClose}
          disabled={isLoading}
        />,
        <FlatButton
          labelPosition="before"
          label={!isLoading && t.cards.hide}
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
      <p>{t.cards.hideConfirm}</p>
      <Checkbox label={t.cards.noShow} checked={skipNextTime} onCheck={() => setSkipNextTime(!skipNextTime)} />
    </Dialog>
  )
}

const HideCardAction = ({ funder, opportunityId, setShowDialog, loadData, dispatch }) => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)

  const handleSubmit = async (skipNextTime) => {
    if (skipNextTime) localStorage.setItem(LS_HIDE, true)

    if (opportunityId) {
      await dispatch(markHidden(opportunityId))
    } else if (funder) {
      await dispatch(addToPipelineAndHide(funder.id))
    }
    await dispatch(loadData())
  }
  
  const handleHide = () => {
    const skip = localStorage[LS_HIDE] === 'true'
  
    if (skip) {
      setShowDialog(false)
      return handleSubmit()
    }

    setShowDialog(<HideDialog handleSubmit={handleSubmit} handleClose={() => setShowDialog(false)} />)
  }

  return (
    <MenuItem
      className="Material-cards__expanded-actions-item"
      primaryText={t.cards.hide}
      onClick={handleHide}
    />
  )
}

export default HideCardAction
