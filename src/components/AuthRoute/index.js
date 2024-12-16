import React from 'react'
import { useDispatch } from 'react-redux'
import { Route } from 'react-router'

import { getCurrentUser, logoutUser } from 'store/actions/user'

import { isAuthenticated } from 'utils/backend'

const AuthRoute = ({ component: Component, ...rest }) => {
  const dispatch = useDispatch()
  return (
    <Route
      {...rest}
      render={props => {
        if (isAuthenticated()) {
          dispatch(getCurrentUser())
          return <Component {...props} />
        }
        dispatch(logoutUser())
      }}
    />
  )
}

export default AuthRoute
