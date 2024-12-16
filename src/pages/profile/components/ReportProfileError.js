import React, { Component } from 'react'

import { ReportProblem } from 'material-ui-icons'
import { withTranslation } from 'react-i18next'

class ReportProfileError extends Component {
  constructor(props) {
    super(props)
    this.reportError_en = 'https://grantconnecthelp.zendesk.com/hc/en-us/requests/new'
    this.reportError_fr = 'https://grantconnecthelp.zendesk.com/hc/fr-ca/requests/new'
  }

  render() {
    const { i18n } = this.props
    const t = i18n.getResourceBundle(i18n.language)
    return (
      <div className="profile-page-report-error-container">
        <div
          className="profile-page-report-error-content"
          onClick={() => {
            window.open(i18n.language === 'en' ? this.reportError_en : this.reportError_fr)
          }}
        >
          {t.funder.reportError}
        </div>
      </div>
    )
  }
}

export default withTranslation()(ReportProfileError)
