const express = require('express')
const RestaurantsService = require('./restaurants-service')

const RestaurantsRouter = express.Router()
const jsonParser = express.json()

RestaurantsRouter
    .route('/')
    .get((req, res, next) => {
        RestaurantsService.getAllRestaurants(
            req.app.get('db')
        )
            .then(restaurants => {
                res.json(restaurants)
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
    
        RestaurantsService.insertFave(
            req.app.get('db'),
            req.body
        )
        .then(restaurant => {
            res
                .status(201)
                .location(`/restaurants/${restaurant.id}`)
                .json(restaurant)
        })
        .catch(next)
    })

RestaurantsRouter
    .route('/:id')
    .all((req, res, next) => {
        RestaurantsService.getById(
            req.app.get('db'),
            req.params.id
        )
            .then(restaurant => {
                if (!restaurant) {
                    return res.status(404).json({
                        error: { message: `Restaurant not found` }
                    })
                }
                res.restaurant = restaurant
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(res.restaurant)
    })
    .delete((req, res, next) => {
       RestaurantsService.deleteFave(
           req.app.get('db'),
           req.params.id
       )
        .then(() => {
            res.status(204).end()
        })
        .catch(next)
    })

module.exports = RestaurantsRouter