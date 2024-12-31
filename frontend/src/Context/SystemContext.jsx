import React, { createContext, useEffect, useState } from 'react';

export const SystemContext = createContext(null);

const SystemContextProvider = (props) => {
    const [all_program, setAll_Program] = useState([]);
    const [profileData, setProfileData] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        fetch('http://localhost:4000/allprograms')
            .then((response) => response.json())
            .then((data) => setAll_Program(data))

        if (localStorage.getItem('auth-token')) {
            fetch('http://localhost:4000/getprofile', {
                method: 'POST',
                headers: {
                    Accept: 'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: "",
            })
                .then((response) => response.json())
                .then((data) => setProfileData(data));


            fetch('http://localhost:4000/getprofileapplications', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: localStorage.getItem('user-email') }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        setApplications(data.data);
                    }
                })
                .catch((error) => console.error("Error fetching applications:", error));
        }

        const storedEmail = localStorage.getItem('user-email');
        if (storedEmail) {
            setUserEmail(storedEmail);
        }
    }, [])

    const getTotalProfilePrograms = () => {
        return applications.length;
    }

    const updateUserEmail = (email) => {
        setUserEmail(email);
    }

    const contextValue = {
        getTotalProfilePrograms,
        all_program,
        profileData,
        applications,
        updateUserEmail,
        userEmail,
    };

    return (
        <SystemContext.Provider value={contextValue}>
            {props.children}
        </SystemContext.Provider>
    )
}

export default SystemContextProvider;
