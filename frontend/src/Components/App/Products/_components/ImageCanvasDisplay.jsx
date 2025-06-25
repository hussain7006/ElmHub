import { useRef, useEffect } from 'react';
import useThemeStore from '../../../../store/themeStore';

export default function ImageCanvasDisplay({
    results,
    imageUrl,
    classificationResult,
    detectedClasses,
    keypointResult,
    colorPalette,
    onImageLoad,
    isDrawing,
    imageLoaded
}) {
    const { colors } = useThemeStore();
    const canvasRef = useRef(null);
    const imageRef = useRef(null);

    // Draw classification overlay
    const drawClassificationOverlay = () => {
        const canvas = canvasRef.current;
        const image = imageRef.current;

        if (!canvas || !image || !classificationResult) {
            console.log('Missing required elements for classification overlay');
            return;
        }

        const ctx = canvas.getContext('2d');

        // Fixed canvas width - smaller for classification
        const fixedWidth = 150;
        const aspectRatio = image.naturalHeight / image.naturalWidth;
        const canvasHeight = fixedWidth * aspectRatio;

        // Set canvas size
        canvas.width = fixedWidth;
        canvas.height = canvasHeight;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the image
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        // // Draw classification overlay
        // // const gender = classificationResult.label;

        // // Create gradient background for overlay
        // // const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        // // gradient.addColorStop(0, 'rgba(59, 130, 246, 0.9)'); // Blue
        // // gradient.addColorStop(1, 'rgba(236, 72, 153, 0.9)'); // Pink

        // // Draw overlay at bottom - very compact
        // // const overlayHeight = 20;
        // // const overlayY = canvas.height - overlayHeight;

        // // ctx.fillStyle = gradient;
        // // ctx.fillRect(0, overlayY, canvas.width, overlayHeight);

        // // Draw gender text
        // // ctx.fillStyle = 'white';
        // // ctx.font = 'bold 10px Arial';
        // // ctx.textAlign = 'center';
        // // ctx.fillText(gender, canvas.width / 2, overlayY + 13);
    };

    // Draw keypoints
    const drawKeypoints = () => {
        const canvas = canvasRef.current;
        const image = imageRef.current;

        if (!canvas || !image || !keypointResult) {
            console.log('Missing required elements for keypoint drawing');
            return;
        }

        const ctx = canvas.getContext('2d');

        // Fixed canvas width
        const fixedWidth = 600;
        const aspectRatio = image.naturalHeight / image.naturalWidth;
        const canvasHeight = fixedWidth * aspectRatio;

        // Set canvas size
        canvas.width = fixedWidth;
        canvas.height = canvasHeight;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the image
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        // Calculate scale factors
        const scaleX = canvas.width / image.naturalWidth;
        const scaleY = canvas.height / image.naturalHeight;

        // Color palette for different people
        const personColors = [
            '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF',
            '#00FFFF', '#FFA500', '#800080', '#008000', '#FFC0CB'
        ];

        // Draw keypoints for each person
        keypointResult.xy.forEach((person, personIndex) => {
            const personColor = personColors[personIndex % personColors.length];

            // Draw each keypoint
            person.forEach((point, pointIndex) => {
                if (Array.isArray(point) && point.length === 2) {
                    const [x, y] = point;

                    // Scale coordinates
                    const scaledX = x * scaleX;
                    const scaledY = y * scaleY;

                    // Draw keypoint circle
                    ctx.beginPath();
                    ctx.arc(scaledX, scaledY, 2, 0, 2 * Math.PI);
                    ctx.fillStyle = personColor;
                    ctx.fill();
                    // ctx.strokeStyle = 'white';
                    // ctx.lineWidth = 1;
                    // ctx.stroke();

                    // Draw point number (optional)
                    // ctx.fillStyle = 'white';
                    // ctx.font = '10px Arial';
                    // ctx.textAlign = 'center';
                    // ctx.fillText(pointIndex + 1, scaledX, scaledY - 8);
                }
            });
        });
    };

    // Draw bounding boxes
    const drawBoundingBoxes = () => {
        const canvas = canvasRef.current;
        const image = imageRef.current;

        if (!canvas || !image || !results.response) {
            console.log('Missing required elements:', { canvas: !!canvas, image: !!image, response: !!results.response });
            return;
        }

        const ctx = canvas.getContext('2d');

        // Fixed canvas width
        const fixedWidth = 600;
        const aspectRatio = image.naturalHeight / image.naturalWidth;
        const canvasHeight = fixedWidth * aspectRatio;

        // Set canvas size
        canvas.width = fixedWidth;
        canvas.height = canvasHeight;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the image
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        // Safety checks for response structure
        if (!Array.isArray(results.response) || results.response.length === 0) {
            console.log('Response is not an array or is empty');
            return;
        }

        const firstResult = results.response[0];
        if (!firstResult || typeof firstResult !== 'object') {
            console.log('First result is not a valid object');
            return;
        }

        // Calculate scale factor for bounding boxes
        const scaleX = canvas.width / image.naturalWidth;
        const scaleY = canvas.height / image.naturalHeight;

        // Draw bounding boxes
        if (firstResult.xyxy && Array.isArray(firstResult.xyxy)) {
            firstResult.xyxy.forEach((box, index) => {
                try {
                    if (!Array.isArray(box) || box.length !== 4) {
                        console.log(`Invalid box ${index}:`, box);
                        return;
                    }

                    const [x1, y1, x2, y2] = box;

                    // Validate coordinates are numbers
                    if (typeof x1 !== 'number' || typeof y1 !== 'number' ||
                        typeof x2 !== 'number' || typeof y2 !== 'number') {
                        console.log(`Invalid coordinates in box ${index}:`, box);
                        return;
                    }

                    // Scale the coordinates to match the canvas size
                    const scaledX1 = x1 * scaleX;
                    const scaledY1 = y1 * scaleY;
                    const scaledX2 = x2 * scaleX;
                    const scaledY2 = y2 * scaleY;

                    const width = scaledX2 - scaledX1;
                    const height = scaledY2 - scaledY1;

                    // Get class and assign color
                    const className = firstResult.class?.[index] || `class_${index}`;
                    const classIndex = detectedClasses.indexOf(className);
                    const boxColor = colorPalette[classIndex % colorPalette.length] || '#FF0000';

                    // Draw rectangle with color coding
                    ctx.strokeStyle = boxColor;
                    ctx.lineWidth = Math.max(2, 3);
                    ctx.strokeRect(scaledX1, scaledY1, width, height);

                } catch (error) {
                    console.error(`Error drawing box ${index}:`, error);
                }
            });
        }
    };

    // Draw when results change
    useEffect(() => {
        if (results?.response && imageUrl && imageLoaded) {
            setTimeout(() => {
                if (classificationResult) {
                    drawClassificationOverlay();
                } else if (keypointResult) {
                    drawKeypoints();
                } else {
                    drawBoundingBoxes();
                }
            }, 500);
        }
    }, [results?.response, imageUrl, imageLoaded, classificationResult, keypointResult, detectedClasses]);

    return (
        <div className={`${classificationResult ? 'flex justify-center w-full lg:w-auto' : 'flex-1 relative min-w-0'}`}>
            <canvas
                key={`canvas-${classificationResult ? 'classification' : keypointResult ? 'keypoints' : 'detection'}-${imageLoaded}`}
                ref={canvasRef}
                className={`w-full h-auto rounded-lg border mx-auto block ${classificationResult ? 'max-w-[150px]' : 'max-w-[600px]'}`}
                style={{ borderColor: colors.borderColor }}
                onClick={(e) => e.stopPropagation()}
            />
            <img
                ref={imageRef}
                src={imageUrl}
                alt="Uploaded image"
                className="hidden"
                onLoad={onImageLoad}
                onError={(e) => console.error('Image failed to load:', e)}
            />
            {(!imageLoaded || isDrawing) && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-lg">
                    <div className="text-center">
                        <div className="relative">
                            {/* Outer ring */}
                            <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
                            {/* Animated inner ring */}
                            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
                            {/* Center dot */}
                            <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-blue-600 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-3 font-medium">
                            {!imageLoaded ? 'Loading image...' : (
                                classificationResult ? 'Processing classification...' :
                                    keypointResult ? 'Drawing keypoints...' : 'Drawing bounding boxes...'
                            )}
                        </p>
                        {isDrawing && (
                            <div className="flex space-x-1 mt-2 justify-center">
                                <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce"></div>
                                <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
} 