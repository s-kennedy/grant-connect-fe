import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatButton, IconButton } from 'material-ui'
import { Cancel } from 'material-ui-icons'

const EditNote = ({ initialValue = '', saveNote, cancel }) => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)

  const [value, setValue] = useState(initialValue)

  return (
    <div>
      <input
        type="text"
        placeholder={t.cards.takeNote}
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <div className="Full-card__notes-new-actions">
        <IconButton className="Full-card__notes-cancel" onClick={cancel}>
          <Cancel />
        </IconButton>
        <FlatButton
          className="Full-card__notes-done"
          label={t.global.save}
          onClick={() => saveNote(value)}
        />
      </div>
    </div>
  )
}

export default EditNote
