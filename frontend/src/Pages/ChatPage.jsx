import { Box } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { io } from "socket.io-client"; // Import Socket.IO

import SideDrawer from "../components/SideDrawer";
import MyChats from "../components/MyChat";
import Chatbox from "../components/Chatbox";
import { clearSocket, setSocket } from "../redux/Slice/socketSlice";

const ChatPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userData.user);
  const [fetchAgain, setFetchAgain] = useState(false);

  useEffect(() => {
    const Endpoint = "http://192.168.56.1:8000/";
    // const Endpoint = "https://kabutar-chataap-backend.onrender.com";
    const token = sessionStorage.getItem("token");

    // Create socket instance
    const socket = io(Endpoint, {
      extraHeaders: {
        Authorization: token,
      },
    });

    console.log(socket,"sssssssssssssssssssssssssssss")

    // Store socket in Redux
    dispatch(setSocket(socket));

    // return () => {
    //   // Cleanup on unmount
    //   dispatch(clearSocket());
    // };
  }, [dispatch]);

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box style={{ display: "flex" }} justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats />}
        {user && <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
    </div>
  );
};

export default ChatPage;
