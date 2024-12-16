import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Dialog, FlatButton } from 'material-ui'

import { checkIpRange, extendSession, SESSION_EXPIRY_WARN_THRESHOLD } from 'store/actions/user'
import { selectSession } from 'store/selectors/user'

const SessionTimeoutModal = () => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)

  const dispatch = useDispatch()

  const { expiresIn, hasExpired } = useSelector(selectSession)

  const [isOpen, setIsOpen] = useState(false)
  const [timeLeft, setTimeLeft] = useState(-1)

  const intervalRef = useRef(null)

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const dismiss = () => {
    clearTimer()
    setIsOpen(false)
    setTimeLeft(-1)
  }

  useEffect(() => {
    if (expiresIn < 0) {
      return
    }
    else if (expiresIn > SESSION_EXPIRY_WARN_THRESHOLD) {
      dismiss()
      return
    }

    setIsOpen(true)
    setTimeLeft(expiresIn)

    if (!intervalRef.current) {
      // Update remaining time live
      intervalRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime == 0) {
            clearTimer()
          }
          return prevTime - 1
        })
      }, 1000)
    }

    return clearTimer
  }, [expiresIn])

  // Open modal when session expires
  useEffect(() => { if (hasExpired) setIsOpen(true) }, [hasExpired])

  const modalTextBundle = t.global.sessionTimeoutModal
  const modalText = hasExpired ? modalTextBundle.expired : modalTextBundle.expiring

  const onAction = () => {
    if (hasExpired) {
      dispatch(checkIpRange())
    } else {
      dispatch(extendSession())
    }
    dismiss()
  }

  const sessionActions = (
    <FlatButton
      label={modalText.action}
      primary={true}
      disabled={false}
      onClick={onAction}
    />
  )

  return (
    <Dialog
      className="SessionTimeoutDialog Dialog"
      bodyClassName="Dialog-contents"
      actionsContainerClassName="Dialog-actions"
      title={modalText.title}
      modal={false}
      open={isOpen}
      onRequestClose={dismiss}
      actions={sessionActions}
    >
      <p>{modalText.body.replace('{seconds}', Math.max(timeLeft, 0))}</p>
    </Dialog>
  )
}

export default SessionTimeoutModal
