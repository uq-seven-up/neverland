import React from "react"

interface TestWidgetProp {
  name: string
}

interface TestWidgetState {
  status: "on" | "off"
}

class TestWidget extends React.Component<TestWidgetProp, TestWidgetState> {  
    constructor(props: any) {
        super(props)

        this.state = {
            status: "on"   
        }       
    }

    /* ########################################################*/
    /* React lif cycle event.*/
    public componentDidMount(): void {
        console.log('Component Did Mount')
    }
    /* ########################################################*/

  
  
    /* ########################################################*/
    /* UI Rendering*/
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
