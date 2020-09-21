import React from "react"

interface InteractivityWidgetProp {
  name: string,
  id?:string
}

interface InteractivityWidgeState {
  status: "on" | "off"
}

/**
 * This widget is a proof of concept implementation of a 
 * react component using a class.
 */
class InteractivityWidget extends React.Component<InteractivityWidgetProp, InteractivityWidgeState> {  
    constructor(props: any) {
        super(props)

        this.state = {
            status: "on"
        }       
    }

    /* ########################################################*/
    /* React life-cycle event.*/
    public componentDidMount(): void {
        console.log('Component Did Mount')
    }
    /* ########################################################*/

  
  
    public render() {
        return (
		<section id={this.props.id} className="Interactivity widget">
			<div className="content">
        <div className="placeholder"></div>
			</div>
        </section>
        )
    }
}

export default InteractivityWidget