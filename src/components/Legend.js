// Components:
import LegendItems from "./LegendItems";

const Legend = ({ esriLayer, drawingInfo }) => {
    const { options } = esriLayer || {};
    return (
        <>
            {options ? (
                <div key={options.id} className="fixed-legend-item">
                    <div>
                        <div className="fixed-layer-plate">
                            <div className="layer-title">{options.title}</div>
                            <small className="layer-subtitle">
                                {`${options.subtitle} ${
                                    options.layerYear
                                        ? ` (${options.layerYear})`
                                        : ""
                                }`}
                            </small>
                            <div className="legend-items-container">
                                {drawingInfo ? (
                                    // <LegendItems layer={layer} layerOn />
                                    <LegendItems
                                        drawingInfo={drawingInfo.renderer}
                                    />
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
};

export default Legend;
