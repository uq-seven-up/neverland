import React from 'react';

import WeatherWidget from './component/WeatherWidget';
import WidgetContainer from './component/WidgetContainer';
import RssWidget from './component/RssWidget';
import ClockWidget from './component/ClockWidget';
import QRCodeWidget from './component/QRCodeWidget';
import PollWidget from './component/PollWidget';
import InteractivityWidget from './component/InteractivityWidget';
import BusWidget from './component/BusWidget';
import StudyWidget from './component/StudyWidget';

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
				<QRCodeWidget></QRCodeWidget>
				<PollWidget></PollWidget>
				<InteractivityWidget name="Placeholder Widget" />
			</WidgetContainer>
		</>
	);
}

export default App;
