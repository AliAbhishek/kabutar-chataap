import React, { useEffect, useState } from "react";
import { Box, Input, Text } from "@chakra-ui/react";

const FileUpload = ({file,setFile}) => {
  // const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      setFile(droppedFiles[0]);
    }
  };

  // useEffect(()=>{
  //   if(file){
  //     sendMessage()
  //   }

  // },[file])

  

  return (
    <Box
      width="800px"
      height="400px"
      border="2px dashed"
      borderColor={isDragging ? "blue.500" : "gray.300"}
      borderRadius="md"
      display="flex"
      justifyContent="center"
      alignItems="center"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      position="relative"
    >
      <Text color={isDragging ? "blue.500" : "gray.500"}>
        {isDragging ? "Drop your file here!" : "Drag & Drop or Click to Upload"}
      </Text>
      <Input
        type="file"
        id="file-upload"
        display="none"
        onChange={handleFileChange}
      />
      {/* Hidden input to allow file selection via clicking */}
      <label
        htmlFor="file-upload"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          cursor: "pointer",
        }}
      ></label>
      {file && <Text mt={4}>Selected File: {file.name}</Text>}
    </Box>
  );
};

export default FileUpload;
