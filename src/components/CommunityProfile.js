// Modules:
import React, { useState, useRef, useEffect } from "react";
import { Pie, HorizontalBar } from "react-chartjs-2";

// Config:
import config from "../config";

const CommunityProfile = ({ openPopup }) => {
    // Refs:
    const pieRef = useRef();
    const barRef = useRef();

    // State:
    const [raceData, setRaceData] = useState({});
    const [ageData, setAgeData] = useState({});
    const [acsLink, setAcsLink] = useState("");
    const [state, setState] = useState({
        // Jurisdiction codes:
        MDCode: "",
        // General population variables:
        EstTotalPop: "",
        // Age variables:
        CalcPctFemaleTotalPop: "",
        CalcPctMaleTotalPop: "",
        CalcFemale0to19: "",
        CalcFemale20to44: "",
        CalcFemale45to64: "",
        CalcFemale65Plus: "",
        CalcMale0to19: "",
        CalcMale20to44: "",
        CalcMale45to64: "",
        CalcMale65Plus: "",
        // Race variables:
        CalcWhitePct: "",
        CalcBlackPct: "",
        CalcAsianPct: "",
        CalcHLPct: "",
        CalcOtherRacePct: "",
        CalcTwoOrMorePct: "",
        // Economic variables:
        EstHouseholdMedianIncomeDollars: "",
        EstPopBelowFedPovertyLvl: "",
        CalcPopBelowFedPovertyLvlPct: "",
        CalcPctEdAttain25PlusHSorHigher: "",
        EstUnempRateTotalPop16Plus: "",
    });

    // Effects:
    useEffect(() => {
        // Use appropriate endpoint and parameter value for county view
        const endpoint = `${config.countyACSEndpoint}%27${openPopup.properties.MDCode}%27`;

        // using acsLink to check if data has been fetched, to avoid unecessary network request.
        if (!acsLink) {
            fetch(endpoint)
                .then((res) => res.json())
                .then((json) => {
                    // Extracting the following nested variables with a fallback at each level to ensure a TypeError is not thrown. Destructure will expect either an array or an object -- if destructuring results in an `undefined` at any point, will fallback on the expected type.
                    const { features } = json || {};
                    const [feature] = features || [];
                    const { attributes } = feature || {};
                    const {
                        // Jurisdiction codes:
                        MDCode,
                        // Age variables:
                        CalcFemale0to19,
                        CalcFemale20to44,
                        CalcFemale45to64,
                        CalcFemale65Plus,
                        CalcMale0to19,
                        CalcMale20to44,
                        CalcMale45to64,
                        CalcMale65Plus,
                        // Race variables:
                        CalcWhitePct,
                        CalcBlackPct,
                        CalcAsianPct,
                        CalcHLPct,
                        CalcOtherRacePct,
                        CalcTwoOrMorePct,
                    } = attributes || {};

                    setState((prevState) => ({ ...prevState, ...attributes }));

                    // Note: the following categories MUST remain in this order to match with the order of the "labels" array defined at the top of this file

                    const racialBreakdown = [
                        CalcWhitePct,
                        CalcBlackPct,
                        CalcAsianPct,
                        CalcHLPct,
                        CalcOtherRacePct,
                        CalcTwoOrMorePct,
                    ];

                    const customLabels = config.raceDataLabels.map(
                        (label, i) =>
                            `${label} - ${parseFloat(
                                racialBreakdown[i]
                            ).toFixed(1)}%`
                    );

                    const raceChartData = {
                        maintainAspectRatio: false,
                        responsive: true,
                        labels: customLabels,
                        datasets: [
                            {
                                label: `${openPopup.properties.County} Demographics`,

                                data: racialBreakdown.map((datum) =>
                                    parseFloat(datum).toFixed(1)
                                ),
                                backgroundColor: config.piePalette.default,
                                hoverBackgroundColor: config.piePalette.hover,
                            },
                        ],
                    };

                    setRaceData(raceChartData);

                    const ageChartData = {
                        labels: ["Male", "Female"],
                        datasets: [
                            {
                                label: "0-19",
                                data: [
                                    parseFloat(CalcMale0to19).toFixed(),
                                    parseFloat(CalcFemale0to19).toFixed(),
                                ],
                            },
                            {
                                label: "20-44",
                                data: [
                                    parseFloat(CalcMale20to44).toFixed(),
                                    parseFloat(CalcFemale20to44).toFixed(),
                                ],
                            },
                            {
                                label: "45-64",
                                data: [
                                    parseFloat(CalcMale45to64).toFixed(),
                                    parseFloat(CalcFemale45to64).toFixed(),
                                ],
                            },
                            {
                                label: "65+",
                                data: [
                                    parseFloat(CalcMale65Plus).toFixed(),
                                    parseFloat(CalcFemale65Plus).toFixed(),
                                ],
                            },
                        ],
                    };
                    ageChartData.datasets.forEach((dataset, index) => {
                        dataset.backgroundColor =
                            config.stackedBarsPalette.default[index];
                        dataset.hoverBackgroundColor =
                            config.stackedBarsPalette.hover[index];
                    });
                    setAgeData(ageChartData);

                    // Create ACS external link:
                    const currentLink = `https://www.census.gov/acs/www/data/data-tables-and-tools/narrative-profiles/2019/report.php?geotype=county&state=24&county=${MDCode}`;
                    setAcsLink(currentLink);
                })
                .catch(console.error);
        }
    }, [acsLink, openPopup.properties.MDCode, openPopup.properties.County]);

    // if (!acsLink) return null;
    return (
        <div
            id="community-profile"
            className={`community-profile-container ${
                Object.keys(raceData).length ? "" : "not-yet-loaded"
            }`}
        >
            <div className="profile-title">
                {state.TractName ? `${state.TractName} - ` : ""}{" "}
                {`${state.FullCountyName || ""} Demographic Profile`}
            </div>
            <div className="profile-top-divider">
                <small className="profile-subtitle">
                    Source: Census Bureau American Community Survey (ACS)
                    2015-2019
                </small>
            </div>
            <div className="community-figures">
                <div className="row-section">
                    <div className="row-cell">
                        <div className="row-title">Total Population</div>
                        <div className="row-data">{state.EstTotalPop}</div>
                    </div>
                    <div className="row-cell">
                        <div className="row-title">Female</div>
                        <div className="row-data">
                            {state.CalcPctFemaleTotalPop}
                        </div>
                    </div>
                    <div className="row-cell">
                        <div className="row-title">Male</div>
                        <div className="row-data">
                            {state.CalcPctMaleTotalPop}
                        </div>
                    </div>
                </div>
            </div>
            <div className="profile-content">
                <div className="chart-section">
                    <div className="community-charts">
                        <div className="pie-container">
                            <HorizontalBar
                                ref={barRef}
                                data={ageData}
                                options={{
                                    layout: {
                                        padding: {
                                            top: 17,
                                        },
                                    },
                                    legend: {
                                        labels: {
                                            boxWidth: 12,
                                        },
                                    },
                                    maintainAspectRatio: false,
                                    title: {
                                        text: "Age-Sex Breakdown",
                                        display: true,
                                    },
                                    scales: {
                                        xAxes: [
                                            {
                                                stacked: true,
                                                scaleLabel: {
                                                    display: true,
                                                    labelString: "Population",
                                                    padding: 0,
                                                    fontStyle: "bold",
                                                },
                                                ticks: {
                                                    callback: (value) =>
                                                        Number(
                                                            value
                                                        ).toLocaleString(),
                                                },
                                            },
                                        ],
                                        yAxes: [
                                            {
                                                stacked: true,
                                                ticks: {
                                                    maxTicksLimit: 5,
                                                },
                                            },
                                        ],
                                    },
                                    tooltips: {
                                        mode: "label",
                                        intersect: true,
                                        yAlign: "bottom",
                                        callbacks: {
                                            label: (selected, dataset) => {
                                                // Data from hover event:
                                                const {
                                                    index,
                                                    datasetIndex,
                                                } = selected;
                                                // Percent values (not available from chart.js event)
                                                // (Ordered at top level male then female to match chart.js index order, then ordered least to greatest by age to match chart.js dataset index order)
                                                const ageSexValues = [
                                                    [
                                                        state.CalcPctMale0to19,
                                                        state.CalcPctMale20to44,
                                                        state.CalcPctMale45to64,
                                                        state.CalcPctMale65Plus,
                                                    ],
                                                    [
                                                        state.CalcPctFemale0to19,
                                                        state.CalcPctFemale20to44,
                                                        state.CalcPctFemale45to64,
                                                        state.CalcPctFemale65Plus,
                                                    ],
                                                ];

                                                // Find current count value, then append corresponding percent value
                                                const currentSet =
                                                    dataset.datasets[
                                                        datasetIndex
                                                    ];
                                                const value =
                                                    currentSet.data[index];
                                                const { label } = currentSet;
                                                const percentValue =
                                                    ageSexValues[index][
                                                        datasetIndex
                                                    ];
                                                return `${label}: ${Number(
                                                    value
                                                ).toLocaleString()} - ${percentValue}`;
                                            },
                                        },
                                    },
                                }}
                            />
                        </div>
                        <hr className="chart-divider" />
                        <div className="pie-container">
                            <Pie
                                ref={pieRef}
                                data={raceData}
                                options={{
                                    title: {
                                        text: "Racial Composition",
                                        display: true,
                                    },
                                    legend: {
                                        position: "right",
                                    },
                                    maintainAspectRatio: false,
                                    tooltips: {
                                        callbacks: {
                                            label: (selected, dataset) => {
                                                const { index } = selected;
                                                const currentSet =
                                                    dataset.datasets[0];
                                                const value =
                                                    currentSet.data[index];
                                                return `${value}%`;
                                            },
                                            title: (selected) => {
                                                const [{ index }] = selected;

                                                return config.raceDataLabels[
                                                    index
                                                ];
                                            },
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>
                    <div className="community-bottom-text">
                        <p>{`Click on chart legends to filter by category`}</p>
                    </div>
                </div>
                <div className="community-figures">
                    <div className="cell-section">
                        <div className="figure-cell">
                            <div className="cell-title">Median Income</div>
                            <div className="cell-info">
                                {state.EstHouseholdMedianIncomeDollars}
                            </div>
                        </div>
                        <div className="figure-cell">
                            <div className="cell-title">People in Poverty</div>
                            <div className="cell-info">
                                {state.EstPopBelowFedPovertyLvl} (
                                {state.CalcPopBelowFedPovertyLvlPct})
                            </div>
                        </div>
                        <div className="figure-cell">
                            <div className="cell-title">
                                Finished High School (or above)
                            </div>
                            <div className="cell-info">
                                {state.CalcPctEdAttain25PlusHSorHigher}
                            </div>
                        </div>
                        <div className="figure-cell">
                            <div className="cell-title">Unemployment Rate</div>
                            <div className="cell-info">
                                {state.EstUnempRateTotalPop16Plus}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="community-data-source-link">
                <small>
                    Discover{" "}
                    <a target="_blank" rel="noopener noreferrer" href={acsLink}>
                        more
                    </a>{" "}
                    about this location.
                </small>
            </div>
        </div>
    );
};

export default CommunityProfile;
