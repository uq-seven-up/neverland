import React from 'react';

import WeatherWidget from './component/WeatherWidget'
import WidgetContainer from './component/WidgetContainer'
import RssWidget from './component/RssWidget'
import TestWidget from './component/TestWidget';
import ClockWidget from './component/ClockWidget';
import QRCodeWidget from './component/QRCodeWidget';
import PollWidget from './component/PollWidget';
<<<<<<< HEAD
import InteractivityWidget from './component/InteractivityWidget';
=======
import BusWidget from './component/BusWidget';
>>>>>>> 50eb1f21

function App() {
  return (
	<>

		<WidgetContainer>
<<<<<<< HEAD
			<ClockWidget name="Clock" />
			<WeatherWidget  name="Weather Widget PoC"/>		
			<TestWidget name="UQ Lakes"/>
			<TestWidget name="UQ Chancellor's Place"/>
			<RssWidget />						
=======
			<WeatherWidget  name="Weather Widget PoC"/>
			<ClockWidget name="Clock" />	
			<BusWidget name="UQ Lakes"/>
			<BusWidget name="UQ Chancellor's Place"/>
			<RssWidget />					
>>>>>>> 50eb1f21
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
