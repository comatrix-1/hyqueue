import React from "react";
import { Box, Text, Heading, VStack } from "@chakra-ui/react";

const TermsOfService = () => {
  return (
    <Box maxW="1200px" mx="auto" p={6}>
      <Heading as="h1" size="xl" mb={6}>
        Terms of Service
      </Heading>
      <VStack align="start">
        <Text fontSize="lg">
          <strong>Effective Date:</strong> 4 July 2025
        </Text>
        <Text fontSize="lg">
          These Terms of Service (&quot;Terms&quot;) govern your use of the
          Hyqueue website and services. By accessing or using our services,
          you agree to be bound by these Terms.
        </Text>

        <Heading as="h2" size="md" mt={6}>
          1. Use of Our Services
        </Heading>
        <Text fontSize="lg">
          • You may use our services only for lawful purposes.
        </Text>
        <Text fontSize="lg">
          • You agree not to misuse our services or engage in any activity that
          disrupts or interferes with the functioning of our website.
        </Text>

        <Heading as="h2" size="md" mt={6}>
          2. Account Registration
        </Heading>
        <Text fontSize="lg">
          • You may be required to create an account to access certain features
          of our services, such as receiving updates or notifications.
        </Text>
        <Text fontSize="lg">
          • You are responsible for keeping your account information secure and
          for all activity under your account.
        </Text>

        <Heading as="h2" size="md" mt={6}>
          3. Intellectual Property
        </Heading>
        <Text fontSize="lg">
          • All content on the website, including logos, images, and text, is
          the property of Hyqueue and is protected by copyright law.
        </Text>
        <Text fontSize="lg">
          • You may not use, reproduce, or distribute any content from our
          website without our permission.
        </Text>

        <Heading as="h2" size="md" mt={6}>
          4. Limitations of Liability
        </Heading>
        <Text fontSize="lg">
          • Hyqueue is not responsible for any damages or losses arising
          from the use of our website or services.
        </Text>
        <Text fontSize="lg">
          • Our website is provided &quot;as is&quot; and we do not guarantee
          that it will be error-free or uninterrupted.
        </Text>

        <Heading as="h2" size="md" mt={6}>
          5. Changes to the Terms
        </Heading>
        <Text fontSize="lg">
          • We may update these Terms from time to time. Any changes will be
          posted on this page with an updated effective date.
        </Text>
        <Text fontSize="lg">
          • By continuing to use our services, you agree to the updated Terms.
        </Text>

        <Heading as="h2" size="md" mt={6}>
          6. Governing Law
        </Heading>
        <Text fontSize="lg">
          • These Terms are governed by the laws of [Insert Jurisdiction]. Any
          disputes will be resolved in the courts located in [Insert
          Jurisdiction].
        </Text>

        <Heading as="h2" size="md" mt={6}>
          7. Contact Us
        </Heading>
        <Text fontSize="lg">
          If you have any questions or concerns about these Terms of Service,
          please contact us at [Insert Contact Information].
        </Text>
      </VStack>
    </Box>
  );
};

export default TermsOfService;
