import React from "react"

interface TestWidgetProp {
  name: string
}

interface TestWidgetState {
  status: "on" | "off"
}

/**
 * This widget is a proof of concept implementation of a 
 * react component using a class.
 */
class TestWidget extends React.Component<TestWidgetProp, TestWidgetState> {  
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
        if (this.state.status === 'off') return <div>Something Something Something</div>

        return (
        <ul>
            <li>
				<div>66</div>
				<div>RBWH station, Herston</div>
				<div>9min</div>
			</li>
			<li>
				<div>66</div>
				<div>RBWH station, Herston</div>
				<div>9min</div>
			</li> 
			<li>
				<div>66</div>
				<div>RBWH station, Herston</div>
				<div>9min</div>
			</li> 
			<li>
				<div>66</div>
				<div>RBWH station, Herston</div>
				<div>9min</div>
			</li> 
			<li>
				<div>66</div>
				<div>RBWH station, Herston</div>
				<div>9min</div>
			</li> 
			<li>
				<div>66</div>
				<div>RBWH station, Herston</div>
				<div>9min</div>
			</li>             
        </ul>
        )
    }

    public render() {
        return (
		<section className="widget transit">
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

export default TestWidget