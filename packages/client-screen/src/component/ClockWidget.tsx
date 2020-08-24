import React from "react"

interface ClockWidgetProp {
  name: string
}

interface ClockWidgetState {
  
}

/**
 * This widget is a proof of concept implementation of a 
 * react component using a class.
 */
class ClockWidget extends React.Component<ClockWidgetProp, ClockWidgetState> {  
    constructor(props: any) {
        super(props)

        
    }

    /* ########################################################*/
    /* React life-cycle event.*/
    public componentDidMount(): void {
        console.log('Component Did Mount')
    }
    /* ########################################################*/

  
  
    /* ########################################################*/
    /* UI Rendering*/
    /**
     * Render a sub-component based on some business logic. Just another proof
     * of concept to see how the main render method can use helper methods for 
     * modularising rendering the component HTML.
     * 
     * @returns JSX element
     */
    private renderSubComponentFoo() {


        return (
        <div>

        </div>
        )
    }

    public render() {
        return (
		<section className="widget clock">
        	<div className="heading">
				<h2>{this.props.name}</h2>
				<figure></figure>
			</div>

			<div className="content">
            	{this.renderSubComponentFoo()}
			</div>
        </section>
        )
    }
}

export default ClockWidget