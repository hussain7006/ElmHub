export const getImageFromBounding = async (url: string): Promise<Blob> => {
  try {
    // Fetch the image from the provided URL
    const resp = await fetch(url);

    // Check if the response is successful
    if (!resp.ok) {
      throw new Error(`Failed to fetch image: ${resp.statusText}`);
    }

    // Convert the response to a Blob
    const blob = await resp.blob();

    // Create an image object to load the blob
    const img = new Image();
    const objectURL = URL.createObjectURL(blob);
    
    // Return a promise that resolves after the image is loaded
    const imgLoaded = new Promise<HTMLImageElement>((resolve, reject) => {
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = objectURL;
    });

    // Wait for the image to load
    const image = await imgLoaded;

    // Create a canvas to crop the image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    // Set canvas dimensions (cropping the bottom 10px)
    canvas.width = image.width;
    canvas.height = image.height - 18;

    // Draw the image on the canvas, excluding the bottom 10px
    ctx.drawImage(image, 0, 0, image.width, image.height - 18, 0, 0, image.width, image.height - 18);

    // Convert the canvas to a Blob and return it
    const croppedBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create Blob from canvas'));
        }
      }, 'image/png');
    });

    return croppedBlob;
  } catch (error) {
    console.error('Error fetching or processing image:', error);
    throw error; // Re-throw the error for the caller to handle
  }
};
export const createSessionToken = async (
  apiKey: string,
  mapType: string = "satellite",
  language: string = "en-US",
  region: string = "SA"
): Promise<string | null> => {
  try {
    const url = `https://tile.googleapis.com/v1/createSession?key=${apiKey}`;

    // Request payload
    const payload = {
      mapType,
      language,
      region,
    };

    // Make a POST request to create a session
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`Failed to create session: ${response.statusText}`);
    }

    // Parse the JSON response
    const data = await response.json();
    console.log(data);
    // Return the session token if available
    return data?.session || null;
  } catch (error) {
    console.error("Error creating session token:", error);
    return null; // Return null in case of an error
  }
};
export const getTileFromBounding = async (url: string): Promise<Blob | null > => {
  try {
    // Fetch the image from the provided URL
    const resp = await fetch(url);

    // Check if the response is successful
    if (!resp.ok) {
      throw new Error(`Failed to fetch image: ${resp.statusText}`);
    }

    // Convert the response to a Blob
    const blob = await resp.blob();

    return blob;
  } catch (error) {
    console.error('Error fetching or processing image:', error);
    throw error; // Re-throw the error for the caller to handle
  }
};