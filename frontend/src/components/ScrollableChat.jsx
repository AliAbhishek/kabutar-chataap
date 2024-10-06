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
} from "@chakra-ui/react";
import {
  FaCheck,
  FaCheckDouble,
  FaEllipsisV,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import {
  deleteMessage,
  editMessage,
  getMessages,
} from "../redux/actions/userActions";
import UserListItem from "./UserListItem";
import { io } from "socket.io-client";
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
let socket;
const Endpoint = "https://kabutar-chataap-backend.onrender.com";
// const Endpoint = "http://192.168.56.1:8000/";

const ScrollableChat = ({
  messages,
  setNewMessage,
  setFlag,
  flag,
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

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isopen, setIsOpen] = useState(false);

  const onOpenModal = () => setIsOpen(true);
  const onCloseModal = () => setIsOpen(false);
  const [currentMessageId, setCurrentMessageId] = useState(null);
  const [highlightedMessage, setHighlightedMessage] = useState(null);
  const [usersWhoReadMessages, setusersWhoReadMessages] = useState(null);

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

    socket = io(Endpoint, {
      extraHeaders: {
        Authorization: token,
      },
    });

    if (socket) {
      socket.on("seenUnseen", async (data) => {
        console.log(data, "ddaaafffaa");
        // fetchMessages()
        // setFlag(!flag)
        // await dispatch(getMessages(chatdata?._id));
      });
    }
  }, [Endpoint]);

  const otherUser = chatdata?.users?.find((x) => x?._id !== user?._id);
  console.log(otherUser?.isOnline, "other");

  return (
    <>
      <ScrollableFeed className="custom-scroll">
        {messages &&
          messages.map((m, i) => {
            console.log(m, "mmmm");
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
                        {m?.replyto?.content ||
                          (m?.replyto?.file && (
                            <img
                              style={{
                                height: "200px",
                                width: "200px",
                                objectFit: "cover",
                              }}
                              src={m?.replyto?.file}
                            />
                          ))}
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
                            <img
                              style={{
                                height: "200px",
                                width: "200px",
                                objectFit: "cover",
                              }}
                              src={m?.file}
                            />
                          ))}
                      </Text>
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
              </Flex>
            );
          })}
      </ScrollableFeed>

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
