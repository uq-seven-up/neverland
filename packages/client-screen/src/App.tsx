import React from 'react';

import WeatherWidget from './component/WeatherWidget'
import WidgetContainer from './component/WidgetContainer'
import RssWidget from './component/RssWidget'
import TestWidget from './component/TestWidget';
import ClockWidget from './component/ClockWidget';
import QRCodeWidget from './component/QRCodeWidget';
import PollWidget from './component/PollWidget';
import InteractivityWidget from './component/InteractivityWidget';

function App() {
  return (
	<>

		<WidgetContainer>
			<ClockWidget name="Clock" />
			<WeatherWidget  name="Weather Widget PoC"/>		
			<TestWidget name="UQ Lakes"/>
			<TestWidget name="UQ Chancellor's Place"/>
			<RssWidget />						
		</WidgetContainer>

		<WidgetContainer>
			<QRCodeWidget></QRCodeWidget>
			<PollWidget></PollWidget>
			<InteractivityWidget name = "Placeholder Widget"/>
		</WidgetContainer>
	</>
  );
}

export default App;
