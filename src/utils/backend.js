import axios from 'axios'
import i18n from 'i18n'
import { getBaseURL } from '../config/env'
import history from './history'
import { LOGIN } from './paths'

const axiosInstance = axios.create({
  baseURL: getBaseURL()
})

const axiosUninterceptedInstance = axios.create({
  baseURL: getBaseURL()
})

export const getTokenPair = () => ({
  accessToken: window && window.localStorage.getItem('grant-connect-access-token'),
  refreshToken: window && window.localStorage.getItem('grant-connect-refresh-token')
})

export const setTokenPair = ({ accessToken, refreshToken }) => {
  accessToken && window && window.localStorage.setItem('grant-connect-access-token', accessToken)
  refreshToken && window && window.localStorage.setItem('grant-connect-refresh-token', refreshToken)
}

export const setIsLibraryMode = isLibraryMode => {
  window && window.localStorage.setItem('grant-connect-library-mode', !!isLibraryMode)
}

export const isLibraryMode = () =>
  window && window.localStorage.getItem('grant-connect-library-mode') === 'true'

export const deleteTokenPair = () => {
  window && window.localStorage.removeItem('grant-connect-access-token')
  window && window.localStorage.removeItem('grant-connect-refresh-token')
}

export const isAuthenticated = () => {
  const { accessToken, refreshToken } = getTokenPair()
  // return !!accessToken && !!refreshToken
  return true
}

const refreshAccessToken = async () => {
  const { accessToken, refreshToken } = getTokenPair()

  if (refreshToken) {
    try {
      const {
        data: { access: newAccesstoken }
      } = await axiosUninterceptedInstance.post('/api/token/refresh/', {
        refresh: refreshToken,
        access: accessToken
      })
      setTokenPair({ accessToken: newAccesstoken })
    } catch (error) {
      console.error(`Failed refreshing the access token: ${error}`)
      deleteTokenPair()
      history.push(LOGIN)
    }
  }
}

axiosInstance.interceptors.request.use(
  config => {
    // set default headers
    config.headers['Accept'] = 'application/json'
    config.headers['Content-Type'] = 'application/json; charset=utf-8'
    config.headers['Accept-Language'] = i18n.language

    // automatically attach access token if present in local storage
    const { accessToken } = getTokenPair()
    if (accessToken) {
      config.headers['Authorization'] = 'Bearer ' + accessToken
    }

    return config
  },
  err => Promise.reject(err)
)

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    let request = error.config

    if (!!error.response && error.response.status === 401 && !request._retry) {
      request._retry = true

      await refreshAccessToken()
      const { accessToken } = getTokenPair()

      if (accessToken) {
        return axiosInstance({
          ...request,
          _retry: true,
          headers: {
            ...request.headers,
            Authorization: `Bearer ${accessToken}`
          }
        })
      }
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
