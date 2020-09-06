import React from 'react';

import WeatherWidget from './component/WeatherWidget'
import WidgetContainer from './component/WidgetContainer'
import RssWidget from './component/RssWidget'
import TestWidget from './component/TestWidget';
import ClockWidget from './component/ClockWidget';
import QRCodeWidget from './component/QRCodeWidget';
import PollWidget from './component/PollWidget';
import StudySpace from './component/StudySpace';
import GameWidget from './component/GameWidget';

function App() {
  return (
	<>

		<WidgetContainer>
			<ClockWidget name="Clock" />
			<WeatherWidget  name="Weather Widget PoC"/>		
			<TestWidget name="UQ Lakes"/>
			<TestWidget name="UQ Chancellor's Place"/>
			<RssWidget />	
			<StudySpace />
			<GameWidget />				
			{/* <QRCodeWidget />
			<PollWidget /> */}
		</WidgetContainer>

		<WidgetContainer>
			<QRCodeWidget></QRCodeWidget>
			<PollWidget></PollWidget>
		</WidgetContainer>
	</>
  );
}

export default App;
