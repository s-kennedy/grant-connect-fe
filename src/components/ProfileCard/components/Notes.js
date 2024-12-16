import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { FlatButton, IconButton } from 'material-ui'
import { ModeEdit } from 'material-ui-icons'
import { useParams } from 'react-router-dom'

import EditNote from './EditNote'
import DeleteNote from './DeleteNote'

import { getNotesByFunderId, addNoteByFunderId, updateNote, deleteNote } from 'store/actions/notes'
import { selectNotes, selectIsNotesLoading } from 'store/selectors/notes'
import { getCurrentDate, getDashFormatDate } from 'utils/dates'

const Notes = () => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)
  const dispatch = useDispatch()
  const isLoading = useSelector(selectIsNotesLoading)
  const { profileId } = useParams()
  const { results } = useSelector(selectNotes)

  const [isExpanded, setIsExpanded] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [editingNoteId, setEditingNoteId] = useState(0)

  const notes = Array.isArray(results) && results.sort((a, b) => b.id - a.id)
  const visibleNotes = Array.isArray(notes) && notes.slice(0, isExpanded ? notes.length : 2)

  const addNote = async noteText => {
    await dispatch(addNoteByFunderId(profileId, noteText))
    await dispatch(getNotesByFunderId(profileId, false))
    setIsAdding(false)
    setEditingNoteId(0)
  }

  const editNote = async (noteId, noteText) => {
    await dispatch(updateNote(noteId, noteText))
    await dispatch(getNotesByFunderId(profileId, false))
    setIsAdding(false)
    setEditingNoteId(0)
  }

  const removeNote = async noteId => {
    await dispatch(deleteNote(noteId))
    await dispatch(getNotesByFunderId(profileId, false))
    setIsAdding(false)
    setEditingNoteId(0)
  }

  if (isLoading) return null

  const noteCountText =
    notes.length === 1 ? `${notes.length} ${t.cards.note}` : `${notes.length} ${t.cards.notes}`

  const renderNote = note => {
    const date = note.updatedAt
    const dateString = getDashFormatDate(date)

    return note.id === editingNoteId ? (
      <div className="Full-card__notes-note">
        <EditNote
          initialValue={note.note}
          saveNote={noteText => editNote(note.id, noteText)}
          cancel={() => setEditingNoteId(0)}
        />
      </div>
    ) : (
      <div className="Full-card__notes-note">
        <p className="Full-card__notes-date">{dateString}</p>
        {note.note}
        <span>
          <IconButton className="Full-card__notes-edit" onClick={() => setEditingNoteId(note.id)}>
            <ModeEdit />
          </IconButton>
          <DeleteNote deleteNote={() => removeNote(note.id)} />
        </span>
      </div>
    )
  }

  return (
    <div className="Full-card__notes">
      <small>{noteCountText}</small>

      {!!visibleNotes.length &&
        visibleNotes.map(note => <div key={note.id}>{renderNote(note)}</div>)}

      {notes.length > 2 && !isExpanded && !isAdding && (
        <FlatButton
          className="Full-card__notes-see-all"
          label={t.cards.seeAllNotes}
          onClick={() => setIsExpanded(true)}
        />
      )}

      {notes.length > 2 && isExpanded && !isAdding && (
        <FlatButton
          className="Full-card__notes-close"
          label={t.global.close}
          onClick={() => setIsExpanded(false)}
        />
      )}

      {(notes.length <= 2 || isExpanded) && !isAdding && (
        <FlatButton
          className="Full-card__notes-add"
          label={t.cards.addNote}
          onClick={() => setIsAdding(true)}
        />
      )}

      {isAdding && <EditNote saveNote={addNote} cancel={() => setIsAdding(false)} />}
    </div>
  )
}

export default Notes
