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

    describe(`GET /restaurants`, () => {    
        context(`Given no restaurants`, () => {
            it(`responds with 200 and empty list`, () => {
                return supertest(app)
                    .get('/restaurants')
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

            it('GET /restaurants responds with 200 and all of the restaurants', () => {
                return supertest(app)
                    .get('/restaurants')
                    .expect(200, testRestaurants)
            })
        })
    })

    describe(`GET /restaurants/:id`, () => {
        context(`Given no restaurants`, () => {
            it(`responds with 404`, () => {
                const placeId = 123456
                return supertest(app)
                    .get(`/restaurants/${placeId}`)
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
                    .get(`/restaurants/${placeId}`)
                    .expect(200, expectedPlace)
            })
        })
    })

    describe(`POST /restaurants`, () => {
        it(`adds to favorites, responding with 201 created`, function() {
            const favorited = {
                title: 'Little Greek',
                category: 'Greek',
                price: '$$'
            }
            return supertest(app)
                .post('/restaurants')
                .send(favorited)
                .expect(201)
                .expect(res => {
                    console.log(res.body);
                   expect(res.body.title).to.eql(favorited.title)
                   expect(res.body.category).to.eql(favorited.category)
                   expect(res.body.price).to.eql(favorited.price)
                   expect(res.body).to.have.property('id')
                   expect(res.headers.location).to.eql(`/restaurants/${res.body.id}`)
                })
                .then(postRes => 
                    supertest(app)
                        .get(`/restaurants/${postRes.body.id}`)
                        .expect(postRes.body)
                    )
        })
    })

    describe(`DELETE /restaurants/:id`, () => {
        context(`Given no fave restaurants`, () => {
            it(`responds with 404`, () => {
                const placeId = 123456
                return supertest(app)
                    .delete(`/restaurants/${placeId}`)
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

            it('responds with 204 and removes the restaurant from favorites', () => {
                const deleteId = 2
                const expectedRestaurants = testRestaurants.filter(restaurant => restaurant.id !== deleteId)
                return supertest(app)
                    .delete(`/restaurants/${deleteId}`)
                    .expect(204)
                    .then(res => 
                        supertest(app)
                        .get(`/restaurants`)
                        .expect(expectedRestaurants)
                )
            })
        })
    })
})