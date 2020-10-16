import React from "react"

interface ScoreWidgetProp {
  id?:string
}

interface ScoreWidgetState {
  team1:number,
  team2:number
}

/**
 * This widget is a proof of concept implementation of a 
 * react component using a class.
 */
class ScoreWidget extends React.Component<ScoreWidgetProp, ScoreWidgetState> {  
	private timer:any;
	
	constructor(props: any) {
        super(props)

        this.state = {
			team1:0,
			team2:0
        }       
    }

    /* ########################################################*/
    /* React life-cycle event.*/
	public componentDidMount(): void {
		this.timer = setInterval( () =>{
			let game_team_1 = window.localStorage.getItem('game_team1');
			if(game_team_1)
			{
				this.setState({team1:parseInt(game_team_1,10)});
			}
			let game_team_2 = window.localStorage.getItem('game_team2');
			if(game_team_2)
			{
				this.setState({team2:parseInt(game_team_2,10)});
			}
		}, 500);
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
    public render() {
        return (
		<section id={this.props.id} className="widget score">        	
            	Game Score {this.state.team1}:{this.state.team2}
        </section>
        )
    }
}

export default ScoreWidget