Meteor.methods({
  updateUser: function(userId, newUsername, newEmail, fashionVal, techVal, cultureVal, politicsVal, econVal, bsrVal, nfcVal){
    if (! Meteor.userId()) {
      throw new Meteor.error("not authorized");
    }

    Meteor.users.update(
      userId,
      { $set: {
        "username" : newUsername,
        "profile.fashion" : fashionVal,
        "profile.technology" : techVal,
        "profile.culture" : cultureVal,
        "profile.politics" : politicsVal,
        "profile.economy" : econVal,
        "profile.bsr" : bsrVal,
        "profile.nfc" : nfcVal
      }}
    );
    replaceEmail(userId,newEmail);
    
    // console.log("updating the user", userId, newUsername, fashionVal, techVal, cultureVal, politicsVal, econVal, bsrVal, nfcVal);
  }
})  

function replaceEmail(userId, newEmail){
  oldUserEmail = Meteor.users.findOne({_id : userId}).emails;
    console.log(typeof userId, typeof oldUserEmail[0].address);
    if (oldUserEmail && oldUserEmail.length > 0){
      Accounts.removeEmail(userId, oldUserEmail[0].address);
    }
    if (newEmail) {
      Accounts.addEmail(userId, newEmail);
      
    }
    console.log("old email removed", oldUserEmail, "new email added", newEmail);
}
