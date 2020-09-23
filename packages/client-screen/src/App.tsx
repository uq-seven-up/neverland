import React from 'react';

import WeatherWidget from './component/WeatherWidget';

import ClockWidget from './component/ClockWidget';
import QRCodeWidget from './component/QRCodeWidget';
import PollWidget from './component/PollWidget';
import BusWidget from './component/BusWidget';
import StudyWidget from './component/StudyWidget';

function App() {
	return (
		<>
			<div id="g_cellbox_1" className="g_cell">
				<ClockWidget id="widget_clock" name="Clock" />
				<WeatherWidget id="widget_weather" name="Weather Widget PoC" />
			</div>
			<div id="g_cellbox_2" className="g_cell">
				<BusWidget id="widget_bus_uq" name="UQ Lakes" />							
			</div>
			<div id="g_cellbox_3" className="g_cell">			
				<StudyWidget id="widget_study" />
			</div>
			
			<div id="g_cellbox_4" className="g_cell">
				<PollWidget id="widget_poll"/>
				<QRCodeWidget id="widget_qr"/>			
			</div>

			<div id="g_cellbox_5" className="g_cell">
				<div id="phaser-game"></div>
			</div>
		</>
	);
}

export default App;
