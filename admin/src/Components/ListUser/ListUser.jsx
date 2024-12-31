import React, { useEffect, useState } from 'react';
import './ListUser.css';
import deleteIcon from '../../assets/delete_icon.png';

const UserList = () => {

    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        await fetch('http://localhost:4000/allusers')
            .then((res) => res.json())
            .then((data) => { setUsers(data); });
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    const removeUser = async (email) => {
        await fetch('http://localhost:4000/removeuser', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email })
        });
        await fetchUsers();
    };

    return (
        <div className='user-list-container'>
            <h1>Users List</h1>
            <div className='user-list-header'>
                <p>First Name</p>
                <p>Last Name</p>
                <p>Email</p>
                <p>Action</p>
            </div>
            <div className='user-list-content'>
                {users.map((user, index) => {
                    return (
                        <React.Fragment key={index}>
                            <div className='user-list-item'>
                                <p>{user.firstName}</p>
                                <p>{user.lastName}</p>
                                <p>{user.email}</p>
                                <img
                                    onClick={() => removeUser(user.email)}
                                    className='user-list-remove-icon'
                                    src={deleteIcon}
                                    alt="Remove"
                                />
                            </div>
                        </React.Fragment>
                    )
                })}
            </div>
        </div>
    );
}

export default UserList;
