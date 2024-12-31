import React, { useEffect, useState } from 'react';
import './ApplicationForms.css';
import cross_icon from '../../assets/cross_icon.png';
import tick_icon from '../../assets/tick_icon.png';
import download_icon from '../../assets/download_icon.png';
import deleteIcon from '../../assets/delete_icon.png';

const ApplicationForms = () => {
    const [applications, setApplications] = useState([]);

    const fetchApplications = async () => {
        const response = await fetch('http://localhost:4000/allapplications');
        const data = await response.json();
        setApplications(data);
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const removeApplication = async (id) => {
        await fetch('http://localhost:4000/removeapplication', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id })
        });
        fetchApplications();
    };

    const rejectApplication = async (id) => {
        await fetch('http://localhost:4000/rejectapp', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id })
        });
        fetchApplications();
    };

    const acceptApplication = async (id) => {
        await fetch('http://localhost:4000/acceptapp', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id })
        });
        fetchApplications();
    };

    const downloadFile = (url) => {
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = url.split('/').pop();
                link.click();
            })
            .catch(error => console.error('Error downloading file:', error));
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    return (
        <div className='application-list-container'>
            <h1 className='application-list-title'>Applications List</h1>
            <div className='application-list-header'>
                <p>First Name</p>
                <p>Last Name</p>
                <p>Phone</p>
                <p>University</p>
                <p>Program</p>
                <p>Start Date</p>
                <p>End Date</p>
                <p>Status</p>
                <p>Actions</p>
            </div>
            <div className='application-list-content'>
                {applications.map((app, index) => (
                    <div key={index} className='application-list-row'>
                        <p>{app.firstName}</p>
                        <p>{app.lastName}</p>
                        <p>{app.phone}</p>
                        <p>{app.university}</p>
                        <p>{app.program}</p>
                        <p>{formatDate(app.startDate)}</p>
                        <p>{formatDate(app.endDate)}</p>
                        <p className={`status-${app.status.toLowerCase()}`}>{app.status}</p>
                        <div className="application-list-actions">
                            <img
                                src={download_icon}
                                alt="Download"
                                className="application-list-icon"
                                onClick={() => downloadFile(app.motivationLetter)}
                            />
                            <img
                                src={tick_icon}
                                alt="Accept"
                                className="application-list-icon"
                                onClick={() => acceptApplication(app.id)}
                            />
                            <img
                                src={cross_icon}
                                alt="Reject"
                                className="application-list-icon"
                                onClick={() => rejectApplication(app.id)}
                            />
                            <img
                                src={deleteIcon}
                                alt="Delete"
                                className="application-list-icon"
                                onClick={() => removeApplication(app.id)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ApplicationForms;
