Meteor.startup(function () {
    // code to run on server at startup
    Cloudinary.config({
      cloud_name: Meteor.settings.public.cloudinaryCloud,
      api_key: Meteor.settings.cloudinaryAPIKey,
      api_secret: Meteor.settings.cloundinaryAPISecret
    });
  });

Meteor.publish("imageEntries", function(){
  if (this.userId) {
    var currentUserId = this.userId;
    // console.log(currentUserId);
    return ImageEntries.find({
      owner : currentUserId
    });
  } 
    return null;
});

Meteor.publish("allImageEntriesDB", function(){
  //returns undefined if not logged in so check if logged in first
  if(this.userId) {
    // console.log("allImageEntriesDB "+this.userId);
    //var user is the same info as would be given in Meteor.user();
    var user = Meteor.users.findOne(this.userId);
    if (user.username == "peter" || user.username == "justien Marseille"){
      return ImageEntries.find();
    }
  }
      return null;
});


Meteor.publish("allUsersDB", function(){
  //console.log('call allusersdb '+this.userId);
  if (this.userId) {
    var user = Meteor.users.findOne(this.userId);
    //console.log(user.username);

    if (user.username == "peter" || user.username == "justien Marseille"){
      return Meteor.users.find({});
    };
  }
  return null;
});

// Meteor.publish("collection", function() {
//     //returns undefined if not logged in so check if logged in first
//     if(this.userId) {
//         var user = Meteor.users.findOne(this.userId);
//         //var user is the same info as would be given in Meteor.user();
//     }
// });