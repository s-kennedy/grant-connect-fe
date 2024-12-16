// API URL.
import { getBaseURL } from '../../config/env'

export const SESSION_TIMEOUT_THRESHOLD = 200
//Oauth Path.
const apiOauthTokenUrl = `${getBaseURL()}/oauth/token`
//Api Client Key For OAuth.
const apiClientKey = '9565e3a3-1ca0-4140-9ba2-be56cf989e65'
//Api Secre Key for OAuth.
const apiClientSecret = 'te.`b9x@.a#GNE2E'
//For now we use local storage to store oauth token.
//We may want to change that later.
const storage = window.localStorage

/**
 * So a Grant Password Oauth Authorization
 */
export const oauthGrantPasswordAuthorization = (userName, passWord) => {
  //Small issue With x-www-form-urlencoded and fetch see https://github.com/github/fetch/issues/263
  let params = {
    grant_type: 'password',
    client_id: apiClientKey,
    client_secret: apiClientSecret,
    username: userName,
    password: passWord,
    scope: 'essential_plan licensed_version professional_plan trial_account'
  }

  // if (window.location.host === 'app-beta-grantconnect-ca.eztest.ocls.ca') {
  //   if (!userName  && !passWord) {
  //     params.grant_type = 'client_credentials';
  //   }
  // }

  const oauthParams = getOauthParams(params)

  return fetch(apiOauthTokenUrl, {
    method: 'POST',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: oauthParams
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        storeToken({})
        return false
      }
      // Valid Token obtain.
      else {
        // Make sure we revalidate token.
        setInterval(oauthGrantRefreshToken, (data.expires_in - SESSION_TIMEOUT_THRESHOLD) * 1000)
        fetch(getBaseURL() + '/session/token', {
          method: 'GET',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
          }
        })
          .then(res => res.text())
          .then(data => {
            storeCSRF(data)
          })

        return storeToken(data)
      }
    })
}
export const verifyUsernameOrEmail = (lang, username, captcha) => {
  if (lang === 'fr') {
    lang = '/fr'
  } else {
    lang = ''
  }
  return fetch(`${getBaseURL()}${lang}/jsonapi/verify_user/${username}/${captcha}`, {
    method: 'GET'
  })
    .then(res => res.json())
    .then(valide => valide)
}

export const verifyPasswordUpdateToken = (username, token, timestamp) => {
  return fetch(
    `${getBaseURL()}/jsonapi/verify_password_update_token/${username}/${token}/${timestamp}`,
    {
      method: 'GET'
    }
  )
    .then(res => res.json())
    .then(valide => valide)
}

export const updatePassword = (lang, username, token, timestamp, password) => {
  if (lang === 'fr') {
    lang = '/fr'
  } else {
    lang = ''
  }
  const params = {
    username: username,
    token: token,
    timestamp: timestamp,
    password: password
  }
  return fetch(`${getBaseURL()}${lang}/jsonapi/update_password`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
    .then(res => res.json())
    .then(valide => valide)
}
let executed = false

/**
 * Refresh the token.
 * The usual Oauth token duration is 300 sec for security reason.
 * If the refresh token is out of date we have to ask for Grant Password again.
 */
export const oauthGrantRefreshToken = () => {
  executed = true

  if (!executed && getToken().refresh_token) {
    const params = {
      grant_type: 'refresh_token',
      client_id: apiClientKey,
      client_secret: apiClientSecret,
      refresh_token: getToken().refresh_token
    }
    const oauthParams = getOauthParams(params)

    return fetch(apiOauthTokenUrl, {
      method: 'POST',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: oauthParams
    }).then(res => res.json())
  }

  return false
}

const storeCSRF = data => {
  storage.setItem('oauth_CSRF', data)
}

const getCSRF = () => {
  return storage.getItem('oauth_CSRF')
}

/**
 * Getting the params.
 */
const getOauthParams = params => {
  return Object.keys(params)
    .map(key => {
      return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
    })
    .join('&')
}

/**
 * Store Token info in the storage
 */
export const storeToken = data => {
  if (data.expires_in) {
    data.expire = Date.now() + data.expires_in * 100
  }

  storage.setItem('oauth_token', JSON.stringify(data))

  return data
}

/**
 * Get Token from the storage
 */
const getToken = () => {
  if (storage.getItem('oauth_token') !== null && storage.getItem('oauth_token').length > 0) {
    return JSON.parse(storage.getItem('oauth_token'))
  }

  return false
}

/**
 * Check If token is valid.
 */
export const checkToken = () => {
  //Get Actual token stored.
  const token = getToken('oauth_token')

  //Check if it exists.
  if (token && Date.now() < token.expire) {
    return true
  }

  return false
}

export const isLoggedIn = () => {
  if (!getToken('oauth_token')) {
    return false
  }

  return Object.keys(getToken('oauth_token')).length !== 0
}

export const logout = () => {
  deleteToken()
}

export const deleteToken = () => {
  storage.removeItem('oauth_token')
}

export const getHeaders = () => {
  const token = getToken('oauth_token')
  const csrf = getCSRF()
  if (token.access_token) {
    return {
      Authorization: `Bearer ${token.access_token}`,
      'X-CSRF-Token': csrf
    }
  }

  return {}
}
