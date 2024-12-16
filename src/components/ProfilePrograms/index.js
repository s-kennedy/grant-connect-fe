import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Col } from 'react-flexbox-grid'

import { selectFunderProfileInfo } from 'store/selectors/profile'
import FunderPrograms from './components/FunderPrograms'
import FunderProgramInfo from './components/FunderProgramInfo'

const ProfilePrograms = () => {
  const { funderPrograms } = useSelector(selectFunderProfileInfo)

  const [programIndex, setProgramIndex] = useState(0)

  return (
    <React.Fragment>
      <Col xs={12} sm={12} md={7}>
        <FunderPrograms funderPrograms={funderPrograms} setProgramIndex={setProgramIndex} />
      </Col>
      <Col xs={12} sm={12} md={5}>
        <FunderProgramInfo funderProgram={funderPrograms[programIndex]} />
      </Col>
    </React.Fragment>
  )
}

export default ProfilePrograms
