import React, { useContext } from "react";
import "./ProgramDisplay.css";
import { SystemContext } from "../../Context/SystemContext";

const ProgramDisplay = (props) => {

    const { program } = props;

    const handleApplyForm = () => {
        if (!localStorage.getItem('auth-token')) {
            window.location.replace("/login");
            return;
        }
        else {
            window.location.replace(`/app-form/${program.id}`)
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    return (
        <div className="programdisplay">
            <div className="programdisplay-left">
                <div className="programdisplay-img">
                    <img
                        className="programdisplay-main-img"
                        src={program.image}
                        alt=""
                    />
                </div>
            </div>
            <div className="programdisplay-right">
                <h1>{program.name}</h1>
                <div className="programdisplay-right-description">
                    <p>Number of students who participated: {program.participants}</p>
                </div>
                <div className="programdisplay-right-description">
                    <p>Description: {program.description}</p>
                </div>
                <div className="programdisplay-right-description">
                    <p>Date of the beginning: {formatDate(program.startDate)}</p>
                </div>
                <div className="programdisplay-right-description">
                    <p>Date of the end: {formatDate(program.endDate)}</p>
                </div>
                <button onClick={() => { handleApplyForm() }}>
                    SEND APPLICATION FORM
                </button>
            </div>
        </div>
    );
};

export default ProgramDisplay;
