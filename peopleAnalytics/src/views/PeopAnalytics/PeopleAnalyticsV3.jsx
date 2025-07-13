import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { constants } from '../../constants/constantsV3'

import { Box, Button, FormControl, IconButton, MenuItem, Select, Switch, Tooltip } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import HighlightAltIcon from '@mui/icons-material/HighlightAlt';
import CircularProgress from "@mui/material/CircularProgress";
import VideoCameraBackIcon from "@mui/icons-material/VideoCameraBack";
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
// import RadarIcon from '@mui/icons-material/Radar';

import DateSelector from "../../components/DateSelector/DateSelector.jsx";
import GenderCard from "../../components/GenderCard/GenderCard.jsx";

import femalIcon from "./images/female.png";
import maleIcon from "./images/male.png";
import multipleUserIcon from "./images/maleFemaleGroup.png";
// import foreignerIcon from "/images/foreignerIcon.png"
import foreignerIconCopy from "/images/foreignerIconCopy.png"
import liveCount from "/images/liveCount.svg"
import view3 from "./videos/view3.mp4"
import "./PeopleAnalyticsV3.css"
import axios from 'axios';
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css';
import AreaChart from '../../components/charts/AreaChart.jsx';
import TrendCard from '../../components/trendCard/TrendCard.jsx';
import GoogelMapComponent from '../../components/googleMap/GoogelMapComponent.jsx';
import Swal from 'sweetalert2';
import PersonSearchModal from '../../components/PersonSearchModal/PersonSearchModal.jsx';
// import { Settings } from '@mui/icons-material';
import SelectROI from '../../components/SelectROI/SelectROI.jsx';
import MaleFemaleAreaChart from '../../components/charts/MaleFemaleAreaChart.jsx';
import GazeChart from '../../components/charts/GazeChart.jsx';
import { MobileMenu } from '../../components/mobileMenu/MobileMenu.jsx';
// import GazeHighChart from '../../components/charts/GazeHighChart.jsx';


import { useTranslation } from "react-i18next";
import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
import LanguageIcon from '@mui/icons-material/Language';
import { US, SA } from 'country-flag-icons/react/3x2'
import { formatNumberForLocale, formatTimeForLocale } from '../../utils/utils.js';
import DrawLine from '../../components/DrawLine/DrawLine.jsx';
import SignalWifiOffIcon from '@mui/icons-material/SignalWifiOff';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';

const PeopleAnalyticsV3 = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  let langReducer = useSelector((data) => data.lang)
  let arabicFont = useSelector((data) => data.arabicFont)
  let englishFont = useSelector((data) => data.englishFont)
  let showHeader = useSelector((data) => data.showHeader)
  let colors = useSelector((data) => data.colors)
  let theme = useSelector((data) => data.theme)

  console.log("PA colors", colors);
  console.log("PA theme", theme);
  console.log("PA showHeader", showHeader);


  // const startStreamButtonRef = useRef(null);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const [selectedCamera, setSelectedCamera] = useState("camera1")
  const [cameraIndex, setCameraIndex] = useState(0);

  const [isView3, setIsView3] = useState(false);
  const [isPdfDownloading, setIsPdfDownloading] = useState(false);
  const [isBackendRestarting, setIsBackendRestarting] = useState(false);

  const [isView3VideoPlayed, setIsView3VideoPlayed] = useState(false);
  const [enabledDates, setEnabledDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState([]);

  const [sideBarItems, setSideBarItems] = useState([
    { index: 1, active: true, enable: true },
    { index: 2, active: false, enable: true },
    { index: 3, active: false, enable: false },
    // { index: 4, active: false },
  ]);

  const [markersPosition, setMarkersPosition] = useState([
    {
      name: "Camera1",
      position: [0.6, 0.58],
      isActive: true,
    },
    {
      name: "Camera2",
      position: [0.3, 0.82],
      isActive: false,
    },
    {
      name: "Camera3",
      position: [0.7, 0.85],
      isActive: false,
    },
  ]);
  const [googleMarkerPositions, setGoogleMarkerPositions] = useState([
    { lat: 17.479620144756336, lng: 44.178665091706534, label: "", title: "Camera 1", isActive: true, enable: true },
    { lat: 17.48264315972698, lng: 44.18109734406652, label: "", title: "Camera 2", isActive: false, enable: true },
    { lat: 17.479198336896417, lng: 44.182392162567946, label: "", title: "Camera 3", isActive: false, enable: false },
  ]);

  const [camera1StreamInfo, setCamera1StreamInfo] = useState({ stream: null, data: null, error: false })

  const [camera2StreamInfo, setCamera2StreamInfo] = useState({ stream: null, data: null, error: false })

  const [historyDate, setHistoryDate] = useState({ startDate: null, endDate: null, selectedDate: null, });

  const [time, setTime] = useState(new Date());

  useMemo(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000); // Update time every second

    return () => clearInterval(intervalId);
  }, []);


  const handleSelectSideBarItem = (e, from) => {
    const index = from === "dropdown" ? e.target.value : e;

    // Update camera index and selected camera
    setCameraIndex(index);
    setSelectedCamera("camera" + (Number(index) + 1));

    // Helper function to update items
    const updateItems = (items, idx, key) => {
      return items.map((item, i) => ({ ...item, [key]: i === idx }));
    };

    // Update side bar items
    setSideBarItems(prevItems => updateItems(prevItems, index, "active"));

    // Update marker positions based on source
    // if (from === "googleMap") {
    //   setGoogleMarkerPositions(prevPositions => updateItems(prevPositions, index, "isActive"));
    // } else {
    setMarkersPosition(prevPositions => updateItems(prevPositions, index, "isActive"));
    setGoogleMarkerPositions(prevPositions => updateItems(prevPositions, index, "isActive"));
    // }

    // Handle view state for index 2
    if (index === 2) {
      setTimeout(() => {
        setIsView3(true);
        setIsView3VideoPlayed(true);
      }, 500);
    } else {
      setIsView3(false);
      setIsView3VideoPlayed(false);
    }

    // handleStopStream();


    controller1.abort();
    setController1(new AbortController());


    if (camera1StreamInfo.data?.length > 0) {
      setCamera1StreamInfo({ ...camera1StreamInfo, stream: null, data: [{ ...camera1StreamInfo.data[0], instant_count: 0 }] })
    } else {
      setCamera1StreamInfo({ ...camera1StreamInfo, stream: null })

    }

    setTimeout(() => {
      if (startStreamButtonRef.current) {
        // console.log("clicking on the start stream button");
        startStreamButtonRef.current.click();
      }
    }, 2000);
  };



  const handleGeneratePdf = async (date, models) => {
    try {
      setIsPdfDownloading(true)
      const ids = ROIs.gaze.map((roi) => "gaze_" + roi.id);
      const url = `${constants.helperBackend}/stream/download_pdf`;
      const params = { date_select: date, models_state: JSON.stringify(models), regionIds: JSON.stringify(ids), lang: langReducer };
      const headers = { accept: 'application/json' };
      const response = await axios.get(url, { params, headers, responseType: 'blob' });


      if (response.headers['content-type'] === 'application/pdf') {

        // PDF successfully generated, initiate download
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'people_analytics_report.pdf');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

      }

      setIsPdfDownloading(false)
      return true;

    } catch (error) {
      setIsPdfDownloading(false)
      console.log("error:", error);
      return false;
    }
  }

  const handleDateChange = (date) => {
    // console.log("in handleDateChange");
    const selectedDate = date.format("DD-MM-YYYY");
    setSelectedDate([selectedDate])

    Swal.fire({
      title: t("want-to-download-the-report?"),
      // text: "You won't be able to revert this!",
      icon: "warning",
      iconColor: colors?.accent || "#44C8F5",
      showCancelButton: true,
      confirmButtonColor: colors?.primary || "#952D98",
      cancelButtonColor: colors?.textSecondary || "#808285",
      confirmButtonText: t("download"),
      cancelButtonText: t("cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("confirmed");
        handleGeneratePdf(selectedDate, modelsState);
      }
    });

  }


  //-------------- Select ROI Modal ---------------
  const [openRoiModal, setOpenRoiModal] = useState({ open: false, model: "gaze" });
  const [openDrawLineModal, setOpenDrawLineModal] = useState({ open: false, model: "line" });

  const [ROIs, setROIs] = useState({ "line": [], "tracking": [], "gender": [], "ethnicity": [], "gaze": [], "action": [] });
  // const [ROIs, setROIs] = useState({ "tracking": [], "gender": [], "ethnicity": [], "gaze": [], "action": [] });

  const [disableSaveButton, setDisableSaveButton] = useState(true);

  const startStreamButtonRef = useRef(null);
  const handleConfigSave = async () => {
    setIsBackendRestarting(true)
    setDisableSaveButton(true)

    var data = {
      models_state: modelsState,
      rois: ROIs,
      camera_id: `cam_${cameraIndex + 1}`,
      debug_mode: debugMode
    }

    if (modelsState.gaze && ROIs['gaze'].length == 0) {
      setModelsState({ ...modelsState, gaze: false })
      data = {
        models_state: { ...modelsState, gaze: false },
        rois: ROIs,
        camera_id: `cam_${cameraIndex + 1}`
      }

      await Swal.fire({ icon: "info", title: t('swal-info'), text: t('disabling-the-gaze-model-no-roi-selected'), })
      // return;
    }

    handleStopStream()
    setIsConfigUpdating(true)
    const url = `${constants.cam1IP}/stream/update_config_yml`;
    // console.log("data:", data);

    try {
      const res = await axios.post(url, data, { headers: { 'Content-Type': 'application/json' } });
      setIsConfigUpdating(false)
      await Swal.fire({ icon: "success", title: t('swal-success'), text: t('configuration-successfully-saved'), })
        .then(() => {
          setTempModelsState({ ...modelsState })
          // setROIs([])
          toggleConfigDrawer();
          if (constants.streaming) {
            if (constants.camera_1_live) {
              setTimeout(() => {
                if (startStreamButtonRef.current) {
                  // console.log("clicking on the start stream button");
                  startStreamButtonRef.current.click();
                }
              }, constants.configSaveBufferTime);
            }
          }
          else {
            console.info("Stream is disabled");

            setTimeout(() => {
              setIsBackendRestarting(false)
            }, constants.configSaveBufferTime);
          }
        })
    } catch (error) {
      console.error("Error saving config:", error);
      await Swal.fire({ icon: "error", title: t('swal-error'), text: t('something-went-wrong'), })
        .then(() => { setIsConfigUpdating(false) })
      setIsConfigUpdating(false)
      // setROIs([])
    }
  }

  const getYmlConfig = async () => {
    const url = `${constants.cam1IP}/stream/get_yml?camera_id=cam_${cameraIndex + 1}`;
    try {
      const res = await axios.get(url);
      // console.log("getYmlConfig");
      // console.log(res);

      if (res.data.success) {
        const rois = res.data.data.rois;
        const models_state = res.data.data.models_state

        // console.log("rois:", rois);
        // console.log("models_state:", models_state);

        if (rois?.gaze?.length == 0) {
          setROIs(rois)
          setModelsState({ ...models_state, gaze: false })
          setTempModelsState({ ...models_state, gaze: false })
        } else {
          setROIs(rois)
          setModelsState(models_state)
          setTempModelsState(models_state)
        }



        setDisableSaveButton(true)
        setDebugMode(res.data.data.debug_mode)
      } else {
        console.log("Error getting config:", res.data.message);
        setDisableSaveButton(true)
        setROIs({ "line": [], "tracking": [], "gender": [], "ethnicity": [], "gaze": [], "action": [] })
      }
    } catch (error) {
      console.error("Error getting config:", error);
      setDisableSaveButton(true)
    }
  }

  useEffect(() => { getYmlConfig() }, [cameraIndex])

  // const [areaChartData, setAreaChartData] = useState({ hours: [], males: [], females: [], isLoading: false });
  const [areaChartData, setAreaChartData] = useState({ hours: [], males: [], females: [] });
  const [trendCardData, setTrendCardData] = useState({ totalVisitors: 0, slope: 0, hours: [], counts: [], date: null, lastHourCount: 0 })
  function fetchGetTotalVisitorsCountApi() {
    const url = `${constants.helperBackend}/stream/get_total_counts`;
    // const params = { date_select: selectedDate };
    const params = {};
    const headers = { accept: 'application/json' };

    axios.get(url, { params, headers })
      .then(response => {

        if (response.data.success) {
          let hours = response.data.hours;
          let counts = response.data.counts;
          let slope = response.data.slope;
          let date = response.data.date;
          let lastHourCount = 0

          if (counts.length > 1) {
            lastHourCount = counts[counts.length - 2]
          } else {
            lastHourCount = 0
          }
          setTrendCardData({
            totalVisitors: counts.reduce((acc, curr) => acc + curr, 0),
            slope: slope,
            hours: hours,
            counts: counts,
            date: date,
            lastHourCount: lastHourCount
          })
        }
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }

  const [gazeChartData, setGazeChartData] = useState({ data: null, time: null })
  const fetchDataForAreaChart = () => {
    // console.log("ROIs:", ROIs);
    // setAreaChartData({ ...areaChartData, isLoading: true });

    let ids = ROIs.gaze.map((roi) => "gaze_" + roi.id);

    const url = `${constants.helperBackend}/stream/gender_hourly_counts`;
    const params = { date_select: selectedDate, regionIds: JSON.stringify(ids) };
    const headers = { accept: 'application/json' };


    axios.get(url, { params, headers })
      .then(response => {
        console.log("fetchDataForAreaChart:", response.data);
        let hours = response.data.hours;
        let males = response.data.male;
        let females = response.data.female;
        let gotGazeChartData = response.data.gaze;

        // setAreaChartData({ hours, males, females, isLoading: false });
        setAreaChartData({ hours, males, females });

        // if (ROIs.gaze.length > 0) {
        setGazeChartData({ data: gotGazeChartData, time: hours })
        // }
      })
      .catch(error => {
        // setAreaChartData({ ...areaChartData, isLoading: false });
        console.error('There was an error!', error);
      });

  };

  // Fetching data for chart for every particular interval
  useEffect(() => {
    const fetchHistoricData = () => {
      fetchDataForAreaChart();
      fetchGetTotalVisitorsCountApi();
    };

    fetchHistoricData();
    const intervalId = setInterval(fetchHistoricData, constants.apiCallInterval); // Fetch every 1 minute (60000 ms)
    return () => clearInterval(intervalId);
  }, []);



  const [controller1, setController1] = useState(new AbortController());

  const baseUrl8000 = constants.cam1IP;

  const cameraUrl = [
    (constants.camera_1_live) ? `${baseUrl8000}/stream/video_feed?camera_id=cam_${cameraIndex + 1}` : `${baseUrl8000}/stream/video_feed_1camera_id=cam_${cameraIndex + 1}`,
  ];

  useEffect(() => {

    const fetchData = async () => {
      if (constants.streaming) {
        if (constants.camera_1_live) {
          fetchVideoStream1(cameraUrl[0], controller1);
        }
      }
    };
    fetchData();
    const cleanup = () => { controller1.abort(); };

    return () => { cleanup() };

  }, []);


  const fetchVideoStream1 = async (camUrl, controller) => {
    // console.log(" in fetchVideoStream1");
    // console.log("camUrl:", camUrl);

    try {
      let jsonData = ""

      const response = await fetch(camUrl, { signal: controller.signal });
      const reader = response.body.getReader();
      let imageData = "";

      setIsBackendRestarting(false)

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const parts = new TextDecoder("utf-8").decode(value).split("\r\n\r\n");

        // console.log(parts);

        parts.map((e, j) => {
          if (e.startsWith("--frame\r\nContent-Type: image/jpeg")) { }

          else if (e.startsWith("/9j")) { imageData = e }
          else if (e.startsWith("--frame\r\nContent-Type: application/json")) { }
          else if (e.startsWith("[{\"image\"")) {

            try {
              jsonData = JSON.parse(e)

              let base64Img = "data:image/png;base64, " + imageData;
              setCamera1StreamInfo({ stream: base64Img, data: jsonData, error: false })

              imageData = "";
            } catch (error) {
              console.info(error)
              imageData = "";
            }
          }
          else if (e.trim() == "[]") {
            let base64Img = "data:image/png;base64, " + imageData;

            if (camera1StreamInfo.data?.length > 0) {
              setCamera1StreamInfo({ stream: base64Img, data: [{ ...camera1StreamInfo.data[0], instant_count: 0 }], error: false })

            } else if (camera1StreamInfo.data == null) {
              let initialDefaultData = [
                {
                  "image": null,
                  "instant_count": 0,
                  "cumulative_count": 0,
                  "cumulative_gender": {
                    "male": 0,
                    "female": 0
                  },
                  "cumulative_ethnicity": {
                    "local": 0,
                    "non_local": 0
                  }
                }
              ]

              setCamera1StreamInfo({ stream: base64Img, data: [...initialDefaultData], error: false })
            }


            imageData = "";
          }
          else if (e.trim() == "") { }
          else { imageData += e }
        })

      }
    } catch (error) {
      console.log("error fetching video stream ");
      console.log(error);
      // setIsBackendRestarting(false)
      if (error.name === "AbortError") {
        console.log("Fetch request aborted");
      } else {
        console.error("Error:", error.message);
        // Set error state when stream API fails
        setCamera1StreamInfo(prev => ({ ...prev, error: true }));
      }
    }
    console.log("got the data for previous intersection count");

  };

  const [openPersonSearchModal, setOpenPersonSearchModal] = useState(false);
  const handleOpenPersonSearchModal = () => setOpenPersonSearchModal(true);
  const handleClonsePersonSearchModal = () => setOpenPersonSearchModal(false);

  //-------------- Config Drawer ---------------
  const [isConfigOpen, setIsConfigOpen] = useState(false)
  const [isConfigUpdating, setIsConfigUpdating] = useState(false)
  const toggleConfigDrawer = () => {
    setIsConfigOpen((prevState) => !prevState)

    if (!isConfigOpen) {
      getYmlConfig();
    }
  }

  const [models, setModels] = useState([
    { name: "line", label: "Line", roi: false, line: true, enableSwitch: false, show: false },
    { name: "tracking", label: "Tracking", roi: true, enableSwitch: false, show: true },
    { name: "gaze", label: "Gaze", roi: true, enableSwitch: true, show: true },
    { name: "gender", label: "Gender", roi: false, enableSwitch: true, show: true },
    { name: "ethnicity", label: "Ethnicity", roi: false, enableSwitch: true, show: true },
    // { name: "action", label: "Action", roi: false, enableSwitch: true, show: true },

  ])
  const [modelsState, setModelsState] = useState({
    // "tracking": false,
    "gender": false,
    "ethnicity": false,
    "gaze": false,
    "action": false,
  });
  const [tempModelsState, setTempModelsState] = useState({
    // "tracking": false,
    "gender": false,
    "ethnicity": false,
    "gaze": false,
    "action": false,
  });

  const [debugMode, setDebugMode] = useState(false);

  const handleSwitchChange = (modelName, isChecked) => {
    // console.log("modelName:", modelName, isChecked);

    setModelsState((prevState) => ({
      ...prevState,
      [modelName]: isChecked
    }))
    setDisableSaveButton(false)
  };

  const handleStopStream = () => {
    controller1.abort();
    setController1(new AbortController());
    // setCamera1StreamInfo({ stream: null, data: null })
    if (camera1StreamInfo?.data && camera1StreamInfo.data.length > 0) {
      setCamera1StreamInfo({ ...camera1StreamInfo, stream: null, data: [{ ...camera1StreamInfo.data[0], instant_count: 0 }], error: false })
    } else {
      setCamera1StreamInfo({ ...camera1StreamInfo, stream: null, error: false })
    }
  }
  const handleStartStream = () => {
    if (constants.streaming) {
      if (constants.camera_1_live) {
        // Reset error state when starting stream
        setCamera1StreamInfo(prev => ({ ...prev, error: false }));
        fetchVideoStream1(cameraUrl[0], controller1);
      }
    }
  }


  const [firstFrameForRoi, setFirstFrameForRoi] = useState(null);
  const getFrame = async () => {
    try {
      const res = await axios.get(constants.cam1IP + `/stream/get_frame?camera_id=cam_${cameraIndex + 1}`);
      if (res.data.success) {

        setFirstFrameForRoi("data:image/png;base64, " + res.data.frame);
        // Reset error state when getting frame successfully
        setCamera1StreamInfo(prev => ({ ...prev, error: false }));
        setTimeout(() => {
          if (startStreamButtonRef.current) {
            startStreamButtonRef.current.click();
          }
        }, 2000);

      } else {
        setFirstFrameForRoi(false);
        console.log("Error getting frame:", res.data.message);
      }
    } catch (error) {
      setFirstFrameForRoi(false);
      console.error("Error getting frame:", error);
      return false;
    }
  }
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const handleOpenMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // ------ language change stuff ------
  const [anchorEl, setAnchorEl] = React.useState(false);
  const open = Boolean(anchorEl);
  const handleLanguageIconClick = (event) => { setAnchorEl(event.currentTarget) }
  const handleLanguageDropDownClose = () => { setAnchorEl(null) }
  const handleChangeLangDropdown = (lang) => {
    dispatch({ type: "SETLANGUAGE", payload: { lang } })
    handleLanguageDropDownClose()
  }
  useEffect(() => { i18n.changeLanguage(langReducer) }, [langReducer])
  // ------ language change stuff ------

  return (
    <main style={{
      direction: langReducer == "ar" ? "rtl" : "ltr",
      fontFamily: langReducer == "ar" ? arabicFont : englishFont,
      backgroundColor: colors?.background
    }} >
      <DrawLine
        openRoiModal={openDrawLineModal}
        setOpenRoiModal={setOpenDrawLineModal}
        ROIs={ROIs}
        setROIs={setROIs}
        firstFrameForRoi={firstFrameForRoi}
        setDisableSaveButton={setDisableSaveButton}
      />
      <SelectROI
        openRoiModal={openRoiModal}
        setOpenRoiModal={setOpenRoiModal}
        ROIs={ROIs}
        setROIs={setROIs}
        firstFrameForRoi={firstFrameForRoi}
        setDisableSaveButton={setDisableSaveButton}
      />
      <PersonSearchModal
        openPersonSearchModal={openPersonSearchModal}
        closePersonSearchModal={handleClonsePersonSearchModal}
      />
      <Drawer
        open={isConfigOpen}
        onClose={toggleConfigDrawer}
        direction={langReducer == 'ar' ? 'left' : 'right'}
        size={300}
        duration={300}
        overlayOpacity={0.4}
        overlayColor={"#000"}
        enableOverlay={true}
        zIndex={100}
        children={null}
        className={"configDrawer"}
        overlayClassName={undefined}
        lockBackgroundScroll={false}
      >
        {/* Header */}
        <div className="offcanvas-header border-bottom" style={{ background: colors?.primary, color: colors?.surface }}>
          <div className="">
            <h5 className="mb-0" style={{ fontSize: "1.5rem", fontWeight: 500, lineHeight: 1.2, paddingBottom: 0 }}>{t('app-config')}</h5>
            {/* <p className="mb-0" style={{ marginTop: 0 }}>Customize your theme</p> */}
          </div>
          <a href="javascript:;" className="primaery-menu-close">
            <CloseIcon
              onClick={toggleConfigDrawer}
              style={{ color: "#c7cad2" }}
            />
          </a>
        </div>
        {/* Header */}

        <div className="offcanvas-body border-2 h-full justify-between">
          <div className=' w-full flex flex-col gap-2'>
            {
              models.map((item, i) => {

                return (
                  item.show &&
                  <div key={item.name + "" + i} style={{ border: `1px solid ${colors?.borderColor}`, borderRadius: 5, padding: "5px 12px" }}>
                    <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      {/* <span style={{ color: "red" }}>{item.label.toLowerCase()}</span> */}

                      <span style={{ fontWeight: 400, fontSize: "0.9em" }}>{t(`${item.label.trim().toLowerCase()}`).toUpperCase()}</span>
                      {item.enableSwitch &&
                        <span>
                          <Switch
                            color='success'
                            checked={modelsState[item.name]}
                            onChange={(e) => handleSwitchChange(item.name, e.target.checked)}
                            inputProps={{ 'aria-label': 'controlled' }}
                            disabled={isBackendRestarting}
                          />
                        </span>
                      }
                    </div>

                    {
                      item?.line && (

                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <Button variant="outlined"
                            startIcon={<HighlightAltIcon style={{ fontSize: 25, marginLeft: langReducer == "ar" && 10 }} />}
                            disabled={isBackendRestarting}
                            onClick={() => {
                              handleStopStream();
                              getFrame()
                              // setFirstFrameForRoi(null)
                              // setOpenRoiModal({ open: true, model: item.name })
                              setOpenDrawLineModal({ open: true, model: item.name })
                            }}
                            sx={{ height: "auto", fontSize: 16 }}>{t('draw-line')}</Button>
                          <span className='text-[12px] ml-1  text-end'>
                            <span className={`${langReducer == "en" ? 'mr-1' : 'ml-1'} font-sans text-gray-700 font-semibold`}>{formatNumberForLocale(ROIs[item.name].length)}</span>
                            <span className='text-gray-500 '>{t('rois-selected')}</span>
                          </span>
                        </div>
                      )
                    }

                    {
                      item.roi && (

                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <Button variant="outlined"
                            startIcon={<HighlightAltIcon style={{ fontSize: 25, marginLeft: langReducer == "ar" && 10 }} />}
                            disabled={isBackendRestarting}
                            onClick={() => {
                              handleStopStream();
                              getFrame()
                              setFirstFrameForRoi(null)
                              setOpenRoiModal({ open: true, model: item.name })
                            }}
                            sx={{ height: "auto", fontSize: 16 }}>{t('select-roi')}</Button>
                          <span className='text-[12px] ml-1  text-end'>
                            <span className={`${langReducer == "en" ? 'mr-1' : 'ml-1'} font-sans text-gray-700 font-semibold`}>{formatNumberForLocale(ROIs[item.name].length)}</span>
                            <span className='text-gray-500 '>{t('rois-selected')}</span>
                          </span>
                        </div>
                      )
                    }
                  </div>
                )
              })
            }
          </div>



          <div className='w-full flex flex-col gap-4'>

            <div style={{ border: `1px solid ${colors?.borderColor}`, borderRadius: 5, padding: "5px 12px", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.9em" }}>{t('debug-mode')}</span>
              {
                <span>
                  <Switch
                    color='success'
                    checked={debugMode}
                    onChange={(e) => { setDebugMode(e.target.checked); setDisableSaveButton(false) }}
                    inputProps={{ 'aria-label': 'controlled' }}
                    disabled={isBackendRestarting}
                  />
                </span>
              }
            </div>
            <LoadingButton
              loading={isConfigUpdating}
              loadingPosition="start"
              startIcon={<SaveIcon style={{ fontSize: 25, marginLeft: langReducer == "ar" && 10 }} />}
              variant="contained"
              disabled={isBackendRestarting || disableSaveButton}
              onClick={handleConfigSave}
              sx={{ background: colors?.primary, height: "40px", '&:hover': { background: colors?.primary, opacity: 0.9 } }}
            >{t('save')}</LoadingButton>
          </div>
        </div>
      </Drawer>

      {showHeader && (
        <header className='normalHeader'
          style={{ fontFamily: langReducer == "ar" ? arabicFont : englishFont }}
        >
          <div className='headerLeftDiv'>
            <img className='headerLogo' src="/images/elm_logo_new.png" alt="logo" />
            {/* <span className='headerLogoTitle'>Elm Research Center</span> */}
          </div>
          <div className='headerRightDiv' style={{ background: colors?.primary || constants.headerFooterColor, borderLeft: langReducer == "en" && "10px solid #AA894C", borderRight: langReducer == "ar" && "10px solid #AA894C" }}>
            <div className='headerRightDivWebsiteName'>
              <div className='headerMainHeading' style={{ fontFamily: langReducer == "ar" ? arabicFont : englishFont }} >
                {t('people-analytics')}
              </div>
              <p className='headerSubHeading' style={{ fontFamily: langReducer == "ar" ? arabicFont : englishFont }}>{t('elm-research-center')}</p>
            </div>
            {/* <div className='headerRightDateDiv'></div> */}
            <div className='headerRightPersonSearchDiv' style={{ borderRight: langReducer == "en" && `1px solid ${colors?.textPrimary || '#262559'}`, borderLeft: langReducer == "ar" && `1px solid ${colors?.textPrimary || '#262559'}` }}>
              <Tooltip title={t('find-person')} placement="bottom" arrow={true}>
                <div>
                  <PersonSearchIcon
                    onClick={handleOpenPersonSearchModal}
                    sx={{ color: colors?.surface || "#fff", fontSize: 30, cursor: "pointer" }} // "#44C8F5"
                    title={t('search-person')}
                  />
                </div>
              </Tooltip>
            </div>

            {/* Language Dropdown */}
            <div style={{ height: "60px", width: "60px", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Tooltip title={t('language')} placement="bottom" arrow={true}>
                <div>
                  <IconButton
                    onClick={handleLanguageIconClick}
                    size="small"
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}

                  >
                    <LanguageIcon sx={{ color: colors?.surface || "#fff" }} />
                    {/* <Avatar sx={{ width: 32, height: 32 }}>M</Avatar> */}
                  </IconButton>
                </div>
              </Tooltip>

              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleLanguageDropDownClose}
                onClick={handleLanguageDropDownClose}
                slotProps={{
                  paper: {
                    elevation: 0,
                    sx: {
                      overflow: 'visible',
                      zIndex: 9999999,
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                      mt: 1.5,
                      '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      '&::before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 10,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={() => handleChangeLangDropdown("en")} style={{ background: langReducer == "en" && "#183E61", color: langReducer == "en" && "#fff" }}>
                  <US title="English" style={{ width: 28, marginRight: 10 }} />
                  {t('english')}
                </MenuItem>
                <MenuItem onClick={() => handleChangeLangDropdown("ar")} style={{ background: langReducer == "ar" && "#183E61", color: langReducer == "ar" && "#fff" }}>
                  <SA title="Arabic" style={{ width: 28, marginRight: 10 }} />
                  {t('arabic')}
                </MenuItem>
                {/* <Divider /> */}
              </Menu>
            </div>
          </div>
          <button ref={startStreamButtonRef} onClick={handleStartStream} style={{ display: "none" }}>{t('start')}</button>
          {/* <button onClick={handleStopStream}>stop</button> */}
        </header>
      )}

      {showHeader && (
        <header className='mobileHeader'>
          <div className='headerLeftDiv'>
            <img className='headerLogo' src="/images/elm_logo.png" alt="logo" />
            {/* <span className='headerLogoTitle'>Elm Research Center</span> */}
          </div>
          <div className='headerRightDiv' style={{ background: colors?.primary || constants.headerFooterColor }}>

            {/* <div className='headerRightPersonSearchDiv'>
              <PersonSearchIcon
                onClick={handleOpenPersonSearchModal}
                sx={{ color: "#fff", fontSize: 30, cursor: "pointer" }} // "#44C8F5"
              />
            </div> */}
            <div className='hamburgerDiv' onClick={handleOpenMobileMenu} style={{ left: langReducer == "ar" && "5px", right: langReducer == "en" && "5px" }}>
              <ion-icon name="menu" style={{ color: "#fff", fontSize: 40 }}></ion-icon>
            </div>
            {/* Language Dropdown */}
            <div style={{ position: "absolute", left: langReducer == "ar" && "60px", right: langReducer == "en" && "60px", height: "60px", width: "60px", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Tooltip title="" >
                <IconButton
                  onClick={handleLanguageIconClick}
                  size="small"
                  aria-controls={open ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}

                >
                  <LanguageIcon sx={{ color: colors?.surface || "#fff" }} />
                  {/* <Avatar sx={{ width: 32, height: 32 }}>M</Avatar> */}
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleLanguageDropDownClose}
                onClick={handleLanguageDropDownClose}
                slotProps={{
                  paper: {
                    elevation: 0,
                    sx: {
                      overflow: 'visible',
                      zIndex: 9999999,
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                      mt: 1.5,
                      '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      '&::before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 10,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={() => handleChangeLangDropdown("en")} style={{ background: langReducer == "en" && "#183E61", color: langReducer == "en" && "#fff" }}>
                  <US title="English" style={{ width: 28, marginRight: 10 }} />
                  {t('english')}
                </MenuItem>
                <MenuItem onClick={() => handleChangeLangDropdown("ar")} style={{ background: langReducer == "ar" && "#183E61", color: langReducer == "ar" && "#fff" }}>
                  <SA title="Arabic" style={{ width: 28, marginRight: 10 }} />
                  {t('arabic')}
                </MenuItem>
                {/* <Divider /> */}
              </Menu>
            </div>
          </div>
          <button ref={startStreamButtonRef} onClick={handleStartStream} style={{ display: "none" }}>start</button>
          {/* <button onClick={handleStopStream}>stop</button> */}
        </header>
      )}
      {showHeader && (
        <MobileMenu isMobileMenuOpen={isMobileMenuOpen}>
          <div className='mobileMenuCameraSelectionSideBar'>
            <div className="mobileMenuPASideBarTopBox1">
              <div className='mobileMenuSiteSelectionDropdown'>
                <label htmlFor="siteName" className='siteNameLabel' style={{ left: "3%", fontFamily: langReducer == "ar" ? arabicFont : englishFont }}>SITE NAME</label>
                <FormControl sx={{ mt: 3, minWidth: 0, width: "100%" }}>
                  <Select id='siteName' value={"najran"} MenuProps={{
                    PaperProps: {
                      sx: {
                        textAlign: langReducer === 'ar' ? 'right' : 'left', // Aligns the MenuItem's text based on language direction
                        direction: langReducer === 'ar' ? 'rtl' : 'ltr', // RTL or LTR
                      },
                    },
                  }}>
                    <MenuItem value="najran">{t('najran')}</MenuItem>
                  </Select>
                </FormControl>
              </div>
              {sideBarItems.map((item, index) => (
                <div key={item + "_" + index} className={`${item.enable ? 'mobileMenuPASideBarItem' : 'mobileMenuPASideBarItemDisabled'} ${item["active"] && "active"}`}
                  style={{ opacity: item.enable ? 1 : 0.5, }}
                  onClick={item.enable ? () => handleSelectSideBarItem(index) : () => { }}>
                  <div className="PASideBarItemIconBox">
                    <VideoCameraBackIcon style={{ fontSize: "30px", color: item["active"] ? "#952D98" : "#2A6EBB" }} />
                  </div>

                  <div className="">{t('camera', { count: formatNumberForLocale(item["index"]) })}</div>
                </div>
              ))}
            </div>
          </div>
        </MobileMenu>
      )}

      <div className='mainBox' style={{
        fontFamily: langReducer == "en" ? englishFont : arabicFont,
        height: showHeader ? 'calc(100vh - 62px)' : '100vh',
        backgroundColor: colors?.surface
      }}>
        <Box className="settingsIconBox" sx={{ right: langReducer == "en" && 15, left: langReducer == "ar" && 15, bottom: 5, width: "max-content" }}>
          {isBackendRestarting && (
            <CircularProgress size={50} thickness={4} sx={{ position: "absolute", color: "#952D98" }} />
          )}
          <SettingsIcon onClick={!isBackendRestarting ? toggleConfigDrawer : () => { }}
            sx={{
              fontSize: 40, color: colors?.accent, cursor: "pointer", transition: "all 0.1s ease",
              ...(!isBackendRestarting && {
                '&:hover': {
                  opacity: 0.8,
                  fontSize: 41,
                  transition: "all 0.1s ease",
                }
              }),
              opacity: isBackendRestarting ? 0.5 : 1
            }}
          />

        </Box>

        <div className={`firstBox ${(tempModelsState.gender || tempModelsState.gaze) ? 'height-50' : 'height-70'}`}>

          <div className="PARightBoxChartsLeft">
            {/* SideBar */}
            <div className='cameraSelectionSideBar'>

              <div className="PASideBarTopBox1">

                <div className='siteSelectionDropdown'>
                  {/* <label htmlFor="siteName" className={`siteNameLabel ${langReducer == "ar" && 'siteNameLabelArabic'}`}
                    style={{ fontFamily: langReducer == "ar" ? arabicFont : englishFont, color: colors?.textPrimary }}>{t('site-name')}</label> */}
                  <FormControl sx={{ mt: 2, minWidth: 0, width: "100%" }}>
                    <Select id='siteName' value={"najran"}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            textAlign: langReducer === 'ar' ? 'right' : 'left', // Aligns the MenuItem's text based on language direction
                            direction: langReducer === 'ar' ? 'rtl' : 'ltr', // RTL or LTR
                          },
                        },
                      }}>
                      <MenuItem value="najran">{t('ELM HQ')}</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                {sideBarItems.map((item, index) => (
                  <div key={item + "_" + index} className={`${item.enable ? 'PASideBarItem' : 'PASideBarItemDisabled'} ${item["active"] && "active"}`}
                    style={{
                      flex: "initial", height: 60, width: "95%",
                      opacity: item.enable ? 1 : 0.5,
                      borderColor: colors?.accent
                    }}
                    onClick={item.enable ? () => handleSelectSideBarItem(index) : () => { }}                  >
                    <div className="PASideBarItemIconBox">
                      <VideoCameraBackIcon style={{ fontSize: "30px", color: item["active"] ? "#952D98" : "#2A6EBB" }} />
                    </div>

                    <div className="">{t('camera', { count: formatNumberForLocale(item["index"]) })}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* ------ IMAGE AND MAP AREA ------ */}
            <div className="PARightBoxChartsLeftCameraAndMap">

              {/* ---------- Video area ------------ */}
              <div className="imageParentBox">
                {
                  isView3 ? (
                    isView3VideoPlayed ?
                      <video controls={false} autoPlay className='videoDisplayingTag'>
                        <source src={view3} type="video/mp4" />
                        {t('browser-not-supported')}
                      </video> :
                      <div className="loadingIndicator">
                        <PlayCircleIcon fontSize="large" color="error" sx={{ cursor: "pointer" }} onClick={() => { setIsView3VideoPlayed(true) }} />
                      </div>
                  ) :

                    (
                      constants.streaming ? (
                        ((selectedCamera === "camera1" || (selectedCamera === "camera2")) && constants.camera_1_live) ? (
                          camera1StreamInfo.error ? (
                            <div className='connectionErrorContainer'>
                              <div className='connectionErrorContent'>
                                <SignalWifiOffIcon className='connectionErrorIcon' />
                                <h3 className='connectionErrorTitle'>{t('connection-failed')}</h3>
                                <p className='connectionErrorMessage'>{t('rtsp-connection-required')}</p>
                                {/* <div className='connectionErrorDetails'>
                                  <p>{t('please-check-rtsp-url')}</p>
                                  <p>{t('ensure-camera-is-online')}</p>
                                </div> */}
                                {/* <button 
                                  className='retryConnectionButton'
                                  onClick={handleStartStream}
                                  style={{ 
                                    backgroundColor: colors?.primary || '#952D98',
                                    color: colors?.surface || '#fff'
                                  }}
                                >
                                  {t('retry-connection')}
                                </button> */}
                              </div>
                            </div>
                          ) : camera1StreamInfo.stream ? (
                            <img src={camera1StreamInfo.stream} alt="Stream" className="streamImage" />
                          ) : (
                            <div className="loadingIndicator">
                              <CircularProgress />
                            </div>
                          )
                        ) : (
                          (selectedCamera === "camera2" && constants.camera_2_live) ? (
                            camera2StreamInfo.error ? (
                              <div className='connectionErrorContainer'>
                                <div className='connectionErrorContent'>
                                  <SignalWifiOffIcon className='connectionErrorIcon' />
                                  <h3 className='connectionErrorTitle'>{t('connection-failed')}</h3>
                                  <p className='connectionErrorMessage'>{t('rtsp-connection-required')}</p>
                                  {/* <div className='connectionErrorDetails'>
                                    <p>{t('please-check-rtsp-url')}</p>
                                    <p>{t('ensure-camera-is-online')}</p>
                                  </div>
                                  <button 
                                    className='retryConnectionButton'
                                    onClick={handleStartStream}
                                    style={{ 
                                      backgroundColor: colors?.primary || '#952D98',
                                      color: colors?.surface || '#fff'
                                    }}
                                  >
                                    {t('retry-connection')}
                                  </button> */}
                                </div>
                              </div>
                            ) : camera2StreamInfo.stream ? (
                              <img src={camera2StreamInfo.stream} alt="Stream" className="streamImage" />
                            ) : (
                              <div className="loadingIndicator"> <CircularProgress /> </div>
                            )
                          ) : (
                            <div className='connectionErrorContainer'>
                              <div className='connectionErrorContent'>
                                <VideoCameraFrontIcon className='connectionErrorIcon' />
                                <h3 className='connectionErrorTitle'>{t('stream-is-offline')}</h3>
                                <p className='connectionErrorMessage'>{t('camera-not-available')}</p>
                                <div className='connectionErrorDetails'>
                                  <p>{t('please-check-camera-status')}</p>
                                  <p>{t('contact-system-administrator')}</p>
                                </div>
                              </div>
                            </div>
                          )
                        )
                      ) : (
                        <div className='connectionErrorContainer'>
                          <div className='connectionErrorContent'>
                            <VideoCameraFrontIcon className='connectionErrorIcon' />
                            <h3 className='connectionErrorTitle'>{t('stream-is-offline')}</h3>
                            <p className='connectionErrorMessage'>{t('streaming-disabled')}</p>
                            <div className='connectionErrorDetails'>
                              <p>{t('streaming-service-unavailable')}</p>
                              <p>{t('contact-system-administrator')}</p>
                            </div>
                          </div>
                        </div>
                      )
                    )
                }
              </div>

              {/* ---------- OSM Map area ------------ */}
              <div className="mapParentBox" style={{ height: "100%" }}>
                {/* <Map
                  markersPosition={markersPosition}
                  setMarkersPosition={setMarkersPosition}
                  handleSelectSideBarItem={handleSelectSideBarItem}
                /> */}

                <GoogelMapComponent
                  googleMarkerPositions={googleMarkerPositions}
                  handleSelectSideBarItem={handleSelectSideBarItem}
                />
              </div>

              {/* Date Time and Date Selecter divs */}
              <div className="PARightBoxChartsRight">
                <div className="PAMostRigtTopBox">

                  <div className="PAInfoCard" style={{ borderBottom: `3px solid ${colors?.accent}` }}>
                    <div className='PAInfoCardText'>
                      {t(monthNames[time.getMonth()].toLocaleLowerCase())} <br />{" "}
                      <span className="date"></span>
                      {formatNumberForLocale(time.getDate())}
                    </div>
                  </div>
                  {/* <div className="PAInfoCard">
                    <div className='PAInfoCardText'>
                      {t('time')} <br /> <span className="date"></span>
                      {formatTimeForLocale(time)}
                    </div>
                  </div> */}


                  <DateSelector
                    dateType="selectedDate"
                    historyDate={historyDate}
                    enabledDates={enabledDates}
                    setEnabledDates={setEnabledDates}
                    cameraIndex={cameraIndex}
                    handleDataSelectorChange={handleDateChange}
                    helperBackend={constants.helperBackend}
                  />
                  {
                    isPdfDownloading && (
                      <CircularProgress size={35} thickness={3} sx={{ color: "#952D98", position: "absolute", bottom: 11, right: langReducer == "en" && 12, left: langReducer == "ar" && 17 }} />
                    )
                  }

                </div>
              </div>
            </div>
            {/* ------ IMAGE AND MAP AREA ------ */}

          </div>

        </div>

        <div className="mobileViewPAMostRigtTopBox">

          <div className="mobileViewPAInfoCard">
            <div className='mobileViewPAInfoCardText' style={{ fontFamily: langReducer == "ar" ? arabicFont : englishFont }}>
              {/* {monthNames[time.getMonth()]} <br />{" "} */}
              {t(monthNames[time.getMonth()].toLocaleLowerCase())} <br />{" "}
              <span className="mobileViewDate" style={{ fontFamily: langReducer == "ar" ? arabicFont : englishFont }}></span>
              {/* {time.getDate()} */}
              {formatNumberForLocale(time.getDate())}
            </div>
          </div>
          <div className="mobileViewPAInfoCard">
            <div className='mobileViewPAInfoCardText'>
              {/* Time <br /> <span className="date"></span>
              {time.toLocaleTimeString()} */}
              {t('time')} <br /> <span className="date"></span>
              {formatTimeForLocale(time)}
            </div>
          </div>


          <DateSelector
            dateType="selectedDate"
            historyDate={historyDate}
            enabledDates={enabledDates}
            setEnabledDates={setEnabledDates}
            cameraIndex={cameraIndex}
            handleDataSelectorChange={handleDateChange}
            helperBackend={constants.helperBackend}

          />
          {
            isPdfDownloading && (
              <CircularProgress size={35} thickness={3} sx={{ color: "#952D98", position: "absolute", bottom: 15, right: langReducer == "en" && 12, left: langReducer == "ar" && 12 }} />
            )
          }

        </div>

        <div className={`secondBox ${(tempModelsState.gender || tempModelsState.gaze) ? 'height-18' : 'height-calc-18-12'}`}>
          {/* Gender Cards Area */}
          {/* <div className="PACenterBottomArea"> */}
          {/* <div className="PACenterBottomAreadiv1"> */}

          <div className="PAGenderCardBox" style={{ borderBottom: `3px solid ${colors?.accent}` }}>
            <GenderCard
              conditionText={"total"}
              type="img"
              imgSrc={liveCount}
              heading={constants.card1Text}
              imgSrcLeft={femalIcon}
              imgSrcRight={maleIcon}
              // imgLeftWidth={(tempModelsState.gender || tempModelsState.gaze) ? "2.6vw" : "3.5vw"}
              imgLeftWidth={(tempModelsState.gender || tempModelsState.gaze) ? "gendercardIconSize1" : "gendercardIconSize2"}
              imgRightWidth={""}
              value={
                ((cameraIndex == 0) || (cameraIndex == 1)) ?
                  (camera1StreamInfo.data && camera1StreamInfo?.data.length > 0) ? camera1StreamInfo.data[0].instant_count : 0
                  : 0
              }
              noCharts={(tempModelsState.gender || tempModelsState.gaze)}
              textSizeClassName={(tempModelsState.gender || tempModelsState.gaze) ? "genderCardTitleSize1" : "genderCardTitleSize2"}
              colors={colors}
            />
          </div>
          {(tempModelsState.gender) && (
            <div className="PAGenderCardBox" style={{ borderBottom: `3px solid ${colors?.accent}` }}>


              <GenderCard
                heading={constants.card2Text}
                imgSrcLeft={femalIcon}
                imgSrcRight={maleIcon}
                imgLeftWidth={(tempModelsState.gender || tempModelsState.gaze) ? "femaleIconSize1" : "femaleIconSize2"}
                imgRightWidth={(tempModelsState.gender || tempModelsState.gaze) ? "femaleIconSize1" : "femaleIconSize2"}
                leftText={
                  ((selectedCamera === "camera1") || (selectedCamera === "camera2")) && camera1StreamInfo.data && camera1StreamInfo.data.length >= 1 ?
                    camera1StreamInfo.data[0].cumulative_gender.female :
                    selectedCamera === "camera2" && camera2StreamInfo.data && camera2StreamInfo.data.length >= 1 ?
                      camera1StreamInfo.data[0].cumulative_gender.female :
                      0
                }
                rightText={
                  ((selectedCamera === "camera1") || (selectedCamera === "camera2")) && camera1StreamInfo.data && camera1StreamInfo.data.length >= 1 ?
                    camera1StreamInfo.data[0].cumulative_gender.male :
                    selectedCamera === "camera2" && camera2StreamInfo.data && camera2StreamInfo.data.length >= 1 ?
                      camera1StreamInfo.data[0].cumulative_gender.male :
                      0
                }
                noCharts={(tempModelsState.gender || tempModelsState.gaze)}
                textSizeClassName={(tempModelsState.gender || tempModelsState.gaze) ? "genderCardTitleSize1" : "genderCardTitleSize2"}
                colors={colors}
              />

            </div>
          )}

          {/* {(tempModelsState.ethnicity) && (
            <div className="PAGenderCardBox">
              <GenderCard
                // heading="Side 2"
                heading={constants.card3Text}
                imgSrcLeft={foreignerIconCopy}
                imgSrcRight={maleIcon}
                imgLeftWidth={(tempModelsState.gender || tempModelsState.gaze) ? "foreignerIconSize1" : "foreignerIconSize2"}
                imgRightWidth={(tempModelsState.gender || tempModelsState.gaze) ? "femaleIconSize1" : "femaleIconSize2"}

                leftText={
                  ((selectedCamera === "camera1") || (selectedCamera === "camera2")) && camera1StreamInfo.data && camera1StreamInfo.data.length >= 1 ?
                    camera1StreamInfo.data[0].cumulative_ethnicity.non_local :
                    selectedCamera === "camera2" && camera2StreamInfo.data ?
                      camera1StreamInfo.data[0].cumulative_ethnicity.non_local :
                      0
                }
                rightText={
                  ((selectedCamera === "camera1") || (selectedCamera === "camera2")) && camera1StreamInfo.data && camera1StreamInfo.data.length >= 1 ?
                    camera1StreamInfo.data[0].cumulative_ethnicity.local :
                    selectedCamera === "camera2" && camera2StreamInfo.data ?
                      camera1StreamInfo.data[0].cumulative_ethnicity.local :
                      0
                }
                noCharts={(tempModelsState.gender || tempModelsState.gaze)}
                textSizeClassName={(tempModelsState.gender || tempModelsState.gaze) ? "genderCardTitleSize1" : "genderCardTitleSize2"}
              />
            </div>
          )} */}
          <div className="PAGenderCardBox" style={{ borderBottom: `3px solid ${colors?.accent}` }}>
            <GenderCard
              heading={constants.card4Text}
              conditionText={"total"}
              type="img"
              imgSrc={multipleUserIcon}
              // imgLeftWidth={(tempModelsState.gender || tempModelsState.gaze) ? "4vw" : "5vw"}
              imgLeftWidth={(tempModelsState.gender || tempModelsState.gaze) ? "gendercardImgSize1" : "gendercardImgSize2"}
              imgRightWidth={""}
              value={
                ((cameraIndex == 0) || (cameraIndex == 1)) ?
                  (camera1StreamInfo.data && camera1StreamInfo?.data.length > 0) ? camera1StreamInfo.data[0].cumulative_count : 0
                  : 0
              }
              noCharts={(tempModelsState.gender || tempModelsState.gaze)}
              textSizeClassName={(tempModelsState.gender || tempModelsState.gaze) ? "genderCardTitleSize1" : "genderCardTitleSize2"}
              colors={colors}
            />
          </div>

          <div className="PAGenderCardBox" style={{ borderBottom: `3px solid ${colors?.accent}` }}>
            <TrendCard
              trendCardData={trendCardData}
              cameraIndex={cameraIndex}
              noCharts={(tempModelsState.gender || tempModelsState.gaze)}
              colors={colors}
            />
          </div>

          {/* </div> */}
          {/* </div> */}
          {/* Gender Cards Area */}
        </div>

        {(tempModelsState.gender || tempModelsState.gaze) &&
          <div className='thirdBox' style={{ transition: "1s ease-in-out" }} >
            {/* <div className="PASideBarBottomBox" style={{ display: "flex", flexDirection: "column", gap: 10, justifyContent: "center", height: "100%", }}> */}
            <div className="doughnutAndGroupBarChart">
              {
                (tempModelsState.gender) &&
                (tempModelsState.gaze ?
                  <div id="donutChart" className="doughtnut graph">
                    <MaleFemaleAreaChart title={"GENDER"} type="male" chartData={areaChartData} cameraIndex={cameraIndex} />
                  </div>
                  :

                  <div id="donutChart" className="doughtnut graph" >
                    <AreaChart title={"MALE"} type="male" chartData={areaChartData} cameraIndex={cameraIndex} />
                  </div>)
              }


              {
                tempModelsState.gaze ?
                  <div id="groupBarChart" className={`${tempModelsState.gender ? 'graph' : 'graph onlyGazeGraph'}`}>
                    <GazeChart title="GAZE" type="" chartData={gazeChartData} cameraIndex={cameraIndex} />
                  </div>
                  :
                  tempModelsState.gender &&
                  <div id="groupBarChart" className='graph'>
                    <AreaChart title={"FEMALE"} type='female' chartData={areaChartData} cameraIndex={cameraIndex} />
                  </div>
              }

            </div>

            {/* </div> */}
          </div>
        }

      </div >
    </main >
  )
}

export default PeopleAnalyticsV3