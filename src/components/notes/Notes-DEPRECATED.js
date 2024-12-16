// Global DOM Components.
import React, { Component } from 'react'
import { FlatButton, IconButton } from 'material-ui'
import { Delete, ModeEdit } from 'material-ui-icons'

// Custom DOM Components.
import NotesAdd from './components/NotesAdd'
import NotesEdit from './components/NotesEdit'

// Controllers.
import * as FunderController from '../../controllers/FunderController-DEPRECATED'

// Helpers.
// import { getFormattedDateFromTimestamp } from '../../utils/helpers'

// App Language.
import { getLanguage } from 'data/locale'

class Notes extends Component {
  state = {
    addNewNote: false,
    cardNotes: { data: { items: [], itemsToDisplay: [] } },
    noteIsBeingEdited: {},
    noteValue: '',
    newNoteValue: '',
    notesLength: 0,
    notesAreExpanded: false
  }

  componentDidUpdate() {
    const { cardNotes } = this.props
    if (
      cardNotes.data.items.length !== this.state.cardNotes.data.items.length &&
      this.state.cardNotes.data.items.length < cardNotes.data.items.length
    ) {
      this.setState({ cardNotes: this.props.cardNotes })
    }
  }

  addNote = () => {
    this.setState({ addNewNote: true, newNoteValue: '' })
  }

  editNote = noteId => {
    const { cardNotes } = this.state
    const noteValue = cardNotes.data.items.filter(note => note.id === noteId)

    this.setState({
      noteIsBeingEdited: { [noteId]: true },
      noteValue: noteValue[0].note
    })
  }

  changeNoteValue = e => {
    this.setState({ noteValue: e.target.value })
  }

  changeNewNoteValue = e => {
    this.setState({ newNoteValue: e.target.value })
  }

  saveNote = noteId => {
    // const formattedTodaysDate = getFormattedDateFromTimestamp(new Date())
    let newCardNotes = this.state.cardNotes
    const noteIndex = newCardNotes.data.items.findIndex(note => note.id === noteId)

    // Remove the old note to after insert it at the top.
    const newNoteId = newCardNotes.data.items[noteIndex].id
    let newItems = newCardNotes.data.items.filter(note => note.id !== noteId)

    newItems.unshift({
      id: newNoteId,
      note: this.state.noteValue,
      date: formattedTodaysDate
    })

    newCardNotes.data.items = newItems
    newCardNotes.data.itemsToDisplay = newItems

    if (!this.state.notesAreExpanded) {
      newCardNotes.data.itemsToDisplay = newCardNotes.data.itemsToDisplay.slice(0, 2)
    }

    this.setState({
      cardNotes: newCardNotes,
      noteIsBeingEdited: { [noteId]: false }
    })

    FunderController.updateNote(noteId, this.state.noteValue)
  }

  cancelNoteEdition = noteId => {
    this.setState({ noteIsBeingEdited: { [noteId]: false } })
  }

  deleteNote = (noteId, numberOfNotes) => {
    let newCardNotes = this.state.cardNotes
    let newItems = newCardNotes.data.items.filter(note => note.id !== noteId)

    newCardNotes.data.items = newItems

    if (newItems.length <= 2 || this.state.notesAreExpanded) {
      newCardNotes.data.itemsToDisplay = newItems
    } else {
      // Only 2 notes.
      newCardNotes.data.itemsToDisplay = []
      newCardNotes.data.itemsToDisplay[0] = newItems[0]
      newCardNotes.data.itemsToDisplay[1] = newItems[1]
    }

    FunderController.deleteNote(noteId)

    this.setState({
      cardNotes: newCardNotes,
      notesLength: numberOfNotes - 1
    })
  }

  saveNewNote = numberOfNotes => {
    // const formattedTodaysDate = getFormattedDateFromTimestamp(new Date())
    const { newNoteValue } = this.state
    let newCardNotes = this.state.cardNotes

    FunderController.createNote(this.props.opportunity.uuid, newNoteValue).then(note => {
      const newNote = {
        id: note.data.id,
        note: newNoteValue,
        date: formattedTodaysDate
      }

      newCardNotes.data.items.unshift(newNote)
      newCardNotes.data.itemsToDisplay.unshift(newNote)

      newCardNotes.data.itemsToDisplay = newCardNotes.data.itemsToDisplay.slice(0, 2)

      this.setState({
        cardNotes: newCardNotes,
        notesLength: numberOfNotes + 1,
        addNewNote: false
      })
    })
  }

  cancelNewNoteEdition = () => this.setState({ addNewNote: false })

  expandNotes = () => {
    let newCardNotes = this.state.cardNotes

    newCardNotes.data.itemsToDisplay = newCardNotes.data.items

    this.setState({
      cardNotes: newCardNotes,
      notesAreExpanded: true
    })
  }

  collapseNotes = () => {
    let newCardNotes = this.state.cardNotes
    newCardNotes.data.itemsToDisplay = []

    newCardNotes.data.itemsToDisplay[0] = newCardNotes.data.items[0]
    newCardNotes.data.itemsToDisplay[1] = newCardNotes.data.items[1]

    this.setState({
      cardNotes: newCardNotes,
      notesAreExpanded: false
    })
  }

  render() {
    const { cardNotes, noteIsBeingEdited, notesLength } = this.state

    // if (
    //   this.props.cardNotes.data.items.length !== this.state.cardNotes.data.items.length &&
    //   this.state.cardNotes.data.items.length < this.props.cardNotes.data.items.length
    // ) {
    //   this.setState({ cardNotes: this.props.cardNotes });
    // }
    // let { cardNotes } = this.state;

    const { t } = getLanguage()
    const numberOfNotes = notesLength === 0 ? cardNotes.data.items.length : notesLength
    const notesText =
      numberOfNotes === 1 ? `${numberOfNotes} ${t.cards.note}` : `${numberOfNotes} ${t.cards.notes}`

    if (typeof localStorage.executeActions === 'undefined') {
      return <div />
    }

    return (
      <div className="Full-card__notes">
        <small>{notesText}</small>
        {numberOfNotes > 0 &&
          cardNotes.data.itemsToDisplay.map((note, noteIndex) => {
            return (
              <div key={note.id} t={note.created}>
                {noteIsBeingEdited[note.id] && (
                  <NotesEdit
                    noteId={note.id}
                    inputPlaceholder={t.cards.takeNote}
                    inputValue={this.state.noteValue}
                    inputOnChange={this.changeNoteValue}
                    buttonDoneLabel={t.global.done}
                    saveNote={this.saveNote}
                    cancelNoteEdition={this.cancelNoteEdition}
                  />
                )}
                {!noteIsBeingEdited[note.id] && (
                  <div className="Full-card__notes-note">
                    <p className="Full-card__notes-date">{note.date}</p>
                    {note.note}
                    {this.props.opportunity.pipeline_stage !== '' && (
                      <span>
                        <IconButton
                          className="Full-card__notes-edit"
                          onClick={() => this.editNote(note.id)}
                        >
                          <ModeEdit />
                        </IconButton>
                        <IconButton
                          className="Full-card__notes-delete"
                          onClick={() => this.deleteNote(note.id, numberOfNotes)}
                        >
                          <Delete />
                        </IconButton>
                      </span>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        {numberOfNotes > 2 &&
          cardNotes.data.itemsToDisplay !== cardNotes.data.items &&
          !this.state.addNewNote && (
            <FlatButton
              className="Full-card__notes-see-all"
              label={t.cards.seeAllNotes}
              onClick={this.expandNotes}
            />
          )}
        {(numberOfNotes <= 2 || cardNotes.data.itemsToDisplay === cardNotes.data.items) &&
          !this.state.addNewNote &&
          this.props.opportunity.pipeline_stage !== '' && (
            <FlatButton
              className="Full-card__notes-add"
              label={t.cards.addNote}
              onClick={this.addNote}
            />
          )}
        {numberOfNotes > 2 &&
          cardNotes.data.itemsToDisplay === cardNotes.data.items &&
          !this.state.addNewNote && (
            <FlatButton
              className="Full-card__notes-close"
              label={t.global.close}
              onClick={this.collapseNotes}
            />
          )}
        {this.state.addNewNote && (
          <NotesAdd
            inputPlaceholder={t.cards.takeNote}
            inputValue={this.state.newNoteValue}
            inputOnChange={this.changeNewNoteValue}
            buttonDoneLabel={t.global.done}
            saveNote={() => this.saveNewNote(numberOfNotes)}
            cancelNoteEdition={this.cancelNewNoteEdition}
          />
        )}
      </div>
    )
  }
}

export default Notes
