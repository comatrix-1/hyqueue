import {
  Box,
  Button,
  Center,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import Head from "next/head";
import { FormEvent, useState } from "react";

import { InputText, Navbar } from "../../components/Admin";
import { Container } from "../../components/Container";
import { Main } from "../../components/Main";

import { useRouter } from "next/router";
import { API_ENDPOINT } from "../../constants";

const Index = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [boardId, setBoardId] = useState<string>("");
  const router = useRouter();

  const updateBoardId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBoardId(e.target.value);
  };

  /**
   * Go to Trello to authorise the app
   */
  const authoriseApp = async (e: FormEvent<HTMLFormElement>) => {
    if (!boardId) {
      alert("Please enter a valid Trello board ID");
      return;
    }

    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.post(`${API_ENDPOINT}/login`);
      if (response.data.data?.authorizeUrl) {
        window.location.href = response.data.data?.authorizeUrl;
      } else {
        throw Error("Functions Login URL was not defined.");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.message) {
        alert(`Error: ${error.message}`);
      } else {
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login to Admin - Hyqueue</title>
      </Head>
      <Container>
        <Navbar width="100%" />
        <Main justifyContent="start" width="100%">
          <Center flexDirection="column" alignItems="center" minHeight="75vh">
            <Text textStyle="heading2" pb="10">
              Hyqueue - Admin
            </Text>
            <Box layerStyle="card">
              <form onSubmit={authoriseApp}>
                <InputText
                  id="boardId"
                  label="Board ID"
                  required={true}
                  onChange={updateBoardId}
                  helperText={
                    <Text
                      onClick={onOpen}
                      cursor="pointer"
                      _hover={{ textDecoration: "underline" }}
                    >
                      Don't Know Your Board ID?
                    </Text>
                  }
                  value={boardId}
                />

                <Button
                  display="flex"
                  isLoading={isLoading}
                  width="100%"
                  colorScheme="primary"
                  borderRadius="3px"
                  color="white"
                  variant="solid"
                  size="lg"
                  marginTop="1.5rem"
                  type="submit"
                >
                  Login
                </Button>
              </form>
            </Box>
          </Center>
        </Main>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Don't Know Your Board ID?</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>
                If the URL to your Trello board is
                <Box bg="gray.200" p="2" my="5">
                  <Box as="code" display="flex" fontSize="xs">
                    https://trello.com/b/
                    <Box display="inline" bg="primary.500" color="white">
                      zlksMWQT
                    </Box>
                    /psd-center-at-tampines
                  </Box>
                </Box>
                your board id is{" "}
                <Box display="inline" bg="primary.500" color="white">
                  zlksMWQT
                </Box>
              </Text>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="primary" mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </>
  );
};

export default Index;
