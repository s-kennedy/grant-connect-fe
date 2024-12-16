import React from 'react'
import { useTranslation } from 'react-i18next'
import { Col } from 'react-flexbox-grid'

// Assets
import loginBg from '../../assets/login-bg.jpg'
import imagineLogo from '../../assets/imagine-logo.svg'
import logoWhite from '../../assets/logo-white.svg'
import logoWhiteFr from '../../assets/logo-white-fr.svg'

const LoginSidePanel = () => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)

  const logoImage = i18n.language === 'fr' ? logoWhiteFr : logoWhite

  return (
    <Col
      xs={12}
      md={3}
      className={'login--left-side'}
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      <img src={logoImage} alt="logo" />
      <div className="login__left">
        <h2>{t.global.loginHeaderText}</h2>
        <hr />
        <div className="paragraph">
          <p>{t.global.loginText}</p>
        </div>
      </div>
      <img src={imagineLogo} alt="Imagine Canada" className="login__imagine-logo" />
    </Col>
  )
}

export default LoginSidePanel
