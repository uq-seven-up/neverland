import React from "react"

interface ScoreWidgetProp {
  id?:string
}

interface ScoreWidgetState {
  team1:number,
  team2:number,
  clock:number,
  teamName1:string,
  teamName2:string,
  showScore:boolean
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
			team2:0,
			clock:0,
			teamName1:'',
			teamName2:'',
			showScore:false
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

			let game_clock = window.localStorage.getItem('game_clock');
			if(game_clock)
			{
				this.setState({clock:parseInt(game_clock,10)});
			}

			let teamName1 = window.localStorage.getItem('game_team_name1');
			if(teamName1)
			{
				this.setState({teamName1:teamName1});
			}
			
			let teamName2 = window.localStorage.getItem('game_team_name2');
			if(teamName2)
			{
				this.setState({teamName2:teamName2});
			}

			let game_started = window.localStorage.getItem('game_started');
			if(game_started)
			{
				let showScore = game_started === 'true' ? true : false;
				this.setState({showScore:showScore});
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
	private renderGameScore()
	{
		if(!this.state.showScore) return;

		return(
			<>
				<figure key="fig_1"></figure>
				<h2>{`Team ${this.state.teamName1} : ${this.state.team1}`}</h2>
				<div className="clock">
					<span>{this.state.clock}</span>
				</div>
				<h2>{`Team ${this.state.teamName2} : ${this.state.team2}`}</h2>
				<figure></figure>
			</>
		)
	}

    public render() {
		return (
		<section id={this.props.id} className="widget score">        	
            {this.renderGameScore()}			
        </section>
        )
    }
}

export default ScoreWidget
