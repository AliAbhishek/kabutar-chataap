import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  Input,
  useToast,
  Box,
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserBadgeItem from "./UserBadge";
import {
  addMembertoGroup,
  fetchChat,
  removeFromGroup,
  renameGroup,
  searchUser,
} from "../redux/actions/userActions";
import { chatNameStuff, chatWithUser } from "../redux/Slice/userSlice";
import UserListItem from "./UserListItem";
import ChatLoading from "./ChatLoading";
import { motion } from "framer-motion";
// import { ChatState } from "../../Context/ChatProvider";
// import UserBadgeItem from "../userAvatar/UserBadgeItem";
// import UserListItem from "../userAvatar/UserListItem";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const chatdata = useSelector((state) => state.userData.chatData);
  const user = useSelector((state) => state.userData.user);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const toast = useToast();

  //   const { selectedChat, setSelectedChat, user } = ChatState();

  const handleSearch = async (query) => {
    console.log(query, "---------------");
    setSearch(query);
    if (!query) {
      // toast({
      //   title: "Please Enter something in search",
      //   status: "warning",
      //   duration: 5000,
      //   isClosable: true,
      //   position: "top-left",
      // });
      return;
    }

    try {
      setLoading(true);

      const data = await dispatch(searchUser(query));
      console.log(data, "data");

      setLoading(false);
      setSearchResult(data?.payload?.data);
    } catch (error) {
      console.log(error);
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

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);

      const data = await dispatch(
        renameGroup({ groupId: chatdata._id, chatName: groupChatName })
      );
      console.log(data, "data");

      // setSelectedChat("");
      //   setSelectedChat(data);

      dispatch(chatNameStuff(data?.payload?.data));
      //   setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleAddUser = async (user1) => {
    if (chatdata.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User Already in group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (chatdata.groupAdmin._id !== user._id) {
      toast({
        title: "Only admins can add someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      setLoading(true);
      const data = await dispatch(
        addMembertoGroup({
          groupId: chatdata._id,
          userId: user1._id,
        })
      );
      console.log(data?.payload?.data);
      // setSelectedChat(data);
      // setFetchAgain(!fetchAgain);
      dispatch(chatNameStuff(data?.payload?.data));
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleRemove = async (user1) => {
    if (chatdata.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      setLoading(true);
      const data = await dispatch(
        removeFromGroup({
          groupId: chatdata._id,
          userId: user1._id,
        })
      );
      if (user1._id === user._id) {
        dispatch(chatNameStuff(null));
        dispatch(chatWithUser(null));
      } else {
        dispatch(chatNameStuff(data?.payload?.data));
      }
      // setFetchAgain(!fetchAgain);
      // fetchMessages();
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

  return (
    <>
    <IconButton
      display={{ base: "flex" }}
      colorScheme="purple"
      icon={<ViewIcon />}
      onClick={onOpen}
    />
  
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay bg="rgba(0, 0, 0, 0.8)" />
      <ModalContent
        h="450px"
        bgGradient="linear(to-br, #87CEEB, #1E90FF, #00BFFF)"
        border="2px solid #00BFFF"
        borderRadius="30px"
        boxShadow="0px 0px 25px rgba(30, 144, 255, 0.5)"
        as={motion.div}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition="0.7s ease-out"
      >
        <ModalHeader
          fontSize="35px"
          fontFamily="Work sans"
          textAlign="center"
          color="#F0FFFF"
          textShadow="3px 3px 8px #000000"
          transform="skew(-5deg)"
        >
          {chatdata.chatName.toUpperCase()}
        </ModalHeader>
  
        <ModalCloseButton color="#F0FFFF" />
        <ModalBody d="flex" flexDir="column" alignItems="center">
          <Box w="100%" d="flex" flexWrap="wrap" pb={3}>
            {chatdata?.users?.map((u) => (
              <UserBadgeItem
                key={u._id}
                user={u}
                admin={chatdata.groupAdmin}
                handleFunction={() => handleRemove(u)}
                bgGradient="linear(to-br, #87CEEB, #1E90FF)"
                color="white"
                borderRadius="12px"
                m={1}
                p={3}
                border="2px solid #1E90FF"
                boxShadow="0px 0px 15px rgba(30, 144, 255, 0.6)"
                _hover={{
                  transform: "scale(1.05)",
                  transition: "0.2s",
                }}
              />
            ))}
          </Box>
          <FormControl display="flex">
            <Input
              placeholder="Chat Name"
              mb={3}
              value={groupChatName}
              onChange={(e) => setGroupChatName(e.target.value)}
              borderColor="#87CEEB"
              bg="rgba(255, 255, 255, 0.3)"
              color="white"
              _placeholder={{ color: "#F0FFFF" }}
              _focus={{ borderColor: "#00BFFF", transform: "scale(1.05)" }}
              borderRadius="15px"
              transition="0.3s"
            />
            <Button
              variant="solid"
              colorScheme="teal"
              ml={1}
              isLoading={renameloading}
              onClick={handleRename}
            >
              Update
            </Button>
          </FormControl>
          <FormControl>
            <Input
              placeholder="Add User to group"
              mb={1}
              onChange={(e) => handleSearch(e.target.value)}
              borderColor="#87CEEB"
              bg="rgba(255, 255, 255, 0.3)"
              color="white"
              _placeholder={{ color: "#F0FFFF" }}
              _focus={{ borderColor: "#00BFFF", transform: "scale(1.05)" }}
              borderRadius="15px"
              transition="0.3s"
            />
          </FormControl>
  
          {loading ? (
            <ChatLoading />
          ) : (
            searchResult?.map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={() => handleAddUser(user)}
                bgGradient="linear(to-l, #1E90FF, #87CEEB)"
                color="white"
                borderRadius="12px"
                m={1}
                p={3}
                boxShadow="0px 0px 10px rgba(135, 206, 235, 0.6)"
                _hover={{
                  transform: "scale(1.05)",
                  transition: "0.2s",
                }}
              />
            ))
          )}
        </ModalBody>
        <ModalFooter justifyContent="center">
          <Button
            onClick={() => handleRemove(user)}
            colorScheme="red"
            variant="solid"
            bg="white"
            color="black"
            _hover={{ bgGradient: "linear(to-r, #87CEEB, #00BFFF)", color: "white" }}
            _active={{ bg: "#1E90FF", color: "white" }}
            borderRadius="20px"
            boxShadow="0px 0px 20px rgba(30, 144, 255, 0.6)"
            transform="skew(-5deg)"
            transition="0.3s"
          >
            Leave Group
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </>
  
  );
};

export default UpdateGroupChatModal;
