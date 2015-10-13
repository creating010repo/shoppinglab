Template.mapView.helpers({
  shoppingLabMapOptions: function() {
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
      // Map initialization options
      return {
        center: new google.maps.LatLng(51.917937,4.487838),
        zoom: 7,
        styles: [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}],
        mapTypeControl: false,
        streetViewControl: false
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
          var pinIcon = {
            anchor: new google.maps.Point(11, 32),
            origin: new google.maps.Point(0, 0),
            scaledSize: new google.maps.Size(21, 32),
            size: new google.maps.Size(42, 64),
            url: 'retailinnovatie-marker.svg',
          };          
          var marker = new google.maps.Marker({
            position: latlon,
            icon: pinIcon,
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