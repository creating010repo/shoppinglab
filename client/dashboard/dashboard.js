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


Template.allImageListing.helpers({
  allImageEntries: function () {
    var user = Meteor.users.findOne(Meteor.userId());
      //console.log(user);
      if (typeof(user) != "undefined" && (user.username == "peter" || user.username == "justien Marseille")){

        return ImageEntries.find();
      }
  }
});