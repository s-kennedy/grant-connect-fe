import React from 'react'
import { FlatButton, IconButton } from 'material-ui'
import { Delete } from 'material-ui-icons'

function NotesEdit(props) {
  const { buttonDoneLabel, cancelNoteEdition, inputPlaceholder, inputValue, inputOnChange, noteId, saveNote } = props

  return (
    <div>
      <input type="text" placeholder={inputPlaceholder} value={inputValue} onChange={inputOnChange} />
      <div>
        <FlatButton className="Full-card__notes-done" label={buttonDoneLabel} onClick={() => saveNote(noteId)} />
        <IconButton className="Full-card__notes-cancel" onClick={() => cancelNoteEdition(noteId)}>
          <Delete />
        </IconButton>
      </div>
    </div>
  )
}

export default NotesEdit
