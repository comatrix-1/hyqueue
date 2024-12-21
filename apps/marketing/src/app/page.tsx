"use client";

import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Image,
  SimpleGrid,
  VStack,
  Flex,
} from "@chakra-ui/react";

import { Button } from "@/components/ui/button";
import Link from "next/link";

const Home = () => {
  return (
    <>
      {/* Header */}
      <Box
        as="header"
        textAlign="center"
        py={{ base: 20, md: 200 }}
        bg="gray.50"
      >
        <Heading fontSize="4xl" fontWeight="bold" mb={8}>
          Effortless Queue Management System
        </Heading>
        <Text mt={2} fontSize="lg">
          Streamline your queue management with our open-source, no-code
          solution
        </Text>
        <Box mt={8}>
          <Text fontWeight="bold" mb={3}>
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
                backgroundColor="blue.500"
                color="white"
                px={6}
                fontWeight="semibold"
                rounded="4xl"
                _hover={{ backgroundColor: "blue.600" }}
              >
                Go to Github
              </Button>
            </Link>
          </Flex>
        </Box>
      </Box>

      {/* Features Section */}
      <Box bg="blue.500" py={20} color="white" id="features">
        <Container maxW="container.md" textAlign="center">
          <Heading fontSize="4xl" fontWeight="bold" mb={8}>
            Take Control of Your Queue
          </Heading>
          <Text mb="10">
            Manage your queue efficiently with our intuitive system
          </Text>
        </Container>
        <Container maxW="container.lg">
          <SimpleGrid columns={1} gap={{ base: 4, md: 12 }}>
            <FeatureItem
              title="Open-Source"
              description="Our queue management system is open-source, giving you the freedom to customize and modify as needed"
              image="/feature-open-source.jpg"
              imagePosition="left"
            />
            <FeatureItem
              title="Real-Time Updates"
              description="Get instant updates on queue status, ensuring you're always in the know"
              image="/feature-faster.jpg"
              imagePosition="right"
            />
            <FeatureItem
              title="Admin Panel"
              description="Manage your queue behind the scenes with our intuitive admin panel"
              image="/feature-admin-panel.jpg"
              imagePosition="left"
            />
            <FeatureItem
              title="Customizable"
              description="Tailor our system to fit your business needs with ease"
              image="/feature-settings.jpg"
              imagePosition="right"
            />
            <FeatureItem
              title="Scalable"
              description="Our system grows with your business, handling high volumes of traffic with ease"
              image="/feature-scalable.jpg"
              imagePosition="left"
            />
            <FeatureItem
              title="Secure"
              description="Rest assured with our secure system, protecting your data and customers' information"
              image="/feature-secure.jpg"
              imagePosition="right"
            />
          </SimpleGrid>
        </Container>
      </Box>

      {/* Testimonials */}
      <Box py={{ base: 10, md: 20 }}>
        <Container maxW="container.lg" textAlign="center">
          <Heading fontSize="4xl" fontWeight="bold" mb={8}>
            What our customers say
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} mt="8" gap={4}>
            <Testimonial text="This queue management system has completely transformed how we handle customer flow. The ticketing system is intuitive, and the QR code feature makes it super convenient for our customers." />
            <Testimonial text="The TV view feature keeps our waiting customers informed. It's a game changer for our small business! The admin panel is user-friendly, giving us full control over the backend." />
            <Testimonial text="Our customers are thrilled with the QR code feature. They can join the queue remotely, saving them so much time." />
          </SimpleGrid>
        </Container>
      </Box>

      {/* FAQ */}
      <Box py={{ base: 10, md: 20 }}>
        <Container maxW="container.lg">
          <Flex
            direction={{ base: "column", md: "row" }}
            align="center"
            gap={{ base: 12, md: 8 }}
          >
            <Heading
              fontSize="4xl"
              fontWeight="bold"
              textAlign={{ base: "center", md: "left" }}
              maxW={400}
              id="faq"
            >
              Frequently Asked Questions
            </Heading>
            <VStack align="stretch" gap={12} flex="1">
              <FAQItem
                question="Is the system difficult to set up?"
                answer="No, our system is easy to set up and integrate with your existing infrastructure."
              />
              <FAQItem
                question="Can I customize the system to fit my business needs?"
                answer="Yes, our open-source system allows for easy customization to fit your specific requirements."
              />
              <FAQItem
                question="How do I manage my queue with the admin panel?"
                answer="Our intuitive admin panel provides a user-friendly interface to manage your queue efficiently. Trello can also be used if Trello is chosen as the backend."
              />
              <FAQItem
                question="Is the system secure?"
                answer="Yes, our system is built with security in mind, ensuring your data and customers' information are protected."
              />
              <FAQItem
                question="What kind of support do you offer?"
                answer="We offer comprehensive support, including documentation, tutorials, and dedicated customer service."
              />
            </VStack>
          </Flex>
        </Container>
      </Box>
    </>
  );
};

// Feature Component
const FeatureItem = ({
  title,
  description,
  image,
  imagePosition,
}: {
  title: string;
  description: string;
  image: string;
  imagePosition: "left" | "right";
}) => (
  <Box
    bg="whiteAlpha.200"
    p={{ base: 4, md: 6 }}
    borderRadius="md"
    borderWidth={1}
    borderColor="whiteAlpha.300"
    color="white"
  >
    <Flex
      gap={{ base: 2, md: 8 }}
      direction={{
        base: "column",
        md: imagePosition === "left" ? "row" : "row-reverse",
      }}
      align="center"
    >
      <Image
        src={image}
        alt={title}
        borderRadius="md"
        maxWidth={{ base: "100%", md: "300px" }}
        height={200}
        objectFit="cover"
      />
      <Box flex={1}>
        <Heading fontSize="xl" fontWeight="bold">
          {title}
        </Heading>
        <Text mt="2">{description}</Text>
      </Box>
    </Flex>
  </Box>
);

// Testimonial Component
const Testimonial = ({
  text,
  name,
  rating = 5,
}: {
  text: string;
  name?: string;
  rating?: number;
}) => (
  <Flex
    bg="blue.100"
    p="5"
    borderRadius="md"
    boxShadow="md"
    textAlign="center"
    direction="column"
  >
    <Text fontStyle="italic" mb={4} flex={1}>
      &quot;{text}&quot;
    </Text>
    <Box>
      {name ? (
        <Text fontWeight="bold" mt={2}>
          - {name}
        </Text>
      ) : null}
      <Box mt={4}>
        {[...Array(5)].map((_, index) => (
          <Box
            key={index}
            color={index < rating ? "blue.500" : "gray.300"}
            as="span"
            fontSize="lg"
          >
            ★
          </Box>
        ))}
      </Box>
    </Box>
  </Flex>
);

// FAQ Component
const FAQItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => (
  <Box>
    <Heading fontSize="lg" fontWeight="bold">
      {question}
    </Heading>
    <Text mt="2" color="gray.600">
      {answer}
    </Text>
  </Box>
);

export default Home;
