
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {username: 'admin',  password: '$2a$08$CjOzAqkUXePlNyZCG6TKuubIY.MpjKqOdrV/W3178ah483kyEbeSe'}, // plain text password is 1234
        {username: 'Billy', password: "$2a$08$o/lAiBM6kV2AMNhaw3ibGeZgD31V6217taKw/vNcOSB8iYpe70eTq"}, //1234
        {username: 'Sarah', password: "$2a$08$Ddl9lIpQNG6s0kRY614ba.M9ZdrC0bxpa8Jk19shvwqAD3avgH8zC"}  //1234      
      ]);
    });
};
