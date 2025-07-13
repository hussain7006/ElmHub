import React, { memo, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { makeStyles } from '@material-ui/core/styles';

import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import { constants } from '../../constants/constantsV3';


import styles from "./personSearch.module.css"
import { CircularProgress, Slider, styled } from '@mui/material';

import ImageSlider from '../imageSlider/ImageSlider'
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { searchPerson } from '../../apis/personSearch';
import { formatNumberForLocale } from '../../utils/utils';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "70vw",
    height: "95vh",
    bgcolor: 'background.paper',
    boxShadow: 24,
    display: "flex",
    flexDirection: "column",
    outline: "none",
};

// const PersonSearchModal = memo(function ChartModal(props) {
const PersonSearchModal = memo(function ChartModal({ openPersonSearchModal, closePersonSearchModal }) {

    // const { openPersonSearchModal, closePersonSearchModal } = props;
    const { t } = useTranslation();
    let langReducer = useSelector((data) => data.lang)
    const fileInputRef = useRef(null); // Use ref to access input field

    const useStyles = makeStyles({
        heading: {
            fontSize: "1.2em",
            fontWeight: "bold",
            color: "#0056a6b8",
        }
    });
    const classes = useStyles();

    // const [isStreamRunning, setIsStreamRunning] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null);
    const [resetSlider, setResetSlider] = useState(false);
    const [threshold, setThreshold] = useState(800);
    const [topN, setTopN] = useState(5);

    const [redisImages, setRedisImages] = useState(null)

    const personSearchBaseUrl = constants.cam1IP;

    const handleImageUploadOnchange = (event) => {
        setSelectedFile(event.target.files[0]);
    };


    const handleUploadImageButton = async () => {
        if (!selectedFile) {
            Swal.fire({ icon: "info", title: t('swal-info'), text: t('please-upload-an-image-to-search') });
            return;
        }
        setIsLoading(true);
        try {
            const res = await searchPerson(selectedFile, topN, threshold);
            const { success, data, error } = res;
            console.log(res);

            if (!success) {
                Swal.fire({ icon: "error", title: t('swal-error'), text: error ? error.message : t('something-went-wrong') });

                setSelectedFile(null);

                fileInputRef.current.value = null;
                setResetSlider(!resetSlider);

            } else if (data?.images?.length > 0) {
                setRedisImages(data.images);
            } else {
                Swal.fire({ icon: "error", title: t('swal-error'), text: t('no-images-found') });

                setResetSlider(!resetSlider);

                setSelectedFile(null);
                fileInputRef.current.value = null;
            }
        } catch (error) {
            Swal.fire({ icon: "error", title: t('swal-error'), text: t('something-went-wrong') });

            setResetSlider(!resetSlider);

            setSelectedFile(null);
            fileInputRef.current.value = null;

        } finally {
            setIsLoading(false);

        }
    };



    const PrettoSlider = styled(Slider)(({ theme, langReducer }) => ({
        color: '#52af77',
        height: 8,
        '& .MuiSlider-track': {
            border: 'none',
        },
        '& .MuiSlider-thumb': {
            height: 24,
            width: 24,
            // marginLeft: langReducer === 'ar' ? '15px' : '5px', // Adjust thumb for RTL/LTR
            marginRight: langReducer === 'ar' ? '-25px' : '0', // Adjust for RTL
            backgroundColor: '#fff',
            border: '2px solid currentColor',
            '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                boxShadow: 'inherit',
            },
            '&::before': {
                display: 'none',
            },
        },
        '& .MuiSlider-valueLabel': {
            lineHeight: 1.2,
            fontSize: 12,
            background: 'unset',
            padding: 0,
            width: 32,
            height: 32,
            borderRadius: '50% 50% 50% 0',
            backgroundColor: '#52af77',
            transformOrigin: 'bottom left',
            transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
            '&::before': { display: 'none' },
            '&.MuiSlider-valueLabelOpen': {
                transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
            },
            '& > *': {
                transform: 'rotate(45deg)',
            },
        },
    }));


    useEffect(() => {
        setSelectedFile(null);
    }, [openPersonSearchModal])

    return (
        <div style={{ direction: langReducer == "ar" ? "rtl" : "ltr" }}>
            <Modal
                open={openPersonSearchModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{ padding: "0px !important", direction: langReducer == "ar" ? "rtl" : "ltr" }}
            >
                <Box sx={style}>
                    {
                        isLoading &&
                        (
                            <Box sx={{ zIndex: 5, position: "absolute", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <CircularProgress size={100} thickness={6} sx={{ color: "#952D98", zIndex: 1 }} />
                            </Box>
                        )
                    }

                    <Box sx={{ flex: 1 }}>
                        {/* ---- Header ---- */}
                        <Box sx={{ background: "#0B2447", padding: "10px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>

                            <Typography id="modal-modal-title" variant="h6" component="h2"
                                sx={{ flex: 1, color: "#fff", padding: "0px" }}
                            >
                                <PersonSearchIcon className={`${langReducer == "ar" ? 'ml-3 mr-2' : `mr-3 ml-2`}`} style={{ fontSize: 28 }} />
                                {t('person-search')}
                            </Typography>

                            <Box
                                onClick={closePersonSearchModal}
                                sx={{ height: "100%", width: "max-content", cursor: "pointer", '&:hover': { opacity: 0.7, borderRadius: "50%" } }}>
                                ❌
                            </Box>
                        </Box>

                        {/* Upload image section */}
                        <section
                            style={{
                                border: constants.showBorders ? "5px solid red" : "none",
                                borderBottom: !constants.showBorders ? "5px solid rgba(56, 65, 74, 0.1)" : "5px solid red",
                                boxSizing: "border-box",
                                // height: "150px",
                                display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "", gap: 20,
                                padding: "15px",
                            }}
                        >
                            {/* Upload card */}
                            <div style={{
                                border: constants.showBorders ? "5px solid brown" : "none",
                                // borderBottom: constants.showBorders && "5px solid red",
                                boxSizing: "border-box",
                                display: "flex", flexDirection: "column", alignItems: "start", justifyContent: "center", gap: 20,
                                height: "100%",
                                boxShadow: "0px 0px 2px 0 rgba(149, 45, 152, 0.2), 0px 0px 2px 0 rgba(149, 45, 152, 0.2)",
                                padding: 10,
                                borderRadius: 10,
                                borderBottom: "3px solid #952D98",
                                flex: 1,
                                position: "relative"
                            }}>
                                <label htmlFor="uploadImage"
                                    style={{
                                        fontWeight: "bold",
                                        background: "#952D98",
                                        color: "#fff",
                                        width: "max-content",
                                        padding: "5px 10px",
                                        fontSize: 12,
                                        borderRadius: "5px",
                                        letterSpacing: "1.5px"

                                    }}
                                >
                                    {t('find-person').toUpperCase()}
                                </label>
                                <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                                    <input id='uploadImage' ref={fileInputRef} className={styles.uploadImage} type="file" onChange={handleImageUploadOnchange} />
                                    <button className={styles.uploadButton} onClick={handleUploadImageButton} disabled={isLoading} style={{ opacity: isLoading ? 0.7 : 1 }} > {t('upload').toUpperCase()} </button>
                                </div>

                                <div style={{
                                    position: "absolute",
                                    right: langReducer == "en" && 10,
                                    left: langReducer == "ar" && 10,
                                    top: 5, width: "55px", height: "55px"
                                }}>
                                    <img src={selectedFile ? URL.createObjectURL(selectedFile) : "/images/male-user.png"} alt="Img"
                                        style={{ width: "50px", height: "50px", objectFit: "contain", borderRadius: "10%", }}
                                    />
                                </div>
                            </div>

                            {/* Threshold Card */}
                            <div style={{
                                border: constants.showBorders ? "5px solid brown" : "none",
                                borderBottom: "3px solid #952D98",
                                boxSizing: "border-box",
                                display: "flex", flexDirection: "column", alignItems: "start", justifyContent: "center", gap: 20,
                                height: "100%", width: "18vw",
                                position: "relative",
                                boxShadow: "0px 0px 2px 0 rgba(149, 45, 152, 0.2), 0px 0px 2px 0 rgba(149, 45, 152, 0.2)",
                                padding: 10,
                                borderRadius: 10,
                                flex: 1
                            }}>
                                <label htmlFor="threshold" style={{
                                    fontWeight: "bold",
                                    background: "#952D98",
                                    color: "#fff",
                                    width: "max-content",
                                    padding: "5px 10px",
                                    fontSize: 12,
                                    borderRadius: "5px",
                                    letterSpacing: "1.5px"

                                }}>
                                    {t('threshold').toUpperCase()}
                                </label>

                                <div style={{ position: "relative", width: "100%", height: 40, bottom: 0 }}>
                                    <span
                                        style={{
                                            position: "absolute",
                                            right: langReducer == "en" && 0,
                                            left: langReducer == "ar" && 0,
                                            bottom: -5, fontWeight: "bold", fontSize: 12
                                        }}
                                    >{formatNumberForLocale(threshold)}</span>
                                    <PrettoSlider
                                        // valueLabelDisplay="auto"
                                        aria-label="pretto slider"
                                        // defaultValue={350}
                                        step={5}
                                        max={10000}
                                        value={threshold}
                                        onChange={(e) => setThreshold(e.target.value)}
                                        track={'normal'}
                                        langReducer={langReducer} // Pass the language state
                                    // marks

                                    />
                                </div>
                            </div>
                        </section>


                        {/* Carousel Section */}
                        <section style={{ border: constants.showBorders ? "5px solid green" : "none", boxSizing: "border-box", padding: "0px 20px" }}>
                            <div
                                style={{
                                    border: constants.showBorders ? "5px solid blue" : "none",
                                    boxSizing: "border-box",
                                    width: "100%",
                                    display: "flex", flexDirection: "column",
                                    padding: "10px 0px"

                                }}
                            >
                                <div style={{
                                    fontWeight: "bold",
                                    background: "#952D98",
                                    color: "#fff",
                                    width: "max-content",
                                    padding: "5px 10px",
                                    fontSize: 12,
                                    borderRadius: "5px",
                                    letterSpacing: "1.5px"

                                }}>
                                    {t('result').toUpperCase()}
                                </div>
                                <div style={{
                                    border: constants.showBorders ? "5px solid pink" : "none",
                                    boxSizing: "border-box",
                                    display: "flex",
                                    width: "100%",
                                    height: "100%"
                                }}>

                                    <ImageSlider redisImages={redisImages} openPersonSearchModal={openPersonSearchModal} selectedFile={selectedFile} resetSlider={resetSlider} />
                                </div>
                            </div>

                        </section>
                    </Box>
                    {/* -- Footer -- */}
                    <Box sx={{ display: "flex", justifyContent: "end", background: "#c0cbd5", padding: "5px" }}>
                        <Button
                            variant='contained'
                            onClick={closePersonSearchModal}
                            sx={{
                                borderRadius: "5px !important", background: "#952D98",
                                '&:hover': {
                                    backgroundColor: "#952D98",
                                    opacity: 0.9
                                },
                            }}
                        >
                            {t('close').toUpperCase()}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div >
    );
})

export default PersonSearchModal