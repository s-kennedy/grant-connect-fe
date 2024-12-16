import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-flexbox-grid'
import { FlatButton, TextField, Divider } from 'material-ui'

import { getLanguage } from 'data/locale'
import { changePassword, changeUsername, logoutUser, redirectTo } from 'store/actions/user'
import { selectIsLibraryMode, selectUser } from 'store/selectors/user'

const UserProfilePage = () => {
  const { t } = getLanguage()
  const dispatch = useDispatch()

  const isLibraryMode = useSelector(selectIsLibraryMode)
  const user = useSelector(selectUser)

  const [currentUsername, setCurrentUsername] = useState('')
  const [newUsername, setNewUsername] = useState('')
  const [usernameValid, setUsernameValid] = useState(false)
  const [currentUsernameError, setCurrentUsernameError] = useState('')
  const [newUsernameError, setNewUsernameError] = useState('')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [passwordValid, setPasswordValid] = useState(false)
  const [currentPasswordError, setCurrentPasswordError] = useState('')
  const [newPasswordError, setNewPasswordError] = useState('')
  const [passwordRepeatError, setPasswordRepeatError] = useState('')

  useEffect(() => {
    setCurrentUsername(user.username);
  },[user])

  useEffect(() => {
    if (isLibraryMode) {
      dispatch(redirectTo('/search'))
    }
  }, [isLibraryMode])

  const handleCurrentUsernameChange = e => {
    validateUsername(e.target.value, newUsername)
    setCurrentUsername(e.target.value)
  }

  const handleNewUsernameChange = e => {
    validateUsername(currentUsername, e.target.value)
    setNewUsername(e.target.value)
  }

  const handleCurrentPasswordChange = e => {
    validatePassword(e.target.value, newPassword, repeatPassword)
    setCurrentPassword(e.target.value)
  }

  const handleNewPasswordChange = e => {
    validatePassword(currentPassword, e.target.value, repeatPassword)
    setNewPassword(e.target.value)
  }

  const handleRepeatPasswordChange = e => {
    validatePassword(currentPassword, newPassword, e.target.value)
    setRepeatPassword(e.target.value)
  }

  const validateUsername = (current, newUsername) => {
    const empty = ''
    let isValid = true

    if (current === empty) {
      setCurrentUsernameError(t.user.fieldRequired)
      isValid = false
    }
    if (newUsername === empty) {
      setNewUsernameError(t.user.fieldRequired)
      isValid = false
    }
    if (newUsername === current) {
      setNewUsernameError(t.user.profileEdit.newUsernameError)
      isValid = false
    }
    if (isValid) {
      setCurrentUsernameError(empty)
      setNewUsernameError(empty)
    }
    setUsernameValid(isValid)
  }

  const validatePassword = (current, newPassword, repeat) => {
    const empty = ''
    let isValid = true

    if (current === empty) {
      setCurrentPasswordError(t.user.fieldRequired)
      isValid = false
    }
    if (newPassword === empty) {
      setNewPasswordError(t.user.fieldRequired)
      isValid = false
    }
    if (repeat === empty) {
      setPasswordRepeatError(t.user.fieldRequired)
      isValid = false
    }
    if (newPassword === current) {
      setNewPasswordError(t.user.profileEdit.newPasswordError)
      isValid = false
    }
    if (newPassword !== repeat) {
      setPasswordRepeatError(t.user.updatePasswordError)
      isValid = false
    }
    if (isValid) {
      setCurrentPasswordError(empty)
      setNewPasswordError(empty)
      setPasswordRepeatError(empty)
    }
    setPasswordValid(isValid)
  }

  const submitNewUsername = async () => {
    await dispatch(changeUsername(newUsername))
    dispatch(logoutUser())
  }

  const submitNewPassword = async () => {
    await dispatch(changePassword(newPassword))
    dispatch(logoutUser())
  }

  return (
    <div className="user-edit">
      <Row>
        <Col xs={12} md={9}>
          <form>
            <h2> {t.user.profileEdit.editUsername} </h2>
            <TextField
              id="username"
              floatingLabelText={t.user.profileEdit.actualUsername}
              onChange={handleCurrentUsernameChange}
              errorText={currentUsernameError}
              value={currentUsername}
            />
            <TextField
              id="newusername"
              floatingLabelText={t.user.profileEdit.newUsername}
              onChange={handleNewUsernameChange}
              errorText={newUsernameError}
            />
            <FlatButton
              disabled={!usernameValid}
              label={t.user.profileEdit.submitUsername}
              onClick={submitNewUsername}
            />
          </form>
          <Divider />
          <form>
            <h2> {t.user.profileEdit.editPassword} </h2>
            <TextField
              id="actualpassword"
              type="password"
              floatingLabelText={t.user.profileEdit.actualPassword}
              onChange={handleCurrentPasswordChange}
              errorText={currentPasswordError}
            />
            <TextField
              id="newpassword"
              type="password"
              floatingLabelText={t.user.updatePassword}
              onChange={handleNewPasswordChange}
              errorText={newPasswordError}
            />
            <TextField
              id="newpasswordrepeat"
              type="password"
              floatingLabelText={t.user.updatePasswordRepeat}
              onChange={handleRepeatPasswordChange}
              errorText={passwordRepeatError}
            />
            <FlatButton
              disabled={!passwordValid}
              label={t.user.profileEdit.submitPassword}
              onClick={submitNewPassword}
            />
          </form>
        </Col>
      </Row>
    </div>
  )
}

export default UserProfilePage
