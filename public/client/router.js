Shortly.Router = Backbone.Router.extend({
  initialize: function(options) {
    this.$el = options.el;
  },

  routes: {
    '': 'index',
    'create': 'create',
    'logIn': 'logIn',
    'signUp': 'signUp'
  },

  swapView: function(view) {
    this.$el.html(view.render().el);
  },

  index: function() {
    var links = new Shortly.Links();
    var linksView = new Shortly.LinksView({
      collection: links
    });
    this.swapView(linksView);
  },

  create: function() {
    this.swapView(new Shortly.createLinkView());
  },

  logIn: function() {
    this.swapView(new Shortly.createLogInView());
  },
  
  signUp: function() {
    this.swapView(new Shortly.createSignUpView());
  }

});
