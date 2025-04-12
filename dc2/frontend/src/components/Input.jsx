import React, { useState } from "react";

function Input() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);

  const handleFile1Change = (e) => {
    setFile1(e.target.files[0]);
  };

  const handleFile2Change = (e) => {
    setFile2(e.target.files[0]);
  };

  const handleSubmit = () => {
    if (!file1 || !file2) {
      alert("Please upload both audio files.");
      return;
    }
    // Add your backend logic to handle file submission here
    console.log("File 1:", file1);
    console.log("File 2:", file2);
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
        className="mt-6 w-full py-3 bg-gradient-to-r from-green-600 to-green-400 text-white rounded-full font-semibold text-lg hover:from-green-400 hover:to-green-600 transition-all duration-300"
      >
        Separate Sources
      </button>
    </div>
  );
}

export default Input;
