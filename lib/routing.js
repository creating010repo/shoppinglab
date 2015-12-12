// Router.configure({
//   // layoutTemplate: "MasterLayout",
//   // loadingTemplate: "Loading",
//   notFoundTemplate: "Maintenance"
// });

// Router.route('/maintenance', function () {
//   this.render('Maintenance');
// });

Router.route('/', function () {
  this.render('userUploads');
});

Router.route('/users', function() {
  this.render('userPage')
});

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

Router.route('/tags', function () {
  this.render('tagAdministration');
});