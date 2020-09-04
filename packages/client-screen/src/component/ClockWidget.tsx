import React from 'react'
import { useState, useEffect } from 'react';


interface ClockWidgetProp {
  name: string
}

/**
 * Clock widget for the big screen
 */
function ClockWidget(props:any) {    
    const [date, setDate] = useState(new Date());


   //Replaces componentDidMount and componentWillUnmount
   useEffect(() => {
    var timerID = setInterval( () => tick(), 1000 );
  

    //Clear memory
    return function cleanup() {
        clearInterval(timerID);
      };
   });

   //Set time
   function tick() {
    setDate(new Date());
   }
    
   //Return time
    return (
		<section className="widget clock">
      <p>{date.toLocaleTimeString(navigator.language, {hour: '2-digit', minute: '2-digit'})}</p>
        </section>
        )
}
        
export default ClockWidget