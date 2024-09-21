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
} from "@chakra-ui/react";
import axios from "axios";
import { motion } from "framer-motion";
import { useState } from "react";
import { createGroup, fetchChat, searchUser } from "../redux/actions/userActions";
import { useDispatch } from "react-redux";
import ChatLoading from "./ChatLoading";
import UserListItem from "./UserListItem";
import UserBadgeItem from "./UserBadge";

const GroupChatModal = ({ children,setFlag,flag }) => {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // const { user, chats, setChats } = ChatState();

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
    
  };

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

  console.log(selectedUsers, "=================");

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all the feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    } 

    if(selectedUsers?.length<2){
      toast({
        title: "Please select atleast 2 members",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      const { data } = await dispatch(
        createGroup({
          chatName: groupChatName,
          users: selectedUsers?.map((u) => u._id),
        })
      );
      console.log(data, "data");
      // setChats([data, ...chats]);
      setFlag(!flag)
      onClose();
      
      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      console.log(error, "error");
      toast({
        title: "Failed to Create the Chat!",
        description: error.response,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal onClose={onClose} isOpen={isOpen}>
        <ModalOverlay bg="rgba(0, 0, 0, 0.8)" />
        <ModalContent
          bgGradient="linear(to-br, #00BFFF, #1E90FF, #87CEEB)"
          borderRadius="30px"
          boxShadow="0px 0px 25px rgba(30, 144, 255, 0.5)"
          color="white"
          p={6}
          as={motion.div}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition="0.7s ease-out"
        >
          <ModalHeader
            fontSize="36px"
            fontFamily="Bangers, cursive"
            textAlign="center"
            color="#F0FFFF"
            textShadow="3px 3px 8px #000000"
            transform="skew(-5deg)"
          >
            🌤️ Create Group Chat 🌤️
          </ModalHeader>
          <ModalCloseButton color="#F0FFFF" />
          <ModalBody d="flex" flexDir="column" alignItems="center">
            <FormControl mb={4}>
              <Input
                placeholder="Chat Name"
                mb={4}
                onChange={(e) => setGroupChatName(e.target.value)}
                borderColor="#87CEEB"
                bg="rgba(255, 255, 255, 0.3)"
                color="white"
                _placeholder={{ color: "#F0FFFF" }}
                _focus={{ borderColor: "#00BFFF", transform: "scale(1.05)" }}
                borderRadius="15px"
                transition="0.3s"
              />
            </FormControl>
            <FormControl mb={4}>
              <Input
                placeholder="Add Users eg: John, Piyush, Jane"
                mb={2}
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
            <Box w="100%" d="flex" flexWrap="wrap" justifyContent="center">
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                  bgGradient="linear(to-r, #87CEEB, #00BFFF)"
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
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.slice(0, 4).map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleGroup(user)}
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
          <ModalFooter>
          <Button
  onClick={handleSubmit}
  colorScheme="yellow"
  variant="solid"
  bg="white"
  color="black"
  _hover={{
    bgGradient: "linear(to-r, #87CEEB, #00BFFF)",
    color: "white",
  }}
  _active={{ bg: "#1E90FF", color: "white" }}
  borderRadius="20px"
  boxShadow="0px 0px 20px rgba(30, 144, 255, 0.6)"
  transform="skew(-5deg)"
  transition="0.3s"
>
  🌟 Create Chat
</Button>

          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
