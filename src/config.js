const config = {
    stateBounds: [
        [39.74, -75.17],
        [37.91, -79.48],
    ],
    defaultMapZoom: 7,
    countyACSEndpoint: `${process.env.REACT_APP_MAP_SERVICE}/DemographicProfile/MapServer/0/query?outFields=*&returnGeometry=false&f=json&where=MDCode%3D`,
    raceDataLabels: [
        "White",
        "Black",
        "Asian",
        "Hispanic",
        "Other",
        "Two or more",
    ],
    piePalette: {
        default: [
            "rgb(120, 141, 192)",
            "rgb(75, 109, 94)",
            "rgb(156, 70, 113)",
            "rgb(187, 118, 75)",
            "rgb(215, 182, 107)",
            "rgb(114, 101, 171)",
        ],
        hover: [
            "rgb(100, 121, 172)",
            "rgb(55, 89, 74)",
            "rgb(136, 50, 93)",
            "rgb(167, 98, 55)",
            "rgb(195, 162, 87)",
            "rgb(94, 81, 151)",
        ],
    },
    stackedBarsPalette: {
        default: [
            "rgb(129, 181, 175)",
            "rgb(70, 110, 118)",
            "rgb(211, 137, 119)",
            "rgb(158, 97, 97)",
        ],
        hover: [
            "rgb(119, 161, 155)",
            "rgb(50, 90, 98)",
            "rgb(191, 117, 99)",
            "rgb(138, 77, 77)",
        ],
    },
};

export default config;
