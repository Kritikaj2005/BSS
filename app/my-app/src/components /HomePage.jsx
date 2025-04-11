import React, { useRef } from "react";
import Input from "./Input.jsx";
import { Button } from "@/components/ui/button";

function HomePage() {
  const inputRef = useRef(null);

  const scrollToInput = () => {
    inputRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col items-center px-4 py-10 space-y-20">
      {/* Hero Section */}
      <div className="text-center mt-10 space-y-6">
        <h1 className="text-5xl md:text-7xl font-bold">Music Recommender</h1>
        <p className="text-xl md:text-2xl text-gray-300 max-w-xl mx-auto">
          Discover songs you'll love based on your favorite language and tune.
        </p>
        <Button
          className="mt-6 px-6 py-3 text-lg rounded-2xl shadow-lg bg-purple-700 hover:bg-purple-600"
          onClick={scrollToInput}
        >
          Get Started
        </Button>
      </div>

      {/* Input Section */}
      <div ref={inputRef} className="w-full max-w-4xl">
        <Input />
      </div>
    </div>
  );
}

export default HomePage;
