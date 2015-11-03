var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
// Link


var User = db.Model.extend({
	tableName: 'users',
	hasTimestamps: true,

	// links: function() {
	// return this.hasMany(Link)
	// }

	initialize: function() {
		// bcrypt password

		this.on('creating', function(model, attrs, options) {
			console.log(model);
			// var shasum = bcrypt.createHash('sha1');
			// shasum.update(model.get('url'));
			// model.set('password', model.password);
		});
	},

	comparePassword: function(password, cb) {
		bcrypt.compare(password, this.get('password'), function(err, res) {
			if (err) {
				console.log("User's password didn't work!")
				throw err;
			}
			cb(res);
		});
	}

});

module.exports = User;
