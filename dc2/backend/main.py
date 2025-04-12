from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import numpy as np
import soundfile as sf
from sklearn.decomposition import FastICA
from typing import List
import matplotlib.pyplot as plt

app = FastAPI()

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
OUTPUT_DIR = os.path.join(BASE_DIR, "outputs")
GRAPH_DIR = os.path.join(BASE_DIR, "graphs")

# Ensure directories exist
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(GRAPH_DIR, exist_ok=True)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload/")
async def upload_files(files: List[UploadFile] = File(...)):
    # Clear old uploads
    for f in os.listdir(UPLOAD_DIR):
        os.remove(os.path.join(UPLOAD_DIR, f))

    # Save new files
    file_names = []
    for file in files:
        path = os.path.join(UPLOAD_DIR, file.filename)
        with open(path, "wb") as buffer:
            buffer.write(await file.read())
        file_names.append(file.filename)

    # Process audio
    process_audio(file_names)

    return {"message": f"{len(files)} files uploaded and processed!"}

def generate_and_save_graphs(data1, data2, is_separated=False):
    data1 = data1 - np.mean(data1)
    data1 = data1 / np.max(np.abs(data1))
    data2 = data2 - np.mean(data2)
    data2 = data2 / np.max(np.abs(data2))

    graph_1_filename = "separated_signal_1.png" if is_separated else "mixed_signal_1.png"
    graph_2_filename = "separated_signal_2.png" if is_separated else "mixed_signal_2.png"

    plt.figure(figsize=(10, 4))
    plt.plot(data1)
    plt.title(f"Signal 1{' Separated' if is_separated else ''}")
    plt.xlabel("Time")
    plt.ylabel("Amplitude")
    plt.tight_layout()
    plt.savefig(os.path.join(GRAPH_DIR, graph_1_filename))
    plt.close()

    plt.figure(figsize=(10, 4))
    plt.plot(data2)
    plt.title(f"Signal 2{' Separated' if is_separated else ''}")
    plt.xlabel("Time")
    plt.ylabel("Amplitude")
    plt.tight_layout()
    plt.savefig(os.path.join(GRAPH_DIR, graph_2_filename))
    plt.close()

def generate_comparison_graphs(mixed1, mixed2, separated):
    def normalize(signal):
        signal = signal - np.mean(signal)
        return signal / np.max(np.abs(signal))

    mixed1 = normalize(mixed1)
    mixed2 = normalize(mixed2)
    sep1 = normalize(separated[:, 0])
    sep2 = normalize(separated[:, 1])

    plt.figure(figsize=(12, 5))
    plt.plot(mixed1, label='Mixed Signal 1', color='red', alpha=0.6)
    plt.plot(sep1, label='Separated Signal 1', color='blue', linestyle='dashed')
    plt.title("Comparison of Mixed and Separated Signals (Channel 1)")
    plt.xlabel("Time")
    plt.ylabel("Amplitude")
    plt.legend()
    plt.grid(True)
    plt.tight_layout()
    plt.savefig(os.path.join(GRAPH_DIR, "comparison_signal_1.png"))
    plt.close()

    plt.figure(figsize=(12, 5))
    plt.plot(mixed2, label='Mixed Signal 2', color='green', alpha=0.6)
    plt.plot(sep2, label='Separated Signal 2', color='purple', linestyle='dashed')
    plt.title("Comparison of Mixed and Separated Signals (Channel 2)")
    plt.xlabel("Time")
    plt.ylabel("Amplitude")
    plt.legend()
    plt.grid(True)
    plt.tight_layout()
    plt.savefig(os.path.join(GRAPH_DIR, "comparison_signal_2.png"))
    plt.close()

def process_audio(file_names):
    if len(file_names) != 2:
        raise ValueError("Expected exactly 2 audio files for separation.")

    mixed_signals = []

    for filename in file_names:
        path = os.path.join(UPLOAD_DIR, filename)
        data, samplerate = sf.read(path)
        mixed_signals.append(data)

    mixed_signals = np.array(mixed_signals)

    generate_and_save_graphs(mixed_signals[0], mixed_signals[1])

    ica = FastICA(n_components=2)
    separated_signals = ica.fit_transform(mixed_signals.T)

    for i in range(separated_signals.shape[1]):
        output_path = os.path.join(OUTPUT_DIR, f"separated_{i+1}.wav")
        sf.write(output_path, separated_signals[:, i], samplerate)

    generate_and_save_graphs(separated_signals[:, 0], separated_signals[:, 1], is_separated=True)

    generate_comparison_graphs(mixed_signals[0], mixed_signals[1], separated_signals)

@app.get("/output/separated_1.wav")
async def get_audio_1():
    path = os.path.join(OUTPUT_DIR, "separated_1.wav")
    if os.path.exists(path):
        return FileResponse(path)
    return {"error": "File not found"}

@app.get("/output/separated_2.wav")
async def get_audio_2():
    path = os.path.join(OUTPUT_DIR, "separated_2.wav")
    if os.path.exists(path):
        return FileResponse(path)
    return {"error": "File not found"}

@app.get("/graphs/{filename}")
async def get_graph(filename: str):
    path = os.path.join(GRAPH_DIR, filename)
    if os.path.exists(path):
        return FileResponse(path)
    return {"error": "Graph not found"}
