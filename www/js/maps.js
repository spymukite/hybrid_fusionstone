var service = null;
var map = null;
var geocoder = null;
var infoWindows = [];


var latitude = 43.6045385;


var longitude = -79.5074394;

var mapcounter = 0;

function onErrorGeo(error) {
    console.log(error.code);
    console.log(error.message);
}

function onSuccessGeo(position) {
    //Get Latitude From Geolocation API
    latitude = position.coords.latitude;

    //Get Longitude From Geolocation API
    longitude = position.coords.longitude;

    //Define New Google Map With Lat / Lon
    var coords = new google.maps.LatLng(latitude, longitude);

    var marker = new google.maps.Marker({
        position: coords,
        map: map,
        icon: './images/me_map.png'
    });

    marker.setMap(map);

    map.setOptions({ 'center': coords, 'zoom':14 });

    navigator.geolocation.clearWatch(watchID);
}

function initializeMapIfOnline() {
    geocoder = new google.maps.Geocoder();

    //Define New Google Map With Lat / Lon
    var coords = new google.maps.LatLng(latitude, longitude);

    var mapOptions = {
        zoom: 14,
        center: coords
    };
    map = new google.maps.Map(document.getElementById('purchase_map'), mapOptions);


    mapcounter = 0;
    for (key in FusionCoordinates) {
        var CurCoords = FusionCoordinates[key];
        var latlng = new google.maps.LatLng(CurCoords.Lat, CurCoords.Long);

        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            title: CurCoords.Name
        });

        var infowindow = new google.maps.InfoWindow({
            content: '<h3>' + CurCoords.Name + '</h3><p>' + CurCoords.Address + ', ' + CurCoords.City + ', ' + CurCoords.Postcode + '</p><p>' + CurCoords.Phone + '</p>' + '<br /><a onclick="direction(\'' + CurCoords.Address + ', ' + CurCoords.City + ', ' + CurCoords.Postcode + '\')" >Direction</a>'
        });

        google.maps.event.addListener(marker, 'click', (function (marker, infowindow) {
            return function () {
                for (var i = 0; i < infoWindows.length; i++) {
                    infoWindows[i].close();
                }
                infowindow.open(map, marker);
            };
        })(marker, infowindow));

        infoWindows.push(infowindow);

        mapcounter++;
    }


    watchID = navigator.geolocation.watchPosition(onSuccessGeo, onErrorGeo, { timeout: 30000 });
}
var watchID;
function initialize() {

    initializeMapIfOnline();


	$("#purchase_search").keyup(function(event){
		if(event.keyCode == 13){
			$('#purchase_search').blur();
			codeAddress();
		}
	});
    //device (android/ios)
    //if (isCordovaApp)
    // navigator.geolocation.getCurrentPosition(onSuccessGeo, onErrorGeo);

    // if (isCordovaApp == false) {
    // //Use HTML5 Geolocation API To Get Current Position
    // navigator.geolocation.getCurrentPosition(function (position) {

    // //Get Latitude From Geolocation API
    // latitude = position.coords.latitude;

    // //Get Longitude From Geolocation API
    // longitude = position.coords.longitude;

    // initializeMapAfterLocation();
    // });
    // }
}

var lastAddress;

function makeInfoWindowEvent(map, infowindow, contentString, marker) {
    google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent(contentString);
        infowindow.open(map, marker);
    });
};

function direction(addr) {
    if (lastAddress == null)
        window.open('https://maps.google.ca/maps?daddr=' + encodeURI(addr), '_newtab');
    else
        window.open('https://maps.google.ca/maps?saddr=' + encodeURI(lastAddress) + '&daddr=' + encodeURI(addr), '_newtab');
}

function codeAddress() {
    lastAddress = document.getElementById('purchase_search').value;
    geocoder.geocode({ 'address': lastAddress }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location,
                icon: './images/me_map.png'
            });
        } else {
            alert('Geocode was not successful for the following reason:' + status);
        }
    });
}

function writeGoogleMapsScript(){
	if( google.maps == undefined) {
		$.getScript( 'https://maps.googleapis.com/maps/api/js?v=3.exp&signed_in=true&libraries=places,visualization&callback=initialize', 
		function() {
			console.log('working');
		});
	}
	// otherwise just load maps
	else {
		initialize();
	}
}