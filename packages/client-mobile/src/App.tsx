import React, {Component} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import PollView from './component/PollView'
import Menu from './component/Menu'
import GameClient from './component/GameClient'

class App extends Component {
	render() {
		return(
			<BrowserRouter>
				<div>
					<Menu />
					<Switch>
						<Route path="/client-mobile" component={PollView} exact/>
						<Route path="/client-mobile/PollView" component={PollView} />
						<Route path="/client-mobile/GameClient" component={GameClient} />
					</Switch>
				</div>
			</BrowserRouter>
		)
	}
}

export default App;
