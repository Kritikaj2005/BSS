from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import numpy as np
import soundfile as sf
from sklearn.decomposition import FastICA
from typing import List

app = FastAPI()

# Set paths relative to backend/
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # This already points to backend/
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
OUTPUT_DIR = os.path.join(BASE_DIR, "outputs")

# Ensure directories exist
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Allow all origins for simplicity
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.post("/upload/")
async def upload_files(files: List[UploadFile] = File(...)):
    # Clear previous uploads
    for existing_file in os.listdir(UPLOAD_DIR):
        file_path = os.path.join(UPLOAD_DIR, existing_file)
        if os.path.isfile(file_path):
            os.remove(file_path)

    # Save all uploaded files
    file_names = []
    for file in files:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        file_names.append(file.filename)
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())

    # Process the audio files
    process_audio(file_names)

    return {"message": f"{len(files)} files uploaded and processing complete!"}

def process_audio(file_names):
    # Assuming exactly 2 mixed audio files are uploaded
    if len(file_names) != 2:
        raise ValueError("Expected exactly 2 audio files for separation.")
    
    mixed_signals = []

    for filename in file_names:
        input_file = os.path.join(UPLOAD_DIR, filename)
        # Read the mixed audio file
        data, samplerate = sf.read(input_file)
        mixed_signals.append(data)

    # Stack the mixed signals to form a 2D array for ICA
    mixed_signals = np.array(mixed_signals)

    # Apply FastICA for separating the mixed signals
    ica = FastICA(n_components=2)
    separated_signals = ica.fit_transform(mixed_signals.T)  # Transpose to fit the expected shape

    # Save the separated signals to output directory
    output_files = []
    for i in range(separated_signals.shape[1]):
        output_filename = f"separated_{i+1}.wav"
        output_path = os.path.join(OUTPUT_DIR, output_filename)
        sf.write(output_path, separated_signals[:, i], samplerate)
        output_files.append(output_filename)

    return output_files

@app.get("/output/separated_1.wav")
async def get_audio_1():
    audio_file_path = os.path.join(OUTPUT_DIR, "separated_1.wav")
    if os.path.exists(audio_file_path):
        return FileResponse(audio_file_path)
    else:
        return {"error": "File not found"}

@app.get("/output/separated_2.wav")
async def get_audio_2():
    audio_file_path = os.path.join(OUTPUT_DIR, "separated_2.wav")
    if os.path.exists(audio_file_path):
        return FileResponse(audio_file_path)
    else:
        return {"error": "File not found"}
