const RestaurantsService = require('../src/restaurants/restaurants-service')
const knex = require('knex')
const { makePlacesArray } = require('./restaurants.fixtures')

describe(`Restaurants service object`, function () {
    let db 

    let testRestaurants = makePlacesArray()
    
    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    before(() => db('restaurant_list').truncate())

    afterEach(() => db('restaurant_list').truncate())

    after(() => db.destroy())


    context(`Given 'restaurant_list' has data`, () => {
        beforeEach(() => {
            return db
                .into('restaurant_list')
                .insert(testRestaurants)
        })
        it(`getAllRestaurants() resolves all restaurants from 'restaurant_list' table`, () => {
            return RestaurantsService.getAllRestaurants(db)
                .then(received => {
                    expect(received).to.eql(testRestaurants)
                })
        })

        it(`getById() resolves a restaurant by id from 'restaurant_list'`, () => {
            const thirdId = 3
            const thirdTestPlace = testRestaurants[thirdId -1]
            return RestaurantsService.getById(db,thirdId)
                .then(received => {
                    expect(received).to.eql({
                        id: thirdId,
                        title: thirdTestPlace.title,
                        category: thirdTestPlace.category,
                        price: thirdTestPlace.price,
                    })
                })
        })

        it(`deleteFave() removes a favorite by id from 'restaurant_list' table`, () => {
            const placeId = 3
            return RestaurantsService.deleteFave(db, placeId)
                .then(() => RestaurantsService.getAllRestaurants(db))
                .then(allPlaces => {
                    const expected = testRestaurants.filter(place => place.id !== placeId)
                    expect(allPlaces).to.eql(expected)
                })
        })
    })

    context(`Given 'restaurant_list' has no data`, () => {
        it(`getAllRestaurants() resolves an empty array`, () => {
            return RestaurantsService.getAllRestaurants(db)
                .then(received => {
                    expect(received).to.eql([])
                })
        })

        it(`insertFave() inserts a new restaurant and resolves the favorited place with an 'id'`, () => {
            const favorited = {
                title: 'Test',
                category: 'Mexican',
                price: '$$',
            }
            return RestaurantsService.insertFave(db, favorited)
                .then(received => {
                    expect(received).to.eql({
                        id: 1,
                        title: favorited.title,
                        category: favorited.category,
                        price: favorited.price,
                    })
                })
        })
    })
})