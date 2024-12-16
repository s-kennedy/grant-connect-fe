import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Dialog, FlatButton } from 'material-ui'

import { checkIpRange } from 'store/actions/user'

const LoginErrorModal = ({ isOpen, dismiss }) => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)

  const dispatch = useDispatch()

  const [actionEnabled, setActionEnabled] = useState(true)

  const modalText = t.global.loginErrorModal.noRemoteSeats

  const retry = () => {
    setActionEnabled(false)
    dispatch(checkIpRange()).then(() => { setActionEnabled(true) })
  }

  const actions = (
    <FlatButton
      label={modalText.action}
      primary={true}
      disabled={!actionEnabled}
      onClick={retry}
    />
  )

  return (
    <Dialog
      className="LoginErrorModal Dialog"
      bodyClassName="Dialog-contents"
      actionsContainerClassName="Dialog-actions"
      title={modalText.title}
      modal={false}
      open={isOpen}
      onRequestClose={dismiss}
      actions={actions}
    >
      <p>{modalText.body}</p>
    </Dialog>
  )
}

export default LoginErrorModal
