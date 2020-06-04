import axios from 'axios'

export const createBookAxios = async (bodyParameters: any) => {
  const config = {
    headers: { Authorization: `${localStorage.getItem('token')}` },
  }
  return await axios.post(
    'http://localhost:3001/api/v1/books',
    bodyParameters,
    config
  )
}

export const borrowBookAxios = async (bodyParameters: any) => {
  const config = {
    headers: { Authorization: `${localStorage.getItem('token')}` },
  }
  return await axios.put(
    'http://localhost:3001/api/v1/books/book-lend',
    bodyParameters,
    config
  )
}

export const returnBookAxios = async (bodyParameters: any) => {
  const config = {
    headers: { Authorization: `${localStorage.getItem('token')}` },
  }
  return await axios.put(
    'http://localhost:3001/api/v1/books/book-return',
    bodyParameters,
    config
  )
}

export const getAllBooksAxios = async () => {
  const config = {
    headers: { Authorization: `${localStorage.getItem('token')}` },
  }
  return await axios.get('http://localhost:3001/api/v1/books', config)
}

export const getUserById = async (id: string) => {
  const config = {
    headers: { Authorization: `${localStorage.getItem('token')}` },
  }
  return await axios.get(`http://localhost:3001/api/v1/users/${id}`, config)
}
