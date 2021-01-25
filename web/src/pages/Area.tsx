import React, { useEffect, useState } from "react";
import { FaWhatsapp, FaPen, FaTimes } from "react-icons/fa";
import { FiClock, FiInfo } from "react-icons/fi";
import { Map, Marker, TileLayer } from "react-leaflet";
import { useHistory, useParams, Link } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import 'react-confirm-alert/src/react-confirm-alert.css';

import Sidebar from "../components/Sidebar";
import api from "../services/api";
import '../css/styles/pages/area.css';

import MapIcon from "../utils/mapIcon";

interface Area{
  id: number,
  latitude: number;
  longitude: number;
  name: string;
  contact: string;
  about: string;
  instructions: string;
  opening_hours: string;
  open_on_weekends: string;
  images: Array<{
    id: number;
    url: string;
  }>;
}

interface AreaParams{
  id: string;
}

export default function Area() {
  const history = useHistory();
  const params = useParams<AreaParams>();
  const [area, setArea] = useState<Area>();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

    useEffect(() => {
        api.get(`areas/${params.id}`).then(response => {
            setArea(response.data);
        })
    }, [params.id]);

    if(!area){
      return <p>Carregando...</p>
    }

    async function deleteArea () {
      const options = {
        title: 'Confirme sua ação',
        message: 'Tem certeza que deseja excluir essa area?',
        buttons: [
          {
            label: 'Yes',
            onClick: async () => {
              await api.delete(`areas/${params.id}`).then(() => {
                console.log("Excluido com sucesso!");
              }).catch(err => {
                alert("Faça o login!");
                history.push('/login');
              });
              history.push('/app');
              document.location.reload();
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
    <div id="page-area">
      <Sidebar />
      <main>
        <div className="area-details">
          <img src={area.images[activeImageIndex].url} alt={area.name} />
          <div className="images">
            {area.images.map((image, index) => {
              return(
                <button 
                  key={image.id} 
                  className={activeImageIndex === index ? 'active' : ''} 
                  type="button"
                  onClick={() => {
                    setActiveImageIndex(index);
                  }}
                >
                  <img src={image.url} alt={area.name} />
                </button>
              );
            })};
          </div>
          
          <div className="area-details-content">
            <h1>{area.name}</h1>
            <p>{area.about}</p>

            <div className="map-container">
              <Map 
                center={[area.latitude,area.longitude]} 
                zoom={16} 
                style={{ width: '100%', height: 280 }}
                dragging={false}
                touchZoom={false}
                zoomControl={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
              >
                <TileLayer 
                  url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
                />
                <Marker interactive={false} icon={MapIcon} position={[area.latitude,area.longitude]} />
              </Map>

              <footer>
                <a target="_blank" rel="noopener noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${area.latitude},${area.longitude}`}>Ver rotas no Google Maps</a>
              </footer>
            </div>

            <hr />

            <h2>Instruções para visita</h2>
            <p>{area.instructions}</p>

            <div className="open-details">
              <div className="hour">
                <FiClock size={32} color="#15B6D6" />
                Segunda à Sexta <br />
                {area.opening_hours}
              </div>
              { area.open_on_weekends ? (
                <div className="open-on-weekends">
                <FiInfo size={32} color="#39CC83" />
                Funciona <br />
                fim de semana
              </div>
              ) : (
                <div className="open-on-weekends dont-open">
                <FiInfo size={32} color="#FF669D" />
                Não funciona <br />
                fim de semana
              </div>
              ) }
            </div>

            <a href={`https://wa.me/${area.contact}`} target="__blank" className="contact-button">
              <FaWhatsapp size={20} color="#FFF" />
              Entrar em contato
            </a>

            <hr />
            
            <div className="area-edit">
              <Link to={`/update/${area.id}`} className="edit-button">
                <FaPen size={20} color="#ffffff" />
                Editar
              </Link>

              <button 
                type="button" 
                className="edit-button" 
                onClick={deleteArea}>
                <FaTimes size={20} color="#ec5f5f" />
                Excluir
              </button>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}