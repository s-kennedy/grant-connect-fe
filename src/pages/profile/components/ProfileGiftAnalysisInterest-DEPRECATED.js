import React, { Component } from 'react'
import { connect } from 'react-redux'

// Helpers.
import _ from 'lodash'

// App Language.
import { getLanguage } from 'data/locale'
class ProfileGiftAnalysisInterest extends Component {
  render() {
    const { t } = getLanguage()
    return (
      <div className="Profile-gift-analysis-chart">
        <h4>{t.funder.giftBreakdownFunding}</h4>
      </div>
    )
  }
}

export default ProfileGiftAnalysisInterest
