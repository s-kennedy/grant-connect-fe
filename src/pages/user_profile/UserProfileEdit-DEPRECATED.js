// Global DOM components.
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router'
import { FlatButton, TextField, CircularProgress, Divider } from 'material-ui'
import { Row, Col } from 'react-flexbox-grid'
import loginBg from '../../assets/login-bg.jpg'
import imagineLogo from '../../assets/imagine-logo.svg'
import imagineLogoMobile from '../../assets/imagine-logo-mobile.svg'
import logoWhite from '../../assets/logo-white.svg'
// Import Constant.
// import { editUsername, updatePasswordProfile } from '../../utils/API/ContentaAPI'
import { LOGIN } from '../../utils/paths'

// App Language.
import { getLanguage } from 'data/locale'
import * as OAuth from '../../utils/OAuth/ContentaOauth-DEPRECATED'

class UserProfileEdit extends Component {
  state = {
    newUsername: '',
    username: '',
    password: '',
    newPasswordUsername: '',
    actualPassword: '',
    newPassword: '',
    newPasswordRepeat: '',
    errors: {
      passwordError: {
        errorText: ''
      },
      passwordRepeatError: {
        errorText: ''
      },
      actualUsernameError: {
        errorText: ''
      },
      userNameChangeError: {
        errorText: ''
      },
      actualPasswordError: {
        errorText: ''
      },
      newPasswordUsername: {
        errorText: ''
      },
      actualPassword: {
        errorText: ''
      }
    },
    message: false,
    passwordMessage: false
  }

  updatePassword = e => {
    const { newPassword, newPasswordRepeat, actualPassword, newPasswordUsername } = this.state
    const { t } = getLanguage()
    if (newPasswordRepeat === '') {
      this.setState({
        errors: {
          passwordRepeatError: {
            errorText: t.user.fieldRequired
          }
        }
      })
      return
    }
    if (newPasswordRepeat === newPassword) {
      if (actualPassword !== '') {
        if (newPasswordUsername !== '') {
          updatePasswordProfile(newPasswordUsername, actualPassword, newPassword).then(valide => {
            if (valide.valid) {
              this.setState({
                passwordMessage: valide.message
              })
            } else {
              this.setState({
                passwordMessage: valide.error
              })
            }
          })
        } else {
          this.setState({
            errors: {
              newPasswordUsername: {
                errorText: t.user.fieldRequired
              }
            }
          })
        }
      } else {
        this.setState({
          errors: {
            actualPassword: {
              errorText: t.user.fieldRequired
            }
          }
        })
      }
    } else {
      this.setState({
        errors: {
          passwordRepeatError: {
            errorText: t.user.updatePasswordError
          }
        }
      })
    }
  }
  handleUsernameChange = e => {
    if (e.target.value === '') {
    } else {
      const { username, newUsername } = this.state
      const id = e.target.id
      const { t } = getLanguage()
      if (id === 'username') {
        this.setState({
          username: e.target.value
        })
        if (e.target.value === newUsername) {
          this.setState({
            errors: {
              userNameChangeError: {
                errorText: t.user.profileEdit.newUsernameError
              }
            }
          })
        } else {
          this.setState({
            errors: {
              userNameChangeError: {
                errorText: ''
              }
            }
          })
        }
      } else {
        this.setState({
          newUsername: e.target.value
        })
        if (e.target.value === username) {
          this.setState({
            errors: {
              userNameChangeError: {
                errorText: t.user.profileEdit.newUsernameError
              }
            }
          })
        } else {
          this.setState({
            errors: {
              userNameChangeError: {
                errorText: ''
              }
            }
          })
        }
      }
    }
  }
  updateUsername = e => {
    const { t } = getLanguage()
    const { password, username, newUsername, passwordError } = this.state
    if (username === '') {
      this.setState({
        errors: {
          actualUsernameError: {
            errorText: t.user.fieldRequired
          }
        }
      })
      return
    } else if (newUsername === '') {
      this.setState({
        errors: {
          userNameChangeError: {
            errorText: t.user.fieldRequired
          }
        }
      })
      return
    }
    if (username !== newUsername) {
      if (password !== '') {
        editUsername(username, newUsername, password).then(valide => {
          if (valide.valid) {
            this.setState({
              message: valide.message
            })
          } else {
            this.setState({
              message: valide.error
            })
          }
        })
      } else {
        this.setState({
          errors: {
            passwordError: {
              errorText: t.user.fieldRequired
            }
          }
        })
      }
    } else {
      this.setState({
        errors: {
          userNameChangeError: {
            errorText: t.user.profileEdit.newUsernameError
          }
        }
      })
    }
  }
  cleanMessage = e => {
    this.setState({
      message: false,
      passwordMessage: false
    })
  }
  handlePasswordChange = e => {
    const id = e.target.id
    const { newPassword, newPasswordRepeat } = this.state
    const { t } = getLanguage()

    if (id === 'newpassword') {
      this.setState({
        newPassword: e.target.value
      })
      if (newPasswordRepeat !== e.target.value) {
        this.setState({
          errors: {
            passwordRepeatError: {
              errorText: t.user.updatePasswordError
            }
          }
        })
      } else {
        this.setState({
          errors: {
            passwordRepeatError: {
              errorText: ''
            }
          }
        })
      }
    } else {
      this.setState({
        newPasswordRepeat: e.target.value
      })
      if (newPassword !== e.target.value) {
        this.setState({
          errors: {
            passwordRepeatError: {
              errorText: t.user.updatePasswordError
            }
          }
        })
      } else {
        this.setState({
          errors: {
            passwordRepeatError: {
              errorText: ''
            }
          }
        })
      }
    }
  }

  render() {
    const isLogged = OAuth.isLoggedIn()
    const { t } = getLanguage()
    const {
      username,
      newUsername,
      password,
      newPassword,
      newPasswordRepeat,
      errors,
      message,
      passwordMessage
    } = this.state
    return (
      <div className="user-edit">
        {isLogged && (
          <Row>
            <Col xs={12} md={9}>
              <h2> {t.user.profileEdit.editUsername} </h2>
              {message ? (
                <p>
                  {message}
                  <FlatButton label={t.user.updatePasswordRetry} onClick={this.cleanMessage} />
                </p>
              ) : (
                <form>
                  <TextField
                    id="username"
                    hintText={t.user.profileEdit.actualUsername}
                    floatingLabelText={t.user.profileEdit.actualUsername}
                    onChange={this.handleUsernameChange}
                    {...errors.actualUsernameError}
                  />
                  <TextField
                    id="newusername"
                    hintText={t.user.profileEdit.newUsername}
                    floatingLabelText={t.user.profileEdit.newUsername}
                    onChange={this.handleUsernameChange}
                    {...errors.userNameChangeError}
                  />
                  <TextField
                    id="changeUsernamePassword"
                    hintText={t.user.updatePassword}
                    floatingLabelText={t.user.password}
                    type="password"
                    onChange={e => {
                      if (e.target.value !== '') {
                        this.setState({ password: e.target.value })
                      } else {
                        this.setState({
                          passwordError: {
                            errorText: t.user.fieldRequired
                          }
                        })
                      }
                    }}
                    {...errors.passwordError}
                  />
                  <FlatButton
                    label={t.user.profileEdit.editUsername}
                    onClick={this.updateUsername}
                  />
                </form>
              )}
              <Divider />

              <h2> {t.user.profileEdit.editPassword} </h2>
              {passwordMessage ? (
                <p>
                  {passwordMessage}
                  <FlatButton label={t.user.updatePasswordRetry} onClick={this.cleanMessage} />
                </p>
              ) : (
                <form>
                  <TextField
                    id="newPasswordUsername"
                    hintText={t.user.profileEdit.actualUsername}
                    floatingLabelText={t.user.profileEdit.actualUsername}
                    onChange={e => {
                      this.setState({ newPasswordUsername: e.target.value })
                    }}
                    {...errors.newPasswordUsername}
                  />
                  <TextField
                    id="actualpassword"
                    hintText={t.user.profileEdit.actualPassword}
                    floatingLabelText={t.user.profileEdit.actualPassword}
                    type="password"
                    onChange={e => {
                      this.setState({ actualPassword: e.target.value })
                    }}
                    {...errors.actualPassword}
                  />
                  <TextField
                    id="newpassword"
                    hintText={t.user.updatePassword}
                    floatingLabelText={t.user.updatePassword}
                    type="password"
                    onChange={this.handlePasswordChange}
                  />
                  <TextField
                    id="newpasswordrepeat"
                    hintText={t.user.updatePasswordRepeat}
                    floatingLabelText={t.user.updatePasswordRepeat}
                    type="password"
                    onChange={this.handlePasswordChange}
                    {...errors.passwordRepeatError}
                  />
                  <FlatButton label={t.user.updatePasswordSubmit} onClick={this.updatePassword} />
                </form>
              )}
            </Col>
          </Row>
        )}
      </div>
    )
  }
}

export default UserProfileEdit
