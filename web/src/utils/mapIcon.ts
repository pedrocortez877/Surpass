import mapMarkerImg from '../images/location.svg';
import L from 'leaflet';

const MapIcon = L.icon({
    iconUrl: mapMarkerImg,

    iconSize: [38, 38],
    iconAnchor: [29, 68],
    popupAnchor: [0, -60]
});

  export default MapIcon;