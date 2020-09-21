import React from "react"

interface StudySpaceProp {
    id?:string
}

/**
 * This widget is a proof of concept implementation of a 
 * react component using a class.
 */
class StudySpace extends React.Component <StudySpaceProp> {    
    /* ########################################################*/
    /* UI Rendering*/
    public render() {
        return (
		<section id={this.props.id} className="widget study">
            	<img src={`/client-screen/gfx/studyspace.png`} alt=""></img>
        </section>
        )
    }
}

export default StudySpace