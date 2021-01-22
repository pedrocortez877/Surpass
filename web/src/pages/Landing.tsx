import React from 'react'

import '../css/styles/global.css'
import '../css/styles/pages/landing.css'

import { FiArrowRight } from 'react-icons/fi'
 
import logoImg from '../images/skate.svg'

import { Link } from 'react-router-dom'

function Landing(){
    return(
    <div id="page-landing">
      <div className="content-wrapper">
        <img src={logoImg} alt="Surpass"/>

        <main>
          <p>Encontre agora áreas voltadas para o esporte em sua região!</p>
        </main>

        <div className="location">
          <strong>Franca</strong>
          <span>São Paulo</span>
        </div>

        <Link to="/app" className="enter">
          <FiArrowRight size={26} color="rgba(255, 255, 255, 0.6)"/>
        </Link>
      </div>
    </div>
    );
}

export default Landing;