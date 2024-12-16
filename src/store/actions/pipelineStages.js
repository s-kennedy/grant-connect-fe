import backend from 'utils/backend'

export const SET_PIPELINE_STAGES = 'SET_PIPELINE_STAGES'
export const PIPELINE_STAGES_RESULTS_FAILURE = 'PIPELINE_STAGES_RESULTS_FAILURE'
export const SET_PIPELINE_STAGES_LOADING = 'SET_PIPELINE_STAGES_LOADING'

export const getPipelineStages = () => async dispatch => {
  dispatch({ type: SET_PIPELINE_STAGES_LOADING, payload: { isLoading: true } })

  try {
    const { data } = await backend.get(`api/pipelinestages/`)
    if (data) {
      dispatch({ type: SET_PIPELINE_STAGES, payload: { data } })
      dispatch({ type: SET_PIPELINE_STAGES_LOADING, payload: { isLoading: false } })
    }
  } catch (err) {
    console.log({ err })
  }
}