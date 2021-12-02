import { useState, useEffect } from "react";
import "./App.css";

// Components:
import MapArea from "./components/MapArea";
import Legend from "./components/Legend";

function App() {
    //State:
    const [esriLayer, setEsriLayer] = useState({});
    const [legendData, setLegendData] = useState();
    const [openPopup, setOpenPopup] = useState();

    // Effects:
    useEffect(() => {
        // fetch metadata from layer to create legend:
        fetch(
            `${process.env.REACT_APP_MAP_SERVICE}/Asthma_EDVisits_County/MapServer/0/?f=json`
        )
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
            <div id="webMap">
                <MapArea
                    setEsriLayer={setEsriLayer}
                    setOpenPopup={setOpenPopup}
                />
                <Legend esriLayer={esriLayer} drawingInfo={legendData} />
            </div>
        </div>
    );
}

export default App;
