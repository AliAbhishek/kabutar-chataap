// import { Avatar } from "@chakra-ui/avatar";
// import { Tooltip } from "@chakra-ui/tooltip";
import { useDispatch, useSelector } from "react-redux";
import ScrollableFeed from "react-scrollable-feed";
import {
  Avatar,
  Box,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { FaEllipsisV } from "react-icons/fa";
import { useRef, useState } from "react";
import {
  deleteMessage,
  editMessage,
  getMessages,
} from "../redux/actions/userActions";
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

const ScrollableChat = ({
  messages,
  setNewMessage,
  // setFlag,
  // flag,
  fetchAgain,
  setFetchAgain,
  setMessageId,
  handleReplyto,
}) => {
  const chatdata = useSelector((state) => state.userData.chatData);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userData.user);
  console.log(messages, "messages");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentMessageId, setCurrentMessageId] = useState(null);
  const [highlightedMessage, setHighlightedMessage] = useState(null);

  const messageRefs = useRef([]);

  const scrollToMessage = (id) => {
    const messageIndex = messages.findIndex((msg) => msg._id === id);
    if (messageIndex >= 0 && messageRefs.current[messageIndex]) {
      messageRefs.current[messageIndex].scrollIntoView({ behavior: "smooth" });
      setHighlightedMessage(id);
    }
  };

  return (
    <ScrollableFeed className="custom-scroll">
      {messages &&
        messages.map((m, i) => (
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
              align={m.sender?._id === user?._id ? "flex-end" : "flex-start"}
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
                  <Text>Replying to: {m?.replyto?.content || m?.replyto?.file && <img style={{height:"200px",width:"200px",objectFit:"cover"}} src={m?.replyto?.file}/> }</Text>
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
                  <Text>{m?.content || m?.file && <img style={{height:"200px",width:"200px",objectFit:"cover"}} src={m?.file}/>}</Text>
                </Tooltip>

                <Text
                  fontSize="10px"
                  color="gray.500"
                  textAlign={m?.sender?._id === user?._id ? "right" : "left"}
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
                      zIndex="tooltip" // Ensure it is above other elements
                    />
                    <MenuList>
                      <MenuItem onClick={() => handleReplyto(m)}>
                        Reply
                      </MenuItem>
                      {m?.sender?._id === user?._id && (
                        <>
                        {
                          !m?.file && <MenuItem
                          onClick={() => {
                            setNewMessage(m?.content);
                            setMessageId(currentMessageId);
                          }}
                          // onKeyDown={sendMessage(true,currentMessageId)}
                        >
                          Edit
                        </MenuItem>
                        }
                          
                          <MenuItem
                            onClick={() => {
                              dispatch(
                                deleteMessage({ messageId: currentMessageId })
                              );
                              setFetchAgain(!fetchAgain);
                            }}
                          >
                            Delete
                          </MenuItem>
                        </>
                      )}
                    </MenuList>
                  </Menu>
                )}
              </Box>
            </Flex>
          </Flex>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
