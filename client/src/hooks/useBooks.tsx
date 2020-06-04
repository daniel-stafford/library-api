import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { fetchBooksApi } from '../redux/actions'

const useBooks = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    if (localStorage.getItem('token')) dispatch(fetchBooksApi())
  }, [dispatch])
}

export default useBooks
