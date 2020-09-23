import React from "react"
import {NavLink} from 'react-router-dom';

const Menu = () => {

return (

<div className='section2'>
    <div className='box4'>
    <NavLink to='/PollView'><figure></figure></NavLink>
    </div>
    <div className='box5'>
    <NavLink to='/GameClient'><figure></figure></NavLink>
    </div>
</div>
);
}   	

export default Menu
