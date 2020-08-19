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
        if (this.state.status === 'on') return <div>Something Something Something</div>

        return (
        <div>
            <h3>This is some sub-component</h3>            
        </div>
        )
    }

    public render() {
        return (
        <div className="widget">
            <h2>{this.props.name}</h2>
            {this.renderSubComponentFoo()}
        </div>               
        )
    }
}

export default TestWidget
