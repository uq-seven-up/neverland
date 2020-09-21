import React, {Component} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import PollView from './component/PollView'
import FrontPage from './component/FrontPage'
import Menu from './component/Menu'
import GameClient from './component/GameClient'

class App extends Component {
render() {
return(
  <BrowserRouter>
  <div>
    <Menu />
    <Switch>
      <Route path="/" component={FrontPage} exact/>
      <Route path="/PollView" component={PollView} />
      <Route path="/GameClient" component={GameClient} />
    </Switch>
  </div>
  </BrowserRouter>
)
}
}


// function App() {
//   return (
//     <>

//     <FrontPage />
//     <Menu />

//     <Switch>
//       <Route exact path="/PollView" component ={PollView} />
//       <Route exaxt path="/">
//         <Redirect to="PollView" />
//       </Route>
//       <Route exact path="/GameClient" component={GameClient} />
//     </Switch>
    
//     </> 
//   );
// }


export default App;
