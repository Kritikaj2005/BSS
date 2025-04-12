import React, { useState, useRef } from "react";
import axios from "axios";

function Input() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [separatedAudio, setSeparatedAudio] = useState([]);
  const [images, setImages] = useState([]);
  const [separatedImages, setSeparatedImages] = useState([]);
  const [comparisonImages, setComparisonImages] = useState([]);

  const comparisonRef = useRef(null); // Ref to scroll to comparison section

  const handleFile1Change = (e) => {
    setFile1(e.target.files[0]);
  };

  const handleFile2Change = (e) => {
    setFile2(e.target.files[0]);
  };

  const uploadFiles = async () => {
    const formData = new FormData();
    formData.append("files", file1);
    formData.append("files", file2);

    try {
      const response = await axios.post("http://localhost:8000/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.error("Error during upload:", error);
      throw new Error("Upload failed");
    }
  };

  const fetchSeparatedAudio = async () => {
    try {
      const response1 = await fetch("http://localhost:8000/output/separated_1.wav");
      const audio1 = URL.createObjectURL(await response1.blob());

      const response2 = await fetch("http://localhost:8000/output/separated_2.wav");
      const audio2 = URL.createObjectURL(await response2.blob());

      setSeparatedAudio([audio1, audio2]);
      setStatus("Separation complete!");
    } catch (error) {
      console.error("Error fetching separated audio:", error);
      setStatus("Error fetching separated audio.");
    }
  };

  const fetchImages = async () => {
    try {
      const response1 = await fetch("http://localhost:8000/graphs/mixed_signal_1.png");
      const image1 = URL.createObjectURL(await response1.blob());

      const response2 = await fetch("http://localhost:8000/graphs/mixed_signal_2.png");
      const image2 = URL.createObjectURL(await response2.blob());

      setImages([image1, image2]);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const fetchSeparatedImages = async () => {
    try {
      const response1 = await fetch("http://localhost:8000/graphs/separated_signal_1.png");
      const image1 = URL.createObjectURL(await response1.blob());

      const response2 = await fetch("http://localhost:8000/graphs/separated_signal_2.png");
      const image2 = URL.createObjectURL(await response2.blob());

      setSeparatedImages([image1, image2]);
    } catch (error) {
      console.error("Error fetching separated signal images:", error);
    }
  };

  const fetchComparisonImages = async () => {
    try {
      const response1 = await fetch("http://localhost:8000/graphs/comparison_signal_1.png");
      const image1 = URL.createObjectURL(await response1.blob());

      const response2 = await fetch("http://localhost:8000/graphs/comparison_signal_2.png");
      const image2 = URL.createObjectURL(await response2.blob());

      setComparisonImages([image1, image2]);
    } catch (error) {
      console.error("Error fetching comparison images:", error);
    }
  };

  const handleSubmit = async () => {
    if (!file1 || !file2) {
      alert("Please upload both audio files.");
      return;
    }

    try {
      setLoading(true);
      setStatus("Uploading files...");

      await uploadFiles();

      setStatus("Processing audio...");

      await Promise.all([
        fetchSeparatedAudio(),
        fetchImages(),
        fetchSeparatedImages(),
        fetchComparisonImages()
      ]);
    } catch (err) {
      console.error("Error during upload or processing:", err);
      setStatus("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const getAudioSrc = (file) => {
    return file ? URL.createObjectURL(file) : null;
  };

  return (
    <div className="flex flex-col w-full max-w-screen-xl px-6 mx-auto">
      {/* Upload Section */}
      <div className="flex w-full">
        <div className="w-1/2 p-6">
          <div className="bg-white bg-opacity-50 p-6 rounded-lg shadow-lg backdrop-blur-md mb-6 min-h-[400px]">
            <h2 className="text-2xl font-semibold mb-4 text-center">Upload Two Mixed Audio Files</h2>

            <div className="mb-4">
              <label className="block mb-2">Audio File 1</label>
              <input
                type="file"
                accept="audio/*"
                onChange={handleFile1Change}
                className="w-full p-4 text-black rounded-lg bg-white focus:outline-none"
              />
              {file1 && <audio controls src={getAudioSrc(file1)} className="mt-2 w-full" />}
            </div>

            <div className="mb-4">
              <label className="block mb-2">Audio File 2</label>
              <input
                type="file"
                accept="audio/*"
                onChange={handleFile2Change}
                className="w-full p-4 text-black rounded-lg bg-white focus:outline-none"
              />
              {file2 && <audio controls src={getAudioSrc(file2)} className="mt-2 w-full" />}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`mt-6 w-full py-3 ${
                loading
                  ? "bg-gray-400"
                  : "bg-gradient-to-r from-green-600 to-green-400 hover:from-green-400 hover:to-green-600"
              } text-white rounded-full font-semibold text-lg transition-all duration-300`}
            >
              {loading ? "Processing..." : "Separate Sources"}
            </button>

            {status && <p className="mt-4 text-center text-sm text-gray-700">{status}</p>}
          </div>

          {/* Separated Audio Section */}
          {separatedAudio.length > 0 && (
            <div className="bg-white bg-opacity-50 p-6 rounded-lg shadow-lg backdrop-blur-md min-h-[400px]">
              <h3 className="text-xl text-center text-white">Separated Audio Files</h3>
              <div className="mt-4">
                <h4 className="text-white">Separated Audio 1</h4>
                <audio controls src={separatedAudio[0]} className="mt-2 w-full" />
              </div>
              <div className="mt-4">
                <h4 className="text-white">Separated Audio 2</h4>
                <audio controls src={separatedAudio[1]} className="mt-2 w-full" />
              </div>

              {comparisonImages.length > 0 && (
                <div className="text-center mt-6">
                  <button
  onClick={() => comparisonRef.current?.scrollIntoView({ behavior: "smooth" })}
  className="mt-6 w-full py-3 bg-gradient-to-r from-green-600 to-green-400 hover:from-green-400 hover:to-green-600 text-white rounded-full font-semibold text-lg transition-all duration-300"
>
  See Comparison
</button>

                </div>
              )}
            </div>
          )}
        </div>

        {/* Mixed & Separated Signal Images */}
        <div className="w-1/2 p-6">
          {/* Mixed Signals */}
          <div className="bg-white bg-opacity-50 p-6 rounded-lg shadow-lg backdrop-blur-md mb-6 min-h-[400px]">
            <h3 className="text-2xl font-semibold text-center mb-4">Mixed Signals Visualized</h3>
            {images.length > 0 ? (
              <div className="flex flex-col items-center">
                <img src={images[0]} alt="Mixed Signal 1" className="mb-4 w-full h-auto" />
                <img src={images[1]} alt="Mixed Signal 2" className="mb-4 w-full h-auto" />
              </div>
            ) : (
              <p className="text-center text-gray-700">Upload audios to visualize...</p>
            )}
          </div>

          {/* Separated Signals */}
          {separatedImages.length > 0 && (
            <div className="bg-white bg-opacity-50 p-6 rounded-lg shadow-lg backdrop-blur-md min-h-[400px]">
              <h3 className="text-2xl font-bold text-center mb-4">Separated Signals Visualized</h3>
              <div className="flex flex-col items-center">
                <img src={separatedImages[0]} alt="Separated Signal 1" className="mb-4 w-full h-auto" />
                <img src={separatedImages[1]} alt="Separated Signal 2" className="mb-4 w-full h-auto" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comparison Section */}
      {comparisonImages.length > 0 && (
        <div ref={comparisonRef} className="w-full px-6 py-10">
          <div className="bg-white bg-opacity-50 p-6 rounded-lg shadow-lg backdrop-blur-md max-w-screen-xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-6">Comparison of Mixed vs Separated Signals</h3>
            <div className="flex flex-col items-center">
              <img src={comparisonImages[0]} alt="Comparison Signal 1" className="mb-6 w-full h-auto rounded-lg" />
              <img src={comparisonImages[1]} alt="Comparison Signal 2" className="w-full h-auto rounded-lg" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Input;

