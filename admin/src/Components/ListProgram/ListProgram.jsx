import React, { useEffect, useState } from 'react';
import './ListProgram.css';
import delete_icon from '../../assets/delete_icon.png';

const ListProgram = () => {
    const [allPrograms, setAllPrograms] = useState([]);

    const fetchPrograms = async () => {
        await fetch('http://localhost:4000/allprograms')
            .then((res) => res.json())
            .then((data) => { setAllPrograms(data) });
    };

    useEffect(() => {
        fetchPrograms();
    }, []);

    const removeProgram = async (id) => {
        await fetch('http://localhost:4000/removeprogram', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id })
        });
        await fetchPrograms();
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    return (
        <div className='program-list-container'>
            <h1 className='program-list-title'>Program List</h1>

            <div className='program-list-header'>
                <p>Image</p>
                <p>Title</p>
                <p>Description</p>
                <p>Participants</p>
                <p>Start Date</p>
                <p>End Date</p>
                <p>Action</p>
            </div>
            <div className='program-list-scroll'>
                {allPrograms.map((program, index) => (
                    <React.Fragment key={index}>
                        <div className='program-list-item'>
                            <img src={program.image} alt="Program" className='program-list-image' />
                            <p>{program.name}</p>
                            <p>{program.description}</p>
                            <p>{program.participants}</p>
                            <p>{formatDate(program.startDate)}</p>
                            <p>{formatDate(program.endDate)}</p>
                            <div className="program-list-action">
                                <img
                                    onClick={() => { removeProgram(program.id) }}
                                    className='program-list-remove-icon'
                                    src={delete_icon}
                                    alt="Remove"
                                />
                            </div>
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default ListProgram;
