import React, { useContext, useEffect, useState } from "react";
import './ProfilePrograms.css';
import { SystemContext } from "../../Context/SystemContext";
import download_icon from '../Assets/download_icon.png';

const ProfilePrograms = () => {
    const { profileData, applications } = useContext(SystemContext);
    const [programImages, setProgramImages] = useState({});

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    useEffect(() => {
        const fetchProgramImages = async () => {
            const images = {};
            for (const app of applications) {
                if (!images[app.program]) {
                    try {
                        const response = await fetch(`http://localhost:4000/getprogram/${app.program}`);
                        const data = await response.json();
                        if (data.success) {
                            images[app.program] = data.programImage;
                        }
                    } catch (error) {
                        console.error("Error fetching program image:", error);
                    }
                }
            }
            setProgramImages(images);
        };

        if (applications.length > 0) {
            fetchProgramImages();
        }
    }, [applications]);

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

    return (
        <div className="profile-container">
            <div className="profile-section">
                <h2 className="profile-header">User Information</h2>
                <div className="profile-info">
                    <p><strong>First Name:</strong> {profileData.firstName}</p>
                    <p><strong>Last Name:</strong> {profileData.lastName}</p>
                    <p><strong>Email Address:</strong> {profileData.email}</p>
                    <button className="update-profile-btn" onClick={() => window.location.href = '/updateprofile'}>Update Profile</button>
                </div>
            </div>
            <div className="applications-section">
                <h2 className="applications-title">Submitted Applications</h2>
                <table className="profile-table">
                    <thead>
                        <tr>
                            <th>Program Image</th>
                            <th>Program Name</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Motivation Letter</th>
                            <th>Submission Date</th>
                            <th>University Name</th>
                            <th>Application Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications && applications.length > 0 ? (
                            applications.map((app) => (
                                <tr key={app.id}>
                                    <td>
                                        <div className="program-info">
                                            {programImages[app.program] && (
                                                <img src={programImages[app.program]} alt={app.program} className="program-image" />
                                            )}
                                        </div>
                                    </td>
                                    <td>{app.program}</td>
                                    <td>{formatDate(app.startDate)}</td>
                                    <td>{formatDate(app.endDate)}</td>
                                    <td>
                                        <img
                                            src={download_icon}
                                            alt="Download Motivation Letter"
                                            className="listorder-download-icon"
                                            onClick={() => downloadFile(app.motivationLetter)}
                                        />
                                    </td>
                                    <td>{formatDate(app.date)}</td>
                                    <td>{app.university}</td>
                                    <td className={`status ${app.status.toLowerCase()}`}>{app.status}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8">No applications found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProfilePrograms;
