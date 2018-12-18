import React, { Component } from "react";
import styles from "./App.module.css";

import Request from "../../support/Request.js";
import settings from "../../support/settings.json";

import locationServices from "../../support/LocationServices.js";
import InputTypeAhead from "../Inputs/InputTypeAhead/InputTypeAhead.js";
import WeatherCard from "../WeatherCard/WeatherCard.js";

class App extends Component {
	constructor(props, context) {
		super(props, context);

		locationServices.loadLocationServices();

		this.state = {
			cityPredictions: [],
			accuWeather: {},
			forcastIO: {},
			openWeatherMap: {}
		};
	}

	oncityselect(placeId) {
		function retrievePlaceSuccess(obj) {
			let data = {
				lat: obj.lat(),
				lng: obj.lng()
			};

			function retrieveWeatherSuccess(obj) {
				this.setState(obj);
			}

			function retreiveWeatherFail(obj) {
				alert(obj.message);
			}

			new Request("POST", settings.apiHost + "/retrieve_weather", data, retrieveWeatherSuccess.bind(this), retreiveWeatherFail.bind(this));
		}
		
		function retreivePlaceFail() {

		}
		
		locationServices.placeId2LatLng(
			placeId, 
			retrievePlaceSuccess.bind(this),
			retreivePlaceFail.bind(this)
		);
	}

	refreshSuggestions(search, success) {
		let request = {
			input: search || "",
			location: undefined,
			radius: undefined,
		};

		if (this.lastSearch === search) return;

		this.lastSearch = search;

		function predictionGetSuccess(predictions) {
			let items = [];

			predictions = predictions || [];

			items = predictions.map(function(prediction) {
				return {
					id: prediction.place_id,
					caption: prediction.description
				};
			});

			this.setState({ cityPredictions: items });
			success();
		}

		locationServices.getPlacePredictions(request, predictionGetSuccess.bind(this));
	}
	
	render() {
		return (
			<div className={styles["app"]}>
				<div className={styles["search-container"]}>
					<div className={styles["input-container"]}>
						<InputTypeAhead
							items={ this.state.cityPredictions }
							refreshItems={ this.refreshSuggestions.bind(this) }
							onchange={ this.oncityselect.bind(this) }
						/>
					</div>
				</div>
				<div className={styles["card-container"]}>
					<WeatherCard
						source="AccuWeather"
						temperature={ this.state.accuWeather.temperature }
						summary={ this.state.accuWeather.summary }
					/>
					<WeatherCard
						source="ForcastIO"
						temperature={ this.state.forcastIO.temperature }
						summary={ this.state.forcastIO.summary }
					/>
					<WeatherCard
						source="OpenWeatherMap"
						temperature={ this.state.openWeatherMap.temperature }
						summary={ this.state.openWeatherMap.summary }
					/>
				</div>
			</div>
		);
	}
}

export default App;