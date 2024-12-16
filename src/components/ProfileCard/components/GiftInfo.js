import React from 'react'
import { Col } from 'react-flexbox-grid'
import { CircularProgress } from 'material-ui'

import { formatSINumber } from 'utils/helpers'

const GiftInfo = ({ giftInfos }) => (
  <Col xs={12} lg={9} lgOffset={5} className="Full-card__values">
    {giftInfos.reduce((items, { label, value }, idx, arr) => {
      const isFirst = idx === 0
      const isLast = idx === arr.length - 1

      if (!value) return items

      return items.concat(
        <div
          key={label}
          className={`tw-mt-4 ${isFirst ? 'tw-mr-4' : ''} ${isLast ? 'tw-ml-4' : ''} ${
            !isFirst && !isLast ? 'tw-mx-4' : ''
          }`}
        >
          <small className="tw-text-sm">{label}</small>
          <big>{formatSINumber(value)}</big>
        </div>
      )
    }, [])}
  </Col>
)

export default GiftInfo
