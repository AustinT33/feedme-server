require('dotenv').config()
const knex = require('knex')
const RestaurantsService = require('./restaurants-service')

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL,
})

RestaurantsService.getAllRestaurants(knexInstance)
    .then(() => 
        RestaurantsService.insertFave(knexInstance, {
            title: 'New Title',
            category: 'New Type',
            price: '$$',
        })
    )
    .then(place => {
        return RestaurantsService.deleteFave(knexInstance, place.id)
    })
    