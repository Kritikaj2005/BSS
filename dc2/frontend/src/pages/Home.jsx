import React, { useRef } from "react";
import Input from "../components/Input";
import Navbar from "../components/Navbar"; 

function Home() {
  const inputSectionRef = useRef(null);
  const homeSectionRef = useRef(null);
  const outputSectionRef = useRef(null);

  const scrollToInput = () => {
    inputSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToHome = () => {
    homeSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToOutput = () => {
    outputSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-full min-h-screen bg-black flex flex-col">
      {/* Navbar */}
      <Navbar scrollToInput={scrollToInput} scrollToHome={scrollToHome} />
      
      {/* Hero Section */}
      <div className="w-full h-screen flex flex-col justify-center items-center bg-gradient-to-b from-black via-green-950 to-black text-white text-center px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg">
          🎧 Blind Source Separation
        </h1>
        <p className="text-lg md:text-2xl mt-4 font-light max-w-2xl text-gray-300">
          Upload your mixed audios and separate them instantly
        </p>
        <button
          onClick={scrollToInput}
          className="mt-12 px-10 py-6 text-white rounded-full font-bold text-2xl md:text-3xl bg-gradient-to-r from-green-600 to-green-400 hover:from-green-400 hover:to-green-600 shadow-2xl transition-all duration-500 transform hover:scale-105"
        >
          Upload Now
        </button>
      </div>

      {/* Upload Section */}
      <div
        ref={inputSectionRef}
        className="w-screen min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-black via-green-950 to-black text-white py-12"
      >
        <Input scrollToOutput={scrollToOutput} />
      </div>
    </div>
  );
}

export default Home;
