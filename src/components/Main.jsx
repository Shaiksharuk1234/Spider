import React from 'react'
import videoBg from '../Assets/video-2.mp4'

function Main() {
  return (
    <div className='Main'>
        <video src={videoBg} autoPlay loop muted/>
        <div className='Content'>
            <h1>Welcome</h1>
            <p>To my site.</p>
            <p>Sharuk represents here!</p>
        </div>
    </div>
  )
}

export default Main
