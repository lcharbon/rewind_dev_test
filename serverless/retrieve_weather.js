const request = require("request-promise");

module.exports.handler = function(event, context, callback) {
	const requestBody = JSON.parse(event.body);

	async function queryForcastIO() {
		let options = {
			uri: `https://api.darksky.net/forecast/6ec6e123ab27455e6c35b12ec3de67c9/${requestBody.lat},${requestBody.lng}`,
			qs: { units: "ca" },
			json: true
		};

		let rawData =  await request(options);

		return {
			temperature: rawData.currently.temperature,
			summary: rawData.currently.summary
		};
	}

	async function queryAccuWeather() {
		let apiKey = "b6pbcfC5y1DbzZDxOyX4wO46mP9dwnlA";
		
		let locationQueryOptions = {
			uri: "http://dataservice.accuweather.com/locations/v1/cities/geoposition/search",
			qs: {
				apikey: apiKey,
				q: `${requestBody.lat},${requestBody.lng}`
			},
			json: true
		};

		let locationKey = (await request(locationQueryOptions)).Key;
		
		let weatherQueryOptions = {
			uri: `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}`,
			qs: {
				apikey: apiKey,
			},
			json: true
		};

		let rawData = await request(weatherQueryOptions);

		return {
			temperature: rawData[0].Temperature.Metric.Value,
			summary: rawData[0].WeatherText
		};
	}
	
	async function queryOpenWeather() {
		let apiKey = "95973e13df56079689a93e805350bdd8";
		
		let options = {
			uri: "https://api.openweathermap.org/data/2.5/weather",
			qs: {
				lat: requestBody.lat,
				lon: requestBody.lng,
				APPID: apiKey
			},
			json: true
		};

		let rawData = await request(options);

		return {
			temperature: rawData.main.temp - 273.15,
			summary: rawData.weather[0].description
		};
	}

	async function returnWeatherData() {
		let response =  {
			statusCode: 200,
			body: JSON.stringify({
				accuWeather: await queryAccuWeather().catch(),
				forcastIO: await queryForcastIO(),
				openWeatherMap: await queryOpenWeather()
			}),
		};
	
		callback(null, response);
	}

	returnWeatherData().catch((error) => {
		let response = {
			statusCode: 500,
			body: JSON.stringify(error)
		};

		callback(null, response);
	});
};