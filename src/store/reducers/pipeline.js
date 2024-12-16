import { SET_PIPELINE, SET_PIPELINE_LOADING } from 'store/actions/pipeline'


const initialState = {
  isLoading: true,
  results: []
}

const pipelineReducer = (state = initialState, { payload, type }) => {
  switch (type) {
    case SET_PIPELINE_LOADING:
      const { isLoading } = payload
      return { ...state, isLoading }
    case SET_PIPELINE:
      const { data } = payload
      return { ...state, ...data }
    default:
      return state
  }
}

export default pipelineReducer
