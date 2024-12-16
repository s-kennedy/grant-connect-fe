import { Dialog, FlatButton } from 'material-ui'
import React from 'react'

import { getLanguage } from 'data/locale'

const ProfileGiftAnalysisModal = ({ onClose, opened, name, content }) => {
  const { t } = getLanguage()

  return (
    <Dialog
      className="Profile-gift-analysis-dialog"
      title="Gift Detail"
      actions={<FlatButton label={t.global.close} onClick={onClose} />}
      open={opened}
      onRequestClose={onClose}
    >
      <span className="Profile-gift-analysis-dialog-modal-name">{name}</span>
      {content}
    </Dialog>
  )
}

export default ProfileGiftAnalysisModal
