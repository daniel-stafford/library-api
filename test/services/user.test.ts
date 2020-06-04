import User from '../../src/models/User'
import UserService from '../../src/services/user'
import * as dbHelper from '../db-helper'

const nonExistingAuthorId = '5e57b77b5744fa0b461c7906'

async function createUser() {
  const user = new User({
    firstName: 'Mikko',
    lastName: 'Mikkonen',
  })
  return await UserService.create(user)
}

describe('user service', () => {
  beforeEach(async () => {
    await dbHelper.connect()
  })

  afterEach(async () => {
    await dbHelper.clearDatabase()
  })

  afterAll(async () => {
    await dbHelper.closeDatabase()
  })

  it('should create a user', async () => {
    const user = await createUser()
    expect(user).toHaveProperty('_id') <
      expect(user).toHaveProperty('firstName', 'Mikko')
    expect(user).toHaveProperty('lastName', 'Mikkonen')
  })

  it('should get a user with id', async () => {
    const user = await createUser()
    const found = await UserService.findById(user._id)
    expect(found.firstName).toEqual(user.firstName)
    expect(found._id).toEqual(user._id)
  })

  // Check https://jestjs.io/docs/en/asynchronous for more info about
  // how to test async code, especially with error
  it('should not get a non-existing user', async () => {
    expect.assertions(1)
    return UserService.findById(nonExistingAuthorId).catch(e => {
      expect(e.message).toMatch(`User ${nonExistingAuthorId} not found`)
    })
  })

  it('should update an existing user', async () => {
    const user = await createUser()
    const update = {
      lastName: 'Smith',
    }
    const updated = await UserService.update(user._id, update)
    expect(updated).toHaveProperty('_id', user._id)
    expect(updated).toHaveProperty('lastName', 'Smith')
  })

  it('should not update a non-existing user', async () => {
    expect.assertions(1)
    const update = {
      firstName: 'Eric',
      LastName: 'McGee',
    }
    return UserService.update(nonExistingAuthorId, update).catch(e => {
      expect(e.message).toMatch(`User ${nonExistingAuthorId} not found`)
    })
  })

  it('should delete an existing user', async () => {
    expect.assertions(1)
    const user = await createUser()
    await UserService.deleteUser(user._id)
    return UserService.findById(user._id).catch(e => {
      expect(e.message).toBe(`User ${user._id} not found`)
    })
  })
})
