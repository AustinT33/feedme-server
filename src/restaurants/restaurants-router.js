const express = require('express')
const RestaurantsService = require('./restaurants-service')

const {YELP_API} = require('../config');

const request = require('request');


const RestaurantsRouter = express.Router()
const jsonParser = express.json()

RestaurantsRouter
    .route('/')
    .get((req, res, next) => {
        const {zip_code='90210'} = req.query
        const options = {
            'method': 'GET',
            'url': `https://api.yelp.com/v3/businesses/search?location=${zip_code}&limit=50`,
            'headers': {
              'Authorization': `Bearer ${YELP_API}`,
              'Content-Type':'application/json'
            }
          };
          request(options, function (error, response, body) { 
              
            if (error) next(error);
            res.json(JSON.parse(body).businesses);
          });
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