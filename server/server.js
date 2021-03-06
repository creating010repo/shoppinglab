Meteor.startup(function () {
    // code to run on server at startup
    process.env['MAIL_URL'] = "smtp://postmaster@sandboxac29acbbcfd44ca0ab0e21a9829c3c44.mailgun.org:7875165a4fe13f46ac69dd68850c7fd2@smtp.mailgun.org:587";
    process.env['MAILGUN_API_KEY'] = "MailgunAPIKey";  
    process.env['MAILGUN_DOMAIN'] = "sandboxac29acbbcfd44ca0ab0e21a9829c3c44.mailgun.org";  
    process.env['MAILGUN_API_URL'] = "https://api.mailgun.net/v3/sandboxac29acbbcfd44ca0ab0e21a9829c3c44.mailgun.org";
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

    //var user is the same info as would be given in Meteor.user();
    // var user = Meteor.users.findOne(this.userId);

    // console.log("allImageEntriesDB "+this.userId);
    return ImageEntries.find();
  }
      return null;
});

Meteor.publish("allUsersDB", function(){
  //console.log('call allusersdb '+this.userId);
  if (this.userId) {
    // var user = Meteor.users.findOne(this.userId);
    //console.log(user.username);

      // return Meteor.users.find({});
      return Meteor.users.find({}, {fields:
        {'username': 1,
         'emails': 1, 
         'profile' : 1
        }});
  }
  return null;
});

Meteor.publish("allTags", function(){
  if (this.userId) {
    return Tags.find({});
  }
  return null;
});

// ### WORKING VALIDATION FOR PETER AND JUSTIEN ACCOUNTS

// Meteor.publish("allImageEntriesDB", function(){
//   //returns undefined if not logged in so check if logged in first
//   if(this.userId) {
//     // console.log("allImageEntriesDB "+this.userId);
//     //var user is the same info as would be given in Meteor.user();
//     var user = Meteor.users.findOne(this.userId);
//     if (user.username == "peter" || user.username == "justien Marseille"){
//       return ImageEntries.find();
//     }
//   }
//       return null;
// });


// Meteor.publish("allUsersDB", function(){
//   //console.log('call allusersdb '+this.userId);
//   if (this.userId) {
//     var user = Meteor.users.findOne(this.userId);
//     //console.log(user.username);

//     if (user.username == "peter" || user.username == "justien Marseille"){
//       return Meteor.users.find({});
//     };
//   }
//   return null;
// });