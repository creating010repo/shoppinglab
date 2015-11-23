// ### WORKING VALIDATION FOR PETER AND JUSTIEN ACCOUNTS
// Template.allUserListing.helpers({
//   allUsers: function(){
//     if (Meteor.userId()) {
//       var user = Meteor.users.findOne(Meteor.userId());
//       //console.log(user);
//       if (typeof(user) != "undefined" && (user.username == "peter" || user.username == "justien Marseille")){
//         return Meteor.users.find({});
//       }
//     }
//     return null;
//   }

Template.allUserListing.helpers({
  allUsers: function(){
    if (Meteor.userId()) {
      //console.log(user);
      return Meteor.users.find({});
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


Session.set("tagFilterArray", []);
// tagFilterArrayDep = new Tracker.Dependency;



var setTagFilters = function (tag) {
  var tagFilterArray = Session.get("tagFilterArray");
  var newTagFilterArray = [];
  var alreadyIncluded = false;
  for (var i = 0; i < tagFilterArray.length; i++) {
    var currItem = tagFilterArray[i];
    // Is not the current item
    if(currItem._str != tag._str){
      newTagFilterArray.push(currItem);
    }
    else {
      alreadyIncluded = true;
    }
  };
  //Current item that was clicked only added if was not there before
  // console.log(tagFilterArray, tag);
  if(tagFilterArray.length == 0 || !alreadyIncluded){
    newTagFilterArray.push(tag);
  }

  Session.set("tagFilterArray", newTagFilterArray);
  //console.log("tagFilterArray: ", newTagFilterArray);
  // tagFilterArrayDep.changed();
};

Template.tagFiltering.tagFilters = function () {
  // console.log("getTagFilters");
  // tagFilterArrayDep.depend();
  return Session.get("tagFilterArray");
};
Template.tagFiltering.helpers({
  allTags: function(){
    return Tags.find();
  },
  isTagged: function(){
    var tagFilterArray = Session.get("tagFilterArray");

    for (var i = 0; i < tagFilterArray.length; i++) {
      var currTag = tagFilterArray[i];
      // console.log("isTagged", currTag, this._id);
      if (currTag._str == this._id._str) {
        return "btn-success";
      }
    };      
    return "";
  }
})

Template.tagFiltering.events({
  "click .tagFilterButton": function(e){
    // console.log("add tag to selected",this._id);
    setTagFilters(this._id);
  }
});

Template.allImageListing.helpers({
  allImageEntries: function () {
    // console.log(user);
    return ImageEntries.find();
  }, 
  filteredListImages: function () {
    var tagFilterArray = Session.get("tagFilterArray");
    // console.log("IMAGESLIST search by tag ", tagFilterArray);
    if(tagFilterArray.length == 0){
      return ImageEntries.find();
    }
    else{
      return ImageEntries.find({
        tags: {$in: tagFilterArray}
      });      
    }

    //.map( function(u) { console.log(u); return u.sourceURL; } );
  }
});

// ### WORKING VALIDATION FOR PETER AND JUSTIEN ACCOUNTS
// Template.allImageListing.helpers({
//   allImageEntries: function () {
//     var user = Meteor.users.findOne(Meteor.userId());
//       //console.log(user);
//       if (typeof(user) != "undefined" && (user.username == "peter" || user.username == "justien Marseille")){

//         return ImageEntries.find();
//       }
//   }
// });