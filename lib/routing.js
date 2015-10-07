Router.route('/', function () {
  this.render('userLoggedIn');
});

// Router.route('/dashboard', function () {
//   this.render('overviewDashboard');
// });

Router.route('/dashboard', function () {
  // add the subscription handle to our waitlist
  this.wait(Meteor.subscribe('allImageEntriesDB', this.params._id));

  // this.ready() is true if all items in the wait list are ready

  if (this.ready()) {
    this.render('overviewDashboard');
  } else {
    this.render('Loading');
  }
});

Router.route('/map', function () {
  // add the subscription handle to our waitlist
  this.wait(Meteor.subscribe('allImageEntriesDB', this.params._id));

  // this.ready() is true if all items in the wait list are ready

  if (this.ready()) {
    this.render('mapPage');
  } else {
    this.render('Loading');
  }
});