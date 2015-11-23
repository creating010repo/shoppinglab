Template.tagAdministration.helpers({
    allTags: function () {
      return Tags.find({});
    }
});

function tagCheck(imgEntryTags, tagToCheckId){
  // console.log(this);
  if (!imgEntryTags) return false;
  for (var i = 0; i < imgEntryTags.length; i++) {
    //console.log("imgEntryTags[i]: ", imgEntryTags[i]);
    tmp = imgEntryTags[i]._str;
    //console.log("tmp:", tmp);
    if (tmp == tagToCheckId) {
      //console.log("true! (tag found)");
      return true;
    } 
  };
  return false;
};
// function tagCheck(imageEntryTags){
//   parent_data = Template.parentData(1);
//   console.log("number of tags: ", parent_data.tags.length-1);
//   // console.log("imageEntryTags._id._str: ", imageEntryTags._id._str);
//   for (var i = 0; i < parent_data.tags.length; i++) {
//     tmp = imageEntryTags[i]._id._str;
//     console.log("tmp: ", tmp);
//     if(tmp) {
//       return true;
//       console.log("true! (tag found)");
//     } else {
//       return false;
//       console.log("false! (tag found)");
//     }
//   };
// };

Template.taggingAreaDashboard.helpers({
  allTags: function() {
    if (this.tags){
      var imageTags = this.tags;
      // console.log("imageTags", imageTags);

      var imageTagList = Tags.find(
          {_id : { $in: this.tags}}
        ).map( function(u) { return u.tagName; } );
      // console.log("imageTagList ", imageTagList);
      return imageTagList;
    }
  },

});

Template.taggingArea.helpers({
  allTags: function() {
    return Tags.find({});
  },
  isTagged: function(){
    var parent_data = Template.parentData(1);
    // console.log("parent data", parent_data.tags);
    if (parent_data.tags) {
      // console.log("parent_data._id: ", parent_data._id);
      var isTaggedFlag = tagCheck(parent_data.tags, this._id);
      if(isTaggedFlag){
        return "btn-success";
      };
    }
  },
  isDisabled: function(){
    var parent_data = Template.parentData(1);
    if (tagCheck(parent_data.tags, this._id) == true){
      return "";
    } 
    if (!parent_data.tags) return "";
    if (parent_data.tags.length > 2){
      return "disabled";
    }
    return "";
  }

});

Template.taggingArea.events({
  "click .tagButton": function(e){
    var parent_data = Template.parentData(0);
    // console.log("button clicked: ", this.tagName, " imageId:", parent_data._id);
    Meteor.call('addTag', this._id, parent_data._id);
  }
})
