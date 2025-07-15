# Helper Backend

This folder contains the backend implementation for the project using **FastAPI**.

## Prerequisites



## Setup Instructions

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd AI_Backend
   ```

2. **Create a virtual environment** (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install fastapi uvicorn
   ```

   If you have a `requirements.txt` file, install all dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**:
   - Create a `.env` file in the root of the `AI_Backend` folder.
   - Add the required environment variables in the following format:
     ```
     ENV_VAR_NAME=value
     ANOTHER_ENV_VAR=another_value
     ```


5. **Run the FastAPI server**:
   ```bash
   uvicorn main:app --reload
   ```

   - Replace `main` with the name of your main Python file (without the `.py` extension).
   - The `--reload` flag enables hot-reloading for development.

6. **Access the API**:
   - Open your browser and navigate to `http://127.0.0.1:7000` to access the API.
   - Visit `http://127.0.0.1:7000/docs` for the interactive Swagger UI documentation.
   - Visit `http://127.0.0.1:7000/redoc` for the ReDoc documentation.

## Project Structure

Below is an example structure for a FastAPI project:

```

```

## Testing

To run tests, use the `pytest` framework:
```bash
pip install pytest
pytest
```

## Deployment

```
```

## Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Uvicorn Documentation](https://www.uvicorn.org/)
- [python-dotenv Documentation](https://saurabh-kumar.com/python-dotenv/)