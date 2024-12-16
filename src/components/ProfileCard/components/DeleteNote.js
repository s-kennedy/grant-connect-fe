import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Checkbox, Dialog, FlatButton, IconButton } from 'material-ui'
import { Delete } from 'material-ui-icons'

const LS_DELETE_NOTE = 'dontShowCheckedDeleteNote'

const DeleteNoteDialog = ({ isOpen, handleSubmit, handleClose }) => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)

  const [skipNextTime, setSkipNextTime] = useState(false)

  return (
    <Dialog
      className="Profile-gift-analysis-dialog"
      title={t.cards.deleteNote}
      actions={[
        <FlatButton labelPosition="before" label={t.global.cancel} onClick={handleClose} />,
        <FlatButton
          labelPosition="before"
          label={t.cards.delete}
          onClick={async () => {
            handleSubmit(skipNextTime)
            handleClose()
          }}
        />
      ]}
      open={isOpen}
      onRequestClose={handleClose}
    >
      <p>{t.cards.deleteNoteConfirm}</p>
      <Checkbox
        label={t.cards.noShow}
        checked={skipNextTime}
        onCheck={() => setSkipNextTime(!skipNextTime)}
      />
    </Dialog>
  )
}

const DeleteNote = ({ deleteNote }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = async skipNextTime => {
    if (skipNextTime) localStorage.setItem(LS_DELETE_NOTE, true)
    await deleteNote()
  }

  const handleDeleteNote = () => {
    const skip = localStorage[LS_DELETE_NOTE] === 'true'

    if (skip) {
      setIsOpen(false)
      return handleSubmit(skip)
    }
    setIsOpen(true)
  }

  return (
    <span>
      <IconButton className="Full-card__notes-delete" onClick={handleDeleteNote}>
        <Delete />
      </IconButton>
      <DeleteNoteDialog
        isOpen={isOpen}
        handleSubmit={handleSubmit}
        handleClose={() => setIsOpen(false)}
      />
    </span>
  )
}

export default DeleteNote
