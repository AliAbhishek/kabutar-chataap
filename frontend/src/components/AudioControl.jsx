import { Button, Box } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionButton = motion(Button);

const AudioControls = ({ startRecording, stopRecording, isRecording }) => {

    
  return (
    <Box display="flex" gap={4} justifyContent="center">
      {/* Start Recording Button */}
      {
        !isRecording ? <MotionButton
        onClick={startRecording}
        disabled={isRecording}
        paddingBottom="5px"
        colorScheme="blue"
        bgGradient="linear(to-r, #87CEEB, #1E90FF)"
        _hover={{ bgGradient: "linear(to-r, #1E90FF, #00BFFF)", transform: "scale(1.1)" }}
        _active={{ bgGradient: "linear(to-r, #00BFFF, #87CEEB)" }}
        borderRadius="20px"
        // boxShadow="0px 0px 15px rgba(0, 191, 255, 0.7)"
        // as={motion.button}
        // initial={{ opacity: 0.8 }}
        // animate={{ opacity: 1 }}
        // transition="all 0.3s ease-in-out"
       
      >
        🎙️ 
      </MotionButton> :   <MotionButton
        onClick={stopRecording}
        disabled={!isRecording}
        colorScheme="red"
        bgGradient="linear(to-r, #FF7F7F, #FF4500)"
        _hover={{ bgGradient: "linear(to-r, #FF6347, #FF0000)", transform: "scale(1.1)" }}
        _active={{ bgGradient: "linear(to-r, #FF0000, #FF7F7F)" }}
        borderRadius="20px"
        // boxShadow="0px 0px 15px rgba(255, 69, 0, 0.7)"
        // as={motion.button}
        // initial={{ opacity: 0.8 }}
        // animate={{ opacity: 1 }}
        // transition="all 0.3s ease-in-out"
      >
        🛑 
      </MotionButton>
      }
      

      {/* Stop Recording Button */}
    

      {/* Send Audio Message Button */}
      {/* <MotionButton
        onClick={sendAudioMessage}
        disabled={!audioBlob}
        colorScheme="green"
        bgGradient="linear(to-r, #00FF7F, #32CD32)"
        _hover={{ bgGradient: "linear(to-r, #3CB371, #2E8B57)", transform: "scale(1.1)" }}
        _active={{ bgGradient: "linear(to-r, #2E8B57, #00FF7F)" }}
        borderRadius="20px"
        boxShadow="0px 0px 15px rgba(0, 255, 127, 0.7)"
        as={motion.button}
        initial={{ opacity: 0.8 }}
        animate={{ opacity: 1 }}
        transition="all 0.3s ease-in-out"
      >
        🚀 Send Audio Message
      </MotionButton> */}
    </Box>
  );
};

export default AudioControls;
