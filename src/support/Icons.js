import React from 'react'
import styles from './icons.module.css'

const Icons = {
	clear: function() { return (
		<svg viewBox="0 0 500 500" version="1.1" preserveAspectRatio="xMidYMin slice" style= {{ fillRule: "evenodd", clipRule: "evenodd", strokeLinecap: "round", strokeLinejoin: "round", strokeMiterlimit: 1.5 }}>
			<path d="M478,478L22,22" style={{ fill: "none", strokeWidth:"64px" }}/>
			<path d="M22,478L478.034,22.025L22,478Z" style={{ fill: "none", strokeWidth:"64px" }}/>
		</svg>

	)},
	search: function() { return (
		<svg viewBox="0 0 322 322" preserveAspectRatio="xMidYMin slice" style={ { paddingBottom: "100%", "fillRule":"evenodd", "clipRule":"evenodd" } }>
			<g transform="matrix(-1,0,0,1,398.673,-96.7947)">
				<path d="M169.982,299.846C154.09,278.64 144.673,252.308 144.673,223.795C144.673,153.701 201.58,96.795 271.673,96.795C341.766,96.795 398.673,153.701 398.673,223.795C398.673,293.888 341.766,350.795 271.673,350.795C244.074,350.795 218.519,341.972 197.677,326.995L197.774,327.089L104.608,418.795C87.063,418.449 78.085,411.639 76.686,395.885L169.982,299.846ZM271.673,128.545C324.243,128.545 366.923,171.225 366.923,223.795C366.923,276.365 324.243,319.045 271.673,319.045C219.103,319.045 176.423,276.365 176.423,223.795C176.423,171.225 219.103,128.545 271.673,128.545Z"/>
			</g>
		</svg>
	)},
};

Icons.insert = function(name, style) {
	if (!name) return "";

	style = style || "";

	return (
		<div className={`${styles['scaling-svg-container']} ${style}`}>
			{this[name]()}
		</div>
	)
}

export default Icons