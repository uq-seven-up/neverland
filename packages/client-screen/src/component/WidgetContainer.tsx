import React from "react"


class WidgetContainer extends React.Component<any,any> {  
 

    /* ########################################################*/
    /* React lif cycle event.*/
    public componentDidMount(): void {
        /* Do nothing for now. */
    }
    /* ########################################################*/

    public render() {
        return (
        <div className="widget-container">
            {this.props.children}            
        </div>               
        )
    }
}

export default WidgetContainer
