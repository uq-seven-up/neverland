import React from 'react';

import { API } from '@7up/common-utils';
import { AxiosResponse } from 'axios';
import ProgressBarComponent from './ProgressBar';

interface SpaceAvailability {
	[key: string]: string;
}

interface StudyWidgetProp {
	id?: string;
}

interface SpaceAvailabilityState {
	spaceAvailability: SpaceAvailability[];
}

/**
 * This widget is a proof of concept implementation of a
 * react component using a class.
 */
class StudyWidget extends React.Component<
	StudyWidgetProp,
	SpaceAvailabilityState
> {
	nonStLuciaLibraries: number[];
	colorsList: string[];
	libraryVisibilityToggle: boolean;
	constructor(props: StudyWidgetProp) {
		super(props);
		this.nonStLuciaLibraries = [5, 6, 8, 9];
		this.colorsList = [
			'#7EFAFA',
			'#FCB1FC',
			'#BCFA7E',
			'#FBB03B',
			'#EDE57E',
			'#00D6CA',
			'#7A44EE',
			'#00D6CA',
		];
		this.libraryVisibilityToggle = true;
		this.state = {
			spaceAvailability: [],
		};
	}

	/* ########################################################*/
	/* React life-cycle event.*/
	public componentDidMount(): void {
		console.log('Component Did Mount');
		this.callAPI('', 'GET', '/studyspace/availability-data');
		this.callTimeInterval();
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

	private callTimeInterval() {
		// console.log('reached interval');

		setInterval(() => {
			const libraryElements = document.querySelectorAll('.library');
			libraryElements.forEach((library: any, index: number) => {
				if (this.libraryVisibilityToggle) {
					if (index < 3) {
						library.classList.add('hide');
					} else {
						library.classList.remove('hide');
					}
				} else {
					if (index < 3) {
						library.classList.remove('hide');
					} else {
						library.classList.add('hide');
					}
				}
			});
			this.libraryVisibilityToggle = !this.libraryVisibilityToggle;
			console.log(libraryElements);
		}, 3000);
		// console.log(x);
	}
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
		this.setState({ spaceAvailability: result.data });
	};
	/* ########################################################*/

	private renderTimings() {
		if (this.state.spaceAvailability.length === 0) {
			return (
				<div>
					<div className="library">
						<ProgressBarComponent key={0} color="#7EFAFA" filled={100} />
						<span>{`Arch Music`}</span>
					</div>
					<div className="library">
						<ProgressBarComponent key={1} color="#FCB1FC" filled={100} />
						<span>{`Biol Sci`}</span>
					</div>
					<div className="library">
						<ProgressBarComponent key={2} color="#BCFA7E" filled={100} />
						<span>{`Central`}</span>
					</div>
					<div className="library hide">
						<ProgressBarComponent key={3} color="#FBB03B" filled={100} />
						<span>{`DHEngSci`}</span>
					</div>
					<div className="library hide">
						<ProgressBarComponent key={4} color="#EDE57E" filled={100} />
						<span>{`DuhigStudy`}</span>
					</div>
					<div className="library hide">
						<ProgressBarComponent key={5} color="#00D6CA" filled={100} />
						<span>{`Law Library`}</span>
					</div>
				</div>
			);
		} else {
			return (
				<div>
					{Object.keys(this.state.spaceAvailability).map(
						(key: any, index: number) => (
							<div className="library">
								{!this.nonStLuciaLibraries.includes(index) ? (
									<div>
										<ProgressBarComponent
											color={this.colorsList[index]}
											filled={this.state.spaceAvailability[key]}
										/>
										<span>{`${key} `}</span>
									</div>
								) : (
									''
								)}
							</div>
						),
					)}
				</div>
			);
		}
	}

	public render() {
		return (
			<section id={this.props.id} className="widget study">
				<div className="heading">
					<h2>UQ Study Spaces</h2>
					<figure></figure>
				</div>
				<div className="content">{this.renderTimings()}</div>
			</section>
		);
	}
}

export default StudyWidget;
