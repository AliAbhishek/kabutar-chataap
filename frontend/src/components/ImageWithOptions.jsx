import React, { useState, useEffect, useRef } from "react";
import Menu, { Item as MenuItem } from "rc-menu";
import "rc-menu/assets/index.css";
import AvatarEditor from "react-avatar-editor";

const ImageWithOptions = ({ imageUrl }) => {
  const [visible, setVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [isEditing, setIsEditing] = useState(false); // To track if we're editing the image
  const [scale, setScale] = useState(1); // For scaling the image
  const [editedImage, setEditedImage] = useState(null); // To store the edited image
  const editorRef = useRef(null); // To reference the AvatarEditor

  const handleMenuClick = (info) => {
    console.log(`Action: ${info.key}`);
    setVisible(false); // Hide menu after selection

    switch (info.key) {
      case "view":
        window.open(imageUrl, "_blank");
        break;
      case "download":
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = "downloaded-image"; // Provide a default file name
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        break;
      case "edit":
        // Trigger image editing (open AvatarEditor)
        setIsEditing(true);
        break;
      default:
        break;
    }
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    setMenuPosition({ x: e.clientX, y: e.clientY });
    setVisible(true); // Show menu
  };

  const handleClickOutside = (e) => {
    if (visible) {
      setVisible(false); // Close menu if clicking outside
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [visible]);

  const saveEditedImage = () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas();
      const editedImgDataUrl = canvas.toDataURL(); // Convert the edited image to a data URL
      setEditedImage(editedImgDataUrl); // Store the edited image
      setIsEditing(false); // Exit editing mode
    }
  };
  console.log(editedImage,"editedImage")

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {isEditing ? (
        <div>
          {/* Avatar Editor for image scaling */}
          <AvatarEditor
            ref={editorRef} // Assign the ref to AvatarEditor
            image={imageUrl}
            width={200}
            height={200}
            border={50}
            scale={scale}
            rotate={0}
          />
          <div>
            <label>Scale Image:</label>
            <input
              type="range"
              min="1"
              max="2"
              step="0.01"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
            />
          </div>
          <button onClick={saveEditedImage}>Save Edited Image</button>
          <button onClick={() => setIsEditing(false)}>Cancel Editing</button>
        </div>
      ) : (
        <>
          <img
            src={editedImage || imageUrl} // Show the edited image if available, else show the original
            alt="Selected"
            style={{ height: "200px", cursor: "pointer" }}
            onContextMenu={handleContextMenu}
          />

          {visible && (
            <Menu
              mode="vertical"
              style={{ top: menuPosition.y, left: menuPosition.x }}
              onSelect={handleMenuClick}
              className="custom-menu"
            >
              <MenuItem key="view">View Image</MenuItem>
              <MenuItem key="download">Download Image</MenuItem>
              {/* <MenuItem key="edit">Edit Image</MenuItem> */}
            </Menu>
          )}
        </>
      )}
    </div>
  );
};

export default ImageWithOptions;
