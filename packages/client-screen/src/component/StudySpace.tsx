import React from "react"

/**
 * This widget is a proof of concept implementation of a 
 * react component using a class.
 */
class StudySpace extends React.Component {    
    /* ########################################################*/
    /* UI Rendering*/
    public render() {
        return (
		<section className="widget study">
            	<img src={`/client-screen/gfx/studyspace.png`} alt=""></img>
        </section>
        )
    }
}

export default StudySpace