import React, { useEffect, useRef, useState } from 'react';
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import HighchartsNoData from 'highcharts/modules/no-data-to-display';
import { constants } from '../../constants/constantsV3';
HighchartsNoData(Highcharts);
export default function GazeHighChart({ title, type, chartData, cameraIndex }) {

    const chartComponentRef = useRef(null); // Reference for Highcharts instance
    const [state, setState] = useState({
        chart: {
            backgroundColor: "white",
            type: "area",
            animation: false,
            marginTop: 60,
            height: "196px",
            style: {
                borderRadius: "15px",
            }
        },
        accessibility: { enabled: false },
        title: {
            text: 'Gaze',
            align: 'center',
            style: {
                fontSize: '15px',
                fontFamily: 'Roboto',
            }
        },
        // subtitle: {
        //     text: 'Source: <a href="https://fas.org/issues/nuclear-weapons/status-world-nuclear-forces/" ' +
        //         'target="_blank">FAS</a>'
        // },
        rangeSelector: {
            selected: 1
        },
        xAxis: {
            type: 'category',
            min: 0,
            max: 5,
            allowDecimals: false,
            zoomEnabled: true,
            accessibility: {
                enabled: false,
            },
            labels: {
                formatter: function () {
                    return this.value + ' hr';
                }
            }
        },
        yAxis: {
            title: {
                text: ''
            },
        },
        // tooltip: {
        //     pointFormat: '{series.name} had stockpiled <b>{point.y:,.0f}</b><br/>' +
        //         'warheads in {point.x}'
        // },
        plotOptions: {
            area: {
                // pointStart: 1940,
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 2,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                }
            }
        },
        // series: [],
        legend: {
            // layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            // x: 150,
            // y: 100,
            floating: true,
            borderWidth: 1,
            backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF'

        },
        // responsive: {
        //     rules: [{
        //         condition: {},
        //         chartOptions: {
        //             subtitle: {},
        //             navigator: {
        //                 enabled: false
        //             },
        //             scrollbar: {
        //                 enabled: true
        //             },
        //             legend: {
        //                 enabled: true
        //             },
        //             rangeSelector: {
        //                 enabled: false
        //             },
        //             xAxis: {
        //                 labels: {
        //                     enabled: true,
        //                     formatter: function () {
        //                         return this.value + ' hr';
        //                     }
        //                 }
        //             },
        //             noData: {
        // style: {
        //     // fontFamily: 'Roboto',
        //     fontWeight: 'normal',
        //     color: "#808080",
        //     fontSize: '14px',
        // },
        //                 useHTML: false,
        //                 position: {
        //                     align: 'center',
        //                     verticalAlign: 'middle'
        //                 }
        //             }
        //         }
        //     }]
        // },
        credits: {
            enabled: false,
        },
        lang: {
            noData: (!constants.streaming || cameraIndex !== 0) ? t("") : t("data-will-appear-shortly-please-wait"),
        },
        noData: {
            useHTML: false,
            position: {
                align: 'center',
                verticalAlign: 'middle',
                x: 0,
                y: -25
            },
            style: {
                fontFamily: 'Roboto',
                fontWeight: 'normal',
                color: "#808080",
                fontSize: '14px',
            },
        },
        series: []
    });



    useEffect(() => {
        // const updateChartOptions = () => {
        // const dataLength = data[0].data[selectedCameraIndex].length;
        // const newMax = dataLength > 5 ? 5 : null; // Determine new max value for xAxis


        let formattedData = [];

        if (chartData?.data) {
            for (const region in chartData.data) {
                let currentRegion = chartData.data[region];
                let regionData = currentRegion.hour.map((hour, index) => ({
                    x: hour,
                    y: Number(currentRegion.gaze_count[index]),
                }));

                formattedData.push({ name: region, data: regionData });
            }

            console.log("new formattedData: ", formattedData);


            setState((prevOptions) => ({
                ...prevOptions,

                series: formattedData.length > 0 ? formattedData : prevOptions.series,
                // series: [],
                xAxis: {
                    ...prevOptions.xAxis,
                    zoomEnabled: true,
                    // min: formattedData[0]?.data[0].x, // Set min value dynamically
                    // max: 5, // Set max value dynamically
                    // tickAmount: 5, // Set tick amount dynamically

                    labels: {
                        formatter: function () {
                            console.log("this.value: ", this.value);
                            return this.value + ' hr';
                        }
                    }

                    // labels: {
                    //     formatter: function () {
                    //         return Highcharts.dateFormat('%H:%M', this.value);
                    //     }
                    // }

                },
                plotOptions: {
                    ...prevOptions.plotOptions,
                    series: {
                        ...prevOptions.plotOptions.series,
                        // point: {
                        //     events: {
                        //         click: (e) => {
                        //             let x = e.point.category;
                        //             let y = e.point.y;
                        //             let seriesIndex = e.point.index;
                        //             handleHighChartMarkerClick(x, y, seriesIndex, activeDesk);
                        //         }
                        //     }
                        // }
                    }
                }
            }));

        }

        // const chart = chartComponentRef.current?.chart;
        // if (chart) {
        //     const dataLength = data[0].data[selectedCameraIndex].length;
        //     const newMax = dataLength > 5 ? dataLength - 1 : 5;
        //     const currentExtremes = chart.xAxis[0].getExtremes();
        //     if (currentExtremes.max < newMax) {
        //         chart.xAxis[0].setExtremes(newMax - 5, newMax, true, false);
        //     }
        //     chart.series[0].setData(data[0].data[selectedCameraIndex], true, false, false); // Update data without animation
        //     chart.redraw();
        // }
        // };
    }, [chartData])



    return (
        <div style={{
            width: "100%",
            // height: "88%"
        }}>
            {/* <Chart
                options={state.areaChartData.options}
                series={state.areaChartData.series}
                type="area"
                width="100%"
                height="100%"
            /> */}
            <HighchartsReact
                highcharts={Highcharts}
                options={state}
                ref={chartComponentRef} // Attach the reference here
                immutable={false} // Allow updates to be handled directly

            />
        </div>
    );
}

