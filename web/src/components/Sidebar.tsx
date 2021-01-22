import React from 'react';
import { useHistory } from 'react-router-dom';

import mapMarkerImg from '../images/icon.svg';

import { FiArrowLeft } from "react-icons/fi";

import '../css/styles/components/Sidebar.css'

export default function Sidebar(){
    const { goBack } = useHistory();
    return(
        <aside className="app-sidebar">
            <img src={mapMarkerImg} alt="Surpass" />

            <footer>
            <button type="button" onClick={goBack}>
                <FiArrowLeft size={24} color="#FFF" />
            </button>
            </footer>
        </aside>
    );
}