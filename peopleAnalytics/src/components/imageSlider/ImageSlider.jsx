import React, { useEffect, useRef, useState } from 'react'
import ImageGallery from "react-image-gallery";


import "./image-gallery.css"
import { convertTimestampToDatetime, formatNumberForLocale } from '../../utils/utils';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';



const ImageSlider = ({ redisImages, openPersonSearchModal, selectedFile, resetSlider }) => {
    const { t } = useTranslation();
    const langReducer = useSelector((data) => data.lang)
    const [selectedCamera, setSelectedCamera] = useState("all");

    const defaultImages = useRef([
        {
            original: "/images/male-user.png",
            thumbnail: "/images/male-user.png",
            description: `<ul style="text-align: ${langReducer == 'ar' ? 'right' : 'left'}">
                            <li><span style="color:black; font-weight: bold; margin-left:${langReducer == 'ar' && '10px'};margin-right:${langReducer == 'en' && '10px'}">${t('timestamp').toUpperCase()}:</span>--/--/---- - --:--:--</li>
                            <li><span style="color:black; font-weight: bold; margin-left:${langReducer == 'ar' && '10px'};margin-right:${langReducer == 'en' && '10px'}">${t('distance').toUpperCase()}: </span>---.------</li>
                            <li><span style="color:black; font-weight: bold; margin-left:${langReducer == 'ar' && '10px'};margin-right:${langReducer == 'en' && '10px'}">${t('camera-id').toUpperCase()}:</span>-------</li>
                        </ul>`
        },
        {
            original: "/images/male-user.png",
            thumbnail: "/images/male-user.png",
            description: `<ul style="text-align: ${langReducer == 'ar' ? 'right' : 'left'}">
                            <li><span style="color:black; font-weight: bold; margin-left:${langReducer == 'ar' && '10px'};margin-right:${langReducer == 'en' && '10px'}">${t('timestamp').toUpperCase()}:</span>--/--/---- - --:--:--</li>
                            <li><span style="color:black; font-weight: bold; margin-left:${langReducer == 'ar' && '10px'};margin-right:${langReducer == 'en' && '10px'}">${t('distance').toUpperCase()}: </span>---.------</li>
                            <li><span style="color:black; font-weight: bold; margin-left:${langReducer == 'ar' && '10px'};margin-right:${langReducer == 'en' && '10px'}">${t('camera-id').toUpperCase()}:</span>-------</li>
                        </ul>`
        },
        {
            original: "/images/male-user.png",
            thumbnail: "/images/male-user.png",
            description: `<ul style="text-align: ${langReducer == 'ar' ? 'right' : 'left'}">
                            <li><span style="color:black; font-weight: bold; margin-left:${langReducer == 'ar' && '10px'};margin-right:${langReducer == 'en' && '10px'}">${t('timestamp').toUpperCase()}:</span>--/--/---- - --:--:--</li>
                            <li><span style="color:black; font-weight: bold; margin-left:${langReducer == 'ar' && '10px'};margin-right:${langReducer == 'en' && '10px'}">${t('distance').toUpperCase()}: </span>---.------</li>
                            <li><span style="color:black; font-weight: bold; margin-left:${langReducer == 'ar' && '10px'};margin-right:${langReducer == 'en' && '10px'}">${t('camera-id').toUpperCase()}:</span>-------</li>
                        </ul>`
        },
        {
            original: "/images/male-user.png",
            thumbnail: "/images/male-user.png",
            description: `<ul style="text-align: ${langReducer == 'ar' ? 'right' : 'left'}">
                            <li><span style="color:black; font-weight: bold; margin-left:${langReducer == 'ar' && '10px'};margin-right:${langReducer == 'en' && '10px'}">${t('timestamp').toUpperCase()}:</span>--/--/---- - --:--:--</li>
                            <li><span style="color:black; font-weight: bold; margin-left:${langReducer == 'ar' && '10px'};margin-right:${langReducer == 'en' && '10px'}">${t('distance').toUpperCase()}: </span>---.------</li>
                            <li><span style="color:black; font-weight: bold; margin-left:${langReducer == 'ar' && '10px'};margin-right:${langReducer == 'en' && '10px'}">${t('camera-id').toUpperCase()}:</span>-------</li>
                        </ul>`
        },

        // {
        //     original: "https://picsum.photos/id/1019/1000/600/",
        //     thumbnail: "https://picsum.photos/id/1019/250/150/",
        // },
        // {
        //     original: "https://picsum.photos/id/1015/1000/600/",
        //     thumbnail: "https://picsum.photos/id/1015/250/150/",
        // },
        // {
        //     original: "https://picsum.photos/id/1019/1000/600/",
        //     thumbnail: "https://picsum.photos/id/1019/250/150/",
        // },
    ])
    const [images, setImages] = useState(defaultImages.current)
    // useEffect(() => {

    //     if (redisImages) {
    //         console.log("redisImages", redisImages);

    //         const structuredImages = redisImages.map((item) => {
    //             console.log("selectedCamera:", selectedCamera.replaceAll(" ", "_"));
    //             console.log("item.result_camId:", item.result_camId.replaceAll(" ", "_"));

    //             if (selectedCamera.replaceAll(" ", "_") == item.result_camId.replaceAll(" ", "_") || selectedCamera == "all") {

    //                 let path = item.result_path.split("public")
    //                 path = path[1].replace(/\\/g, "/")
    //                 if (path.startsWith("//")) {
    //                     path = path.slice(1);
    //                 }

    //                 const dateTime = convertTimestampToDatetime(item.result_timestamp)
    //                 return {
    //                     original: path,
    //                     thumbnail: path,
    //                     description: `<ul style="text-align: ${langReducer == 'ar' ? 'right' : 'left'}">
    //                                 <li><span style="color:black; font-weight: bold; margin-left:${langReducer == 'ar' && '10px'};margin-right:${langReducer == 'en' && '10px'}">${t('timestamp').toUpperCase()}:</span>${dateTime}</li>
    //                                 <li><span style="color:black; font-weight: bold; margin-left:${langReducer == 'ar' && '10px'};margin-right:${langReducer == 'en' && '10px'}">${t('distance').toUpperCase()}: </span>${item.result_distance}</li>
    //                                 <li><span style="color:black; font-weight: bold; margin-left:${langReducer == 'ar' && '10px'};margin-right:${langReducer == 'en' && '10px'}">${t('camera-id').toUpperCase()}:</span>${item.result_camId}</li>
    //                             </ul>`

    //                 }
    //             }
    //         })
    //         console.log("structuredImages", structuredImages);

    //         if (!structuredImages.includes(undefined)) {
    //             setImages([...structuredImages])
    //         } else {
    //             setImages([...defaultImages.current])
    //         }
    //     }
    // }, [redisImages, selectedCamera])

    useEffect(() => {
        if (!redisImages) return; // Early exit if redisImages is undefined or null
        // console.log("redisImages", redisImages);

        const structuredImages = redisImages
            .filter(item =>
                selectedCamera.replaceAll(" ", "_") === item.result_camId.replaceAll(" ", "_") ||
                selectedCamera === "all"
            )
            .map(item => {
                let path = item.result_path.split("public")[1]?.replace(/\\/g, "/") || "";

                // Ensure path does not start with double slashes
                if (path.startsWith("//")) {
                    path = path.slice(1);
                }

                const dateTime = convertTimestampToDatetime(item.result_timestamp);

                return {
                    original: path,
                    thumbnail: path,
                    description: `
                        <ul style="text-align: ${langReducer === 'ar' ? 'right' : 'left'}">
                            <li>
                                <span style="color:black; font-weight: bold; margin-left:${langReducer === 'ar' ? '10px' : '0px'}; margin-right:${langReducer === 'en' ? '10px' : '0px'}">
                                    ${t('timestamp').toUpperCase()}:
                                </span>${dateTime}
                            </li>
                            <li>
                                <span style="color:black; font-weight: bold; margin-left:${langReducer === 'ar' ? '10px' : '0px'}; margin-right:${langReducer === 'en' ? '10px' : '0px'}">
                                    ${t('distance').toUpperCase()}:
                                </span>${item.result_distance}
                            </li>
                            <li>
                                <span style="color:black; font-weight: bold; margin-left:${langReducer === 'ar' ? '10px' : '0px'}; margin-right:${langReducer === 'en' ? '10px' : '0px'}">
                                    ${t('camera-id').toUpperCase()}:
                                </span>${item.result_camId}
                            </li>
                        </ul>`
                };
            });

        // console.log("structuredImages", structuredImages);

        // Set state with valid images or fallback to default images
        setImages(structuredImages.length > 0 ? structuredImages : [...defaultImages.current]);
    }, [redisImages, selectedCamera]);

    useEffect(() => {
        setImages([...defaultImages.current])
    }, [openPersonSearchModal, resetSlider])


    const renderItem = (item) => {
        return (
            <div className="customRenderMainBox">
                <img className='customRenderMainImage' src={item.original} alt={item.description} />
                <div>

                    {item.description && (
                        <span
                            className="image-gallery-description"
                            style={{ right: langReducer == 'ar' ? '0px' : "initial", left: langReducer == 'en' ? '0px' : "initial" }}
                            dangerouslySetInnerHTML={{ __html: item.description }}
                        ></span>
                    )}
                </div>
            </div>
        );
    };






    return (
        <div style={{
            position: "relative",
            boxSizing: "border-box",
            width: "100%",
            height: "calc(100vh - 52px - 146px - 40px - 30px - 50px)",
            // border: constants.showBorders ? "5px solid red" : "none",
            // border: "5px solid red",
            // border: "4px solid red"
        }}>
            <div style={{ width: 150, padding: 5, cursor: "pointer", zIndex: 999999999, position: "absolute", top: -35, right: langReducer == "en" && 0, left: langReducer == "ar" && 0 }}>
                <label style={{
                    fontWeight: "bold",
                    color: "#952d98",
                    width: "max-content",
                    padding: "5px 0px",
                    fontSize: 11,
                    borderRadius: "5px",
                    // background: "#952D98",
                    // color: "#fff",
                    // letterSpacing: "1.5px"
                }}> {t('select-camera').toUpperCase()}</label>
                <select onChange={(e) => setSelectedCamera(e.target.value)}
                    style={{ padding: 5, border: "2px solid", borderRadius: "5px", width: "100%" }}>
                    <option value="all">{t('all')}</option>
                    <option value="cam_1">{t('camera', { count: formatNumberForLocale(1) })}</option>
                    <option value="cam_2">{t('camera', { count: formatNumberForLocale(2) })}</option>
                </select>
            </div>
            <ImageGallery
                items={images}
                slideDuration={450}
                showThumbnails={true}
                showFullscreenButton={false}
                lazyLoad={true}
                thumbnailPosition="bottom" // top, right, left
                useTranslate3D={true}
                showPlayButton={false}
                isRTL={false}
                showBullets={false}
                showIndex={false}
                autoPlay={false}
                loading="lazy" // eager
                additionalClass="image-gallery-custom"
                originalHeight={false}
                renderItem={renderItem}
            />
        </div >
    )
}

export default ImageSlider