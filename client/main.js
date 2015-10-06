
Meteor.startup(function() {
  GoogleMaps.load({
    key: Meteor.settings.public.googleMapsApiKey,
    libraries: 'places'  // also accepts an array if you need more than one
  });
});

Meteor.subscribe("imageEntries");
Meteor.subscribe("allImageEntriesDB");
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

Template.mapView.helpers({
  shoppingLabMapOptions: function() {
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
      // Map initialization options
      return {
        center: new google.maps.LatLng(51.917937,4.487838),
        zoom: 8
      };
    }
  }
});

Template.mapView.onCreated(function() {
  // We can use the `ready` callback to interact with the map API once the map is ready.
  GoogleMaps.ready('shoppingLabMarkers', function(map) {

    // console.log("google maps ready");
    // console.log(ImageEntries.find().count());
    ImageEntries.find().forEach(
      function (thisDoc){
        console.log("in forEach: "+thisDoc._id);
        if (thisDoc.gps){
          var thisGps = thisDoc.gps.split(',');
          var latlon = new google.maps.LatLng(thisGps[0],thisGps[1]);
          // console.log(thisGps[0] + " , " + thisGps[1]);
          var marker = new google.maps.Marker({
            position: latlon,
            map: map.instance,
            id: thisDoc._id
          });
        } 
        // else {
        //   console.log("GPS error " + thisDoc._id);
        // }
      }
    );
  });
});

Template.allUserListing.helpers({
  allUsers: function(){
    if (Meteor.userId()) {
      var user = Meteor.users.findOne(Meteor.userId());
      //console.log(user);
      if (typeof(user) != "undefined" && (user.username == "peter" || user.username == "justien Marseille")){
        return Meteor.users.find({});
      }
    }
    return null;
    
  }
  ,
  userImageCount: function(userId) {
    //console.log("imagecount userid "+userId);
    return ImageEntries.find({owner : userId}).count()
  },
  sumImageCount: function() {
    return ImageEntries.find({}).count()
  }
});
Template.imageDisplay.events({
    "click a[name='delete']":function(e){
    var confirmed = confirm('sure you want to delete the pic?');
    if (confirmed){
      // Some magic in the cloudinary
      // var cloudinaryFolder;
      // var removedCloudinaryFolder;
      // if (Meteor.absoluteUrl() == "http://shoppinglab.meteor.com/") {
      //   cloudinaryFolder = "shoppinglab-production";
      //   removedCloudinaryFolder = "shoppinglab-deleted"
      // } else {
      //   cloudinaryFolder = "testing";
      //   removedCloudinaryFolder = "testing-deleted"
      // };
      // console.log(this.public_id);

      // var imgPublicId = this.public_id.split('/')[1];
      // Cloudinary.v2.delete(this.public_id,function(error, result){
      //   //callback function
      //   console.log(result);
      // });
      Meteor.call("removeImageEntry", this._id, this.public_id);
    }
    
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
    var user = Meteor.users.findOne(Meteor.userId());
      //console.log(user);
      if (typeof(user) != "undefined" && (user.username == "peter" || user.username == "justien Marseille")){

        return ImageEntries.find();
      }
  }
});

Template.imageCounter.helpers({
  imageCount: function() {
    return ImageEntries.find({owner : Meteor.userId()}).count()
  },
  imageCountSum: function() {
    return ImageEntries.find({}).count()
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