import React from 'react'
import { useSelector } from 'react-redux'
import { TableRow, TableRowColumn } from 'material-ui'
import { Link } from 'react-router-dom'

import { PROFILE_PAGE } from 'utils/paths'
import { getPipelines } from 'store/actions/pipeline'
import {
  getDeadlineState,
  getNextDeadlineDate,
  getNextDeadlinesFromPrograms
} from '../Deadlines/helpers'
import PipelineStageButton from 'components/PipelineStageButton'
import CardActions from 'components/CardActions'
import ResetCardAction from 'components/CardActions/actions/ResetAction'
import ArchiveCardAction from 'components/CardActions/actions/ArchiveAction'
import HideCardAction from 'components/CardActions/actions/HideAction'
import { formatNumber, formatSINumber } from 'utils/helpers'
import Deadline from 'components/Deadlines'
import { selectIsLibraryMode } from 'store/selectors/user'

const CollapsedCard = ({
  id,
  name,
  medianGiftSize,
  deadlineDates,
  annualRevenue,
  opportunity,
  funderPrograms
}) => {
  const showResetCardAction =
    opportunity && (opportunity.pipelineStage || opportunity.archived || opportunity.hidden)

  const showArchiveCardAction =
    opportunity && opportunity.pipelineStage && !opportunity.hidden && !opportunity.archived

  const showHideCardAction = !opportunity || !opportunity.hidden

  const { hasOngoingDeadline } = getNextDeadlinesFromPrograms(funderPrograms)
  const deadlineDate = getNextDeadlineDate(deadlineDates)
  const { color: cardColor, label } = getDeadlineState({
    deadlineDate,
    isOngoing: hasOngoingDeadline
  })

  const formattedGiftSize =
    medianGiftSize !== null ? formatNumber(Math.round(medianGiftSize)) : 'N/A'
  const formattedRevenue = annualRevenue !== null ? formatSINumber(annualRevenue) : 'N/A'

  const isLibraryMode = useSelector(selectIsLibraryMode)

  return (
    <TableRow key={id} className={cardColor}>
      <TableRowColumn>
        <Link to={`${PROFILE_PAGE}/${id}`}>{name}</Link>
      </TableRowColumn>
      <TableRowColumn>{formattedGiftSize}</TableRowColumn>
      <TableRowColumn>
        {deadlineDate ? <Deadline date={deadlineDate} format="short" /> : label}
      </TableRowColumn>
      <TableRowColumn>{formattedRevenue}</TableRowColumn>
      {!isLibraryMode && (
        <TableRowColumn>
          <PipelineStageButton
            buttonClass="Material-cards__expanded-state"
            spinnerColor="#479cff"
            opportunity={opportunity}
            funderId={id}
            loadData={() => getPipelines(false)}
          />
        </TableRowColumn>
      )}
      <TableRowColumn>
        <CardActions
          funder={{ id }}
          opportunityId={opportunity && opportunity.id}
          actions={[
            showResetCardAction && ResetCardAction,
            showArchiveCardAction && ArchiveCardAction,
            showHideCardAction && HideCardAction
          ]}
          loadData={() => getPipelines(false)}
        />
      </TableRowColumn>
    </TableRow>
  )
}

export default CollapsedCard
