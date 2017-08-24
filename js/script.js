$(function(){
var city;
var doneCities = []
var map = L.map("map", {
    zoomControl: false
    //... other options
});

var historyIcon = document.querySelector('.openIcon')
var historyContainer = document.querySelector('.history__container')

historyIcon.addEventListener('click', openHistory);

function openHistory() {
		map.setView([51.5074, 0], 2);	
}

document.getElementById('city').onkeydown = function(e){
   if(e.keyCode == 13){
    		city = document.getElementById('city').value.toLowerCase();
			console.log(city);
 
			cityContainer = document.getElementById('city')
			cityContainer.parentElement.parentElement.classList.add('hide');
			doMapThings(city);
		}
	}

document.getElementById('header').onkeydown = function(e){
   if(e.keyCode == 13){
    		city = document.getElementById('header').value.toLowerCase();
			console.log(city);
 
			cityContainer = document.getElementById('city')
			cityContainer.parentElement.parentElement.classList.add('hide');
			doMapThings(city);
		}

	}


function doMapThings(city) {
	var checkArray = jQuery.inArray(city, doneCities); 
	doneCities.push(city)
	console.log(doneCities);
	console.log(checkArray);
	if (checkArray == -1) {
		var	citySearch = fetch('https://api.teleport.org/api/cities/?search= ' +  city)
			.then(function(response){

				return response.json()
			})



			citySearch.then(function(response){
				var citySearchResult = (response._embedded);
				var getCIty = citySearchResult["city:search-results"][0]._links
				var getLink = getCIty["city:item"].href;

						var	cityJson = fetch(getLink)
							.then(function(response){
								return response.json()
							})

						cityJson.then(function(response){
							var cityName = response.name
							var cityLocation = (response.location.latlon);
							var lat = cityLocation.latitude
							var lon = cityLocation.longitude

							var fetchVenues = fetch('https://api.foursquare.com/v2/venues/search?ll='+ lat + ',' + lon + '&limit=50&oauth_token=31IKISSPG2GH3T2REIYI4KICN2T5WZH2LHMO1T1FV3NTRBQ2&v=20170822')
									.then(function(response){
									return response.json()
								})

								fetchVenues.then(function(response){

										var venues = response.response.venues;
										var center = [lat, lon]
										
										map.setView(center, 14);	

										L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibmFpdnZpIiwiYSI6ImNqNmxncmoyMjFyZGMyeG1xN3Yyejk4dHIifQ.O7Bby6q1Jbn8v9ANa4_P5w', {foo: 'bar'}).addTo(map);
										L.circle(center, {radius: 2500, fill: false, color: '#000'}).addTo(map);

		
										cityLabel = L.divIcon({

											className: 'cityLabel',
											iconAnchor: [-5,15],
											iconSize: [90,25],

											html: '<div>'+ cityName +'<div class=infoBox></div></div><div></div>'
										}); 
										popup = "<div class=popup>" + ' <p> Latitude ' + lat + '</p>' + '<p> Longitude ' + lon + " </p></div>" 


										let marker = L.marker(center, {icon:cityLabel}).addTo(map).bindPopup(popup, {className: 'popupbox'}).openPopup();

										map.on('zoomend', onZoomend);
									    onZoomend();
									    function onZoomend() {
									      var zoom = map.getZoom();
									      
									      if (zoom > 15) {
									        map.removeLayer(marker); 
									      } else {
									        map.addLayer(marker);
	      								}

									marker.on('click', function(e){
									    map.setView([e.latlng.lat, e.latlng.lng], 18);
									});

	      							}
		
									for (let i = 0; i<venues.length; i++) {

										let venue = venues[i];
										let venueName = venue.name;
										let venueAddress = venue.location.address
										let iconUrl;
										let iconName;

											if (venue.categories[0] != null) {
												let icon = venue.categories[0].icon
													let iconPrefix = icon.prefix
													let iconsuffix = icon.suffix
													iconName = venue.categories[0].name
													iconUrl =  iconPrefix + '64' + iconsuffix
											}
			
										let venuelocation = [venue.location.lat, venue.location.lng];

												venueMapIcon = L.divIcon({
													className: 'venue__Marker',	
													iconSize: [30,30],
													html: '<div></div><div></div>'
												}); 

										popup = "<div class=popup>" + ' <p> ' + venueName + '</p>' + '<p> ' + iconName + " </p></div>" 
											let marker = L.marker(venuelocation, {icon:venueMapIcon}).addTo(map).bindPopup(popup, {className: 'popupbox'}).openPopup();
												marker.getElement().style.backgroundImage = "url("+iconUrl+")";

									map.closePopup();
									}
								})
						})
			})	

			var form = document.querySelector('#form');

					form.addEventListener('submit', function(e){
						e.preventDefault();

					});
			}
	}


	function doPanThings (city) {

	}
});