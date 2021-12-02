// Supplemental component:
const PointMarker = ({ breakInfo }) => {
    const [r, g, b] = breakInfo.color;
    return (
        <div className="legend-item" key={breakInfo.label}>
            <div
                className={breakInfo.style}
                style={{
                    height: `${breakInfo.size * 1}px`,
                    width: `${breakInfo.size * 1}px`,
                    borderColor: "rgb(0,0,0)",
                    backgroundColor: `rgb(${r},${g},${b})`,
                }}
            ></div>
            <div>{breakInfo.label}</div>
        </div>
    );
};

// Supplemental component:
const ChoroplethSymbol = ({ breakInfo }) => {
    const [r, g, b] = breakInfo.color;

    return (
        <div className={"legend-item"} key={breakInfo.label}>
            <div
                className={breakInfo.style}
                style={{
                    backgroundColor: `rgb(${r},${g},${b}`,
                }}
            >
                <div className="legend-item-label">{breakInfo.label}</div>
            </div>
        </div>
    );
};

// Main component for export:
const LegendItems = ({ drawingInfo }) => {
    if (drawingInfo.error) {
        return (
            <h6 className="legend-error-message">Unable to load legend data</h6>
        );
    }

    // Defining nested variable here for ease of use in JSX body:
    const itemStyle = drawingInfo.classBreakInfos[0].symbol.style;
    return drawingInfo.classBreakInfos.map((breakInfo) => {
        const data = {
            style: itemStyle,
            color: breakInfo.symbol.color,
            size: breakInfo.symbol.value,
            value: breakInfo.symbol.value,
            label: breakInfo.label,
        };
        if (itemStyle === "esriSMSCircle") {
            return <PointMarker key={data.value} breakInfo={data} />;
        }
        if (itemStyle === "esriSFSSolid") {
            return <ChoroplethSymbol key={data.label} breakInfo={data} />;
        }

        // TODO: fallback symbology?
        return null;
    });
};

export default LegendItems;
