import React, { FormEvent, useEffect, useState } from "react";
import { Map, Marker, TileLayer } from 'react-leaflet';
import { useHistory, useParams } from "react-router-dom";
import { LeafletMouseEvent } from 'leaflet' 
import { confirmAlert } from "react-confirm-alert";
import 'react-confirm-alert/src/react-confirm-alert.css';

import '../css/styles/pages/update-area.css';
import Sidebar from "../components/Sidebar";
import MapIcon from "../utils/mapIcon";
import api from "../services/api";

interface Area{
    latitude: number;
    longitude: number;
    name: string;
    about: string;
    instructions: string;
    opening_hours: string;
    open_on_weekends: string;
}

interface AreaParams{
    id: string;
}

export default function UpdateArea() {
    const history = useHistory();
    const params = useParams<AreaParams>();
    const [area, setArea] = useState<Area>();

    const[about, setAbout] = useState('');
    const[instructions, setInstructions] = useState('');
    const[position, setPosition] = useState({latitude: 0, longitude: 0});
    const[name, setName] = useState('');
    const[open_on_weekends, setOpenOnWeekends] = useState(false);
    const[opening_hours, setOpeningHours] = useState('');

    useEffect(() => {
        api.get(`areas/${params.id}`).then(response => {
          setArea(response.data);
          setPosition({
            latitude: response.data.latitude,
            longitude: response.data.longitude
          });
          setAbout(response.data.about);
          setInstructions(response.data.instructions);
          setName(response.data.name);
          setOpeningHours(response.data.opening_hours);
        });
    },[params.id]);

    if(!area){
        return <p>Carregando...</p>
    }

  function handeMapClick(event: LeafletMouseEvent){
    const { lat, lng } = event.latlng;

    setPosition({
      latitude: lat,
      longitude: lng
    });
  }

  async function  updateArea(event: FormEvent){
    event.preventDefault();

    const { latitude, longitude } = position;

    const data = {
      name: name,
      about: about,
      latitude: latitude,
      longitude: longitude,
      instructions: instructions,
      opening_hours: opening_hours,
      open_on_weekends: String(open_on_weekends)
    };

    const options = {
      title: 'Confirme sua ação',
      message: 'Tem certeza que deseja alterar essa area?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            await api.put(`areas/${params.id}`, data).then(() => {
              alert("Sucesso em alterar!");
            }).catch(err => {
              console.log("Erro: ", err);
              history.push('/login');
            });
          }
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ],
      childrenElement: () => <div />,
      closeOnEscape: true,
      closeOnClickOutside: true,
      willUnmount: () => {},
      afterClose: () => {},
      onClickOutside: () => {},
      onKeypressEscape: () => {}
    };

    confirmAlert(options);
  }

  return (
    <div id="page-update-area">
      <Sidebar/>

      <main>
        <form onSubmit={updateArea} className="update-area-form">
          <fieldset>
            <legend>Dados</legend>

            <Map 
              center={[-20.5382619,-47.4012526]} 
              style={{ width: '100%', height: 280 }}
              zoom={15}
              onclick={handeMapClick}
            >
              <TileLayer 
                url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
              />
              
              { position.latitude !== 0 && (
                <Marker 
                  interactive={false} 
                  icon={MapIcon} 
                  position={[position.latitude,position.longitude]}
                 />
              )
              }

              {/*  */}
            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input id="name" value={name} onChange={event => setName(event.target.value)}/>
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea id="name" maxLength={300} value={about} onChange={event => setAbout(event.target.value)} />
            </div>

          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea id="instructions" value={instructions} onChange={event => setInstructions(event.target.value)}/>
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de funcionamento</label>
              <input id="opening_hours" value={opening_hours} onChange={event => setOpeningHours(event.target.value)}/>
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Funciona fim de semana</label>

              <div className="button-select">
                <button type="button" className={open_on_weekends ? 'active' : ''} onClick={() => setOpenOnWeekends(true)}>Sim</button>
                <button type="button" className={!open_on_weekends ? 'active' : ''} onClick={() => setOpenOnWeekends(false)}>Não</button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}
