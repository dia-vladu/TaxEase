import React, { useEffect, useState } from 'react'
import { FaArrowRight } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import './PageContent.scss'

export default function PageContent() {

  const navigate = useNavigate();
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.pageYOffset || document.documentElement.scrollTop);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className='page-content'>
      <div className='sections'>
        <div className={`background ${scrollPosition > 0 ? 'parallax' : ''}`}>
          <div className='section' id='section1'>
            <h1>One single app<br />for all your taxes</h1>
            <p>Transform your tax payment experience into an<br />
              efficient and convenient process. Pay online, in a few clicks,<br />
              without stress or hassle.</p>
            <div>
              <button id='deschide-cont' onClick={() => { navigate("create-account") }}>
                Open an account for free
              </button>
            </div>
          </div>
        </div>
        <div className='section' id='section2'>
          <h1>Plan, pay and manage<br />smarter</h1>
          <p>We give you the freedom to manage your tax duties efficiently.</p>
          <div className='deschide-cont-div'>
            <div className='info-div'>
              <h1>Handle everything without stress</h1>
              <button onClick={() => { navigate("/create-account") }}>
                <span>Open Account</span>
                <FaArrowRight />
              </button>
            </div>
            <div className='deschide-cont-image' />
          </div>
          <div className='banner-group'>
            <div className='plateste-div'>
              <div className='div-content'>
                <h1>Pay directly online</h1>
                <div className='plateste-image' />
                <button onClick={() => { navigate("/pay") }}>
                  <span>Pay Now</span>
                  <FaArrowRight />
                </button>
              </div>
            </div>
            <div className='planifica-div'>
              <div className='div-content'>
                <h1>Schedule your payments</h1>
                <div className='planifica-image' />
                <button onClick={() => { navigate("/login") }}>
                  <span>Plan Now</span>
                  <FaArrowRight />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className='section' id='section3'>
          <div className="top-part">
            <h3>Let's partner up!</h3>
            <h1>Enroll in the app</h1>
            <p>Join our app and unlock digital benefits for your
              institution and the community you serve.</p>
          </div>
          <div className='banner-group'>
            <div className="vezi-institutii">
              <div className='div-content'>
                <h1>Enrolled Public Institutions</h1>
                <div className='vezi-institutii-image' />
                <button onClick={() => { navigate("/map-page") }}>
                  <span>See Institutions</span>
                  <FaArrowRight />
                </button>
              </div>
            </div>
            <div className="inrolare">
              <div className='div-content'>
                <h1>Join us now</h1>
                <div className='inrolare-image' />
                <button onClick={() => { navigate("/inregistrare") }}>
                  <span>Enroll</span>
                  <FaArrowRight />
                </button>
              </div>
            </div>
          </div>
          <div className="bottom-part">
            <h1>Join our users and avoid paperwork<br />
              by paying quickly, efficiently and hassle-free.</h1>
            <button onClick={() => { navigate("/create-account") }}>Let's Start</button>
          </div>
        </div>
      </div>
    </div>
  )
}
