import React, { FormEvent, useState } from "react";
import { Map, Marker, TileLayer } from 'react-leaflet';
import { useHistory } from "react-router-dom";
import { LeafletMouseEvent } from 'leaflet' 

import { FiPlus } from "react-icons/fi";

import '../css/styles/pages/create-area.css';
import Sidebar from "../components/Sidebar";
import MapIcon from "../utils/mapIcon";
import api from "../services/api";

export default function CreateArea() {
  const history = useHistory();
  const[position, setPosition] = useState({latitude: 0, longitude: 0})

  const[warningFormName, setWarningFormName] = useState('');
  const[warningFormMap, setWarningFormMap] = useState('');
  const[warningFormAbout, setWarningFormAbout] = useState('');
  const[warningFormInstructions, setWarningFormInstructions] = useState('');
  const[warningFormImages, setWarningFormImages] = useState('');
  const[warningFormOpeningHours, setWarningFormOpeningHours] = useState('');
  const[warningFormContact, setWarningFormContact] = useState('');


  const[name, setName] = useState('');
  const[contact, setContact] = useState('');
  const[about, setAbout] = useState('');
  const[instructions, setInstructions] = useState('');
  const[opening_hours, setOpeningHours] = useState('');
  const[open_on_weekends, setOpenOnWeekends] = useState(true);
  const[images, setImages] = useState<File[]>([]);
  const[previewImages, setPreviewImages] = useState<string[]>([]);

  function handeMapClick(event: LeafletMouseEvent){
    const { lat, lng } = event.latlng;

    setPosition({
      latitude: lat,
      longitude: lng
    });
  }

  const handleSelectImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return

    const selectedImages = Array.from(e.target.files)
    setImages(images => [...images, ...selectedImages])

    const selectedImagesPreview = selectedImages.map(image => URL.createObjectURL(image))
    setPreviewImages(previews => [...previews, ...selectedImagesPreview])
  }
 
  async function  handleSubmit(event: FormEvent){
    event.preventDefault();

    const { latitude, longitude } = position;

    const data = new FormData();

    data.append('name', name);
    data.append('contact', contact);
    data.append('about', about);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('instructions', instructions);
    data.append('opening_hours', opening_hours);
    data.append('open_on_weekends', String(open_on_weekends));
    
    images.forEach(image => {
      data.append('images', image)
    });

    if(validate()){
      await api.post('areas', data).then(() => {
        history.push('/app');
      }).catch(() => {
        alert("Faça o login");
        history.push('/login');
      });
    }

    function validate(){
      let isValid = true;
      let regexp = /^[0-9\b]+$/;
  
      if(!opening_hours){
        isValid = false;
        setWarningFormOpeningHours("Informe o horario de funcionamento desta area");
        document.getElementById("opening_hours")?.focus();
      }

      if(!instructions){
        isValid = false;
        setWarningFormInstructions("Informe as intruções de visita");
        document.getElementById("instructions")?.focus();
      }
  

      if(images.length === 0){
        isValid = false;
        setWarningFormImages("Insira pelo menos 1 foto");
        document.getElementById("about")?.focus();
      }

      if(!about){
        isValid = false;
        setWarningFormAbout("Escreva um pouco sobre esta area");
        document.getElementById("about")?.focus();
      }

      if(!contact || contact.length < 11){
        isValid = false;
        setWarningFormContact("Informe um contato válido");
        document.getElementById("contact")?.focus();
      }

      if(!regexp.test(contact)){
        isValid = false;
        setWarningFormContact("Somente números por favor!");
        document.getElementById("contact")?.focus();
      }
              
      if(!name){
        isValid = false;
        setWarningFormName("Informe um nome");
        document.getElementById("name")?.focus();
      }

      if(!position.latitude  && !position.longitude){
        isValid = false;
        setWarningFormMap("Informe uma posição no mapa");
        window.scrollTo(0,0);
      }

      return isValid;
    }

    
  }

  return (
    <div id="page-create-area">
      <Sidebar/>

      <main>
        <form onSubmit={handleSubmit} className="create-area-form">
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

            <div className="warning">
              {warningFormMap}
            </div>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input id="name" value={name} onChange={event => setName(event.target.value)}/>
            </div>

            <div className="warning">
              {warningFormName}
            </div>

            <div className="input-block">
              <label htmlFor="contact">Contato</label>
              <input id="contact" type="text" value={contact} onChange={event => setContact(event.target.value)}/>
            </div>

            <div className="warning">
              {warningFormContact}
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea id="about" maxLength={300} value={about} onChange={event => setAbout(event.target.value)} />
            </div>

            <div className="warning">
              {warningFormAbout}
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">
                {previewImages.map(image => {
                  return(
                    <img key={image} src={image} alt={name}/>
                  );
                })}

                <label htmlFor="image[]" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
              </div>         

              <input type="file" id="image[]" multiple onChange={handleSelectImages} /> 

            </div>

            <div className="warning">
              {warningFormImages}
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea id="instructions" value={instructions} onChange={event => setInstructions(event.target.value)}/>
            </div>

            <div className="warning">
              {warningFormInstructions}
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de funcionamento</label>
              <input id="opening_hours" value={opening_hours} onChange={event => setOpeningHours(event.target.value)}/>
            </div>

            <div className="warning">
              {warningFormOpeningHours}
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
