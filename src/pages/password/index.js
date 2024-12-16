import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { TextField, FlatButton } from 'material-ui'
import { Row, Col } from 'react-flexbox-grid'
import queryString from 'query-string'

import LoginSidePanel from 'components/LoginSidePanel'

import { confirmPasswordReset, redirectTo } from 'store/actions/user'

const PasswordResetPage = () => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)
  const { search } = useLocation()
  const { token } = queryString.parse(search)
  const dispatch = useDispatch()

  const [password, setPassword] = useState('')
  const [passwordRepeat, setPasswordRepeat] = useState('')
  const [passwordValid, setPasswordValid] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordRepeatError, setPasswordRepeatError] = useState('')
  
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handlePasswordChange = e => {
    setErrorMessage('')
    validatePassword(e.target.value, passwordRepeat)
    setPassword(e.target.value)
  }

  const handleRepeatChange = e => {
    setErrorMessage('')
    validatePassword(password, e.target.value)
    setPasswordRepeat(e.target.value)
  }

  const submitNewPassword = async () => {
    const { success, err } = await dispatch(confirmPasswordReset(password, token))

    if (!success) {
      setSuccessMessage('')
      setErrorMessage(err)
    } else {
      setErrorMessage('')
      setSuccessMessage(t.user.updatePasswordSuccess)
      await new Promise(resolve => setTimeout(resolve, 3000));
      dispatch(redirectTo('/login'))
    }
  }

  const validatePassword = (pass, repeat) => {
    const empty = ''
    let isValid = true

    if (pass === empty) {
      setPasswordError(t.user.fieldRequired)
      isValid = false
    }
    if (repeat === empty) {
      setPasswordRepeatError(t.user.fieldRequired)
      isValid = false
    }
    if (pass !== repeat) {
      setPasswordRepeatError(t.user.updatePasswordError)
      isValid = false
    }
    if (isValid) {
      setPasswordError(empty)
      setPasswordRepeatError(empty)
    }
    setPasswordValid(isValid)
  }

  return (
    <div>
      <Row>
        <LoginSidePanel />
        <Col xs={12} md={9}>
          <div className="password_reset_dialog">
            <b>{t.user.resetPasswordText}</b>
            <h3>{t.user.resetPasswordTitle}</h3>
            <form className="Login">
              <TextField
                floatingLabelText={t.user.updatePassword}
                type="password"
                onChange={handlePasswordChange}
                errorText={passwordError}
                disabled={!!successMessage}
              />
              <TextField
                floatingLabelText={t.user.updatePasswordRepeat}
                type="password"
                onChange={handleRepeatChange}
                errorText={passwordRepeatError}
                disabled={!!successMessage}
              />
              {!!successMessage ? (
                <div className='message-success'>
                  {successMessage}
                </div>
              ) : (
                <FlatButton
                  disabled={!passwordValid}
                  label={t.user.updatePasswordSubmit}
                  onClick={submitNewPassword}
                />
              )}
            </form>

            {!!errorMessage && (
              <div className='message-danger'>
                {errorMessage}
              </div>
            )}
            
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default PasswordResetPage
