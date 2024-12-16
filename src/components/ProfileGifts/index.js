import React from 'react'
import { Col } from 'react-flexbox-grid'

import GiftAnalysisCause from './components/GiftAnalysisCause'
import GiftAnalysisRegion from './components/GiftAnalysisRegion'
import GiftAnalysis from './components/GiftAnalysis'

const ProfileGifts = () => {
  return (
    <React.Fragment>
      <Col xl={3} lg={3} md={12} sm={12} xs={12}>
        <div className="profile-page-charts-container">
          <GiftAnalysisCause />
          <GiftAnalysisRegion />
        </div>
      </Col>
      <Col xl={9} lg={9} md={12} sm={12} xs={12}>
        <GiftAnalysis />
      </Col>
    </React.Fragment>
  )
}

export default ProfileGifts
