import React, { Component } from 'react'
import { FlatButton, TextField, Dialog } from 'material-ui'
import { getLanguage } from 'data/locale'
import { reCaptchaKey } from '../../../config/env.js'
import ReCAPTCHA from 'react-google-recaptcha'
import { verifyUsernameOrEmail } from '../../../utils/OAuth/ContentaOauth-DEPRECATED'

class ResetPassword extends Component {
  state = {
    username: '',
    userError: {},
    modalOpened: false,
    captcha: false,
    userNameOrEmail: '',
    validMessage: false
  }
  toggleModal = e => {
    this.setState({
      modalOpened: !this.state.modalOpened
    })
  }
  captchaChange = e => {
    this.setState({
      captcha: e
    })
  }
  handleUserChange = e => {
    this.setState({
      username: e.target.value,
      userError: {}
    })
  }
  submitResetPassword = e => {
    const { t } = getLanguage()
    const { username, captcha } = this.state
    let errors = false
    if (captcha === false) {
      this.setState({
        userError: {
          errorText: t.user.resetPasswordCaptchaError
        }
      })
      errors = true
    }
    if (username === '') {
      this.setState({
        userError: {
          errorText: t.user.fieldRequired
        }
      })
      errors = true
    }
    if (!errors) {
      var that = this
      const { language } = getLanguage()
      verifyUsernameOrEmail(language, username, captcha).then(verify => {
        if (!verify.valid) {
          this.setState({
            userError: {
              errorText: verify.error
            }
          })
          this.refs.recaptcha.reset()
        } else {
          this.setState({
            validMessage: verify.message
          })
        }
      })
    }
  }

  render() {
    const { language, t } = getLanguage()
    const { modalOpened, validMessage } = this.state
    const { userError } = this.state

    let dialogContent = validMessage
    if (!validMessage) {
      dialogContent = (
        <form className="Login">
          <label>{t.user.userNameOrEmail}</label>
          <TextField
            hintText={t.user.email}
            floatingLabelText={t.user.email}
            onChange={this.handleUserChange}
            {...userError}
          />
          <ReCAPTCHA
            ref="recaptcha"
            //size="invisible"
            sitekey={reCaptchaKey}
            onChange={this.captchaChange}
            lang={language}
          />
          <FlatButton
            label={t.user.resetPasswordSubmit}
            onClick={e => this.submitResetPassword(e)}
            className="reset"
          />
        </form>
      )
    }
    return (
      <div>
        <a
          //className="Login-page__reset-password"
          className="reset-password-link"
          onClick={e => this.toggleModal(e)}
        >
          {' '}
          {t.user.resetPassword}{' '}
        </a>
        <Dialog
          className="Reset-password-page__facets-dialog"
          title={t.user.resetPassword}
          actions={<FlatButton label={t.global.close} onClick={e => this.toggleModal(e)} />}
          open={modalOpened}
        >
          {dialogContent}
        </Dialog>
      </div>
    )
  }
}

export default ResetPassword
