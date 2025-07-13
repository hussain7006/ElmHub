import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { constants } from '../../constants/constantsV3';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

function MaleFemaleAreaChart({ title, type, chartData, cameraIndex }) {
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
                        fontFamily: { fontFamily: langReducer == "ar" ? arabicFont : englishFont },
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
                    },
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
                    range: 10,
                    tickAmount: 10,
                    crosshairs: {
                        show: false,
                        width: 10,
                        position: 'back',
                        opacity: 0.9,
                    },
                    labels: {
                        formatter: function (value) {
                            if (!isNaN(value)) {
                                if (typeof value === "number") {
                                    value = Math.round(value) + " hr";
                                    return value
                                }
                                else if (typeof value === "string") {
                                    value = value + " hr";
                                    return value
                                }
                            }
                            else if (typeof value === "string") {
                                value = value + " hr";
                                return value
                            }
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
                legend: {
                    show: true,
                    position: 'bottom',
                    formatter: (seriesName) => t(seriesName.toLowerCase()),
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
                colors: ['#2A6EBB', '#FF00FF'], // Blue for MALE, Pink for FEMALE
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
        },
    });

    useEffect(() => {


        if (chartData?.hours && chartData.hours.length > 0) {
            const { hours, males, females } = chartData;
            const maleData = hours.map((hour, index) => ({ x: hour, y: males[index] }));
            const femaleData = hours.map((hour, index) => ({ x: hour, y: females[index] }));
            const formattedData = [{ name: "Male", data: maleData }, { name: "Female", data: femaleData }];

            let allXValues = new Set();
            formattedData.forEach(series => {
                series.data.forEach(point => {
                    allXValues.add(point.x);
                });
            });

            // Convert Set to Array
            const allXValuesArray = Array.from(allXValues)

            // Fill missing data points in each series with 0 or another placeholder value
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
                                fontFamily: { fontFamily: langReducer == "ar" ? arabicFont : englishFont },
                            },
                        },
                        yaxis: {
                            ...prevState.areaChartData.options.yaxis,
                            opposite: langReducer === 'ar',

                        },
                        legend: {
                            show: true,
                            position: 'bottom',
                            formatter: (seriesName) => t(seriesName.toLowerCase()),
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
                            zoom: {
                                ...prevState.areaChartData.options.chart.zoom,
                                enabled: ((formattedData.length > 0) && (formattedData[0]?.data.length > 5)) ? true : false,
                            }
                        }
                    },
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
                                fontFamily: { fontFamily: langReducer == "ar" ? arabicFont : englishFont },
                            },
                        },
                        yaxis: {
                            ...prevState.areaChartData.options.yaxis,
                            opposite: langReducer === 'ar',

                        },
                        legend: {
                            show: true,
                            position: 'bottom',
                            formatter: (seriesName) => t(seriesName.toLowerCase()),
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


    }, [chartData, langReducer])



    // useEffect(() => {}, [langReducer])

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

export default MaleFemaleAreaChart;
