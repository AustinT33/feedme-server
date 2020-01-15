const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makePlacesArray } = require('./restaurants.fixtures')

describe('Places Endpoints', function() {
    let db 

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())
    
    before('clean the table', () => db('restaurant_list').truncate())
    
    afterEach('cleanup', () => db('restaurant_list').truncate())

    describe(`GET /api/restaurants`, () => {    
        context(`Given no restaurants`, () => {
            it(`responds with 200 and empty list`, () => {
                return supertest(app)
                    .get('/api/restaurants')
                    .expect(200, [])
            })
        })

        context('Given there are restaurants in the database', () => {
            const testRestaurants = makePlacesArray()

            beforeEach('insert Restaurant', () => {
                return db 
                    .into('restaurant_list')
                    .insert(testRestaurants)
            })

            it('GET /api/restaurants responds with 200 and all of the restaurants', () => {
                return supertest(app)
                    .get('/api/restaurants')
                    .expect(200, testRestaurants)
            })
        })
    })

    describe(`GET /api/restaurants/:id`, () => {
        context(`Given no restaurants`, () => {
            it(`responds with 404`, () => {
                const placeId = 123456
                return supertest(app)
                    .get(`/api/restaurants/${placeId}`)
                    .expect(404, { error: { message: `Restaurant not found` } })
            })
        })
        context('Given there are restaurants in the database', () => {
            const testRestaurants = makePlacesArray()
            
            beforeEach('insert restaurants', () => {
                return db
                    .into('restaurant_list')
                    .insert(testRestaurants)
            })
    
            it('responds with 200 and the specified place', () => {
                const placeId = 2
                const expectedPlace = testRestaurants[placeId -1]
                return supertest(app)
                    .get(`/api/restaurants/${placeId}`)
                    .expect(200, expectedPlace)
            })
        })
    })
})