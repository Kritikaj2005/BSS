import React, { useState } from "react";
import axios from "axios";

function Input() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [separatedAudio, setSeparatedAudio] = useState([]);

  const handleFile1Change = (e) => {
    setFile1(e.target.files[0]);
  };

  const handleFile2Change = (e) => {
    setFile2(e.target.files[0]);
  };

  const uploadFiles = async () => {
    const formData = new FormData();
    formData.append("files", file1);
    formData.append("files", file2); // Same key to send as a list
  
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

  const handleSubmit = async () => {
    if (!file1 || !file2) {
      alert("Please upload both audio files.");
      return;
    }
  
    try {
      setLoading(true);
      setStatus("Uploading files...");

      // Upload the files to the server
      await uploadFiles();
  
      setStatus("Processing audio...");
      
      // Fetch the separated audio files
      await fetchSeparatedAudio();
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
    <div className="w-full max-w-xl px-6">
      <h2 className="text-2xl font-semibold mb-4 text-center">Upload Two Mixed Audio Files</h2>

      <div className="mb-4">
        <label className="block mb-2">Audio File 1</label>
        <input
          type="file"
          accept="audio/*"
          onChange={handleFile1Change}
          className="w-full p-4 text-black rounded-lg bg-white focus:outline-none"
        />
        {file1 && (
          <audio controls src={getAudioSrc(file1)} className="mt-2 w-full" />
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-2">Audio File 2</label>
        <input
          type="file"
          accept="audio/*"
          onChange={handleFile2Change}
          className="w-full p-4 text-black rounded-lg bg-white focus:outline-none"
        />
        {file2 && (
          <audio controls src={getAudioSrc(file2)} className="mt-2 w-full" />
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`mt-6 w-full py-3 ${
          loading ? "bg-gray-400" : "bg-gradient-to-r from-green-600 to-green-400 hover:from-green-400 hover:to-green-600"
        } text-white rounded-full font-semibold text-lg transition-all duration-300`}
      >
        {loading ? "Processing..." : "Separate Sources"}
      </button>

      {status && <p className="mt-4 text-center text-sm text-gray-700">{status}</p>}

      {/* Show separated audio files */}
      {separatedAudio.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl text-center text-white">Separated Audio Files</h3>
          <div className="mt-4">
            <h4 className="text-white">Separated Audio 1</h4>
            <audio controls src={separatedAudio[0]} className="mt-2 w-full" />
          </div>
          <div className="mt-4">
            <h4 className="text-white">Separated Audio 2</h4>
            <audio controls src={separatedAudio[1]} className="mt-2 w-full" />
          </div>
        </div>
      )}
    </div>
  );
}

export default Input;
