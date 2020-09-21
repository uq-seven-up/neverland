import React from 'react';

import WeatherWidget from './component/WeatherWidget';
import RssWidget from './component/RssWidget';
import ClockWidget from './component/ClockWidget';
import QRCodeWidget from './component/QRCodeWidget';
import PollWidget from './component/PollWidget';
import BusWidget from './component/BusWidget';
import StudyWidget from './component/StudyWidget';
import GameWidget from './component/GameWidget';

function App() {
	return (
		<>
			<ClockWidget id="widget_clock" name="Clock" />
			<WeatherWidget id="widget_weather" name="Weather Widget PoC" />
			<BusWidget id="widget_bus_uq_lake" name="UQ Lakes" />
			<BusWidget id="widget_bus_uq_chancellor" name="UQ Chancellor's Place" />
			<RssWidget id="widget_rss" />
			<StudyWidget id="widget_study" />
			<QRCodeWidget id="widget_qr"/>
			<PollWidget id="widget_poll"/>
			<GameWidget id="widget_game"/>
		</>
	);
}

export default App;
