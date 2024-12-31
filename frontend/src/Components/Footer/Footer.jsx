import React from 'react'
import './Footer.css'
import footer_logo from '../Assets/logo.png'

const Footer = () => {
  return (
    <div className='footer'>
      <div className="footer-logo">
        <img src={footer_logo} alt="" />
        <p>Academic Mobility System</p>
      </div>
      <div className="footer-copyright">
        <hr />
        <p>Copyright &copy; 2025 - All Rights Reserved</p>
      </div>
    </div>
  )
}

export default Footer
