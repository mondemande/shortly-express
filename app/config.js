var path = require('path');

var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    host: '127.0.0.1',
    user: 'your_database_user',
    password: 'password',
    database: 'shortlydb',
    charset: 'utf8',
    filename: path.join(__dirname, '../db/shortly.sqlite')
  }
});

var bookshelf = require('bookshelf')(knex);

// db.knex.schema.dropTable('urls');
// db.knex.schema.dropTable('clicks');
// db.knex.schema.dropTable('users');

knex.schema.hasTable('urls').then(function(exists) {
  if (!exists) {
    knex.schema.createTable('urls', function (link) {
      link.increments('id').primary();
      link.string('url', 255);
      link.string('base_url', 255);
      link.string('code', 100);
      link.string('title', 255);
      link.integer('user_id');
      link.integer('visits');
      link.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

knex.schema.hasTable('clicks').then(function(exists) {
  if (!exists) {
    knex.schema.createTable('clicks', function (click) {
      click.increments('id').primary();
      click.integer('link_id');
      click.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});


/************************************************************/
// Add additional schema definitions below
/************************************************************/


knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    knex.schema.createTable('users', function (click) {
      click.increments('id').primary();
      click.string('username');
      click.string('password')
      click.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

module.exports = require('bookshelf')(knex);
