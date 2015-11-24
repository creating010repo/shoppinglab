var mapGlobal = null;

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

Session.set("tagFilterArray", []);

// pushing tags into the filter array
var setTagFilters = function (tag) {
  var tagFilterArray = Session.get("tagFilterArray");
  var newTagFilterArray = [];
  var alreadyIncluded = false;
  for (var i = 0; i < tagFilterArray.length; i++) {
    var currItem = tagFilterArray[i];
    // Is not the current item
    if(currItem._str != tag._str){
      newTagFilterArray.push(currItem);
    }
    else {
      alreadyIncluded = true;
    }
  }
  //Current item that was clicked only added if was not there before
  // console.log(tagFilterArray, tag);
  if(tagFilterArray.length == 0 || !alreadyIncluded){
    newTagFilterArray.push(tag);
  }

  Session.set("tagFilterArray", newTagFilterArray);
  //console.log("tagFilterArray: ", newTagFilterArray);
  // tagFilterArrayDep.changed();
};

Template.filtersMap.onCreated( function() {
  Session.set("tagFilterArray", Tags.find().map(function(u){
    return u._id;
  }));
});

Template.filtersMap.tagFilters = function () {
  // console.log("getTagFilters");
  // tagFilterArrayDep.depend();
  return Session.get("tagFilterArray");
};
Template.filtersMap.helpers({
  // listing all tags in the database
  allTags: function(){
    return Tags.find();
  },
  // indicating if a tag is added to the array or not (to show btn-success status for button)
  isTagged: function(){
    var tagFilterArray = Session.get("tagFilterArray");

    for (var i = 0; i < tagFilterArray.length; i++) {
      var currTag = tagFilterArray[i];
      // console.log("isTagged", currTag, this._id);
      if (currTag._str == this._id._str) {
        return "btn-success";
      }
    }
    return "";
  }
});
Template.filtersMap.events({
  // listening to the button click of the tag buttons
  "click .tagFilterButton": function(e){
    // console.log("add tag to selected",this._id);
    setTagFilters(this._id);
    mapReloader();
  },
  "click .selectAll": function(e){
    Session.set("tagFilterArray", Tags.find().map(function(u){
      return u._id;
      })
    );
    mapReloader();
  },
  "click .selectNone": function(e){
    Session.set("tagFilterArray", []);
    mapReloader();
  }
});

Session.set('displayType', "marker");

function toggleHeatmap(controlDiv, map){
  //console.log("in toggleheatmap function");

  controlDiv.className = "gmnoprint map-custom-control-container";
  var controlUIContainer = document.createElement( 'div' ),
    controlUI = document.createElement( 'div' );

  controlUIContainer.className = "gm-style-mtc";
  controlDiv.appendChild( controlUIContainer );

  controlUI.className = "map-custom-control";
  controlUI.title = 'Click to switch between heatmaps and markers';
  controlUI.innerHTML = 'Heatmap/markers';
  controlUIContainer.appendChild( controlUI );

  // Setup the click event listeners: simply set the map to Chicago.
  controlUI.addEventListener('click', function() {
    //function to toggle the heatmap/markers

    var showDisplay = Session.get('displayType');
    showDisplay = (showDisplay == "heatmap" ? "marker" : "heatmap");
    Session.set('displayType', showDisplay);
    if (showDisplay == 'heatmap') {
      // console.log("should switch to heatmap");
      heatmapDisplay(map);
    } else {
      markerDisplay(map);
      // console.log("should show markers");
    };
  });
};

Template.mapView.onCreated(function(){
  // console.log("Map created");
  loadMap();
})

function loadMap() {
  // console.log("loadMap");
  // We can use the `ready` callback to interact with the map API once the map is ready.
  GoogleMaps.ready('shoppingLabMarkers', function(map) {
    mapGlobal = map;
    // console.log("google maps ready");
    // console.log(ImageEntries.find().count());

    var toggleHeatmapDiv = document.createElement('div');
    var toggleheatmap = new toggleHeatmap(toggleHeatmapDiv, map);
    //
    toggleHeatmapDiv.index = 1;
    map.instance.controls [ google.maps.ControlPosition.TOP_LEFT ] .push(toggleHeatmapDiv);
    mapReloader();
  });
};

function mapReloader(){
  var showDisplay = Session.get('displayType');
  // console.log("mapReloader",showDisplay)
  if (showDisplay == 'heatmap') {
    // console.log("should switch to heatmap");
    heatmapDisplay(mapGlobal);
  } else {
    markerDisplay(mapGlobal);
    // console.log("should show markers");
  };
};

var markers = [];
var heatmap = null; // will be set the first time

function getSearchQuery(){
  var tagFilterArray = Session.get("tagFilterArray");
  var searchQuery = {tags: {$in: tagFilterArray}};
  if(tagFilterArray.length == 0){
    searchQuery = { $or: [ {"tags": {$size : 0}}, {"tags": {$exists: 0}}]};
  }
  return searchQuery;
}

function heatmapDisplay(map) {
  clearMap();
  
  var heatmapPoints = ImageEntries.find(getSearchQuery()).map(
    function (thisDoc) {
      if (thisDoc.gps) {
        var thisGps = thisDoc.gps.split(',');
        var latlon = new google.maps.LatLng(thisGps[0], thisGps[1]);
        return latlon;
      }
    }
  )
  heatmap = new google.maps.visualization.HeatmapLayer({
    data: heatmapPoints,
    map: map.instance
  });
}


function markerDisplay(map) {
  clearMap();
  ImageEntries.find(getSearchQuery()).forEach(
    function (thisDoc) {
      // console.log("in forEach: "+thisDoc._id);
      if (thisDoc.gps) {
        var thisGps = thisDoc.gps.split(',');
        var latlon = new google.maps.LatLng(thisGps[0], thisGps[1]);
        // console.log(thisGps[0] + " , " + thisGps[1]);
        var pinIcon = {
          anchor: new google.maps.Point(11, 32),
          origin: new google.maps.Point(0, 0),
          scaledSize: new google.maps.Size(21, 32),
          size: new google.maps.Size(42, 64),
          url: 'retailinnovatie-marker.svg',
        };

        // var contentInfoWindow = Blaze.toHTMLWithData(Template.mapInfoWindow, Blaze.getData(thisDoc));
        var contentInfoWindow = Blaze.toHTMLWithData(Template.mapInfoWindow, thisDoc);

        var infowindow = new google.maps.InfoWindow({

          // content: '<div class="thumbnail"> <p>'+ thisDoc.public_id + '</p></div>'
          // content: Blaze.toHTML(Template.imageDisplay, Blaze.getData(thisDoc))
          content: contentInfoWindow,
          maxWidth: 250
        });

        var marker = new google.maps.Marker({
          position: latlon,
          icon: pinIcon,
          map: map.instance,
          id: thisDoc._id
        });
        markers.push(marker);
        google.maps.event.addListener(marker, 'click', function () {
          if (!marker.open) {
            infowindow.open(map.instance, marker);
            marker.open = true;
          } else {
            infowindow.close(map.instance, marker);
            marker.open = false;
          }
          google.maps.event.addListener(map.instance, 'click', function () {
            infowindow.close();
            marker.open = false;
          });
        });
      }
      // else {
      //   console.log("GPS error " + thisDoc._id);
      // }
    });
}

function clearMap(){
  // Clear markers first
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  if(heatmap){
    heatmap.setMap(null);
  }
}
