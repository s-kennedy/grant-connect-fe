import React from 'react'
import { useSelector } from 'react-redux'
import { Col, Row } from 'react-flexbox-grid'
import { Paper } from 'material-ui'

import { selectFunderProfileCategory, selectFunderProfileInfo } from 'store/selectors/profile'
import SpecialNote from './components/SpecialNote'
import NotEngagedNote from './components/NotEngagedNote'

const DissolvedProfileCard = ({}) => {
  const { name } = useSelector(selectFunderProfileInfo)
  const category = useSelector(selectFunderProfileCategory)

  return (
    <Col xs={12}>
      <Paper className={`Full-card gray`}>
        <Row>
          <Col xs={12} lg={7} xl={8}>
            <Row>
              <Col xs={12} lg={12} xl={6}>
                <h1 className="tw-text-xl">{name}</h1>
              </Col>
              <Col xs={12} lg={12} xl={6}>
                <small className="Full-card__type tw-text-sm">{category}</small>
              </Col>
            </Row>
          </Col>
        </Row>
      </Paper>
      <SpecialNote />
      <NotEngagedNote />
    </Col>
  )
}

export default DissolvedProfileCard
