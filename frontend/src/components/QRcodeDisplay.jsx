import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { QRcode } from "../redux/actions/userActions"; // Adjust the import based on your action
import {
  Box,
  Button,
  Modal,
  ModalHeader,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  VStack,
} from "@chakra-ui/react";

const QRCodeDisplay = () => {
  const dispatch = useDispatch();
  const [qrCode, setQrCode] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        const response = await dispatch(QRcode());
        setQrCode(response?.payload);
      } catch (error) {
        console.error("Error fetching QR code:", error);
      }
    };

    fetchQRCode();
  }, [dispatch]);

  return (
    <>
      <Button onClick={onOpen} colorScheme="purple">
        Open QR Code
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent zIndex={9999}>
          <ModalHeader textAlign="center" color="#1E90FF">
            Scan This QR Code
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={5} textAlign="center" p={5}>
              <Text fontSize="lg" color="gray.600">
                Point your camera at the QR code below to quickly access our
                website!
              </Text>
              <Box
                dangerouslySetInnerHTML={{ __html: qrCode }}
                border="2px solid #1E90FF"
                borderRadius="md"
                p={5}
                boxShadow="md"
                bg="gray.50"
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default QRCodeDisplay;
