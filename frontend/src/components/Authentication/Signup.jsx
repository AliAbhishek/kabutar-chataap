import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editProfile, registration } from "../../redux/actions/userActions";
import { useNavigate } from "react-router-dom";
import { requestForToken } from "../../Firebase/FirebaseConfig";

const Signup = ({ purpose }) => {
  const dispatch = useDispatch();
  const fcm = useSelector((state) => state.userData.fcmToken);
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [password, setPassword] = useState();
  const [pic, setPic] = useState();
  const [picLoading, setPicLoading] = useState(false);
  const [fcmToken, setFCMtoken] = useState(false);

  useEffect(() => {
    const fetchToken = async () => {
      const fcmToken = await requestForToken();
      console.log(fcmToken,"fcmtoken")
      setFCMtoken(fcmToken)
      
      
      // dispatch(setFCMtoken(fcmToken));
    };
  fetchToken()
  }, []);

  const submitHandler = async () => {
    setPicLoading(true);

    if (!purpose) {
      if (!name || !email || !password || !confirmpassword) {
        toast({
          title: "Please Fill all the Fields",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setPicLoading(false);
        return;
      }

      const emailPattern = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(email)) {
        toast({
          title: "Please enter a valid email",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setPicLoading(false);
        return;
      }

      if (password !== confirmpassword) {
        toast({
          title: "Passwords Do Not Match",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setPicLoading(false);
        return;
      }
    }

    let formData = new FormData();
   name && formData.append("name", name);
   email && formData.append("email", email);
   password && formData.append("password", password);
   fcmToken && formData.append("deviceToken", fcmToken);
   pic &&  formData.append("pic", pic);

    

    let data = purpose ? await dispatch(editProfile(formData)) : await dispatch(registration(formData));

    if (data?.payload?.success) {
      setPicLoading(false);
      toast({
        title: data?.payload?.message,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
     !purpose && sessionStorage.setItem("token", data?.payload?.data?.token);
      // window.location.href = "/chats";
      navigate("/chats");
      // navigate("/")
    } else {
      toast({
        title: data?.payload?.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
    }
  };

  return (
    <VStack spacing="5px">
      {/* {!purpose && ( */}
      <Text fontSize="2xl" color="white" fontWeight="bold" textAlign="center">
        Edit Profile
      </Text>
      {/* )} */}
      <FormControl id="first-name" isRequired>
        <FormLabel color="white">Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
          color="white"
          _placeholder={{ color: "gray.400" }}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel color="white">Email Address</FormLabel>
        <Input
          type="email"
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
          color="white"
          _placeholder={{ color: "gray.400" }}
        />
      </FormControl>
      {!purpose && (
        <>
          {" "}
          <FormControl id="password" isRequired>
            <FormLabel color="white">Password</FormLabel>
            <InputGroup size="md">
              <Input
                type={show ? "text" : "password"}
                placeholder="Enter Password"
                onChange={(e) => setPassword(e.target.value)}
                color="white"
                _placeholder={{ color: "gray.400" }}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <FormControl id="confirmpassword" isRequired>
            <FormLabel color="white">Confirm Password</FormLabel>
            <InputGroup size="md">
              <Input
                type={show ? "text" : "password"}
                placeholder="Confirm Password"
                onChange={(e) => setConfirmpassword(e.target.value)}
                color="white"
                _placeholder={{ color: "gray.400" }}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
        </>
      )}

      <FormControl id="pic">
        <FormLabel color="white">Upload your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => setPic(e.target.files[0])}
          color="white"
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={picLoading}
      >
        {purpose ? "Edit Profile" : "Sign Up"}
      </Button>
    </VStack>
  );
};

export default Signup;
