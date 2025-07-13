import React from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

import videoMarkerNavyBlue from "/images/images/video_camera_navy_blue.png"
// import videoMarkerPink from "/images/images/video_camera_Pink.png"
import video_camera_Purple from "/images/images/video_camera_Purple.png"

function GoogelMapComponent(props) {


    const { isLoaded } = useLoadScript({
        googleMapsApiKey: 'AIzaSyC0pi36NCYygUaAbn3wQrrmjtairvWDxGY', // Replace with your Google Maps API key
    });

    // const center = { lat: 17.4804638, lng: 44.1802129 };
    const center = { lat: 24.741000, lng: 46.63882438434457 };



    const createMarkerIcon = (item, index, size) => {
        // console.log(item);
        return {
            url: item.isActive ? video_camera_Purple : videoMarkerNavyBlue,
            scaledSize: new window.google.maps.Size(size, size), // Set custom size
            // url: item.isActive ? video_camera_Purple: (!item.enable)? videoMarkerPink : videoMarkerNavyBlue,
        }
    };

    return (
        <div style={{ width: "100%", height: "100%" }}>
            {!isLoaded ? (
                <h1>Loading...</h1>
            ) : (

                <div className="googleMapComponent" style={{ width: "100%", height: "100%", borderRadius: "15px", boxShadow: "rgba(0, 0, 0, 0.3) 0px 3px 7px -3px" }}>
                    <GoogleMap
                        mapContainerStyle={{ outline: "none", width: "100%", height: "100%", borderRadius: "15px", boxShadow: "rgba(0, 0, 0, 0.3) 0px 3px 7px -3px" }}
                        mapContainerClassName="googleMapComponent"
                        center={center}
                        zoom={16}
                        options={{
                            zoomControl: false,
                            disableDefaultUI: true,
                            fullscreenControl: false,
                            // minZoom: 15,
                            // maxZoom: 15,
                            draggable: false
                        }}

                    >
                        {/* <Marker position={center} label={"Najran"} title="VISITOR CENTER AL UKHDOOD" /> */}
                        <Marker position={center} label={"Elm"} title="ok " />


                        {props.googleMarkerPositions.map((item, index) => (
                            <Marker
                                onClick={item.enable ? () => props.handleSelectSideBarItem(index, "googleMap") : null}
                                key={index}
                                position={{ lat: item.lat, lng: item.lng }}
                                label={item.label}
                                title={item.title}
                                // icon={videoMarkerNavyBlue} // Use the custom marker icon
                                icon={createMarkerIcon(item, index, 25)}


                            />
                        ))}
                    </GoogleMap>
                </div>
            )
            }
        </div >
    );
};

export default GoogelMapComponent;