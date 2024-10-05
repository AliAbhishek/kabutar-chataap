import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Stack,
  Text,
  Avatar,
  Button,
  Center,
  Badge,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchChat } from "../redux/actions/userActions";
import { chatNameStuff, chatWithUser } from "../redux/Slice/userSlice";
import GroupChatModal from "./GroupChatmodal";
import ChatLoading from "./ChatLoading";
import animationData from "../Animation/chatanimationdata.json";
import Lottie from "react-lottie";
import { io } from "socket.io-client";

let socket;
const token = sessionStorage.getItem("token");

const MyChats = ({ fetchAgain }) => {
  // const Endpoint = "https://kabutar-chataap-backend.onrender.com";
  const Endpoint = "http://192.168.56.1:8000/";
  const dispatch = useDispatch();
  const chatWithUserData = useSelector((state) => state.userData.chatWithuser);
  const user = useSelector((state) => state.userData.user);

  const chatdata = useSelector((state) => state.userData.chatData);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData, // Your animation file
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const [chats, setChats] = useState(null);
  const [flag, setFlag] = useState(false);

  const toast = useToast();

  const fetchChats = async () => {
    try {
      let data = await dispatch(fetchChat());
      setChats(data?.payload?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [fetchAgain, flag, chatdata, chatWithUser]);

  useEffect(() => {
   

    socket = io(Endpoint, {
      extraHeaders: {
        Authorization: token,
      },
    });

    if (socket) {
      socket.on("checkunread-count", (data) => {
        console.log(data,"dddddddddddddddddddddddddddddddddddddddddddddddd")
        // setMessages((prevMessages) => [...prevMessages, data]);/
        // fetchMessages();
        // callChatApi()
        fetchChats();
        
      });

    
    }


  }, [Endpoint]);

  const getChatId = (chat) => {
    if (chat?.isGroupChat) {
      return chat._id;
    } else {
      return chat?.users?.find((x) => x?._id !== user?._id)?._id;
    }
  };

  return (
    <Box
      display={{ base: chatWithUserData ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      h={{ base: "100%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal setFlag={setFlag} flag={flag}>
          <Button
            style={{ marginLeft: "19px" }}
            d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="90%"
        borderRadius="lg"
        overflowY="auto" // Add this for scrollbar
      >
        {chats ? (
          <Stack spacing={3} overflowY="auto" maxH="calc(100% - 60px)">
            {chats.length > 0 ? (
              chats.map((chat) => {
                console.log(
                  chat?.unreadMessageCounts[user?._id],
                  "==========================="
                );
                return (
                  <Box
                    key={chat._id}
                    style={{ display: "flex", gap: "10px" }}
                    onClick={() => {
                      // Dispatch action on click
                      dispatch(chatNameStuff(chat));
                      dispatch(chatWithUser(getChatId(chat)));
                      socket = io(Endpoint, {
                        extraHeaders: {
                          Authorization: token,
                        },
                      });
                  
                      if (socket) {
                        socket.on("clearunread-count", (data) => {
                          console.log(data,"clearunread-count")
                          // setMessages((prevMessages) => [...prevMessages, data]);/
                          // fetchMessages();
                          // callChatApi()
                          fetchChats();
                          
                        });
                  
                      
                      }

                    }}
                    cursor="pointer"
                    bg={
                      getChatId(chat) === chatWithUserData
                        ? "#38B2AC" // Highlighted background
                        : "#E8E8E8" // Default background
                    }
                    color={
                      getChatId(chat) === chatWithUserData
                        ? "white" // Highlighted text color
                        : "black" // Default text color
                    }
                    px={3}
                    py={2}
                    borderRadius="lg"
                  >
                    <Avatar
                      marginTop="6px"
                      size="sm"
                      cursor="pointer"
                      name={
                        !chat.isGroupChat
                          ? chat.users.find((x) => x._id !== user._id)?.name
                          : chat.chatName
                      }
                      src={
                        !chat.isGroupChat
                          ? chat.users.find((x) => x._id !== user._id)?.pic
                          : ""
                      }
                    />
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      width="100%"
                    >
                      <Box>
                        <Text style={{ fontWeight: "bold" }}>
                          {!chat.isGroupChat
                            ? chat.users.find((x) => x._id !== user._id)?.name
                            : chat.chatName}
                        </Text>
                        <Text style={{ fontSize: "13px" }}>
                          {chat?.latestMessage?.content}
                        </Text>
                      </Box>
                      <Box>
                        {chat?.unreadMessageCounts[user?._id] > 0 && (
                          <Badge colorScheme="blue" borderRadius="full" px={2}>
                            {chat.unreadMessageCounts[user?._id]}
                          </Badge>
                        )}
                      </Box>
                    </Box>
                  </Box>
                );
              })
            ) : (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height="100vh" // Full viewport height
                width="300px" // Full viewport width, preventing overflow
                overflow="hidden" // Disable any potential overflow
              >
                <Lottie
                  options={defaultOptions}
                  height="auto"
                  width="50%"
                  style={{ maxHeight: "100%", maxWidth: "100%" }} // Ensure Lottie fits within the container
                />
                <Text
                  fontSize="xl"
                  fontFamily="Work sans"
                  className="funky-text"
                  textAlign="center"
                  mt={4}
                  px={4} // Add padding to prevent text from touching edges
                >
                  Let's create some awesome chat. Start searching for your mates
                  by name or email address.
                </Text>
              </Box>
            )}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
