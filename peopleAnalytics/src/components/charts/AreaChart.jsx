import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { constants } from '../../constants/constantsV3';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
function AreaChart({ title, type, chartData, cameraIndex }) {
    // const getFillColor = (type) => {
    //     switch (type) {
    //         case 'male':
    //             return ['#0000FF', '#FFFFFF']; // Blue gradient for male
    //         case 'female':
    //             return ['#FF69B4', '#FFFFFF']; // Pink gradient for female
    //         default:
    //             return ['#FF00FF', '#FFFFFF']; // Default magenta gradient
    //     }
    // };
    // const data = [10, 2, 50, 89, 2,]
    const { t } = useTranslation();
    let langReducer = useSelector((data) => data.lang)
    let arabicFont = useSelector((data) => data.arabicFont)
    let englishFont = useSelector((data) => data.englishFont)
    const [state, setState] = useState({
        areaChartData: {
            options: {
                title: {
                    text: t(title.toLowerCase()),
                    align: 'center',
                    margin: 10,
                    offsetX: 0,
                    offsetY: 0,
                    floating: false,
                    style: {
                        fontSize: '14px',
                        fontWeight: 'bold',
                        fontFamily: { fontFamily: langReducer == "ar" ? arabicFont : englishFont },
                        color: (type == "female") ? '#FF00FF' : "#2A6EBB",
                    },
                },

                chart: {
                    id: 'basic-bar',

                    label: "hussain",
                    toolbar: {
                        show: false,
                        autoSelected: "pan",
                    },
                    zoom: {
                        type: "x",
                        enabled: true,
                        autoScaleYaxis: false,
                    },
                },
                dataLabels: {
                    enabled: true,
                    formatter: function (val, opts) {
                        // console.log("val:", val);
                        // console.log("opts:", opts);
                        return val
                    },

                },
                grid: {
                    show: false,
                    borderColor: 'rgba(0,0,0,0.1)',
                },
                xaxis: {
                    categories: [],
                    // min: 1,
                    // max: 5,
                    tickAmount: 5,
                    range: 10,
                    crosshairs: {
                        show: false,
                        width: 10,
                        position: 'back',
                        opacity: 0.9,
                        stroke: {
                            color: '#B6B6B6',
                            width: 0,
                            dashArray: 0,
                        },
                        fill: {
                            type: 'solid',
                            color: '#B1B9C4',
                            gradient: {
                                colorFrom: '#D8E3F0',
                                colorTo: '#BED1E6',
                                stops: [0, 100],
                                opacityFrom: 0.4,
                                opacityTo: 0.5,
                            },
                        },
                        dropShadow: {
                            enabled: false,
                            top: 0,
                            left: 0,
                            blur: 1,
                            opacity: 0.4,
                        },
                    },
                    labels: {
                        formatter: function (value) {
                            // const options = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
                            // return new Date(value).toLocaleTimeString('en-US', options);
                            if (value != undefined)
                                return value + " hr"
                        }
                    },
                },
                yaxis: {
                    opposite: langReducer === 'ar',

                    labels: {
                        offsetX: langReducer === 'ar' && 0,
                        align: langReducer === 'ar' && 'right',
                        formatter: function (value) {
                            return Math.round(value); // Display values without decimal points
                        }
                    }
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        enabled: true,
                        opacityFrom: 0.55,
                        opacityTo: 0,
                        colorStops: [
                            {
                                offset: 0,
                                color: (type == "female") ? '#FF00FF' : "#2A6EBB", // Pink (filled color)
                                opacity: 0.5,
                            },
                            {
                                offset: 100,
                                color: 'white', // Pink (filled color)
                                opacity: 0.5,
                            },
                        ],
                    }
                },
                // markers: {
                //     size: 3,
                //     // colors: ["#000524"],
                //     // strokeColor: "#00BAEC",
                //     // strokeWidth: 3
                // },
                stroke: {
                    curve: 'smooth',
                    colors: (type == "female") ? ['#FF00FF'] : ["#2A6EBB"], // Magenta (outline color)
                    width: 3, // Outline width
                },
                dropShadow: {
                    enabled: true,
                    top: 5, // Set the top shadow distance
                    left: 0, // Set the left shadow distance
                    blur: 1, // Set the blur effect
                    opacity: 0.1, // Set the shadow opacity
                },
                responsive: [
                    {
                        breakpoint: 600, // controls the chart at screens <= 600px
                        options: {
                            chart: {
                                width: '100%',
                                height: "100%"
                            },
                        },
                    },
                ],
                noData: {
                    text: (!constants.streaming || cameraIndex != 0 || cameraIndex != 1) ? t("stream-is-offline") : t("data-will-appear-shortly-please-wait"),
                    offsetX: 0,
                    offsetY: -20,
                    style: {
                        color: "#952D98",
                        fontSize: '14px',
                        fontFamily: undefined
                    }
                },
            },
            series: [
                {
                    name: t(title.toLowerCase()),
                    data: ((cameraIndex == 0) || (cameraIndex == 1)) ? (type === 'male') ? chartData.males : chartData.females : [],
                },
            ],
        },
    });
    useEffect(() => {

        setState(prevState => ({
            areaChartData: {
                ...prevState.areaChartData,
                series: [
                    {
                        ...prevState.areaChartData.series[0],
                        data: ((cameraIndex == 0) || (cameraIndex == 1)) ? type === 'male' ? chartData.males : chartData.females : [],
                        // data: data?.length > 0 ? data : [],
                    },
                ],
                options: {
                    ...prevState.options,
                    title: {
                        text: t(title.toLowerCase()),
                        align: 'center',
                        margin: 10,
                        offsetX: 0,
                        offsetY: 0,
                        floating: false,
                        style: {
                            fontSize: '14px',
                            fontWeight: 'bold',
                            fontFamily: undefined,
                            color: (type == "female") ? '#FF00FF' : "#2A6EBB",
                        },
                    },
                    xaxis: {
                        ...prevState.areaChartData.options.xaxis,
                        categories: ((cameraIndex == 0) || (cameraIndex == 1)) ? (chartData.hours || []) : [],
                        labels: {
                            formatter: function (value) {
                                if (value != undefined)
                                    return value + t('hr')
                            }
                        },
                    },
                    yaxis: {
                        opposite: langReducer === 'ar',

                        labels: {
                            offsetX: langReducer === 'ar' && 0,
                            align: langReducer === 'ar' && 'right',
                            formatter: function (value) {
                                return Math.round(value); // Display values without decimal points
                            }
                        }
                    },
                    noData: {
                        text: constants.streaming
                            ? (((cameraIndex === 0) || cameraIndex === 1) && constants.camera_1_live)
                                ? t("data-will-appear-shortly-please-wait")
                                : (cameraIndex === 1 && constants.camera_2_live)
                                    ? t("data-will-appear-shortly-please-wait")
                                    : t('stream-is-offline')
                            : t('stream-is-offline'),
                        offsetX: 0,
                        offsetY: -20,
                        style: {
                            color: "#808080",
                            fontSize: '14px',
                            fontFamily: undefined
                        }
                    },
                },
            },
        }));
    }, [chartData, cameraIndex, langReducer]);
    return (
        <div style={{ width: "100%", height: "88%", }}>
            <Chart
                options={state.areaChartData.options}
                series={state.areaChartData.series}
                type="area"
                width="100%"
                height="100%"
            // className="PAAreaChart"
            />
        </div>
    );
}
export default AreaChart;