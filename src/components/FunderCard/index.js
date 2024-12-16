import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { CardViewEnum } from 'store/reducers/pageSettings'
import { selectCardView } from 'store/selectors/pageSettings'
import CollapsedCard from './CollapsedCard'
import ExpandedCard from './ExpandedCard'

// Renders Collapsed or Expanded card based on cardView state
const FunderCard = ({ data, index, opportunity }) => {
  const cardView = useSelector(selectCardView)
  return (
    <Fragment>
      {cardView === CardViewEnum.COLLAPSED && <CollapsedCard {...data} index={index} opportunity={opportunity} />}
      {cardView === CardViewEnum.EXPANDED && <ExpandedCard {...data} index={index} opportunity={opportunity} />}
    </Fragment>
  )
}

export default FunderCard

// named imports for convenience
export { CollapsedCard, ExpandedCard }
