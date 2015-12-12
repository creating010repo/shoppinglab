Meteor.methods({
  updateUser: function(userId, newUsername, fashionVal, techVal, cultureVal, politicsVal, econVal, bsrVal, nfcVal){
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
    )
    console.log("updating the user", userId, newUsername, fashionVal, techVal, cultureVal, politicsVal, econVal, bsrVal, nfcVal);
  }
})  
