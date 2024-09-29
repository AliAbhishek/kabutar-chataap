import { Button } from "@chakra-ui/button";
// import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import { Tooltip } from "@chakra-ui/tooltip";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
// import { useHistory } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
// import ChatLoading from "../ChatLoading";
import { Spinner } from "@chakra-ui/spinner";
import { useDispatch, useSelector } from "react-redux";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/react";
import { createChat, searchUser } from "../redux/actions/userActions";
import ChatLoading from "./ChatLoading";
import UserListItem from "./UserListItem";
import { chatNameStuff, chatWithUser, logout } from "../redux/Slice/userSlice";
import { persistor } from "../redux/Store";
import { motion } from "framer-motion";
// import ProfileModal from "./ProfileModal";
// import NotificationBadge from "react-notification-badge";
// import { Effect } from "react-notification-badge";
// import { getSender } from "../../config/ChatLogics";
// import UserListItem from "../userAvatar/UserListItem";
// import { ChatState } from "../../Context/ChatProvider";

function SideDrawer() {
  // data from store
  const user = useSelector((state) => state.userData.user);
  console.log(user, "user");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [search, setSearch] = useState(null);
  const [searchResult, setSearchResult] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const data = await dispatch(searchUser(search));
      console.log(data, "data");

      setLoading(false);
      setSearchResult(data?.payload?.data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    
    try {
      setLoadingChat(true);

      const data = await dispatch(createChat({ chatWithUserId: userId }));
      console.log(data, "data");

      // if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      let chattingUser = data?.payload?.data?.users?.find(
        (x) => x?._id != user?._id
      );

      setSelectedChat(chattingUser);

      dispatch(chatWithUser(userId));
      dispatch(chatNameStuff(chattingUser))
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  console.log(selectedChat, "selectedcgat");
  console.log(searchResult, "search");

  return (
    <>
      <Box
        d="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
        style={{ display: "flex" }}
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text
          fontSize="4xl"
          fontFamily="Bangers, cursive"
          textAlign="center"
          bgGradient="linear(to-r, #00BFFF, #87CEEB)" // Gradient colors for the logo
          bgClip="text" // Ensures gradient is applied to the text
          textShadow="3px 3px 8px #000000"
          className="animated-logo"
          as={motion.div}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0, rotate: [-5, 5, -5] }}
          transition={{
            y: { type: "spring", stiffness: 300, damping: 20 },
            rotate: {
              duration: 2,
              ease: "easeInOut",
              loop: Infinity,
              repeatDelay: 1,
            },
          }}
          _hover={{
            bgGradient: "linear(to-r, #87CEEB, #00BFFF)", // Reverse the gradient on hover
            bgClip: "text",
            textShadow: "3px 3px 8px #87CEEB",
            transform: "scale(1.1)",
          }}
        >
          🕊️ Kabutar 🕊️
        </Text>

        <div>
          <Menu>
            <MenuButton p={1}>
              {/* <NotificationBadge
                // count={notification.length}
                // effect={Effect.SCALE}
              /> */}
              {/* <BellIcon fontSize="2xl" m={1} /> */}
            </MenuButton>
            <MenuList pl={2}>
              {/* {!notification.length && "No New Messages"} */}
              {/* {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))} */}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user?.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>{" "}
              </ProfileModal>
              <MenuDivider />
              <MenuItem
                onClick={() => {
                  sessionStorage.clear();

                  dispatch(chatWithUser(null));
                  dispatch(logout());
                  navigate("/");
                }}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box d="flex" style={{ display: "flex" }} pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : searchResult?.length > 0 ? (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            ) : (
              <p style={{ size: "xl" }}></p>
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;
