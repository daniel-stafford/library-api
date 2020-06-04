import React from 'react'
import { useSelector } from 'react-redux'

import { AppState } from '../types'

export default function Home() {
  const { firstName } = useSelector((state: AppState) => state.user.currentUser)

  return <h1>Welcome, {firstName}</h1>
}
