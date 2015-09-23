
Meteor.startup(function() {
  GoogleMaps.load({
    key: Meteor.settings.public.googleMapsApiKey,
    libraries: 'places'  // also accepts an array if you need more than one
  });
});

Meteor.subscribe("imageEntries");
Meteor.subscribe("allImageEntries");
Meteor.subscribe("allUsersDB");

$.cloudinary.config({
  cloud_name: Meteor.settings.public.cloudinaryCloud
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

Template.allUserListing.helpers({
  allUsers: function(){
    if (Meteor.userId()) {
      console.log('afds;dfjsdkjflksjdfn ');
      var user = Meteor.users.findOne(Meteor.userId());
      if (user.username == "peter" || user.username == "test123"){
        return Meteor.users.find({});
      }
    }
    return null;
    
  }
  ,
  imageCount: function() {
    return ImageEntries.find({owner : Meteor.userId()}).count()
  }
});

Template.imageDisplay.helpers({
//   tagNames: function(tagIdArray) {
//     tagNames = []
//     if (tagIdArray) {
//       for (var i = tagIdArray.length - 1; i >= 0; i--) {
//         currTagId = tagIdArray[i];
//         currTagName = Tags.findOne(currTagId);
//         if (currTagName) {
//           tagNames.push(currTagName.name);
//         };
//       };
//     };
//     return tagNames;
//   }
});

Template.imageListing.helpers({
  imageEntries: function () {
    return ImageEntries.find({
        owner : Meteor.userId()
      })
    }
});

Template.allImageListing.helpers({
  allImageEntries: function () {
    return ImageEntries.find();
  }
});

Template.imageCounter.helpers({
  imageCount: function() {
    return ImageEntries.find({owner : Meteor.userId()}).count()
  }
});

Template.imageUpload.helpers({
  imageId: function () {
    return Session.get('imageId');
  },
  waitingSpinner: function () {
    return Session.get('waitingSpinner');
  }
});


Template.imageUpload.events({
  "click button[id='uploadSubmit']": function(e) {
    // console.log('button pushed!');
    var urlValue = $('#sourceURL')[0] ? $('#sourceURL')[0].value : null;
    regexMatch = urlValue ? urlValue.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/)) : null;
    // console.log(regexMatch);
    if (urlValue && regexMatch==null){
      $('#urlTrouble').removeClass('hidden');
      $('#urlTrouble').addClass('show');
      return false;
    }
    if (($('#formatted_address')[0].innerHTML)) {
      // disable the button for the upload time
      $('#uploadSubmit').attr('disabled', true);
      Session.set('waitingSpinner', true);

      var cloudinaryFolder;
      if (Meteor.absoluteUrl() == "http://shoppinglab.meteor.com/") {
        cloudinaryFolder = "shoppinglab-production";
      } else {
        cloudinaryFolder = "testing";
      };

      var files;
      files = $('#uploadFile')[0].files;
      return Cloudinary.upload(files, {
        folder: cloudinaryFolder,
        exif: "TRUE"
      }, function(err, res) {
          console.log("Upload Error: " + err);
          // console.log(res);

          Session.set('imageId', res.public_id);

           

          // let's put the file into the database
          Meteor.call('addImageEntry', 
            res.public_id, 
            // $('#sourceURL')[0].value,
            urlValue,
            $('#formatted_address')[0].innerHTML,
            $('#gps')[0].innerHTML,
            $('#imageComment')[0].value); //end addImageEntry call
          $('#uploadFile')[0].value=''
          $('#sourceURL')[0].value=''
          $('#formatted_address')[0].innerHTML=''
          $('#place')[0].value=''
          $('#gps')[0].innerHTML=''
          $('#imageComment')[0].value=''

          // validation hack of URLs
          $('#urlTrouble').removeClass('show');
          $('#urlTrouble').addClass('hidden');

          // disable the spinner and enable the button again
          Session.set('waitingSpinner', false);
          $('#uploadSubmit').attr('disabled', false);
        });

    };

  }
});

Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});