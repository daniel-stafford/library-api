import request from 'supertest'
import { Request, Response, NextFunction } from 'express'

import { AuthorDocument } from '../../src/models/Author'
import app from '../../src/app'
import * as dbHelper from '../db-helper'

const nonExistingAuthorId = '5e57b77b5744fa0b461c7906'

jest.mock(
  '../../src/middlewares/authJWT',
  () => (req: Request, res: Response, next: NextFunction) => next()
)

async function createAuthor(override?: Partial<AuthorDocument>) {
  let author = {
    firstName: 'Frank',
    lastName: 'McCourt',
  }

  if (override) {
    author = { ...author, ...override }
  }

  return await request(app)
    .post('/api/v1/authors')
    .send(author)
}

describe('author controller', () => {
  beforeEach(async () => {
    await dbHelper.connect()
  })

  afterEach(async () => {
    await dbHelper.clearDatabase()
  })

  afterAll(async () => {
    await dbHelper.closeDatabase()
  })

  it('should create an author', async () => {
    const res = await createAuthor()
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('_id')
    expect(res.body.firstName).toBe('Frank')
    expect(res.body.lastName).toBe('McCourt')
  })

  it('should not create an author with wrong data', async () => {
    const res = await request(app)
      .post('/api/v1/authors')
      .send({
        firstName: 'Frank',
        favoriteFood: 2019,
      })
    expect(res.status).toBe(400)
  })

  it('should get back an existing author', async () => {
    let res = await createAuthor()
    expect(res.status).toBe(200)
    const authorId = res.body._id
    res = await request(app).get(`/api/v1/authors/${authorId}`)
    expect(res.body._id).toEqual(authorId)
  })

  it('should not get back a non-existing author', async () => {
    const res = await request(app).get(`/api/v1/authors/${nonExistingAuthorId}`)
    expect(res.status).toBe(404)
  })

  it('should get back all authors', async () => {
    await createAuthor({
      firstName: 'John',
      lastName: 'Updike',
    })
    await createAuthor({
      firstName: 'Tom',
      lastName: 'Clancy',
    })
    const res3 = await request(app).get('/api/v1/authors')
    expect(res3.body.length).toEqual(2)
  })

  it('should update an existing author', async () => {
    let res = await createAuthor()
    expect(res.status).toBe(200)

    const authorId = res.body._id
    const update = {
      firstName: 'Bobby',
    }

    res = await request(app)
      .put(`/api/v1/authors/${authorId}`)
      .send(update)

    expect(res.status).toEqual(200)
    expect(res.body.firstName).toEqual('Bobby')
  })

  it('should delete an existing author', async () => {
    let res = await createAuthor()
    expect(res.status).toBe(200)
    const authorId = res.body._id

    res = await request(app).delete(`/api/v1/authors/${authorId}`)

    expect(res.status).toEqual(204)

    res = await request(app).get(`/api/v1/authors/${authorId}`)
    expect(res.status).toBe(404)
  })
})
