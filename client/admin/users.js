Template.usersList.helpers({
  allUsers: function() {
    return Meteor.users.find({});
  },
  userImageCount: function(userId) {
    return ImageEntries.find({owner : userId}).count()
  },
});

Template.usersList.events({
  "click .updatebutton": function(e) {
    // var fashInput = $('#fashionInput-'+this._id)[0].value;
    // console.log(fashInput);
    console.log("this._id", this._id,
                "usernameinput", $('#usernameInput-'+this._id)[0].value,
                "fashionVal", $('#fashionInput-'+this._id)[0].value,
                "techVal", $('#techInput-'+this._id)[0].value,
                "cultureVal", $('#cultureInput-'+this._id)[0].value,
                "politicsVal", $('#politicsInput-'+this._id)[0].value,
                "economyVal", $('#economyInput-'+this._id)[0].value,
                "bsrVal", $('#bsr-'+this._id)[0].value,
                "nfcVal", $('#nfc-'+this._id)[0].value
      );
    Meteor.call('updateUser', 
                this._id,
                $('#usernameInput-'+this._id)[0].value,
                $('#emailInput-'+this._id)[0].value,
                $('#fashionInput-'+this._id)[0].value,
                $('#techInput-'+this._id)[0].value,
                $('#cultureInput-'+this._id)[0].value,
                $('#politicsInput-'+this._id)[0].value,
                $('#economyInput-'+this._id)[0].value,
                $('#bsr-'+this._id)[0].value,
                $('#nfc-'+this._id)[0].value
      )
  }
});


// var counter=0;
// Template.usersList.helpers({
//   allUsers: function() {
//     return Meteor.users.find({});
//   },
//   item: function() {
//     counter++;
//     return counter;
//     // return Meteor.users.find().map(function(document, index) {
//     //     document.index = index + 1;
//     //     return document.index;
//     // });
//     // console.log(index);
//   }
// });