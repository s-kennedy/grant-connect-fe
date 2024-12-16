import backend from 'utils/backend'

export const SET_PIPELINE = 'SET_PIPELINE'
export const PIPELINE_RESULTS_FAILURE = 'PIPELINE_RESULTS_FAILURE'
export const SET_PIPELINE_LOADING = 'SET_PIPELINE_LOADING'

export const setPipelineLoading = newLoadingState => async dispatch => {
  dispatch({ type: SET_PIPELINE_LOADING, payload: { isLoading: newLoadingState } })
}

export const getPipelines = (setLoadingState = true) => async dispatch => {
  if (setLoadingState) dispatch(setPipelineLoading(true))

  try {
    let nextPageUrl = 'api/organizationfunderopportunities-list/'
    let pipelineData = {results: []}

    while (nextPageUrl) {
      const { data } = await backend.get(nextPageUrl)
      pipelineData = {
        ...pipelineData,
        ...data,
        results: [
          ...pipelineData.results,
          ...data.results,
        ]
      }

     nextPageUrl = data.next 
    }

    if (pipelineData) {
      dispatch({ type: SET_PIPELINE, payload: { data: pipelineData } })
      dispatch({ type: SET_PIPELINE_LOADING, payload: { isLoading: false } })
    }
  } catch (err) {
    console.log({ err })
  }
}

export const addToPipeline = (funderId, pipelineId) => async dispatch => {
  try {
    await backend.post(`api/organizationfunderopportunities/`, {
      funder: funderId,
      pipeline_stage: pipelineId,
      archived: false
    })
  } catch (err) {
    console.log({ err })
  }
}

export const addToPipelineAndHide = funderId => async dispatch => {
  try {
    await backend.post(`api/organizationfunderopportunities/`, {
      funder: funderId,
      pipeline_stage: null,
      archived: false,
      hidden: true
    })
  } catch (err) {
    console.log({ err })
  }
}

export const updatePipelineItem = (pipelineId, opportunityId, position) => async dispatch => {
  const payload = {
    pipeline_stage: pipelineId,
    archived: false,
    ...(position ? { pipeline_stage_order: position } : null)
  }
  try {
    await backend.patch(`api/organizationfunderopportunities/${opportunityId}/`, payload)
  } catch (err) {
    console.log({ err })
  }
}

export const updatePipelineItemOrder = (pipelineId, opportunityId, position) => async dispatch => {
  const payload = {
    pipeline_stage: pipelineId,
    pipeline_stage_order: position,
  }
  try {
    await backend.patch(`api/organizationfunderopportunities/${opportunityId}/reorder/`, payload)
  } catch (err) {
    console.log({ err })
  }
}

export const markHidden = opportunityId => async dispatch => {
  try {
    await backend.patch(`api/organizationfunderopportunities/${opportunityId}/`, {
      hidden: true,
      archived: false
    })
  } catch (err) {
    console.log({ err })
  }
}

export const reset = opportunityId => async dispatch => {
  try {
    await backend.patch(`api/organizationfunderopportunities/${opportunityId}/`, {
      pipeline_stage: null,
      hidden: false,
      archived: false
    })
  } catch (err) {
    console.log({ err })
  }
}

export const archive = opportunityId => async dispatch => {
  try {
    await backend.patch(`api/organizationfunderopportunities/${opportunityId}/`, {
      pipeline_stage: null,
      hidden: false,
      archived: true
    })
  } catch (err) {
    console.log({ err })
  }
}

export const updateRequestSize = (opportunityId, requestSize) => async dispatch => {
  try {
    await backend.patch(`api/organizationfunderopportunities/${opportunityId}/`, {
      request_size: requestSize
    })
  } catch (err) {
    console.log({ err })
  }
}
