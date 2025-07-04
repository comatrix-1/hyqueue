import React from "react";
import { Box, Text, Heading, VStack } from "@chakra-ui/react";

const PrivacyPolicy = () => {
  return (
    <Box maxW="1200px" mx="auto" p={6}>
      <Heading as="h1" size="xl" mb={6}>
        Privacy Policy
      </Heading>
      <VStack align="start">
        <Text fontSize="lg">
          <strong>Effective Date:</strong> 4 July 2025
        </Text>
        <Text fontSize="lg">
          At Hyqueue, we respect your privacy and are committed to
          protecting the personal information you share with us. This Privacy
          Policy outlines how we collect, use, and safeguard your information
          when you visit our website and use our services.
        </Text>

        <Heading as="h2" size="md" mt={6}>
          1. Information We Collect
        </Heading>
        <Text fontSize="lg">
          We may collect the following types of information:
        </Text>
        <Text fontSize="lg" pl={6}>
          • <strong>Personal Information:</strong> Information that can identify
          you personally, such as your name, email address, and other contact
          details when you sign up for notifications or use our services.
        </Text>
        <Text fontSize="lg" pl={6}>
          • <strong>Usage Data:</strong> Data related to your interaction with
          our website, including IP address, browser type, device information,
          and page views.
        </Text>

        <Heading as="h2" size="md" mt={6}>
          2. How We Use Your Information
        </Heading>
        <Text fontSize="lg">
          We use the information we collect for the following purposes:
        </Text>
        <Text fontSize="lg" pl={6}>
          • To send you updates and notifications about our services.
        </Text>
        <Text fontSize="lg" pl={6}>
          • To improve the functionality and user experience of our website.
        </Text>
        <Text fontSize="lg" pl={6}>
          • To communicate with you about customer service, technical issues, or
          requests.
        </Text>

        <Heading as="h2" size="md" mt={6}>
          3. Data Security
        </Heading>
        <Text fontSize="lg">
          We take reasonable measures to protect your personal information from
          unauthorized access, alteration, disclosure, or destruction.
        </Text>

        <Heading as="h2" size="md" mt={6}>
          4. Cookies
        </Heading>
        <Text fontSize="lg">
          Our website may use cookies to enhance user experience. You can
          control cookie settings through your browser.
        </Text>

        <Heading as="h2" size="md" mt={6}>
          5. Third-Party Links
        </Heading>
        <Text fontSize="lg">
          Our website may contain links to external sites. We are not
          responsible for the content or privacy practices of these third-party
          sites.
        </Text>

        <Heading as="h2" size="md" mt={6}>
          6. Your Rights
        </Heading>
        <Text fontSize="lg">You have the right to:</Text>
        <Text fontSize="lg" pl={6}>
          • Request access to or correction of your personal data.
        </Text>
        <Text fontSize="lg" pl={6}>
          • Opt out of receiving communications from us.
        </Text>

        <Heading as="h2" size="md" mt={6}>
          7. Contact Us
        </Heading>
        <Text fontSize="lg">
          If you have any questions or concerns about this Privacy Policy,
          please contact us at [Insert Contact Information].
        </Text>
      </VStack>
    </Box>
  );
};

export default PrivacyPolicy;
