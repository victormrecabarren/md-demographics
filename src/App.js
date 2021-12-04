//Modules:
import { useState, useEffect } from "react";
import "./App.css";

// Components:
import MapArea from "./components/MapArea";
import Legend from "./components/Legend";
import CommunityProfile from "./components/CommunityProfile";

// Config:
import config from "./config";

function App() {
    //State:
    const [esriLayer, setEsriLayer] = useState({});
    const [legendData, setLegendData] = useState();
    const [openPopup, setOpenPopup] = useState();

    // Effects:
    useEffect(() => {
        // fetch metadata from layer to create legend:
        fetch(config.asthmaService)
            .then((res) => res.json())
            .then((json) => {
                setLegendData(json.drawingInfo);
            })
            .catch((error) => {
                console.error("Error fetching legend data", error);
                setLegendData({ error });
            });
    }, []);
    return (
        <div className="App">
            <div className="sheet">
                <h1 className="app-header">
                    Emergency Department (ED) Visits for Asthma
                </h1>
                <div id="webMap">
                    <MapArea
                        setEsriLayer={setEsriLayer}
                        setOpenPopup={setOpenPopup}
                    />
                </div>
                <Legend esriLayer={esriLayer} drawingInfo={legendData} />
            </div>
            <div className="sheet">
                {openPopup ? <CommunityProfile openPopup={openPopup} /> : null}
            </div>
        </div>
    );
}

export default App;
