import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { constants } from '../../constants/constantsV3';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { formatNumberForLocale } from '../../utils/utils';

function GazeChart({ title, type, chartData, cameraIndex }) {
    let langReducer = useSelector((data) => data.lang)
    let arabicFont = useSelector((data) => data.arabicFont)
    let englishFont = useSelector((data) => data.englishFont)
    const { t } = useTranslation();

    const [state, setState] = useState({
        areaChartData: {
            options: {
                title: {
                    text: t(title.toLowerCase()).toUpperCase(),
                    align: 'center',
                    margin: 10,
                    offsetX: 0,
                    offsetY: 0,
                    floating: false,
                    style: {
                        fontSize: '14px',
                        fontFamily: 'Roboto',
                    },
                },
                chart: {
                    id: 'basic-bar',
                    toolbar: {
                        show: false,
                        autoSelected: "pan",
                    },
                    zoom: {
                        type: "x",
                        enabled: true,
                        autoScaleYaxis: false,
                    },
                    animations: {
                        enabled: true,
                        easing: 'linear',
                        speed: 10,
                        animateGradually: {
                            enabled: true,
                            delay: 10
                        },
                        dynamicAnimation: {
                            enabled: true,
                            speed: 10
                        }
                    }

                },
                dataLabels: {
                    enabled: true,
                    formatter: function (val, opts) {
                        return val;
                    },
                },
                grid: {
                    show: false,
                },
                xaxis: {
                    type: 'category',
                    categories: [],
                    // min: 0,
                    // max: 10,
                    range: 10,
                    // min: 1,
                    // max: 5,
                    tickAmount: 10,

                    crosshairs: {
                        show: false,
                        width: 10,
                        position: 'back',
                        opacity: 0.9,
                    },
                    labels: {
                        formatter: function (value) {
                            // console.log("value: ", value);
                            // console.log("!isNaN(value): ", !isNaN(value));
                            if (!isNaN(value)) {
                                // console.log("typeof value: ", typeof value);
                                if (typeof value === "number") {
                                    // console.log("1value: ", value);
                                    value = Math.round(value) + " hr";
                                    return value
                                }
                                else if (typeof value === "string") {
                                    value = value + " hr";
                                    // console.log("2value: ", value);
                                    return value
                                }
                            }
                            else if (typeof value === "string") {
                                value = value + " hr";
                                // console.log("3value: ", value);
                                return value
                            }
                            // if (value != undefined) return Math.round(value) + " hr";
                        },
                    },
                },
                yaxis: {
                    opposite: langReducer === 'ar',
                    labels: {
                        offsetX: langReducer === 'ar' && 0,
                        align: langReducer === 'ar' && 'right',
                        formatter: function (value) {
                            return Math.round(value); // Display values without decimal points
                        },
                    },
                },
                // responsive: [
                //     {
                //         breakpoint: 600,
                //         options: {
                //             chart: {
                //                 width: '100%',
                //                 height: "100%",
                //             },
                //         },
                //     },
                // ],
                legend: {
                    show: true,
                    position: 'bottom',
                    formatter: (seriesName) => t(seriesName.split(" ")[0].toLowerCase(), { count: formatNumberForLocale(seriesName.split(" ")[1]) }),
                },
                noData: {
                    text: (constants.streaming === false) ? t("stream-is-offline") : t("data-will-appear-shortly-please-wait"),
                    offsetX: 0,
                    offsetY: -20,
                    style: {
                        color: "#808080",
                        fontSize: '14px',
                        fontFamily: undefined,
                    },
                },
                colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#3F51B5', '#03A9F4', '#4CAF50', '#F9CE1D', '#FF9800',
                    '#33B2DF', '#546E7A', '#D4526E', '#13D8AA', '#A5978B', '#2b908f', '#f9a3a4', '#90ee7e', '#fa4443'],
                animations: {
                    enabled: true,
                    easing: 'linear',
                    speed: 10,
                    animateGradually: {
                        enabled: true,
                        delay: 10
                    },
                    dynamicAnimation: {
                        enabled: true,
                        speed: 10
                    }
                }

            },
            series: [],
            // series: [
            //     { "name": "Region1", "data": [{ "x": "11:51", "y": 0 }, { "x": "11:52", "y": 1 }, { "x": "11:53", "y": 1 }, { "x": "11:56", "y": 1 }] },
            //     { "name": "Region2", "data": [{ "x": "11:51", "y": 0 }, { "x": "11:52", "y": 0 }, { "x": "11:53", "y": 0 }, { "x": "11:56", "y": 0 }] },
            // ]
        },
    });

    useEffect(() => {
        // console.log("GazeChart: useEffect: chartData: ", chartData);
        let formattedData = [];

        if (chartData.data) {
            for (const region in chartData.data) {
                let currentRegion = chartData.data[region];
                let regionData = currentRegion.hour.map((hour, index) => ({
                    x: hour,
                    y: Number(currentRegion.gaze_count[index]),
                }));

                formattedData.push({ name: region, data: regionData });
            }

            // let tempData = [
            //     {
            //         "name": "Region1",
            //         "data": [{ "x": "16:03", "y": 1 }, { "x": "16:04", "y": 2 }, { "x": "16:05", "y": 3 }, { "x": "16:06", "y": 3 }, { "x": "16:07", "y": 3 }]
            //     },
            //     {
            //         "name": "Region2",
            //         "data": [{ "x": "16:03", "y": 0 }, { "x": "16:04", "y": 0 }, { "x": "16:05", "y": 0 }, { "x": "16:06", "y": 0 }, { "x": "16:07", "y": 0 }]
            //     },
            //     {
            //         "name": "Region3",
            //         "data": [{ "x": "16:03", "y": 0 }, { "x": "16:04", "y": 0 }, { "x": "16:05", "y": 1 }, { "x": "16:06", "y": 0 }, { "x": "16:07", "y": 0 }]
            //     },
            //     {
            //         "name": "Region4",
            //         "data": [{ "x": "16:09", "y": 10 }, { "x": "16:10", "y": 1 }]
            //     }
            // ]
            // Step 1: Gather all unique x-values across all series
            let allXValues = new Set();
            formattedData.forEach(series => {
                series.data.forEach(point => {
                    allXValues.add(point.x);
                });
            });

            // Convert Set to Array and sort it
            const allXValuesArray = Array.from(allXValues)

            // Step 2: Fill missing data points in each series with 0 or another placeholder value
            const filledData = formattedData.map(series => {
                const dataMap = new Map(series.data.map(point => [point.x, point.y]));
                const filledSeriesData = allXValuesArray.map(xValue => {
                    return { x: xValue, y: dataMap.get(xValue) ?? 0 }; // Use 0 or another value instead of null
                });
                return { ...series, data: filledSeriesData };
            });


            setState(prevState => ({
                areaChartData: {
                    ...prevState.areaChartData,
                    options: {
                        ...prevState.areaChartData.options,
                        title: {
                            text: t(title.toLowerCase()).toUpperCase(),
                            align: 'center',
                            margin: 10,
                            offsetX: 0,
                            offsetY: 0,
                            floating: false,
                            style: {
                                fontSize: '14px',
                                fontFamily: 'Roboto',
                            },
                        },
                        yaxis: {
                            opposite: langReducer === 'ar',
                            labels: {
                                offsetX: langReducer === 'ar' && 0,
                                align: langReducer === 'ar' && 'right',
                                formatter: function (value) {
                                    return Math.round(value); // Display values without decimal points
                                },
                            },
                        },
                        legend: {
                            show: true,
                            position: 'bottom',
                            formatter: (seriesName) => t(seriesName.split(" ")[0].toLowerCase(), { count: formatNumberForLocale(seriesName.split(" ")[1]) }),
                        },
                        chart: {
                            ...prevState.areaChartData.options.chart,
                            zoom: {
                                ...prevState.areaChartData.options.chart.zoom,
                                enabled: ((formattedData.length > 0) && (formattedData[0]?.data.length > 5)) ? true : false,
                            }
                        }
                    },
                    // series: formattedData,
                    series: filledData,
                }
            }));
        } else {
            setState(prevState => ({
                areaChartData: {
                    ...prevState.areaChartData,

                    options: {
                        ...prevState.areaChartData.options,
                        title: {
                            text: t(title.toLowerCase()).toUpperCase(),
                            align: 'center',
                            margin: 10,
                            offsetX: 0,
                            offsetY: 0,
                            floating: false,
                            style: {
                                fontSize: '14px',
                                fontFamily: 'Roboto',
                            },
                        },
                        yaxis: {
                            opposite: langReducer === 'ar',
                            labels: {
                                offsetX: langReducer === 'ar' && 0,
                                align: langReducer === 'ar' && 'right',
                                formatter: function (value) {
                                    return Math.round(value); // Display values without decimal points
                                },
                            },
                        },
                        legend: {
                            show: true,
                            position: 'bottom',
                            formatter: (seriesName) => t(seriesName.split(" ")[0].toLowerCase(), { count: formatNumberForLocale(seriesName.split(" ")[1]) }),
                        },
                        noData: {
                            text: (constants.streaming === false) ? t("stream-is-offline") : t("data-will-appear-shortly-please-wait"),
                            offsetX: 0,
                            offsetY: -20,
                            style: {
                                color: "#808080",
                                fontSize: '14px',
                                fontFamily: undefined,
                            },
                        },

                        chart: {
                            ...prevState.areaChartData.options.chart,
                        }
                    },

                }
            }));
        }
    }, [chartData, langReducer]);

    return (
        <div style={{ width: "100%", height: "88%" }}>
            <Chart
                options={state.areaChartData.options}
                series={state.areaChartData.series}
                type="area"
                width="100%"
                height="100%"
            />
        </div>
    );
}

export default GazeChart;
