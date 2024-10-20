import React, { useState, useEffect } from "react";
import ScrollableChat from "./ScrollableChat"; // Assume this is the chat component you are using
import FileUpload from "./DragAndDrop";


const ChatWithDragDrop = ({
  messages,
  setNewMessage,
  setMessageId,
  setMessages,
  setFlag,
  flag,
  fetchAgain,
  setFetchAgain,
  handleReplyto,
  chatData,
  setFile,
  file
}) => {
  const [isDragging, setIsDragging] = useState(false);

  // Event handlers for drag and drop
  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true); // Show drag-and-drop component
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false); // Revert back to the chat view
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false); // Hide drag-and-drop after drop event
    // Handle file upload or any other drop-related functionality here
  };

  useEffect(() => {
    // Add event listeners for drag-and-drop
    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("drop", handleDrop);

    return () => {
      // Clean up event listeners when component unmounts
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("drop", handleDrop);
    };
  }, []);

  console.log(file,"file")

  return (
    <div style={{ position: "relative" }}>
      {isDragging ? (
        // Render drag-and-drop component when dragging
        <FileUpload setFile={setFile}  file={file} />
      ) : (
        // Render chat when not dragging
        <ScrollableChat
          messages={messages}
          setNewMessage={setNewMessage}
          setMessageId={setMessageId}
          setMessages={setMessages}
          setFlag={setFlag}
          flag={flag}
          fetchAgain={fetchAgain}
          setFetchAgain={setFetchAgain}
          handleReplyto={handleReplyto}
          chatData={chatData}
        />
      )}
    </div>
  );
};

export default ChatWithDragDrop;
