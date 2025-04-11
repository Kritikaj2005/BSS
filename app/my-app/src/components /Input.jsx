import React, { useState } from "react";
import { Input as TextInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function Input() {
  const [language, setLanguage] = useState("");
  const [songName, setSongName] = useState("");

  const handleSubmit = () => {
    console.log("Language:", language);
    console.log("Song:", songName);
    // Call backend here
  };

  return (
    <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl space-y-4 text-white">
      <div className="space-y-2">
        <label className="block text-lg font-medium">Language</label>
        <TextInput
          className="bg-white/20 placeholder:text-white"
          placeholder="e.g., Hindi"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <label className="block text-lg font-medium">Song Name</label>
        <TextInput
          className="bg-white/20 placeholder:text-white"
          placeholder="e.g., Tum Hi Ho"
          value={songName}
          onChange={(e) => setSongName(e.target.value)}
        />
      </div>
      <Button
        onClick={handleSubmit}
        className="bg-indigo-600 hover:bg-indigo-500 px-5 py-2 text-lg mt-4"
      >
        Recommend Songs
      </Button>
    </div>
  );
}

export default Input;

