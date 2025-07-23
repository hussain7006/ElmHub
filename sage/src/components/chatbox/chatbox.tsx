import React, { useEffect, useState, useRef } from "react";
import style from "./style.module.scss";
import { Button, Form, InputGroup } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import Badge from "react-bootstrap/Badge";
import Alert from "react-bootstrap/Alert";
import { LuPlus } from "react-icons/lu";
import ProgressBar from "react-bootstrap/ProgressBar";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { v4 as uuidv4 } from "uuid";
import { FaDownload } from "react-icons/fa6";
type ChatBotMsgType = {
  message_id: string;
  role: string;
  message: string;
  isBB?: boolean;
  BB_id?: string;
  imgs: { id: string | number; image: string; bb: any }[];
  bbox_lst?: {
    bb: string[];
    tag: string;
    bounds: RectangleBounds;
  }[];
  area_polygon_points?: {
    total_area_m2: number;
    class: string;
    lat_lng: {
      lat: number;
      lng: number;
    }[][];
  }[];
  color?: string;
};

type Props = {
  rectangle: RectangleBounds | null;
  polygonInputBounds: { lat: number; lng: number }[] | null;
  subRectangleBounds: RectangleBounds | null;
  selectedPlace: google.maps.places.PlaceResult | null;
  setSelectedPlace: any;
  deleteRectangle: () => void;
  addResultRectangle: (RectangleBounds) => void;
  changeViewPortofMap: (RectangleBounds) => void;
  addPoints: (
    points: {
      centerpoint: [number, number];
      color: string;
      classname: string;
      class_id: number;
      lat: number;
      lng: number;
    }[]
  ) => void;
  removePoints: () => void;
  addListOfPolygon: (bounds: { lat: number; lng: number }[][]) => void;
  deleteListOfPolygon: () => void;
  addListOfPolygonPrev: (
    message_id: string,
    bounds: { lat: number; lng: number }[][],
    color: string
  ) => void;
  deleteListOfPolygonPrev: (message_id: string) => void;
  deleteAllListOfPolygonPrev: () => void;
};
export type RectangleBounds = {
  start_point: { lat: number; lng: number };
  end_point: { lat: number; lng: number };
};
const Chatbox = ({
  selectedPlace,
  rectangle,
  polygonInputBounds,
  subRectangleBounds,
  setSelectedPlace,
  deleteRectangle,
  addResultRectangle,
  changeViewPortofMap,
  addPoints,
  removePoints,
  addListOfPolygon,
  deleteListOfPolygon,
  addListOfPolygonPrev,
  deleteListOfPolygonPrev,
  deleteAllListOfPolygonPrev,
}: Props) => {
  const uniqueUserId = useRef<string>(uuidv4());

  const [socketConnected, setSocketConnected] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatBotMsgType[]>([]);
  const [selectedMessageId, setSelectedMessageId] = useState<string[]>([]);

  const [message, setMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);
  const [processingPercentage, setProcessingPercentage] = useState<number>(0);

  const [processingError, setProcessingError] = useState<string | null>(null);

  const [showMsgImgModal, setShowMsgImgModal] = useState<null | string>(null);
  const [aiModalSelected, setAiModalSelected] = useState<null | string>(
    "sage-counting"
    // "sam2"
  );
  const [retryCountdown, setRetryCountdown] = useState(5);
  const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ws = useRef<WebSocket | null>(null); // WebSocket reference
  const setResultRect = async (bounds: RectangleBounds) => {
    await addResultRectangle(bounds);
  };
  // Establish WebSocket connection
  const connectWebSocket = () => {
    ws.current = new WebSocket(
      // `ws://127.0.0.1:8000/ws/${uniqueUserId.current}`
      `ws://141.148.187.5:7500/ws/${uniqueUserId.current}`
    );
    // ws.current = new WebSocket(
    //   `ws://149.130.223.204:8030/ws/${uniqueUserId.current}`
    // );

    ws.current.onopen = () => {
      console.log("WebSocket connection established.");
      setSocketConnected(true);
      setRetryCountdown(5); // Reset retry countdown on successful connection
      if (retryTimer.current) {
        clearInterval(retryTimer.current);
        retryTimer.current = null;
      }
    };

    ws.current.onmessage = async (event) => {
      try {
        const receivedMessage: {
          type: string;
          message: {
            role: string;
            message: string;
            imgs: { id: string | number; image: string; bb: any }[];
          };
          bbox_lst?: {
            bb: string[];
            tag: string;
            bounds: RectangleBounds;
          }[];
          detected_points: {
            centerpoint: [number, number];
            color: string;
            classname: string;
            class_id: number;
            lat: number;
            lng: number;
          }[];
          area_polygon_points?: {
            total_area_m2: number;
            class: string;
            lat_lng: {
              lat: number;
              lng: number;
            }[][];
          }[];
          color?: string;
          status?: string;
          percentage?: number;
        } = JSON.parse(event.data);

        // Ensure valid data structure before updating state
        if (receivedMessage.type == "status") {
          setProcessing(receivedMessage.status || null);
          setProcessingPercentage(receivedMessage.percentage || 0);
        }
        if (receivedMessage.type == "error") {
          setProcessing(null);
          setProcessingError(receivedMessage.status || null);
        }
        if (receivedMessage.type == "message") {
          const msg = receivedMessage.message.message; // Access the actual message string
          const match = msg.match(/<(\w+)_([^>]+)>/); // Match pattern <Type_ID>

          removePoints();
          if (
            receivedMessage.detected_points &&
            receivedMessage.detected_points.length > 0
          ) {
            addPoints(receivedMessage.detected_points);
          }
          if (match) {
            const type = match[1]; // Extracted Type (e.g., BB)
            const id = match[2]; // Extracted ID (e.g., UUID or other)

            setMessages((prev) => [
              ...prev,
              {
                ...receivedMessage.message,
                message_id: uuidv4(),
                message: "See on Map",
                isBB: true,
                BB_id: id,
                bbox_lst: receivedMessage.bbox_lst,
              },
            ]); // Spread all received messages into state
            console.log(receivedMessage);
            // let tempp = receivedMessage.message.bbox_lst
            await setResultRect(receivedMessage.bbox_lst[0].bounds);
          } else {
            let mes_id = uuidv4();
            setMessages((prev) => [
              ...prev,
              {
                ...receivedMessage.message,
                message_id: mes_id,
                area_polygon_points: receivedMessage.area_polygon_points,
                color: receivedMessage.color,
              },
            ]); // Spread all received messages into state
            // deleteListOfPolygon();

            deleteAllListOfPolygonPrev();
            setSelectedMessageId([mes_id]);
            if (receivedMessage.area_polygon_points) {
              receivedMessage.area_polygon_points.forEach((element) => {
                addListOfPolygonPrev(
                  mes_id,
                  element.lat_lng,
                  receivedMessage.color ?? "#42f584"
                );
              });
            }
          }

          setProcessing(null);
          setProcessingError(null);
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.current.onclose = () => {
      console.log("WebSocket connection closed.");
      setMessages([]);
      setMessage("");
      setIsLoading(false);
      setProcessing(null);
      setProcessingPercentage(0);
      setProcessingError(null);
      setShowMsgImgModal(null);
      setSocketConnected(false);
      startRetryCountdown();
    };
  };
  const startRetryCountdown = () => {
    let countdown = 5;
    setRetryCountdown(countdown);

    if (retryTimer.current) {
      clearInterval(retryTimer.current);
    }

    retryTimer.current = setInterval(() => {
      countdown -= 1;
      setRetryCountdown(countdown);

      if (countdown === 0) {
        clearInterval(retryTimer.current!);
        connectWebSocket(); // Try reconnecting after countdown
      }
    }, 1000);
  };
  useEffect(() => {
    connectWebSocket();
    const pingInterval = setInterval(() => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({ type: "ping" }));
        console.log("Ping sent to server");
      }
    }, 8000);
    // Cleanup on component unmount
    return () => {
      clearInterval(pingInterval);
      if (retryTimer.current) clearInterval(retryTimer.current);
      ws.current?.close();
    };
  }, []);
  const sendMessage = async () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      setProcessingError(null);
      if (rectangle) {
        if (calculateAreaInKm2(rectangle) > 3) {
          alert("Area is too large to be fetch for now. try for small area.");
          return;
        }
      }
      let polyBB: RectangleBounds | null = null;
      if (polygonInputBounds) {
        polyBB = getBoundingBoxofPolygon(polygonInputBounds);
        if (calculateAreaInKm2(polyBB) > 3) {
          alert("Area is too large to be fetch for now. try for small area.");
          return;
        }
      }
      if (!message.trim() || message.trim().length < 3) {
        alert("Message cannot be empty or less than 3 characters.");
        return;
      }
      let newMessage: any = {
        sender: "User",
        type: aiModalSelected, // qvq / teochat
        message: message, // string
        bounds: rectangle || polyBB, //
        subbounds: subRectangleBounds, // ignore
        polygonInputBounds: polygonInputBounds,
      };

      setIsLoading(true);
      ws.current.send(JSON.stringify(newMessage));
      setMessages((prev) => [
        ...prev,
        { message_id: uuidv4(), role: "USER", message: message, imgs: [] },
      ]); // Update local chat state
      setMessage(""); // Clear input field
    } else {
      alert("No Area is Selected.");
    }
  };
  const stopMessage = async () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      let newMessage: any = {
        sender: "User",
        type: "stop", // qvq / teochat
        message: "", // string
      };
      ws.current.send(JSON.stringify(newMessage));
    }
  };
  const handleKMLDownload = (
    polygons: {
      lat_lng: {
        lat: number;
        lng: number;
      }[][];
    }[]
  ) => {
    const kmlContent = createKMLContent(polygons);
    const blob = new Blob([kmlContent], {
      type: "application/vnd.google-earth.kml+xml",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "polygon.kml";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  const ResetAll = () => {
    deleteRectangle();
    addPoints([]);
    setMessages([]);
    setMessage("");
    setIsLoading(false);
    setProcessing(null);
    setProcessingPercentage(0);
    setProcessingError(null);
    setShowMsgImgModal(null);
    deleteAllListOfPolygonPrev();
  };

  const onMessageClickHandle = async (message: ChatBotMsgType) => {
    if (message.isBB) {
      await changeViewPortofMap(message.bbox_lst[0].bounds);
    }
    if (message.area_polygon_points) {
      if (selectedMessageId.indexOf(message.message_id) == -1) {
        message.area_polygon_points.forEach((element) => {
          addListOfPolygonPrev(
            message.message_id,
            element.lat_lng,
            message.color ?? "#42f584"
          );
        });
        setSelectedMessageId((prev) => [...prev, message.message_id]);
      } else {
        deleteListOfPolygonPrev(message.message_id);
        setSelectedMessageId((prev) =>
          prev.filter((id) => id !== message.message_id)
        );
      }
    }
  };
  return (
    <>
      <div className={style.chatBox}>
        <div>
          <div className={style.header}>
            {/* <p className={style.title}></p> */}
            <FloatingLabel
              controlId="floatingSelect"
              label="Modal"
              style={{ width: "150px" }}
            >
              <Form.Select
                aria-label="Floating label select example"
                onChange={(e) => {
                  setAiModalSelected(e.target.value);
                }}
              >
                <option value="sage-counting">SAGE-Counting</option>

                <option value="teochat">SAGE-Mini</option>

                <option value="qvq">SAGE-R</option>
                <option value="sam2">SAGE-SAM</option>
              </Form.Select>
            </FloatingLabel>
            <div>
              {messages.length > 0 && (
                <Button
                  variant="outline-primary"
                  className="d-flex gap-1 align-items-center"
                  size="sm"
                  onClick={ResetAll}
                >
                  {" "}
                  <LuPlus /> Start New Session
                </Button>
              )}
            </div>
          </div>
          <hr />
        </div>
        <div className={style.chat}>
          {messages.map((msg, index) => (
            <div
              className={`${style.messageCon} ${
                msg.role == "USER" ? style.user : style.bot
              }`}
              key={index}
            >
              <div className={style.sender}>{msg.role}:</div>
              <div
                className={`${style.msgBox} ${
                  selectedMessageId.indexOf(msg.message_id) > -1 &&
                  style.selectedMsgBox
                }`}
                onClick={() => onMessageClickHandle(msg)}
              >
                <div className={`${style.message} ${msg.isBB && style.bb}`}>
                  {msg.message}
                </div>
              </div>
              {msg.area_polygon_points && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    marginTop: "4px",
                  }}
                >
                  {" "}
                  <FaDownload
                    onClick={() => handleKMLDownload(msg.area_polygon_points)}
                    style={{ cursor: "pointer" }}
                    size={20}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className={style.sendArea}>
          <hr />

          {processingError && (
            <Alert
              key={"danger"}
              variant={"danger"}
              style={{ marginBottom: "5px", padding: "5px", marginTop: "5px" }}
            >
              Something went wrong!
            </Alert>
          )}
          {!socketConnected && (
            <Alert
              key={"danger"}
              variant={"danger"}
              style={{ marginBottom: "5px", padding: "5px", marginTop: "5px" }}
            >
              Server is offline. Reconnecting in {retryCountdown} seconds...
              {/* <Button
                variant="danger"
                id="button-addon2"
                onClick={connectWebSocket}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path  d="M 3.5 2 C 3.372 2 3.2444844 2.0494844 3.1464844 2.1464844 C 2.9514844 2.3414844 2.9514844 2.6585156 3.1464844 2.8535156 L 5.09375 4.8007812 C 3.1950225 6.6199194 2 9.1685121 2 12 C 2 17.511334 6.4886661 22 12 22 C 17.511334 22 22 17.511334 22 12 C 22 6.864114 18.106486 2.6175896 13.109375 2.0644531 A 1.0001 1.0001 0 0 0 13.009766 2.0585938 A 1.0001 1.0001 0 0 0 12.890625 4.0527344 C 16.891514 4.4955979 20 7.871886 20 12 C 20 16.430666 16.430666 20 12 20 C 7.5693339 20 4 16.430666 4 12 C 4 9.7105359 4.967513 7.6643975 6.5039062 6.2109375 L 8.1464844 7.8535156 C 8.3414844 8.0485156 8.6585156 8.0485156 8.8535156 7.8535156 C 8.9515156 7.7565156 9 7.628 9 7.5 L 9 3 A 1 1 0 0 0 8 2 L 3.5 2 z"></path>
                </svg>
              </Button> */}
            </Alert>
          )}

          {/* <div className={style.inforow}>
            <div></div>

            {processing && (
              <Badge bg="secondary" className="d-flex align-items-center gap-1">
                {processing} <Spinner animation="grow" size="sm" />
              </Badge>
            )}
          </div> */}
          {processing && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "5px",
                marginBottom: "5px",
              }}
            >
              <ProgressBar style={{ width: "100%" }}>
                <ProgressBar
                  striped
                  animated
                  variant="warning"
                  now={processingPercentage}
                  key={1}
                  label={processing}
                />
              </ProgressBar>
              <StopIcon onClick={stopMessage} />
            </div>
          )}
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              if (isLoading) return;
              sendMessage();
            }}
          >
            <InputGroup>
              <Form.Control
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Message"
                aria-label="Message"
              />
              <Button
                variant="outline-secondary"
                // variant="primary"

                id="button-addon2"
                onClick={sendMessage}
                disabled={isLoading || !socketConnected}
              >
                {isLoading ? (
                  <Spinner animation="border" variant="primary" size="sm" />
                ) : (
                  "Send"
                )}
              </Button>
            </InputGroup>
          </Form>
        </div>
      </div>
      <MyVerticallyCenteredModal
        show={showMsgImgModal != null}
        onHide={() => setShowMsgImgModal(null)}
        image={showMsgImgModal ?? ""}
      />
    </>
  );
};

export default Chatbox;
function blobToBase64(blob: Blob | null): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!blob) {
      reject(new Error("Blob is null")); // Handle the null case
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string); // Cast result to string since it's a DataURL
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function MyVerticallyCenteredModal({
  show,
  onHide,
  image,
}: {
  show: boolean;
  image: string;
  onHide: () => void;
}) {
  return (
    <Modal
      show={show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Image</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          width: "100%",
          maxHeight: "80dvh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <img
          src={image}
          style={{ maxWidth: "100%", maxHeight: "75dvh", margin: "auto" }}
        />
      </Modal.Body>
    </Modal>
  );
}
function calculateAreaInKm2(bounds: RectangleBounds): number {
  const EARTH_RADIUS_KM = 6371; // Earth's radius in kilometers

  // Get the corners of the bounds
  const northEast = bounds.start_point;
  const southWest = bounds.end_point;

  // Calculate latitudes and longitudes in radians
  const lat1 = northEast.lat * (Math.PI / 180); // Convert to radians
  const lat2 = southWest.lat * (Math.PI / 180); // Convert to radians
  const lng1 = northEast.lng * (Math.PI / 180); // Convert to radians
  const lng2 = southWest.lng * (Math.PI / 180); // Convert to radians

  // Calculate the height of the bounding box (latitude difference in km)
  const latDiffKm = EARTH_RADIUS_KM * Math.abs(lat1 - lat2);

  // Calculate the average latitude to adjust for longitude scaling
  const avgLat = (lat1 + lat2) / 2;

  // Calculate the width of the bounding box (longitude difference in km, adjusted for latitude)
  const lngDiffKm = EARTH_RADIUS_KM * Math.abs(lng1 - lng2) * Math.cos(avgLat);

  // Calculate the approximate area in km²
  const area = latDiffKm * lngDiffKm;
  return area;
}
const StopIcon = ({ onClick }: { onClick: () => void }) => {
  return (
    <img
      style={{ width: "28px", height: "28px", cursor: "pointer" }}
      onClick={onClick}
      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA20lEQVR4nO2ZQQrCQAxF5x66VG+Q2F0h8bJSejMLbUnXSpEirsKM0FT6H2Q9/09+hmEmJQAA2CxTzUdTakxpNOXnukWjCbfD7XouFy/UrS+cv0uom6Q6ZBt473yweF1M8L3EwLghA32BgQ0I10/BgKEDjAhlER0ZwxDrzo7RXGDAAx1wQIQ8ECEHRMgDEXJAhDx2FyH798ucwQCjA19ER8YwAxq/67bvU0hoiBZtPz3uCrfhwnUparINDEoXE36Eixfq+ro6pRLmn5H5cyEkTjKvSU2xeAAASGvwAqphEFia9nxCAAAAAElFTkSuQmCC"
      alt="stop-squared"
    />
  );
};
function getBoundingBoxofPolygon(polygon: { lat: number; lng: number }[]) {
  const lats = polygon.map((point) => point.lat);
  const lngs = polygon.map((point) => point.lng);
  return {
    start_point: { lat: Math.max(...lats), lng: Math.min(...lngs) },
    end_point: { lat: Math.min(...lats), lng: Math.max(...lngs) },
  } as RectangleBounds;
}

const createKMLContent = (
  polygons: {
    lat_lng: {
      lat: number;
      lng: number;
    }[][];
  }[]
) => {
  const placemarks = polygons
    .map((polygonObj) => {
      return polygonObj.lat_lng
        .map((polygon) => {
          // Ensure the polygon is closed
          const closedPolygon = [...polygon];
          const firstPoint = polygon[0];
          const lastPoint = polygon[polygon.length - 1];
          if (
            firstPoint.lat !== lastPoint.lat ||
            firstPoint.lng !== lastPoint.lng
          ) {
            closedPolygon.push(firstPoint);
          }

          const coordinates = closedPolygon
            .map((point) => `${point.lng},${point.lat},0`)
            .join(" ");

          return `
   <Placemark>
  <Style>
    <LineStyle>
      <color>ff84f542</color> <!-- strokeColor -->
      <width>3</width> <!-- strokeWeight -->
    </LineStyle>
    <PolyStyle>
      <color>5942f584</color> <!-- fillColor with fillOpacity -->
    </PolyStyle>
  </Style>
  <Polygon>
    <outerBoundaryIs>
      <LinearRing>
        <coordinates>
          ${coordinates}
        </coordinates>
      </LinearRing>
    </outerBoundaryIs>
  </Polygon>
</Placemark>`;
        })
        .join("\n");
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    ${placemarks}
  </Document>
</kml>`;
};
