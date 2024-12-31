import React, { useState } from 'react';
import './AddProgram.css';
import upload_area from '../../assets/upload_area.svg';

const AddProgram = () => {
    const [image, setImage] = useState(false);
    const [programDetails, setProgramDetails] = useState({
        name: "",
        image: "",
        description: "",
        participants: 0,
        startDate: "",
        endDate: ""
    });

    const imageHandler = (e) => {
        const file = e.target.files[0];
        const allowedTypes = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];

        if (file && allowedTypes.includes(file.type)) {
            setImage(file);
        } else {
            alert("Invalid file type. Only PNG, JPG, WEBP, and SVG are allowed.");
        }
    };

    const changeHandler = (e) => {
        setProgramDetails({ ...programDetails, [e.target.name]: e.target.value });
    };

    const Add_Program = async () => {
        // Check for empty fields
        if (!programDetails.name || !programDetails.description || !programDetails.startDate || !programDetails.endDate || !image) {
            alert("All fields are required.");
            return;
        }

        // Check date validation
        if (new Date(programDetails.startDate) > new Date(programDetails.endDate)) {
            alert("Start date cannot be later than end date.");
            return;
        }

        console.log(programDetails);
        let responseData;
        let program = programDetails;

        let formData = new FormData();
        formData.append('program', image);

        await fetch('http://localhost:4000/upload', {
            method: 'POST',
            headers: {
                Accept: 'application/json'
            },
            body: formData,
        })
            .then((resp) => resp.json())
            .then((data) => { responseData = data });

        if (responseData.success) {
            program.image = responseData.image_url;
            console.log(program);
            await fetch('http://localhost:4000/addprogram', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(program),
            })
                .then((resp) => resp.json())
                .then((data) => {
                    data.success ? alert("Program Added") : alert("Failed");
                });
        }
    };

    return (
        <div className='add-program-container'>
            <h1 className="add-program-title">Add New Program</h1>
            <div className='add-program-form'>
                <div className='add-program-field'>
                    <p>Program Name</p>
                    <input value={programDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Enter program name' />
                </div>
                <div className='add-program-field'>
                    <p>Description</p>
                    <textarea value={programDetails.description} onChange={changeHandler} name="description" placeholder='Enter description'></textarea>
                </div>
                <div className='add-program-dates'>
                    <div className='add-program-field'>
                        <p>Start Date</p>
                        <input value={programDetails.startDate} onChange={changeHandler} type="date" name="startDate" />
                    </div>
                    <div className='add-program-field'>
                        <p>End Date</p>
                        <input value={programDetails.endDate} onChange={changeHandler} type="date" name="endDate" />
                    </div>
                </div>
                <div className='add-program-upload'>
                    <label htmlFor="file-input">
                        <img src={image ? URL.createObjectURL(image) : upload_area} className='add-program-thumbnail' alt="Upload" />
                    </label>
                    <input onChange={imageHandler} type="file" name='image' id='file-input' hidden />
                </div>
                <button onClick={Add_Program} className='add-program-button'>ADD PROGRAM</button>
            </div>
        </div>
    );
};

export default AddProgram;
