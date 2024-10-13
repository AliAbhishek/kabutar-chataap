import { Route, Routes, useLocation } from "react-router-dom";
import React, { useEffect } from "react";
import HomePage from "./Pages/HomePage";
import ChatPage from "./Pages/ChatPage";
import "./App.css";
import "../assets/style.css";
import ParticlesEffect from "./components/ParticleEffect";
import { onMessageListener, requestForToken } from "./Firebase/FirebaseConfig";
import { useDispatch, useSelector } from "react-redux";
import { setFCMtoken } from "./redux/Slice/userSlice";
import { useToast } from "@chakra-ui/react";
import EditProfile from "./Pages/EditProfile";
import ProtectedRoutes from "./components/ProtectedRoutes";
import GenerateImage from "./Pages/GenerateImage";

function App() {
  const location = useLocation();
 
  const dispatch = useDispatch();
  const toast = useToast();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );
      })
      .catch((err) => {
        console.log("Service Worker registration failed:", err);
      });
  }

  // useEffect(() => {
  //   const fetchToken = async () => {
  //     const fcmToken = await requestForToken();
  //     // console.log(fcmToken,"fcmtoken")
  //     // dispatch(setFCMtoken(fcmToken));
  //   };
  //   if (!fcm) {
  //     fetchToken();
  //   }
  // }, [fcm,dispatch]);

  onMessageListener().then((payload) => {
    toast({
      title: payload?.notification?.title,
      description: payload?.notification?.body,
      // status: status,
      duration: 5000, // Duration in milliseconds
      isClosable: true, // Allow closing the toast
      position: "bottom-left", // Position of the toast
      render: () => (
        <div
          style={{
            backgroundColor: "#48BB78",
            color: "white",
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            display: "flex",
            alignItems: "center",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <div
            style={{
              marginRight: "8px",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            {"✔️"}
          </div>
          <div>
            <div
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                marginBottom: "4px",
              }}
            >
              {payload?.notification?.title}
            </div>
            <div style={{ fontSize: "14px" }}>
              {payload?.notification?.body}
            </div>
          </div>
        </div>
      ),
    });
  });

  return (
    <div className="App">
      {location.pathname === "/" && <ParticlesEffect />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/chats" element={<ChatPage />} />
          <Route path="/editProfile" element={<EditProfile />} />
          <Route path="/generateImage" element={<GenerateImage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
