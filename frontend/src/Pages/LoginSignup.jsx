import React, { useState } from "react";
import './CSS/LoginSignup.css';

const LoginSignup = () => {
    const [state, setState] = useState("Login");
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        password: "",
        email: ""
    });

    const changeHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const nameRegex = /^[A-Za-z]+$/;

        if (state === "Login") {
            if (!formData.email || !formData.password) {
                alert("Email and Password are required!");
                return false;
            }
        } else {
            if (!emailRegex.test(formData.email)) {
                alert("Invalid email format!");
                return false;
            }
            if (!nameRegex.test(formData.firstName)) {
                alert("First Name must contain only letters!");
                return false;
            }
            if (!nameRegex.test(formData.lastName)) {
                alert("Last Name must contain only letters!");
                return false;
            }
            for (const key in formData) {
                if (!formData[key]) {
                    alert(`Field "${key.charAt(0).toUpperCase() + key.slice(1)}" is required!`);
                    return false;
                }
            }
        }
        return true;
    };

    const login = async () => {
        if (!validateForm()) return;

        console.log("Login exec", formData);
        let responseData;
        await fetch('http://localhost:4000/login', {
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
            console.log("Login success:", formData.email);
            localStorage.setItem('auth-token', responseData.token);
            localStorage.setItem('user-email', formData.email);
            window.location.replace("/");
        } else {
            alert(responseData.error);
        }
    }

    const signup = async () => {
        if (!validateForm()) return;

        console.log("Signup exec", formData);
        let responseData;
        await fetch('http://localhost:4000/signup', {
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
            console.log("Signup success:", formData.email);
            localStorage.setItem('auth-token', responseData.token);
            localStorage.setItem('user-email', formData.email);
            window.location.replace("/");
        } else {
            alert(responseData.error);
        }
    }

    return (
        <div className='loginsignup'>
            <div className="loginsignup-container">
                <h1>{state}</h1>
                <div className="loginsignup-fields">
                    {state === "Sign Up" ?
                        <>
                            <input name='firstName' value={formData.firstName} onChange={changeHandler} type="text" placeholder="First Name" />
                            <input name='lastName' value={formData.lastName} onChange={changeHandler} type="text" placeholder="Last Name" />
                        </>
                        : null}
                    <input name='email' value={formData.email} onChange={changeHandler} type="email" placeholder="Email Address" />
                    <input name='password' value={formData.password} onChange={changeHandler} type="password" placeholder="Password" />
                </div>
                <button onClick={() => { state === "Login" ? login() : signup() }}>Continue</button>
                {state === "Sign Up" ? <p className="loginsignup-login">Already have an account? <span onClick={() => { setState("Login") }}>Login here</span></p>
                    : <p className="loginsignup-login">Create an account? <span onClick={() => { setState("Sign Up") }}>Click here</span></p>}
            </div>
        </div>
    )
}

export default LoginSignup;
