import request from 'supertest'
import { Request, Response, NextFunction } from 'express'

import { UserDocument } from '../../src/models/User'
import app from '../../src/app'
import * as dbHelper from '../db-helper'

const nonExistingAuthorId = '5e57b77b5744fa0b461c7906'

jest.mock(
  '../../src/middlewares/authJWT',
  () => (req: Request, res: Response, next: NextFunction) => next()
)

async function createUser(override?: Partial<UserDocument>) {
  let user = {
    firstName: 'Frank',
    lastName: 'McCourt',
  }

  if (override) {
    user = { ...user, ...override }
  }

  return await request(app)
    .post('/api/v1/users')
    .send(user)
}

describe('user controller', () => {
  beforeEach(async () => {
    await dbHelper.connect()
  })

  afterEach(async () => {
    await dbHelper.clearDatabase()
  })

  afterAll(async () => {
    await dbHelper.closeDatabase()
  })

  it('should create an user', async () => {
    const res = await createUser()
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('_id')
    expect(res.body.firstName).toBe('Frank')
    expect(res.body.lastName).toBe('McCourt')
  })

  it('should not create an user with wrong data', async () => {
    const res = await request(app)
      .post('/api/v1/users')
      .send({
        firstName: 'Frank',
        favoriteFood: 2019,
      })
    expect(res.status).toBe(400)
  })

  it('should get back an existing user', async () => {
    let res = await createUser()
    expect(res.status).toBe(200)
    const authorId = res.body._id
    res = await request(app).get(`/api/v1/users/${authorId}`)
    expect(res.body._id).toEqual(authorId)
  })

  it('should not get back a non-existing user', async () => {
    const res = await request(app).get(`/api/v1/users/${nonExistingAuthorId}`)
    expect(res.status).toBe(404)
  })

  it('should get back all users', async () => {
    await createUser({
      firstName: 'John',
      lastName: 'Updike',
    })
    await createUser({
      firstName: 'Tom',
      lastName: 'Clancy',
    })
    const res3 = await request(app).get('/api/v1/users')
    expect(res3.body.length).toEqual(2)
  })

  it('should update an existing user', async () => {
    let res = await createUser()
    expect(res.status).toBe(200)

    const authorId = res.body._id
    const update = {
      firstName: 'Bobby',
    }

    res = await request(app)
      .put(`/api/v1/users/${authorId}`)
      .send(update)

    expect(res.status).toEqual(200)
    expect(res.body.firstName).toEqual('Bobby')
  })

  it('should delete an existing user', async () => {
    let res = await createUser()
    expect(res.status).toBe(200)
    const authorId = res.body._id

    res = await request(app).delete(`/api/v1/users/${authorId}`)

    expect(res.status).toEqual(204)

    res = await request(app).get(`/api/v1/users/${authorId}`)
    expect(res.status).toBe(404)
  })
})
