import React from 'react';

import WeatherWidget from './component/WeatherWidget';
import WidgetContainer from './component/WidgetContainer';
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
			<WidgetContainer>
				<ClockWidget name="Clock" />
				<WeatherWidget name="Weather Widget PoC" />
				<BusWidget name="UQ Lakes" />
				<BusWidget name="UQ Chancellor's Place" />
				<RssWidget />
				<StudyWidget />
			</WidgetContainer>

			<WidgetContainer>
				<QRCodeWidget/>
				<PollWidget/>
				<GameWidget/>
			</WidgetContainer>
		</>
	);
}

export default App;
