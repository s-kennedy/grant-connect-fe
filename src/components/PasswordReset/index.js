import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Dialog, FlatButton, TextField } from 'material-ui'

import { passwordReset } from 'store/actions/user'

const ResetPassword = () => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)
  const dispatch = useDispatch()

  const [email, setEmail] = useState('')
  const [emailValid, setEmailValid] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [modalOpened, setModalOpened] = useState(false)

  const toggleModal = () => setModalOpened(!modalOpened)

  const handleEmailChange = e => {
    validateEmail(e.target.value)
    setEmail(e.target.value)
  }

  const validateEmail = input => {
    let isValid = true

    if (input === '') {
      setEmailError(t.user.fieldRequired)
      isValid = false
    }
    if (isValid) {
      setEmailError('')
    }
    setEmailValid(isValid)
  }

  const sendPasswordResetEmail = async () => {
    setEmailError('')
    const emailExists = await dispatch(passwordReset(email))

    if (emailExists) {
      toggleModal()
    } else {
      setEmailError(t.user.emailNotFound)
    }
  }

  const onEnter = (e) => {
    e.preventDefault()
    if (emailValid) {
      sendPasswordResetEmail()
    }
  }

  return (
    <div>
      <a className="reset-password-link" onClick={toggleModal}>
        {t.user.resetPassword}
      </a>
      <Dialog
        className="Reset-password-page__facets-dialog"
        title={t.user.resetPassword}
        actions={[
          <FlatButton
            className="reset"
            label={t.user.resetPasswordSubmit}
            disabled={!emailValid}
            onClick={sendPasswordResetEmail}
          />,
          <FlatButton label={t.global.close} onClick={toggleModal} />
        ]}
        open={modalOpened}
      >
        <form className="Login">
          <label>{t.user.userNameOrEmail}</label>
          <TextField
            hintText={t.user.email}
            floatingLabelText={t.user.email}
            onChange={handleEmailChange}
            onKeyPress={(e) => e.key === 'Enter' ? onEnter(e) : null}
            errorText={emailError}
          />
        </form>
      </Dialog>
    </div>
  )
}

export default ResetPassword
