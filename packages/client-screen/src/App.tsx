import React from 'react';

import WeatherWidget from './component/WeatherWidget'
import WidgetContainer from './component/WidgetContainer'
import RssWidget from './component/RssWidget'
import TestWidget from './component/TestWidget';
import ClockWidget from './component/ClockWidget';

function App() {
  return (
	<WidgetContainer>
		<WeatherWidget  name="Weather Widget PoC"/>
		<TestWidget name="UQ Lakes"/>
		<TestWidget name="UQ Chancellor's Place"/>
		<RssWidget />
		<ClockWidget name="Clock" />
	</WidgetContainer>
  );
}

export default App;
