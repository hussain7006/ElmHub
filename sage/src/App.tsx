import { useEffect, useState } from "react";
import { AdvancedMarker, Map, Marker } from "@vis.gl/react-google-maps";
import { ControlPosition, MapControl } from "@vis.gl/react-google-maps";
import { useDrawingManager } from "./components/use-drawing-manager";
import "./App.css";
import { AutocompleteCustom } from "./components/autocomplete/autocomplete-custom";
import MapHandler from "./components/map-handler";
import Chatbox from "./components/chatbox/chatbox";
import { RiDeleteBin5Line } from "react-icons/ri";
import Elm_Logo from "../public/new_logo.png";
import { AutocompleteCustomBounds } from "./components/autocomplete/autocomplete-custom-bounds";
import { useIframeConfig } from "./context/IframeConfigContext";
import { logConfig } from "./utils/themeUtils";
export type MapConfig = {
  id: string;
  label: string;
  mapId?: string;
  mapTypeId?: string;
  styles?: google.maps.MapTypeStyle[];
};

const App = ({ API_KEY }: { API_KEY: string }) => {
  const { config, isLoading } = useIframeConfig();

  console.log("config", config);
  console.log("isLoading", isLoading);
  
  // Log config when it changes
  useEffect(() => {
    if (config) {
      logConfig(config);
    }
  }, [config]);
  const {
    drawingManager,
    rectangleBounds,
    addRectangle,
    deleteRectangle,
    subRectangleBounds,
    addSubRectangle,
    deleteSubRectangle,
    addResultRectangle,
    changeViewPortofMap,
    addPoints,
    removePoints,
    addListOfPolygon,
    deleteListOfPolygon,
    polygonInputBounds,
    addListOfPolygonPrev,
    deleteListOfPolygonPrev,
    deleteAllListOfPolygonPrev
  } = useDrawingManager(API_KEY);
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const [selectedSubPlace, setSelectedSubPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [detectedPoints, SetDetectedPoints] = useState<
    {
      centerpoint: [number, number];
      color: string;
      classname: string;
      class_id: number;
      lat: number;
      lng: number;
    }[]
  >([]);

  useEffect(() => {
    if (selectedPlace && selectedPlace.geometry?.viewport) {
      const viewport = selectedPlace.geometry.viewport;

      const start_point = {
        lat: viewport.getNorthEast().lat(),
        lng: viewport.getSouthWest().lng(),
      };
      const end_point = {
        lat: viewport.getSouthWest().lat(),
        lng: viewport.getNorthEast().lng(),
      };

      // Add a rectangle using the extracted viewport bounds
      addRectangle({ start_point, end_point });
    }
  }, [selectedPlace]);
  useEffect(() => {
    if (selectedSubPlace && selectedSubPlace.geometry?.viewport) {
      const viewport = selectedSubPlace.geometry.viewport;

      const start_point = {
        lat: viewport.getNorthEast().lat(),
        lng: viewport.getSouthWest().lng(),
      };
      const end_point = {
        lat: viewport.getSouthWest().lat(),
        lng: viewport.getNorthEast().lng(),
      };

      // Add a rectangle using the extracted viewport bounds
      addSubRectangle({ start_point, end_point });
    }
  }, [selectedSubPlace]);
  // Apply theme styles if config is available
  const containerStyle = config ? {
    backgroundColor: config.colors.background,
    color: config.colors.textPrimary,
  } : {};

  const navbarStyle = config ? {
    backgroundColor: config.colors.surface,
    borderBottom: `1px solid ${config.colors.borderColor}`,
  } : {};

  const logoStyle = config ? {
    color: config.colors.textPrimary,
  } : {};

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: config?.colors.background || '#F9FAFB'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className={"fullpageContainer"} style={containerStyle}>
      {config?.showHeader !== false && (
        <div className={"navbarcontainer"} style={navbarStyle}>
          <div style={{ width: "150px" }}></div>
          <div className="SAGE_LOgo" style={logoStyle}>SAGE</div>
          <div className="ELM_Logo">
            <img src={Elm_Logo} />
          </div>
        </div>
      )}
      <div className="customcontainer">
        <Map
          mapId={"bf51a910020fa25a"}
          defaultCenter={{ lat: 24.679323, lng: 46.689887 }}
          defaultZoom={11}
          // mapId={null}
          mapTypeId={"hybrid"}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
        />
        {detectedPoints.map((point, index) => (
          <AdvancedMarker
            position={{ lat: point.lat, lng: point.lng }}
            title={point.classname}
            draggable={false}
            key={index}
          >
            <div
              style={{
                width: 8,
                height: 8,
                position: "absolute",
                top: 0,
                left: 0,
                background: point.color,
                // border: `1px solid ${point.color}`,
                borderRadius: "50%",
                transform: "translate(-50%, -50%)",
              }}
            ></div>
          </AdvancedMarker>
        ))}

        <MapControl position={ControlPosition.TOP_CENTER}>
          <div className="drawing-history">
            <button
              onClick={() => {
                SetDetectedPoints([]);
                deleteRectangle();
              }}
              disabled={rectangleBounds || polygonInputBounds ? false : true}
            >
              <RiDeleteBin5Line size={16} />
            </button>
          </div>
        </MapControl>
        <MapControl position={ControlPosition.TOP_RIGHT}>
          <div className="autocomplete-control">
            <AutocompleteCustom
              onPlaceSelect={setSelectedPlace}
              inputValue={inputValue}
              setInputValue={setInputValue}
            />
          </div>
          {/* {selectedPlace && (
          <div className="autocomplete-control">
            <AutocompleteCustomBounds
              // onPlaceSelect={setSelectedSubPlace}
              onPlaceSelect={setSelectedPlace}
              rectangle={rectangleBounds}
            />
          </div>
        )} */}
        </MapControl>
        <MapHandler place={selectedPlace} />
        <Chatbox
          rectangle={rectangleBounds}
          polygonInputBounds={polygonInputBounds}
          subRectangleBounds={subRectangleBounds}
          selectedPlace={selectedPlace}
          setSelectedPlace={setSelectedPlace}
          deleteRectangle={() => {
            setInputValue("");
            changeViewPortofMap(
              undefined,
              { lat: 24.679323, lng: 46.689887 },
              11
            );
            deleteRectangle();
          }}
          addResultRectangle={addResultRectangle}
          changeViewPortofMap={changeViewPortofMap}
          addPoints={(e) => SetDetectedPoints(e)}
          removePoints={() => SetDetectedPoints([])}
          addListOfPolygon={addListOfPolygon}
          deleteListOfPolygon={deleteListOfPolygon}
          addListOfPolygonPrev={addListOfPolygonPrev}
          deleteListOfPolygonPrev={deleteListOfPolygonPrev}
          deleteAllListOfPolygonPrev={deleteAllListOfPolygonPrev}
        />
      </div>
    </div>
  );
};

export default App;
