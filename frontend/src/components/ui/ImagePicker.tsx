import { fileToBase64 } from "@/lib/helperfunctions";
import React, { useRef, useState } from "react";

type Props = {
  setPhoto: (value: string) => void;
}

const ImagePicker = ({ setPhoto }: Props) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const base64 = await fileToBase64(file);

    setPreview(base64);   // for UI
    setPhoto(base64);     // now passing the string to parent
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="size-28 rounded-full border border-slate-600 flex items-center justify-center overflow-hidden cursor-pointer hover:border-black transition bg-white"
        onClick={handleClick}
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-400 text-sm">Upload Photo</span>
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default ImagePicker;
