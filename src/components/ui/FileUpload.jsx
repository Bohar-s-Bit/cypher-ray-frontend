import { cn } from "../../lib/utils";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Upload, X } from "lucide-react";
import { useDropzone } from "react-dropzone";

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

const FileUpload = ({
  onChange,
  accept,
  maxSize = 100 * 1024 * 1024,
}) => {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (newFiles) => {
    if (newFiles && newFiles.length > 0) {
      // Only take the first file
      const selectedFile = newFiles[0];
      setFile(selectedFile);
      onChange && onChange([selectedFile]);
    }
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onChange && onChange([]);
  };

  const handleClick = () => {
    if (!file) {
      fileInputRef.current?.click();
    }
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    accept: accept,
    maxSize: maxSize,
    onDrop: handleFileChange,
    onDropRejected: (error) => {
      console.log(error);
    },
  });

  return (
    <div className="w-full" {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className="p-10 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden bg-white/10 backdrop-blur-sm border border-white/10 border border-white/10"
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          accept={accept}
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center">
          <p className="relative z-20 font-sans font-bold text-white/90 text-base">
            Upload Binary File
          </p>
          <p className="relative z-20 font-sans font-normal text-white/60 text-base mt-2">
            Drag or drop your binary file here or click to upload
          </p>
          <div className="relative w-full mt-10 max-w-xl mx-auto">
            {file && (
              <motion.div
                layoutId="file-upload"
                className={cn(
                  "relative overflow-hidden z-40 bg-black/30 backdrop-blur-sm flex flex-col items-start justify-start md:h-24 p-4 mt-4 w-full mx-auto rounded-md",
                  "shadow-sm border border-white/10"
                )}
              >
                <button
                  onClick={handleRemoveFile}
                  className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-white/10 backdrop-blur-sm transition-colors border border-white/10"
                  aria-label="Remove file"
                >
                  <X className="h-4 w-4 text-white/70" />
                </button>
                
                <div className="flex justify-between w-full items-center gap-4 pr-8">
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    layout
                    className="text-base text-white/90 truncate max-w-xs"
                  >
                    {file.name}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    layout
                    className="rounded-lg px-2 py-1 w-fit shrink-0 text-sm bg-white/10 backdrop-blur-sm text-white/90 shadow-input border border-white/10"
                  >
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </motion.p>
                </div>

                <div className="flex text-sm md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-white/70">
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    layout
                    className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800"
                  >
                    {file.type || 'Binary file'}
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    layout
                  >
                    modified {new Date(file.lastModified).toLocaleDateString()}
                  </motion.p>
                </div>
              </motion.div>
            )}
            {!file && (
              <motion.div
                layoutId="file-upload"
                variants={mainVariant}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className={cn(
                  "relative group-hover/file:shadow-2xl z-40 bg-black/30 backdrop-blur-sm flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md border border-white/10",
                  "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
                )}
              >
                {isDragActive ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-white/70 flex flex-col items-center"
                  >
                    Drop it
                    <Upload className="h-4 w-4 text-white/70" />
                  </motion.p>
                ) : (
                  <Upload className="h-4 w-4 text-white/70" />
                )}
              </motion.div>
            )}

            {!file && (
              <motion.div
                variants={secondaryVariant}
                className="absolute opacity-0 border border-dashed border-sky-400 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md"
              ></motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export function GridPattern() {
  const columns = 41;
  const rows = 11;
  return (
    <div className="flex bg-gray-100 dark:bg-neutral-900 shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px scale-105">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`w-10 h-10 flex shrink-0 rounded-[2px] ${
                index % 2 === 0
                  ? "bg-gray-50 dark:bg-neutral-950"
                  : "bg-gray-50 dark:bg-neutral-950 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]"
              }`}
            />
          );
        })
      )}
    </div>
  );
}

export default FileUpload;
