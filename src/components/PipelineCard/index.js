import React from 'react'
import { useSelector } from 'react-redux'
import { Draggable } from 'react-beautiful-dnd'
import { Link } from 'react-router-dom'
import TextTruncate from 'react-text-truncate'
import _ from 'lodash'

import { PROFILE_PAGE } from 'utils/paths'
import { getDeadlineState, getNextDeadlinesFromPrograms } from 'components/Deadlines/helpers'
import { getPipelines } from 'store/actions/pipeline'
import { selectIsCardUpdating } from 'store/selectors/pipelineCards'
import CardActions from 'components/CardActions'
import HideCardAction from 'components/CardActions/actions/HideAction'
import ResetCardAction from 'components/CardActions/actions/ResetAction'
import ArchiveCardAction from 'components/CardActions/actions/ArchiveAction'
import RequestSize from 'components/ProfileCard/components/RequestSize'
import Deadline from 'components/Deadlines'

const PipelineCard = ({ opportunity, index }) => {
  const { id, funder, requestSize } = opportunity
  const { funderPrograms, status } = funder
  const isCardUpdating = useSelector(selectIsCardUpdating)
  const isFunderDissolved = !!status ? status === 'dissolved' : false

  const { hasOngoingDeadline, closestDeadlineDate } = getNextDeadlinesFromPrograms(funderPrograms)
  const funderHasNoPrograms = funderPrograms ? funderPrograms.length === 0 : true

  const { color: cardColor, Icon, label, showDate } = getDeadlineState({
    deadlineDate: closestDeadlineDate,
    isOngoing: hasOngoingDeadline,
    hasNoPrograms: funderHasNoPrograms,
    isFunderDissolved
  })

  const deadlineLabel =
    hasOngoingDeadline && !closestDeadlineDate.isValid
      ? label
      : !!closestDeadlineDate && showDate && <Deadline format="short" date={closestDeadlineDate} />

  return (
    <Draggable draggableId={`${id}`} index={index} isDragDisabled={isCardUpdating}>
      {provided => (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          <div className={`Pipeline__card ${cardColor}`}>
            <div>
              <Link to={`${PROFILE_PAGE}/${funder.id}`}>
                <TextTruncate line={2} truncateText="..." text={funder.name} />
              </Link>
              {requestSize && <RequestSize opportunity={opportunity} hideLabel={true} />}
              <CardActions
                opportunityId={id}
                actions={[ResetCardAction, ArchiveCardAction, HideCardAction]}
                loadData={() => getPipelines(false)}
              />
              <div className="Pipeline__card-deadline">
                {!!Icon && <Icon />}
                {deadlineLabel}
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  )
}

export default PipelineCard
