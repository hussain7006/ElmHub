# Project Setup and Usage

## Installation

1. Install the required dependencies:
   ```bash
   npm install --force
   ```
   The `--force` flag ensures that all packages are installed even if there are dependency conflicts.

## Configuration

1. Update the Google Maps API key in the project file:
   - Open the file `src/main.tsx`.
   - Locate the placeholder for `API_KEY` and replace it with your Google Maps API key:
     ```javascript
     const API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";
     ```

## Run the Project

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to the local development server URL (usually `http://localhost:5173`).



