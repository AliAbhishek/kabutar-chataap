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
  IconButton,
  Text,
  Image,
  Box,
  useColorModeValue,
  Flex,
  keyframes,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Navigate, useNavigate } from "react-router-dom";

// Define the animation keyframes for the border
const borderAnimation = keyframes`
  0% {
    border-color: purple;
  }
  25% {
    border-color: pink;
  }
  50% {
    border-color: yellow;
  }
  75% {
    border-color: cyan;
  }
  100% {
    border-color: purple;
  }
`;

const ProfileModal = ({ user, children }) => {
  const navigate=useNavigate()
  const { isOpen, onOpen, onClose } = useDisclosure();


  return (
    <>
      {children ? (
        <Box onClick={onOpen} _hover={{ cursor: "pointer" }}>
          {children}
        </Box>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
          colorScheme="purple"
          variant="solid"
        />
      )}
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
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
            fontSize="40px"
            fontFamily="Bangers, cursive"
            textAlign="center"
            color="#F0FFFF"
            textShadow="3px 3px 8px #000000"
            transform="skew(-5deg)"
          >
            🌟 {user?.name} 🌟
          </ModalHeader>
          <ModalCloseButton color="#F0FFFF" />
          <ModalBody>
            <Flex
              direction="column"
              align="center"
              justify="center"
              height="100%"
              textAlign="center"
            >
              <Image
                borderRadius="full"
                boxSize="150px"
                src={user?.pic}
                alt={user?.name}
                border="4px solid #F0FFFF"
                animation={`${borderAnimation} 5s linear infinite`}
                mb={4}
                boxShadow="0px 0px 20px rgba(30, 144, 255, 0.6)"
                _hover={{
                  transform: "rotate(10deg) scale(1.1)",
                  transition: "all 0.3s ease-in-out",
                }}
              />
              <Text
                fontSize={{ base: "26px", md: "30px" }}
                fontFamily="Bangers, cursive"
                fontWeight="bold"
                color="#F0FFFF"
                textShadow="2px 2px #000"
              >
                {user?.email}
              </Text>
            </Flex>
          </ModalBody>
          <ModalFooter justifyContent="center">
            <Button
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
              onClick={onClose}
            >
              Close
            </Button>
            <Button
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
              // onClick={onClose}
              marginLeft="5px"
              onClick={() => {
                navigate("/editProfile")
              }}
            >
              Edit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
