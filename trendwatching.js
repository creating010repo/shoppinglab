ImageEntries = new Mongo.Collection("imageEntries");
Tags = new Mongo.Collection("tags");


if (Meteor.isClient) {
  Meteor.startup(function() {
    GoogleMaps.load({
      key: 'AIzaSyCkz7mV7KthVjQ_WU3GnyXPStgEgeNaK2s',
      libraries: 'places'  // also accepts an array if you need more than one
    });
  });

  Meteor.subscribe("imageEntries");

  $.cloudinary.config({
    cloud_name: "trendwatching"
  });

  Template.geocomplete.rendered = function () {
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
    // tagNames: function(tagIdArray) {
    //   tagNames = []
    //   if (tagIdArray) {
    //     for (var i = tagIdArray.length - 1; i >= 0; i--) {
    //       currTagId = tagIdArray[i];
    //       currTagName = Tags.findOne(currTagId);
    //       if (currTagName) {
    //         tagNames.push(currTagName.name);
    //       };
    //     };
    //   };
    //   return tagNames;
    // }
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
      console.log('button pushed!');
      if (($('#formatted_address')[0].innerHTML)) {
        console.log('upload happening');
      var files;
      files = $('#uploadFile')[0].files;
      return Cloudinary.upload(files, {
        folder: "staging",
        exif: "TRUE"
      }, function(err, res) {
        console.log("Upload Error: " + err);
        console.log(res);
        Session.set('imageId', res.public_id);    
            
          ImageEntries.insert({
            public_id: res.public_id,
            owner: Meteor.userId(),           // _id of logged in user
            username: Meteor.user().username,  // username of logged in user
            sourceURL: $('#sourceURL')[0].value,
            formatted_address: $('#formatted_address')[0].innerHTML,
            gps: $('#gps')[0].innerHTML,
            comment: $('#imageComment')[0].value
            // tags: imgTagIds
          })

        });
      };

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
  Meteor.publish("imageEntries", function(){
    var currentUserId = this.userId;
    // console.log(currentUserId);
    return ImageEntries.find({
      owner : currentUserId
    });
  });  
}


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
