import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { CircularProgress } from 'material-ui'
import { Row, Col } from 'react-flexbox-grid'
import { DragDropContext } from 'react-beautiful-dnd'
import _ from 'lodash'

import { getPipelines, updatePipelineItemOrder } from 'store/actions/pipeline'
import { setCardIsUpdating } from 'store/actions/pipelineCards'
import { getPipelineStages } from 'store/actions/pipelineStages'
import { selectIsPipelineLoading, selectPipeline } from 'store/selectors/pipeline'
import { selectPipelineStages } from 'store/selectors/pipelineStages'
import PipelineStage from 'components/PipelineStage'
import SearchPageViewChanger from 'pages/search/components/SearchPageViewChanger'
import PipelineFilters from 'components/PipelineFilters'
import PipelineTable from 'components/PipelineTable'
import { selectIsLibraryMode } from 'store/selectors/user'
import { redirectTo } from 'store/actions/user'
import { useHotjar } from 'utils/hotjar'
import { trackChangeFunderPipelineStage } from 'utils/mixpanel'

const LS_KEY = 'pipelineView'
const pipelineViews = {
  EXPANDED: 'expanded',
  COLLAPSED: 'collapsed'
}

const Pipeline = () => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)

  const isLoading = useSelector(selectIsPipelineLoading)
  const { results: pipelineData } = useSelector(selectPipeline)
  const { results: pipelineStages } = useSelector(selectPipelineStages)
  const dispatch = useDispatch()

  // Having a local, in-state copy of the data is necessary for Beautiful Drag and Drop
  const [localPipelineData, setLocalPipelineData] = useState([])
  const [archivedPipelineData, setArchivedPipelineData] = useState([])
  const [hiddenPipelineData, setHiddenPipelineData] = useState([])
  const [pipelineView, setPipelineView] = useState(localStorage[LS_KEY] || pipelineViews.EXPANDED)
  const [pipelineFilter, setPipelineFilter] = useState()
  const [archivedFilter, setArchivedFilter] = useState(false)
  const [showOnlyHidden, setShowOnlyHidden] = useState(false)
  const [resultsPerPage, setResultsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const columnSize = pipelineView === pipelineViews.EXPANDED ? 12 : 9
  const isLibraryMode = useSelector(selectIsLibraryMode)

  useEffect(() => {
    if (isLibraryMode) {
      dispatch(redirectTo('/search'))
    }
  }, [isLibraryMode])

  useHotjar()

  useEffect(() => {
    dispatch(getPipelines())
    dispatch(getPipelineStages())
  }, [])

  useEffect(() => {
    setLocalPipelineData(pipelineData.filter(item => item.pipelineStage))
    setArchivedPipelineData(pipelineData.filter(item => item.archived))
    setHiddenPipelineData(pipelineData.filter(item => item.hidden))
  }, [pipelineData, setLocalPipelineData, setArchivedPipelineData, setHiddenPipelineData])

  const opportunityFilter = item => {
    let included = true

    if (pipelineView === pipelineViews.EXPANDED) {
      return included && !item.hidden
    }

    included = included && (pipelineFilter ? item.pipelineStage?.id === pipelineFilter : true)

    return included
  }

  const updateDb = async (pipelineId, opportunityId, newPosition) => {
    await dispatch(setCardIsUpdating(true))
    
    const success = await dispatch(updatePipelineItemOrder(pipelineId, opportunityId, newPosition))

    await dispatch(setCardIsUpdating(false))
    
    return success
  }

  const onDragEnd = async ({ reason, destination, draggableId }) => {
    if (!destination || reason === 'CANCEL') return

    const opportunityId = Number(draggableId)
    const pipelineId = Number(destination.droppableId)
    const newPosition = destination.index

    const opportunity = localPipelineData.find(item => item.id === opportunityId)
    const opportunitiesInPipeline = localPipelineData
      .filter(item => !item.hidden && !item.archived)
      .filter(item => item.pipelineStage.id === pipelineId && item.id !== opportunityId)
      .sort((a, b) => a.pipelineStageOrder - b.pipelineStageOrder)

    const prevStageId = opportunity.pipelineStage && opportunity.pipelineStage.id || opportunity.pipelineStage

    const updatedPipeline = [
      ...opportunitiesInPipeline.slice(0, newPosition),
      {
        ...opportunity,
        pipelineStage: { id: pipelineId },
        pipelineStageOrder: newPosition
      },
      ...opportunitiesInPipeline.slice(newPosition)
    ].map((item, index) => ({
      ...item,
      pipelineStage: { id: pipelineId },
      pipelineStageOrder: index
    }))

    const updatedLocalPipelineData = [
      ...localPipelineData.filter(
        item => item.pipelineStage.id !== pipelineId && item.id !== opportunityId
      ),
      ...updatedPipeline
    ]

    setLocalPipelineData(updatedLocalPipelineData)
    updateDb(pipelineId, opportunityId, newPosition)

    await trackChangeFunderPipelineStage({ funderId: opportunity.funder.id, prevStageId, stageId: pipelineId })
  }

  const togglePipelineView = newView => {
    localStorage.setItem(LS_KEY, newView)
    setPipelineView(newView)
  }

  if (isLoading)
    return (
      <div className="refresh-container">
        <CircularProgress size={60} thickness={5} color="#4c9eff" />
      </div>
    )

  return (
    <div className={`Pipeline_container ${pipelineView}`}>
      {localPipelineData.length === 0 && (
        <div className="profile-special-notes">
          <div className="profile-special-notes-note">{t.pipeline.pipelineEmpty}</div>
        </div>
      )}
      <Row className="Pipeline__container">
        {pipelineView === 'collapsed' && (
          <Col xs={12} md={3}>
            <PipelineFilters
              pipelineStages={pipelineStages}
              counts={_(localPipelineData)
                // item.hidden can be false or null, by design
                .filter(item => (showOnlyHidden ? item.hidden : !item.hidden))
                .groupBy('pipelineStage.id')
                .value()}
              pipelineFilter={pipelineFilter}
              applyFilter={val => {
                setCurrentPage(1)
                setArchivedFilter(null)
                setPipelineFilter(val)
              }}
              showOnlyHidden={showOnlyHidden}
              setShowOnlyHidden={val => {
                setCurrentPage(1)
                setPipelineFilter(null)
                setShowOnlyHidden(val)
              }}
              archivedCount={archivedPipelineData.length}
              archivedFilter={archivedFilter}
              setArchivedFilter={() => {
                setCurrentPage(1)
                setPipelineFilter(null)
                setArchivedFilter(true)
              }}
            />
          </Col>
        )}
        <Col md={columnSize}>
          <Row>
            <h3>{t.pipeline.pipeline}</h3>
            <p>{`${localPipelineData.filter(opportunityFilter).length} ${
              localPipelineData.filter(opportunityFilter).length !== 1
                ? t.pipeline.prospectiveFunders
                : t.pipeline.prospectiveFunder
            }`}</p>
            <SearchPageViewChanger
              onClick={togglePipelineView}
              expandedActive={pipelineView === pipelineViews.EXPANDED ? 'active' : ''}
              collapsedActive={pipelineView === pipelineViews.COLLAPSED ? 'active' : ''}
              pipelineData={localPipelineData}
              download={true}
            />
          </Row>
          <Row className="Pipeline">
            {pipelineView === 'expanded' && (
              <DragDropContext onDragEnd={onDragEnd}>
                {_(pipelineStages)
                  .orderBy('order')
                  .map((stage, stageId) => (
                    <div className="Pipeline__wrapper" key={stageId}>
                      <PipelineStage
                        id={stage.id}
                        name={stage.name}
                        opportunities={localPipelineData.filter(
                          item => !item.hidden && item.pipelineStage.id === stage.id
                        )}
                      />
                    </div>
                  ))
                  .value()}
              </DragDropContext>
            )}
            {pipelineView === 'collapsed' && (
              <PipelineTable
                filteredOpportunities={
                  archivedFilter
                    ? archivedPipelineData
                    : showOnlyHidden
                      ? hiddenPipelineData.filter(opportunityFilter)
                      : localPipelineData.filter(opportunityFilter)
                }
                resultsPerPage={resultsPerPage}
                setResultsPerPage={setResultsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            )}
          </Row>
        </Col>
      </Row>
    </div>
  )
}

export default Pipeline
