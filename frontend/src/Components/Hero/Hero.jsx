import React, { useState, useEffect } from "react";
import './Hero.css';
import slide1 from '../Assets/slide1.webp'
import slide2 from '../Assets/slide2.webp'
import slide3 from '../Assets/slide3.webp'

const slides = [
    {
        image: slide1,
        title: 'Intuitive Management Dashboard',
        description: 'Our system provides convenient access to managing student academic mobility. You can view applications, monitor program statuses, and receive real-time analytical reports.'
    },
    {
        image: slide2,
        title: 'Global Partnerships and Opportunities',
        description: 'The platform supports international partnerships, providing information about available programs in various countries. Interactive maps help visualize opportunities for students.'
    },
    {
        image: slide3,
        title: 'Transparent Application Process',
        description: 'Users can easily submit applications online, track the status of their documents, and receive notifications about results. Automated verification ensures data accuracy and quick decision-making.'
    }
];

const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className='hero'>
            <div className="hero-slide" style={{ backgroundImage: `url(${slides[currentSlide].image})` }}>
                <div className="hero-content">
                    <h2>{slides[currentSlide].title}</h2>
                    <p>{slides[currentSlide].description}</p>
                </div>
            </div>
        </div>
    );
};

export default Hero;