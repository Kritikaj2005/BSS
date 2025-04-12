import os
import numpy as np
import soundfile as sf
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse
from sklearn.decomposition import FastICA

app = FastAPI()

# Set paths relative to backend/
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # Get the current directory
UPLOAD_DIR = os.path.join(BASE_DIR, "backend/uploads")
OUTPUT_DIR = os.path.join(BASE_DIR, "backend/outputs")

# Ensure directories exist
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    
    # Save uploaded file
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    return {"message": f"File '{file.filename}' uploaded successfully!"}

@app.post("/process/")
async def process_audio(filename: str):
    input_file = os.path.join(UPLOAD_DIR, filename)
    
    # Read the mixed audio file
    data, samplerate = sf.read(input_file)
    
    # Apply ICA
    ica = FastICA(n_components=2)
    separated = ica.fit_transform(data)
    
    # Save separated audio files
    output_files = []
    for i in range(separated.shape[1]):
        output_filename = f"separated_{i + 1}.wav"
        output_path = os.path.join(OUTPUT_DIR, output_filename)
        sf.write(output_path, separated[:, i], samplerate)
        output_files.append(output_filename)

    return {"message": "Separation complete!", "files": output_files}

@app.get("/download/{filename}")
async def download_file(filename: str):
    file_path = os.path.join(OUTPUT_DIR, filename)
    if os.path.exists(file_path):
        return FileResponse(file_path, filename=filename)
    return {"error": "File not found"}
