import React from "react"
import {NavLink} from 'react-router-dom';


const Menu = () => {

return (


<nav className='menu'>

    <div className='poll'>
    <NavLink to='/PollView' className='inactive' activeClassName="active"><figure></figure>
    <h1>poll</h1>
    </NavLink>
    </div>
    
    <div className='game'>
    <NavLink to='/GameClient'className='inactive' activeClassName="active"><figure></figure>
    <h1>game</h1>
    </NavLink>
    </div>

</nav>
);
}   	

export default Menu
