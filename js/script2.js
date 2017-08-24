$(function(){
var city;

	// var form = document.querySelector('#form');

	// 	form.addEventListener('submit',function(e){
	// 		e.preventDefault();

	// 		city = document.getElementById('city').value
	// 	});



	var	citySearch = fetch('https://api.teleport.org/api/cities/?search= ' +  city)
		.then(function(response){
			return response.json()
		})

		citySearch.then(function(response){
			var citySearchResult = (response._embedded);
			var getCIty = citySearchResult["city:search-results"][0]._links
			var getLink = getCIty["city:item"].href;
			console.log(getLink);


					var	cityJson = fetch(getLink)
						.then(function(response){
							return response.json()
						})

					cityJson.then(function(response){
						var cityName = response.name
						var cityLocation = (response.location.latlon);
						var lat = cityLocation.latitude
						var lon = cityLocation.longitude
						console.log(lat);z
						console.log(lon);
						console.log(cityLocation);


						var fetchVenues = fetch('https://api.foursquare.com/v2/venues/search?ll='+ lat + ',' + lon + '&oauth_token=31IKISSPG2GH3T2REIYI4KICN2T5WZH2LHMO1T1FV3NTRBQ2&v=20170822')
								.then(function(response){
								return response.json()
							})

							fetchVenues.then(function(response){

									var venues = response.response.venues;
									console.log(venues);
									var center = [lat, lon]
									var map = L.map('map').setView(center, 12);
									L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibmFpdnZpIiwiYSI6ImNqNmxncmoyMjFyZGMyeG1xN3Yyejk4dHIifQ.O7Bby6q1Jbn8v9ANa4_P5w', {foo: 'bar'}).addTo(map);
									L.circle(center, {radius: 3000, fill: false, color: '#000'}).addTo(map);

	
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
								        map.removeLayer(marker); // Direct reference to the marker
								      } else {
								        map.addLayer(marker);
      								}
      							}


								
								for (let i = 0; i<venues.length; i++) {

									let venue = venues[i];
									let venueName = venue.name;
									let venueAddress = venue.location.address

									console.log(venueName);
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

									console.log(iconUrl);

									busStopIcon = L.divIcon({
										className: 'venue__Marker',	
										iconSize: [30,30],
										html: '<div></div><div></div>'
									}); 

									popup = "<div class=popup>" + ' <p> ' + venueName + '</p>' + '<p> ' + iconName + " </p></div>" 

									// let mapIcon = L.icon({
									// 			iconUrl:locales[i].iconImage,
									// 			iconSize: [200, 80]
									// });
									let marker = L.marker(venuelocation, {icon:busStopIcon}).addTo(map).bindPopup(popup, {className: 'popupbox'}).openPopup();

									marker.getElement().style.backgroundImage = "url("+iconUrl+")";
									// let marker = L.marker(locale.latlng, {icon:mapIcon}).addTo(map);
									// 			let marker = L.marker(locale.latlng).addTo(map);

									// marker.bindPopup('<div>' '</div>')


								map.closePopup();
								}
							})

	


					})


		})	





// L.popup({
// 	closeButton: false,
// 	closeOnClick: false,
// 	className : landmark.popup.className,
// 	offset: [0,0]
// })

// .setLatLng(landmark.popup.latlng)
// .setContent(landmark.popup.content)
// .addTo(map);


// let locales = [
// 	{
// 		latlng: [51.5007, -0.1246],
// 		description: 'Big Ben',
// 		content: 'A Clock Thing'
// 		// iconImage: 'img/map.svg'

// 	},
// // 	{
// // 		latlng: [51.510173, -0.098438],
// // 		description: 'Millennium Bridge',
// // 		content: 'A Bridge Thing'
// // 		// iconImage: 'img/map.svg'

// // 	},
// // 	{
// // 		latlng: [51.517625, -0.096779],
// // 		description: 'Museum of London',
// // 		content: 'A Museum Thing'
// // 		// iconImage: 'img/map.svg'

// // 	},
// // ]


	// L.circle(center, {radius: 3000, fill: false, color: '#000'}).addTo(map);

	// 	for (let i = 0; i<locales.length; i++) {
	// 		let locale = locales[i];

	// 		L.circle(locale.latlng, {
	// 			radius: 200,
	// 			color: '#000'
	// 		}).addTo(map);

	// 		busStopIcon = L.divIcon({

	// 			className: 'bus-stop',
	// 			iconAnchor: [-5,15],
	// 			iconSize: [120,30],
	// 			html: '<div>'+ locales[i].description +'<div class=infoBox></div></div><div></div>'
	// 		}); 
	// 		popup = "<div class=popup>" + locale.content + "</div>" 

	// 		// let mapIcon = L.icon({
	// 		// 			iconUrl:locales[i].iconImage,
	// 		// 			iconSize: [200, 80]
	// 		// });
	// 		let marker = L.marker(locale.latlng, {icon:busStopIcon}).addTo(map).bindPopup(popup, {className: 'popupbox'}).openPopup();
	// 		// let marker = L.marker(locale.latlng, {icon:mapIcon}).addTo(map);
	// 		// 			let marker = L.marker(locale.latlng).addTo(map);

	// 		// marker.bindPopup('<div>' '</div>')


	// 	}


});