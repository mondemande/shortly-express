Shortly.createLogInView = Backbone.View.extend({
	className: 'logIn',

	template: Templates['login'],

	events: {
		'submit': 'logIn'
	},

	render: function() {
	  this.$el.html( this.template() );
	  return this;
	},

	logIn: function() {
		e.preventDefault();
		// gets .text() -> username
		// gets .text() -> password
		var $username = this.$el.find('form#username').val();
		var $password = this.$el.find('form#password').val();
		console.log('username', 'password')

		// var link = new Shortly.Link({ url: $form.val() })
		// var user = 
		// link.on('request', this.startSpinner, this);
		// link.on('sync', this.success, this);
		// link.on('error', this.failure, this);
		// link.save({});
		// $form.val('');
		// interact with User DB?
	},

	success: function() {},

	failure: function() {},

	startSpinner: function() {
	  this.$el.find('img').show();
	  this.$el.find('form input[type=submit]').attr('disabled', 'true');
	  this.$el.find('.message')
	    .html('')
	    .removeClass('error');
	},

	stopSpinner: function() {
	  this.$el.find('img').fadeOut('fast');
	  this.$el.find('form input[type=submit]').attr('disabled', null);
	  this.$el.find('.message')
	    .html('')
	    .removeClass('error');
	}

});
