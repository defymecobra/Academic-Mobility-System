import React, { useRef, useState } from 'react'
import './Navbar.css'
import logo from '../Assets/logo.png'
import profile_icon from '../Assets/profile_icon.png'
import { Link } from 'react-router-dom'
import nav_dropdown from '../Assets/dropdown_icon.png'

const Navbar = () => {

    const [menu, setMenu] = useState("home")
    const menuRef = useRef();

    const dropdown_toogle = (e) => {
        menuRef.current.classList.toggle('nav-menu-visible');
        e.target.classList.toggle('open');
    }

    return (
        <div className='navbar'>
            <div className='nav-logo'>
                <img src={logo} alt="" className='nav-logo-img' />
                <p>Academic Mobility System</p>
            </div>
            <img className='nav-dropdown' onClick={dropdown_toogle} src={nav_dropdown} alt="" />
            <ul ref={menuRef} className="nav-menu">
                <li onClick={() => { setMenu("home") }}><Link style={{ textDecoration: 'none', color: 'white' }} to='/'>Home</Link>{menu === "home" ? <hr /> : <></>}</li>
                <li onClick={() => { setMenu("programs") }}><Link style={{ textDecoration: 'none', color: 'white' }} to='/programs'>Programs</Link>{menu === "programs" ? <hr /> : <></>}</li>
            </ul>
            <div className="nav-login-profile">
                {localStorage.getItem('auth-token') ? (
                    <>
                        <button onClick={() => {
                            localStorage.removeItem('auth-token');
                            window.location.replace("/");
                        }}>Log out
                        </button>
                        <ul ref={menuRef} className="nav-menu">
                            <li onClick={() => { setMenu("profile") }}><Link to='/profile'><img src={profile_icon} alt="Profile" /></Link></li>
                        </ul>
                    </>
                ) : (
                    <Link to='/login'><button>Login</button></Link>
                )}
            </div>
        </div>
    )
}

export default Navbar