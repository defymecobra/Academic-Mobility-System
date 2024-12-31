import React from 'react';
import './Navbar.css';
import logo from '../../assets/logo.png';

const Navbar = () => {
  return (
    <div className='navbar'>
      <div className='nav-left'>
        <div className='nav-logo'>
          <img src={logo} alt="Logo" className='nav-logo-img' />
          <p>Academic Mobility System</p>
        </div>
      </div>
      <div className='nav-right'>
        <p>Admin Panel</p>
      </div>

    </div>
  )
}

export default Navbar;
