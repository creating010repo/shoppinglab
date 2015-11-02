Tags = new Mongo.Collection("tags");


Meteor.methods({
  // needs the image and the tag to be added
  addTag: function (tagId, imageEntryId) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    else {
      // Find the corresponding document, put into currentEntry variable
      currentEntry = ImageEntries.findOne({_id : imageEntryId});
      // console.log(currentEntry);

      // Read the 'tags' field of document, put into imageTagIds
      imageTagIds = currentEntry.tags;

      // If undefined imageTagIds, create empty array
      if (!imageTagIds){
        imageTagIds = [];
      };
      // console.log(imageTagIds);
      
      // New array to collect tagIds
      newImageTagIDs = [];
      // Flag if the tag was already in database
      wasInDatabase = false;
      // Going through the existing tags
      for (var i = imageTagIds.length - 1; i >= 0; i--) {
        // console.log(tagId, imageTagIds[i]);
        // Comparing to-be-added tags with tags
        if (tagId._str != imageTagIds[i]._str) {
          // Push when the tag is not already added
          newImageTagIDs.push(imageTagIds[i]);
          // console.log("keeping tag", newImageTagIDs);
        } else {
          wasInDatabase = true;
        }
      };
      if (!wasInDatabase) {
        newImageTagIDs.push(tagId);
      }

      // Update database document with imageTagIds
      ImageEntries.update(
        {'_id' : imageEntryId},
        { $set: {'tags' : newImageTagIDs} }
      )
      console.log("updating tags: ", newImageTagIDs);
    };              
  }
})


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
