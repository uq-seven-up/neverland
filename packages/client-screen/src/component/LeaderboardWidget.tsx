import React from 'react';

import { API } from '@7up/common-utils';
import { AxiosResponse } from 'axios';
import ProgressBarComponent from './ProgressBar';

interface teamScores {
	[key: string]: any;
}

interface LeaderboardWidgetProp {
	id?: string;
}

interface teamScoresState {
	teamScores: teamScores[];
}

/**
 * This widget is a proof of concept implementation of a
 * react component using a class.
 */
class LeaderboardWidget extends React.Component<
	LeaderboardWidgetProp,
	teamScoresState
> {
	colorsList: string[];

	constructor(props: LeaderboardWidgetProp) {
		super(props);
		this.colorsList = [
			'#EDE57E',
			'#e0e0e0',
			'#FBB03B',
			'#BCFA7E',
			'#BCFA7E',
		];
		this.state = {
			teamScores: [],
		};
	}

	/* ########################################################*/
	/* React life-cycle event.*/
	public componentDidMount(): void {
		console.log('Leaderboard Widget Component Did Mount');
		this.callAPI('', 'GET', '/leaderboard/scores');
	}
	/* ########################################################*/

	/* ########################################################*/
	/* Working methods. */
	/**
	 * Make an API call to the neverland REST server.
	 *
	 * @param name - An arbitrary identifier for this request, this value is passed through to the provide callback.
	 * @param method - The HTTP method that will be used for the request.
	 * @param endpoint - The API endpoint (route) which is called on the REST Server.
	 * @param data - Optional: A simple object which is passed to the REST API inside of the request body.
	 * @param hideBusy - Optional: not implemented yet. (suppresses the loading spinner)
	 * @returns void
	 */
	private callAPI = (
		name: string,
		method: 'GET' | 'POST' | 'PUT' | 'DELETE',
		endpoint: string,
		data?: any,
		hideBusy?: boolean,
	): void => {
		let baseUrl = (process.env.REACT_APP_NEVERMIND_API_BASE as any) as string;
		new API(baseUrl).call(
			method,
			endpoint,
			(response: AxiosResponse<any>) => {
				if (response.status === 200) {
					if (this.handleApiCallSuccess) {
						this.handleApiCallSuccess(name, method, endpoint, response.data);
					}
				} else if (response.status === 500) {
					alert('Server Error: 500');
				} else {
					alert(response.data.msg.displayTxt);
				}
			},
			data,
		);
	};
	/* ########################################################*/

	/* ########################################################*/
	/* Event Handlers. */
	/**
	 * This method is called by callAPI() afer a successfull response has been received from the REST Server.
	 *
	 * @param name - The name that was passed in to the callAPI method when this request was initiated.
	 * @param method - The HTTP method that was passed in to the callAPI method when this request was initiated.
	 * @param endpoint - The API endpoint (route) that was passed in to the callAPI method when this request was initiated.
	 * @param result - The data received from the REST APIs response body.
	 * @returns void
	 */
	private handleApiCallSuccess = (
		name: string,
		method: string,
		endpoint: string,
		result: any,
	): void => {
		const sortedData = result.data.sort((a: any, b: any) => a.score > b.score ? -1: 1);
		const slicedData = sortedData.slice(0, 5);
		slicedData[0].name += " 👑";
		slicedData[1].name += " 🥈";
		slicedData[2].name += " 🥉";
		
		this.setState({ teamScores: slicedData });
	};
	/* ########################################################*/

	/* ########################################################*/
	/* UI Rendering*/
	/**
	 * Render the progress bars depending on whether the API call
	 * has been made or not. Split up from the main render method
	 * to keep the code modular.
	 *
	 * @returns JSX element
	 */
	private renderScores() {
		return (
			<div>
				{this.state.teamScores.map(
					(teamScore: any, index: number) => (
						<div className="team-score">
							<div>
								<ProgressBarComponent
									key={index}
									color={this.colorsList[index]}
									filled={teamScore.score}
									showPercentage={false}
									topScore={this.state.teamScores[0].score}
								/>
								<span>{`${teamScore.name}`}</span>
							</div>
						</div>
					),
				)}
			</div>
		);
	}

	public render() {
		return (
			<section id={this.props.id} className="widget leaderboard">
				<div className="heading">
					<h2>Game Leaderboard</h2>
					<figure></figure>
				</div>
				<div className="content">
					{this.renderScores()}
				</div>
			</section>
		);
	}
}

export default LeaderboardWidget;
