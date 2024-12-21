import {
  Container,
  Text,
  VStack,
  Heading,
  HStack,
  Button,
  Box,
  Flex,
} from "@chakra-ui/react";
import Link from "next/link";

const Footer = () => {
  return (
    <Container maxW="container.lg">
      <VStack
        bg="blue.500"
        color="white"
        py={20}
        textAlign="center"
        rounded="4xl"
      >
        <Heading fontSize="4xl" fontWeight="bold" mb={8} maxW={400}>
          Effortless Queue Management System
        </Heading>
        <Text mt={2} fontWeight="bold" mb={3}>
          Deploy your queue management system
        </Text>
        <Flex
          justify="center"
          align="center"
          gap={4}
          direction={{ base: "column", md: "row" }}
        >
          <Link href="https://github.com/comatrix-1/hyqueue">
            <Button
              colorPalette="teal"
              variant="solid"
              backgroundColor="black"
              fontWeight="semibold"
              color="white"
              px={6}
              rounded="4xl"
              _hover={{ backgroundColor: "gray.800" }}
            >
              Go to Github
            </Button>
          </Link>
        </Flex>
        <Box divideY="4" />
      </VStack>
      <VStack alignItems="center" my={8}>
        <HStack color="gray.500" fontSize="md">
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms-of-service">Terms of Service</Link>
        </HStack>
        <Text textAlign="center" color="gray.400" fontSize="sm">
          © 2024 Hyqueue. All rights reserved.
        </Text>
      </VStack>
    </Container>
  );
};

export default Footer;
