import { Flex, Heading } from "@chakra-ui/react";

interface Props {
  title: string;
}

export const Hero = ({ title }: Props) => (
  <Flex justifyContent="center" alignItems="center" height="100vh">
    <Heading fontSize="10vw">{title}</Heading>
  </Flex>
);

Hero.defaultProps = {
  title: "with-chakra-ui",
};
