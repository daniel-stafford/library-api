import { combineReducers } from 'redux'

import product from './product'
import ui from './ui'
import user from './user'
import book from './book'

const createRootReducer = () =>
  combineReducers({
    product,
    ui,
    user,
    book,
  })

export default createRootReducer
