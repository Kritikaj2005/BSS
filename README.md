# 🎧 FastICA-Based Audio Source Separation & Visualization

This project is a web-based application that demonstrates **Blind Source Separation (BSS)** using the **Fast Independent Component Analysis (FastICA)** algorithm. The system allows users to upload two mixed audio signals and then separates them into their independent source components. It also provides audio playback and signal visualizations for better understanding.

---

## 🧠 What is FastICA?

**FastICA** is a computationally efficient algorithm for performing **Independent Component Analysis (ICA)** — a technique used to separate multivariate signals into additive, independent components. It’s widely used in signal processing applications such as:
- Audio source separation (the "cocktail party problem")
- EEG/ECG signal decomposition
- Financial data analysis

This app visually and audibly demonstrates FastICA in action.

---

## 🗂️ Project Overview

### Features

✅ Upload 2 mixed audio files  
✅ Perform FastICA to separate signals  
✅ Download & listen to separated sources  
✅ View time-domain plots of:
- Mixed signals
- Separated signals
- Comparison graphs  
✅ Responsive UI built with modern web technologies

---

## 🛠 Tech Stack

| Layer     | Tools Used                        |
|-----------|-----------------------------------|
| Frontend  | React, Tailwind CSS               |
| Backend   | FastAPI, Python                   |
| Audio I/O | `soundfile` (libsndfile)          |
| ICA       | `sklearn.decomposition.FastICA`   |
| Plotting  | `matplotlib`, NumPy               |

---

## 📦 Folder Structure

```
audio-separation-app/
├── backend/
│   ├── main.py              # FastAPI app for processing and graph generation
│   ├── uploads/             # Temporary uploaded audio files
│   ├── outputs/             # Output separated audio files (.wav)
│   └── graphs/              # Signal visualizations (.png)
└── frontend/
    ├── src/components/Input.jsx  # Upload + Result UI component
    └── tailwind.config.js        # Tailwind CSS settings
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/fastica-audio-separation.git
cd fastica-audio-separation
```

---

### 2. Backend Setup (Python 3.9+ recommended)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --reload
```

> **Required Python packages**:
> - `fastapi`
> - `uvicorn`
> - `numpy`
> - `soundfile`
> - `scikit-learn`
> - `matplotlib`
> - `python-multipart` (for file upload)

---

### 3. Frontend Setup (React + Tailwind)

```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/upload/` | Upload and process two mixed audio files |
| GET    | `/output/separated_1.wav` | Download separated audio source 1 |
| GET    | `/output/separated_2.wav` | Download separated audio source 2 |
| GET    | `/graphs/{filename}` | Retrieve waveform visualizations |

---

## 📊 Visual Outputs

The backend generates and serves the following graphs:

| Graph Type          | Files |
|---------------------|-------|
| Mixed Signals       | `mixed_signal_1.png`, `mixed_signal_2.png` |
| Separated Signals   | `separated_signal_1.png`, `separated_signal_2.png` |
| Mixed vs Separated  | `comparison_signal_1.png`, `comparison_signal_2.png` |

All plots are time-domain amplitude waveforms generated using `matplotlib`.

---

## 📽 Sample Workflow

1. Upload two `.wav` files containing different microphone recordings of mixed audio.
2. The backend performs FastICA on the signals.
3. The app returns:
   - Two separated audio files (`.wav`)
   - Waveform plots of mixed and separated signals
   - Comparison graphs to analyze performance

---

## 💡 Potential Use Cases

- Teaching and demonstrating **FastICA** concepts  
- Exploring **Blind Source Separation**  
- Audio forensics and enhancement  
- Building blocks for deeper ML/DSP projects
