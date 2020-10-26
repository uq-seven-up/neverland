import React from 'react'
import { useState, useEffect } from 'react';


/**
 * Reference:
 * Start using React Hooks retrieved from
 * https://productoptimist.com/start-using-react-hooks-a-clock-timer-example/
 */

interface ClockWidgetProp {
  name: string,
  id?:string
}

/**
 * Clock widget for the big screen
 */

 //Create timehook
function ClockWidget(props:any) {    
    const [date, setDate] = useState(new Date());


   //Update time
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
		<section id={props.id} className="widget clock">
      		{/* string modified for displaying only HH:MM */}
      		<h2>{date.toLocaleTimeString(navigator.language, {hour: '2-digit', minute: '2-digit'})}</h2>
        </section>
        )
}
     
//Export component
export default ClockWidget