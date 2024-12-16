import React from 'react'
import { useTranslation } from 'react-i18next'
import { Droppable } from 'react-beautiful-dnd'
import _ from 'lodash'

import PipelineCard from 'components/PipelineCard'

const PipelineStage = ({ id: stageId, name, opportunities }) => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)
  const fundersCount = opportunities.length
  const fundersPlural = fundersCount !== 1

  return (
    <div>
      <h4>{name}</h4>
      <small>{`${fundersCount} ${
        fundersPlural ? t.pipeline.prospectiveFunders : t.pipeline.prospectiveFunder
      }`}</small>
      <Droppable droppableId={`${stageId}`}>
        {provided => (
          <div
            ref={provided.innerRef}
            className={`Pipeline__column ${name}`}
            {...provided.droppableProps}
          >
            {opportunities
              .sort((a, b) => a.pipelineStageOrder - b.pipelineStageOrder)
              .map((opportunity, index) => {
                return <PipelineCard key={opportunity.id} opportunity={opportunity} index={index} />
              })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}

export default PipelineStage
