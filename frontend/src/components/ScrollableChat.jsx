// import { Avatar } from "@chakra-ui/avatar";
// import { Tooltip } from "@chakra-ui/tooltip";
import { useDispatch, useSelector } from "react-redux";
import ScrollableFeed from "react-scrollable-feed";
import {
  Avatar,
  Box,
  Button,
  Flex,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  FaCheck,
  FaCheckDouble,
  FaEllipsisV,
  FaEye,
  FaEyeSlash,
  FaSmile,
} from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import {
  deleteMessage,
  editMessage,
  getMessages,
} from "../redux/actions/userActions";
import UserListItem from "./UserListItem";
import { io } from "socket.io-client";
import InfiniteScroll from "react-infinite-scroll-component";
import EmojiPicker from "emoji-picker-react";
import ImageWithOptions from "./ImageWithOptions";
// import {
//   isLastMessage,
//   isSameSender,
//   isSameSenderMargin,
//   isSameUser,
// } from "../config/ChatLogics";
// import { ChatState } from "../Context/ChatProvider";

const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages?.length - 1 &&
    (messages[i + 1]?.sender?._id !== m?.sender?._id ||
      messages[i + 1]?.sender?._id === undefined) &&
    messages[i]?.sender?._id !== userId
  );
};

const isLastMessage = (messages, i, userId) => {
  return (
    i === messages?.length - 1 &&
    messages[messages?.length - 1].sender?._id !== userId &&
    messages[messages.length - 1].sender?._id
  );
};

const isSameSenderMargin = (messages, m, i, userId) => {
  // console.log(i === messages.length - 1);

  if (
    i < messages.length - 1 &&
    messages[i + 1].sender?._id === m.sender?._id &&
    messages[i].sender?._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender?._id !== m.sender?._id &&
      messages[i].sender?._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender?._id !== userId)
  )
    return 0;
  else return "auto";
};

const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender?._id === m.sender?._id;
};
// let socket;
// const Endpoint = "https://kabutar-chataap-backend.onrender.com";
// const Endpoint = "http://192.168.56.1:8000/";

const ScrollableChat = ({
  messages,
  setNewMessage,
  setFlag,
  flag,
  setMessages,
  // fetchMessages,
  fetchAgain,
  setFetchAgain,
  setMessageId,
  handleReplyto,
  chatUserId,
}) => {
  const chatdata = useSelector((state) => state.userData.chatData);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userData.user);
  console.log(messages, "messages");
  const socket = useSelector((state) => state.socketData.socket);
  console.log(socket, "sockrrtrtrtrtrtrtscrollable");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isopen, setIsOpen] = useState(false);
  const toast = useToast();

  const onOpenModal = () => setIsOpen(true);
  const onCloseModal = () => setIsOpen(false);
  const [currentMessageId, setCurrentMessageId] = useState(null);
  const [highlightedMessage, setHighlightedMessage] = useState(null);
  const [usersWhoReadMessages, setusersWhoReadMessages] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [reaction, setreaction] = useState(null);
  const [messageId, setmessageId] = useState(null);
  const [senderName, setSenderName] = useState(null);

  const messageRefs = useRef([]);

  const scrollToMessage = (id) => {
    const messageIndex = messages.findIndex((msg) => msg._id === id);
    if (messageIndex >= 0 && messageRefs.current[messageIndex]) {
      messageRefs.current[messageIndex].scrollIntoView({ behavior: "smooth" });
      setHighlightedMessage(id);
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    // socket = io(Endpoint, {
    //   extraHeaders: {
    //     Authorization: token,
    //   },
    // });

    if (socket) {
      socket.on("seenUnseen", async (data) => {
        console.log(data, "ddaaafffaa");
        // fetchMessages()
        // setFlag(!flag)
        // await dispatch(getMessages(chatdata?._id));
      });
    }
  }, [socket]);

  const otherUser = chatdata?.users?.find((x) => x?._id !== user?._id);
  console.log(otherUser?.isOnline, "other");

  const addEmoji = async (e) => {
    console.log(e, "emoji");

    let emoji = e.emoji;

    setreaction(emoji); // Add emoji to the input field
    let data = await dispatch(
      editMessage({ messageId: messageId, reaction: emoji })
    );

    if (data?.payload?.success) {
      socket.emit("send-message", {
        reaction: emoji,
        room: chatdata?._id,
        sender: senderName,
      });

      setFlag(!flag);
    }

    setShowEmojiPicker(false);
  };

  console.log(messageId, "messageId");

  console.log(reaction, "reaction");

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard!",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleDownload = (fileUrl) => {
    const link = document.createElement("a"); // Create an anchor element
    link.href = fileUrl; // Set the href to the file URL
    link.download = fileUrl.split("/").pop(); // Set the download attribute with the file name
    document.body.appendChild(link); // Append the link to the body
    link.click(); // Simulate a click on the link
    document.body.removeChild(link); // Remove the link after clicking
  };

  return (
    <>
      <ScrollableFeed className="custom-scroll">
        {messages &&
          messages.map((m, i) => {
            return (
              <Flex
                key={m._id}
                align="center"
                marginY={2}
                direction={m?.sender?._id === user?._id ? "row-reverse" : "row"}
                ref={(el) => (messageRefs.current[i] = el)}
              >
                {(isSameSender(messages, m, i, user._id) ||
                  isLastMessage(messages, i, user._id)) && (
                  <Tooltip
                    label={m?.sender?.name}
                    placement="bottom-start"
                    hasArrow
                  >
                    <Avatar
                      mt="7px"
                      mr={1}
                      size="sm"
                      cursor="pointer"
                      name={m?.sender?.name}
                      src={m?.sender?.pic}
                    />
                  </Tooltip>
                )}
                <Flex
                  style={{
                    backgroundColor:
                      highlightedMessage === m._id
                        ? "#38B2AC" // Highlight color
                        : m?.isDeleted
                        ? "#f8d7da" // Background for deleted
                        : m?.sender?._id === user?._id
                        ? "#BEE3F8"
                        : "#B9F5D0", // Background for non-deleted
                    marginLeft: isSameSenderMargin(messages, m, i, user?._id),
                    marginTop: isSameUser(messages, m, i, user?._id) ? 3 : 10,
                    borderRadius: "20px",
                    padding: "5px 15px",
                    transition: "background-color 0.5s ease, color 0.5s ease", // Add both transitions
                    // color: highlightedMessage === m._id ? "#38B2AC" : "initial", // Set color or fallback
                  }}
                  direction="column"
                  align={
                    m.sender?._id === user?._id ? "flex-end" : "flex-start"
                  }
                  position="relative" // Ensure this container is positioned relative
                >
                  {m?.replyto && (
                    <Box
                      bg="gray.100"
                      p={2}
                      borderRadius="md"
                      borderLeft="4px solid teal"
                      mb={2}
                      maxWidth="100%"
                      onClick={() => scrollToMessage(m?.replyto?._id)} // Scroll to original message on click
                      cursor="pointer"
                    >
                      <Text>
                        Replying to:{" "}
                        {m?.replyto?.content || (
                          <>
                            {m?.replyto?.file && (
                              <>
                                {/* Image Handling */}
                                {(m?.replyto?.file.endsWith(".jpg") ||
                                  m?.replyto?.file.endsWith(".jpeg") ||
                                  m?.replyto?.file.endsWith(".png")) && (
                                  <div style={{ padding: "20px" }}>
                                    {/* Use ImageWithOptions for images */}
                                    <ImageWithOptions
                                      imageUrl={m?.replyto?.file}
                                    />
                                  </div>
                                )}

                                {/* PDF Handling */}
                                {m?.replyto?.file.endsWith(".pdf") && (
                                  <div
                                    style={{
                                      position: "relative",
                                      padding: "20px",
                                    }}
                                  >
                                    {/* PDF Sticker */}
                                    <div
                                      style={{
                                        position: "absolute",
                                        top: 10,
                                        left: -10,
                                        backgroundColor: "#ff5733", // Bright color for the sticker
                                        color: "white",
                                        padding: "5px 10px",
                                        borderRadius: "5px",
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        transform: "rotate(-10deg)", // Slight rotation for a playful look
                                      }}
                                    >
                                      PDF
                                    </div>

                                    <iframe
                                      src={m?.replyto?.file}
                                      style={{
                                        width: "100%",
                                        height: "400px",
                                        border: "1px solid black",
                                      }}
                                    />
                                  </div>
                                )}

                                {/* Video Handling */}
                                {m.replyto.file.includes("video") &&
                                !m.replyto.file.endsWith(".webm") ? (
                                  <div style={{ padding: "20px" }}>
                                    <video
                                      controls
                                      style={{
                                        width: "350px", // Adjust width as needed
                                        borderRadius: "8px", // Optional: for rounded corners
                                        boxShadow:
                                          "0px 2px 5px rgba(0, 0, 0, 0.1)", // Optional: subtle shadow effect
                                      }}
                                    >
                                      <source src={m.replyto.file} type="video/webm" />
                                      Your browser does not support the video
                                      tag.
                                    </video>
                                  </div>
                                ) : (
                                  <audio controls>
                                    <source src={m.replyto.file} type="audio/mpeg" />
                                    Your browser does not support the audio
                                    element.
                                  </audio>
                                )}

                                {/* Raw File Handling (e.g., folder) */}
                                {m?.replyto?.file.includes("raw") && (
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      border: "1px solid #ccc", // Border around the folder
                                      borderRadius: "5px", // Rounded corners
                                      padding: "10px", // Padding inside the folder
                                      margin: "10px 0", // Margin above and below the folder
                                      backgroundColor: "#f9f9f9", // Light background color
                                      position: "relative", // To allow positioning of inner elements
                                      transition: "box-shadow 0.3s ease", // Transition for hover effect
                                      cursor: "pointer", // Change cursor on hover
                                      boxShadow:
                                        "0px 2px 5px rgba(0, 0, 0, 0.1)", // Subtle shadow
                                    }}
                                    onClick={() =>
                                      handleDownload(m?.replyto?.file)
                                    } // Call the download handler on click
                                  >
                                    <div
                                      style={{
                                        fontSize: "30px", // Size of the folder icon
                                        marginRight: "10px", // Space between the icon and audio
                                      }}
                                    >
                                      <span style={{ display: "inline-block" }}>
                                        📁
                                      </span>
                                    </div>
                                    <span>Download Folder</span>{" "}
                                    {/* Optional text for clarity */}
                                  </div>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </Text>
                    </Box>
                  )}
                  <Box
                    // bg={m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"}
                    borderRadius="20px"
                    padding="5px 15px"
                    position="relative" // Ensure this box is positioned relative
                    display="inline-block"
                  >
                    <Tooltip
                      label={new Intl.DateTimeFormat("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }).format(new Date(m?.createdAt))}
                      placement="bottom-start"
                      hasArrow
                    >
                      <Text>
                        {m?.content ||
                          (m?.file && (
                            <>
                              {m.file.endsWith(".jpg") ||
                              m.file.endsWith(".jpeg") ||
                              m.file.endsWith(".png") ? (
                                <div style={{ padding: "20px" }}>
                                  {/* Use ImageWithOptions for images */}
                                  <ImageWithOptions imageUrl={m.file} />
                                </div>
                              ) : m.file.endsWith(".pdf") ? (
                                <div
                                  style={{
                                    position: "relative",
                                    padding: "20px",
                                  }}
                                >
                                  {/* PDF Sticker */}
                                  <div
                                    style={{
                                      position: "absolute",
                                      top: 10,
                                      left: -10,
                                      backgroundColor: "#ff5733", // Bright color for the sticker
                                      color: "white",
                                      padding: "5px 10px",
                                      borderRadius: "5px",
                                      fontSize: "14px",
                                      fontWeight: "bold",
                                      transform: "rotate(-10deg)", // Slight rotation for a playful look
                                    }}
                                  >
                                    PDF
                                  </div>
                                  <iframe
                                    src={m.file}
                                    style={{
                                      width: "100%", // Ensure the iframe fits well
                                      height: "400px", // Specify a height
                                      border: "1px solid black",
                                    }}
                                  />
                                </div>
                              ) : m.file.includes("video") &&
                                !m.file.endsWith(".webm") ? (
                                <div style={{ padding: "20px" }}>
                                  <video
                                    controls
                                    style={{
                                      width: "350px", // Adjust width as needed
                                      borderRadius: "8px", // Optional: for rounded corners
                                      boxShadow:
                                        "0px 2px 5px rgba(0, 0, 0, 0.1)", // Optional: subtle shadow effect
                                    }}
                                  >
                                    <source src={m.file} type="video/webm" />
                                    Your browser does not support the video tag.
                                  </video>
                                </div>
                              ) : (
                                <audio controls>
                                  <source src={m?.file} type="audio/mpeg" />
                                  Your browser does not support the audio
                                  element.
                                </audio>
                              )}

                              {m?.file.includes("raw") && (
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    border: "1px solid #ccc", // Border around the folder
                                    borderRadius: "5px", // Rounded corners
                                    padding: "10px", // Padding inside the folder
                                    margin: "10px 0", // Margin above and below the folder
                                    backgroundColor: "#f9f9f9", // Light background color
                                    position: "relative", // To allow positioning of inner elements
                                    transition: "box-shadow 0.3s ease", // Transition for hover effect
                                    cursor: "pointer", // Change cursor on hover
                                    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)", // Subtle shadow
                                  }}
                                  onClick={() => handleDownload(m?.file)} // Call the download handler on click
                                >
                                  <div
                                    style={{
                                      fontSize: "30px", // Size of the folder icon
                                      marginRight: "10px", // Space between the icon and text
                                    }}
                                  >
                                    <span
                                      style={{
                                        display: "inline-block", // Makes sure the icon aligns correctly
                                      }}
                                    >
                                      📁
                                    </span>{" "}
                                    {/* You can replace this with an actual folder icon if needed */}
                                  </div>
                                  <span>Download Folder</span>{" "}
                                </div>
                              )}
                            </>
                          ))}
                      </Text>

                      {/* <Text>emoi</Text> */}
                    </Tooltip>

                    <Text
                      fontSize="10px"
                      color="gray.500"
                      textAlign={
                        m?.sender?._id === user?._id ? "right" : "left"
                      }
                    >
                      {new Date(m?.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {m?.isEdited && " (Edited)"}
                    </Text>
                    {m?.reaction && (
                      <Box
                        position="absolute"
                        bottom="-20px" // Adjust this value to move the emoji closer or further from the border
                        left="100%" // Center the emoji horizontally
                        transform="translateX(-50%)" // Center alignment adjustment
                        // bg="white" // White background for the emoji
                        // borderRadius="50%" // Optional: Make it round
                        padding="5px" // Optional: Padding around the emoji
                        // boxShadow="0 2px 5px rgba(0, 0, 0, 0.3)" // Optional: Add a shadow for depth
                      >
                        <Text>
                          {" "}
                          {/* Change emoji color as needed */}
                          {m.reaction} {/* This can be an emoji or text */}
                        </Text>
                      </Box>
                    )}
                    {!m?.isDeleted && (
                      <Menu
                        isOpen={currentMessageId === m?._id && isOpen}
                        onClose={onClose}
                        placement="auto-end"
                      >
                        <MenuButton
                          as={IconButton}
                          aria-label="Options"
                          icon={<FaEllipsisV />}
                          size="sm"
                          variant="unstyled"
                          onClick={() => {
                            setCurrentMessageId(m?._id);
                            onOpen();
                          }}
                          position="absolute"
                          right="-22px" // Adjust if needed
                          top="6px" // Adjust if needed
                          // zIndex="tooltip" // Ensure it is above other elements
                        />
                        <MenuList>
                          <MenuItem onClick={() => handleCopy(m?.content)}>
                            Copy
                          </MenuItem>
                          {m?.chat?.isGroupChat && (
                            <MenuItem
                              onClick={() => {
                                onOpenModal();
                                setusersWhoReadMessages(m?.readBy);
                              }}
                            >
                              Info
                            </MenuItem>
                          )}

                          <MenuItem onClick={() => handleReplyto(m)}>
                            Reply
                          </MenuItem>
                          {m?.sender?._id === user?._id && (
                            <>
                              {!m?.file && (
                                <MenuItem
                                  onClick={() => {
                                    setNewMessage(m?.content);
                                    setMessageId(currentMessageId);
                                  }}
                                  // onKeyDown={sendMessage(true,currentMessageId)}
                                >
                                  Edit
                                </MenuItem>
                              )}

                              <MenuItem
                                onClick={() => {
                                  dispatch(
                                    deleteMessage({
                                      messageId: currentMessageId,
                                    })
                                  );
                                  setFetchAgain(!fetchAgain);
                                }}
                              >
                                Delete
                              </MenuItem>
                            </>
                          )}
                        </MenuList>

                        {m?.sender?._id == user?._id &&
                          (m?.chat?.isGroupChat &&
                          m?.chat?.users?.length - 1 === m?.readBy?.length ? (
                            <Box
                              position="absolute"
                              right="-5px"
                              top="35px" // Adjust to position the ticks below the menu button
                              display="flex"
                              alignItems="center"
                            >
                              <Box marginRight="2px">
                                <FaCheckDouble size={10} color="green" />{" "}
                                {/* Seen and user is online */}
                              </Box>
                            </Box>
                          ) : (
                            <span>
                              {
                                // Check if the other user is online
                                otherUser?.isOnline == 1 ? (
                                  m?.chat?.users?.some(
                                    (chatUserId) =>
                                      chatUserId !== user?._id &&
                                      m?.seenBy[chatUserId] == 1
                                  ) ? (
                                    <Box
                                      position="absolute"
                                      right="-5px"
                                      top="35px" // Adjust to position the ticks below the menu button
                                      display="flex"
                                      alignItems="center"
                                    >
                                      <Box marginRight="2px">
                                        <FaCheckDouble
                                          size={10}
                                          color="green"
                                        />{" "}
                                        {/* Seen and user is online */}
                                      </Box>
                                    </Box>
                                  ) : (
                                    <Box
                                      position="absolute"
                                      right="-5px"
                                      top="35px" // Adjust to position the ticks below the menu button
                                      display="flex"
                                      alignItems="center"
                                    >
                                      <Box marginRight="2px">
                                        <FaCheckDouble size={10} color="gray" />{" "}
                                        {/* Message sent, but not seen */}
                                      </Box>
                                    </Box>
                                  )
                                ) : (
                                  <Box
                                    position="absolute"
                                    right="-5px"
                                    top="35px" // Adjust to position the ticks below the menu button
                                    display="flex"
                                    alignItems="center"
                                  >
                                    <Box marginRight="2px">
                                      <FaCheck size={10} color="gray" />{" "}
                                      {/* Seen but user is offline */}
                                    </Box>
                                  </Box>
                                )
                              }
                            </span>
                          ))}
                      </Menu>
                    )}
                  </Box>
                </Flex>
                {m.sender?._id !== user?._id && (
                  // <Box>sd</Box>
                  <IconButton
                    aria-label="emoji-picker"
                    icon={<FaSmile />}
                    onClick={() => {
                      setmessageId(m?._id);
                      setSenderName(m?.sender?.name);
                      setShowEmojiPicker(!showEmojiPicker);
                      console.log(m, "mmmmmmmmmmmmmmmmmm");
                    }}
                    // onClick={()=>console.log("emmmm")}
                    variant="ghost"
                    size="lg"
                  />
                )}
              </Flex>
            );
          })}
      </ScrollableFeed>

      {showEmojiPicker && (
        <Box position="absolute" bottom="50px" zIndex="1000">
          <EmojiPicker onEmojiClick={addEmoji} />
        </Box>
      )}

      <Modal isOpen={isopen} onClose={onCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Read By</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {usersWhoReadMessages?.map((user) => {
              return <UserListItem user={user} />;
            })}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onCloseModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ScrollableChat;
