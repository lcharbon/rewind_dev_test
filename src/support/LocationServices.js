class LocationServices {
	predictionCallBacks = [];

	constructor() {
		this.language = "";
	}

	loadLocationServices() {
		this.autoCompleteService = new window.google.maps.places.AutocompleteService();
		this.geoCodeService = new window.google.maps.Geocoder();
	}

	postalCode2LatLng(postalCode, success, fail) {
		success = success || function() {};
		fail = fail || function() {};

		function geoCodeSuccess(results, status) {
			if (!results || !results.length || results.length < 1 || status !== "OK") fail();
			else success(results[0].geometry.location);
		}

		this.geoCodeService.geocode({ "address": postalCode}, geoCodeSuccess.bind(this));
	}

	placeId2LatLng(placeId, success, fail) {
		success = success || function() {};
		fail = fail || function() {};

		function geoCodeSuccess(results, status) {
			if (!results || !results.length || results.length < 1 || status !== "OK") fail();
			else success(results[0].geometry.location);
		}

		this.geoCodeService.geocode({ "placeId": placeId }, geoCodeSuccess.bind(this));
	}

	getPlacePredictions(request, predictionGetSuccess) {
		var currentPredictionCallBacks = this.predictionCallBacks;

		function predictionCallback(data) {
			if (currentPredictionCallBacks[currentPredictionCallBacks.length -1] !== currentPredictionCallback) return;
			else {
				predictionGetSuccess(data);
				currentPredictionCallBacks.splice(0, currentPredictionCallBacks.length);
			} 
		}

		var currentPredictionCallback = predictionCallback;

		this.predictionCallBacks.push(predictionCallback);

		return this.autoCompleteService.getPlacePredictions(request, predictionCallback);
	}

	geoCodePlaceId(placeId, success) {
		this.geoCodeService.geocode({ "placeId": placeId }, success);
	}

	retrieveAddrObjForPlaceId(placeId, isLongName, success, fail) {
		success = success || function() {};
		fail = fail || function() {};

		function geoCodeSuccess(results, status) {
			var data = {};

			if (!results || status !== "OK") return fail();

			data = this.parseAddressComponents(results[0], isLongName);

			if (data === false) return fail();
			
			success(data);
		}

		this.geoCodeService.geocode({ "placeId": placeId }, geoCodeSuccess.bind(this));
	}

	parseAddressComponents(obj, isLongName) {
		var rawData = {};
		var data = {};
		var nameType = isLongName? "long_name" : "short_name";
		
		obj.address_components.forEach(function(component) {
			var types = component.types;

			types.forEach(function(type) {
				// Force long name
				if (["route"].includes(type)) rawData[type] = component["long_name"];
				if (["street_number", "locality", "administrative_area_level_1", "country"].includes(type)) rawData[type] = component[nameType];
			});
		});

		data = {
			city: rawData.locality,
			country: rawData.country,
			territory: rawData.administrative_area_level_1
		};

		//Validation
		if (Object.values(data).includes(undefined)) return false;
		else return data;
	}

	initMap(element, markers, options) {
		var map = new window.google.maps.Map(element, options);
		
		markers = markers || [];

		markers.forEach(function(marker) {
			new window.google.maps.Marker({
				position: marker,
				map: map
			});
		});
	}
}

let locationServices = new LocationServices();

export default locationServices;