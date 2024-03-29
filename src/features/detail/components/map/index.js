import { useMap } from 'react-leaflet/hooks';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';

/** ---------------------------------------------------------------------------------------------
 * Change the center position
 * Refernce: https://react-leaflet.js.org/docs/api-map/#usemap
 */
function MapComponent({ position }) {
  const map = useMap();
  map.setView(position);
  map.setZoom(15)
  return null;
}

function Map({ position }) {
  /** ---------------------------------------------------------------------------------------------
   * Custom Icon
   */
  const customIcon = new Icon({
    iconUrl: '/images/marker-icon.png',
    iconSize: [40, 40],
  });

  // ---------------------------------------------------------------------------------------------

  return (
    <>
      <MapContainer
        center={position}
        zoom={15}
        className="w-full h-40 ipad:h-72 mt-4 rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png"
        />
        <MapComponent position={position} />
        <Marker position={position} icon={customIcon}></Marker>
      </MapContainer>
    </>
  );
}

export default Map;
