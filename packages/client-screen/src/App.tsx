import React from 'react';
import WidgetContainer from './component/WidgetContainer'
import RssWidget from './component/RssWidget'
import TestWidget from './component/TestWidget';

function App() {
  return (          
        <WidgetContainer>
          <TestWidget name="Proof of Concept Widget"/>
          <RssWidget/>
        </WidgetContainer>
  );
}

export default App;
