import { Box } from "@chakra-ui/layout";
import { useEffect, useState } from "react";

import SideDrawer from "../components/SideDrawer";
import MyChats from "../components/MyChat";
import Chatbox from "../components/Chatbox";
import { useSelector } from "react-redux";

const ChatPage = () => {

   // data from store
   const user = useSelector((state) => state.userData.user);
   

  const [fetchAgain, setFetchAgain] = useState(false);

  


  return (
    <div style={{ width: "100%" }}>
     {user && <SideDrawer /> } 
      <Box style={{display:"flex"}} justifyContent="space-between" w="100%" h="91.5vh" p="10px">
      {user && <MyChats /> }  

      {user &&  <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
    </div>
  );
};

export default ChatPage;
