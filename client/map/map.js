Template.mapView.helpers({
  shoppingLabMapOptions: function() {
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
      // Map initialization options
      return {
        center: new google.maps.LatLng(51.917937,4.487838),
        zoom: 7
      };
    }
  }
});

Template.mapView.onCreated(function() {
  // We can use the `ready` callback to interact with the map API once the map is ready.
  GoogleMaps.ready('shoppingLabMarkers', function(map) {

    // console.log("google maps ready");
    // console.log(ImageEntries.find().count());
    ImageEntries.find().forEach(
      function (thisDoc){
        // console.log("in forEach: "+thisDoc._id);
        if (thisDoc.gps){
          var thisGps = thisDoc.gps.split(',');
          var latlon = new google.maps.LatLng(thisGps[0],thisGps[1]);
          // console.log(thisGps[0] + " , " + thisGps[1]);
          var marker = new google.maps.Marker({
            position: latlon,
            map: map.instance,
            id: thisDoc._id
          });
        } 
        // else {
        //   console.log("GPS error " + thisDoc._id);
        // }
      }
    );
  });
});