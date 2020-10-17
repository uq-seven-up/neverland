import React from 'react';
const ProgressBar = require('progressbar.js');

interface ProgressBarProps {
	key: any;
	color: string;
	filled: any;
	showPercentage: boolean;
	topScore: any;
}

/* ########################################################*/
/* React life-cycle event.*/
class ProgressBarComponent extends React.Component<ProgressBarProps> {
	ed: any;
	public componentDidMount(): void {
		const progressBarColor = this.props.color;
		const progressBarFilled = this.props.filled;
		const showPercentage = this.props.showPercentage;

		var bar = new ProgressBar.Circle(this.ed, {
			color: progressBarColor,
			strokeWidth: 4,
			trailWidth: 1,
			easing: 'easeInOut',
			duration: 1400,
			text: {
				autoStyleContainer: false,
			},
			from: { color: progressBarColor, width: 4 },
			to: { color: progressBarColor, width: 4 },

			step: function (state: any, circle: any) {
				circle.path.setAttribute('stroke', state.color);
				circle.path.setAttribute('stroke-width', state.width);

				if (showPercentage) {
					circle.setText(`${progressBarFilled}%`);
				} else {
					circle.setText(progressBarFilled);
				}
			},
		});

		bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
		bar.text.style.fontSize = '2rem';

		if (showPercentage) {
			bar.animate(progressBarFilled / 100);
		} else {
			bar.animate(progressBarFilled / this.props.topScore);
		}
	}

	public render() {
		return <div className="progress-bar" ref={(ref) => (this.ed = ref)}></div>;
	}
}

export default ProgressBarComponent;
