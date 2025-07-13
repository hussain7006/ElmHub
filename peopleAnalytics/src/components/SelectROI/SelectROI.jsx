import React, { useEffect, useState } from 'react'
import Modal from '@mui/material/Modal';
import { Box, Button, Typography } from '@mui/material';

// import paImg from "/images/paImg.png";


import {
    ShapeEditor,
    ImageLayer,
    DrawLayer,
    SelectionLayer,
    wrapShape,
} from 'react-shape-editor';



function arrayReplace(arr, index, item) {
    // console.log("in arrayReplace");
    // console.log("arr", arr, "index", index, "item", item);
    return [
        ...arr.slice(0, index),
        ...(Array.isArray(item) ? item : [item]),
        ...arr.slice(index + 1),
    ];
}

const RectShape = wrapShape(({ width, height }) => (
    <rect width={width} height={height} fill="rgba(0,0,255,0.5)" />
));

// let idIterator = 1;

export default function SelectROI({ openRoiModal, setOpenRoiModal, ROIs, setROIs, firstFrameForRoi, setDisableSaveButton }) {

    const [idIterator, setIdIterator] = useState(1);
    // const [paImg, setPaImg] = useState(null);
    // console.log("idIterator", idIterator);

    useEffect(() => {

        if (ROIs[openRoiModal.model].length === 0) {
            setIdIterator(1);
        } else {
            let lastItemId = ROIs[openRoiModal.model][ROIs[openRoiModal.model].length - 1].id.split("id")[1];
            setIdIterator(Number(lastItemId) + 1);
        }



    }, [openRoiModal, ROIs])

    const closeRoiModal = () => {
        setOpenRoiModal({ ...openRoiModal, open: false });
    }

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

    const [{ vectorHeight, vectorWidth }, setVectorDimensions] = useState({
        vectorHeight: 0,
        vectorWidth: 0,
    });
    // console.log("vectorHeight", vectorHeight, "vectorWidth", vectorWidth);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedShapeIds, setSelectedShapeIds] = useState([]);

    const shapes = ROIs[openRoiModal.model].map((item, index) => {
        const { id, height, width, x, y } = item;
        // console.log("item", item);
        return (
            <RectShape
                key={id}
                active={selectedShapeIds.indexOf(id) >= 0}
                shapeId={id}
                shapeIndex={index}
                height={height}
                width={width}
                x={x}
                y={y}
                // onChange={newRect => {
                //     setROIs(currentItems =>
                //         arrayReplace(currentItems, index, {
                //             ...item,
                //             ...newRect,
                //         })
                //     );
                // }}
                onChange={newRect => {
                    setROIs(currentModuleRois => ({
                        ...currentModuleRois,
                        [openRoiModal.model]: arrayReplace(currentModuleRois[openRoiModal.model], index, {
                            ...item,
                            ...newRect,
                        }),
                    }));
                    setDisableSaveButton(false)
                }}
                // onDelete={() => {
                //     setROIs(currentItems => arrayReplace(currentItems, index, []));
                // }}
                onDelete={() => {
                    setROIs(currentModuleRois => ({
                        ...currentModuleRois,
                        [openRoiModal.model]: arrayReplace(currentModuleRois[openRoiModal.model], index, []),
                    }));
                    setDisableSaveButton(false)
                }}
            />
        );
    });


    return (
        <Modal
            open={openRoiModal.open}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{ padding: "0px !important" }}
        >
            <Box sx={style}>
                <Box sx={{ flex: 1 }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ background: "#0B2447", color: "#fff", padding: "10px 20px" }}>
                        SELECT ROI <span style={{ fontSize: 16, color: "gray" }}>(Click and drag to draw)</span>
                    </Typography>

                    <Box sx={{ height: "calc(90vh - 65px)", display: "flex", justifyContent: "center", alignItems: "center", padding: "10px" }}>
                        <div style={{ height: "calc(78vh)", overflow: "scroll", width: "100%" }}>
                            {/* {firstFrameForRoi.toString()} */}
                            {/* <div>
                                <label htmlFor="mode-draw">
                                    <input
                                        id="mode-draw"
                                        type="radio"
                                        value="draw"
                                        onChange={event => setIsSelectionMode(false)}
                                        checked={!isSelectionMode}
                                    />{' '}
                                    Draw
                                </label>
                                &nbsp;&nbsp;&nbsp;
                                <label htmlFor="mode-select">
                                    <input
                                        id="mode-select"
                                        type="radio"
                                        value="select"
                                        onChange={event => setIsSelectionMode(true)}
                                        checked={isSelectionMode}
                                    />{' '}
                                    Select
                                </label>

                                <Button variant='contained' onClick={() => { console.log(ROIs); }}>Get ROIs</Button>
                            </div> */}

                            {/* {isSelectionMode
                                ? 'Click and drag to select shapes (or shift-click)'
                                : 'Click and drag to draw rects'} */}


                            {
                                !firstFrameForRoi ? (
                                    <div className='w-full h-full flex justify-center items-center text-xl text-gray-500'>
                                        Loading...
                                    </div>) :
                                    <ShapeEditor vectorWidth={vectorWidth} vectorHeight={vectorHeight} >
                                        {
                                            < ImageLayer
                                                src={firstFrameForRoi}
                                                onLoad={({ naturalWidth, naturalHeight }) => {
                                                    setVectorDimensions({
                                                        vectorWidth: naturalWidth,
                                                        vectorHeight: naturalHeight,
                                                    });
                                                }}
                                                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                            />
                                        }
                                        {isSelectionMode ? (
                                            <SelectionLayer
                                                selectedShapeIds={selectedShapeIds}
                                                onSelectionChange={ids => setSelectedShapeIds(ids)}
                                                keyboardTransformMultiplier={5}
                                                // onChange={(newRects, selectedShapesProps) => {
                                                //     setROIs(prevItems =>
                                                //         newRects.reduce((acc, newRect, index) => {
                                                //             const { shapeIndex } = selectedShapesProps[index];
                                                //             const item = acc[shapeIndex];
                                                //             return arrayReplace(acc, shapeIndex, {
                                                //                 ...item,
                                                //                 ...newRect,
                                                //             });
                                                //         }, prevItems)
                                                //     );
                                                // }}
                                                onChange={(newRects, selectedShapesProps) => {
                                                    console.log("222");
                                                    setROIs(prevModuleRois => ({
                                                        ...prevModuleRois,
                                                        [activeModule]: newRects.reduce((acc, newRect, index) => {
                                                            const { shapeIndex } = selectedShapesProps[index];
                                                            const item = acc[shapeIndex];
                                                            return arrayReplace(acc, shapeIndex, {
                                                                ...item,
                                                                ...newRect,
                                                            });
                                                        }, prevModuleRois[activeModule]),
                                                    }));
                                                    setDisableSaveButton(false)
                                                }}
                                                onDelete={(event, selectedShapesProps) => {
                                                    setROIs(prevItems =>
                                                        selectedShapesProps
                                                            .map(p => p.shapeIndex)
                                                            // Delete the indices in reverse so as not to shift the
                                                            // other array elements and screw up the array indices
                                                            .sort((a, b) => b - a)
                                                            .reduce(
                                                                (acc, shapeIndex) => arrayReplace(acc, shapeIndex, []),
                                                                prevItems
                                                            )
                                                    );
                                                    setDisableSaveButton(false)
                                                }}
                                            >
                                                {shapes}
                                            </SelectionLayer>
                                        ) : (
                                            <>
                                                <DrawLayer
                                                    // onAddShape={({ x, y, width, height }) => {

                                                    //     setROIs(currentItems => [
                                                    //         ...currentItems,
                                                    //         { id: `id${idIterator}`, x, y, width: Math.round(width), height: Math.round(height) },
                                                    //     ]);
                                                    //     idIterator += 1;
                                                    // }}
                                                    onAddShape={({ x, y, width, height }) => {

                                                        // console.log("idIterator =:",idIterator);
                                                        setROIs(currentModuleRois => ({
                                                            ...currentModuleRois,
                                                            [openRoiModal.model]: [
                                                                ...currentModuleRois[openRoiModal.model],
                                                                { id: `id${idIterator}`, x, y, width, height },
                                                            ],
                                                        }));
                                                        // idIterator += 1;
                                                        setIdIterator(idIterator + 1);
                                                        setDisableSaveButton(false)
                                                    }}
                                                />
                                                {shapes}
                                            </>
                                        )}
                                    </ShapeEditor>
                            }


                        </div>
                    </Box>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "end", gap: 2, background: "#c0cbd5", padding: "10px 20px" }}>

                    <Button variant='contained' onClick={closeRoiModal} sx={{ borderRadius: "5px !important", background: "#952D98", width: 120, '&:hover': { backgroundColor: "#952D98", opacity: 0.9 }, }}>
                        Close
                    </Button>
                    {/* <Button variant='contained' onClick={closeRoiModal} sx={{ borderRadius: "5px !important", background: "#2A6EBB", width: 120, '&:hover': { backgroundColor: "#2A6EBB", opacity: 0.9 }, }}>
                        Done
                    </Button> */}
                </Box>
            </Box>
        </Modal>
    )
}

