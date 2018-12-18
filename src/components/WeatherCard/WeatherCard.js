import React, { Component } from 'react'
import styles from './WeatherCard.module.css';

class WeatherCard extends Component {
	
	renderWeather() {
		return (
			<div className={ styles["weather"] }>
				<div className={ styles["source"] }>
					{ this.props.source }
				</div>
				<div className={ styles["temperature"] }>
					{ Math.round(this.props.temperature) }
					<span>&#8451;</span>
				</div>
				<div  className={ styles["summary"] }>
					{ this.props.summary }
				</div>
			</div>
		);
	}

	renderError() {
		return (
			<div className={ styles["error"] }>
				<div className={ styles["source"] }>
					{ this.props.source }
				</div>
			</div>
		);
	}

	
	render() {
		return (
			<div className={ styles["main"] }>
				{ this.props.temperature && this.renderWeather() }
				{ !this.props.temperature && this.renderError() }
			</div>
		);
	}
}

export default WeatherCard;