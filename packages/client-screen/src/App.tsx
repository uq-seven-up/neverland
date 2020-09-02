import React from 'react';

import WeatherWidget from './component/WeatherWidget'
import WidgetContainer from './component/WidgetContainer'
import RssWidget from './component/RssWidget'
import TestWidget from './component/TestWidget';
import ClockWidget from './component/ClockWidget';
import QRCodeWidget from './component/QRCodeWidget';
import PollWidget from './component/PollWidget';

function App() {
  return (
	<>
		<WidgetContainer>
			<WeatherWidget  name="Weather Widget PoC"/>
			<ClockWidget name="Clock" />	
			<TestWidget name="UQ Lakes"/>
			<TestWidget name="UQ Chancellor's Place"/>
			<RssWidget />					
		</WidgetContainer>
		<WidgetContainer>
			<QRCodeWidget></QRCodeWidget>
			<PollWidget></PollWidget>
		</WidgetContainer>
	</>
  );
}

export default App;
