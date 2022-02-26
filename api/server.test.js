// Write your tests here
const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')

test('sanity', () => {
  expect(true).toBe(true)
})

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
beforeEach(async () => {
  await db.seed.run()
})
afterAll(async () => {
  await db.destroy()
})

// describe('[1] GET /api/jokes', () => {
//   test('returns a status 200 OK', async ()=>{
//       const res = await request(server).get('/api/jokes')
//       expect(res.status).toBe(200)
//   })
// })


describe('[1] POST /api/auth/register', () => {
    test('returns a status 201 Created', async () => {
      const res = await request(server)
        .post('/api/auth/register')
        .send({ username: 'bilbo', password: "1234"})
      expect(res.status).toBe(201)
    })
    test('[POST] responds with newly posted user on successful register', async () => {
      const resp = await request(server).post('/api/auth/register')
      .send({username: "Timmy", password: "1234"});
      expect(resp.body).toMatchObject({ "username": "Timmy"});
    })
    it('[POST] On FAILED registration due to `username` or `password` missing from the request body', async () => {
      const res = await request(server).post('/api/auth/register').send({ username: 'devon'})
      expect(res.body.message).toMatch(/username and password required/i)
      expect(res.status).toBe(404)
    }, 750)
    it('[POST] On FAILED registration due to the `username` being taken', async () => {
      const res = await request(server).post('/api/auth/register').send({ username: 'admin', password: '1234'})
      expect(res.body.message).toMatch(/username taken/i)
      expect(res.status).toBe(404)
    }, 750)
})

describe('/login', () => {
  test('[POST] responds with a 200 status on successful login', async () => {
    const resp = await request(server).post('/api/auth/login')
    .send({ username: "Billy", password: "1234" });
    expect(resp.status).toEqual(200);
  })
  test('[POST] responds with a 404 status with incorrect password', async () => {
    const resp = await request(server).post('/api/auth/login')
    .send({ username: "Billy", password: "1234444" });
    expect(resp.status).toEqual(404);
  })
})



  describe('[GET] request to users', () => {
 
    test('[GET] responds with all jokes on successful request', async () => {
      let res = await request(server).post('/api/auth/login').send({username: "Billy", password: "1234"});
      res = await request(server).get('/api/jokes').set('Authorization', res.body.token);
      expect(res.body).toHaveLength(3);
    })
  })


  