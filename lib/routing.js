Router.route('/', function () {
  this.render('userLoggedIn');
});

Router.route('/dashboard', function () {
  this.render('overviewDashboard');
});