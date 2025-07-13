import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useState, useCallback, useRef } from "react";

import { pointToTile } from "@mapbox/tilebelt";
export type RectangleBounds = {
  start_point: { lat: number; lng: number };
  end_point: { lat: number; lng: number };
};

export function useDrawingManager(
  API_KEY: string = "",
  initialValue: google.maps.drawing.DrawingManager | null = null
) {
  const map = useMap();
  const markerLibrary = useMapsLibrary("marker"); // Load the 'marker' library

  const mapRef = useRef<google.maps.Map | null>(null);
  const drawing = useMapsLibrary("drawing");
  const drawingManager = useRef<google.maps.drawing.DrawingManager | null>(
    initialValue
  );
  // const [rectangle, setRectangle] = useState<google.maps.Rectangle | null>(
  //   null
  // );
  const polygonOutSamRef = useRef<google.maps.Polygon[]>([]);
  const polygonOutSamPrevRef = useRef<Record<string, google.maps.Polygon[]>>(
    {}
  );

  const rectangle = useRef<google.maps.Rectangle | null>(null);
  const [rectangleBounds, setRectangleBounds] =
    useState<RectangleBounds | null>(null);

  const polygonInputRef = useRef<google.maps.Polygon | null>(null);
  const [polygonInputBounds, setPolygonInputBounds] = useState<
    { lat: number; lng: number }[] | null
  >(null);

  const rectangleBoundsRef = useRef<RectangleBounds | null>(null);

  const subRectangle = useRef<google.maps.Rectangle | null>(null);
  const subRectangleBoundsRef = useRef<RectangleBounds | null>(null);

  const resultRectangle = useRef<google.maps.Rectangle | null>(null);

  const markers = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

  const [subRectangleBounds, setSubRectangleBounds] =
    useState<RectangleBounds | null>(null);

  const getRectangleBounds = (
    rectangle: google.maps.Rectangle
  ): RectangleBounds => {
    const bounds = rectangle.getBounds();
    if (!bounds) throw new Error("Rectangle has no bounds.");
    const sw = bounds.getSouthWest(); // Southwest corner
    const ne = bounds.getNorthEast(); // Northeast corner

    const nw = new google.maps.LatLng(ne.lat(), sw.lng()); // Northwest corner (Point A)
    const se = new google.maps.LatLng(sw.lat(), ne.lng()); // Southeast corner (Point C)

    return {
      start_point: { lat: nw.lat(), lng: nw.lng() }, // Point A
      end_point: { lat: se.lat(), lng: se.lng() }, // Point C
    };
  };
  const addRectangle = (bounds: RectangleBounds) => {
    if (!map) return;

    // Remove existing rectangle if it exists
    if (rectangle.current) {
      rectangle.current.setMap(null);
    }

    // Create a new rectangle
    const newBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(bounds.end_point.lat, bounds.start_point.lng),
      new google.maps.LatLng(bounds.start_point.lat, bounds.end_point.lng)
    );

    const newRectangle = new google.maps.Rectangle({
      bounds: newBounds,
      editable: true,
      draggable: true,
      map,
      strokeColor: "red", // Set the border color to red
      strokeWeight: 2, // Set the border width
      fillColor: "red", // Set the fill color to red
      fillOpacity: 0.2,
    });

    // Set the rectangle and its bounds
    rectangle.current = newRectangle;
    // setRectangleBounds(bounds);
    rectangleBoundsRef.current = bounds;
    setRectangleBounds(bounds);

    // Listen for bounds changes
    google.maps.event.addListener(newRectangle, "bounds_changed", () => {
      const updatedBounds = getRectangleBounds(newRectangle);
      if (
        subRectangle.current &&
        subRectangleBoundsRef.current &&
        (!isLatLongInRectangle(
          subRectangleBoundsRef.current.start_point.lat,
          subRectangleBoundsRef.current.start_point.lng,
          updatedBounds
        ) ||
          !isLatLongInRectangle(
            subRectangleBoundsRef.current.end_point.lat,
            subRectangleBoundsRef.current.end_point.lng,
            updatedBounds
          ))
      ) {
        subRectangle.current.setMap(null);
        subRectangle.current = null;
        subRectangleBoundsRef.current = null;
        setSubRectangleBounds(null);
      }
      // setRectangleBounds(updatedBounds);
      rectangleBoundsRef.current = updatedBounds;
      setRectangleBounds(updatedBounds);
    });
  };
  const addListOfPolygon = (bounds: { lat: number; lng: number }[][]) => {
    if (!mapRef.current) return;

    // Remove existing rectangle if it exists
    // if (polygonRef.current.length > 0) {
    //   polygonRef.current.forEach(element => {
    //     element.setMap(null);
    //   });
    //   polygonRef.current = [];
    // }

    // Create a new rectangle
    for (let bi of bounds) {
      const bermudaTriangle = new google.maps.Polygon({
        paths: bi,
        strokeColor: "#42f584",
        strokeOpacity: 0.8,
        strokeWeight: 3,
        fillColor: "#42f584",
        fillOpacity: 0.35,
        map: mapRef.current,
      });
      polygonOutSamRef.current.push(bermudaTriangle);
    }
  };

  const deleteListOfPolygon = () => {
    if (polygonOutSamRef.current.length > 0) {
      polygonOutSamRef.current.forEach((element) => {
        element.setMap(null);
      });
      polygonOutSamRef.current = [];
    }
  };
  const addListOfPolygonPrev = (
    message_id: string,
    bounds: { lat: number; lng: number }[][],
    color: string
  ) => {
    if (!mapRef.current) return;
    if (polygonOutSamPrevRef.current[message_id]) {
    } else {
      polygonOutSamPrevRef.current[message_id] = [];
    }
    for (let bi of bounds) {
      const bermudaTriangle = new google.maps.Polygon({
        paths: bi,
        strokeColor: color,
        strokeOpacity: 0.8,
        strokeWeight: 3,
        fillColor: color,
        fillOpacity: 0.35,
        map: mapRef.current,
      });

      polygonOutSamPrevRef.current[message_id].push(bermudaTriangle);
    }
  
  };

  const deleteListOfPolygonPrev = (message_id: string) => {
   
    if (polygonOutSamPrevRef.current[message_id].length > 0) {
      polygonOutSamPrevRef.current[message_id].forEach((element) => {
        element.setMap(null);
      });
      polygonOutSamPrevRef.current[message_id] = [];
    }
  };
  const deleteAllListOfPolygonPrev = () => {
  
    if (polygonOutSamPrevRef.current) {
      Object.keys(polygonOutSamPrevRef.current).forEach((message_id) => {
        polygonOutSamPrevRef.current[message_id].forEach((element) => {
          element.setMap(null);
        });
        polygonOutSamPrevRef.current[message_id] = [];
      });
    }
  };
  const addSubRectangle = (bounds: RectangleBounds) => {
    if (!map || !rectangleBoundsRef.current) return;

    // Remove the existing subRectangle if it exists

    bounds = adjustBoundsToRectangle(bounds, rectangleBoundsRef.current);

    if (subRectangle.current) {
      subRectangle.current.setMap(null);
    }
    const newBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(bounds.end_point.lat, bounds.start_point.lng),
      new google.maps.LatLng(bounds.start_point.lat, bounds.end_point.lng)
    );

    const newSubRectangle = new google.maps.Rectangle({
      bounds: newBounds,
      editable: true,
      draggable: true,
      map,
      strokeColor: "red", // Set the border color to red
      strokeWeight: 2, // Set the border width
      fillColor: "red", // Set the fill color to red
      fillOpacity: 0.2, // Set the fill opacity
    });

    subRectangle.current = newSubRectangle;
    subRectangleBoundsRef.current = bounds;
    setSubRectangleBounds(bounds);

    google.maps.event.addListener(newSubRectangle, "bounds_changed", () => {
      const updatedBounds = getRectangleBounds(newSubRectangle);
      const parentBounds = getRectangleBounds(rectangle.current);
      if (
        !isLatLongInRectangle(
          updatedBounds.start_point.lat,
          updatedBounds.start_point.lng,
          parentBounds
        ) ||
        !isLatLongInRectangle(
          updatedBounds.end_point.lat,
          updatedBounds.end_point.lng,
          parentBounds
        )
      ) {
        newSubRectangle.setBounds(
          new google.maps.LatLngBounds(
            new google.maps.LatLng(
              subRectangleBoundsRef.current.end_point.lat,
              subRectangleBoundsRef.current.start_point.lng
            ),
            new google.maps.LatLng(
              subRectangleBoundsRef.current.start_point.lat,
              subRectangleBoundsRef.current.end_point.lng
            )
          )
        );
      } else {
        subRectangleBoundsRef.current = updatedBounds;
        setSubRectangleBounds(updatedBounds);
      }
    });
  };
  const addResultRectangle = async (bounds: RectangleBounds) => {
    try {
      if (!mapRef.current) {
        console.log("Map not found");
        return;
      }

      // Remove existing rectangle if it exists
      if (resultRectangle.current) {
        resultRectangle.current.setMap(null);
      }

      // Create a new rectangle
      const newBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(bounds.end_point.lat, bounds.start_point.lng),
        new google.maps.LatLng(bounds.start_point.lat, bounds.end_point.lng)
      );

      const newRectangle = new google.maps.Rectangle({
        bounds: newBounds,
        editable: false,
        draggable: false,
        strokeColor: "green", // Set the border color to red
        strokeWeight: 2, // Set the border width
        fillColor: "green", // Set the fill color to red
        fillOpacity: 0.2, // Set the fill opacity
        map: mapRef.current,
      });

      // Set the rectangle and its bounds
      resultRectangle.current = newRectangle;
      // setRectangleBounds(bounds);

      // Listen for bounds changes
    } catch (error) {
      console.log(error);
    }
  };
  const deleteRectangle = () => {
    if (rectangle.current) {
      rectangle.current.setMap(null);
      rectangle.current = null;
      setRectangleBounds(null);
      rectangleBoundsRef.current = null;
      deleteSubRectangle();

      if (resultRectangle.current) {
        resultRectangle.current.setMap(null);
        resultRectangle.current = null;
      }
    }
    if (polygonInputRef.current) {
      polygonInputRef.current.setMap(null);
      setPolygonInputBounds(null);
    }
  };
  const deleteSubRectangle = () => {
    if (subRectangle.current) {
      subRectangle.current.setMap(null);
      subRectangle.current = null;
      subRectangleBoundsRef.current = null;
      setSubRectangleBounds(null);
      // setSubRectangleBounds(null);
    }
  };
  const createColoredMarker = (color: string) => {
    const div = document.createElement("div");
    div.style.width = "15px";
    div.style.height = "15px";
    div.style.backgroundColor = color;
    div.style.borderRadius = "50%";
    div.style.border = "2px solid white";
    div.style.boxShadow = "0 0 5px rgba(0,0,0,0.5)";
    return div;
  };
  const addPoint = (lat: number, lng: number, color: string) => {
    if (!mapRef.current) {
      console.log("Map not found");
      return;
    }

    if (!markerLibrary) {
      console.error("Marker library not loaded yet.");
      return;
    }

    const AdvancedMarkerElement = markerLibrary.AdvancedMarkerElement;
    if (!AdvancedMarkerElement) {
      console.error("AdvancedMarkerElement is undefined");
      return;
    }

    const marker = new AdvancedMarkerElement({
      position: { lat, lng },
      map: map,
      title: "Custom Point",
      content: createColoredMarker(color), // Custom marker content
    });

    markers.current.push(marker);
  };
  // Function to add multiple points at once
  const addPoints = (
    points: {
      centerpoint: [number, number];
      color: string;
      classname: string;
      class_id: number;
      lat: number;
      lng: number;
    }[]
  ) => {
    if (!mapRef.current) {
      console.log("Map not found");
      return;
    }

    points.forEach((point) => addPoint(point.lat, point.lng, point.color));
  };

  const removePoints = () => {
    if (!mapRef.current) {
      console.log("Map not found");
      return;
    }
    markers.current.forEach((marker) => (marker.map = null)); // Remove from map
    markers.current = []; // Reset the array
  };

  const changeViewPortofMap = (
    bounds?: RectangleBounds,
    defaultCenter?: { lat: number; lng: number },
    defaultZoom?: number
  ) => {
    if (!map) return;

    if (bounds) {
      // Fit the map to the rectangle bounds
      const newBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(bounds.end_point.lat, bounds.start_point.lng),
        new google.maps.LatLng(bounds.start_point.lat, bounds.end_point.lng)
      );
      map.fitBounds(newBounds);
    } else if (defaultCenter && defaultZoom !== undefined) {
      // Reset map to default center and zoom
      map.setCenter(
        new google.maps.LatLng(defaultCenter.lat, defaultCenter.lng)
      );
      map.setZoom(defaultZoom);
    }
  };
  useEffect(() => {
    if (!map || !drawing) return;
    mapRef.current = map;
    const newDrawingManager = new drawing.DrawingManager({
      map,
      // drawingMode: google.maps.drawing.OverlayType.RECTANGLE,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          google.maps.drawing.OverlayType.RECTANGLE,
          google.maps.drawing.OverlayType.POLYGON,
        ],
      },

      rectangleOptions: {
        editable: true,
        draggable: true,
        strokeColor: "red", // Set the border color to red
        strokeWeight: 2, // Set the border width
        fillColor: "red", // Set the fill color to red
        fillOpacity: 0.2,
      },
    });
    google.maps.event.addListener(
      newDrawingManager,
      "overlaycomplete",
      async (event: {
        type: google.maps.drawing.OverlayType;
        overlay: google.maps.Rectangle | google.maps.Polygon;
      }) => {
        if (event.type === google.maps.drawing.OverlayType.POLYGON) {
          if (polygonInputRef.current) {
            polygonInputRef.current.setMap(null);
            setPolygonInputBounds(null);
          }
          if (rectangle.current) {
            rectangle.current.setMap(null);
            setRectangleBounds(null);
          }
          const path = (event.overlay as google.maps.Polygon).getPath();
          const coordinates = path.getArray().map((latLng) => ({
            lat: latLng.lat(),
            lng: latLng.lng(),
          }));
          setPolygonInputBounds(coordinates);
          polygonInputRef.current = event.overlay as google.maps.Polygon;
        }
        if (event.type === google.maps.drawing.OverlayType.RECTANGLE) {
          if (rectangle.current) {
            rectangle.current.setMap(null);
          }
          if (polygonInputRef.current) {
            polygonInputRef.current.setMap(null);
            setPolygonInputBounds(null);
          }
          const newRectangle = event.overlay as google.maps.Rectangle;
          newRectangle.setOptions({
            editable: true,
            draggable: true,
          });
          rectangle.current = newRectangle;
          setRectangleBounds(getRectangleBounds(newRectangle));
          rectangleBoundsRef.current = getRectangleBounds(newRectangle);
          google.maps.event.addListener(newRectangle, "bounds_changed", () => {
            const updatedBounds = getRectangleBounds(newRectangle);
            if (
              subRectangle.current &&
              subRectangleBoundsRef.current &&
              (!isLatLongInRectangle(
                subRectangleBoundsRef.current.start_point.lat,
                subRectangleBoundsRef.current.start_point.lng,
                updatedBounds
              ) ||
                !isLatLongInRectangle(
                  subRectangleBoundsRef.current.end_point.lat,
                  subRectangleBoundsRef.current.end_point.lng,
                  updatedBounds
                ))
            ) {
              subRectangle.current.setMap(null);
              subRectangle.current = null;
              subRectangleBoundsRef.current = null;
              setSubRectangleBounds(null);
            }
            setRectangleBounds(updatedBounds);
            rectangleBoundsRef.current = updatedBounds;
          });
          newDrawingManager.setDrawingMode(null);
        }
      }
    );
    drawingManager.current = newDrawingManager;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Delete") {
        deleteRectangle();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      if (drawingManager.current) drawingManager.current.setMap(null);
    };
  }, [drawing, map]);

  return {
    drawingManager: drawingManager.current,
    subRectangleBounds,
    rectangleBounds,
    addRectangle,
    addSubRectangle,
    deleteRectangle,
    deleteSubRectangle,
    addResultRectangle,
    changeViewPortofMap,
    addPoints,
    removePoints,
    addListOfPolygon,
    deleteListOfPolygon,
    addListOfPolygonPrev,
    deleteListOfPolygonPrev,
    deleteAllListOfPolygonPrev,
    polygonInputBounds,
  };
}
function isLatLongInRectangle(lat, lng, bounds: RectangleBounds): boolean {
  const { start_point, end_point } = bounds;

  // Determine the min and max lat/lng to account for any order of points
  const minLat = Math.min(start_point.lat, end_point.lat);
  const maxLat = Math.max(start_point.lat, end_point.lat);
  const minLng = Math.min(start_point.lng, end_point.lng);
  const maxLng = Math.max(start_point.lng, end_point.lng);

  // Check if the given lat/lng falls within the bounds
  return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
}
function adjustBoundsToRectangle(bounds, rectangleBounds) {
  const { start_point, end_point } = rectangleBounds;

  // Calculate the minimum and maximum latitudes and longitudes for the rectangle
  const minLat = Math.min(start_point.lat, end_point.lat);
  const maxLat = Math.max(start_point.lat, end_point.lat);
  const minLng = Math.min(start_point.lng, end_point.lng);
  const maxLng = Math.max(start_point.lng, end_point.lng);

  // Check if start_point is inside the rectangle and adjust if necessary
  if (
    !isLatLongInRectangle(
      bounds.start_point.lat,
      bounds.start_point.lng,
      rectangleBounds
    )
  ) {
    bounds.start_point.lat =
      Math.min(Math.max(bounds.start_point.lat, minLat), maxLat) - 0.00001;
    bounds.start_point.lng =
      Math.min(Math.max(bounds.start_point.lng, minLng), maxLng) + 0.00001;
  }

  // Check if end_point is inside the rectangle and adjust if necessary
  if (
    !isLatLongInRectangle(
      bounds.end_point.lat,
      bounds.end_point.lng,
      rectangleBounds
    )
  ) {
    bounds.end_point.lat =
      Math.min(Math.max(bounds.end_point.lat, minLat), maxLat) + 0.00001;
    bounds.end_point.lng =
      Math.min(Math.max(bounds.end_point.lng, minLng), maxLng) - 0.00001;
  }

  return bounds;
}
