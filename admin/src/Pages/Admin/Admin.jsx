import React from 'react'
import './Admin.css'
import Sidebar from '../../Components/Sidebar/Sidebar'
import { Routes, Route } from 'react-router-dom'
import AddProgram from '../../Components/AddProgram/AddProgram'
import ListProgram from '../../Components/ListProgram/ListProgram'
import ApplicationForms from '../../Components/ApplicationForms/ApplicationForms'
import ListUser from '../../Components/ListUser/ListUser'

const Admin = () => {
  return (
    <div className='admin'>
      <Sidebar />
      <Routes>
        <Route path='/listuser' element={<ListUser />} />
        <Route path='/addprogram' element={<AddProgram />} />
        <Route path='/listprogram' element={<ListProgram />} />
        <Route path='/applications' element={<ApplicationForms />} />
      </Routes>
    </div>
  )
}

export default Admin
