import { USER_LOGIN_SUCCESS, USER_LOGIN_FAILURE, USER_SET, USER_LOGOUT, USER_SESSION_STATUS, USER_SESSION_EXPIRE } from 'store/actions/user'
import { isAuthenticated, isLibraryMode } from 'utils/backend'

export const RoleEnum = Object.freeze({
  LICENSE: 'License',
  ESSENTIAL: 'Essential',
  PREMIUM: 'Premium'
})

const initialState = {
  isAuthenticated: isAuthenticated(),
  isLibraryMode: isLibraryMode(),
  loginType: null,
  role: RoleEnum.ESSENTIAL,
  session: {
    isRemote: false,
    expiresIn: -1,
    hasExpired: false,
  },
  error: null,
  noRemoteSeats: false
}

const userReducer = (state = initialState, { type, payload = {} }) => {
  switch (type) {
    case USER_LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        isLibraryMode: isLibraryMode(),
        loginType: payload.loginType,
        session: { ...state.session, hasExpired: false }
      }
    case USER_LOGIN_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        isLibraryMode: false,
        loginType: payload.loginType,
        session: { ...initialState.session },
        error: payload.error,
        noRemoteSeats: payload.noRemoteSeats
      }
    case USER_SET:
      return { ...state, ...payload.currentUser }
    case USER_LOGOUT:
      return { ...initialState, isAuthenticated: false, isLibraryMode: false, }
    case USER_SESSION_STATUS:
      return { ...state, session: { ...state.session, ...payload } }
    case USER_SESSION_EXPIRE:
      return { ...state, session: { ...state.session, hasExpired: true } }
    default:
      return state
  }
}

export default userReducer
