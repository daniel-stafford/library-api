import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'

import Home from './pages/Home'
import Books from './pages/Books'
import MyLoans from './pages/MyLoans'
import Login from './pages/Login'
import AddBook from './pages/AddBook'

import AdminNav from '../src/layouts/Admin'
import UserNav from '../src/layouts/User'
import { AppState } from './types'

export default function Routes() {
  const { currentUser } = useSelector((state: AppState) => state.user)
  const Layout = currentUser.isAdmin ? AdminNav : UserNav

  return (
    <Switch>
      <Route exact path="/" component={Login} />
      <Layout>
        <Route exact path="/home" component={Home} />
        <Route exact path="/books" component={Books} />
        <Route exact path="/my-loans" component={MyLoans} />
        <Route exact path="/add-book" component={AddBook} />
      </Layout>
    </Switch>
  )
}
