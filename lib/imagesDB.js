ImageEntries = new Mongo.Collection("imageEntries");

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
  },
  removeImageEntry: function(id, public_id){
    //here is the code
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    console.log("Removing image entry id="+id+", public_id="+public_id);
    ImageEntries.remove(id);
  }

})
