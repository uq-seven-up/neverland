import React from "react"

/**
 * This widget is a proof of concept implementation of a 
 * react component using a class.
 */
class GameWidget extends React.Component {    
    /* ########################################################*/
    /* UI Rendering*/
    public render() {
        return (
		<section className="widget game">
            	<img src={`/client-screen/gfx/game.png`} alt=""></img>
        </section>
        )
    }
}

export default GameWidget