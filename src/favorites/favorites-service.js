const FavoritesService = {
    getAllFavorites(knex, users) {
        return knex.select('favorites_list.id', 'restaurant_list.title')
            .from('favorites_list').join('restaurant_list', 'favorites_list.restaurant', 'restaurant_list.id')
            .where('users', users)
    },
    insertFave(knex, insertFave) {
        return knex 
            .insert(insertFave)
            .into('favorites_list')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getFaveId(knex, id) {
        return knex.from('favorites_list').select('*').where('id', id).first()
    },
    deleteFave(knex, id) {
        return knex('favorites_list')
            .where({ id })
            .delete()
    },
}

module.exports = FavoritesService