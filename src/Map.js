import React from 'react';
import { MapContainer as LeafletMap, TileLayer } from 'react-leaflet';

import "./Map.css";
import { showDataOnMap } from './util';

function Map({countries, casesType,center, zoom, show }) {
    React.useEffect(() => {
        console.log(center);
    }, [center])
    return (
        <div className = "map">
            {show && 
                <LeafletMap center = {center} zoom = {zoom} scrollWheelZoom={false}>
                    <TileLayer 
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {showDataOnMap(countries, casesType)}
                </LeafletMap>
            }
        </div>
    )
}

export default Map;
