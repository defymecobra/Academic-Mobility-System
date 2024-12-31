import React, { useState, useContext, useEffect } from 'react';
import './UpdateProfile.css';
import { SystemContext } from '../../Context/SystemContext';

const UpdateProfile = () => {
    const { profileData } = useContext(SystemContext);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        if (profileData) {
            setFirstName(profileData.firstName || '');
            setLastName(profileData.lastName || '');
            setOldPassword(profileData.password);
        }
    }, [profileData]);

    const validateForm = () => {
        const nameRegex = /^[A-Za-z]+$/;

        if (!nameRegex.test(firstName)) {
            alert("First Name must contain only letters!");
            return false;
        }

        if (!nameRegex.test(lastName)) {
            alert("Last Name must contain only letters!");
            return false;
        }

        if (password === oldPassword) {
            alert('New password cannot be the same as the current password!');
            return false;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const response = await fetch('http://localhost:4000/updateprofile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: profileData.email,
                firstName,
                lastName,
                password,
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Profile updated successfully!');
                    window.location.replace('/profile');
                } else {
                    alert(data.message || 'Failed to update profile.');
                }
            })
            .catch(error => console.error('Error:', error));
    };

    return (
        <div className="update-profile-container">
            <h2>Update Profile</h2>
            <form onSubmit={handleSubmit} className="update-profile-form">
                <div className="form-group">
                    <label>First Name</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Last Name</label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>New Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Confirm New Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="update-profile-btn">Update</button>
            </form>
        </div>
    );
};

export default UpdateProfile;
