import React from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className='sidebar'>
            <Link to={'/listuser'} className='sidebar-link'>
                <div className='sidebar-item'>
                    <p>Users List</p>
                </div>
            </Link>
            <Link to={'/addprogram'} className='sidebar-link'>
                <div className='sidebar-item'>
                    <p>Create Program</p>
                </div>
            </Link>
            <Link to={'/listprogram'} className='sidebar-link'>
                <div className='sidebar-item'>
                    <p>Program List</p>
                </div>
            </Link>
            <Link to={'/applications'} className='sidebar-link'>
                <div className='sidebar-item'>
                    <p>Applications List</p>
                </div>
            </Link>
        </div>
    )
}

export default Sidebar;
