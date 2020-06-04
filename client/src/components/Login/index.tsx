import React from 'react'
import { GoogleLogin } from 'react-google-login'
import axios from 'axios'
import { useDispatch } from 'react-redux'

import { loginUser } from '../../redux/actions'

export default function Login() {
  const dispatch = useDispatch()
  const googleClientId =
    '118090390095-4ulgncep5ef9maik9p3jffav5e7ah4s8.apps.googleusercontent.com'

  const handleResponse = async (response: any) => {
    let res = await axios.post(
      'http://localhost:3001/api/v1/users/google-authenticate',
      { id_token: response.tokenObj.id_token }
    )
    dispatch(loginUser(res.data))
    localStorage.setItem('token', res.data.token)
  }

  return (
    <>
      <GoogleLogin
        clientId={googleClientId}
        buttonText="Sign in with Google"
        onSuccess={handleResponse}
        onFailure={handleResponse}
      />
    </>
  )
}
