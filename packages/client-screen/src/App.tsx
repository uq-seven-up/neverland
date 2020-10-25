import React from 'react';

import BusWidget from './component/BusWidget';
import ClockWidget from './component/ClockWidget';
import PollWidget from './component/PollWidget';
import QRCodeWidget from './component/QRCodeWidget';
import ScoreWidget from './component/ScoreWidget';
import StudyWidget from './component/StudyWidget';
import LeaderboardWidget from './component/LeaderboardWidget'
import WeatherWidget from './component/WeatherWidget';

function App() {
	let mobilePort =  process.env.NODE_ENV === 'development' ? ':3010' : '';
	let mobileSiteURL = 'http://' + window.location.hostname + mobilePort;
	mobileSiteURL = mobileSiteURL + '/client-mobile';
	
	return (
		<>
			<div id="g_cellbox_1" className="g_cell">
				<ClockWidget id="widget_clock" name="Clock" />
				<WeatherWidget id="widget_weather" name="Weather Widget PoC" />
			</div>
			<div className="flip-card">
				<div id="g_cellbox_2" className="class-container">
					<div className="g_cell card-front">
						<BusWidget id="widget_bus_uq" name="UQ Lakes" />
					</div>
					<div className="g_cell card-back">
						<BusWidget id="widget_bus_uq" name="Chancellor Place" />
					</div>
				</div>
			</div>
			<div className="flip-card">
				<div id="g_cellbox_3" className="class-container">
				<div className="g_cell card-front">
						<LeaderboardWidget id="widget_leaderboard" />
					</div>
					<div className="g_cell card-back">
						<StudyWidget id="widget_study" />
					</div>
				</div>
			</div>			

			<div id="g_cellbox_4" className="g_cell">
				
				<PollWidget id="widget_poll" />
				<QRCodeWidget id="widget_qr" qrCodeUrl={mobileSiteURL} />
			</div>

			<div id="g_cellbox_5" className="g_cell">
				<ScoreWidget></ScoreWidget>
				<div id="phaser-game"></div>
			</div>
		</>
	);
}

export default App;
