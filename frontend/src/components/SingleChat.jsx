import {
  Box,
  Flex,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useEditable,
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import animationData from "../Animation/animationData.json";
import Lottie from "react-lottie";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "./ProfileModal";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import {
  editMessage,
  getMessages,
  sendMessages,
} from "../redux/actions/userActions";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import typingAnimation from "../Animation/typing.json";
import { chatNameStuff, chatWithUser } from "../redux/Slice/userSlice";
import { FaPaperclip, FaPaperPlane, FaSmile, FaTimes } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";

let socket;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const Endpoint = "https://kabutar-chataap-backend.onrender.com";
  // const Endpoint = "http://192.168.56.1:8000/";

  // const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();

  const chatWithUserData = useSelector((state) => state.userData.chatWithuser);
  const chatdata = useSelector((state) => state.userData.chatData);
  const user = useSelector((state) => state.userData.user);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [istyping, setIsTyping] = useState(false);
  const [typing, setTyping] = useState(false);
  const [flag, setFlag] = useState(false);
  const [messageId, setMessageId] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [notification, setNotification] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replymessageContent, setReplyMessageContent] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [file, setFile] = useState(null);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const defaultOptions2 = {
    loop: true,
    autoplay: true,
    animationData: typingAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    // Initialize the socket connection
    // socket = io(Endpoint);

    const token = sessionStorage.getItem("token");

    socket = io(Endpoint, {
      extraHeaders: {
        Authorization: token,
      },
    });

    // Emit setup event with the user
    socket.emit("setup", user);

    // Handle socket connection events
    socket.on("connect", () => setSocketConnected(true));
    socket.on("disconnect", () => setSocketConnected(false));

    // Handle typing events
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // Clean up socket listeners on component unmount
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("typing");
      socket.off("stop typing");
      socket.disconnect(); // Properly close the connection
    };
  }, [Endpoint, user]);
  console.log(socketConnected, "socket");

  useEffect(() => {
    const fetchMessages = async () => {
      if (!chatWithUserData) return;

      // setLoading(true);
      try {
        const data = await dispatch(getMessages(chatdata?._id));
        // console.log(data?.payload?.data, "deleted");
        setMessages(data?.payload?.data);
      } catch (error) {
        console.error("Failed to Load the Messages", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    if (socket) {
      socket.on("receive-message", (data) => {
        // setMessages((prevMessages) => [...prevMessages, data]);/
        fetchMessages();
      });

      socket.emit("joinchat", chatdata?._id);
    }

    return () => {
      if (socket) socket.off("receive-message");
    };
  }, [flag, chatWithUserData, chatdata, socket, dispatch]);

  useEffect(() => {
    socket?.on("receive-message", (newMessageRecieved) => {
      console.log(newMessageRecieved, "newMessageRecieved");
      if (
        chatdata?._id !== chatWithUserData || // if chat is not selected or doesn't match current chat
        chatdata?._id !== newMessageRecieved?.chat?._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      }
    });
  });

  console.log(notification, "notification");

  const sendMessage = async (event) => {
    if (file || event.key === "Enter" && newMessage) {
      socket.emit("stop typing", chatdata._id);
      const formaData = new FormData();
      newMessage && formaData.append("content", newMessage);
      chatdata && formaData.append("chat", chatdata?._id);
      replymessageContent &&
        formaData.append("replyto", replymessageContent?._id);
        file && formaData.append("file", file);

      try {
        const data = messageId
          ? await dispatch(
              editMessage({ messageId: messageId, content: newMessage })
            )
          : await dispatch(sendMessages(formaData));

        if (data?.payload?.success) {
          setNewMessage("");
          setMessageId("");
          setReplyingTo(null);
          setReplyMessageContent(null)
          setShowEmojiPicker(false);
          setFlag((prevFlag) => !prevFlag);
          // setMessages([...messages,newMessage])

          socket.emit("send-message", {
            message: newMessage,
            room: chatdata?._id,
          });
        }
      } catch (error) {
        console.error("Failed to send the Message", error);
      }
    }
  };



  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", chatdata._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", chatdata._id);
        setTyping(false);
      }
    }, timerLength);
  };

  console.log(istyping, "istyping");

  const handleReplyto = (message) => {
    setReplyMessageContent(message);
    setReplyingTo(true);
  };

  const addEmoji = (e) => {
    console.log(e, "emoji");
    let emoji = e.emoji;

    setNewMessage(newMessage + emoji); // Add emoji to the input field
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Set the file when user selects one
  };

  console.log(file,"file")

  useEffect(()=>{
    
    if(file){
      sendMessage()
    }

  },[file])

  return (
    <>
      {chatWithUserData ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            {" "}
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => {
                dispatch(chatNameStuff(null));
                dispatch(chatWithUser(null));
              }}
            />
            {!chatdata?.isGroupChat ? (
              <>
                {/* Find the user that is not the logged-in user and display their name */}
                {chatdata?.users
                  ?.find((x) => x?._id !== user?._id)
                  ?.name?.toUpperCase()}
                {/* Show ProfileModal when it's not a group chat */}
                <ProfileModal
                  user={chatdata?.users?.find((x) => x?._id !== user?._id)}
                />
              </>
            ) : (
              /* Display the group chat name */
              <>
                {chatdata?.chatName?.toUpperCase()}
                <UpdateGroupChatModal />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end" // Ensures content is aligned to the bottom
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="88%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat
                  messages={messages}
                  setNewMessage={setNewMessage}
                  setMessageId={setMessageId}
                  // setFlag={setFlag}
                  // flag={flag}
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  handleReplyto={handleReplyto}
                />
                {/* Messages content will go here */}
              </div>
            )}

            <FormControl
              id="first-name"
              isRequired
              mt={3}
              onKeyDown={sendMessage}
            >
              {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions2}
                    height={50}
                    width={70}
                    style={{
                      marginBottom: 15,
                      marginLeft: 0,
                      // backgroundColor: "gray",
                    }}
                  />
                </div>
              ) : (
                <></>
              )}

              {replyingTo && (
                <Box
                  bg="gray.100"
                  p={3}
                  borderRadius="md"
                  mb={2}
                  position="relative"
                >
                  <Text fontSize="sm" color="gray.600">
                    Replying to: {replymessageContent?.content ||replymessageContent?.file  }
                  </Text>
                  <IconButton
                    aria-label="Cancel reply"
                    icon={<FaTimes />}
                    size="sm"
                    position="absolute"
                    top="2"
                    right="2"
                    onClick={() => setReplyingTo(null)} // Clear reply when canceling
                  />
                </Box>
              )}
              <Flex alignItems="center">
                <IconButton
                  aria-label="emoji-picker"
                  icon={<FaSmile />}
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  variant="ghost"
                  size="lg"
                />

                <IconButton
                  aria-label="file-upload"
                  icon={<FaPaperclip />}
                  variant="ghost"
                  size="lg"
                  as="label" // This turns the button into a file input label
                  htmlFor="file-upload" // Associates the button with the hidden file input
                  cursor="pointer"
                />
                <Input
                  type="file"
                  id="file-upload"
                  display="none" // Hide the file input
                  onChange={handleFileChange}
                />
                <Input
                  variant="filled"
                  bg="#E0E0E0"
                  placeholder="Enter a message.."
                  value={newMessage}
                  onChange={typingHandler}
                />
                {/* <IconButton
                  aria-label="send-message"
                  icon={<FaPaperPlane />}
                  onClick={sendMessage}
                  variant="solid"
                  colorScheme="blue"
                /> */}
              </Flex>

              {showEmojiPicker && (
                <Box position="absolute" bottom="50px" zIndex="1000">
                  <EmojiPicker onEmojiClick={addEmoji} />
                </Box>
              )}
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          d="flex"
          style={{ display: "flex" }}
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Box d="flex" flexDir="column" alignItems="center">
            <Lottie options={defaultOptions} height={300} width={300} />
            <Text fontSize="3xl" fontFamily="Work sans" className="funky-text">
              Click on a user to start chatting
            </Text>
          </Box>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
