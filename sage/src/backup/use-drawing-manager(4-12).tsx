import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useState, useCallback, useRef } from "react";
import {
  getImageFromBounding,
  createSessionToken,
  getTileFromBounding,
} from "../services/services";
import { pointToTile } from "@mapbox/tilebelt";
export type RectangleBounds = {
  startPoint: { lat: number; lng: number };
  endPoint: { lat: number; lng: number };
};
export function useDrawingManager(
  API_KEY: string = "",
  initialValue: google.maps.drawing.DrawingManager | null = null
) {
  const map = useMap();
  const drawing = useMapsLibrary("drawing");
  // const [sessionToken, setSessionToken] = useState<string | null>(null);
  const sessionToken = useRef<string | null>(null);
  const [tileRange, setTileRange] = useState<any>(null);

  const [drawingManager, setDrawingManager] =
    useState<google.maps.drawing.DrawingManager | null>(initialValue);
  const [rectangles, setRectangles] = useState<google.maps.Rectangle[]>([]);
  const [rectangleBounds, setRectangleBounds] = useState<
    {
      bounds: RectangleBounds;
      imageObjectBlob: Blob | null;
    }[]
  >([]);

  useEffect(() => {
    const getSession = async () => {
      let sess = await createSessionToken(API_KEY);
      console.log(sess);
      sessionToken.current = sess;
    };
    getSession();
  }, []);
  const calculatePixelSize = (bounds: RectangleBounds, zoom: number) => {
    const earthCircumference = 40075017; // Earth's circumference in meters
    const resolution = earthCircumference / (256 * Math.pow(2, zoom)); // Meters per pixel

    const widthInMeters =
      Math.abs(bounds.endPoint.lng - bounds.startPoint.lng) *
      (earthCircumference / 360);
    const heightInMeters =
      Math.abs(bounds.endPoint.lat - bounds.startPoint.lat) *
      (earthCircumference / 360);

    const widthInPixels = Math.round(widthInMeters / resolution);
    const heightInPixels = Math.round(heightInMeters / resolution);

    // Ensure the pixel size doesn't exceed the map container dimensions
    console.log("width: ", widthInPixels);
    console.log("height: ", heightInPixels);

    // return {
    //   width: widthInPixels,
    //   height: heightInPixels + 36,
    // };
  };

  const getStaticMapUrl = async (bounds: RectangleBounds) => {
    if (!map) return null;
    const { startPoint, endPoint } = bounds;
    // const zoom = map.getZoom() || 15;
    const zoom = 18;

    calculatePixelSize(bounds, zoom);
    let startTile = getTileCoordinates(startPoint.lat, startPoint.lng, zoom);
    let endTile = getTileCoordinates(endPoint.lat, endPoint.lng, zoom);
    const { xRange, yRange } = getTileRange(startTile, endTile);

    // Fetch all tiles within the tile range
    const tileImages: TileImage[] = [];
    for (let x = xRange[0]; x <= xRange[1]; x++) {
      for (let y = yRange[0]; y <= yRange[1]; y++) {
        const url = `https://tile.googleapis.com/v1/2dtiles/${zoom}/${x}/${y}?session=${sessionToken.current}&key=${API_KEY}`;
        try {
          const imageBlob = await getTileFromBounding(url);
          tileImages.push({ imageBlob, x, y });
        } catch (error) {
          console.error("Failed to fetch tile:", error);
        }
      }
    }

    // Now, merge all tile blobs into a single image
    const mergedImageBlob = await mergeImages(tileImages, xRange, yRange);
    return mergedImageBlob;
    // // Calculate the center of the rectangle
    // const centerLat = (startPoint.lat + endPoint.lat) / 2;
    // const centerLng = (startPoint.lng + endPoint.lng) / 2;

    // // Get current map zoom level
    // const zoom = map.getZoom() || 15;
    // let {x, y} = getTileCoordinates(centerLat, centerLng, zoom);

    // const url = `https://tile.googleapis.com/v1/2dtiles/${zoom}/${x}/${y}?session=${sessionToken.current}&key=${API_KEY}`;

    // try {
    //   // Use the getImageFromBounding function to fetch the static map
    //   const imageObjectUrl = await getTileFromBounding(url);

    //   return imageObjectUrl;
    // } catch (error) {
    //   console.error("Failed to fetch the static map image:", error);
    //   return null;
    // }
  };
  const deleteRectangle = useCallback(
    (rectangleToDelete: google.maps.Rectangle) => {
      rectangleToDelete.setMap(null); // Remove from the map
      setRectangles((prev) =>
        prev.filter((rect) => rect !== rectangleToDelete)
      );
      setRectangleBounds((prev) =>
        prev.filter((bounds, index) => rectangles[index] !== rectangleToDelete)
      );
    },
    [rectangles]
  );
  const deleteRectangleAll = useCallback(() => {
    rectangles.forEach((element) => {
      element.setMap(null);
    });
    setRectangles([]);
    setRectangleBounds([]);
  }, [rectangles]);
  const getRectangleBounds = (
    rectangle: google.maps.Rectangle
  ): RectangleBounds => {
    const bounds = rectangle.getBounds();
    if (!bounds) throw new Error("Rectangle has no bounds.");
    const sw = bounds.getSouthWest(); // Southwest corner
    const ne = bounds.getNorthEast(); // Northeast corner

    return {
      startPoint: { lat: sw.lat(), lng: sw.lng() },
      endPoint: { lat: ne.lat(), lng: ne.lng() },
    };
  };

  useEffect(() => {
    if (!map || !drawing) return;

    // https://developers.google.com/maps/documentation/javascript/reference/drawing
    const newDrawingManager = new drawing.DrawingManager({
      map,
      // drawingMode: google.maps.drawing.OverlayType.RECTANGLE,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [google.maps.drawing.OverlayType.RECTANGLE],
      },

      rectangleOptions: {
        editable: false,
        draggable: false,
      },
    });
    google.maps.event.addListener(
      newDrawingManager,
      "overlaycomplete",
      async (event: {
        type: google.maps.drawing.OverlayType;
        overlay: google.maps.Rectangle;
      }) => {
        if (event.type === google.maps.drawing.OverlayType.RECTANGLE) {
          const rectangle = event.overlay as google.maps.Rectangle;
          setRectangles((prev) => [...prev, rectangle]);
          const bounds = getRectangleBounds(rectangle);
          const zoom = map.getZoom() || 18;
          const { width, height } = calculatePixelSizeRect(bounds, zoom);
          // Define the maximum size in pixels (1024x1024)
          const maxSize = 300;
          const earthCircumference = 40075017;
          console.log(width, height);
          if (width > maxSize || height > maxSize) {
            // Adjust bounds to fit within the max size
            const ratio = Math.min(maxSize / width, maxSize / height);

            const newWidthInMeters =
              width * ratio * (earthCircumference / 256 / Math.pow(2, zoom));
            const newHeightInMeters =
              height * ratio * (earthCircumference / 256 / Math.pow(2, zoom));

            const newEndPoint = {
              lat:
                bounds.startPoint.lat +
                newHeightInMeters / (earthCircumference / 360),
              lng:
                bounds.startPoint.lng +
                newWidthInMeters / (earthCircumference / 360),
            };

            const newBounds = new google.maps.LatLngBounds(
              new google.maps.LatLng(
                bounds.startPoint.lat,
                bounds.startPoint.lng
              ),
              new google.maps.LatLng(newEndPoint.lat, newEndPoint.lng)
            );

            rectangle.setBounds(newBounds); // Apply the new bounds
          }

          const img = await getStaticMapUrl(bounds);
          // console.log(img);
          setRectangleBounds((prev) => [
            ...prev,
            { bounds, imageObjectBlob: img },
          ]);
        }
      }
    );
    setDrawingManager(newDrawingManager);

    return () => {
      newDrawingManager.setMap(null);
    };
  }, [drawing, map]);

  return {
    drawingManager,
    rectangles,
    rectangleBounds,
    deleteRectangle,
    deleteRectangleAll,
  };
}
const getTileCoordinates = (
  latitude: number,
  longitude: number,
  zoom: number
) => {
  const [x, y] = pointToTile(longitude, latitude, zoom); // Note the order: longitude, latitude
  return { x, y, z: zoom };
};
function getTileRange(
  startTile: { x: number; y: number },
  endTile: { x: number; y: number }
) {
  const tileRangeX = [startTile.x, endTile.x];
  const tileRangeY = [startTile.y, endTile.y];

  if (startTile.x > endTile.x) {
    tileRangeX[0] = endTile.x;
    tileRangeX[1] = startTile.x;
  }

  if (startTile.y > endTile.y) {
    tileRangeY[0] = endTile.y;
    tileRangeY[1] = startTile.y;
  }

  return {
    xRange: tileRangeX,
    yRange: tileRangeY,
  };
}
type TileImage = {
  imageBlob: any;
  x: number;
  y: number;
};

type TileRange = {
  xRange: [number, number];
  yRange: [number, number];
};
const mergeImages = async (
  tileImages: TileImage[],
  xRange: number[],
  yRange: number[]
): Promise<Blob> => {
  // Create a canvas to merge all images
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Failed to get canvas context");
  }

  // Assume tiles are square and all tiles are the same size
  const tileWidth = 256; // Standard tile size
  const tileHeight = 256; // Standard tile size

  // Set canvas dimensions based on the number of tiles in the x and y range
  canvas.width = (xRange[1] - xRange[0] + 1) * tileWidth;
  canvas.height = (yRange[1] - yRange[0] + 1) * tileHeight;

  // Draw each tile onto the canvas
  for (let { imageBlob, x, y } of tileImages) {
    const img = await createImageBitmap(imageBlob); // Create an ImageBitmap from the blob
    const canvasX = (x - xRange[0]) * tileWidth;
    const canvasY = (y - yRange[0]) * tileHeight;

    context.drawImage(img, canvasX, canvasY);
  }
  console.log(`Canvas Width: ${canvas.width}`);
  console.log(`Canvas Height: ${canvas.height}`);
  // Convert the canvas to a Blob and handle the case where it might be null
  const mergedBlob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob); // Resolve with the blob if it's not null
      } else {
        reject(new Error("Failed to generate image blob")); // Reject if the result is null
      }
    }, "image/png");
  });

  return mergedBlob;
};
const calculatePixelSizeRect = (bounds: RectangleBounds, zoom: number) => {
  const earthCircumference = 40075017; // Earth's circumference in meters
  const resolution = earthCircumference / (256 * Math.pow(2, zoom)); // Meters per pixel

  const widthInMeters =
    Math.abs(bounds.endPoint.lng - bounds.startPoint.lng) *
    (earthCircumference / 360);
  const heightInMeters =
    Math.abs(bounds.endPoint.lat - bounds.startPoint.lat) *
    (earthCircumference / 360);

  const widthInPixels = Math.round(widthInMeters / resolution);
  const heightInPixels = Math.round(heightInMeters / resolution);

  console.log("Width in pixels:", widthInPixels);
  console.log("Height in pixels:", heightInPixels);

  return { width: widthInPixels, height: heightInPixels };
};
