import { throttle } from 'lodash'
import userflow from 'userflow.js'

import { userflowToken } from '../../config/env'
import backend, { setTokenPair, deleteTokenPair, setIsLibraryMode, isAuthenticated } from 'utils/backend'
import history from 'utils/history'
import { trackLogin } from 'utils/mixpanel'
import { getAllFacetsAndSyncURL } from 'store/actions/facets'
import { selectUser } from 'store/selectors/user'


export const USER_LOGIN = 'USER_LOGIN'
export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS'
export const USER_LOGIN_FAILURE = 'USER_LOGIN_FAILURE'
export const USER_SET = 'USER_SET'
export const USER_LOGOUT = 'USER_LOGOUT'
export const USER_SESSION_STATUS = 'USER_SESSION_STATUS'
export const USER_SESSION_EXPIRE = 'USER_SESSION_EXPIRE'
export const REDIRECT = 'REDIRECT'

export const redirectTo = path => dispatch => {
  dispatch({ type: REDIRECT, payload: { prevPath: history.location.pathname, nextPath: path } })
  history.push(path)
}

const loginUserSuccess = loginType => async dispatch => {
  // fetch facet trees and once all succeed, sync url with redux store
  dispatch(getAllFacetsAndSyncURL())
  dispatch({ type: USER_LOGIN_SUCCESS, payload: { loginType } })

  if (loginType === 'credentials') {
    await trackLogin()
  }
}
const loginUserFailure = (loginType, data) => ({
  type: USER_LOGIN_FAILURE,
  payload: { loginType, ...data }
})

const setCurrentUser = currentUser => ({ type: USER_SET, payload: { currentUser } })

export const SESSION_EXPIRY_WARN_THRESHOLD = 60

export const updateSessionStatus = () => async dispatch => {
  if (!isAuthenticated()) {
    return
  }

  const { data: { expiresIn, isRemote, error, code } = {} } = await backend.get('api/session/status/')
  if (error) {
    await dispatch(logoutUser())
    if (code === 'expired_session') {
      dispatch({ type: USER_SESSION_EXPIRE })
    }
    return
  }
  dispatch({ type: USER_SESSION_STATUS, payload: { expiresIn, isRemote } })

  if (isRemote) {
    const nextUpdate = expiresIn > SESSION_EXPIRY_WARN_THRESHOLD
      ? Math.min(120, expiresIn - SESSION_EXPIRY_WARN_THRESHOLD)
      : Math.min(15, expiresIn)
    setTimeout(() => { dispatch(updateSessionStatus()) }, nextUpdate * 1000)
  }
}

export const extendSession = () => async dispatch => {
  await backend.post('api/session/extend/')

  try {
    const { data: { expiresIn, isRemote } = {} } = await backend.get('api/session/status/')
    dispatch({ type: USER_SESSION_STATUS, payload: { expiresIn, isRemote } })
  } catch (err) {
    console.log(err)
  }
}

/*
 * Checks users IP address and either successfully logs in and redirects to /pipeline
 * or
 * redirects to /login
 */
export const checkIpRange = () => async dispatch => {
  try {
    const { data: { refresh: refreshToken, access: accessToken } = {} } = await backend.get(
      'api/token/ipaddress/'
    )
    if (refreshToken && accessToken) {
      setTokenPair({ refreshToken, accessToken })
      setIsLibraryMode(true)
      dispatch(loginUserSuccess('iprange'))
      dispatch(updateSessionStatus())
      dispatch(redirectTo('/search'))
    }
  } catch (err) {
    dispatch(redirectTo('/login'))
    dispatch(loginUserFailure('iprange', { noRemoteSeats: err.response.status === 401 }))
  }
}

/*
 * Checks users credentials and either successfully logs in and redirects to /pipeline
 * or
 * dispatches `loginUserFailure` action with error message
 */
export const loginUser = ({ username, password }) => async dispatch => {
  try {
    const { data: { refresh: refreshToken, access: accessToken } = {} } = await backend.post(
      'api/token/',
      {
        username,
        password
      }
    )
    if (refreshToken && accessToken) {
      setTokenPair({ refreshToken, accessToken })
      setIsLibraryMode(false)
      dispatch(loginUserSuccess('credentials'))
      dispatch(redirectTo('/search'))
    } else {
      throw new Error('Invalid credentials')
    }
  } catch (err) {
    const msg = err && err.response && err.response.data && err.response.data.detail
    dispatch(loginUserFailure('credentials', { error: msg || 'Invalid credentials' }))
  }
}

export const debouncedLoginUser = throttle(({ username, password }, dispatch) => {
  dispatch(loginUser({ username, password }))
}, 1000)

export const logoutUser = () => async dispatch => {
  try {
    if (isAuthenticated()) {
      await backend.post('api/token/blacklist/')
    }
  } catch (err) {}

  deleteTokenPair()
  setIsLibraryMode(false)
  await dispatch({ type: USER_LOGOUT })
  dispatch(redirectTo('/login'))
}

/**
 * Fetches the information of the current logged user
 */
export const getCurrentUser = () => async (dispatch, getState) => {
  const { id } = selectUser(getState())
  
  if (id) {
    // User info is already loaded.
    return
  }

  try {
    const { data: user } = await backend.get('api/currentuser/')

    if (user) {
      dispatch(setCurrentUser(user))
      initUserflow(user)
    } else {
      throw new Error('No results')
    }
  } catch (error) {
    return { error: error.message }
  }
}

/**
 * Asks to reset the logged users password
 * Returns true or false depending on if the email address exists.
 */
export const passwordReset = email => async dispatch => {
  try {
    await backend.post(`api/password_reset/`, { email })
    return true
  } catch (err) {
    if (err?.response?.status === 404) {
      return false
    } else {
      console.log({ err })
    }
  }
}

/**
 * Confirms the reset of the logged users password
 */
export const confirmPasswordReset = (password, token) => async dispatch => {
  try {
    await backend.post(`api/password_reset_confirm/`, { password, token })
    return { success: true, err: null }
  } catch (err) {
    console.log({ err })
    return { success: false, err: err?.message || '' }
  }
}

/**
 * Changes the username of the logged user
 */
export const changeUsername = username => async dispatch => {
  try {
    await backend.post(`api/users/change_username/`, { username })
  } catch (err) {
    console.log({ err })
  }
}

/**
 * Changes the password of the logged user
 */
export const changePassword = password => async dispatch => {
  try {
    await backend.post(`api/users/change_password/`, { password })
  } catch (err) {
    console.log({ err })
  }
}

const initUserflow = ({ id, username, email, createdAt }) => {
  userflow.init(userflowToken)
  userflow.identify(id, {
    name: username,
    email: email,
    signed_up_at: createdAt
  })
}
