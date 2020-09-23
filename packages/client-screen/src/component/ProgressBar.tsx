import React from 'react';

var ProgressBar = require('react-progressbar.js');
var Circle = ProgressBar.Circle;

function ProgressBarComponent() {
	var options = {
		strokeWidth: 2,
	};

	// For demo purposes so the container has some dimensions.
	// Otherwise progress bar won't be shown
	var containerStyle = {
		width: '200px',
		height: '200px',
	};

	return (
		<Circle
			progress={50}
			text={'test'}
			options={options}
			initialAnimate={true}
			containerStyle={containerStyle}
			containerClassName={'.progressbar'}
		/>
	);
}

export default ProgressBarComponent;
