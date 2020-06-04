import React from 'react'
import { useDispatch } from 'react-redux'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import IconButton from '@material-ui/core/IconButton'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { logoutUser } from '../../redux/actions'
import { AppState } from '../../types'

export default function Logout() {
  const { currentUser } = useSelector((state: AppState) => state.user)
  const dispatch = useDispatch()
  const logout = () => {
    dispatch(logoutUser())
    localStorage.clear()
  }
  return (
    <>
      {!currentUser.firstName && <Redirect to="/" />}
      <IconButton onClick={logout}>
        <ExitToAppIcon style={{ color: 'white' }} fontSize="large" />
      </IconButton>
    </>
  )
}
