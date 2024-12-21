import React from "react";
import {
  Box,
  Container,
  Flex,
  Image,
  Link,
  Spacer,
  Text,
} from "@chakra-ui/react";

const Navbar = () => {
  return (
    <Box as="nav" py={4} px={8} boxShadow="sm">
      <Container>
        <Flex alignItems="center">
          {/* Logo */}
          <Link href="/">
            <Flex alignItems="center" gap={2}>
              <Image src="/logo-queue.svg" alt="Hyqueue Logo" boxSize="40px" />
              <Text fontSize="xl" fontWeight="bold">
                Hyqueue
              </Text>
            </Flex>
          </Link>

          {/* Links */}
          <Spacer />
          <Flex gap={6}>
            <Link
              href="/#"
              _hover={{ textDecoration: "none", color: "blue.500" }}
            >
              Home
            </Link>
            <Link
              href="/#features"
              _hover={{ textDecoration: "none", color: "blue.500" }}
            >
              Features
            </Link>
            <Link
              href="/#faq"
              _hover={{ textDecoration: "none", color: "blue.500" }}
            >
              FAQ
            </Link>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

export default Navbar;
