import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import './CSS/ApplicationForm.css';

const ApplicationForm = () => {
    const { programId } = useParams();
    const [file, setFile] = useState(null);
    const [previewFile, setPreviewFile] = useState(null);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        university: "",
        program: "",
        startDate: "",
        endDate: "",
        motivationLetter: "",
        status: "Pending"
    });

    const fileHandler = async (e) => {
        const selectedFile = e.target.files[0];
        const validExtensions = ["doc", "docx", "pdf"];
        const fileExtension = selectedFile.name.split('.').pop().toLowerCase();

        if (!validExtensions.includes(fileExtension)) {
            alert("File must be in .doc, .docx, or .pdf format");
            return;
        }

        setFile(selectedFile);
        setPreviewFile(selectedFile.name);

        let responseData;
        let formDataUpload = new FormData();
        formDataUpload.append('letter', selectedFile);

        await fetch('http://localhost:4000/uploadletter', {
            method: 'POST',
            headers: {
                Accept: 'application/json'
            },
            body: formDataUpload,
        })
            .then((resp) => resp.json())
            .then((data) => responseData = data);

        if (responseData.success) {
            setFormData((prev) => ({ ...prev, motivationLetter: responseData.letter_url }));
        } else {
            alert("Failed to upload letter");
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    useEffect(() => {
        if (localStorage.getItem('auth-token')) {
            fetch('http://localhost:4000/getprofile', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    setFormData((prev) => ({
                        ...prev,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email
                    }));
                })
                .catch((error) => console.error("Error fetching user data:", error));
        }

        const fetchProgramName = async () => {
            try {
                const response = await fetch(`http://localhost:4000/getprogramId/${programId}`);
                const data = await response.json();
                if (data.success) {
                    setFormData((prev) => ({
                        ...prev,
                        program: data.programName,
                        startDate: data.programStartDate,
                        endDate: data.programEndDate
                    }));
                } else {
                    alert("Program not found");
                }
            } catch (error) {
                console.error("Error fetching program data:", error);
            }
        };

        if (programId) {
            fetchProgramName();
        }
    }, [programId]);

    const apply = async () => {
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(formData.phone)) {
            alert("Phone number must contain exactly 10 digits");
            return;
        }

        for (const key in formData) {
            if (formData[key] === "" || formData[key] === null) {
                alert(`Field "${key.charAt(0).toUpperCase() + key.slice(1)}" is required!`);
                return;
            }
        }

        let responseData;
        await fetch('http://localhost:4000/addapplication', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => responseData = data);

        if (responseData.success) {
            alert("Form successfully submitted!");
            window.location.replace("/profile");
        } else {
            alert(responseData.error);
        }
    };

    const handleFileSelect = () => {
        document.getElementById('file-input').click();
    };

    return (
        <div className="application-form">
            <div className="application-form-container">
                <h1 className="application-form-title">Application Form</h1>
                <div className="application-form-fields">
                    <div className="application-form-fields">
                        <input
                            name="firstName"
                            value={formData.firstName}
                            type="text"
                            readOnly
                            placeholder="First Name"
                            className={formData.firstName ? "filled" : ""}
                        />
                        <input
                            name="lastName"
                            value={formData.lastName}
                            type="text"
                            readOnly
                            placeholder="Last Name"
                            className={formData.lastName ? "filled" : ""}
                        />
                        <input
                            name="email"
                            value={formData.email}
                            type="email"
                            readOnly
                            placeholder="Email"
                            className={formData.email ? "filled" : ""}
                        />
                        <input
                            name="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            type="text"
                            placeholder="Phone"
                            className={formData.phone ? "filled" : ""}
                        />
                        <input
                            name="university"
                            value={formData.university}
                            onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                            type="text"
                            placeholder="University"
                            className={formData.university ? "filled" : ""}
                        />
                        <input
                            name="program"
                            value={formData.program}
                            type="text"
                            readOnly
                            placeholder="Program"
                            className={formData.program ? "filled" : ""}
                        />
                        <input
                            name="startDate"
                            value={formatDate(formData.startDate)}
                            type="text"
                            readOnly
                            placeholder="Start Date"
                            className={formData.startDate ? "filled" : ""}
                        />
                        <input
                            name="endDate"
                            value={formatDate(formData.endDate)}
                            type="text"
                            readOnly
                            placeholder="End Date"
                            className={formData.endDate ? "filled" : ""}
                        />
                    </div>
                    <div className="application-form-upload" onClick={handleFileSelect}>
                        {previewFile || "Click to upload motivational letter"}
                    </div>
                    <input type="file" id="file-input" hidden onChange={fileHandler} />
                </div>
                <button className="application-form-button" onClick={apply}>
                    Submit Application
                </button>
                <p className="application-form-note">All fields are required</p>
            </div>
        </div>
    )
}

export default ApplicationForm;
