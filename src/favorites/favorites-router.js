const express = require('express')
const FavoritesService = require('./favorites-service')
const { requireAuth } = require('../middleware/jwt-auth')

const FavoritesRouter = express.Router()
const jsonParser = express.json()

FavoritesRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        console.log(req.user);
        // once requireAuth is fleshed out, then req.user will be the user object of who is logged in
        // then instead of saying 1, you can say req.user.id
        FavoritesService.getAllFavorites(
            req.app.get('db'),
            req.user.id         
        )
            .then(favorites => {
                res.json(favorites)
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
    
        FavoritesService.insertFave(
            req.app.get('db'),
            req.body
        )
        .then(favorite => {
            res
                .status(201)
                .location(`/favorites/${favorite.id}`)
                .json(favorite)
        })
        .catch(next)
    })

FavoritesRouter
    .route('/:id')
    .all(requireAuth)
    .all((req, res, next) => {
        FavoritesService.getFaveId(
            req.app.get('db'),
            req.params.id
        )
            .then(favorite => {
                if (!favorite) {
                    return res.status(404).json({
                        error: { message: `Favorite not found` }
                    })
                }
                res.favorite = favorite
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(res.favorite)
    })
    .delete((req, res, next) => {
       FavoritesService.deleteFave(
           req.app.get('db'),
           req.params.id
       )
        .then(() => {
            res.status(204).end()
        })
        .catch(next)
    })

module.exports = FavoritesRouter