import React from "react"

interface WidgetContainerProp {id?:string}
interface WidgetContainerState {}

/**
 * This container will hold all widgets and is responsible for orchestrating
 * the scheduling the display of widgets.
 * 
 * (I know in the current simplistic form this could have been done without defining a class component.)
 */
class WidgetContainer extends React.Component<WidgetContainerProp,WidgetContainerState> {
    public render() {
        return (
        <div id={this.props.id} className="widget-container">
            {this.props.children}
        </div>
        )
    }
}

export default WidgetContainer