import React from 'react';
import Slider from './Slider2';
import Listb from './Listbar';
import '../scss/video.scss'
//12

const Video = () => {

  return (
    <div className="video-container">
      <Listb />
      <div className='video-main'>
        <video className='video' autoPlay loop muted>
          <source src="./video.mp4" type="video/mp4" />
        </video>
        <div className="video-text">
          <h1>이젠 음악을 눈으로도 시청해보세요.</h1>
          <span className="arrow">↓</span>
        </div>
        <Slider/>
      </div>
    </div>
  );
}

export default Video;