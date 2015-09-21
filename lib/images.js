ImageEntries = new Mongo.Collection("imageEntries");
Tags = new Mongo.Collection("tags");

Meteor.methods({
  addImageEntry: function(public_id, sourceURL,formatted_address, gps,comment){
    //here is the code
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    ImageEntries.insert({
      public_id: public_id,
      owner: this.userId,           // _id of logged in user
      username: Meteor.user().username,  // username of logged in user
      sourceURL: sourceURL,
      formatted_address: formatted_address,
      gps: gps,
      comment: comment
      // tags: imgTagIds
    })
  }
})


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
