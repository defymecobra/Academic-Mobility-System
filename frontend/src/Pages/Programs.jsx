import React, { useContext } from "react"
import './CSS/Programs.css'
import { SystemContext } from '../Context/SystemContext'
import Item from '../Components/Item/Item.jsx'

const Programs = () => {
  const { all_program } = useContext(SystemContext);
  return (
    <div className='program'>
      <img className='program-banner' src={''} alt="" />
      <div className="program-view">
        {all_program.map((item, i) => {
          return <Item key={i} id={item.id} name={item.name} image={item.image} />
        })}
      </div>
    </div>
  )
}

export default Programs