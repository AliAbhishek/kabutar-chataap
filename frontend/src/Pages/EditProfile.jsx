import React from "react";
import Signup from "../components/Authentication/Signup";
import { Flex } from "@chakra-ui/react";

const EditProfile = () => {
  return (
    <Flex
    align="center"
    justify="center"
    width="100%" // Ensures Flex takes the full width
  >
    <Signup purpose="edit" />
  </Flex>
  );
};

export default EditProfile;
