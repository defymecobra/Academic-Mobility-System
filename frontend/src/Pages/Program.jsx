import React, { useContext } from 'react'
import { SystemContext } from '../Context/SystemContext'
import { useParams } from "react-router-dom"
import ProgramDisplay from '../Components/ProgramDisplay/ProgramDisplay'

const Program = () => {
  const { all_program } = useContext(SystemContext);
  const { programId } = useParams();
  const program = all_program.find((e) => e.id === Number(programId));
  return (
    <div>
      <ProgramDisplay program={program} />
    </div>
  )
}

export default Program
