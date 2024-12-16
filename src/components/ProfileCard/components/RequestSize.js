import React, { useState } from 'react'
import { FlatButton, IconButton } from 'material-ui'
import { ModeEdit } from 'material-ui-icons'
import { getLanguage } from 'data/locale'
import { useDispatch } from 'react-redux'
import { updateRequestSize } from 'store/actions/pipeline'

const RequestSize = ({ opportunity, hideLabel = false }) => {
  const { t } = getLanguage()
  const dispatch = useDispatch()

  const requestSize = opportunity ? opportunity.requestSize : null
  const opportunityId = opportunity ? opportunity.id : null
  const defaultText = 'N/A'

  const [lastInput, setLastInput] = useState(requestSize || defaultText)
  const [requestSizeInput, setRequestSizeInput] = useState('')
  const [showRequestSizeInput, setShowRequestSizeInput] = useState(false)

  const requestSizeLabel = hideLabel ? '' : `${t.cards.requestSize}:`

  const handleSaveRequestSize = () => {
    dispatch(updateRequestSize(opportunityId, requestSizeInput))
    setLastInput(requestSizeInput || defaultText)
    setShowRequestSizeInput(false)
  }

  return opportunity ? (
    <div className={`Full-card__request-size open-${showRequestSizeInput}`}>
      {!showRequestSizeInput && <small>{`${requestSizeLabel} ${lastInput}`}</small>}
      {showRequestSizeInput && (
        <div>
          <small>{`${t.cards.requestSize}:`}</small>
          <input
            className="Full-card__request-size-input"
            type="text"
            maxLength="10"
            value={requestSizeInput}
            onChange={e => setRequestSizeInput(e.target.value)}
          />
          <FlatButton
            className="Full-card__status"
            label={t.global.save}
            onClick={handleSaveRequestSize}
          />
          <FlatButton
            className="Full-card__status"
            label={t.global.cancel}
            onClick={() => setShowRequestSizeInput(false)}
          />
        </div>
      )}
      {!showRequestSizeInput && (
        <IconButton
          className="Full-card__request-size-edit"
          onClick={() => setShowRequestSizeInput(true)}
        >
          <ModeEdit />
        </IconButton>
      )}
    </div>
  ) : null
}

export default RequestSize
