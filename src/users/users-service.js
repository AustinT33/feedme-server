const UsersService = {
    getAllUsers(knex) {
      return knex.select('*').from('feedme_users')
    },
  
    insertUser(knex, newUser) {
      return knex
        .insert(newUser)
        .into('feedme_users')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
  
    getById(knex, id) {
      return knex
        .from('feedme_users')
        .select('*')
        .where('id', id)
        .first()
    },
  
    deleteUser(knex, id) {
      return knex('feedme_users')
        .where({ id })
        .delete()
    },
  
    updateUser(knex, id, newUserFields) {
      return knex('feedme_users')
        .where({ id })
        .update(newUserFields)
    },
  }
  
  module.exports = UsersService