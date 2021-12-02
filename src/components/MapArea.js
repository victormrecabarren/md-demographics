// Modules:
import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, LayersControl } from "react-leaflet";

// Config:
import config from "../config";

// Components:
import Layer from "./Layer";

const MapArea = ({ setEsriLayer, setOpenPopup }) => {
    // Refs:
    const mapRef = useRef(); // assigning map container to ref, to access throughout component

    // Methods:
    const assignToRef = (map) => {
        mapRef.current = map;
        // Snaps view to default bounds (Maryland) for varying viewports:
        mapRef.current.on("load", () => {
            map.fitBounds([
                [40.712, -74.227],
                [40.774, -74.125],
            ]);
        });
    };

    // Cleanup for Map unmount:
    useEffect(() => {
        return () => {
            if (mapRef.current) {
                mapRef.current.off();
                mapRef.current.remove();
            }
        };
    }, []);

    return (
        <MapContainer
            bounds={config.stateBounds}
            zoom={config.defaultMapZoom}
            zoomSnap={0.5}
            scrollWheelZoom
            className="myMap"
            whenCreated={assignToRef}
        >
            <LayersControl position="bottomright">
                <LayersControl.BaseLayer checked name="World Topo">
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://services.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
                    />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="Light Gray">
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
                    />
                </LayersControl.BaseLayer>
            </LayersControl>
            <Layer setEsriLayer={setEsriLayer} setOpenPopup={setOpenPopup} />
        </MapContainer>
    );
};

export default MapArea;
