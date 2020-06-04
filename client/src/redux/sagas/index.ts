import { all, takeLatest, select } from 'redux-saga/effects'

function* saveState() {
  const state = yield select()
  yield localStorage.setItem('store', JSON.stringify(state))
}

export default function* rootSaga() {
  yield all([takeLatest('*', saveState)])
}
