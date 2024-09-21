import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import { motion } from "framer-motion";

function Homepage() {
  return (
    <Container maxW="xl" centerContent>
      {/* Logo Box */}
      <Box
        d="flex"
        justifyContent="center"
        textAlign="center"
        p={3}
        bgGradient="linear(to-br, #0d47a1, #1e90ff)" // Gradient for background
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        boxShadow="0px 0px 15px #00BFFF"
      >
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
      </Box>

      {/* Login/Signup Box */}
      <Box
        bg="rgba(0, 0, 0, 0.75)" // Semi-transparent black for background
        w="100%"
        p={4}
        borderRadius="lg"
        borderWidth="1px"
        borderColor="#00BFFF" // Blue border
        boxShadow="0px 0px 15px #00BFFF" // Glowing shadow
      >
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab
              _selected={{ color: "#00BFFF", bg: "black" }} // Highlight selected tab
              _hover={{ color: "#87CEEB" }}
              color="white" // White text for tabs
            >
              Login
            </Tab>
            <Tab
              _selected={{ color: "#00BFFF", bg: "black" }}
              _hover={{ color: "#87CEEB" }}
              color="white" // White text for tabs
            >
              Sign Up
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default Homepage;
