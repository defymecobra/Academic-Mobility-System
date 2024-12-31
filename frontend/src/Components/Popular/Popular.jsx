import React, { useEffect, useState } from "react"
import './Popular.css'
import Item from "../Item/Item"

const Popular = () => {

    const [popularPrograms, setPopularPrograms] = useState([]);

    useEffect(() => {
        fetch('http://localhost:4000/popular')
            .then((response) => response.json())
            .then((data) => setPopularPrograms(data.data));
    }, [])

    return (
        <div className='popular'>
            <h1>POPULAR PPOGRAMS</h1>
            <hr />
            <div className="popular-item">
                {popularPrograms.map((item, i) => {
                    return <Item key={i} id={item.id} name={item.name} image={item.image} />
                })}
            </div>
        </div>
    )
}

export default Popular