import React from 'react';

import WeatherWidget from './component/WeatherWidget'
import WidgetContainer from './component/WidgetContainer'
import RssWidget from './component/RssWidget'
import ClockWidget from './component/ClockWidget';
import QRCodeWidget from './component/QRCodeWidget';
import PollWidget from './component/PollWidget';
import InteractivityWidget from './component/InteractivityWidget';
import BusWidget from './component/BusWidget';

function App() {
  return (
	<>
		<WidgetContainer>
			<div className="weatherTime">
				<ClockWidget name="Clock" />
				<WeatherWidget  name="Weather Widget PoC"/>
			</div>
			<BusWidget name="UQ Lakes"/>
			<BusWidget name="UQ Chancellor's Place"/>
			<RssWidget />					
		</WidgetContainer>

		<WidgetContainer>
			<div className="pollContainer">
				<PollWidget></PollWidget>
				<QRCodeWidget></QRCodeWidget>
			</div>
			<InteractivityWidget name = "Placeholder Widget"/>
		</WidgetContainer>
	</>
  );
}

export default App;
