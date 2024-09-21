import { Box } from "@chakra-ui/layout";
import { useSelector } from "react-redux";
import SingleChat from "./SingleChat";
// import "./styles.css";
// import SingleChat from "./SingleChat";
// import { ChatState } from "../Context/ChatProvider";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const chatWithUserData = useSelector((state) => state.userData.chatWithuser);
  console.log(chatWithUserData)

  return (
    <Box
      d={{ base: chatWithUserData ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      
    </Box>
  );
};

export default Chatbox;