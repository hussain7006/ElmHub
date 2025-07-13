import React, { useCallback, useEffect, useRef, useState } from 'react'
import Modal from '@mui/material/Modal';
import { Box, Button, Typography } from '@mui/material';
import { Stage, Layer, Image, Rect, Line, Transformer } from 'react-konva';
import useImage from 'use-image';
import { v4 as uuidv4 } from 'uuid';
// import paImg from "/images/paImg.png";
import ClearIcon from '@mui/icons-material/Clear';
import { use } from 'react';



export default function DrawLine({ openRoiModal, setOpenRoiModal, ROIs, setROIs, firstFrameForRoi, setDisableSaveButton }) {

    const MINIMUM_LENGTH_CM = 1;
    const DPI = 96;
    const CM_TO_PX = DPI / 2.54;


    const [image] = useImage(firstFrameForRoi);
    const [lines, setLines] = useState([]);
    const [currentLine, setCurrentLine] = useState(null);

    const stageRef = useRef(null);
    const transformerRef = useRef(null);
    const containerRef = useRef(null);

    const [dimensions, setDimensions] = useState({ width: 360, height: 360 });
    const [imageDimensions, setImageDimensions] = useState({ width: 360, height: 360 });

    const [selectedLine, setSelectedLine] = useState(null);

    const isPaintRef = useRef(false);
    const currentLineRef = useRef(null);

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current && image) {
                const containerWidth = containerRef.current.offsetWidth;
                const containerHeight = containerRef.current.offsetHeight;

                const imageAspectRatio = image.width / image.height;
                let newWidth, newHeight;

                if (containerWidth / containerHeight > imageAspectRatio) {
                    newHeight = containerHeight;
                    newWidth = containerHeight * imageAspectRatio;
                } else {
                    newWidth = containerWidth;
                    newHeight = containerWidth / imageAspectRatio;
                }

                setDimensions({
                    width: containerWidth,
                    height: containerHeight,
                });

                setImageDimensions({
                    width: newWidth,
                    height: newHeight,
                });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);

        return () => {
            window.removeEventListener('resize', updateDimensions);
        };
    }, [image]);

    const calculateScaleFactor = () => {
        return {
            x: imageDimensions.width / image.width,
            y: imageDimensions.height / image.height,
        };
    };

    const onStageMouseDown = useCallback((e) => {

        if (e.target.className == "Rect") {
            return
        }

        // If clicked on a selected line, prevent drawing or clearing
        if (e.target.className === "Line" && e.target.id === selectedLine?.attrs?.id) {
            return;
        }


        if (selectedLine) {
            // Get the bounding box of the selected line
            const selectedLineRect = selectedLine.getClientRect();

            const stage = stageRef.current;
            const pos = stage.getPointerPosition();

            // Check if the click is inside the bounding box of the selected line
            if (
                pos.x >= selectedLineRect.x &&
                pos.x <= selectedLineRect.x + selectedLineRect.width &&
                pos.y >= selectedLineRect.y &&
                pos.y <= selectedLineRect.y + selectedLineRect.height
            ) {
                // Click is inside the bounding box of the selected line, so do nothing
                return;
            }
        }

        const stage = stageRef.current;
        const pos = stage.getPointerPosition();
        const scaleFactor = calculateScaleFactor();

        const x = (pos.x - (dimensions.width - imageDimensions.width) / 2) / scaleFactor.x;
        const y = (pos.y - (dimensions.height - imageDimensions.height) / 2) / scaleFactor.y;


        // Deselect the line if clicked outside
        setSelectedLine(null);
        transformerRef.current?.nodes([]);

        // If clicked on an existing line, don't start a new one
        if (e.target.className === "Line") {
            return;
        }

        const id = uuidv4();
        const newLine = { id, points: [x, y], color: 'red' };

        // Allow only one line to exist at a time
        isPaintRef.current = true;
        setCurrentLine(id);
        setLines([newLine]); // Replace existing lines with the new one

    }, [dimensions, imageDimensions, selectedLine]);

    const onStageMouseMove = useCallback((e) => {

        if (!isPaintRef.current) return;
        if (!currentLine) return;

        const stage = stageRef.current;
        const pos = stage.getPointerPosition();
        const scaleFactor = calculateScaleFactor();

        const x = (pos.x - (dimensions.width - imageDimensions.width) / 2) / scaleFactor.x;
        const y = (pos.y - (dimensions.height - imageDimensions.height) / 2) / scaleFactor.y;

        setLines((prevLines) =>
            prevLines.map((line) =>
                line.id === currentLine ? { ...line, points: [line.points[0], line.points[1], x, y] } : line
            )
        );

    }, [currentLine, dimensions, imageDimensions]);

    const onStageMouseUp = useCallback(() => {
        isPaintRef.current = false;
        currentLineRef.current = null;


        const line = lines.find((l) => l.id === currentLine);
        if (!line) return;

        const [x1, y1, x2, y2] = line.points;
        const lengthPx = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)); // Pythagorean theorem

        if (lengthPx < MINIMUM_LENGTH_CM * CM_TO_PX) {
            // setLines((prevLines) => prevLines.filter((l) => l.id !== currentLine));
            setLines([]); // Remove the line if it is too short
        } else {
            setROIs((prev) => ({ ...prev, line: [x1, y1, x2, y2] }));
            setDisableSaveButton(false)
        }

    }, [lines, currentLine]);


    const handleLineDragEnd = (e) => {
        console.log("handleLineDragEnd", e.target.id());

        const line = lines.find((l) => l.id === e.target.id());
        if (!line) return;

        const [x1, y1, x2, y2] = line.points;
        const lengthPx = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)); // Pythagorean theorem

        if (lengthPx < MINIMUM_LENGTH_CM * CM_TO_PX) {
            setLines([]); // Remove the line if it is too short
            console.log("if");

        } else {
            console.log("else");

            setROIs((prev) => ({ ...prev, line: [x1, y1, x2, y2] }));
            setDisableSaveButton(false)
        }
    }

    useEffect(() => {
        if (ROIs.line) {
            const { line } = ROIs;
            const id = uuidv4();
            const newLine = { id, points: line, color: 'red' };
            setLines([newLine]);
        }




    }, [ROIs])

    // const onBgClick = useCallback(() => { transformerRef.current?.nodes([]); }, []);


    const onLineClick = useCallback((e) => {
        const currentTarget = e.currentTarget;
        setSelectedLine(currentTarget);
        // transformerRef.current?.nodes([currentTarget]); // Attach transformer to the selected line
    }, []);


    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Delete' && selectedLine) {
                setLines([]); // Clear the line
                setSelectedLine(null);
                setROIs((prev) => ({ ...prev, line: [] }));
                transformerRef.current?.nodes([]); // Detach transformer
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedLine]);


    const closeRoiModal = () => {
        setOpenRoiModal({ ...openRoiModal, open: false });
    }


    useEffect(() => {
        // setDisableSaveButton(false)
        console.log("lines", lines);

    }, [lines]);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: "95vw",
        height: "95vh",
        bgcolor: 'background.paper',
        boxShadow: 24,
        display: "flex",
        flexDirection: "column",
        outline: "none",
    };



    return (
        <Modal
            open={openRoiModal.open}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{ padding: "0px !important" }}
        >
            <Box sx={style}>
                <Box sx={{ flex: 1 }}>
                    <Box className='relative' sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0B2447", padding: "10px 10px" }}>
                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ background: "#0B2447", color: "#fff", padding: "0px" }}>
                            DRAW LINE <span style={{ fontSize: 16, color: "gray" }}>(Click and drag to draw)</span>
                        </Typography>

                        <div
                            style={{ background: "#952D98" }}
                            className='border-2 border-green-900 rounded-lg z-10 cursor-pointer flex gap-1'
                            onClick={closeRoiModal}
                        >
                            <div className=''><ClearIcon style={{ color: "white" }} /></div>
                        </div>
                    </Box>

                    <Box sx={{ height: "calc(90vh - 65px)", display: "flex", justifyContent: "center", alignItems: "center", padding: "10px" }}>
                        <div style={{ height: "calc(78vh)", overflow: "scroll", width: "100%" }}>
                            {
                                !firstFrameForRoi ? (
                                    <div className='w-full h-full flex justify-center items-center text-xl text-gray-500'>
                                        Loading...
                                    </div>) :
                                    <div ref={containerRef} className='relative w-full h-full flex flex-col justify-center items-center cursor-crosshair'>

                                        <Stage ref={stageRef} width={dimensions.width} height={dimensions.height} onMouseUp={onStageMouseUp} onMouseDown={onStageMouseDown} onMouseMove={onStageMouseMove} className='w-full'>
                                            <Layer>
                                                <Image
                                                    image={image}
                                                    width={imageDimensions.width}
                                                    height={imageDimensions.height}
                                                    x={(dimensions.width - imageDimensions.width) / 2} // Center the image horizontally
                                                    y={(dimensions.height - imageDimensions.height) / 2} // Center the image vertically
                                                />

                                                {image && lines.map((line) => {
                                                    const scaleFactor = calculateScaleFactor();
                                                    const scaledPoints = line.points.flatMap((p, i) =>
                                                        i % 2 === 0
                                                            ? p * scaleFactor.x + (dimensions.width - imageDimensions.width) / 2
                                                            : p * scaleFactor.y + (dimensions.height - imageDimensions.height) / 2
                                                    );

                                                    return (
                                                        <Line
                                                            key={line.id}
                                                            id={line.id}
                                                            points={scaledPoints}
                                                            stroke={line.id === selectedLine?.attrs?.id ? 'blue' : line.color} // Highlight selected line
                                                            strokeWidth={line.id === selectedLine?.attrs?.id ? 3 : 2}
                                                            lineCap="round"
                                                            lineJoin="round"
                                                            hitStrokeWidth={15} // This expands the clickable area of the line
                                                            onClick={onLineClick}
                                                            draggable={false}
                                                            // onDragEnd={(e) => {
                                                            //     console.log("handleLineDragEnd", e.target.id());

                                                            //     const line = lines.find((l) => l.id === e.target.id());
                                                            //     if (!line) return;

                                                            //     const [x1, y1, x2, y2] = line.points;
                                                            //     const lengthPx = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)); // Pythagorean theorem

                                                            //     if (lengthPx < MINIMUM_LENGTH_CM * CM_TO_PX) {
                                                            //         setLines([]); // Remove the line if it is too short
                                                            //         console.log("if");

                                                            //     } else {
                                                            //         console.log("else");

                                                            //         setROIs((prev) => ({ ...prev, line: [x1, y1, x2, y2] }));
                                                            //         setDisableSaveButton(false)
                                                            //     }
                                                            // }}
                                                            // onDragMove={(e) => {
                                                            //     console.log("onDragMove", e.target.id());
                                                                
                                                            // }}


                                                        />

                                                    );
                                                })}
                                                <Transformer ref={transformerRef} />
                                            </Layer>
                                        </Stage>
                                    </div >
                            }


                        </div>
                    </Box>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "end", gap: 2, background: "#c0cbd5", padding: "10px 20px" }}>
                    <Button variant='contained' onClick={closeRoiModal} sx={{ borderRadius: "5px !important", background: "#952D98", width: 120, '&:hover': { backgroundColor: "#952D98", opacity: 0.9 }, }}>
                        Close
                    </Button>
                </Box>
            </Box>
        </Modal>
    )
}

