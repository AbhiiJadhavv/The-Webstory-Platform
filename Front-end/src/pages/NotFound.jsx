import React from 'react'
import '../styles/NotFound.css'
import ErrorImage from '../assets/404-error.jpg'

function NotFound() {
  return (
    <div className='notFound'>
        <div className='notFoundContainer'>
            <div className='errorImageContainer'>
                <img className='errorImage' src={ErrorImage} alt="page not found"/>
            </div>
            <div className='pageNotFound'>
                <p>Page Not Found!</p>
            </div>
        </div>
    </div>
  )
}

export default NotFound;