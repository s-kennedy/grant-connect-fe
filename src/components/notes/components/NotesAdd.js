import React from 'react'
import { FlatButton, IconButton } from 'material-ui'
import { Delete } from 'material-ui-icons'

function NotesAdd(props) {
  const { buttonDoneLabel, cancelNoteEdition, inputPlaceholder, inputValue, inputOnChange, saveNote } = props

  return (
    <div>
      <input type="text" placeholder={inputPlaceholder} value={inputValue} onChange={inputOnChange} />
      <div className="Full-card__notes-new-actions">
        <FlatButton className="Full-card__notes-done" label={buttonDoneLabel} onClick={saveNote} />
        <IconButton className="Full-card__notes-cancel" onClick={cancelNoteEdition}>
          <Delete />
        </IconButton>
      </div>
    </div>
  )
}

export default NotesAdd
