import React from 'react';

import WeatherWidget from './component/WeatherWidget'
import WidgetContainer from './component/WidgetContainer'
import RssWidget from './component/RssWidget'
import TestWidget from './component/TestWidget';

function App() {
  return (
	<WidgetContainer>
		<TestWidget name="Proof of Concept Widget"/>
		<RssWidget />
		<WeatherWidget  name="Weather Widget PoC"/>
	</WidgetContainer>
  );
}

export default App;
