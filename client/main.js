Meteor.startup(function() {
  GoogleMaps.load({
    key: Meteor.settings.public.googleMapsApiKey,
    libraries: ['places','visualization']  // also accepts an array if you need more than one
  });
});

Meteor.subscribe("imageEntries");
Meteor.subscribe("allImageEntriesDB");
Meteor.subscribe("allUsersDB");
Meteor.subscribe("allTags");

$.cloudinary.config({
  cloud_name: Meteor.settings.public.cloudinaryCloud
});

Template.imageCounter.helpers({
  imageCount: function() {
    return ImageEntries.find({owner : Meteor.userId()}).count()
  },
  imageCountSum: function() {
    return ImageEntries.find({}).count()
  }
});

Accounts.ui.config({
  passwordSignupFields: "USERNAME_AND_EMAIL"
});