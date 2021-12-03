// Modules:
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import * as esri from "esri-leaflet";
import { renderToString } from "react-dom/server"; // used to stringify a React component to pass to esri for map popups, which require html represented as a string

// Supplemental component:
const CustomReactPopup = ({ feature }) => {
    return (
        <>
            <h3>
                <div className="popup-title">{feature.FullCounty} </div>
            </h3>

            <div className="popup-data-container">
                <div className="popup-field-header">
                    Asthma emergency department visits, per 10,000 population:
                </div>
                <div className="popup-field-value">
                    {feature.AgeAdjustedRate}
                </div>
            </div>
        </>
    );
};

// Main exported component:
const Layer = ({ setEsriLayer, setOpenPopup }) => {
    // Hooks:
    const map = useMap();

    // Effects:
    useEffect(() => {
        const addLayer = () => {
            // Create esri layer:
            const esriLayer = esri.featureLayer({
                id: "county-choropleth-asthma-ed-visits",
                zIndexPosition: "back",
                title: "Rate of Asthma ED Visits by County",
                yearKey: "Year",
                subtitle: "Age-adjusted rate, per 10,000 population",
                defaultVisible: true,
                sourceLayer: true,
                url: `${process.env.REACT_APP_MAP_SERVICE}/Asthma_EDVisits_County/MapServer/0`,
            });

            // add to map:
            esriLayer.addTo(map);

            // set layer data in App.js
            setEsriLayer(esriLayer);

            // on load/loading fn's:
            esriLayer.on({
                loading: () => {},
                load: (e) => {
                    if (!e.target._popup) {
                        esriLayer
                            .bindPopup(
                                ({ feature }) =>
                                    renderToString(
                                        <CustomReactPopup
                                            feature={feature.properties}
                                        />
                                    ),
                                { maxWidth: "auto" }
                            )
                            .on("popupopen", ({ layer: { feature } }) => {
                                setOpenPopup(feature);
                            })
                            .on("popupclose", () => {
                                setOpenPopup(null);
                            });
                    }
                },
            });
        };

        addLayer();
    }, [map, setEsriLayer, setOpenPopup]);
    return null;
};

export default Layer;
