// Global DOM components.
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { FlatButton, TextField } from 'material-ui'
import { Row, Col } from 'react-flexbox-grid'

// App Language.
import { getLanguage } from 'data/locale'

// Images.
import imagineLogoMobile from '../../assets/imagine-logo-mobile.svg'

import LoginErrorModal from 'components/LoginErrorModal'
import LoginSidePanel from 'components/LoginSidePanel'
import ResetPassword from 'components/PasswordReset'

import { debouncedLoginUser, logoutUser } from 'store/actions/user'
import { isAuthenticated } from 'utils/backend'
import { useHotjar } from 'utils/hotjar'

const Login = () => {
  const dispatch = useDispatch()
  const authError = useSelector(state => state.user.error)
  const noRemoteSeats = useSelector(state => state.user.noRemoteSeats)
  const [state, setState] = useState({
    user: '',
    userError: {},
    password: '',
    passwordError: {},
    modalOpen: false,
  })
  const { user, userError, password, passwordError } = state

  useHotjar()

  /* Backend module does not have access to the store, so when token refresh fails,
   * it clears local storage and redirects to /login, but internally the app state
   * still believes the user is authenticated. This hook ensures the state gets
   * properly updated.
   */
  useEffect(() => { if (!isAuthenticated()) dispatch(logoutUser()) }, [])

  useEffect(() => {
    setState({ ...state, userError: { errorText: authError } })
  }, [authError])

  const { language, t } = getLanguage()
  const languageSwitchString = language === 'en' ? 'FR' : 'EN'

  const switchLanguage = e => {
    language === 'fr'
      ? window.location.href.replace('/fr', '')
      : `${window.location.origin}/fr${window.location.pathname}`

    window.location.href = pathName
    e.preventDefault()
  }
  const handleInputChange = ({ target }) => {
    // set the state and clean error object based on target name and value
    setState({
      ...state,
      [target.name]: target.value,
      [`${target.name}Error`]: {}
    })
  }
  const handleLogin = () => {
    if (!user || !password) {
      setState({
        ...state,
        ...(!user && {
          userError: {
            errorText: 'This field is required'
          }
        }),
        ...(!password && {
          passwordError: {
            errorText: 'This field is required'
          }
        })
      })
    } else {
      debouncedLoginUser({ username: user, password }, dispatch)
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  }

  useEffect(() => {
    if (noRemoteSeats) {
      setState({ ...state, modalOpen: true })
    }
  }, [noRemoteSeats])

  return (
    <div>
      <Link to="/" onClick={switchLanguage}>
        <FlatButton className="Header-button" label={languageSwitchString} />
      </Link>
      <Row>
        <LoginSidePanel />
        <Col xs={12} md={9}>
          <div className="login__right">
            <h3>{t.global.loginFormText}</h3>
            {/* Keep commented for future use - SUP-14674 
            <h4 className="maintenanceMessage">{t.global.maintenanceMessage}</h4>*/}
            <form className="Login" onSubmit={handleSubmit}>
              <TextField
                hintText={t.user.user}
                floatingLabelText={t.user.user}
                name="user"
                onChange={handleInputChange}
                {...userError}
              />
              <TextField
                hintText={t.user.password}
                floatingLabelText={t.user.password}
                type="password"
                name="password"
                onChange={handleInputChange}
                {...passwordError}
              />
              <FlatButton type="submit" label={t.user.login} />
            </form>
            <ResetPassword />
            <a href={t.user.noAccountUrl}>
              {' '}
              {t.user.noAccount} - {t.user.register}
            </a>
          </div>
        </Col>
        <img src={imagineLogoMobile} alt="Imagine Canada" className="login__imagine-logo-mobile" />
      </Row>
      <LoginErrorModal isOpen={state.modalOpen} dismiss={() => { setState({ ...state, modalOpen: false }) }} />
    </div>
  )
}

export default Login
