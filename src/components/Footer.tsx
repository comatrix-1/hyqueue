import { Box, Flex, Link, Text } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";

export const Footer = (props: any) => {
  const { t, lang } = useTranslation("common");

  return (
    <Flex
      bgColor="primary.900"
      w="100%"
      as="footer"
      justifyContent="center"
      {...props}
    >
      <Box
        color="white"
        w="360px"
        px={4}
        py={8}
        textAlign="center"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Text color="gray.400" textStyle="body2" mb={4}>
          &copy; Copyright 2024. {t("built-by")}{" "}
          <Link href="https://github.com/comatrix-1" color="white">
            Comatrix
          </Link>
        </Text>
      </Box>
    </Flex>
  );
};
