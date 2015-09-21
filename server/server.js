Meteor.startup(function () {
    // code to run on server at startup
    Cloudinary.config({
      cloud_name: 'trendwatching',
    });
  });

  Meteor.publish("imageEntries", function(){
    var currentUserId = this.userId;
    // console.log(currentUserId);
    return ImageEntries.find({
      owner : currentUserId
    });
  });

  Meteor.publish("allImageEntries", function(){
    return ImageEntries.find({

    });
  });