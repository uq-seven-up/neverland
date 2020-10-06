import React from "react"
import {NavLink} from 'react-router-dom';

const Menu = () => {

return (


<div className='menu'>
    
    <div className='poll'>
    <NavLink to='/PollView'><figure></figure></NavLink>
    </div>

    <div className='game'>
    <NavLink to='/GameClient'><figure></figure></NavLink>
    </div>
</div>
);
}   	

export default Menu
