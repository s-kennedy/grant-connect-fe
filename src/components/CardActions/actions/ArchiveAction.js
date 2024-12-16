import React, { useState } from 'react'
import { Checkbox, CircularProgress, Dialog, FlatButton, MenuItem } from 'material-ui'
import { useTranslation } from 'react-i18next'

import { archive } from 'store/actions/pipeline'

const LS_ARCHIVE = 'dontShowCheckedArchive'

const ArchiveDialog = ({ handleSubmit, handleClose }) => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)

  const [skipNextTime, setSkipNextTime] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  return (
    <Dialog
      className="Profile-gift-analysis-dialog"
      title={t.cards.archiveTitle}
      actions={[
        !isLoading && <FlatButton
          labelPosition="before"
          label={t.global.cancel}
          onClick={handleClose}
          disabled={isLoading}
        />,
        <FlatButton
          labelPosition="before"
          label={!isLoading && t.cards.archive}
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
      <p>{t.cards.archiveConfirm}</p>
      <Checkbox label={t.cards.noShow} checked={skipNextTime} onCheck={() => setSkipNextTime(!skipNextTime)} />
    </Dialog>
  )
}

const ArchiveCardAction = ({ opportunityId, setShowDialog, loadData, dispatch }) => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)

  const handleSubmit = async (skipNextTime) => {
    if (skipNextTime) localStorage.setItem(LS_ARCHIVE, true)

    await dispatch(archive(opportunityId))
    await dispatch(loadData())
  }
  
  const handleArchive = () => {
    const skip = localStorage[LS_ARCHIVE] === 'true'
  
    if (skip) {
      setShowDialog(false)
      return handleSubmit()
    }

    setShowDialog(<ArchiveDialog handleSubmit={handleSubmit} handleClose={() => setShowDialog(false)} />)
  }

  return (
    <MenuItem
      className="Material-cards__expanded-actions-item"
      primaryText={t.cards.archive}
      onClick={handleArchive}
    />
  )
}

export default ArchiveCardAction
