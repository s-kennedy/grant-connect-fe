import { SET_PIPELINE_STAGES, SET_PIPELINE_STAGES_LOADING } from 'store/actions/pipelineStages'


const initialState = {
  isLoading: true
}

const pipelineStagesReducer = (state = initialState, { payload, type }) => {
  switch (type) {
    case SET_PIPELINE_STAGES_LOADING:
      const { isLoading } = payload
      return { ...state, isLoading }
    case SET_PIPELINE_STAGES:
      const { data } = payload
      return { ...state, ...data }
    default:
      return state
  }
}

export default pipelineStagesReducer
