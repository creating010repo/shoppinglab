ImageEntries = new Mongo.Collection("imageEntries");
Tags = new Mongo.Collection("tags");


if (Meteor.isClient) {
  Meteor.startup(function() {
    GoogleMaps.load({
      key: 'AIzaSyCkz7mV7KthVjQ_WU3GnyXPStgEgeNaK2s',
      libraries: 'places'  // also accepts an array if you need more than one
    });
  });

  $.cloudinary.config({
    cloud_name: "trendwatching"
  });

  Template.geocompleteExample.rendered = function () {
    this.autorun(function () {
      // Wait for API to be loaded
      if (GoogleMaps.loaded()) {
        $('#place').geocomplete({
          details: "form"
        });
      }
    });
  }

  Template.imageDisplay.helpers({
    tagNames: function(tagIdArray) {
      tagNames = []
      if (tagIdArray) {
        for (var i = tagIdArray.length - 1; i >= 0; i--) {
          currTagId = tagIdArray[i];
          currTagName = Tags.findOne(currTagId);
          if (currTagName) {
            tagNames.push(currTagName.name);
          };
        };
      };
      return tagNames;
    },
    imageLocation: function () {
      return ImageEntries.location.find();
    }
  });

  Template.imageListing.helpers({
    imageEntries: function () {
      return ImageEntries.find();
    }
  });

  Template.imageUpload.helpers({
    imageId: function () {
      return Session.get('imageId');
    }
  });
  Template.imageUpload.events({
    "click button[id='uploadSubmit']": function(e) {
      var files;
      files = $('#uploadFile')[0].files;
      return Cloudinary.upload(files, {
        folder: "secret",
        exif: "TRUE"
      }, function(err, res) {
        console.log("Upload Error: " + err);
        console.log(res);
        Session.set('imageId', res.public_id);    

        // imgTagIds = [];

        // tagName = $('#tag1')[0].value;
        // var tagExists = Tags.find({name:tagName}).fetch();
        // if (tagExists.length > 0 ) {
        //   imgTagIds.push(tagExists[0]._id);
        // }
        // else {
        //   newTagId = (new Meteor.Collection.ObjectID())._str;
        //   imgTagIds.push(newTagId);
        //   Tags.insert({
        //     _id: newTagId,
        //     name: tagName
        //   }); 
        // }
        // tagName = $('#tag2')[0].value;
        // var tagExists = Tags.find({name:tagName}).fetch();
        // if (tagExists.length > 0 ) {
        //   imgTagIds.push(tagExists[0]._id);
        // }
        // else {
        //   newTagId = (new Meteor.Collection.ObjectID())._str;
        //   imgTagIds.push(newTagId);
        //   Tags.insert({
        //     _id: newTagId,
        //     name: tagName
        //   }); 
        // }
        // tagName = $('#tag3')[0].value;
        // var tagExists = Tags.find({name:tagName}).fetch();
        // if (tagExists.length > 0 ) {
        //   imgTagIds.push(tagExists[0]._id);
        // }
        // else {
        //   newTagId = (new Meteor.Collection.ObjectID())._str;
        //   imgTagIds.push(newTagId);
        //   Tags.insert({
        //     _id: newTagId,
        //     name: tagName
        //   }); 
        // }
       
        ImageEntries.insert({
          public_id: res.public_id,
          sourceURL: $('#sourceURL')[0].value,
          location: $('#location')[0].innerHTML
          // tags: imgTagIds
        })

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
