const RestaurantsService = {
    getAllRestaurants(knex) {
        return knex.select('*').from('restaurant_list')
    },
    getById(knex, id) {
        return knex.from('restaurant_list').select('*').where('id', id).first()
    },
}

module.exports = RestaurantsService