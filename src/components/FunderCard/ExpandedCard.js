import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import ReactGA from 'react-ga4'
import TextTruncate from 'react-text-truncate'
import { Row, Col } from 'react-flexbox-grid'
import { Paper } from 'material-ui'
import { LocationOn } from 'material-ui-icons'

import PipelineStageButton from 'components/PipelineStageButton'
import CardActions from 'components/CardActions'

import { PROFILE_PAGE } from 'utils/paths'
import { stripTags, formatNumber } from 'utils/helpers'
import { trackFunderSearchResultClick } from 'utils/mixpanel'
import {
  getDeadlineState,
  getNextDeadlineDate,
  getNextDeadlinesFromPrograms
} from '../Deadlines/helpers'
import { selectCurrentPage, selectViewsPerPage } from 'store/selectors/searchPagination'
import { getPipelines } from 'store/actions/pipeline'
import ResetCardAction from 'components/CardActions/actions/ResetAction'
import ArchiveCardAction from 'components/CardActions/actions/ArchiveAction'
import HideCardAction from 'components/CardActions/actions/HideAction'
import Deadline from 'components/Deadlines'

const ExpandedCard = ({
  id,
  name,
  index,
  filterTitles,
  medianGiftSize,
  deadlineDates,
  programCount,
  funderPrograms,
  opportunity,
  notificationIcon,
  notification,
  address
}) => {
  const { hasOngoingDeadline } = getNextDeadlinesFromPrograms(funderPrograms)
  const deadlineDate = getNextDeadlineDate(deadlineDates)

  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)

  const viewsPerPage = useSelector(selectViewsPerPage)
  const currentPage = useSelector(selectCurrentPage)

  const funderHasNoPrograms = !!programCount ? programCount === 0 : true
  const { color: cardColor, Icon, label, showDate } = getDeadlineState({
    deadlineDate,
    hasNoPrograms: funderHasNoPrograms,
    isOngoing: hasOngoingDeadline
  })
  const deadlineLabel =
    hasOngoingDeadline && (!deadlineDate || !deadlineDate.isValid)
      ? label
      : !!deadlineDate &&
        showDate && (
          <>
            {label} <Deadline format="long" date={deadlineDate} />
          </>
        )

  const formattedGift = formatNumber(Math.round(medianGiftSize))

  const handleSearchResultClick = async () => {
    ReactGA.event({
      category: 'Click on search result',
      action: `click`,
      label: `position: ${
        viewsPerPage * (currentPage ? parseInt(currentPage) - 1 : 0) + index + 1
      }`,
      value: viewsPerPage * (currentPage ? parseInt(currentPage) - 1 : 0) + index + 1
    })

    await trackFunderSearchResultClick(id)
  }

  const showResetCardAction =
    opportunity && (opportunity.pipelineStage || opportunity.archived || opportunity.hidden)

  const showArchiveCardAction =
    opportunity && opportunity.pipelineStage && !opportunity.hidden && !opportunity.archived

  const showHideCardAction = !opportunity || !opportunity.hidden

  return (
    <Paper className={`Material-cards Material-cards__expanded ${cardColor}`} zDepth={0}>
      <Row>
        <Col xs={12} md={5} lg={5}>
          <h3 className="tw-text-md md:tw-text-lg">
            <Link to={`${PROFILE_PAGE}/${id}`} onClick={handleSearchResultClick}>
              {name}
            </Link>
          </h3>
          <div className="Material-cards__expanded-teaser">
            <small className="tw-text-sm">
              <TextTruncate line={2} truncateText="..." text={stripTags(filterTitles)} />
            </small>
          </div>
        </Col>
        <Col xs={12} md={7} lg={7} className="Material-cards__expanded-right">
          <div className="Material-cards__expanded-actions-wrapper">
            <p className="tw-text-sm Material-cards__expanded-typical-gift">
              <strong>
                {t.funder.funderPrograms}: {programCount}
              </strong>
            </p>

            <p className="tw-text-sm Material-cards__expanded-typical-gift">
              <strong>
                {t.cards.typicalGift}: {formattedGift || 'N/A'}
              </strong>
            </p>
            <PipelineStageButton
              buttonClass="Material-cards__expanded-state"
              spinnerColor="white"
              opportunity={opportunity}
              funderId={id}
              loadData={() => getPipelines(false)}
            />
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
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <div className="Material-cards__expanded-notification">
            <p className="tw-text-sm">
              {notificationIcon} {notification}
            </p>
          </div>
          {address && (
            <div className="Material-cards__expanded-location">
              <div className="tw-text-sm tw-flex tw-items-center">
                <LocationOn />
                <small className="tw-text-sm tw-pt-4">
                  {t.cards.headquarters}: {address}
                </small>
              </div>
            </div>
          )}
          <div className={`Material-cards__expanded-deadline ${cardColor}`}>
            <small>
              {!!Icon && <Icon />}
              {deadlineLabel}
            </small>
          </div>
        </Col>
      </Row>
    </Paper>
  )
}

export default ExpandedCard
