// Global DOM components.
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router'
import { FlatButton, TextField, CircularProgress } from 'material-ui'
import { Row, Col } from 'react-flexbox-grid'
import loginBg from '../../assets/login-bg.jpg'
import imagineLogo from '../../assets/imagine-logo.svg'
import imagineLogoMobile from '../../assets/imagine-logo-mobile.svg'
import logoWhite from '../../assets/logo-white.svg'
// Import Constant.
import * as OAuth from '../../utils/OAuth/ContentaOauth-DEPRECATED'
import { LOGIN } from '../../utils/paths'

// App Language.
import { getLanguage } from 'data/locale'

class UpdatePassword extends Component {
  state = {
    token: '',
    username: '',
    timestamp: '',
    validMessage: '',
    validLink: '',
    validType: 'error',
    loading: true,
    passwordError: {
      error: ''
    },
    passwordRepeatError: {
      error: ''
    },
    password: '',
    passwordRepeat: ''
  }
  componentDidMount() {
    const { token, username, timestamp } = this.props.match.params
    const fixed_username = decodeURIComponent(username.replace(/\+/g, ' '))
    OAuth.verifyPasswordUpdateToken(fixed_username, token, timestamp).then(valide => {
      if (valide.valid) {
        this.setState({
          token: token,
          username: fixed_username,
          timestamp: timestamp,
          loading: false
        })
      } else {
        this.setState({
          validMessage: valide.error,
          loading: false,
          validLink: LOGIN
        })
      }
    })
  }
  switchLanguage = e => {
    const { language } = getLanguage()
    const pathName =
      language === 'fr'
        ? window.location.href.replace('/fr', '')
        : `${window.location.origin}/fr${window.location.pathname}`

    window.location.href = pathName

    e.preventDefault()
  }
  updatePassword = e => {
    const { username, token, timestamp, password, passwordRepeat } = this.state
    const { language } = getLanguage()
    if (password === passwordRepeat) {
      this.setState({ loading: true })
      OAuth.updatePassword(language, username, token, timestamp, password).then(validation => {
        if (validation.valid) {
          this.setState({
            validMessage: validation.message,
            loading: false,
            validLink: LOGIN,
            validType: 'valid'
          })
        } else {
          this.setState({
            validMessage: validation.error,
            loading: false
          })
        }
      })
    }
  }
  resetMessage = e => {
    const { validLink } = this.state
    if (validLink !== '') {
      this.props.history.push({ pathname: validLink })
    }

    this.setState({
      validMessage: '',
      validLink: ''
    })
  }
  handlePasswordChange = e => {
    const id = e.target.id
    const { password, passwordRepeat } = this.state
    const { t } = getLanguage()
    if (id === 'password') {
      this.setState({
        password: e.target.value
      })
      if (passwordRepeat !== e.target.value) {
        this.setState({
          passwordRepeatError: {
            errorText: t.user.updatePasswordError
          }
        })
      } else {
        this.setState({
          passwordRepeatError: {
            errorText: ''
          }
        })
      }
    } else {
      this.setState({
        passwordRepeat: e.target.value
      })
      if (password !== e.target.value) {
        this.setState({
          passwordRepeatError: {
            errorText: t.user.updatePasswordError
          }
        })
      } else {
        this.setState({
          passwordRepeatError: {
            error: ''
          }
        })
      }
    }
  }

  render() {
    const { language, t } = getLanguage()
    const languageSwitchString = language === 'en' ? 'FR' : 'EN'
    const {
      token,
      username,
      timestamp,
      validMessage,
      loading,
      passwordError,
      passwordRepeatError,
      validType
    } = this.state
    if (loading) {
      var content = (
        <div className="refresh-container">
          <CircularProgress size={60} thickness={5} color="#4c9eff" />
        </div>
      )
    } else if (validMessage) {
      const label = validType === 'error' ? t.user.updatePasswordRetry : t.user.login
      var content = (
        <div className="reset-password-form">
          {' '}
          <h4>{validMessage}</h4>
          <FlatButton label={label} onClick={this.resetMessage} />
        </div>
      )
    } else if (token) {
      var content = (
        <form className="reset-password-form">
          <TextField
            id="password"
            hintText={t.user.updatePassword}
            floatingLabelText={t.user.updatePassword}
            type="password"
            onChange={this.handlePasswordChange}
            {...passwordError}
          />
          <TextField
            id="passwordrepeat"
            hintText={t.user.updatePasswordRepeat}
            floatingLabelText={t.user.updatePasswordRepeat}
            type="password"
            onChange={this.handlePasswordChange}
            {...passwordRepeatError}
          />
          <FlatButton label={t.user.updatePasswordSubmit} onClick={this.updatePassword} />
        </form>
      )
    }

    return (
      <div>
        <Link to="/" onClick={this.switchLanguage}>
          <FlatButton className="Header-button" label={languageSwitchString} />
        </Link>
        <Row>
          <Col xs={12} md={3} style={{ backgroundImage: `url(${loginBg})` }}>
            <img src={logoWhite} alt="logo" />
            <div className="login__left">
              <h2>{t.global.loginHeaderText}</h2>
              <hr />
              <p>{t.global.loginText}</p>
            </div>
            <img src={imagineLogo} alt="Imagine Canada" className="login__imagine-logo" />
          </Col>
          <Col xs={12} md={9}>
            {content}
          </Col>
          <img
            src={imagineLogoMobile}
            alt="Imagine Canada"
            className="login__imagine-logo-mobile"
          />
        </Row>
      </div>
    )
  }
}

export default UpdatePassword
