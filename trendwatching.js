if (Meteor.isClient) {
  $.cloudinary.config({
    cloud_name: "trendwatching"
  });
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });

  Template.imageUpload.helpers({
    imageId: function () {
      return Session.get('imageId');
    }
  });
  Template.imageUpload.events({
    "change input[type='file']": function(e) {
      var files;
      files = e.currentTarget.files;
      return Cloudinary.upload(files, {
        folder: "secret"
      }, function(err, res) {
        console.log("Upload Error: " + err);
        console.log(res);
        Session.set('imageId', res.public_id);
      });
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
