import backend, { setTokenPair } from '../utils/backend'

// OAuth.
import * as OAuth from '../utils/OAuth/ContentaOauth-DEPRECATED'
import { SESSION_TIMEOUT_THRESHOLD } from '../utils/OAuth/ContentaOauth-DEPRECATED'

// API.
// import * as GrantConnectAPI from '../utils/API/ContentaAPI'

// Paths.
import { PIPELINE_PAGE, SEARCH_PAGE, LOGIN, UPDATE_PASSWORD } from '../utils/paths'

export const setPermissions = history => {
  if (OAuth.isLoggedIn()) {
    // return GrantConnectAPI.getUserInfo().then(user => {
    //   let roles = user[0].roles.split(',')
    //   for (let userRoleIndex in roles) {
    //     let role = roles[userRoleIndex].trim()
    //     if (role === 'essential_plan' || role === 'professional_plan') {
    //       localStorage.setItem('executeActions', true)
    //     }
    //     if (role === 'licensed_version') {
    //       localStorage.setItem('licensedUser', true)
    //     }
    //   }
    //   if (typeof localStorage.executeActions !== 'undefined' && window.location.pathname === '/') {
    //     history.push({ pathname: PIPELINE_PAGE })
    //   }
    //   if (typeof localStorage.executeActions === 'undefined') {
    //     if (window.location.pathname === '/') {
    //       history.push({ pathname: SEARCH_PAGE })
    //     } else if (window.location.pathname === PIPELINE_PAGE) {
    //       history.push({ pathname: SEARCH_PAGE })
    //     }
    //   }
    //   return user
    // })
  }
}

export const checkUser = async () => {
  // const path = window.location.pathname.split('/')
  // let first_path = ''
  // if (path[1] == 'fr') {
  //   first_path = '/fr/' + path[2]
  // } else {
  //   first_path = '/' + path[1]
  // }
  // if (!OAuth.isLoggedIn() && window.location.pathname !== LOGIN && first_path !== UPDATE_PASSWORD) {
  //   // perform a check for users with valid IP ranges which don't need to login
  //   const { data: { refresh: refreshToken, access: accessToken } = {} } = await backend.get('/api/token/ipaddress/')
  //   if (refreshToken && accessToken) {
  //     setTokenPair({ refreshToken, accessToken })
  //   } else {
  //     window.location.href = LOGIN
  //   }
  //   return false
  // }
}

export const refreshToken = () => {
  // Refresh the token.
  // const refreshToken = OAuth.oauthGrantRefreshToken()
  // if (refreshToken !== false) {
  //   refreshToken.then(data => {
  //     if (data.error) {
  //       OAuth.deleteToken()
  //       window.location.href = '/login'
  //     } else {
  //       // Make sure we revalidate token.
  //       setInterval(OAuth.oauthGrantRefreshToken, (data.expires_in - SESSION_TIMEOUT_THRESHOLD) * 1000)
  //       OAuth.storeToken(data)
  //     }
  //   })
  // }
}

export const getUserInfo = () => {
  if (OAuth.isLoggedIn()) {
    // return GrantConnectAPI.getUserInfo()
  }

  return false
}
